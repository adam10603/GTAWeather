# GTA Weather
![Version](https://img.shields.io/badge/Version-1.0-green.svg) ![License](https://img.shields.io/badge/License-WTFPL%20v2-blue.svg)


## Intro


This Node.js module returns information about the in-game time and weather in GTA Online lobbies for any given time.
It's intended to be used in Discord bots, but could be used in any Node.js environment.


## Usage


Place `gtaweather.js` next to your main .js file to be able to use it.
Example use in a [Discord.js](https://discord.js.org/) bot:

```javascript
const Discord       = require("discord.js");
const GTAWeather    = require("./gtaweather");

const client   = new Discord.Client();

client.on('message', msg => {
    if (msg.content.startsWith("!gtaweather")) {
        var weather = GTAWeather.GetForecast();

        // Construct a response from `weather` ...
    }
});
```


## API


```javascript
function GetForecast(targetDate)
```
> Returns the current in-game time and weather in GTA Online. Can throw an `Error` object on error.
>
> **Arguments**
>
> `targetDate` (optional Date): The time the forecast will be given for (if omitted, the current time is used)
>
> **Return value**
>
> A `GTAWeatherState` object (see its structure below).

### Structure of `GTAWeatherState`

