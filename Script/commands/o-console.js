module.exports.config = {
    name: " مطورمود",
    version: "1.0.0",
    hasPermssion: 2,
  credits: "S H A D O W",
    description: "تطوير البوت",
  commandCategory: "الـــمــطـــور",
    usages: "",
    cooldowns: 5
};

module.exports.handleEvent = async function ({
    api,
    event,
    args,
    Users,
    Threads
}) {
    const {
        configPath
    } = global.client;
    const {
        DeveloperMode
    } = global.config;
    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
    const modDev = config.DeveloperMode
     if ((this.config.credits) != "S H A D O W") { return }
    if (modDev == true) return
    else {
    const colorize = (...args) => ({
      black: `\x1b[30m${args.join(' ')}`,
      red: `\x1b[31m${args.join(' ')}`,
      green: `\x1b[32m${args.join(' ')}`,
      yellow: `\x1b[33m${args.join(' ')}`,
      blue: `\x1b[34m${args.join(' ')}`,
      magenta: `\x1b[35m${args.join(' ')}`,
      cyan: `\x1b[36m${args.join(' ')}`,
      white: `\x1b[37m${args.join(' ')}`
})
    const moment = require("moment-timezone");
    var timeNow = moment.tz("Asia/Manila").format("HH:mm:ss");
    const messData = event.body
    const nameUser = (typeof ((await Users.getData(event.senderID)).name) == "undefined") ? 0 : (await Users.getData(event.senderID)).name
    const botID = api.getCurrentUserID();
    if (event.senderID == botID) return 
    console.log(colorize('BOX:').white);
}
}
module.exports.run = async ({
    api,
    event,
    args
}) => {
    if ((this.config.credits) != "S H A D O W") { return api.sendMessage(`سرءه يحءييرررر`, event.threadID, event.messageID)}
    const {
        configPath
    } = global.client;
    const {
        DeveloperMode
    } = global.config;
    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
    const modDev = config.DeveloperMode

    if (modDev == true) {
        api.sendMessage(`وضع المطور ${modDev}\nفشل!!!`, event.threadID)
    } else
        return api.sendMessage(`وضع المطور: ${modDev}\nالتطوير يعمل الأن...`, event.threadID)
}