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
          <v-col cols="12" md="3" class="pb-0">
            <app-autocomplite-ou-company
                :form-value.sync="form.ouId"
                :ou-type="'TransferCashbankCreate'"
            ></app-autocomplite-ou-company>
          </v-col>
          <v-col cols="12" md="3" class="pb-0">
            <v-text-field
              label="Account No"
              placeholder="Insert Account No"
              v-model="form.accountNo"
              dense
              hide-details
              ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <app-input-field-date
                :value-date.sync="form.dateFrom"
                :label-title="startDate"
            >
            </app-input-field-date>
          </v-col>
          <v-col cols="12" md="3">
            <app-input-field-date
                :value-date.sync="form.dateTo"
                :label-title="endDate"
            >
            </app-input-field-date>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pl-0">
        <v-row>
          <v-col cols="12">
            <v-btn
                class="ml-4"
                color="primary"
                small
                dark
                @click="sendValueData()"
            >
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import Form from "vform";
import {mdiMagnify} from "@mdi/js";
import themeConfig from "@themeConfig";
import moment from "moment";

export default {
  name: "childFilterCreate",
  components: {
    AppAutocompliteOuCompany,
    AppInputFieldDate
  },
  data(){
    return{
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      dateFromMenu: false,
      dateToMenu: false,
      isDialogVisible: false,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      icons: {
        mdiMagnify
      },
      form: new Form({
        ouId: -99,
        accountNo: '',
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      })
    }
  },
  mounted() {
    this.$root.$on("appAutocompliteOuCompanyTransferCashbankCreate", (msg) => {
      this.form.ouId = msg;
    });
  },
  methods:{
    sendValueData() {
      this.$root.$emit("filterTransferCashbankDoc", this.form);
    },
  }
}
</script>