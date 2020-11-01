<template>
  <input />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
export default class LocationInput extends Vue {}
</script>
<style lang="scss" scoped>
@import "../assets/style/partials/mixins";
input {
  background-color: $unfocused-grey;
  padding: 5px;
  font-size: 20px;
  line-height: 30px;
  width: 100%;
  border: 1px $focused-white solid;
  margin: 5px;
  height: 42px;
  &:focus {
    outline: 0;
  }
}
</style>
