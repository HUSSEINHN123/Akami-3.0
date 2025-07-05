module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "S H A D O W + معدل بواسطة حُسين",
  description: "Notify when someone leaves or gets removed",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const { threadID } = event;

  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  const path = join(__dirname, "cache", "leaveGif");
  const gifPath = join(path, `bye5.jpg`);

  if (!existsSync(path)) mkdirSync(path, { recursive: true });

  // تحديد السبب
  const isSelfLeave = (event.author == event.logMessageData.leftParticipantFbId);
  const type = isSelfLeave
    ? "👋 غادر المجموعة بمحض إرادته."
    : "❌ تم طرده من المجموعة.";

  // الرسالة الافتراضية أو المخصصة
  let msg;
  if (typeof data.customLeave == "undefined") {
    msg = `📤 تم الخروج من المجموعة\n👤 الاسم: ${name}\n📌 السبب: ${type}`;
  } else {
    msg = data.customLeave
      .replace(/\{name}/g, name)
      .replace(/\{type}/g, type);
  }

  // تجهيز الرسالة مع صورة أو بدون
  const formPush = existsSync(gifPath)
    ? { body: msg, attachment: createReadStream(gifPath) }
    : { body: msg };

  return api.sendMessage(formPush, threadID);
};
