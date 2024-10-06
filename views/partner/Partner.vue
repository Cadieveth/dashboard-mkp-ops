<template>
  <div>
    <v-row>
      <v-col cols="12" v-show="!formPartnerBank && !formCreatePartner">
        <partner-list></partner-list>
      </v-col>
      <v-col cols="12" v-show="formPartnerBank">
        <partner-bank></partner-bank>
      </v-col>
      <v-col cols="12" v-show="formCreatePartner">
        <partner-form></partner-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PartnerList from "@/views/partner/PartnerList";
import PartnerBank from "@/views/partner/PartnerBank";
import PartnerForm from "@/views/partner/PartnerForm";

export default {
  name: "Parent",
  components: {
    PartnerList,
    PartnerBank,
    PartnerForm,
  },
  data() {
    return {
      formPartnerBank: false,
      formCreatePartner: false,
    };
  },
  mounted() {
    this.$root.$on("formPartnerBank", (msg) => {
      this.formPartnerBank = msg;
    });
    this.$root.$on("formPartner", (msg) => {
      this.formCreatePartner = msg;
    });
  },
};
</script>
