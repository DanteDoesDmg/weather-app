<template>
  <div class="autocomplete">
    <input
      v-model="text"
      @keydown.enter="enter"
      @keydown.down="down"
      @keydown.up.prevent="up"
      @input="change"
      @blur="open = false"
      @click="open = true"
    />
    <ul v-if="openSuggestion" class="autocomplete-results">
      <li
        :class="{ 'autocomplete-result': true, active: isActive(index) }"
        @click="click(index)"
        :key="index"
        v-for="(item, index) in matches"
      >
        {{ item[itemText] }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Input extends Vue {
  @Prop() private items!: Array<Record<string, string>>;
  @Prop() private value!: string;
  @Prop({ default: "text" }) private itemText!: string;
  @Prop({ default: "value" }) private itemValue!: string;
  @Prop({ default: false }) private returnObject!: boolean;
  current = 0;
  text = this.value || "";
  open = false;

  get matches(): Array<Record<string, string>> {
    if (this.text !== "") {
      return this.items.filter(el => {
        return (
          el[this.itemText].toLowerCase().indexOf(this.text.toLowerCase()) >= 0
        );
      });
    }
    return [];
  }
  get openSuggestion() {
    return this.text !== "" && this.matches.length != 0 && this.open === true;
  }
  isActive(index: number) {
    return index === this.current;
  }
  enter() {
    if (this.matches.length && this.openSuggestion) {
      this.open = false;
      const toEmit = this.returnObject
        ? this.matches[this.current]
        : this.matches[this.current][this.itemValue];
      this.$emit("input", toEmit);
      this.text = this.matches[this.current][this.itemText];
    }
  }
  click(value: number) {
    console.log("here");
    this.current = value;
    this.enter();
  }
  up() {
    if (this.current > 0) this.current--;
  }

  down() {
    if (this.current < this.matches.length - 1) this.current++;
  }
  change(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value;

    if (this.open == false) {
      this.open = true;
      this.current = 0;
    } else {
      this.$emit("change", value);
      this.$emit("input", value);
      if (this.current > this.matches.length) {
        this.current = 0;
      }
    }
  }
}
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
  height: 42px;
  &:focus {
    outline: 0;
  }
}
.autocomplete {
  width: 100%;
  margin: 5px;
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid $focused-white;
  max-height: 120px;
  overflow: auto;
  position: absolute;
  width: 100%;
  z-index: 1;
}

.autocomplete-result {
  @include hoverable-semi-transparent(
    $nontransparent-grey,
    darken($nontransparent-grey, 10%)
  );
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
  &.active {
    background-color: darken($nontransparent-grey, 10%);
    transition: none;
  }
}
</style>
