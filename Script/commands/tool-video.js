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
    const videoUrl = selectedVideo.url;
    const title = selectedVideo.title;

    api.sendMessage(`⏱️ | جاري تنزيل الفيديو: ${title}\nقد يستغرق هذا بعض الوقت، يرجى الانتظار...`, event.threadID, async (err, info) => {
      setTimeout(() => api.unsendMessage(info.messageID), 20000);
    });

    // رابط التنزيل الجديد
    const res = await axios.get(`https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(videoUrl)}`);
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
    api.sendMessage("⛔ | حدث خطأ أثناء تنفيذ الطلب!", event.threadID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  if (!args[0]) return api.sendMessage("⚠️ | يرجى إدخال اسم الفيديو للبحث.", event.threadID, event.messageID);

  const query = args.join(" ");
  const apiUrl = `https://rapido.zetsu.xyz/api/ytsearch?query=${encodeURIComponent(query)}`;

  try {
    const res = await axios.get(apiUrl);
    const results = res.data.data;

    if (!results.length) return api.sendMessage("❌ | لم يتم العثور على أي نتائج.", event.threadID, event.messageID);

    const searchResults = results.slice(0, 4); // نأخذ فقط 4 نتائج

    let message = "🎥 نتائج البحث:\n\n";
    const attachments = [];

    for (let i = 0; i < searchResults.length; i++) {
      const result = searchResults[i];
      message += `${i + 1}. ${result.title}\nالمدة: ${result.duration}\nالمشاهدات: ${result.views}\n--------------------------\n`;

      const imageBuffer = await axios.get(result.imgSrc, { responseType: 'arraybuffer' });
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

        // حذف الصور المؤقتة
        attachments.forEach((file, idx) => {
          try {
            unlinkSync(`${__dirname}/cache/thumb_${idx + 1}.jpg`);
          } catch { }
        });
      },
      event.messageID
    );

  } catch (err) {
    api.sendMessage(`⛔ | حدث خطأ أثناء البحث: ${err.message}`, event.threadID, event.messageID);
  }
};
