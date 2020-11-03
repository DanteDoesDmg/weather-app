<template>
  <div class="details">
    <div class="spacer"></div>
    <LogoTitle link @click="$router.push('/')" small> Air App</LogoTitle>
    <template v-if="weatherResult">
      <div class="title-card">
        <p>
          <strong>Date:</strong>
          {{ weatherResult.date }}
        </p>
        <p>
          <strong>Location: </strong>
          {{ weatherResult.location }}
        </p>
      </div>
      <ForecastTable :items="weatherResult.weather" />
    </template>
  </div>
</template>
<script lang="ts">
import LogoTitle from "@/components/LogoTitle.vue";
import ForecastTable from "@/components/ForecastTable.vue";
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {
    LogoTitle,
    ForecastTable
  }
})
export default class Details extends Vue {
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
}
</script>
<style lang="scss" scoped>
@import "../assets/style/partials/mixins";
.details {
  @include main-width($main-max-width, center);
  min-height: 100vh;
  text-align: center;
  display: block;
}
.header {
  display: flex;
  height: 200px;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.title-card {
  background-color: $unfocused-grey;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.spacer {
  height: 100px;
}
.flex-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
