<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        v-show="!formOuCashBank"
        >
        <ou-list></ou-list>
      </v-col>
      <v-col
        cols="12"
        v-show="formOuCashBank"
        >
        <ou-cash-bank></ou-cash-bank>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import OuList from "@/views/ou/OuList";
import OuCashBank from "@/views/ou/OuCashBank";
export default {
  name: 'Parent',
  components: {
    OuList,
    OuCashBank
  },
  data() {
    return {
      formOuCashBank: false
    }
  },
  mounted() {
    this.$root.$on('formOuCashBank', msg => {
      this.formOuCashBank = msg
    })
  }
}
</script>