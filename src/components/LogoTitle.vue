<template>
  <div :class="{ 'title-container': true, small: small, link: link }">
    <div class="clickable-container">
      <h1 @click="$emit('click')">
        <slot> </slot>
      </h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class LogoTitle extends Vue {
  @Prop({ default: false, type: Boolean }) private small!: boolean;
  @Prop({ default: false, type: Boolean }) private link!: boolean;

}
</script>

<style lang="scss" scoped>
.title-container {
  height: 64px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-end;
  &.small {
    align-items: flex-start;
    justify-content: flex-start;
    h1 {
      margin-left: 36px;
      font-size: 28px;
      &:before {
        width: 32px;
        height: 32px;
        top: 40%;
        left: -20%;
      }
    }
  }
  &.link .clickable-container {
    cursor: pointer;
  }
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
