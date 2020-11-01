<template>
  <div class="home main-width">
    <div class="main-spacer"/>
    <div class="header">
      <LogoTitle :img="logo">Air App</LogoTitle>
      <p class="subtitle">
        Check the weather! Enter the city name, or leave
        <strong>leave empty for geolocation</strong>
      </p>
      <div class="flex-container">
        <Input />
        <Button> <strong>Check</strong> </Button>
      </div>
    </div>
    <div class="cards-container"/>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import logo from "../assets/logo.png";
import { Component, Vue } from "vue-property-decorator";
import Input from "@/components/Input.vue";
import Button from "@/components/Button.vue";
import LogoTitle from "@/components/LogoTitle.vue";

@Component({
  components: {
    Input,
    Button,
    LogoTitle
  }
})
export default class Home extends Vue {
  logo = logo;
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
</style>
