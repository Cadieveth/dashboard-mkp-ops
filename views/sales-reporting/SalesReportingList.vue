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
    <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
    <v-dialog v-model="isDialogVisible" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text class="pt-3">
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" class="pb-0">
        <v-card>
          <v-card-title class="">
            <span>Cash/Bank Payment Order Internal</span>
            <!-- <span>Report Cash/Bank Payment Order Internal</span> -->
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <app-autocomplite-ou-company
                  :form-value.sync="form.ouId"
                  :ou-type="'salesReporting'"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6"></v-col>
              <v-col cols="12" md="6">
                <app-autocomplite-partner
                  :form-value.sync="form.partnerId"
                  :partner-type="'salesReporting'"
                ></app-autocomplite-partner>
              </v-col>
              <v-col cols="12" md="6"></v-col>

              <v-col cols="12" md="6" class="pb-0">
                <app-autocomplite-cashbank
                  :value-bank-ou.sync="form.cashbankId"
                  :labelText="cashBank"
                ></app-autocomplite-cashbank>
              </v-col>
              <v-col cols="12" md="6"></v-col>

              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="startDate"
                  :value-date.sync="form.dateFrom"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="endDate"
                  :value-date.sync="form.dateTo"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6"></v-col>

              <v-card-actions class="pl-2 mt-6">
                <v-btn
                  v-show="showSummary"
                  color="primary"
                  small
                  dark
                  @click="exportExcel()"
                >
                  <v-icon dark left>
                    {{ icons.mdiFileExcelOutline }}
                  </v-icon>
                  Download Summary
                </v-btn>
                <v-btn
                  v-show="showDetail"
                  color="info"
                  small
                  dark
                  @click="exportExcelDetail()"
                >
                  <v-icon dark left>
                    {{ icons.mdiFileExcelOutline }}
                  </v-icon>
                  Download Detail
                </v-btn>
              </v-card-actions>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocompliteCashbank from "@core/components/app-autocomplite-ou/AppAutocompliteCashbank";
import Form from "vform";
import axios from "@axios";
import themeConfig from "@themeConfig";
import moment from "moment";
import { required } from "@core/utils/validation";
import {
  mdiTimelineTextOutline,
  mdiCalendar,
  mdiMagnify,
  mdiPlus,
  mdiClose,
  mdiCheckboxMarkedCircleOutline,
  mdiFileExcelOutline,
} from "@mdi/js";
import { isInArray } from "../../../constan";

export default {
  name: "Child",
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppInputFieldDate,
    AppAutocompliteCashbank,
    AppCardLoader,
  },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      cashBank: themeConfig.labeling.cashBank,
      isDialogVisible: false,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,

      // role
      showSummary:
        isInArray(
          "downloadSummaryReportCashBankInternalXlsx",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      showDetail:
        isInArray(
          "downloadDetailReportCashBankInternalXlsx",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      icons: {
        mdiTimelineTextOutline,
        mdiCalendar,
        mdiMagnify,
        mdiPlus,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
        mdiFileExcelOutline,
      },
      form: new Form({
        ouId: -99,
        partnerId: -99,
        cashbankId: -99,
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
    };
  },
  mounted() {
    // this.getDocList();
    // this.refreshData();
    this.$root.$on("appAutocompliteOuCompanySalesReporting", (msg) => {
      this.form.partnerId = -99;
    });
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    exportExcel() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.form.ouId == "" || this.form.ouId == null
          ? -99
          : parseInt(this.form.ouId);
      const partnerId =
        this.form.partnerId == "" || this.form.partnerId == null
          ? -99
          : parseInt(this.form.partnerId);
      const cashbankId =
        this.form.cashbankId == "" || this.form.cashbankId == null
          ? -99
          : parseInt(this.form.cashbankId);
      const dateFrom = moment(this.form.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.form.dateTo).format("YYYYMMDD");

      axios
        .get(
          `${themeConfig.app.api_cb}/report-payment-order-internal/export-coba-xlsx?ouId=${ouId}&partnerId=${partnerId}&cashbankId=${cashbankId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          window.location.replace(
            `${themeConfig.app.link_export}?filename=${response.data.result.filename}`
          );
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    exportExcelDetail() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.form.ouId == "" || this.form.ouId == null
          ? -99
          : parseInt(this.form.ouId);
      const partnerId =
        this.form.partnerId == "" || this.form.partnerId == null
          ? -99
          : parseInt(this.form.partnerId);
      const cashbankId =
        this.form.cashbankId == "" || this.form.cashbankId == null
          ? -99
          : parseInt(this.form.cashbankId);
      const dateFrom = moment(this.form.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.form.dateTo).format("YYYYMMDD");

      axios
        .get(
          `${themeConfig.app.api_cb}/report-detail-payment-order-internal/export-coba-xlsx?ouId=${ouId}&partnerId=${partnerId}&cashbankId=${cashbankId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          window.location.replace(
            `${themeConfig.app.link_export}?filename=${response.data.result.filename}`
          );
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", e.response.data.meta.message);
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
