const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "تخيل",
  version: "1.0",
  hasPermssion: 0,
  credits: "عمر",
  description: "يولد صورة تخيلية بناءً على النص المدخل",
  commandCategory: "الــتــرفــيــه والــالــعــاب",
  usages: "اكتب نص التخيل",
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
  let { threadID, messageID } = event;
  let query = args.join(" ");
  
  if (!query) return api.sendMessage("الرجاء كتابة نص التخيل بعد الأمر.", threadID, messageID);

  api.setMessageReaction("⏱️", event.messageID, (err) => {}, true); // Add wait reaction

  try {
    // استخدام الرابط الجديد مباشرة مع النص العربي
    const response = await axios.get(`https://my-api-show.vercel.app/api/poli?prompt=${encodeURIComponent(query)}`);
    
    // التأكد من أن الاستجابة تحتوي على بيانات صحيحة
    if (!response.data || !response.data.imageUrls || response.data.imageUrls.length === 0) {
      return api.sendMessage("⚠️ | لم يتم العثور على صور للطلب المطلوب.", threadID, messageID);
    }
    
    const imageUrl = response.data.imageUrls[Math.floor(Math.random() * response.data.imageUrls.length)];

    let path = __dirname + `/cache/imagination.png`;
    
    // Download the image
    const image = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, Buffer.from(image, "utf-8"));

    // Send the image with a completion reaction
    api.sendMessage({
      body: "✿━━━━━━━━━━━━━━━✿
 \n[✅] | تـم تـولـيـد الـصـورة بـنـجـاح :\n✿━━━━━━━━━━━━━━━✿",
      attachment: fs.createReadStream(path)
    }, threadID, () => {
      fs.unlinkSync(path);
      api.setMessageReaction("✅", event.messageID, (err) => {}, true); // Success reaction
    }, messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("⚠️ | حدث خطأ أثناء معالجة الطلب. يرجى المحاولة لاحقاً.", threadID, messageID);
  }
};
