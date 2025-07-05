module.exports.config = {
  name: "رست",
  version: "2.0.2",
  hasPermssion: 3,
  Rent: 2,
  credits: "Mirai Team mod by Jukie",
  description: "إعادا تشغيل نظام البوت",
  commandCategory: "الـــمــطـــور",
  usages: "restart",
  cooldowns: 5,
  dependencies: {}
}

module.exports.run = async function({ api, args, event }) {
  if (args.length == 0) {
    api.sendMessage(`⏱️ | جارٍ إعادة تشغيل البوت 
    ...`, event.threadID, async () => {
      await new Promise(resolve => setTimeout(resolve, 10000));
      api.sendMessage(`✅ |تـم إعـادة تـشـغـيـل الــبـوت بـنـجاح`, event.threadID);
      process.exit(1);
    })ـ;
  }
}
