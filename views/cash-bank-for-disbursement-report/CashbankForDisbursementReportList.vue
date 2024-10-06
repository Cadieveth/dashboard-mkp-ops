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
            <span>Disbursement</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <app-autocomplite-ou-company
                  :form-value.sync="form.ouId"
                  :ou-type="'disbursementMutation'"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6"></v-col>

              <v-col cols="12" md="6">
                <app-autocomplite-partner
                  :form-value.sync="form.partnerId"
                  :partner-type="'disbursementMutation'"
                ></app-autocomplite-partner>
              </v-col>
              <v-col cols="12" md="6"> </v-col>

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
                <v-col cols="12" md="6"> </v-col>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-8">
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
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import { generateUUID, isInArray } from "../../../constan";
import themeConfig from "@themeConfig";
import {
  mdiCalendar,
  mdiCheckboxMarkedCircleOutline,
  mdiClose,
  mdiFileExcelOutline,
  mdiMagnify,
  mdiPlus,
  mdiTimelineTextOutline,
} from "@mdi/js";
import Form from "vform";
import axios from "@axios";
import moment from "moment";

export default {
  name: "DisbursementReportChild",
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppInputFieldDate,
    AppCardLoader,
  },
  data() {
    return {
      // role
      showDownload:
        isInArray(
          "downloadReportInvoiceSettlementXlsx",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      menuStart: false,
      menuEnd: false,
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      cashBank: themeConfig.labeling.cashBank,
      formManageFlow: true,
      dateFromMenu: false,
      dateToMenu: false,
      isDialogVisible: false,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      phDate: themeConfig.placeholder.date,

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
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
    };
  },
  mounted() {
    this.$root.$on("appAutocompliteOuCompanySalesInquiry", (msg) => {
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
      let formData = new FormData();
      formData.append(
        "tenantId",
        JSON.parse(this.$session.get("userData")).tid
      );
      formData.append("ouId", ouId);
      formData.append("partnerId", partnerId);
      formData.append("userId", JSON.parse(this.$session.get("userData")).uid);
      formData.append("sessionId", generateUUID());
      formData.append(
        "username",
        JSON.parse(this.$session.get("userData")).username
      );
      formData.append(
        "dateFrom",
        moment(this.form.dateFrom).format("YYYYMMDD")
      );
      formData.append("dateTo", moment(this.form.dateTo).format("YYYYMMDD"));
      axios
        .post(
          `${themeConfig.app.api_rp}/cashbank/ReportDisbursementAdvanceExcel`,
          formData,
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
