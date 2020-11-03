<template>
  <table>
    <tr>
      <th>Hour</th>
      <th>Temperature</th>
      <th>Description</th>
    </tr>
    <tr :key="index" v-for="(item, index) in items">
      <td>{{ item.dt_txt.split(" ")[1].slice(0, -3) }}</td>
      <td>{{ Math.round(item.main.temp) }}&deg;C</td>
      <td>{{ item.weather[0].description }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class ForecastTable extends Vue {
  @Prop() private items!: Array<Record<string, string>>;
}
</script>

<style lang="scss" scoped>
@import "../assets/style/partials/variables";
table {
  width: 100%;
}
td,
th {
  text-align: center;
  width: 30%;
}
th {
  vertical-align: bottom;
}
td {
  background-color: $unfocused-grey;
}
tr {
  height: 50px;
}
</style>
