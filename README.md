# GTA Weather
![Version](https://img.shields.io/badge/Version-1.01-green.svg) ![License](https://img.shields.io/badge/License-WTFPL%20v2-blue.svg)


## Intro


This Node.js module returns information about the in-game time and weather in GTA Online lobbies for any given time.
It's intended to be used in Discord bots, but could be used in any Node.js environment.

*Special thanks to Pardonias*


## Usage


Example use in a [Discord.js](https://discord.js.org/) bot with `gtaweather.js` placed next to the main .js file:

```javascript
const Discord       = require("discord.js");
const GTAWeather    = require("./gtaweather");
const client        = new Discord.Client();

client.on('message', msg => {
    if (msg.content.startsWith("!gtaweather")) {
        var weather = null;

        try {
            weather = GTAWeather.GetForecast();
        } catch (err) {
            msg.channel.send("An error has occured: " + err.message);
        }

        // Construct a response from 'weather' ...
    }
});
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
* **`currentWeatherDescription`** *(string)* - Name of the weather condition
* **`rainEtaSec`** *(number)* - Time until it starts/stops raining, in seconds (see `isRaining`)
* **`rainEtaStr`** *(string)* - Time until it starts/stops raining, as a human-readable string (see `isRaining`)
* **`isRaining`** *(boolean)* - Shows if it's raining.
  * If `true`, then `rainEtaSec` and `rainEtaStr` show when the rain stops, otherwise they show when it starts


## Known issues


None, although the `description` field of `GTAWeatherState` is probably subject to change. At the moment it returns something like `Forecast for **24 April 2019 15:18:18 UTC** (now)`. At some point I'll change it so it only returns the date itself with no additional text or Discord-specific formatting (`**`), since all that is better to be done on the caller side.


## Version history


* v1.0
  * Initial release
* v1.01
  * Fixed incorrect emoji character codes on non-Windows platforms

_____________________
![WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-2.png) Licensed under WTFPL v2 (see the file [COPYING](COPYING)).
