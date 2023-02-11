const weatherPeriod  = 384 // Weather period in in-game hours
const gameHourLength = 120 // 1 in-game hour in seconds
const sunriseTime    = 6   // Time of sunrise, as in-game hour of day
const sunsetTime     = 21  // Time of sunset, as in-game hour of day

const { weathers, listWeather } = require("./weatherStates")

// Importing the translations file
const { tls } = require("./weather.json")

var weatherState, weatherStateChanges

// Return type for GetForecast()
class GTAWeatherState {
    constructor(description, thumbnailURL, gameTimeHrs, gameTimeStr, currentWeatherEmoji, currentWeatherID, currentWeatherDescription, rainEtaSec, rainEtaStr, isRaining) {
        /**
         * Describes the time/date the forecast is for (formatted for Discord!)
         * @type {string}
         */
        this.description = description
        /**
         * URL to a thumbnail picture showing the weather
         * @type {string}
         */
        this.thumbnailURL = thumbnailURL
        /**
         * Current in-game time as the number of hours [0.0, 24.0)
         * @type {number}
         */
        this.gameTimeHrs = gameTimeHrs
        /**
         * Current in-game time, formatted as HH:MM (24-hour)
         * @type {string}
         */
        this.gameTimeStr = gameTimeStr
        /**
         * Emoji showing the weather
         * @type {string}
         */
        this.currentWeatherEmoji = currentWeatherEmoji
        /**
         * ID of the weather condition
         * @type {number}
         */
        this.currentWeatherID = currentWeatherID
        /**
         * Name of the weather condition
         * @type {string}
         */
        this.currentWeatherDescription = currentWeatherDescription
        /**
         * Time until it starts/stops raining, in seconds (see `isRaining`)
         * @type {number}
         */
        this.rainEtaSec = rainEtaSec
        /**
         * Time until it starts/stops raining, as a human-readable string (see `isRaining`)
         * @type {string}
         */
        this.rainEtaStr = rainEtaStr
        /**
         * Shows if it's raining.
         * If `true`, then `rainEtaSec` and `rainEtaStr` show when the rain stops, otherwise they show when it starts
         * @type {boolean}
         */
        this.isRaining = isRaining
    }
}

function secToVerboseInterval(seconds, language) {
    if (seconds < 60) return tls[language]["less_one_minute"]

    const sMod60  = seconds % 60
    const hours   = Math.floor(seconds / 3600 + (sMod60 / 3600))
    const minutes = Math.floor((seconds - (hours * 3600)) / 60 + (sMod60 / 60))

    let ret =
        (hours > 0 ? (hours + (hours > 1 ? tls[language]["hours"] : tls[language]["hour"])) : "") +
        (minutes > 0 ? (minutes + (minutes > 1 ? tls[language]["minutes"] : tls[language]["minute"])) : "")

    if (ret.endsWith(" ")) ret = ret.slice(0, -1)

    return ret
}

function hrsToHHMM(hrs) {
    const hh = Math.floor(hrs).toString().padStart(2, "0")
    const mm = Math.floor((hrs - Math.floor(hrs)) * 60.0).toString().padStart(2, "0")

    return `${hh}:${mm}`
}

function dateToStr(d) {
    // Can't believe JS doesn't have custom date formatting
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ]

    const Y = d.getUTCFullYear().toString().padStart(2, "0")
    const M = monthNames[d.getUTCMonth()]
    const D = d.getUTCDate().toString().padStart(2, "0")

    const H = d.getUTCHours().toString().padStart(2, "0")
    const m = d.getUTCMinutes().toString().padStart(2, "0")
    const S = d.getUTCSeconds().toString().padStart(2, "0")

    return `${D} ${M} ${Y} ${H}:${m}:${S} UTC`
}

function getGtaTimeFromDate(d) {
    const timestamp     = Math.floor(d.getTime() / 1000.0)
    const gtaHoursTotal = timestamp / gameHourLength
    const gtaHoursDay   = gtaHoursTotal % 24.0

    return {
        gameTimeHrs: gtaHoursDay,
        gameTimeStr: hrsToHHMM(gtaHoursDay),
        weatherPeriodTime: gtaHoursTotal % weatherPeriod
    }
}

function getWeatherForPeriodTime(periodTime) {
    let ret = null

    if (periodTime > weatherPeriod || periodTime < 0) return ret

    for (let i = 0; i < weatherStateChanges.length; i++) {
        if (weatherStateChanges[i][0] > periodTime) {
            ret = weatherStateChanges[i - 1][1]
            break
        }
    }

    if (ret === null) ret = weatherStateChanges[weatherStateChanges.length - 1][1]
    return ret
}

function getRainEta(periodTime, currentWeather, language) {
    if (periodTime > weatherPeriod || periodTime < 0) return null

    let raining = isRaining(currentWeather), eta = null

    for (let i = 0; i < weatherStateChanges.length * 2; i++) {

        const index = i % weatherStateChanges.length
        const offset = Math.floor(i / weatherStateChanges.length) * weatherPeriod

        if (weatherStateChanges[index][0] + offset >= periodTime) {
            if (raining ^ isRaining(weatherStateChanges[index][1])) {
                eta = ((weatherStateChanges[index][0] + offset) - periodTime) * gameHourLength
                break
            }
        }
    }

    return {
        etaSec: eta,
        etaStr: secToVerboseInterval(eta, language),
        isRaining: raining
    }
}

function isRaining(state) {
    return state === weatherState.rain || state === weatherState.drizzle
}

function isDaytime(gameTimeOfDayHrs) {
    return (gameTimeOfDayHrs >= sunriseTime && gameTimeOfDayHrs < sunsetTime)
}

module.exports = {
    /**
     * Class that holds information about in-game time and weather. This is the return type of `GetForecast`.
     */
    GTAWeatherState: GTAWeatherState,
    /**
     * Returns the current in-game time and weather in GTA Online. Can throw an `Error` object on error
     * @param {Date} [targetDate] - The time the forecast will be given for (optional, default = current time)
     * @returns {GTAWeatherState}
     */
    GetForecast: function (language, targetDate) {

        // Checking if a language has been set
        if  (language)
            language = language.slice(0, 2)

        // Checking if there is a translation for the given language
        if (!tls[language])
            language = "en"

        // Setting the weathers
        weatherState = weathers(language)
        weatherStateChanges = listWeather(weatherState)

        let currentDate = false

        if (!(targetDate instanceof Date)) {
            targetDate = new Date()
            currentDate = true
        } else if (Math.abs(new Date().valueOf() - targetDate.valueOf()) < 10000) // Consider anything +/- 10 seconds from now to be the current time
            currentDate = true

        const gtaTime = getGtaTimeFromDate(targetDate)
        const currentWeather = getWeatherForPeriodTime(gtaTime.weatherPeriodTime)
        if (currentWeather === null) throw new Error("Failed to determine current weather")

        const rainEta = getRainEta(gtaTime.weatherPeriodTime, currentWeather, language)
        if (rainEta === null) throw new Error("Failed to calculate rain ETA")

        return new GTAWeatherState(
            `Forecast for **${dateToStr(targetDate)}**` + (currentDate ? " (now)" : ""),
            (isDaytime(gtaTime.gameTimeHrs) ? currentWeather.thumbnailDay : currentWeather.thumbnailNight),
            gtaTime.gameTimeHrs,
            gtaTime.gameTimeStr,
            currentWeather.emoji,
            currentWeather.id,
            currentWeather.name,
            rainEta.etaSec,
            rainEta.etaStr,
            rainEta.isRaining
        )
    }
}