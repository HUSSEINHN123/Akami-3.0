module.exports.config = {
  name: "دمج",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Deku",
  description: "قم بدمج إثنان من الإيموجي",
  usePrefix: true,
  commandCategory: "خدمات",
  usages: "[إيموجي1 | إيموجي2]",
  cooldowns: 0,
  dependencies: {
      "fs-extra": "",
      "axios": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const fs = require("fs-extra");
  const axios = require("axios");
  const { threadID, messageID } = event;

  try {
      if (!args[0]) {
          return api.sendMessage(`❌ |صيغة خاطئة!\nإستخدم: ${global.config.PREFIX}${this.config.name} ${this.config.usages}`, threadID, messageID);
      }

      const content = args.join(" ").split("|").map(item => item.trim());
      const emoji1 = encodeURIComponent(content[0]);
      const emoji2 = encodeURIComponent(content[1]);

      // Fetch the merged emoji image
      const response = await axios.get(`https://smfahim.xyz/emojimix?one=${emoji1}&two=${emoji2}`);
      const imageUrl = response.data.results[0].media_formats.png_transparent.url;

      const filePath = __dirname + "/cache/merged_emoji.png";
      const writer = fs.createWriteStream(filePath);

      const imageResponse = await axios({
          method: 'get',
          url: imageUrl,
          responseType: 'stream'
      });

      imageResponse.data.pipe(writer);

      writer.on('finish', () => {
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
  
          api.sendMessage(
              { body: `✅ |تــم الدمـج بـنـجـاح`, attachment: fs.createReadStream(filePath) },
              threadID,
              () => fs.unlinkSync(filePath),
              messageID
          );
      });

  } catch (error) {
      console.error("Error:", error);
      api.sendMessage("❌ |حدث خطأ أثناء دمج الإيموجيات.", threadID, messageID);
  }
};