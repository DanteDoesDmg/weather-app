<template>
  <button>
    <slot></slot>
  </button>
</template>

<script>
const env = process.env;
console.log(env);
export default {};
</script>

<style lang="scss" scoped>
@import "../assets/style/partials/mixins";

button {
  border: none;
  height: 42px;
  padding: 5px;
  text-transform: uppercase;
  cursor: pointer;
  color: white;
  background-color: $focused-white;
  outline: none;
  @include ripple($focused-white);
  width: 200px;
  margin: 5px;
}
</style>
