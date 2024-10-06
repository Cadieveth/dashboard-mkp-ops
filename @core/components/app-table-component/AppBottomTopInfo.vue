<template>
  <div>
    <span class="d-block text--primary font-weight-semibold text-truncate">{{
      top
    }}</span>
    <span class="text-xs">{{ bottom }}</span>
  </div>
</template>

<script>
export default {
  name: "AppBottomTopInfo",
  props: {
    top: { type: String },
    bottom: { type: String },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
