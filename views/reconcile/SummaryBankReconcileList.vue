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
          <v-card-title><span>Data Transaction Settlement</span></v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3" sm="6">
                <app-autocomplite-ou-branch
                  :form-value.sync="filterForm.ouId"
                  :ou-branch-type="module"
                ></app-autocomplite-ou-branch>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <app-autocomplite-ou-subbranch
                  :form-value.sync="filterForm.ouBranchId"
                  :ou-sub-branch-type="module"
                ></app-autocomplite-ou-subbranch>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <app-autocomplite-product
                  :form-value.sync="filterForm.productId"
                ></app-autocomplite-product>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <app-autocomplite-payment-method
                  :form-value.sync="filterForm.paymentMethod"
                ></app-autocomplite-payment-method>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <app-input-field-date
                  :value-date.sync="filterForm.settelDateFrom"
                  :label-title="settledDateFrom"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="3" sm="6">
                <app-input-field-date
                  :value-date.sync="filterForm.settelDateTo"
                  :label-title="settledDateTo"
                ></app-input-field-date>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" small dark @click="confirmFilter()">
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
          </v-card-actions>
          <v-card-text class="mt-4">
            <v-row>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="trx.change"
                  :color="trx.color"
                  :icon="trx.icon"
                  :statistics="trx.value"
                  :stat-title="trx.statTitle"
                  :subtitle="trx.subtitle"
                  :loading="isLoading"
                ></statistics-card-summary>
              </v-col>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="mdrBank.change"
                  :color="mdrBank.color"
                  :icon="mdrBank.icon"
                  :statistics="mdrBank.value"
                  :stat-title="mdrBank.statTitle"
                  :subtitle="mdrBank.subtitle"
                  :loading="isLoading"
                ></statistics-card-summary>
              </v-col>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="trxMerchant.change"
                  :color="trxMerchant.color"
                  :icon="trxMerchant.icon"
                  :statistics="trxMerchant.value"
                  :stat-title="trxMerchant.statTitle"
                  :subtitle="trxMerchant.subtitle"
                  :loading="isLoading"
                ></statistics-card-summary>
              </v-col>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="revenue.change"
                  :color="revenue.color"
                  :icon="revenue.icon"
                  :statistics="revenue.value"
                  :stat-title="revenue.statTitle"
                  :subtitle="revenue.subtitle"
                  :loading="isLoading"
                ></statistics-card-summary>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text id="target-table" class="mt-4">
            <v-row>
              <v-col md="1" sd="2">
                <v-select
                  v-model="itemPerPage"
                  :items="itemRow"
                  label="Rows"
                  class="select"
                  hide-details
                  :menu-props="{ maxWidth: '250' }"
                  @change="getItemPerPage"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="mainData"
              hide-default-footer
              disable-pagination
              fixed-header
              dense
              :headerless="true"
            >
              <template #[`header.docNo`]>
                {{ docNo }}
              </template>
              <template #[`header.processAt`]>
                {{ docDate }}
              </template>
              <template #[`header.settledDate`]>
                {{ settledDate }}
              </template>
              <template #[`header.ou`]>
                {{ ouTbl }}
              </template>
              <template #[`header.branch`]>
                {{ ouTblB }}
              </template>
              <template #[`header.subBranch`]>
                {{ ouTblSB }}
              </template>
              <template #[`header.product`]>
                {{ product }}
              </template>
              <template #[`header.bank`]>
                {{ cashBank }}
              </template>
              <template #[`header.txnAmount`]>
                {{ trxAmount }}
              </template>

              <!-- format tanggal-->
              <template #[`item.settledDate`]="{ item }">
                {{ dateFormat(item.settledDate) }}
              </template>

              <!-- format tanggal-->
              <template #[`item.processAt`]="{ item }">
                {{ dateFormat(item.processAt) }}
              </template>

              <!-- Unit Bisnis -->
              <template #[`item.subBranch`]="{ item }">
                <div>
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.subBranchName }}</span
                  >
                  <span>{{
                    item.subBranchCode == "" ? "None" : item.subBranchCode
                  }}</span>
                </div>
              </template>

              <!-- Unit Bisnis Branch -->
              <template #[`item.branch`]="{ item }">
                <div>
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.branchName }}</span
                  >
                  <span class="text-xs">{{ item.branchCode }}</span>
                </div>
              </template>

              <!-- product -->
              <template #[`item.product`]="{ item }">
                <div>
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.productName }}</span
                  >
                  <span class="text-xs">{{ item.productCode }}</span>
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
                      >{{ item.accountName }}</span
                    >
                    <span class="text-xs">{{ item.accountNo }}</span>
                  </div>
                </div>
              </template>

              <template #[`item.paymentMethod`]="{ item }">
                <!-- <span class="text-xs">{{ item.paymentMethod }}</span> -->
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
                      >{{ item.paymentMethod }}</span
                    >
                    <span class="text-xs">{{ item.bankCode }}</span>
                  </div>
                </div>
                <!--                <div class="d-flex align-center">-->
                <!--                  <v-avatar-->
                <!--                      v-if="item.paymentChannelName"-->
                <!--                      color="#e6e6e6"-->
                <!--                      size="30"-->
                <!--                  >-->
                <!--                    <v-img-->
                <!--                        :src="require(`@/assets/images/logos/bank_logo/${item.paymentChannelName == 'CASH ON MERCHANT' ? 'CASH' : item.paymentChannelName}_logo.png`)"-->
                <!--                    ></v-img>-->
                <!--                  </v-avatar>-->
                <!--                  <span-->
                <!--                      v-else-->
                <!--                  >-->
                <!--                    - -->
                <!--                  </span>-->
                <!--                  <div class="d-flex flex-column ms-3">-->
                <!--                    <span class="d-block text&#45;&#45;primary font-weight-semibold text-truncate">{{ item.subPaymentChannelName }}</span>-->
                <!--                  </div>-->
                <!--                </div>-->
              </template>

              <!-- Status Flag reconcile-->
              <template #[`item.statusClosing`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.statusClosing == 'TODO'
                      ? 'info'
                      : item.statusClosing == 'IN PROGRESS'
                      ? 'warning'
                      : item.statusClosing == 'ON REVIEW'
                      ? 'primary'
                      : item.statusClosing == 'DONE'
                      ? 'success'
                      : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="
                    item.statusClosing == 'TODO'
                      ? 'info'
                      : item.statusClosing == 'IN PROGRESS'
                      ? 'warning'
                      : item.statusClosing == 'ON REVIEW'
                      ? 'primary'
                      : item.statusClosing == 'DONE'
                      ? 'success'
                      : 'error'
                  "
                >
                  {{ item.statusClosing }}
                </v-chip>
              </template>

              <!-- Status Flag bill to partner-->
              <template #[`item.flgBillToPartner`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgBillToPartner == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgBillToPartner == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgBillToPartner == "Y" ? "Ya" : "Tidak" }}
                </v-chip>
              </template>

              <!-- format uang-->
              <template #[`item.txnAmount`]="{ item }">
                Rp.{{ number_format(item.txnAmount) }}
              </template>
              <template #[`item.mdrBankAmount`]="{ item }">
                Rp.{{ number_format(item.mdrBankAmount) }}
              </template>
              <!--              <template #[`item.mdrFeeAmount`]="{ item }">-->
              <!--                Rp.{{number_format(item.mdrFeeAmount)}}-->
              <!--              </template>-->
              <template #[`item.settledBankAmount`]="{ item }">
                Rp.{{ number_format(item.settledBankAmount) }}
              </template>
              <template #[`item.revenue`]="{ item }">
                Rp.{{ number_format(item.grossServiceFee + item.mdrFeeAmount) }}
              </template>
              <!--              <template #[`item.grossServiceFee`]="{ item }">-->
              <!--                Rp.{{number_format(item.grossServiceFee)}}-->
              <!--              </template>-->
              <template #[`item.settledAmountMerchant`]="{ item }">
                Rp.{{ number_format(item.settledAmountMerchant) }}
              </template>
              <template #[`item.totalFee`]="{ item }">
                Rp.{{ number_format(item.totalFee) }}
              </template>
              <!-- <template slot="no-data">
                <div
                  :style="{
                    height: `200px`,
                  }"
                  v-show="true"
                  class="d-flex flex-column align-center"
                >
                  <v-img
                    max-height="150"
                    max-width="150"
                    src="../../assets/images/avatars/TableNoData.png"
                  ></v-img>
                  <span class="font-weight-semibold text-truncate">
                    No Data Found
                  </span>
                </div>
              </template> -->
            </v-data-table>

            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="handlePageChange"
              total-visible="5"
              v-scroll-to="'#target-table'"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import AppAutocompliteOuBranch from "@core/components/app-autocomplite-ou/AppAutocompliteOuBranch";
import AppAutocompliteOuSubbranch from "@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranch";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocomplitePaymentMethod from "@core/components/app-autocomplite-ou/AppAutocomplitePaymentMethod";
import AppAutocompliteProduct from "@core/components/app-autocomplite-ou/AppAutocompliteProduct";
import StatisticsCardSummary from "@core/components/statistics-card/StatisticsCardSummary";
import TableNoData from "../../assets/images/avatars/TableNoData.png";
import Form from "vform";
import moment from "moment";
import { dateFormat, number_format } from "../../../constan";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import {
  mdiBank,
  mdiChartBar,
  mdiCurrencyUsd,
  mdiGoogleMyBusiness,
  mdiMagnify,
  mdiTrendingDown,
  mdiTrendingUp,
} from "@mdi/js";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    AppAutocompliteOuBranch,
    AppAutocompliteOuSubbranch,
    AppInputFieldDate,
    AppAutocomplitePaymentMethod,
    AppAutocompliteProduct,
    StatisticsCardSummary,
    TableNoData,
    AppCardLoader,
  },
  data() {
    return {
      settledDate: themeConfig.labeling.settleDate,
      settledDateFrom: themeConfig.labeling.settleDateFrom,
      settledDateTo: themeConfig.labeling.settleDateTo,
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,
      ouTblB: themeConfig.labeling.ouTblB,
      ouTblSB: themeConfig.labeling.ouTblSB,
      product: themeConfig.labeling.product,
      cashBank: themeConfig.labeling.cashBank,
      trxAmount: themeConfig.labeling.trxAmount,

      isLoading: false,
      module: "summaryTransaction",

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      isDialogVisible: false,
      closingBtn: false,
      disabledCount: 0,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      searchItem: "",
      itemRow: [25, 50, 100],
      mainData: [],
      filterForm: new Form({
        ouId: -99,
        ouBranchId: -99,
        productId: -99,
        paymentMethod: "",
        settelDateFrom: moment().format("YYYY-MM-") + "01",
        settelDateTo: moment().format("YYYY-MM-DD"),
      }),
      icons: {
        mdiMagnify,
      },
      headers: [
        {
          text: "No Dok",
          value: "docNo",
          width: "280px",
        },
        {
          text: "Recon No",
          value: "processNo",
          width: "200px",
        },
        {
          text: "Tanggal Dok",
          value: "processAt",
          width: "150px",
        },
        {
          text: "Tanggal Settle",
          value: "settledDate",
          width: "150px",
        },
        // {
        //   text: 'Unit Bisnis', value: 'ou', width: '200px',
        // },
        {
          text: "Unit Bisnis Branch",
          value: "branch",
          width: "200px",
        },
        {
          text: "Unit Bisnis Sub Branch",
          value: "subBranch",
          width: "200px",
        },
        {
          text: "Produk",
          value: "product",
          width: "200px",
        },
        {
          text: "Kas/Bank",
          value: "bank",
          width: "200px",
        },
        {
          text: "Payment Method",
          value: "paymentMethod",
          width: "150px",
        },
        {
          text: "Trx Amount",
          value: "txnAmount",
          align: "right",
          width: "200px",
        },
        {
          text: "MDR Bank",
          value: "mdrBankAmount",
          align: "right",
          width: "200px",
        },
        {
          text: "Settle Bank Amount",
          value: "settledBankAmount",
          align: "right",
          width: "200px",
        },
        {
          text: "Total Income (SF + MDR Fee)",
          value: "revenue",
          align: "right",
          width: "250px",
        },
        {
          text: "Merchant Amount",
          value: "settledAmountMerchant",
          align: "right",
          width: "200px",
        },
        // {
        //   text: 'Total Record', value: 'totalRecord', align: 'center', width: '150px',
        // },
        // {
        //   text: 'Status Payment', value: 'flgBillToPartner', align: 'center', width: '200px',
        // },
      ],
      headersNoData: [
        {
          text: "No Dok",
          value: "docNo",
        },
        {
          text: "Recon No",
          value: "processNo",
        },
        {
          text: "Tanggal Dok",
          value: "processAt",
        },
        {
          text: "Tanggal Settle",
          value: "settledDate",
        },
        // {
        //   text: 'Unit Bisnis', value: 'ou', width: '200px',
        // },
        {
          text: "Unit Bisnis Branch",
          value: "branch",
        },
        {
          text: "Unit Bisnis Sub Branch",
          value: "subBranch",
        },
        {
          text: "Produk",
          value: "product",
        },
        {
          text: "Kas/Bank",
          value: "bank",
        },
        {
          text: "Payment Method",
          value: "paymentMethod",
        },
        {
          text: "Trx Amount",
          value: "txnAmount",
          align: "right",
        },
        {
          text: "MDR Bank",
          value: "mdrBankAmount",
          align: "right",
        },
        {
          text: "Settle Bank Amount",
          value: "settledBankAmount",
          align: "right",
        },
        {
          text: "Total Income (SF + MDR Fee)",
          value: "revenue",
          align: "right",
        },
        {
          text: "Merchant Amount",
          value: "settledAmountMerchant",
          align: "right",
        },
        // {
        //   text: 'Total Record', value: 'totalRecord', align: 'center', width: '150px',
        // },
        // {
        //   text: 'Status Payment', value: 'flgBillToPartner', align: 'center', width: '200px',
        // },
      ],
      trx: {
        statTitle: "Transaction",
        icon: mdiChartBar,
        color: "primary",
        subtitle: "",
        value: "Rp0",
      },
      mdrBank: {
        statTitle: "MDR Bank",
        icon: mdiBank,
        color: "info",
        subtitle: "",
        value: "Rp0",
      },
      trxMerchant: {
        statTitle: "Transaction Merchant",
        icon: mdiGoogleMyBusiness,
        color: "info",
        subtitle: "",
        value: "Rp0",
      },
      revenue: {
        statTitle: "Total Income",
        icon: mdiCurrencyUsd,
        color: "success",
        subtitle: "",
        value: "Rp0",
      },
    };
  },
  mounted() {
    this.promiseAll();
    this.$root.$on("appAutocompliteOuBranchSummaryTransaction", (msg) => {
      this.filterForm.ouBranchId = -99;
      this.$root.$emit("appAutocompliteOuSubBranchSummaryTransaction", msg);
    });
  },
  methods: {
    confirmFilter() {
      this.ofset = 0;
      this.currentPage = 1;
      this.promiseAll();
      // this.refreshData();
      // this.getSummaryData();
    },
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    dateFormat(value) {
      if (value != "") {
        return dateFormat(value.substring(0, 8));
      } else {
        return "";
      }
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    getItemPerPage(val) {
      this.itemPerPage = val;
      this.ofset = 0;
      this.currentPage = 1;
      this.refreshData();
    },
    handlePageChange(value) {
      this.currentPage = value;
      if (this.currentPage == 1) {
        this.ofset = 0;
      } else {
        this.ofset = (this.currentPage - 1) * this.itemPerPage;
      }
      this.refreshData();
    },
    getSummaryData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" || this.filterForm.ouId == null
          ? -99
          : parseInt(this.filterForm.ouId);
      const ouBranchId =
        this.filterForm.ouBranchId == "" || this.filterForm.ouBranchId == null
          ? -99
          : parseInt(this.filterForm.ouBranchId);
      const productId =
        this.filterForm.productId == "" || this.filterForm.productId == null
          ? -99
          : parseInt(this.filterForm.productId);
      const paymentChannel =
        this.filterForm.paymentMethod == null
          ? ""
          : this.filterForm.paymentMethod;
      const settleDateFrom = moment(this.filterForm.settelDateFrom).format(
        "YYYYMMDD"
      );
      const settleDateTo = moment(this.filterForm.settelDateTo).format(
        "YYYYMMDD"
      );
      return axios
        .get(
          `${themeConfig.app.api_pc}/summary-data-reconcile/summary?ouId=${ouId}&branchId=${ouBranchId}&dateFrom=${settleDateFrom}&dateTo=${settleDateTo}&productId=${productId}&paymentChannelCode=${paymentChannel}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.trx.value =
              "Rp. " + number_format(response.data.result[0].trx, 2, ",", ".");
            // this.trx.subtitle = "Number of Transaction " + number_format(response.data.result[0].totalRecord)
            this.mdrBank.value =
              "Rp. " +
              number_format(response.data.result[0].mdrBank, 2, ",", ".");
            this.trxMerchant.value =
              "Rp. " +
              number_format(
                response.data.result[0].nominalMerchant,
                2,
                ",",
                "."
              );
            this.revenue.value =
              "Rp. " +
              number_format(response.data.result[0].totalRevenue, 2, ",", ".");
          } else {
            this.trx.value = "Rp. 0";
            this.trx.subtitle = "From 0 transaction";
            this.mdrBank.value = "Rp. 0";
            this.trxMerchant.value = "Rp. 0";
            this.revenue.value = "Rp. 0";
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
          this.trx.value = "Rp. 0";
          this.trx.subtitle = "From 0 transaction";
          this.mdrBank.value = "Rp. 0";
          this.trxMerchant.value = "Rp. 0";
          this.revenue.value = "Rp. 0";
        });
    },
    getCountData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" || this.filterForm.ouId == null
          ? -99
          : parseInt(this.filterForm.ouId);
      const ouBranchId =
        this.filterForm.ouBranchId == "" || this.filterForm.ouBranchId == null
          ? -99
          : parseInt(this.filterForm.ouBranchId);
      const productId =
        this.filterForm.productId == "" || this.filterForm.productId == null
          ? -99
          : parseInt(this.filterForm.productId);
      const paymentChannel =
        this.filterForm.paymentMethod == null
          ? ""
          : this.filterForm.paymentMethod;
      const settleDateFrom = moment(this.filterForm.settelDateFrom).format(
        "YYYYMMDD"
      );
      const settleDateTo = moment(this.filterForm.settelDateTo).format(
        "YYYYMMDD"
      );
      axios
        .get(
          `${themeConfig.app.api_pc}/summary-data-reconcile/count?ouId=${ouId}&branchId=${ouBranchId}&dateFrom=${settleDateFrom}&dateTo=${settleDateTo}&productId=${productId}&paymentChannelCode=${paymentChannel}`,
          config
        )
        .then((response) => {
          if (
            response.data.result !== null &&
            response.data.result > this.itemPerPage
          ) {
            this.trx.subtitle =
              "Number of Transaction " + number_format(response.data.result);
            this.totalPages = Math.ceil(
              response.data.result / this.itemPerPage
            );
          } else {
            this.trx.subtitle =
              "Number of Transaction " +
              number_format(
                response.data.result == null ? 0 : response.data.result
              );
            this.totalPages = 1;
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    refreshData() {
      this.closingBtn = false;
      this.disabledCount = 0;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" || this.filterForm.ouId == null
          ? -99
          : parseInt(this.filterForm.ouId);
      const ouBranchId =
        this.filterForm.ouBranchId == "" || this.filterForm.ouBranchId == null
          ? -99
          : parseInt(this.filterForm.ouBranchId);
      const productId =
        this.filterForm.productId == "" || this.filterForm.productId == null
          ? -99
          : parseInt(this.filterForm.productId);
      const paymentChannel =
        this.filterForm.paymentMethod == null
          ? ""
          : this.filterForm.paymentMethod;
      const settleDateFrom = moment(this.filterForm.settelDateFrom).format(
        "YYYYMMDD"
      );
      const settleDateTo = moment(this.filterForm.settelDateTo).format(
        "YYYYMMDD"
      );

      return axios
        .get(
          `${themeConfig.app.api_pc}/summary-data-reconcile/list?ouId=${ouId}&branchId=${ouBranchId}&dateFrom=${settleDateFrom}&dateTo=${settleDateTo}&productId=${productId}&paymentChannelCode=${paymentChannel}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
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
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
              }
            });
            this.getCountData();
          } else {
            this.mainData = [];
            this.disabledCount = 0;
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    promiseAll() {
      this.isLoading = true;
      this.isDialogVisible = true;

      const promises = [this.refreshData(), this.getSummaryData()];

      Promise.all(promises)
        .then((res) => {
          this.isLoading = false;
          this.isDialogVisible = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.isDialogVisible = false;
        });
    },
  },
};
</script>

<style>
.table-container {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

.scrollable-table > .v-data-table__wrapper {
  overflow-x: auto !important;
  overflow-y: hidden !important;
}

.scrollable-table > .v-data-table__wrapper > table {
  min-width: 100% !important;
}

.scrollable-table > .v-data-table__wrapper > table > thead {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
