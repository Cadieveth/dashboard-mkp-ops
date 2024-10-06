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
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <!-- <span>Daily Report Cash/Bank</span> -->
            <span>Daily Report </span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" sm="6" class="pb-0">
                <app-autocomplite-ou
                  :form-value.sync="form.ouId"
                  :ou-type="'cashbankDailyDisbursement'"
                ></app-autocomplite-ou>
              </v-col>
              <v-col cols="12" md="4" sm="6" class="pb-0">
                <app-autocomplite-cashbank-ou
                  :value-bank-ou.sync="form.cashbankId"
                  :label-text="cashBank"
                  :cashbank-type="'cashbankDailyDisbursement'"
                ></app-autocomplite-cashbank-ou>
              </v-col>
              <v-col cols="12" md="2" sm="6" class="pb-0">
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
                      v-model="form.dateFrom"
                      :label="startDate"
                      :append-icon="icons.mdiCalendar"
                      readonly
                      dense
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.dateFrom"
                    color="primary"
                    @input="menuStart = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="2" sm="6" class="pb-0">
                <v-menu
                  v-model="menuEnd"
                  :close-on-content-click="false"
                  :nudge-left="100"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.dateTo"
                      :label="endDate"
                      :append-icon="icons.mdiCalendar"
                      readonly
                      dense
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.dateTo"
                    color="primary"
                    @input="menuEnd = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-6 mb-n6">
            <v-btn color="primary" small dark @click="refreshData()">
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
            <v-btn
              color="info"
              small
              dark
              @click="exportExcel()"
              v-show="showExport"
            >
              <v-icon dark left>
                {{ icons.mdiFileExcelOutline }}
              </v-icon>
              Export Excel
            </v-btn>
          </v-card-actions>
          <v-card-text class="mt-6">
            <!-- <v-row>
              <v-col cols="12" md="3">
                <app-component-drop-down
                  selected-items.sync
                ></app-component-drop-down>
              </v-col>
            </v-row> -->
            <v-row>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="saldoAwal.change"
                  :color="saldoAwal.color"
                  :icon="saldoAwal.icon"
                  :statistics="saldoAwal.beginningBalance"
                  :stat-title="saldoAwal.statTitle"
                  :subtitle="saldoAwal.subtitle"
                ></statistics-card-summary>
              </v-col>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="saldoDebit.change"
                  :color="saldoDebit.color"
                  :icon="saldoDebit.icon"
                  :statistics="saldoDebit.debitAmount"
                  :stat-title="saldoDebit.statTitle"
                  :subtitle="saldoDebit.subtitle"
                ></statistics-card-summary>
              </v-col>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="saldoCredit.change"
                  :color="saldoCredit.color"
                  :icon="saldoCredit.icon"
                  :statistics="saldoCredit.creditAmount"
                  :stat-title="saldoCredit.statTitle"
                  :subtitle="saldoCredit.subtitle"
                ></statistics-card-summary>
              </v-col>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="saldoAkhir.change"
                  :color="saldoAkhir.color"
                  :icon="saldoAkhir.icon"
                  :statistics="saldoAkhir.balanceAmount"
                  :stat-title="saldoAkhir.statTitle"
                  :subtitle="saldoAkhir.subtitle"
                ></statistics-card-summary>
              </v-col>
            </v-row>
          </v-card-text>
          <!-- <v-card-title>
            <span>Daily Report</span>
          </v-card-title> -->
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="mainData"
              :footer-props="{
                'items-per-page-options': [25, 50, 100],
              }"
              fixed-header
            >
              <template #[`header.docNo`]>
                {{ docNo }}
              </template>
              <template #[`header.tanggalDoc`]>
                {{ docDate }}
              </template>
              <template #[`header.remark`]>
                {{ remark }}
              </template>

              <!-- format tanggal-->
              <template #[`item.tanggalDoc`]="{ item }">
                {{ item.docDate == "" ? "" : tglFormat(item.docDate) }}
              </template>
              <template #[`item.refPaymentNo`]="{ item }">
                <div class="d-flex flex-column">
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.refPaymentNo }}</span
                  >
                  <span class="">
                    {{
                      item.refPaymentDate == ""
                        ? ""
                        : dateFormat(item.refPaymentDate)
                    }}
                  </span>
                </div>
              </template>

              <template #[`item.bank`]="{ item }">
                <div class="d-flex align-center">
                  <v-avatar v-if="item.logoImage" color="#e6e6e6" size="30">
                    <v-img
                      :src="
                        require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                      "
                    ></v-img>
                  </v-avatar>
                  <span v-else> - </span>
                  <div class="d-flex flex-column ms-3">
                    <span
                      class="
                        d-block
                        text--primary
                        font-weight-semibold
                        text-truncate
                      "
                      >{{ item.accountName }}</span
                    >
                    <span class="text-xs">{{ item.accountNo }}</span>
                  </div>
                </div>
              </template>

              <!-- format uang-->
              <template #[`item.debit`]="{ item }">
                <span
                  class="font-weight-semibold"
                  :class="
                    item.debitAmount > 0 ? 'success--text' : 'secondary--text'
                  "
                >
                  Rp.{{ number_format(item.debitAmount) }}
                </span>
              </template>
              <template #[`item.credit`]="{ item }">
                <span
                  class="font-weight-semibold"
                  :class="
                    item.creditAmount < 0 ? 'error--text' : 'secondary--text'
                  "
                >
                  Rp.{{ number_format(item.creditAmount) }}
                </span>
              </template>
              <template #[`item.grand`]="{ item }">
                <span
                  class="font-weight-semibold"
                  :class="
                    item.balanceAmount !== 0
                      ? 'primary--text'
                      : 'secondary--text'
                  "
                >
                  Rp.{{ number_format(item.balanceAmount) }}
                </span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import axios from "@axios";
import themeConfig from "@themeConfig";

import Form from "vform";
import moment from "moment";
import {
  mdiCalendar,
  mdiCurrencyUsd,
  mdiFileExcelOutline,
  mdiMagnify,
  mdiTrendingDown,
  mdiTrendingUp,
} from "@mdi/js";
import { dateFormat, isInArray, number_format } from "../../../constan";

import StatisticsCardSummary from "@core/components/statistics-card/StatisticsCardSummary";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppAutocompliteCashbankOu from "@core/components/app-autocomplite-ou/AppAutocompliteCashbankOu";
import AppComponentDropDown from "@core/components/app-component/AppComponentDropDown";

import Vue from "vue";
export default {
  name: "Child",
  components: {
    StatisticsCardSummary,
    AppAutocompliteOu,
    AppAutocompliteCashbankOu,
    AppCardLoader,
    AppComponentDropDown,
  },
  data() {
    return {
      cashBank: themeConfig.labeling.cashBank,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      remark: themeConfig.labeling.keterangan,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      isDialogVisible: false,
      menuStart: false,
      menuEnd: false,
      showExport:
        isInArray(
          "downloadReportDailyCashbankXlsx",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      mainData: [],
      ouList: [],
      cashbankList: [],
      icons: { mdiCalendar, mdiMagnify, mdiFileExcelOutline },
      form: new Form({
        ouId: -99,
        cashbankId: -99,
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      headers: [
        // {
        //   text: 'Action', align: 'center', value: 'actions', sortable: false, width: '125px'
        // },
        {
          text: "Doc Type",
          value: "docTypeDesc",
          width: "180px",
        },
        {
          text: "Nomor Dokumen",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Tanggal Dokumen",
          value: "tanggalDoc",
          width: "120px",
        },
        {
          text: "Payment Date & No",
          value: "refPaymentNo",
          width: "160px",
        },
        // {
        //   text: "Payment Date",
        //   value: "tanggalPay",
        //   width: "150px",
        // },
        {
          text: "Bank",
          value: "bank",
          width: "100px",
        },
        {
          text: "Debit Amount",
          value: "debit",
          width: "150px",
          align: "right",
        },
        {
          text: "Credit Amount",
          value: "credit",
          width: "150px",
          align: "right",
        },
        {
          text: "Balance Amount",
          value: "grand",
          width: "150px",
          align: "right",
        },
        {
          text: "Keterangan",
          value: "remark",
          width: "300px",
        },
      ],
      saldoAwal: {
        statTitle: "Beginning Balance",
        icon: mdiCurrencyUsd,
        color: "warning",
        subtitle: "",
        beginningBalance: "Rp0",
      },
      saldoDebit: {
        statTitle: "Debit Amount",
        icon: mdiTrendingUp,
        color: "success",
        subtitle: "",
        debitAmount: "Rp0",
      },
      saldoCredit: {
        statTitle: "Credit Amount",
        icon: mdiTrendingDown,
        color: "error",
        subtitle: "",
        creditAmount: "Rp0",
      },
      saldoAkhir: {
        statTitle: "Balance Amount",
        icon: mdiCurrencyUsd,
        color: "primary",
        subtitle: "",
        balanceAmount: "Rp0",
      },
    };
  },
  mounted() {
    this.refreshData();
    this.$root.$on("appAutocompliteOu", (msg) => {
      // this.getCashBank(msg)
      this.$root.$emit("appAutocompliteOuCashbank", msg);
    });
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    tglFormat(value) {
      var parts = value.split("/");
      var mydate = parts[2] + parts[1] + parts[0];
      return dateFormat(mydate);
    },
    dateFormat(value) {
      return dateFormat(value);
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
      axios
        .get(
          `${themeConfig.app.api_cb}/report/export-daily-cashbank-xlsx?ouId=${
            this.form.ouId
          }&cashbankId=${this.form.cashbankId}&dateFrom=${moment(
            this.form.dateFrom
          ).format("YYYYMMDD")}&dateTo=${moment(this.form.dateTo).format(
            "YYYYMMDD"
          )}`,
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
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_cb}/report/daily-cashbank?ouId=${
            this.form.ouId
          }&cashbankId=${this.form.cashbankId}&dateFrom=${moment(
            this.form.dateFrom
          ).format("YYYYMMDD")}&dateTo=${moment(this.form.dateTo).format(
            "YYYYMMDD"
          )}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainData = response.data.result.detail;
            this.mainData.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainData[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainData[index].logoImage =
                    this.mainData[index].bankCode;
                }
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
              }
            });
            if (response.data.result.header !== null) {
              this.saldoAwal.beginningBalance =
                "Rp" +
                number_format(
                  response.data.result.header.beginningBalance,
                  2,
                  ",",
                  "."
                );
              this.saldoDebit.debitAmount =
                "Rp" +
                number_format(
                  response.data.result.header.debitAmount,
                  2,
                  ",",
                  "."
                );
              this.saldoCredit.creditAmount =
                "Rp" +
                number_format(
                  response.data.result.header.creditAmount,
                  2,
                  ",",
                  "."
                );
              this.saldoAkhir.balanceAmount =
                "Rp" +
                number_format(
                  response.data.result.header.balanceAmount,
                  2,
                  ",",
                  "."
                );
            } else {
              this.saldoAwal.beginningBalance = "Rp0";
              this.saldoDebit.debitAmount = "Rp0";
              this.saldoCredit.creditAmount = "Rp0";
              this.saldoAkhir.balanceAmount = "Rp0";
            }
          } else {
            this.mainData = [];
            this.saldoAwal.beginningBalance = "Rp0";
            this.saldoDebit.debitAmount = "Rp0";
            this.saldoCredit.creditAmount = "Rp0";
            this.saldoAkhir.balanceAmount = "Rp0";
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.meta.message);
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
