<template>
  <v-chip
    :class="`${
      statusDoc === 'NONE'
        ? 'secondary'
        : statusDoc === 'DRAFT'
        ? 'warning'
        : statusDoc === 'INCOMING APPROVAL REQUEST'
        ? 'primary'
        : 'success'
    }--text`"
    class="v-chip-light-bg font-weight-semibold text-capitalize"
    :color="
      statusDoc === 'NONE'
        ? 'secondary'
        : statusDoc === 'DRAFT'
        ? 'warning'
        : statusDoc === 'INCOMING APPROVAL REQUEST'
        ? 'primary'
        : 'success'
    "
  >
    {{ statusDoc === "D" ? "DRAFT" : statusDoc }}
  </v-chip>
</template>

<script>
export default {
  props: {
    statusDoc: { type: String, default: "NONE" },
  },
};
</script>
