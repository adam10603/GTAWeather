const weatherPeriod     = 384; // Weather period in in-game hours
const gameHourLength    = 120; // 1 in-game hour in seconds
const sunriseTime       = 5;   // Time of sunset and sunrise, as in-game hour of day (0-23)
const sunsetTime        = 21;

function makeWeather(name_, emoji_, thumbnailDay_, thumbnailNight_) {
    return {
        name:           name_,
        emoji:          emoji_,
        thumbnailDay:   thumbnailDay_,
        thumbnailNight: thumbnailNight_
    };
}

// Weather states
const weatherState = {
    clear:          makeWeather("Clear",            stripEmojis("☀️"), "https://i.imgur.com/LerUU1Z.png", "https://i.imgur.com/waFNkp1.png"),
    rain:           makeWeather("Raining",          stripEmojis("🌧️"), "https://i.imgur.com/qsAl41k.png", "https://i.imgur.com/jc98A0G.png"),
    drizzle:        makeWeather("Drizzling",        stripEmojis("🌦️"), "https://i.imgur.com/Qx18aHp.png", "https://i.imgur.com/EWSCz5d.png"),
    mist:           makeWeather("Misty",            stripEmojis("🌁"), "https://i.imgur.com/mjZwX2A.png", "https://i.imgur.com/Mh1PDXS.png"),
    fog:            makeWeather("Foggy",            stripEmojis("🌫️"), "https://i.imgur.com/mjZwX2A.png", "https://i.imgur.com/Mh1PDXS.png"),
    haze:           makeWeather("Hazy",             stripEmojis("🌫️"), "https://i.imgur.com/mjZwX2A.png", "https://i.imgur.com/Mh1PDXS.png"), // 🏭
    snow:           makeWeather("Snowy",            stripEmojis("❄️"), "https://i.imgur.com/WJEjWM6.png", "https://i.imgur.com/1TxfthS.png"),
    cloudy:         makeWeather("Cloudy",           stripEmojis("☁️"), "https://i.imgur.com/1oMUp2V.png", "https://i.imgur.com/qSOc8XX.png"),
    mostlyCloudy:   makeWeather("Mostly cloudy",    stripEmojis("🌥️"), "https://i.imgur.com/aY4EQhE.png", "https://i.imgur.com/2LIbOFC.png"),
    partlyCloudy:   makeWeather("Partly cloudy",    stripEmojis("⛅"), "https://i.imgur.com/aY4EQhE.png", "https://i.imgur.com/2LIbOFC.png"),
    mostlyClear:    makeWeather("Mostly clear",     stripEmojis("🌤️"), "https://i.imgur.com/aY4EQhE.png", "https://i.imgur.com/2LIbOFC.png")
};

// Weather lookup table
const weatherStateChanges = [
    [0,     weatherState.partlyCloudy],
    [4,     weatherState.mist],
    [7,     weatherState.mostlyCloudy],
    [11,    weatherState.clear],
    [14,    weatherState.mist],
    [16,    weatherState.clear],
    [28,    weatherState.mist],
    [31,    weatherState.clear],
    [41,    weatherState.haze],
    [45,    weatherState.partlyCloudy],
    [52,    weatherState.mist],
    [55,    weatherState.cloudy],
    [62,    weatherState.fog],
    [66,    weatherState.cloudy],
    [72,    weatherState.partlyCloudy],
    [78,    weatherState.fog],
    [82,    weatherState.cloudy],
    [92,    weatherState.mostlyClear],
    [104,   weatherState.partlyCloudy],
    [105,   weatherState.drizzle],
    [108,   weatherState.partlyCloudy],
    [125,   weatherState.mist],
    [128,   weatherState.partlyCloudy],
    [131,   weatherState.rain],
    [134,   weatherState.drizzle],
    [137,   weatherState.cloudy],
    [148,   weatherState.mist],
    [151,   weatherState.mostlyCloudy],
    [155,   weatherState.fog],
    [159,   weatherState.clear],
    [176,   weatherState.mostlyClear],
    [196,   weatherState.fog],
    [201,   weatherState.partlyCloudy],
    [220,   weatherState.mist],
    [222,   weatherState.mostlyClear],
    [244,   weatherState.mist],
    [246,   weatherState.mostlyClear],
    [247,   weatherState.rain],
    [250,   weatherState.drizzle],
    [252,   weatherState.partlyCloudy],
    [268,   weatherState.mist],
    [270,   weatherState.partlyCloudy],
    [272,   weatherState.cloudy],
    [277,   weatherState.partlyCloudy],
    [292,   weatherState.mist],
    [295,   weatherState.partlyCloudy],
    [300,   weatherState.mostlyCloudy],
    [306,   weatherState.partlyCloudy],
    [318,   weatherState.mostlyCloudy],
    [330,   weatherState.partlyCloudy],
    [337,   weatherState.clear],
    [367,   weatherState.partlyCloudy],
    [369,   weatherState.rain],
    [376,   weatherState.drizzle],
    [377,   weatherState.partlyCloudy]
];

// Return type for GetForecast()
class GTAWeatherState {
    constructor(description,thumbnailURL,gameTimeHrs,gameTimeStr,currentWeatherEmoji,currentWeatherDescription,rainEtaSec,rainEtaStr,isRaining) {
        /**
         * Describes the time/date the forecast is for (formatted for Discord!)
         * @type {string}
         */
        this.description = description;
        /**
         * URL to a thumbnail picture showing the weather
         * @type {string}
         */
        this.thumbnailURL = thumbnailURL;
        /**
         * Current in-game time as the number of hours [0.0, 24.0)
         * @type {number}
         */
        this.gameTimeHrs = gameTimeHrs;
        /**
         * Current in-game time, formatted as HH:MM (24-hour)
         * @type {string}
         */
        this.gameTimeStr = gameTimeStr;
        /**
         * Emoji showing the weather
         * @type {string}
         */
        this.currentWeatherEmoji = currentWeatherEmoji;
        /**
         * Name of the weather condition
         * @type {string}
         */
        this.currentWeatherDescription = currentWeatherDescription;
        /**
         * Time until it starts/stops raining, in seconds (see `isRaining`)
         * @type {number}
         */
        this.rainEtaSec = rainEtaSec;
        /**
         * Time until it starts/stops raining, as a human-readable string (see `isRaining`)
         * @type {string}
         */
        this.rainEtaStr = rainEtaStr;
        /**
         * Shows if it's raining.
         * If `true`, then `rainEtaSec` and `rainEtaStr` show when the rain stops, otherwise they show when it starts
         * @type {boolean}
         */
        this.isRaining = isRaining;
    }
}

// Removes all occurrences of \uFE0F (0xEFB88F) from a string.
// This is a unicode modifier that Windows puts in emojis that fucks them up on all other platforms.
// Why would Microsoft follow a standard for once?
function stripEmojis(text) {
    return text.replace(/\uFE0F/g, "");
}

function secToVerboseInterval(seconds) {
    if (seconds < 60) return "Less than 1 minute";

    var sMod60  = seconds % 60;
    var hours   = Math.floor(seconds / 3600 + (sMod60 / 3600));
    var minutes = Math.floor((seconds - (hours * 3600)) / 60 + (sMod60 / 60));
    var ret =
        (hours > 0 ? (hours + (hours > 1 ? " hours " : " hour ")) : "") +
        (minutes > 0 ? (minutes + (minutes > 1 ? " minutes" : " minute")) : "");
    return ret;
}

function hrsToHHMM(hrs) {
    var hh = Math.floor(hrs).toString().padStart(2, "0");
    var mm = Math.floor((hrs - Math.floor(hrs)) * 60.0).toString().padStart(2, "0");
    return hh + ":" + mm;
}

function dateToStr(d) {
    // Can't believe JS doesn't have custom date formatting
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var Y = d.getUTCFullYear().toString().padStart(2, "0");
    var M = monthNames[d.getUTCMonth()];
    var D = d.getUTCDate().toString().padStart(2, "0");
    var H = d.getUTCHours().toString().padStart(2, "0");
    var m = d.getUTCMinutes().toString().padStart(2, "0");
    var S = d.getUTCSeconds().toString().padStart(2, "0");

    return D + " " + M + " " + Y + " " + H + ":" + m + ":" + S + " UTC";
}

function getGtaTimeFromDate(d) {
    var timestamp           = Math.floor(d.getTime() / 1000.0);
    var gtaHoursTotal       = timestamp / gameHourLength;
    var gtaHoursDay         = gtaHoursTotal % 24.0;

    return {
        gameTimeHrs:        gtaHoursDay,
        gameTimeStr:        hrsToHHMM(gtaHoursDay),
        weatherPeriodTime:  gtaHoursTotal % weatherPeriod
    };
}

function getWeatherForPeriodTime(periodTime) {
    var ret = null;
    if (periodTime > weatherPeriod || periodTime < 0) return ret;
    for (var i = 0; i < weatherStateChanges.length; i++) {
        if (weatherStateChanges[i][0] > periodTime) {
            ret = weatherStateChanges[i - 1][1];
            break;
        }
    }
    if (ret === null) ret = weatherStateChanges[weatherStateChanges.length - 1][1];
    return ret;
}

function getRainEta(periodTime, currentWeather) {
    if (periodTime > weatherPeriod || periodTime < 0) return null;
    var raining = isRaining(currentWeather);
    var getEta = () => {
        for (var i = 0; i < weatherStateChanges.length * 2; i++) {
            var index = i % weatherStateChanges.length;
            var offset = Math.floor(i / weatherStateChanges.length) * weatherPeriod;
            if (weatherStateChanges[index][0] + offset >= periodTime) {
                if (raining ^ isRaining(weatherStateChanges[index][1])) {
                    return ((weatherStateChanges[index][0] + offset) - periodTime) * gameHourLength;
                }
            }
        }
    };

    var eta = getEta();
    return {
        etaSec:     eta,
        etaStr:     secToVerboseInterval(eta),
        isRaining:  raining
    };
}

function isRaining(state) {
    return state === weatherState.rain || state === weatherState.drizzle;
}

function isDaytime(gameTimeOfDayHrs) {
    return (gameTimeOfDayHrs >= sunriseTime && gameTimeOfDayHrs < sunsetTime);
}

module.exports = {
    /**
     * The class holding the information returned by `GetForecast`
     */
    GTAWeatherState: GTAWeatherState,
    /**
     * Returns the current in-game time and weather in GTA Online. Can throw an `Error` object on error
     * @param {Date} [targetDate] - The time the forecast will be given for (if omitted, the current time is used)
     * @returns {GTAWeatherState}
     */
    GetForecast: function(targetDate) {
        var currentDate = false;
        if (!(targetDate instanceof Date)) {
            targetDate = new Date();
            currentDate = true;
        } else if (Math.abs(new Date().valueOf() - targetDate.valueOf()) < 10000) { // Consider anything +/- 10 seconds from now to be the current time
            currentDate = true;
        }
        var gtaTime         = getGtaTimeFromDate(targetDate);
        var currentWeather  = getWeatherForPeriodTime(gtaTime.weatherPeriodTime);
        if (currentWeather === null) throw new Error("Failed to determine current weather");
        var rainEta = getRainEta(gtaTime.weatherPeriodTime, currentWeather);
        if (rainEta === null) throw new Error("Failed to calculate rain ETA");
        
        return new GTAWeatherState(
            "Forecast for **" + dateToStr(targetDate) + "**" + (currentDate ? " (now)" : ""),
            (isDaytime(gtaTime.gameTimeHrs) ? currentWeather.thumbnailDay : currentWeather.thumbnailNight),
            gtaTime.gameTimeHrs,
            gtaTime.gameTimeStr,
            currentWeather.emoji,
            currentWeather.name,
            rainEta.etaSec,
            rainEta.etaStr,
            rainEta.isRaining
        );
    }
};