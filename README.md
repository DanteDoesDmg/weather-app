# Air App

## Env setup
To run this project succesfully you will need to place a .env.local file in the root directory of the project, containing the following positions:
```
VUE_APP_MAPQUEST_KEY={YOUR_MAPQUEST_API_KEY from https://developer.mapquest.com/documentation/ }
VUE_APP_OPENWEATHER_KEY={YOUR_OPENWEATHER_API_KEY from https://openweathermap.org/api}
```
both keys can be obtained for free with certain limits :)

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```
## Tech stack
`Vue, Typescript, Vuex, Vue-router, dotenv, sass`

## What can this do?

The App can show you the weather forecast for the next 5 days in any city that can be found using the openweather API.
To search for your desired locations weather forecast simply type the cit's name into the autocomplete Input and press "Check". You can select from a list of predicted city names provided by the Mapquest API or type in your own city name, don't worry if it doesn't show on the list, chances are You'll still be able to find results even if the autocomplete doesn't cover your city :)
After a succesfull search you'll see a list of weather forecast of each day characterised by weather description, date and the highest forecasted temperature for that day. If you wish to know more, simply click 'more' on the selected day's card to go to the details page. The details page contains a more detailed weather forecast for the specified day, showing weather for every 3 hours of the day passed. To go back to the main page simply click the Logo or title on the top of the page :)

## How does it work

Data from the autocomplete/input is used to fetch geographical data for cities which names contain user typed string which is stored in the components data property `cities`
```
  @Debounce(200)
  fetchCities(val: string) {
    if (val.length > 1 && val.length < 101)
      fetch(
        `https://www.mapquestapi.com/search/v3/prediction?limit=5&collection=address%2CadminArea&q=${val}&key=${process.env.VUE_APP_MAPQUEST_KEY}`
      )
        .then(res => res.json())
        .then(data => {
          this.cities = data.results;
        });
  }
```
This function executes only once per 200ms, to limit the amount of API calls

Fetched Cities are then provided to the autocomplete as suggestions, those can be navigated my using `up` and `down` keys and selected by using the `enter` key or `left clicking` selected option.
```
  enter() {
    if (this.matches.length && this.openSuggestion) {
      this.open = false;
      const toEmit = this.returnObject
        ? this.matches[this.current]
        : this.matches[this.current][this.itemValue];
      this.$emit("input", toEmit);
      this.text = this.matches[this.current][this.itemText];
    }
  }
```
After clicking the 'Check' button, a request will be send to openweather API, based on the input. If no suggestion is selected, a serach by city name will be executed instead. If the input is empty and the user allowed the website to see his device's location, the device's location will be used to check the weather forecast instead. Results will be shown under the input. If the search returns no weather forecasts there will be a `No results` message shown instaed of the results. Search results are stored in vuex as `weatherData`
```
getWeatherData({ commit, state }, val: string | coordsContainer) {
      let apiUrl = "";
      const valIsString = typeof val === "string";
      if (valIsString) {
        if (val === "") {
          apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${state.deviceCoordinates[1]}&lon=${state.deviceCoordinates[0]}`;
        } else {
          apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${val}`;
        }
      } else {
        const coordinates = (val as coordsContainer).place.geometry.coordinates;
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[1]}&lon=${coordinates[0]}`;
      }
      fetch(
        apiUrl + `&units=metric&appid=${process.env.VUE_APP_OPENWEATHER_KEY}`
      )
        .then(res => res.json())
        .then(data => {
          const orderedWeatherData = data.list.reduce(
            (
              ordered: Record<string, WeatherResult>,
              current: WeatherForecast
            ) => {
              const date = (current.dt_txt as string).split(" ")[0];
              if (!ordered[date])
                ordered[date] = {
                  main: current.main,
                  location: (val as coordsContainer).name
                    ? (val as coordsContainer).name
                    : data.city.name,
                  date: date,
                  coord: data.city.coord,
                  description: current.weather[0].description as string,
                  weather: []
                };
              ordered[date].weather.push(current);
              if (ordered[date].main.temp < current.main.temp) {
                ordered[date].main = current.main;
                ordered[date].description = current.weather[0]
                  .description as string;
              }
              return ordered;
            },
            {}
          );
          commit("setWeatherData", orderedWeatherData);
        })
        .catch(() => {
          commit("setWeatherData", {});
        })
        .finally(() => {
          commit("toggleWeatherFetched", true);
        });
    }
```

Clicking `more` will result in saving the selected result in vuex, under `weatherResult`.

```
  goToDetails(result: WeatherResult) {
    this.$store.commit("setWeatherResult", result);
    this.$router.push({
      path: `Details?&lat=${result.coord.lat}&lon=${result.coord.lon}&dt=${result.date}`
    });
  }
```
The url will be changed to /Details with 3 query params:
```
lat - geographical latitude for chosen weather forecast
lon - geographical longitude for chosen weather forecast
dt - date of chosen result for chosen weather forecast
```
If the Details page is refreshed, the weather data will be fetched again, and displayed on the details page.

```
get weatherResult() {
    if (this.$store.state.weatherResult) {
      return this.$store.state.weatherResult;
    } else {
      const tmpObj = {
        place: {
          geometry: {
            coordinates: [this.$route.query.lon, this.$route.query.lat]
          }
        }
      };
      if (!this.$store.state.weatherFetched) {
        this.$store.dispatch("getWeatherData", tmpObj);
      }
      return this.$store.state.weatherData[this.$route.query.dt as string];
    }
  }
```
