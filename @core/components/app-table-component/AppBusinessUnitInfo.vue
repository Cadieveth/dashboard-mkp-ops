<template>
  <div>
    <span class="d-block text--primary font-weight-semibold text-truncate">{{
      data.ouName
    }}</span>
    <span class="text-xs">{{ data.ouCode }}</span>
  </div>
</template>

<script>
export default {
  name: "AppBusinessUnitInfo",
  props: {
    data: { type: Object, default: {} },
  },
  data() {
    return {
      logoImage: "NONE", // Set a default value
    };
  },
  methods: {},
};
</script>
