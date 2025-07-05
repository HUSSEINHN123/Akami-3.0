const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "تيك",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Kim Joseph DG Bien - Modified by Houssin",
  description: "ابحث عن فيديوهات التيك توك",
  commandCategory: "وسائط",
  usage: "[تيك <كلمة البحث>]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  try {
    const query = args.join(" ");
    if (!query) {
      return api.sendMessage("📋 | الإستخدام: تيك <كلمة البحث>", event.threadID, event.messageID);
    }

    const loadingMessage = await new Promise((resolve) => {
      api.sendMessage("⏱️ | جاري البحث، يرجى الإنتظار...", event.threadID, (err, info) => {
        if (info) resolve(info.messageID);
      });
    });

    const res = await axios.get(`https://hiroshi-api.onrender.com/tiktok/search?q=${encodeURIComponent(query)}`);
    const videos = res.data?.data?.videos;

    if (!videos || videos.length === 0) {
      api.setMessageReaction("❌", loadingMessage, () => {}, true);
      return api.sendMessage("❌ | لم يتم العثور على أي فيديو.", event.threadID, loadingMessage);
    }

    const video = videos[0];
    const videoUrl = video.play;
    const message = 
`✅ | نتيجة البحث:

👤 | الاسم: ${video.author.nickname}
🆔 | المعرف: ${video.author.unique_id}

📄 | العنوان: ${video.title}
💖 | إعجابات: ${video.digg_count}
🗨️ | تعليقات: ${video.comment_count}
🔁 | مشاركات: ${video.share_count}
▶️ | مشاهدات: ${video.play_count}
`;

    const filePath = path.join(__dirname, "cache", `tiktok_${Date.now()}.mp4`);
    const writer = fs.createWriteStream(filePath);

    const videoStream = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream",
    });

    videoStream.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: message,
        attachment: fs.createReadStream(filePath),
      }, event.threadID, () => {
        fs.unlinkSync(filePath);
        api.setMessageReaction("✅", loadingMessage, () => {}, true);
        api.unsendMessage(loadingMessage);
      });
    });

  } catch (err) {
    console.error(err);
    api.sendMessage("حدث خطأ أثناء البحث أو التحميل. حاول مجددًا لاحقًا.", event.threadID, event.messageID);
  }
};
