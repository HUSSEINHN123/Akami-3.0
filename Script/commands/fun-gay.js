module.exports.config = {
	name: "شذوذ",
	version: "1.0.1", 
	hasPermssion: 0,
  credits: "S H A D O W",
	description: "كم نسبه شذوذك",
  commandCategory: "الــتــرفــيــه والــالــعــاب",
	usages: "", 
	cooldowns: 0,
	dependencies: 
	{
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {

    var tle = Math.floor(Math.random() * 101);
    var tle1 = Math.floor(Math.random() * 101);
    var tle2 = Math.floor(Math.random() * 101);
    var name = (await Users.getData(event.senderID)).name
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
  var link = [
"https://i.kym-cdn.com/photos/images/original/001/083/131/29c.jpg",
"https://i.pinimg.com/736x/44/ce/25/44ce25f1e8e9c740d5aef7f004c055d7.jpg",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6QRg0FTZSK14YmR6JfFkiws19-tghnEW6MA&usqp=CAU",
"https://media.makeameme.org/created/im-not-saying-872f111591.jpg",
"https://i.pinimg.com/550x/a3/aa/28/a3aa28200d8fbecd31139d1109096699.jpg",
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwEkLiyj3TqNTah1O1snQHTFkWkgSxUcdJ_g&usqp=CAU",
"https://i.pinimg.com/originals/7c/52/4a/7c524a34305559fdb068f075c087365d.jpg",
"https://i.pinimg.com/originals/7c/52/4a/7c524a34305559fdb068f075c087365d.jpg",
"https://i.pinimg.com/originals/2c/cb/fe/2ccbfe318d0cb4f9c510c9e3ea0fb7f1.png",
"https://i.pinimg.com/736x/6f/61/47/6f614705a08464a41333d8d408dbe22c.jpg",
"https://i.pinimg.com/originals/7c/52/4a/7c524a34305559fdb068f075c087365d.jpg",
"https://www.cromosomax.com/pics/2018/05/viral-gay-straight-bi.jpg",
];
  var callback = () => api.sendMessage({body:`🏳️‍🌈 ${name}\n نسبه الشذوذ عدك هيه : ${tle}%`,attachment: fs.createReadStream(__dirname + "/cache/5.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/5.jpg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/5.jpg")).on("close",() => callback());
   };