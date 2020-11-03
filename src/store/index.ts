import Vue from "vue";
import Vuex from "vuex";
import { coordsContainer } from "./storeTypes";
import { WeatherForecast, WeatherResult } from "@/components/WeatherCard.vue";
Vue.use(Vuex);

const coordinates: Array<number> = [];
navigator.geolocation.getCurrentPosition(({ coords }) => {
  coordinates.push(coords.longitude, coords.latitude);
});

export default new Vuex.Store({
  state: {
    weatherResult: null,
    weatherFetched: false,
    weatherData: {},
    deviceCoordinates: coordinates
  },
  mutations: {
    setWeatherResult(state, payload) {
      state.weatherResult = payload;
    },
    setWeatherData(state, payload) {
      state.weatherData = payload;
    },
    toggleWeatherFetched(state, payload) {
      state.weatherFetched = payload;
    }
  },
  actions: {
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
  },
  modules: {}
});
