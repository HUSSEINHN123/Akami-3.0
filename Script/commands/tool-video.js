const axios = require("axios");
const { createReadStream, createWriteStream, unlinkSync, statSync } = require("fs-extra");

module.exports.config = {
  name: "يوتيب",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "CatalizCS mod video by Đăng",
  description: "تشغيل فيديوهات من اليوتيوب",
  usePrefix: true,
  commandCategory: "قــســم الــادوات",
  usages: "يوتيب [إسم الفيديو]",
  cooldowns: 10
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  try {
    const selectedVideo = handleReply.searchResults[event.body - 1];
    const videoUrl = selectedVideo.videoUrl;
    const title = selectedVideo.title;

    api.sendMessage(`⏱️ | جاري تنزيل الفيديو: ${title}\nهذا قد يستغرق بعض الوقت، يرجى الانتظار.`, event.threadID, async (err, info) => {
      setTimeout(() => api.unsendMessage(info.messageID),.20000);
    });

    // Fetch the direct download link from the external API
    const response = await axios.get(`https://c-v1.onrender.com/downloader?url=${encodeURIComponent(videoUrl)}`);
    const downloadLink = response.data.media.url;

    const filePath = `${__dirname}/cache/video.mp4`;

    // Download the video using the direct link
    const videoStream = await axios({
      url: downloadLink,
      method: "GET",
      responseType: "stream"
    });

    videoStream.data
      .pipe(createWriteStream(filePath))
      .on("close", () => {
        if (statSync(filePath).size > 26214400) {
          api.sendMessage("⚠️ | تعذر إرسال الفيديو لأن حجمه أكبر من 25 ميغابايت.", event.threadID, () => unlinkSync(filePath));
        } else {
          api.sendMessage({ body: title, attachment: createReadStream(filePath) }, event.threadID, () => unlinkSync(filePath));
        }
      })
      .on("error", (error) => api.sendMessage(`⛔ | حدث خطأ أثناء التنزيل: ${error.message}`, event.threadID));
  } catch {
    api.sendMessage("⛔ | تعذر معالجة طلبك!", event.threadID);
  }
};

module.exports.run = async function({ api, event, args }) {
  if (args.length === 0) return api.sendMessage("⚠️ | لا يمكن ترك البحث فارغًا!", event.threadID, event.messageID);

  const query = args.join(" ");
  const apiUrl = `https://c-v1.onrender.com/yt/s?query=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(apiUrl);
    const searchResults = response.data.slice(0, 4); // تحديد عدد النتائج إلى 4 كحد أقصى

    if (!searchResults.length) {
      return api.sendMessage("❌ | لم يتم العثور على نتائج.", event.threadID, event.messageID);
    }

    let message = "🎼 نتائج البحث:\n\n";
    const attachments = [];
    searchResults.forEach((result, index) => {
      message += `${index + 1}. ${result.title}\nالقناة: ${result.channelTitle}\n-----------------------\n`;
      attachments.push(axios.get(result.thumbnail, { responseType: 'arraybuffer' }).then(buffer => ({
        path: `${__dirname}/cache/thumb_${index + 1}.png`,
        buffer: Buffer.from(buffer.data, 'utf-8')
      })));
    });

    const attachmentFiles = await Promise.all(attachments);
    attachmentFiles.forEach((file, index) => {
      require("fs-extra").writeFileSync(file.path, file.buffer);
    });

    api.sendMessage(
      {
        body: `${message}\nأرجوك قم بالرد على هذه الرسالة برقم الفيديو لتنزيله.`,
        attachment: attachmentFiles.map(file => createReadStream(file.path))
      },
      event.threadID,
      (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          searchResults
        });
        attachmentFiles.forEach(file => unlinkSync(file.path));
      },
      event.messageID
    );
  } catch (error) {
    api.sendMessage(`⛔ | حدث خطأ أثناء البحث: ${error.message}`, event.threadID, event.messageID);
  }
};