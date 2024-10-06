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
    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-title>
            <span>Report Sales Order Revenue By Partner</span>
          </v-card-title>
          <v-card-text>
            <v-row cols="6" md="6">
              <v-col cols="12" md="6">
                <app-autocomplite-ou-company
                  :form-value.sync="form.ouId"
                  :ou-type="'orderReporting'"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6"></v-col>
              <v-col cols="12" md="6">
                <app-autocomplite-partner
                  :form-value.sync="form.partnerId"
                  :partner-type="'orderReporting'"
                ></app-autocomplite-partner>
              </v-col>
              <v-col cols="12" md="6"></v-col>
              <v-col class="mt-2">
                <v-row>
                  <v-col cols="12" md="3" sm="6" class="pb-0">
                    <app-input-field-date
                      :label-title="startDate"
                      :value-date.sync="form.dateFrom"
                    ></app-input-field-date>
                  </v-col>
                  <v-col cols="12" md="3" sm="6" class="pb-0">
                    <app-input-field-date
                      :label-title="endDate"
                      :value-date.sync="form.dateTo"
                    ></app-input-field-date>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-4">
            <v-btn
              v-show="showDownload"
              color="primary"
              small
              dark
              @click="exportExcel()"
            >
              <v-icon dark left>
                {{ icons.mdiFileExcelOutline }}
              </v-icon>
              Download
            </v-btn>
          </v-card-actions>
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
      dateFromMenu: false,
      dateToMenu: false,
      isDialogVisible: false,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,

      // role
      showDownload:
        isInArray(
          "downloadReportSalesOrderRevenuePartnerXlsx",
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
    this.$root.$on("appAutocompliteOuCompanyOrderReporting", (msg) => {
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
          `${themeConfig.app.api_sl}/report-sales-order/export-sales-order-xlsx?ouId=${ouId}&partnerId=${partnerId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
          config
        )
        .then((response) => {
          window.location.replace(
            `${themeConfig.app.link_export}?filename=${response.data.result.filename}`
          );
          this.isDialogVisible = false;
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
