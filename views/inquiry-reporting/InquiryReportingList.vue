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
            <span>Monitoring Invoice Settlement</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <app-autocomplite-ou-company
                  :form-value.sync="form.ouId"
                  :ou-type="'salesInquiry'"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6"></v-col>

              <v-col cols="12" md="6">
                <app-autocomplite-partner
                  :form-value.sync="form.partnerId"
                  :partner-type="'salesInquiry'"
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

              <v-col cols="12" md="6" class="mt-4">
                <v-row>
                  <v-col cols="12" md="6" class="pb-0">
                    <app-input-field-date
                      :label-title="startDate"
                      :value-date.sync="form.dateFrom"
                    ></app-input-field-date>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0">
                    <app-input-field-date
                      :label-title="endDate"
                      :value-date.sync="form.dateTo"
                    ></app-input-field-date>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6"></v-col>

              <v-col cols="12" md="6" class="mt-2">
                <v-row>
                  <v-col cols="12" md="6" class="pb-0 mt-2">
                    <v-select
                      :items="stsDisburList"
                      v-model="form.statusDisbursement"
                      item-text="text"
                      item-value="value"
                      label="Status Disbursement"
                      hide-details="auto"
                      class="mb-0"
                      dense
                      clearable
                      persistent-placeholder
                      :placeholder="'Select Status Disbursement'"
                    >
                    </v-select>
                  </v-col>

                  <v-col cols="12" md="6" class="pb-0 mt-2">
                    <v-select
                      :items="stldBank"
                      v-model="form.statusSettledBank"
                      item-text="text"
                      item-value="value"
                      label="Settled Bank"
                      hide-details="auto"
                      class="mb-0"
                      dense
                      clearable
                      persistent-placeholder
                      :placeholder="'Select Settled Bank'"
                    >
                    </v-select>
                  </v-col>
                </v-row>
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
      // role
      showDownload:
        isInArray(
          "downloadReportInvoiceSettlementXlsx",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      stldBank: [
        {
          text: "PAID",
          value: "Y",
        },
        {
          text: "NOT PAID",
          value: "N",
        },
      ],
      stsDisburList: [
        {
          text: "FULLFILMENT",
          value: "Y",
        },
        {
          text: "ON FULLFILMENT",
          value: "I",
        },
        {
          text: "NOT FULLFILMENT",
          value: "R ",
        },
      ],
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
        statusDisbursement: "",
        statusSettledBank: "",
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
      const cashbankId =
        this.form.cashbankId == "" || this.form.cashbankId == null
          ? -99
          : parseInt(this.form.cashbankId);
      const dateFrom = moment(this.form.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.form.dateTo).format("YYYYMMDD");
      const statusDisbursement =
        this.form.statusDisbursement == "" ||
        this.form.statusDisbursement == null
          ? ""
          : this.form.statusDisbursement;
      const statusSettledBank =
        this.form.statusSettledBank == "" || this.form.statusSettledBank == null
          ? ""
          : this.form.statusSettledBank;

      axios
        .get(
          `${themeConfig.app.api_fn}/report-invoice-ap/export-invoice-ap-xlsx?ouId=${ouId}&partnerId=${partnerId}&cashbankId=${cashbankId}&dateFrom=${dateFrom}&dateTo=${dateTo}&statusDisbursement=${statusDisbursement}&statusSettledBank=${statusSettledBank}`,
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
