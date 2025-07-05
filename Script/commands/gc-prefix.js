module.exports.config = {
    name: "بريفكس",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "jeka",
    description: "يرسل رمز البوت بالنسبة للمستخدمين الجدد",
    commandCategory: "الــــجـــروب",
    usages: "prefix",
    cooldowns: 1,
};

module.exports.handleEvent = function ({ api, event, client, __GLOBAL }) {
    var { threadID, messageID, senderID } = event;

    api.getUserInfo(senderID, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        if (
            event.body.indexOf("prefix") === 0 ||
            event.body.indexOf("رمز") === 0 ||
            event.body.indexOf("بادئة") === 0 ||
            event.body.indexOf("الرمز") === 0
        ) {
            // Send text message with prefix information
            const msg = `مرحبا! هاهي ذي البادئة الخاصة بي ⬅️ » ${global.config.PREFIX} «\nارسل
➥ ${global.config.PREFIX}اوامر من ثم [رد على الفئة] -> لكي ترى الاوامر 
`;

            
                        // Share contact information
                        api.shareContact(msg, api.getCurrentUserID(), threadID);
                        // React with a checkmark to indicate success
                        api.setMessageReaction("⁉️", messageID, (err) => {}, true);
                    }
                }
            );
        }

module.exports.run = function ({ api, event, client, __GLOBAL }) {};