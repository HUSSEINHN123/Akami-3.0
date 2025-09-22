const axios = require("axios");
const { createReadStream, createWriteStream, unlinkSync, statSync, writeFileSync } = require("fs-extra");

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

module.exports.handleReply = async function ({ api, event, handleReply }) {
  try {
    const selectedVideo = handleReply.searchResults[event.body - 1];
    const videoId = selectedVideo.id.videoId;
    const title = selectedVideo.snippet.title;

    api.sendMessage(`⏱️ | جاري تنزيل الفيديو: ${title}\nقد يستغرق هذا بعض الوقت، يرجى الانتظار...`, event.threadID, async (err, info) => {
      setTimeout(() => api.unsendMessage(info.messageID), 20000);
    });

    // رابط التنزيل الجديد
    const res = await axios.get(`https://nayan-video-downloader.vercel.app/alldown?url=https://www.youtube.com/watch?v=${videoId}`);
    const downloadLink = res.data.data.high;

    const filePath = `${__dirname}/cache/video.mp4`;

    const videoStream = await axios({
      url: downloadLink,
      method: "GET",
      responseType: "stream"
    });

    videoStream.data
      .pipe(createWriteStream(filePath))
      .on("close", () => {
        if (statSync(filePath).size > 26214400) {
          api.sendMessage("⚠️ | تعذر إرسال الفيديو لأن حجمه يتجاوز 25 ميغابايت.", event.threadID, () => unlinkSync(filePath));
        } else {
          api.sendMessage({ body: title, attachment: createReadStream(filePath) }, event.threadID, () => unlinkSync(filePath));
        }
      })
      .on("error", error => {
        api.sendMessage(`⛔ | خطأ أثناء التنزيل: ${error.message}`, event.threadID);
      });

  } catch (e) {
    console.error(e);
    api.sendMessage("⛔ | حدث خطأ أثناء تنفيذ الطلب!", event.threadID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  if (!args[0]) return api.sendMessage("⚠️ | يرجى إدخال اسم الفيديو للبحث.", event.threadID, event.messageID);

  const query = args.join(" ");
  const apiKey = "AIzaSyC_CVzKGFtLAqxNdAZ_EyLbL0VRGJ-FaMU"; // مفتاح API
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&type=video&maxResults=6`;

  try {
    const res = await axios.get(apiUrl);
    const results = res.data.items;

    if (!results.length) return api.sendMessage("❌ | لم يتم العثور على أي نتائج.", event.threadID, event.messageID);

    const searchResults = results.slice(0, 4); // نأخذ فقط 4 نتائج

    let message = "🎥 نتائج البحث:\n\n";
    const attachments = [];

    for (let i = 0; i < searchResults.length; i++) {
      const result = searchResults[i];
      const title = result.snippet.title;
      const channelTitle = result.snippet.channelTitle;
      
      message += `${i + 1}. ${title}\nالقناة: ${channelTitle}\n--------------------------\n`;

      const imageUrl = result.snippet.thumbnails.high.url;
      const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imagePath = `${__dirname}/cache/thumb_${i + 1}.jpg`;
      writeFileSync(imagePath, Buffer.from(imageBuffer.data, 'utf-8'));
      attachments.push(createReadStream(imagePath));
    }

    api.sendMessage(
      {
        body: message + "\n👆 قم بالرد برقم الفيديو الذي تريد تحميله.",
        attachment: attachments
      },
      event.threadID,
      (err, info) => {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          searchResults
        });

        // حذف الصور المؤقتة بعد 10 ثواني
        setTimeout(() => {
          attachments.forEach((file, idx) => {
            try {
              unlinkSync(`${__dirname}/cache/thumb_${idx + 1}.jpg`);
            } catch { }
          });
        }, 10000);
      },
      event.messageID
    );

  } catch (err) {
    console.error(err);
    api.sendMessage(`⛔ | حدث خطأ أثناء البحث: ${err.message}`, event.threadID, event.messageID);
  }
};
