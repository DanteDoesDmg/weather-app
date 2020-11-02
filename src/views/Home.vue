<template>
  <div class="home main-width">
    <div class="main-spacer" />
    <div class="header">
      <LogoTitle :img="logo">Air App</LogoTitle>
      <p class="subtitle">
        Check the weather! Enter the city name, or leave
        <strong>leave empty for geolocation</strong>
      </p>
      <div class="flex-container">
        <Input
          v-model="inputResult"
          @change="fetchCities"
          :items="cities"
          itemText="displayString"
          itemValue="name"
        />
        <Button @click="fetchWeather(inputResult)">
          <strong>Check</strong>
        </Button>
      </div>
    </div>
    <div class="cards-container">
      <WeatherCard
        :key="index"
        v-for="(result, index) in weatherResults"
        :forecast="result"
      />
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Debounce } from "vue-debounce-decorator";
import logo from "../assets/logo.png";
import { Component, Vue } from "vue-property-decorator";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";
import LogoTitle from "@/components/LogoTitle.vue";
import WeatherCard, { WeatherForecast } from "@/components/WeatherCard.vue";

interface WeatherResult {
  main: Record<string, number>;
  date: string;
  location: string;
  weather: Array<WeatherForecast>;
  description: string;
}

@Component({
  components: {
    Input,
    Button,
    LogoTitle,
    WeatherCard
  }
})
export default class Home extends Vue {
  logo = logo;
  inputResult = "";
  cities = [];
  weatherResults = [];
  @Debounce(200)
  fetchCities(val: string) {
    if (val.length > 1 && val.length < 101)
      fetch(
        `https://www.mapquestapi.com/search/v3/prediction?limit=5&collection=address%2CadminArea&undefined=undefined&q=${val}&key=${process.env.VUE_APP_MAPQUEST_KEY}`
      )
        .then(res => res.json())
        .then(data => {
          this.cities = data.results;
        });
  }
  fetchWeather(val: string) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${val}&units=metric&appid=${process.env.VUE_APP_OPENWEATHER_KEY}`
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
                location: data.city.name,
                date: date,
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
        this.weatherResults = orderedWeatherData;
      });
  }
}
</script>
<style lang="scss" scoped>
@import "../assets/style/partials/mixins";
.home {
  @include main-width();
  min-height: 100vh;
  text-align: center;
}
.header {
  display: flex;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.flex-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 50px;
}
.subtitle {
  line-height: 24px;
}
.cards-container {
  width: 100%;
}
</style>
