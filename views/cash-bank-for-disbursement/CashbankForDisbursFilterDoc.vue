<template>
  <v-card flat>
    <v-card-title><span></span></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3" sm="6" class="pb-0">
          <app-autocomplite-ou-company
            :form-value.sync="filterForm.ouId"
            :readOnly="false"
          ></app-autocomplite-ou-company>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0">
          <app-input-field-date
            :value-date.sync="filterForm.dateFrom"
            :label-title="startDate"
          >
          </app-input-field-date>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0">
          <app-input-field-date
            :value-date.sync="filterForm.dateTo"
            :label-title="endDate"
          >
          </app-input-field-date>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0">
          <app-autocomplite-bank
            :value-bank.sync="filterForm.bankCode"
          ></app-autocomplite-bank>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
          <v-text-field
            :label="docNo"
            v-model="filterForm.docNo"
            persistent-placeholder
            placeholder="Insert Document No"
            dense
            class="mb-0"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" sm="6" class="pb-0 mt-2">
          <v-text-field
            label="Remark"
            v-model="filterForm.remark"
            persistent-placeholder
            placeholder="Insert Remark"
            dense
            class="mb-0"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-4">
      <v-btn color="primary" small dark @click="refreshDocList()">
        <v-icon dark left>
          {{ icons.mdiMagnify }}
        </v-icon>
        Filter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocompliteBank from "@core/components/app-autocomplite-ou/AppAutocompliteBank";
import AppInputFieldDate from "@/@core/components/app-input-field/AppInputFieldDate.vue";
import { mdiMagnify } from "@mdi/js";
import Form from "vform";
import moment from "moment";
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "ChildFilterDokument",
  components: {
    AppAutocompliteOuCompany,
    AppAutocompliteBank,
    AppInputFieldDate,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      labelDocNo: themeConfig.labeling.docNo,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      docDate: themeConfig.labeling.docDate,

      menuStart: false,
      menuEnd: false,
      icons: {
        mdiMagnify,
      },
      filterForm: new Form({
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        docNo: "",
        ouId: -99,
        bankCode: "",
        remark: "",
      }),
    };
  },
  mounted() {
    this.getBank();
    this.$root.$on("appAutocompliteOuCompany", (msg) => {
      this.filterForm.ouId = msg;
    });
  },
  methods: {
    refreshDocList() {
      this.$root.$emit("filterDisbursementDoc", this.filterForm);
    },
    getBank() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/combo/list?comboId=BANK`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.bankList = response.data.result);
          this.bankList = [];
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
  },
};
</script>
