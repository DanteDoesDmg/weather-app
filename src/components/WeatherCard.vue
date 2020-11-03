<template>
  <div class="card">
    <div class="temperature">
      <div>
        <p>{{ Math.round(forecast.main.temp) }}&deg;C</p>
      </div>
    </div>
    <div class="details">
      <p><strong>Date:</strong> {{ forecast.date }}</p>
      <p><strong>Location:</strong> {{ forecast.location }}</p>
      <p><strong>Description: </strong> {{ forecast.description }}</p>
    </div>
    <div class="more-container">
      <a class="more-button" @click="$emit('more-click')">More</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

export interface WeatherResult {
  main: Record<string, number>;
  date: string;
  location: string;
  weather: Array<WeatherForecast>;
  coord: Record<string, number>;

  description: string;
}

export interface WeatherForecast {
  dt: number;
  main: Record<string, number>;
  weather: Array<Record<string, string | number>>;
  clouds: Record<string, number>;
  wind: Record<string, number>;
  visibility: number;
  pop: number;
  sys: object;
  dt_txt: string;
}
@Component
export default class WeatherCard extends Vue {
  @Prop() private forecast!: WeatherForecast;
}
</script>

<style lang="scss" scoped>
@import "../assets/style/partials/mixins";
.card {
  background-color: $unfocused-grey;
  width: 100%;
  display: flex;
  height: 120px;
  padding: 15px;
  position: relative;
  margin: 5px 0;
}
.temperature {
  width: 35%;
  height: 100%;
  text-align: center;
  display: table;
  font-size: 40px;
  font-weight: bold;
  white-space: nowrap;
  padding-right: 10px;
  & div {
    display: table-cell;
    vertical-align: middle;
  }
}
.details {
  width: 65%;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  padding: 5px 0px;
  white-space: nowrap;
  overflow: hidden;
}
.more-button {
  position: absolute;
  @include hoverable-semi-transparent(transparent);
  padding: 5px 10px;
  display: block;
  text-decoration: none;
  margin-top: auto;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  bottom: 0;
  right: 0;
}
</style>
