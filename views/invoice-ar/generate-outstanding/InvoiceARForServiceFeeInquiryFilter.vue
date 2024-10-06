<template>
  <v-card flat>
    <v-card-title><span>Filter</span></v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3" sm="6" class="pb-0">
          <app-autocomplite-ou-bu-main
            :form-value.sync="filterForm.ouId"
            :ou-type="'temporaryInvoicingTransactional'"
          ></app-autocomplite-ou-bu-main>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0">
          <v-autocomplete
            :label="partner"
            v-model="filterForm.partnerId"
            :items="partnerList"
            item-text="partnerName"
            item-value="id"
            class="mb-0"
            dense
            hide-details
            persistent-placeholder
            :placeholder="phPartner"
            clearable
          ></v-autocomplete>
        </v-col>
        <!-- <v-col cols="12" md="3" sm="6" class="pb-0">
          <app-autocomplite-status
            :form-value.sync="filterForm.status"
          ></app-autocomplite-status>
        </v-col> -->

        <v-col cols="12" md="3" class="pb-0">
          <app-input-field-date
            :label-title="'Start Date'"
            :value-date.sync="filterForm.dateFrom"
          ></app-input-field-date>
        </v-col>
        <v-col cols="12" md="3" class="pb-0">
          <app-input-field-date
            :label-title="'End Date'"
            :value-date.sync="filterForm.dateFrom"
          ></app-input-field-date>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
          <v-text-field
            dense
            :label="docNo"
            v-model="filterForm.keyword"
            hide-details
            persistent-placeholder
            :placeholder="phDocNo"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-6">
      <v-btn small dark color="primary" @click="refreshData()">
        <v-icon dark left>
          {{ icons.mdiMagnify }}
        </v-icon>
        Filter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import AppAutocompliteOuBuMain from "@core/components/app-autocomplite-ou/AppAutocompliteOuBuMain";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppAutocompliteStatus from "@core/components/app-autocomplite-ou/AppAutocompliteStatus";
import AppInputFieldDate from "@/@core/components/app-input-field/AppInputFieldDate.vue";
import Form from "vform";
import { mdiMagnify } from "@mdi/js";
import themeConfig from "@themeConfig";
import axios from "@axios";
import moment from "moment";

export default {
  name: "ChildFilter",
  components: {
    AppAutocompliteOuBuMain,
    AppAutocomplitePartner,
    AppAutocompliteStatus,
    AppInputFieldDate,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      partner: themeConfig.labeling.partner,
      phPartner: themeConfig.placeholder.partner,
      phDocNo: themeConfig.placeholder.docNo,

      filterForm: new Form({
        ouId: -99,
        partnerId: -99,
        // status: "",
        keyword: "",
        dateFrom: moment().format("YYYY-MM-DD"),
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      icons: {
        mdiMagnify,
      },
      partnerList: [],
    };
  },
  mounted() {
    this.$root.$on(
      "appAutocompliteOuBuMainTemporaryInvoicingTransactional",
      (msg) => {
        this.getPartnerList(msg);
        this.filterForm.partnerId = -99;
      }
    );
  },
  methods: {
    getPartnerList(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/partner/list`,
          {
            ctgrPartnerId: -99,
            ouId: id == null ? -99 : parseInt(id),
            limit: 1000,
            offset: 0,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.partnerList = response.data.result);
          this.partnerList = [];
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
    refreshData() {
      this.$root.$emit("inquirySummaryARForServiceFee", this.filterForm);
    },
  },
};
</script>
