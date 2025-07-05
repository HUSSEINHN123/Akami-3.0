const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "صور",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "عمر",
    description: "صور من بنترست",
    commandCategory: "قــســم الــادوات",
    usePrefix: false,
    usages: "[نص]",
    cooldowns: 3,
};

async function translateToEnglish(text) {
    try {
        const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`);
        return translationResponse?.data?.[0]?.[0]?.[0];
    } catch (error) {
        console.error("Error during translation:", error);
        return text;  // Return the original text if translation fails
    }
}

module.exports.run = async function({ api, event, args }) {

    api.setMessageReaction("⏱️", event.messageID, (err) => {}, true);

    if (args.length === 0) {
        // Prompt the user to enter a search term if none is provided
        return api.sendMessage("[❗] أدخل كلمة البحث المراد البحث عنه في بنترست.", event.threadID, event.messageID);
    }

    let keySearch = args.join(" ");

    try {
        // Translate the search term to English if it's in Arabic
        keySearch = await translateToEnglish(keySearch);

        const pinterestResponse = await axios.get(`https://hiroshi-api.onrender.com/image/pinterest?search=${encodeURIComponent(keySearch)}`);
        const data = pinterestResponse.data.data;

        // Limit to 10 images, even if more are returned
        const imagesToDownload = data.slice(0, 10);

        const imgData = [];
        for (let i = 0; i < imagesToDownload.length; i++) {
            const path = __dirname + `/cache/jj${i + 1}.jpg`;
            const imageResponse = await axios.get(imagesToDownload[i], { responseType: 'arraybuffer' });
            fs.writeFileSync(path, Buffer.from(imageResponse.data, 'binary'));
            imgData.push(fs.createReadStream(path));
        }

        api.setMessageReaction("✅", event.messageID, (err) => {}, true);

        api.sendMessage({
            attachment: imgData,
            body: '[⚜️] هذه عمليات البحث ذات الصلة'
        }, event.threadID, (err, info) => {
            if (err) console.error(err);
            // Delete images after sending the message
            for (let i = 0; i < imagesToDownload.length; i++) {
                fs.unlinkSync(__dirname + `/cache/jj${i + 1}.jpg`);
            }
        });
    } catch (error) {
        console.error("Error fetching images:", error);
        api.sendMessage("[❌] حدث خطأ أثناء جلب الصور. يرجى المحاولة مرة أخرى.", event.threadID);
    }
};