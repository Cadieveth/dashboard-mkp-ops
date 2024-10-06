<template>
  <div>
    <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title
            ><span>Summary Disbursement by Payment Method</span></v-card-title
          >
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <app-autocomplite-ou-company
                  :form-value.sync="form.ouId"
                  :ou-type="'disbursementMutation'"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6">
                <app-autocomplite-partner
                  :form-value.sync="form.partnerId"
                  :partner-type="'disbursementMutation'"
                ></app-autocomplite-partner>
              </v-col>
              <v-col cols="12" md="6">
                <app-autocomplite-payment-method
                  :form-value.sync="form.paymentMethod"
                ></app-autocomplite-payment-method>
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
          <v-card-actions class="mt-4">
            <v-btn color="primary" small dark @click="refreshData()">
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
            <v-btn color="primary" small dark @click="exportExcel()">
              <v-icon dark left>
                {{ icons.mdiFileExcelOutline }}
              </v-icon>
              Download
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="mainData"
              fixed-header
              hide-default-footer
              dense
            >
              <!--header-->
              <template #[`header.ou`]>
                {{ ouName }}
              </template>

              <template #[`item.amount`]="{ item }">
                Rp.{{ number_format(item.amount) }}
              </template>

              <!-- Unit Business -->
              <template #[`item.ou`]="{ item }">
                <div>
                  <div class="d-flex flex-column ms-3 ml-0">
                    <span
                      class="
                        d-block
                        text--primary
                        font-weight-semibold
                        text-truncate
                      "
                      >{{ item.ouName }}</span
                    >
                    <span class="text-xs">{{ item.ouCode }}</span>
                  </div>
                </div>
              </template>

              <!-- Mitra -->
              <template #[`item.mitra`]="{ item }">
                <div>
                  <div class="d-flex flex-column ms-3 ml-0">
                    <span
                      class="
                        d-block
                        text--primary
                        font-weight-semibold
                        text-truncate
                      "
                      >{{ item.partnerName }}</span
                    >
                    <span class="text-xs">{{ item.partnerCode }}</span>
                  </div>
                </div>
              </template>

              <!-- penerima-->
              <template #[`item.penerima`]="{ item }">
                <div class="d-flex align-center">
                  <v-avatar color="#e6e6e6" size="30">
                    <v-img
                      :src="
                        require(`@/assets/images/logos/bank_logo/${item.paymentChannelCode}_logo.png`)
                      "
                    ></v-img>
                  </v-avatar>

                  <div class="d-flex flex-column ms-3">
                    <span
                      class="
                        d-block
                        text--primary
                        font-weight-semibold
                        text-truncate
                      "
                      >{{ item.paymentMethodCode }}</span
                    >
                  </div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppAutocomplitePaymentMethod from "@core/components/app-autocomplite-ou/AppAutocomplitePaymentMethod";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import Form from "vform";
import moment from "moment";
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
import axios from "@axios";
import { generateUUID, number_format } from "../../../constan";

export default {
  name: "childList",
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppAutocomplitePaymentMethod,
    AppInputFieldDate,
    AppCardLoader,
  },
  data() {
    return {
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
      ouName: themeConfig.labeling.ouTblSB,

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
        paymentMethod: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      mainData: [],
      headers: [
        {
          text: "Unit Bisnis",
          value: "ou",
          width: "300px",
        },
        {
          text: "Partner",
          value: "mitra",
          width: "150px",
        },
        {
          text: "Payment Method",
          value: "penerima",
          width: "250px",
        },
        {
          text: "Amount",
          align: "right",
          value: "amount",
          width: "150px",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("appAutocompliteOuCompanySalesInquiry", (msg) => {
      this.form.partnerId = -99;
    });
    this.refreshData();
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
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
      formData.append("paymentMethod", this.form.paymentMethod);
      axios
        .post(
          `${themeConfig.app.api_rp}/cashbank/ReportDisbursementSummaryExcel`,
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
    refreshData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      console.log(config);
      const partnerId =
        this.form.partnerId == "" ? -99 : parseInt(this.form.partnerId);
      const ouId = this.form.ouId == "" ? -99 : parseInt(this.form.ouId);

      axios
        .get(
          `${
            themeConfig.app.api_cb
          }/disbursement/summary-by-payment-method?ouId=${ouId}&partnerId=${partnerId}&paymentMethod=${
            this.form.paymentMethod
          }&dateFrom=${moment(this.form.dateFrom).format(
            "YYYYMMDD"
          )}&dateTo=${moment(this.form.dateTo).format("YYYYMMDD")}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainData = response.data.result;
          } else {
            this.mainData = [];
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status == 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Gagal", e.response.data.meta.message);
        });
    },
  },
};
</script>
