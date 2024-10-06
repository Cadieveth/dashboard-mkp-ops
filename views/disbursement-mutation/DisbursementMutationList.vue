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
            <span>Disbursement Mutation For Merchant</span>
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
                <app-autocomplite-ou-subbranch-partner
                  :form-value.sync="form.ouSubBranchId"
                  ou-sub-branch-type="disbursementMutation"
                  :multiple="true"
                >
                </app-autocomplite-ou-subbranch-partner>
              </v-col>

              <v-col cols="12" md="3" class="">
                <v-menu
                  v-model="menuStart"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.yearMonth"
                      :label="'Year and Month'"
                      :append-icon="icons.mdiCalendar"
                      dense
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                      :clearable="true"
                      persistent-placeholder
                      :placeholder="phDate"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    type="month"
                    v-model="form.yearMonth"
                    color="primary"
                    :max="new Date().toISOString()"
                    :allowed-dates="null"
                    @input="customMethod"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6"></v-col>
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
import AppAutocompliteOuSubbranchPartner from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranchPartner.vue";
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
  name: "DisbursementMutationChild",
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppInputFieldDate,
    AppAutocompliteCashbank,
    AppAutocompliteOuSubbranchPartner,
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
        yearMonth: "",
        ouSubBranchId: [],
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
    customMethod(value) {
      this.menuStart = false;
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

      const [year, month] = this.form.yearMonth.split("-");

      //   /ssocashbank/report/export-cashbank-disbursement-for-merchant?ouId=10&partnerId=36&year=2023&month=01
      axios
        .get(
          //   `${themeConfig.app.api_fn}/report-invoice-ap/export-invoice-ap-xlsx?ouId=${ouId}&partnerId=${partnerId}&cashbankId=${cashbankId}&dateFrom=${dateFrom}&dateTo=${dateTo}&statusDisbursement=${statusDisbursement}&statusSettledBank=${statusSettledBank}`,
          `${themeConfig.app.api_cb}/report/export-cashbank-disbursement-for-merchant?ouId=${ouId}&partnerId=${partnerId}&year=${year}&month=${month}&ouSubBranchId=${this.form.ouSubBranchId}`,
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
