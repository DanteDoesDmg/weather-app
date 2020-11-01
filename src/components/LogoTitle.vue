<template>
  <div class="title-container">
    <h1>
      <slot> </slot>
    </h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class LogoTitle extends Vue {
  @Prop() private img!: string;
}
</script>

<style lang="scss" scoped>
.title-container {
  height: 64px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-end;
}
h1 {
  font-size: 40px;
  position: relative;
  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 40%;
    left: -40%;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 64px;
    z-index: 2;
    background-image: url("~@/assets/logo.png");
    background-size: contain;
  }
}
</style>
