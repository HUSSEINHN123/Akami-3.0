module.exports.config = {
	name: "تيد",
	version: "1.0.0", 
	hasPermssion: 0,
  credits: "S H A D O W",
	description: "ايدي الكروب", 
  commandCategory: "الــــجـــروب", 
	usages: " ",
	cooldowns: 5, 
	dependencies: '',
};

module.exports.run = async function({ api, event }) {
  api.sendMessage(event.threadID, event.threadID);
};
