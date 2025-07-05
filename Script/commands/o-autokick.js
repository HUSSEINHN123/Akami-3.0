const path = require("path");
const fs = require("fs");
const e = "👍";
const dataFilePath = path.join(__dirname, "cache/data", "autokick.json");

// التحقق من وجود الملف، وإذا لم يكن موجودًا يتم إنشاؤه
if (!fs.existsSync(dataFilePath)) {
  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  fs.writeFileSync(dataFilePath, '{}');
}

// وظيفة لكتابة البيانات إلى الملف
function writeDataToFile(jsonData) {
  fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, "\t"), (err) => {
    if (err) console.error(err);
  });
}

let usersSpam = {};

module.exports = {
  config: {
    name: "طرد-تلقائي",
    version: "1.0.0",
    credits: "NTKhang || Niio-team (Vtuan)",
    hasPermssion: 1,
    description: "تحذير الأعضاء المخالفين للألفاظ",
    usage: "طرد-تلقائي on/off add/del list auto on/off",
    commandCategory: "الـــمــطـــور",
    cooldowns: 0
  },

  run: async ({ api, event, args }) => {
    const threadID = event.threadID;
    const jsonData = require("./cache/data/autokick.json");

    // إعداد بيانات المجموعة إذا لم تكن موجودة
    if (!jsonData.hasOwnProperty(event.threadID)) {
      jsonData[event.threadID] = {};
      fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, "\t"));
    }

    const threadData = jsonData[threadID] || {};

    if (!threadData.autoKick) {
      threadData.autoKick = {
        words: [],
        reactions: [],
        enables: true,
        autoMode: false,
        autoOFF: false,
        autokickSpam: false
      };

      await new Promise((resolve, reject) => {
        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, "\t"), (err) => {
          if (err) reject(err);
          else {
            console.log("تمت كتابة البيانات إلى ملف JSON بنجاح!");
            resolve();
          }
        });
      });
    }

    switch (args[0]) {
      case "on":
        threadData.autoKick.enables = true;
        threadData.autoKick.autoOFF = false;
        threadData.autoKick.autoMode = false;
        writeDataToFile(jsonData);
        return api.sendMessage("✅ تم تفعيل الطرد التلقائي", event.threadID, event.messageID);

      case "off":
        threadData.autoKick.autoMode = false;
        threadData.autoKick.enables = false;
        threadData.autoKick.autoOFF = false;
        writeDataToFile(jsonData);
        return api.sendMessage("✅ تم تعطيل الطرد التلقائي", event.threadID, event.messageID);

      case "auto":
        if (!args[1]) {
          return api.sendMessage("⚠️ الرجاء إدخال 'تشغيل' للتشغيل أو 'إيقاف' لإيقاف تشغيل الوضع التلقائي", event.threadID, event.messageID);
        }
        const lowerMode = args[1].toLowerCase();
        if (lowerMode === "on") {
          threadData.autoKick.autoOFF = false;
          threadData.autoKick.autoMode = true;
          threadData.autoKick.enables = false;
          writeDataToFile(jsonData);
          return api.sendMessage("✅ تم تفعيل الوضع التلقائي", event.threadID, event.messageID);
        } else if (lowerMode === "off") {
          threadData.autoKick.autoOFF = true;
          threadData.autoKick.autoMode = false;
          threadData.autoKick.enables = false;
          writeDataToFile(jsonData);
          return api.sendMessage("✅ تم تعطيل الوضع التلقائي", event.threadID, event.messageID);
        } else {
          return api.sendMessage("⚠️ الرجاء إدخال 'تشغيل' أو 'إيقاف' لتغيير وضع الطرد التلقائي", event.threadID, event.messageID);
        }

      case "add":
        if (!args[1]) {
          return api.sendMessage("⚠️ الرجاء إدخال الكلمة المراد حظرها بعد الأمر 'add'", event.threadID, event.messageID);
        }
        const wordsToAdd = args.slice(1).join(" ").split(",").map(word => word.trim());
        threadData.autoKick.words.push(...wordsToAdd);
        writeDataToFile(jsonData);
        const addedWords = wordsToAdd.join(', ');
        return api.sendMessage(`✅ | تمت إضافة الكلمة '${addedWords}' إلى قائمة الكلمات المحظورة`, event.threadID, event.messageID);

      case "del":
        if (!args[1]) {
          return api.sendMessage("⚠️ | الرجاء إدخال الكلمة المراد حذفها بعد الأمر 'del'", event.threadID, event.messageID);
        }
        const wordToDelete = args.slice(1).join(" ");
        const index = threadData.autoKick.words.indexOf(wordToDelete);
        if (index !== -1) {
          threadData.autoKick.words.splice(index, 1);
          writeDataToFile(jsonData);
          return api.sendMessage(`✅ | تم حذف الكلمة '${wordToDelete}' من قائمة الكلمات المحظورة`, event.threadID, event.messageID);
        } else {
          return api.sendMessage(`⚠️ | الكلمة '${wordToDelete}' غير موجودة في قائمة الحظر`, event.threadID, event.messageID);
        }

      case "list":
        let cc = [];
        let dd = [];
        threadData.autoKick.words.forEach((word, index) => {
          const b = `${word}`;
          const w = `${index + 1}. ${b}`;
          dd.push(b);
          cc.push(w);
        });
        const messageContent = `📝 قائمة الكلمات المحظورة :\n${cc.join("\n")}\n\n📌 الرد على هذه الرسالة بإدخال del + الرقم لحذف كلمة من الحظر`;
        return api.sendMessage(messageContent, event.threadID, async (error, info) => {
          if (error) {
            console.error(error);
          } else {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              dd
            });
          }
        });

      case "spam":
        if (!args[1] || (args[1] !== "on" && args[1] !== "off")) {
          return api.sendMessage("⚠️ الرجاء إدخال 'on' لتفعيل أو 'off' لتعطيل خاصية مكافحة الرسائل المتكررة", event.threadID, event.messageID);
        }
        const spamMode = args[1].toLowerCase();
        threadData.autoKick.autokickSpam = spamMode === "on" ? true : false;
        writeDataToFile(jsonData);
        const statusMessage = spamMode === "on" ? "تم التفعيل" : "تم التعطيل";
        return api.sendMessage(`✅ خاصية مكافحة الرسائل المتكررة ${statusMessage}`, event.threadID, event.messageID);

      default:
        return api.sendMessage(`
[ طرد الأعضاء تلقائيًا ]

${global.config.PREFIX}طرد-تلقائي add + الكلمة المراد حظرها
${global.config.PREFIX}طرد-تلقائي  del + الكلمة المراد حذفها من الحظر
${global.config.PREFIX}طرد-تلقائي  list: عرض قائمة الكلمات المحظورة
${global.config.PREFIX}طرد-تلقائي  on/off: تفعيل/تعطيل الطرد التلقائي
${global.config.PREFIX}طرد-تلقائي  auto on/off: تفعيل/تعطيل الطرد التلقائي
${global.config.PREFIX}طرد-تلقائي  spam on/off: تفعيل/تعطيل الطرد التلقائي عند تكرار الرسائل`, event.threadID, event.messageID);
    }
  },

  handleReply: async ({ api, handleReply, event }) => {
    const { threadID, senderID, body, messageID } = event;
    const { author, dd } = handleReply;
    if (senderID != author) return;

    const args = body.split(' ');
    if (args[0].toLowerCase() === 'del') {
      const fileIndices = args.slice(1).flatMap(index => {
        if (/^\d+$/.test(index)) {
          return parseInt(index);
        } else {
          return null;
        }
      }).filter(index => index !== null);

      let deletedWords = [];

      for (const index of fileIndices) {
        if (!isNaN(index) && index > 0 && index <= dd.length) {
          const wordToDelete = dd[index - 1];
          deletedWords.push(wordToDelete);

          const jsonData = require("./data/autokick.json");
          const autoKickData = jsonData[threadID] || { autoKick: { words: [] } };
          const wordIndex = autoKickData.autoKick.words.indexOf(wordToDelete);

          if (wordIndex !== -1) {
            autoKickData.autoKick.words.splice(wordIndex, 1);
          }
          await writeDataToFile(jsonData);
        }
      }

      if (deletedWords.length > 0) {
        await api.sendMessage(`✅ | تم حذف ${deletedWords.length} كلمة من قائمة الكلمات المحظورة :\n${deletedWords.join('\n')}`, threadID, messageID);
      }
} else {
        await api.sendMessage("⚠️ لم يتم العثور على الكلمات المحددة في قائمة الحظر", threadID, messageID);
      }

      // حذف الرسالة الأصلية بعد إتمام عملية الحذف
      return api.unsendMessage(handleReply.messageID);
    }
  },

  // وظيفة لمراقبة الرسائل وتحذير الأعضاء الذين يستخدمون كلمات محظورة
  messageReply: async ({ api, event }) => {
    const { threadID, senderID, messageID, body } = event;
    const jsonData = require("./cache/data/autokick.json");
    const threadData = jsonData[threadID];

    // التحقق مما إذا كانت خاصية الطرد التلقائي مفعلة في هذه المجموعة
    if (!threadData || !threadData.autoKick || !threadData.autoKick.enables) return;

    // التحقق من الكلمات المحظورة
    const forbiddenWords = threadData.autoKick.words || [];
    const matchedWord = forbiddenWords.find(word => body.includes(word));

    if (matchedWord) {
      api.sendMessage(`⚠️ تحذير! تم اكتشاف كلمة محظورة: "${matchedWord}"\nيرجى الامتناع عن استخدام هذه الكلمة`, threadID, () => {
        // طرد العضو في حال تفعيل خاصية الطرد التلقائي
        if (threadData.autoKick.autoMode) {
          api.removeUserFromGroup(senderID, threadID, (err) => {
            if (err) {
              api.sendMessage("❌ لم أتمكن من طرد العضو، تحقق من الصلاحيات", threadID);
            } else {
              api.sendMessage(`✅ تم طرد العضو بسبب استخدام كلمة محظورة: "${matchedWord}"`, threadID);
            }
          });
        }
      });
    }

    // التحقق من الرسائل المتكررة 
    if (threadData.autoKick.autokickSpam) {
      if (!usersSpam[senderID]) {
        usersSpam[senderID] = 1;
      } else {
        usersSpam[senderID]++;
      }

      if (usersSpam[senderID] >= 5) { // إذا تكررت الرسائل أكثر من 5 مرات
        api.sendMessage("⚠️ | تحذير! يرجى التوقف عن إرسال الرسائل بكثرة عذا يعتبر سبام وهو مننوع في هذه المجموعة.", threadID);
        usersSpam[senderID] = 0;

        // طرد العضو في حال تفعيل الطرد التلقائي عند الرسائل المتكررة
        if (threadData.autoKick.autoMode) {
          api.removeUserFromGroup(senderID, threadID, (err) => {
            if (err) {
              api.sendMessage("❌ | لم أتمكن من طرد العضو، تحقق من الصلاحيات", threadID);
            } else {
              api.sendMessage("✅ | تم طرد العضو بسبب افتعال السبام", threadID);
            }
          });
        }
      }

      // إعادة تعيين عداد الرسائل بعد فترة زمنية معينة
      setTimeout(() => {
        usersSpam[senderID] = 0;
      }, 60000); // 60 ثانية
    }
  }
};
