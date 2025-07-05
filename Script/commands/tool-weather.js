module.exports.config = {
  name: "طقس",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Mirai Team",
  description: "قم برؤية الطقس في منطقتك",
  commandCategory: "قــســم الــادوات",
  usages: "[الموقع]",
  cooldowns: 5,
  dependencies: {
    "moment-timezone": "",
    "request": ""
  },
  envConfig: {
    "OPEN_WEATHER": "b7f1db5959a1f5b2a079912b03f0cd96"
  }
};

module.exports.languages = {

  "ar": {
    "locationNotExist": "لايمكن العثور على موقع %1.",
    "returnResult": "🌡 الحرارة : %1℃\n🌡 تشعر وكانها : %2℃\n☁️ السماء: %3\n💦 الرطوبة: %4%\n💨 سرعة الرياح: %5 كيلومتر في الساعة\n🌅 شروق الشمس: %6\n🌄 غروب الشمس: %7"
  }
}

module.exports.run = async ({ api, event, args, getText }) => {
  const request = global.nodemodule["request"];
  const moment = global.nodemodule["moment-timezone"];
  const { throwError } = global.utils;
  const { threadID, messageID } = event;

  var city = args.join(" ");
  if (city.length == 0) return throwError(this.config.name, threadID, messageID);
  return request(encodeURI("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + global.configModule[this.config.name].OPEN_WEATHER + "&units=metric&lang=" + global.config.language), (err, response, body) => {
    if (err) throw err;
    var weatherData = JSON.parse(body);
    if (weatherData.cod !== 200) return api.sendMessage(getText("locationNotExist", city), threadID, messageID);
    var sunrise_date = moment.unix(weatherData.sys.sunrise).tz("Africa/Casablanca");
    var sunset_date = moment.unix(weatherData.sys.sunset).tz("Africa/Casablanca");
    api.sendMessage({
      body: getText("returnResult", weatherData.main.temp, weatherData.main.feels_like, weatherData.weather[0].description, weatherData.main.humidity, weatherData.wind.speed, sunrise_date.format('HH:mm:ss'), sunset_date.format('HH:mm:ss')),
      location: {
        latitude: weatherData.coord.lat,
        longitude: weatherData.coord.lon,
        current: true
      },
    }, threadID, messageID);
  });
  }