<template>
  <div>
    <v-snackbar
        top
        v-model="snackbar"
        :timeout="timeout"
        :color="color"
        outlined
        text
    >
      {{ text }}
    </v-snackbar>
    <v-card flat>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <app-autocomplite-ou-company
                :form-value.sync="form.ouId"
                :ou-type="'TransferCashbankCreate'"
            ></app-autocomplite-ou-company>
          </v-col>
          <v-col cols="6">
            <app-autocomplite-cashbank-user
                :value-bank-ou.sync="form.cashbankFromId"
                :label-text="'Source Bank'"
                @change="sendValueData()"
            ></app-autocomplite-cashbank-user>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
  import AppAutocompliteCashbankUser from "@core/components/app-autocomplite-ou/AppAutocompliteCashbankUser";
  import Form from "vform";
  import {mdiMagnify} from "@mdi/js";

  export default {
    name: "childFilterCreate",
    components: {
      AppAutocompliteOuCompany,
      AppAutocompliteCashbankUser
    },
    data(){
      return{
        snackbar: false,
        text: "",
        timeout: 2000,
        color: "",
        icons: {
          mdiMagnify
        },
        form: new Form({
          ouId: -99,
          cashbankFromId: -99,
        })
      }
    },
    mounted() {
      this.$root.$on("filterTransferCreateSourceBank", (msg) => {
        this.sendValueData()
      });
      this.$root.$on("appAutocompliteOuCompanyTransferCashbankCreate", (msg) => {
        this.form.ouId = msg;
        this.sendValueData()
      });
    },
    methods:{
      sendValueData() {
        console.log(this.form)
        this.$root.$emit("filterTransferCashbankCreate", this.form);
      },
    }
  }
</script>