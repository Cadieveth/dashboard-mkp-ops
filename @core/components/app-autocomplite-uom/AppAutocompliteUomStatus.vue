<template>
  <div>
    <p style="font-size: xxsmall">
      <b>{{ status }}</b>
    </p>
    <v-radio-group
      v-model="selectedValue"
      @change="$emit('update:formValue', selectedValue)">
      <v-radio label="Yes" value="Y" :disabled="readOnly"></v-radio>
      <v-radio label="No" value="N" :disabled="readOnly"></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
import themeConfig from "@themeConfig";

export default {
  name: "ChildRadioButtonUomStatus",
  props: {
    formValue: { type: String, default: "" },
    readOnly: { type: Boolean, default: false },
  },
  data() {
    return {
      status: "Measurement Status", // Ganti dengan label yang sesuai
      selectedValue: this.formValue,
    };
  },
};
</script>
