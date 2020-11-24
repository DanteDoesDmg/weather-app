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
          itemValue="displayString"
          returnObject
        />
        <Button @click.native="fetchWeather(inputResult)">
          <strong>Check</strong>
        </Button>
      </div>
    </div>
    <div class="cards-container">
      <template v-if="showResults">
        <WeatherCard
          :key="index"
          v-for="(result, index) in weatherResults"
          :forecast="result"
          @more-click="goToDetails(result)"
        />
      </template>
      <NoResults v-else-if="weatherFetched" />
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Debounce } from "vue-debounce-decorator";
import logo from "../assets/logo.png";
import { Component, Vue } from "vue-property-decorator";
import { coordsContainer } from "@/store/storeTypes";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";
import LogoTitle from "@/components/LogoTitle.vue";
import WeatherCard, { WeatherResult } from "@/components/WeatherCard.vue";
import NoResults from "@/components/NoResults.vue";

@Component({
  components: {
    Input,
    Button,
    LogoTitle,
    WeatherCard,
    NoResults
  }
})
export default class Home extends Vue {
  logo = logo;
  inputResult = "";
  cities = [];

  toSearch: coordsContainer | string = "";
  get showResults() {
    return Object.keys(this.weatherResults).length > 0 && this.weatherFetched;
  }
  get weatherResults() {
    return this.$store.state.weatherData;
  }
  get weatherFetched() {
    return this.$store.state.weatherFetched;
  }

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
  fetchWeather(val: coordsContainer | string) {
    this.toSearch = val;
    this.$store.dispatch("getWeatherData", val);
  }
  goToDetails(result: WeatherResult) {
    this.$store.commit("setWeatherResult", result);
    this.$router.push({
      path: `Details?&lat=${result.coord.lat}&lon=${result.coord.lon}&dt=${result.date}`
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
  padding: 0 5px;
}
</style>
