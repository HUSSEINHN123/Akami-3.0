module.exports.config = {
  name: "جودة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "",
  description: "",
  commandCategory: "قــســم الــادوات",
  usages: "[رد على صورة]",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
  api.setMessageReaction("⏱️", event.messageID, (err) => {}, true);
  
  const fs = global.nodemodule["fs-extra"];
  const axios = require('axios').default;
  const isLink = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(args[0]);
  const linkUp = event.messageReply?.attachments[0]?.url || (isLink ? args[0] : '');
  
  if (!linkUp) return api.sendMessage('⚠️ | أرحوك رد على صورة', event.threadID, event.messageID);
  
  try {
    api.sendMessage("⏳ | جاري تحسين جودة الصورة، يرجى الانتظار...", event.threadID, event.messageID);
    
    // استخدام الرابط الجديد لتحسين جودة الصورة
    const response = await axios.get(`https://rapido.zetsu.xyz/api/upscale-image?imageUrl=${encodeURIComponent(linkUp)}`);
    
    // التحقق من بنية البيانات الجديدة
    if (!response.data || !response.data.resultImageUrl) {
      return api.sendMessage("❌ | لم أتمكن من تحسين جودة الصورة. تأكد من صحة الرابط وحاول مجددًا.", event.threadID, event.messageID);
    }

    const upgradedImageUrl = response.data.resultImageUrl;

    // تحميل الصورة المحسنة
    const imageResponse = await axios.get(upgradedImageUrl, { 
      responseType: "arraybuffer",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const filePath = __dirname + `/cache/upscaled_${Date.now()}.png`;
    fs.writeFileSync(filePath, Buffer.from(imageResponse.data, "binary"));
    
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    
    return api.sendMessage({
      body: `✅ | تـم رفـع الـجـودة بـنـجـاح`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }, event.messageID);
    
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ | حدث خطأ أثناء معالجة الصورة. حاول مرة أخرى لاحقًا.", event.threadID, event.messageID);
  }
};
