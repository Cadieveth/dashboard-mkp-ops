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
      <v-col cols="12" class="pb-0">
        <v-card>
          <v-card-title
            ><span>Inquiry Progress Bank Reconcile</span></v-card-title
          >
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="pb-0">
                <app-autocomplite-ou-company
                  :form-value.sync="filterForm.ouId"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <app-input-field-date
                  :value-date.sync="filterForm.cashbankDate"
                  :label-title="cashBankDate"
                ></app-input-field-date>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-4">
            <v-btn small dark color="primary" @click="refreshPage()">
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
            <v-btn
              small
              dark
              color="info"
              @click="releaseData()"
              v-show="mainData.length > 0 && showRelease"
            >
              <v-icon dark left>
                {{ icons.mdiCheckAll }}
              </v-icon>
              Process Bank Reconcile
            </v-btn>
          </v-card-actions>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="2" class="pb-0">
                <statistic-card-summary-vertical
                  :change="totalTodo.change"
                  :color="totalTodo.color"
                  :icon="totalTodo.icon"
                  :statistics="totalTodo.statistics"
                  :stat-title="totalTodo.statTitle"
                  :subtitle="totalTodo.subtitle"
                ></statistic-card-summary-vertical>
              </v-col>
              <v-col cols="12" md="2" class="pb-0">
                <statistic-card-summary-vertical
                  :change="totalInProgress.change"
                  :color="totalInProgress.color"
                  :icon="totalInProgress.icon"
                  :statistics="totalInProgress.statistics"
                  :stat-title="totalInProgress.statTitle"
                  :subtitle="totalInProgress.subtitle"
                ></statistic-card-summary-vertical>
              </v-col>
              <v-col cols="12" md="2" class="pb-0">
                <statistic-card-summary-vertical
                  :change="totalError.change"
                  :color="totalError.color"
                  :icon="totalError.icon"
                  :statistics="totalError.statistics"
                  :stat-title="totalError.statTitle"
                  :subtitle="totalError.subtitle"
                ></statistic-card-summary-vertical>
              </v-col>
              <v-col cols="12" md="2" class="pb-0">
                <statistic-card-summary-vertical
                  :change="totalOnReview.change"
                  :color="totalOnReview.color"
                  :icon="totalOnReview.icon"
                  :statistics="totalOnReview.statistics"
                  :stat-title="totalOnReview.statTitle"
                  :subtitle="totalOnReview.subtitle"
                ></statistic-card-summary-vertical>
              </v-col>
              <v-col cols="12" md="2" class="pb-0">
                <statistic-card-summary-vertical
                  :change="totalBeingReleased.change"
                  :color="totalBeingReleased.color"
                  :icon="totalBeingReleased.icon"
                  :statistics="totalBeingReleased.statistics"
                  :stat-title="totalBeingReleased.statTitle"
                  :subtitle="totalBeingReleased.subtitle"
                ></statistic-card-summary-vertical>
              </v-col>
              <v-col cols="12" md="2" class="pb-0">
                <statistic-card-summary-vertical
                  :change="totalDone.change"
                  :color="totalDone.color"
                  :icon="totalDone.icon"
                  :statistics="totalDone.statistics"
                  :stat-title="totalDone.statTitle"
                  :subtitle="totalDone.subtitle"
                ></statistic-card-summary-vertical>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="mt-8">
            <v-data-table
              :headers="headers"
              :items="mainData"
              hide-default-footer
              disable-pagination
              fixed-header
              dense
            >
              <template #[`header.ou`]>
                {{ ouTbl }}
              </template>
              <template #[`header.bank`]>
                {{ beneficiaryBank }}
              </template>

              <!-- format uang-->
              <template #[`item.creditAmount`]="{ item }">
                Rp.{{ number_format(item.creditAmount) }}
              </template>
              <template #[`item.debitAmount`]="{ item }">
                Rp.{{ number_format(item.debitAmount) }}
              </template>
              <template #[`item.balance`]="{ item }">
                Rp.{{ number_format(item.creditAmount - item.debitAmount) }}
              </template>

              <!-- Unit Bisnis -->
              <template #[`item.ou`]="{ item }">
                <div>
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
              </template>

              <template #[`item.bank`]="{ item }">
                <div class="d-flex align-center">
                  <v-avatar v-if="item.bankCode" color="#e6e6e6" size="30">
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
                      >{{ item.cashbankName }}</span
                    >
                    <span class="text-xs">{{ item.cashbankCode }}</span>
                  </div>
                </div>
              </template>

              <template #[`item.akun`]="{ item }">
                <div class="d-flex align-center">
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

              <template #[`item.status`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.debitAmount == 0 && item.creditAmount == 0
                      ? 'warning'
                      : item.debitAmount == item.creditAmount
                      ? 'success'
                      : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="
                    item.debitAmount == 0 && item.creditAmount == 0
                      ? 'warning'
                      : item.debitAmount == item.creditAmount
                      ? 'success'
                      : 'error'
                  "
                >
                  {{
                    item.debitAmount == 0 && item.creditAmount == 0
                      ? "NO RECONCILIATION"
                      : item.debitAmount == item.creditAmount
                      ? "MATCH"
                      : "NOT MATCH"
                  }}
                </v-chip>
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
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import StatisticCardSummaryVertical from "@core/components/statistics-card/StatisticCardSummaryVertical";
import Form from "vform";
import moment from "moment";
import {
  mdiBook,
  mdiBookAlertOutline,
  mdiBookCancelOutline,
  mdiBookCheckOutline,
  mdiBookClockOutline,
  mdiBookMultipleOutline,
  mdiBookSyncOutline,
  mdiCheckAll,
  mdiMagnify,
  mdiPoll,
} from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import { number_format } from "../../../constan";

export default {
  name: "ChildList",
  components: {
    AppAutocompliteOu,
    AppAutocompliteOuCompany,
    AppInputFieldDate,
    StatisticCardSummaryVertical,
    AppCardLoader,
  },
  data() {
    return {
      cashBankDate: themeConfig.labeling.cashBankDate,
      ouTbl: themeConfig.labeling.ouTbl,
      beneficiaryBank: themeConfig.labeling.beneficiaryBank,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      isDialogVisible: false,
      mainData: [],
      showRelease: false,
      filterForm: new Form({
        ouId: -99,
        cashbankDate: moment().format("YYYY-MM-DD"),
      }),
      icons: {
        mdiMagnify,
        mdiCheckAll,
      },
      headers: [
        {
          text: "Unit Bisnis",
          value: "ou",
          width: "200px",
        },
        {
          text: "Cash/Bank",
          value: "bank",
          width: "200px",
        },
        {
          text: "Account",
          value: "akun",
          width: "200px",
        },
        // {
        //   text: "Credit Amount",
        //   value: "creditAmount",
        //   width: "150px",
        //   align: "right",
        // },
        {
          text: "Debit Amount",
          value: "debitAmount",
          width: "150px",
          align: "right",
        },
        // {
        //   text: "O/S Amount",
        //   value: "balance",
        //   width: "150px",
        //   align: "right",
        // },
        // {
        //   text: "Status",
        //   value: "status",
        //   width: "100px",
        // },
      ],
      totalTodo: {
        statTitle: "Todo",
        icon: mdiBookMultipleOutline,
        color: "secondary",
        subtitle: "Weekly Project",
        statistics: "0",
        change: "",
      },
      totalInProgress: {
        statTitle: "In Progress",
        icon: mdiBookAlertOutline,
        color: "warning",
        subtitle: "Weekly Project",
        statistics: "0",
        change: "",
      },
      totalError: {
        statTitle: "Error",
        icon: mdiBookCancelOutline,
        color: "error",
        subtitle: "Weekly Project",
        statistics: "0",
        change: "",
      },
      totalOnReview: {
        statTitle: "On Review",
        icon: mdiBookSyncOutline,
        color: "primary",
        subtitle: "Weekly Project",
        statistics: "0",
        change: "",
      },
      totalBeingReleased: {
        statTitle: "Being Released",
        icon: mdiBookClockOutline,
        color: "info",
        subtitle: "Weekly Project",
        statistics: "0",
        change: "",
      },
      totalDone: {
        statTitle: "Done",
        icon: mdiBookCheckOutline,
        color: "success",
        subtitle: "Weekly Project",
        statistics: "0",
        change: "",
      },
    };
  },
  mounted() {
    this.refreshPage();
    this.$root.$on("statisticsSummaryRefresh", (msg) => {
      const ouId =
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      this.isDialogVisible = true;
      if (msg.toUpperCase() == "ERROR") {
        this.countSettleDailyByStatus(ouId, "FAILED");
      } else {
        this.countSettleDailyByStatus(ouId, msg.toUpperCase());
      }
    });
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
    refreshPage() {
      const ouId =
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      this.refreshData();
      this.countSettleDailyByStatus(ouId, "TODO");
      this.countSettleDailyByStatus(ouId, "IN PROGRESS");
      this.countSettleDailyByStatus(ouId, "FAILED");
      this.countSettleDailyByStatus(ouId, "ON REVIEW");
      this.countSettleDailyByStatus(ouId, "BEING RELEASED");
      this.countSettleDailyByStatus(ouId, "DONE");
    },
    countSettleDailyByStatus(ouId, status) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_pc}/settle-daily-process/count-by-status?ouId=${ouId}&status=${status}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            if (status == "TODO") {
              this.totalTodo.statistics = response.data.result.toString();
            } else if (status == "IN PROGRESS") {
              this.totalInProgress.statistics = response.data.result.toString();
            } else if (status == "FAILED") {
              this.totalError.statistics = response.data.result.toString();
            } else if (status == "ON REVIEW") {
              this.totalOnReview.statistics = response.data.result.toString();
            } else if (status == "BEING RELEASED") {
              this.totalBeingReleased.statistics =
                response.data.result.toString();
            } else if (status == "DONE") {
              this.totalDone.statistics = response.data.result.toString();
            }
          } else {
            if (status == "TODO") {
              this.totalTodo.statistics = "0";
            } else if (status == "IN PROGRES") {
              this.totalInProgress.statistics = "0";
            } else if (status == "FAILED") {
              this.totalError.statistics = "0";
            } else if (status == "ON REVIEW") {
              this.totalOnReview.statistics = "0";
            } else if (status == "BEING RELEASED") {
              this.totalBeingReleased.statistics = "0";
            } else if (status == "DONE") {
              this.totalDone.statistics = "0";
            }
          }
          this.isDialogVisible = false;
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    releaseData() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      const cashbankDate = moment(this.filterForm.cashbankDate).format(
        "YYYYMMDD"
      );
      axios
        .get(
          `${themeConfig.app.api_cb}/bank-reconcile/release?ouId=${ouId}&cashbankDate=${cashbankDate}`,
          config
        )
        .then((response) => {
          this.refreshData();
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
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
      const ouId =
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      const cashbankDate = moment(this.filterForm.cashbankDate).format(
        "YYYYMMDD"
      );
      axios
        .get(
          `${themeConfig.app.api_cb}/bank-reconcile/inquiry-bank-mutation?ouId=${ouId}&cashbankDate=${cashbankDate}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainData = response.data.result;
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
                // do something
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
                // do something else
              }
            });
            this.showRelease = true;
          } else {
            this.mainData = [];
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
