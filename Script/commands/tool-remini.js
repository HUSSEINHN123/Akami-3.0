module.exports.config = {
  name: "جودة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "",
  description: "",
  commandCategory:"قــســم الــادوات",
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
    api.sendMessage("", event.threadID, event.messageID);
    
    // رفع جودة الصورة باستخدام الرابط الجديد
    const response = await axios.get(`https://smfahim.xyz/4k?url=${encodeURIComponent(linkUp)}`);
    const upgradedImageUrl = response.data.image;

    if (!upgradedImageUrl) {
      return api.sendMessage("لم أتمكن من تحسين جودة الصورة. تأكد من صحة الرابط وحاول مجددًا.", event.threadID, event.messageID);
    }

    // تحميل الصورة المحسنة
    const imageResponse = await axios.get(upgradedImageUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(__dirname + `/cache/netanh.png`, Buffer.from(imageResponse.data, "binary"));
    
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    
    return api.sendMessage({
      body: `✅ | تـم رفـع الـجـودة بـنـجـاح`,
      attachment: fs.createReadStream(__dirname + `/cache/netanh.png`)
    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/netanh.png`), event.messageID);
    
  } catch (e) {
    console.error(e);
    return api.sendMessage("حدث خطأ أثناء معالجة الصورة. حاول مرة أخرى لاحقًا.", event.threadID, event.messageID);
  }
};
