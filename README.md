# GTA Weather
![Version](https://img.shields.io/badge/Version-1.3-green.svg) ![License](https://img.shields.io/badge/License-WTFPL%20v2-blue.svg)


## Intro


This Node.js module returns information about the in-game time and weather in GTA Online lobbies for any given time.
It's intended to be used in Discord bots, but could be used in any Node.js environment.

*Special thanks to Pardonias*


## Usage


Example use in a [Discord.js](https://discord.js.org/) bot with `gtaweather.js` placed next to the main .js file:

```javascript
const Discord    = require("discord.js")
const GTAWeather = require("./gtaweather")
const client     = new Discord.Client()

client.on('message', msg => {
    if (msg.content.toLowerCase() == "!gtaweather") {
        // Getting current weather
        let weather = null

        try {
            weather = GTAWeather.GetForecast()
        } catch (err) {
            return msg.channel.send(`An error has occured: ${err.message}`)
        }

        // Constructing response
        msg.channel.send(
            weather.description + "\n" +
            "In-game time: " + weather.gameTimeStr + "\n" +
            "Current weather: " + weather.currentWeatherDescription + " " + weather.currentWeatherEmoji + "\n" +
            (weather.isRaining ? "Rain is expected to stop in " : "Rain is expected in ") + weather.rainEtaStr
        )
    }
})

client.login('token')
```

## API


```javascript
function GetForecast(targetDate?: Date): GTAWeatherState
```
> Returns the current in-game time and weather in GTA Online. Can throw an `Error` object on error.
> 
> `targetDate` is the time the forecast will be given for (if omitted, the current time is used)
> 
> See the structure of the returned object below.

#### Structure of `GTAWeatherState`

* **`description`** *(string)* - Describes the time/date the forecast is for
* **`thumbnailURL`** *(string)* - URL to a thumbnail picture showing the weather
* **`gameTimeHrs`** *(number)* - In-game time as the number of hours [0.0, 24.0)
* **`gameTimeStr`** *(string)* - In-game time, formatted as HH:MM (24-hour)
* **`currentWeatherEmoji`** *(string)* - Emoji showing the weather
* **`currentWeatherID`** *(number)* - ID of the weather condition
* **`currentWeatherDescription`** *(string)* - Name of the weather condition
* **`rainEtaSec`** *(number)* - Time until it starts/stops raining, in seconds (see `isRaining`)
* **`rainEtaStr`** *(string)* - Time until it starts/stops raining, as a human-readable string (see `isRaining`)
* **`isRaining`** *(boolean)* - Shows if it's raining.
  * If `true`, then `rainEtaSec` and `rainEtaStr` show when the rain stops, otherwise they show when it starts

An callback example

```json
{
    "description":"Forecast for **12 February 2023 00:15:28 UTC** (now)",
    "thumbnailURL":"https://i.imgur.com/aY4EQhE.png",
    "gameTimeHrs":7.733333332464099,
    "gameTimeStr":"07:43",
    "currentWeatherEmoji":"☁️",
    "currentWeatherID":8,
    "currentWeatherDescription":"Mostly cloudy",
    "rainEtaSec":11672.000000104308,
    "rainEtaStr":"3 hours 15 minutes",
    "isRaining":false
}
```

## Notes

<h3>Supported languages</h3>
All listed below:

* English
* Español
* Français
* Italiano
* Português
* Русский

You can request data from the system with a defined language, the return will be in the respective language, if it has a pre-configured translation, as in the example below

```javascript
const weather = GTAWeather.GetForecast('pt-br');
```

If no language is informed or the language does not have a translation, the return will be in English

```javascript
/* entries we accept for languages
   en-us, pt-br, es-es, fr-fr, it-it, pt-br, ru-ru */
```

<hr>

The `description` field of `GTAWeatherState` has Discord-specific formatting such as: `Forecast for **24 April 2019 15:18:18 UTC** (now)`. You can just remove `*` characters from the string if you don't need that.


## Version history


* v1.0
  * Initial release
* v1.1
  * Fixed incorrect emojis
* v1.2
  * Changed sunrise time from 5AM to 6AM
  * Minor code changes and fixes

_____________________
![WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-2.png) Licensed under WTFPL v2 (see the file [COPYING](COPYING)).
