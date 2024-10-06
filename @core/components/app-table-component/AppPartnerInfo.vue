<template>
  <div>
    <span class="d-block text--primary font-weight-semibold text-truncate">{{
      data.partnerName
    }}</span>
    <span class="text-xs">{{ data.partnerCode }}</span>
  </div>
</template>

<script>
export default {
  name: "AppPartnerInfo",
  props: {
    data: { type: Object, default: {} },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
