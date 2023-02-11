function makeWeather(id_, name_, emoji_, thumbnailDay_, thumbnailNight_) {
    return {
        id:             id_,
        name:           name_,
        emoji:          emoji_,
        thumbnailDay:   thumbnailDay_,
        thumbnailNight: thumbnailNight_
    }
}

module.exports = {

    weathers(language) {

        // Weather states
        const weatherState = {
            clear:          makeWeather(0, "Clear",            "☀️", "https://i.imgur.com/LerUU1Z.png", "https://i.imgur.com/waFNkp1.png"),
            rain:           makeWeather(1, "Raining",          "🌧️", "https://i.imgur.com/qsAl41k.png", "https://i.imgur.com/jc98A0G.png"),
            drizzle:        makeWeather(2, "Drizzling",        "🌧️", "https://i.imgur.com/Qx18aHp.png", "https://i.imgur.com/EWSCz5d.png"),
            mist:           makeWeather(3, "Misty",            "🌁", "https://i.imgur.com/mjZwX2A.png", "https://i.imgur.com/Mh1PDXS.png"),
            fog:            makeWeather(4, "Foggy",            "🌫️", "https://i.imgur.com/mjZwX2A.png", "https://i.imgur.com/Mh1PDXS.png"),
            haze:           makeWeather(5, "Hazy",             "🌫️", "https://i.imgur.com/mjZwX2A.png", "https://i.imgur.com/Mh1PDXS.png"),
            snow:           makeWeather(6, "Snowy",            "❄️", "https://i.imgur.com/WJEjWM6.png", "https://i.imgur.com/1TxfthS.png"),
            cloudy:         makeWeather(7, "Cloudy",           "☁️", "https://i.imgur.com/1oMUp2V.png", "https://i.imgur.com/qSOc8XX.png"),
            mostlyCloudy:   makeWeather(8, "Mostly cloudy",    "☁️", "https://i.imgur.com/aY4EQhE.png", "https://i.imgur.com/2LIbOFC.png"),
            partlyCloudy:   makeWeather(9, "Partly cloudy",    "⛅", "https://i.imgur.com/aY4EQhE.png", "https://i.imgur.com/2LIbOFC.png"), // Emoji could be wrong
            mostlyClear:    makeWeather(10, "Mostly clear",    "🌤️", "https://i.imgur.com/aY4EQhE.png", "https://i.imgur.com/2LIbOFC.png")
        }

        return weatherState
    },

    listWeather(weatherState) {
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
        ]

        return weatherStateChanges
    }
}