<template>
  <div>
    <v-row>
      <v-col cols="12">
        <type-partner-list></type-partner-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import TypePartnerList from "@/views/type-partner/TypePartnerList"

export default {
  name: "Parent",
  components: {
    TypePartnerList,
  },
  data() {
    return {
      formTypePartner: false,
    };
  },
  mounted() {
    this.$root.$on("formPartner", (msg) => {
      this.formTypePartner = msg;
    });
  },
};
</script>