module.exports.config = {
	name: "اسئلني",
	version: "1.1.2",
	hasPermssion: 0,
  credits: "S H A D O W",
	description: "البوت يسئلك اسئله عشوائيه",
  commandCategory: "الــتــرفــيــه والــالــعــاب",
	usages: " ",
	cooldowns: 1,
};

module.exports.handleEvent = function ({ api, event }) {
	const { commands } = global.client;
	
	if (!event.body) return;

	const { threadID, messageID, body } = event;

	if (body.indexOf("askme") != 0) return;

	const splitBody = body.slice(body.indexOf("askme")).trim().split(/\s+/);


	if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;

	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const command = commands.get(splitBody[1].toLowerCase());

	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	return api.sendMessage(`⚔️ ${command.config.name} ⚔️\n${command.config.description}\n\n❯ Cách sử dụng: ${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}\n❯ Thuộc nhóm: ${command.config.commandCategory}\n❯ Thời gian chờ: ${command.config.cooldowns} giây(s)\n❯ Quyền hạn: ${((command.config.hasPermssion == 0) ? "Người dùng" : (command.config.hasPermssion == 1) ? "Quản trị viên" : "Người vận hành bot" )}\n❯ Prefix: ${prefix}\n\n» Module code by ${command.config.credits} «`, threadID, messageID);
};

module.exports.run = async function({ api, args, Users, event, Threads, utils, client }) {
const { commands } = global.client;
const { threadID, messageID } = event;
const command = commands.get((args[0] || "").toLowerCase());
const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
if (!command) {
const command = commands.values();
var tl = ["إذا كان لديك اهتمام العالم لمدة 30 ثانية ، ماذا تقول؟","إذا كان عليك العمل ولكنك لا تحتاج إلى المال ، فماذا تختار أن تفعل؟","إذا كنت في المنزل بعد ظهر يوم الخميس الممطر ، ما هو الفيلم الذي ترغب في مشاهدته على شاشة التلفزيون؟","إذا تمكنت من حذف شيء واحد ، فماذا سيكون؟","ماذا سيكون أفضل شيء عن عدم الشعور بالرائحة؟","هل ستترك بلدتك إلى الأبد أم ستبقى في بلدتك إلى الأبد؟","عند التمرير عبر وسائل التواصل الاجتماعي ، هل تفضل المشاركات من المشاهير أو من أفضل أصدقائك؟","هل هناك تطبيق تكرهه ولكنك تستخدمه على أي حال؟","إذا استطعت أن تتكلم كلمة واحدة فقط اليوم ، فماذا ستقول؟","ما هو أغبى شيء قمت به لأن شخصا ما تحداك؟","ما هو أغبى شيء قمت به بمحض إرادتك؟","إذا أمكنك حبس شخص واحد في مؤسسة عقلية ، فمن سيكون؟","أي جزء من الجسم يمكن أن يستخدم القليل من الميكب؟","أي جزء من وجه الإنسان هو المفضل لديك؟","هل ترقص بجنون عندما لا أحد معك؟","إذا تمكنت من اختيار أي شخصية تاريخية ، فمن تختار؟","ما هو أعنف شيء قمت به على الإطلاق؟","هل تفضل الاحتفاظ بجدول نومك الحالي أو سباتك لمدة 3 أشهر ويكون لديك 9 أشهر من التأهب لمدة 24/7 دون تعب؟","ما هو الشيء الذي حاولت تجربته ، والذي لن تجربه أبدًا ، مرة أخرى؟","ما هو عيد الميلاد / عطلة مثالية بالنسبة لك؟","ما هو أصعب تحد في حياتك حتى الآن؟","عندما تنهار الأمور ، هل تفضل إصلاحها أو استبدالها؟","إذا كان طعامك سيئًا في أحد المطاعم ، فهل تقول شيئًا؟","كم مرة تنظر إلى هاتفك كل يوم؟","هل بكيت في فيلم؟","مع من في ماضيك ، هل تتمنى بالفعل أن تكون على اتصال به؟","إذا كان لديك كل المال في العالم ، فما هو أول شيء تشتريه؟","ما أكثر ما تتطلع إليه في السنوات العشر القادمة؟","هل تريد أن تبتعد عن التكنولوجيا؟","ما الذي يجعلك تبتسم علنا؟","إذا كنت تستطيع رسم صورة لأي مشهد شاهدته من قبل ، فماذا ترسم؟","عندما تبلغ من العمر 90 عامًا ، ما هو الشيء الأكثر أهمية بالنسبة لك؟","أي جزء من جسم الإنسان هو المفضل لديك؟"];
var tle = tl[Math.floor(Math.random() * tl.length)];
var lon = ` ${tle}.`;
return api.sendMessage(lon, event.threadID, event.messageID);
}
const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
return api.sendMessage(`⚔️ ${command.config.name} ⚔️\n${command.config.description}\n\n❯ Cách sử dụng: ${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}\n❯ Thuộc nhóm: ${command.config.commandCategory}\n❯ Thời gian chờ: ${command.config.cooldowns} giây(s)\n❯ Quyền hạn: ${((command.config.hasPermssion == 0) ? "Người dùng" : (command.config.hasPermssion == 1) ? "Quản trị viên" : "Người vận hành bot" )}\n❯ Prefix: ${prefix}\n\n» Module code by ${command.config.credits} «`, threadID, messageID);
};