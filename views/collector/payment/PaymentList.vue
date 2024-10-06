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
          <v-card-title> History Transaction Payment </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" sm="6" class="pb-0 mt-2">
                <!-- <app-autocomplite-ou-non-company
                  :form-value.sync="filterForm.ouId"
                ></app-autocomplite-ou-non-company> -->
                <app-autocomplite-ou-branch
                  :form-value.sync="filterForm.ouBranchId"
                  ou-branch-type="paymentHistory"
                >
                </app-autocomplite-ou-branch>
              </v-col>
              <v-col cols="12" md="4" sm="6" class="pb-0 mt-2">
                <app-autocomplite-ou-subbranch
                  :form-value.sync="filterForm.ouSubBranchId"
                  ou-sub-branch-type="paymentHistory"
                >
                </app-autocomplite-ou-subbranch>
              </v-col>

              <v-col cols="12" md="4" sm="6" class="pb-0 mt-2">
                <v-select
                  :items="productList"
                  v-model="filterForm.productId"
                  item-text="productName"
                  item-value="id"
                  label="Product"
                  hide-details="auto"
                  persistent-placeholder
                  :placeholder="phProduct"
                  class="mb-0"
                  dense
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="2" sm="6" class="pb-0 mt-2">
                <app-input-field-date
                  :value-date.sync="filterForm.dateFrom"
                  :label-title="startDate"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="2" sm="6" class="pb-0 mt-2">
                <app-input-field-date
                  :value-date.sync="filterForm.dateTo"
                  :label-title="endDate"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="4" class="mt-2">
                <app-autocomplite-payment-method
                  :form-value.sync="filterForm.paymentMethod"
                  :label-title="paymentMethod"
                  :multiple="true"
                >
                </app-autocomplite-payment-method>
              </v-col>
              <v-col cols="12" md="4" class="mt-2">
                <v-text-field
                  v-model="filterForm.keyword"
                  label="Document No/Reference Ext Doc No"
                  dense
                  hide-details="auto"
                  persistent-placeholder
                  :placeholder="phDocNoRefExt"
                  class="mb-0"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <span class="font-weight-bold">Reconciliation Status</span>
                <v-radio-group
                  v-model="filterForm.flgReconcile"
                  class="mt-0 mb-0"
                  hide-details
                >
                  <div class="d-flex flex-wrap demo-space-x">
                    <v-radio
                      label="All"
                      color="primary"
                      value="All"
                      class="mb-0"
                    ></v-radio>
                    <v-radio
                      label="Yes"
                      color="primary"
                      value="Y"
                      class="mb-0"
                    ></v-radio>
                    <v-radio
                      label="No"
                      color="primary"
                      value="N"
                      class="mb-0"
                    ></v-radio>
                  </div>
                </v-radio-group>
              </v-col>

              <!-- <v-col cols="12" md="6" class="pb-0">
                <v-select
                  :items="flgReconList"
                  v-model="filterForm.flgReconcile"
                  item-text="text"
                  item-value="value"
                  label="Reconciliation"
                  hide-details="auto"
                  class="mb-0"
                  dense
                ></v-select>
              </v-col> -->
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-6">
            <v-btn color="primary" small dark @click="confirmFilter()">
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
          </v-card-actions>
          <v-card-text outlined class="mt-4">
            <v-row>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="trxCount.change"
                  :color="trxCount.color"
                  :icon="trxCount.icon"
                  :statistics="trxCount.value"
                  :stat-title="trxCount.statTitle"
                  :subtitle="trxCount.subtitle"
                  :loading="isLoading"
                ></statistics-card-summary>
              </v-col>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="omset.change"
                  :color="omset.color"
                  :icon="omset.icon"
                  :statistics="omset.value"
                  :stat-title="omset.statTitle"
                  :subtitle="omset.subtitle"
                  :loading="isLoading"
                ></statistics-card-summary>
              </v-col>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="mdr.change"
                  :color="mdr.color"
                  :icon="mdr.icon"
                  :statistics="mdr.value"
                  :stat-title="mdr.statTitle"
                  :subtitle="mdr.subtitle"
                  :loading="isLoading"
                ></statistics-card-summary>
              </v-col>
              <v-col cols="12" md="3">
                <statistics-card-summary
                  :change="mdrFee.change"
                  :color="mdrFee.color"
                  :icon="mdrFee.icon"
                  :statistics="mdrFee.value"
                  :stat-title="mdrFee.statTitle"
                  :subtitle="mdrFee.subtitle"
                  :loading="isLoading"
                ></statistics-card-summary>
              </v-col>
            </v-row>
          </v-card-text>
          <!-- <v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              v-show="showDelete"
              dark
              small
              color="error"
              @click="confirmDialog()"
            >
              <v-icon dark left>
                {{ icons.mdiDelete }}
              </v-icon>
              Delete
            </v-btn>
          </v-card-title> -->
          <v-card-title id="target-table" class="mb-n4">
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
            <v-spacer></v-spacer>
            <v-btn
              v-show="showDelete"
              dark
              small
              color="error"
              @click="confirmDialog()"
            >
              <v-icon dark left>
                {{ icons.mdiDelete }}
              </v-icon>
              Delete
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="mainData"
              hide-default-footer
              disable-pagination
              fixed-header
              dense
              v-model="selected"
              item-key="id"
              show-select
              @toggle-select-all="selectAllToggle"
            >
              <template #[`header.docNo`]>
                {{ docNo }}
              </template>
              <template #[`header.docDate`]>
                {{ docDate }}
              </template>
              <template #[`header.ou`]>
                {{ ouTbl }}
              </template>
              <template #[`header.txnAmount`]>
                {{ trxAmount }}
              </template>

              <template #[`item.docNo`]="{ item }">
                <div class="d-flex flex-column py-2">
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.docNo }}</span
                  >
                  <div class="d-flex">
                    <span
                      class="d-block text--primary font-weight-semibold text-xs"
                    >
                      Merchant Ref No:
                    </span>
                    <span
                      v-show="item.referenceExtDocNo != ''"
                      class="ml-2 text-xs"
                    >
                      {{ item.referenceExtDocNo }}</span
                    >
                    <span
                      v-show="item.referenceExtDocNo == ''"
                      class="ml-2 text-xs"
                    >
                      {{ item.referenceExtDocNo }}</span
                    >
                  </div>

                  <!-- <v-chip
                    small
                    :class="`${
                      item.referenceExtDocNo != ''
                        ? 'info'
                        : item.referenceExtDocNo == ''
                        ? 'default'
                        : 'default'
                    }--text`"
                    :style="{ width: '200px' }"
                    class="v-chip-light-bg font-weight-semibold text-capitalize"
                    :color="
                      item.referenceExtDocNo != ''
                        ? 'info'
                        : item.referenceExtDocNo == ''
                        ? 'default'
                        : 'default'
                    "
                  >
                    {{ item.referenceExtDocNo }}
                  </v-chip> -->
                </div>
              </template>

              <template #[`item.paymentMethod`]="{ item }">
                <div class="d-flex align-center">
                  <v-tooltip bottom colors="primary">
                    <template #activator="{ on, attrs }">
                      <v-avatar
                        color="#e6e6e6"
                        v-bind="attrs"
                        v-on="on"
                        size="30"
                      >
                        <v-img
                          :src="
                            require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                          "
                        >
                        </v-img>
                      </v-avatar>
                    </template>
                    {{ item.bankCode }}
                  </v-tooltip>
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
                    <span class="text-xs">{{ item.merchantIdentityName }}</span>
                  </div>
                </div>
              </template>

              <template
                v-slot:item.data-table-select="{ item, isSelected, select }"
              >
                <v-simple-checkbox
                  :ripple="false"
                  :value="isSelected"
                  :readonly="item.flgReconcile != 'N'"
                  :disabled="item.flgReconcile != 'N'"
                  @input="select($event)"
                ></v-simple-checkbox>
              </template>

              <!-- format tanggal-->
              <template #[`item.docDate`]="{ item }">
                {{ dateFormat(item.docDate) }}
              </template>

              <!-- format tanggal-->
              <template #[`item.settledAt`]="{ item }">
                {{ dateTimeFormat(item.settledAt) }}
              </template>

              <!-- format tanggal-->
              <template #[`item.deductAt`]="{ item }">
                {{ dateFormat(item.deductAt) }}
              </template>

              <!-- format uang-->
              <template #[`item.txnAmount`]="{ item }">
                Rp.{{ number_format(item.txnAmount) }}
              </template>
              <template #[`item.mdrBank`]="{ item }">
                Rp.{{ number_format(item.mdrBankAmount) }}({{
                  item.mdrBankPct
                }}%)
              </template>
              <template #[`item.mdr`]="{ item }">
                Rp.{{ number_format(item.mdrFeeAmount) }}({{ item.mdrFeePct }}%)
              </template>
              <template #[`item.txnAmountBank`]="{ item }">
                Rp.{{ number_format(item.txnAmount - item.mdrBankAmount) }}
              </template>
              <template #[`item.gt`]="{ item }">
                Rp.{{
                  number_format(
                    item.txnAmount - item.mdrBankAmount - item.mdrFeeAmount
                  )
                }}
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

              <!-- Produk -->
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

              <!-- Status Flag sell-->
              <template #[`item.flgReconcile`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgReconcile == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgReconcile == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgReconcile == "Y" ? "IYA" : "TIDAK" }}
                </v-chip>
              </template>
            </v-data-table>
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="handlePageChange"
              total-visible="8"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col cols="12" md="3">
        <statistics-card-summary
          :change="trxCount.change"
          :color="trxCount.color"
          :icon="trxCount.icon"
          :statistics="trxCount.value"
          :stat-title="trxCount.statTitle"
          :subtitle="trxCount.subtitle"
        ></statistics-card-summary>
      </v-col>
      <v-col cols="12" md="3">
        <statistics-card-summary
          :change="omset.change"
          :color="omset.color"
          :icon="omset.icon"
          :statistics="omset.value"
          :stat-title="omset.statTitle"
          :subtitle="omset.subtitle"
        ></statistics-card-summary>
      </v-col>
      <v-col cols="12" md="3">
        <statistics-card-summary
          :change="mdr.change"
          :color="mdr.color"
          :icon="mdr.icon"
          :statistics="mdr.value"
          :stat-title="mdr.statTitle"
          :subtitle="mdr.subtitle"
        ></statistics-card-summary>
      </v-col>
      <v-col cols="12" md="3">
        <statistics-card-summary
          :change="mdrFee.change"
          :color="mdrFee.color"
          :icon="mdrFee.icon"
          :statistics="mdrFee.value"
          :stat-title="mdrFee.statTitle"
          :subtitle="mdrFee.subtitle"
        ></statistics-card-summary>
      </v-col> -->
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppAutocompliteOuNonCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuNonCompany";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocomplitePaymentMethod from "@/@core/components/app-autocomplite-ou/AppAutocomplitePaymentMethod.vue";
import AppAutocompliteOuBranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuBranch.vue";
import AppAutocompliteOuSubbranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranch.vue";
import StatisticsCardSummary from "@core/components/statistics-card/StatisticsCardSummary";
import Form from "vform";
import moment from "moment";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import {
  mdiCashCheck,
  mdiCashMultiple,
  mdiCurrencyUsd,
  mdiDelete,
  mdiMagnify,
  mdiTrendingDown,
  mdiTrendingUp,
} from "@mdi/js";
import {
  dateFormat,
  dateTimeFormat,
  isInArray,
  number_format,
} from "../../../../constan";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import { resolve } from "path";
import { reject } from "q";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    AppAutocompliteOu,
    AppAutocompliteOuNonCompany,
    AppAutocomplitePaymentMethod,
    AppAutocompliteOuBranch,
    AppAutocompliteOuSubbranch,
    AppInputFieldDate,
    StatisticsCardSummary,
    AppCardLoader,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      trxAmount: themeConfig.labeling.trxAmount,
      paymentMethod: themeConfig.labeling.paymentMethod,
      phDocNoRefExt: themeConfig.placeholder.docNoRefExt,
      phProduct: themeConfig.placeholder.product,

      // role access
      showDelete:
        isInArray(
          "deletePaymentTransaction",
          this.$session.get("accessHumanTask")
        ) ||
        JSON.parse(this.$session.get("userData")).username === "superadmin",

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      isLoading: false,

      isDialogVisible: false,
      disabledCount: 0,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      productList: [],
      mainData: [],
      selected: [],
      filterForm: new Form({
        ouBranchId: -99,
        ouSubBranchId: -99,
        ouId: -99,
        productId: -99,
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        flgReconcile: "All",
        paymentMethod: [],
        keyword: "",
      }),
      icons: {
        mdiMagnify,
        mdiDelete,
      },
      flgReconList: [
        {
          text: "All",
          value: "All",
        },
        {
          text: "Yes",
          value: "Y",
        },
        {
          text: "No",
          value: "N",
        },
      ],
      headers: [
        {
          text: "No. Dok.",
          value: "docNo",
          width: "350px",
        },
        {
          text: "Tanggal Dok.",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Unit Bisnis",
          value: "ou",
          width: "200px",
        },
        {
          text: "Product",
          value: "product",
          width: "200px",
        },
        // {
        //   text: "Aquiring",
        //   value: "merchantIdentityName",
        //   width: "150px",
        // },
        {
          text: "Payment Method",
          value: "paymentMethod",
          width: "175px",
        },
        {
          text: "Trx Amount",
          align: "right",
          value: "txnAmount",
          width: "170px",
        },
        {
          text: "MDR Bank",
          align: "right",
          value: "mdrBank",
          width: "150px",
        },
        {
          text: "Settled Amount",
          align: "right",
          value: "txnAmountBank",
          width: "150px",
        },
        {
          text: "Share Fee MDR",
          align: "right",
          value: "mdr",
          width: "150px",
        },
        // {
        //   text: 'Grand Total', align: 'right', value: 'gt', width: '150px',
        // },
        // {
        //   text: 'Rekon', value: 'flgReconcile', width: '100px', align: 'center',
        // },
        {
          text: "MID",
          value: "mid",
          width: "150px",
        },
        {
          text: "TID",
          value: "tid",
          width: "150px",
        },
        {
          text: "Issuer",
          value: "issuerIdentifier",
          width: "150px",
        },
        {
          text: "Settlement Datetime GMT +7",
          value: "settledAt",
          width: "250px",
        },
        // {
        //   text: 'No Ref Bank', value: 'bankReferenceNo', width: '200px',
        // },
        // {
        //   text: 'Bank Recieved', value: 'bankServedAt', width: '200px',
        // },
      ],

      trxCount: {
        statTitle: "Transaction",
        icon: mdiTrendingUp,
        color: "success",
        subtitle: "Transaction Count",
        value: "0",
        loading: this.isLoading,
      },
      omset: {
        statTitle: "Amount",
        icon: mdiCashCheck,
        color: "info",
        subtitle: "Transaction Amount",
        value: "Rp.0",
        loading: this.isLoading,
      },
      mdr: {
        statTitle: "MDR Bank",
        icon: mdiCashMultiple,
        color: "warning",
        subtitle: "MDR Deduction by Bank",
        value: "Rp.0",
        loading: this.isLoading,
      },
      mdrFee: {
        statTitle: "MDR Fee",
        icon: mdiCashMultiple,
        color: "primary",
        subtitle: "MDR Fee Received",
        value: "Rp.0",
        loading: this.isLoading,
      },
    };
  },
  mounted() {
    // this.getProductList();
    // this.refreshData();
    // this.getCountData();
    this.$root.$on("appAutocompliteOuBranchPaymentHistory", (msg) => {
      this.filterForm.ouSubBranchId = -99;
    });

    this.promiseAll();
  },
  methods: {
    alertFlg() {
      alert(this.filterForm.paymentMethod);
    },
    confirmFilter() {
      this.ofset = 0;
      this.currentPage = 1;
      this.promiseAll();
      // this.refreshData();
    },
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    dateFormat(value) {
      return dateFormat(value.substring(0, 8));
    },
    dateTimeFormat(value) {
      return dateTimeFormat(value);
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    async getItemPerPage(val) {
      this.itemPerPage = val;
      this.ofset = 0;
      this.currentPage = 1;
      await this.refreshData();
      this.isDialogVisible = false;
    },
    scrollTo() {
      VueScrollTo.scrollTo("#target-table");
    },
    async handlePageChange(value) {
      this.currentPage = value;
      if (this.currentPage == 1) {
        this.ofset = 0;
      } else {
        this.ofset = (this.currentPage - 1) * this.itemPerPage;
      }
      await this.refreshData();
      this.scrollTo();
      this.isDialogVisible = false;
    },
    selectAllToggle(props) {
      if (this.selected.length != this.mainData.length - this.disabledCount) {
        this.selected = [];
        props.items.forEach((item) => {
          if (item.flgReconcile == "N") {
            this.selected.push(item);
          }
        });
      } else {
        this.selected = [];
      }
    },
    confirmDialog() {
      const dataCount = this.selected.length;
      if (dataCount > 0) {
        this.$dialog
          .confirm("Are you sure you want to delete " + dataCount + " item?.", {
            loader: true,
          })
          .then((dialog) => {
            this.removeData();
            setTimeout(() => {
              dialog.close();
              this.promiseAll();
            }, 500);
          })
          .catch(() => {
            // this.promiseAll();
          });
      } else {
        this.notif("error", "Failed", "Please select data first!.");
      }
    },
    removeData() {
      const paymentIdList = [];
      this.selected.forEach((item) => {
        paymentIdList.push(item.id);
      });
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_pc}/payment/remove`,
          {
            paymentId: paymentIdList,
          },
          config
        )
        .then((response) => {
          this.notif("success", "Success", response.data.meta.message);
          paymentIdList = [];
        })
        .catch((e) => {
          paymentIdList = [];
          this.notif("error", "Failed", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    async getProductList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      return axios
        .post(
          `${themeConfig.app.api_master}/product/list`,
          {
            brandCode: ["M.23.001", "M.23.003"],
            limit: 9999,
            offset: 0,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.productList = response.data.result);
          this.productList = [];
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
    async getCountData() {
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

      const ouSubBranchId =
        this.filterForm.ouSubBranchId == "" ||
        this.filterForm.ouSubBranchId == null
          ? -99
          : parseInt(this.filterForm.ouSubBranchId);
      const productId =
        this.filterForm.productId == "" || this.filterForm.productId == null
          ? -99
          : parseInt(this.filterForm.productId);
      const dateFrom =
        moment(this.filterForm.dateFrom).format("YYYYMMDD") + "000000";
      const dateTo =
        moment(this.filterForm.dateTo).format("YYYYMMDD") + "235959";
      const flgRecon =
        this.filterForm.flgReconcile == "All"
          ? ""
          : this.filterForm.flgReconcile;
      const paymentMethod =
        this.filterForm.paymentMethod == null
          ? []
          : this.filterForm.paymentMethod;
      return axios
        .post(
          `${themeConfig.app.api_pc}/payment/count`,
          {
            ouBranchId: ouBranchId,
            ouSubBranchId: ouSubBranchId,
            productId: productId,
            settledFrom: dateFrom,
            settledTo: dateTo,
            flgReconcile: flgRecon,
            limit: this.itemPerPage,
            offset: this.ofset,
            keyword: this.filterForm.keyword,
            paymentMethod: paymentMethod,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.trxCount.value = number_format(
              response.data.result[0].txnCount
            ).toString();
            this.mdr.value =
              "Rp." +
              number_format(response.data.result[0].mdrBank, 2, ",", ".");
            this.mdrFee.value =
              "Rp." +
              number_format(response.data.result[0].mdrFee, 2, ",", ".");
            this.omset.value =
              "Rp." +
              number_format(response.data.result[0].txnAmount, 2, ",", ".");
            this.totalPages = 1;
            if (response.data.result[0].txnCount > this.itemPerPage) {
              this.totalPages = Math.ceil(
                response.data.result[0].txnCount / this.itemPerPage
              );
            }
          } else {
            this.trxCount.value = "0";
            this.mdr.value = "Rp.0";
            this.mdrFee.value = "Rp. 0";
            this.omset.value = "Rp.0";
            this.totalPages = 1;
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.message);
        });
    },
    async refreshData() {
      this.isDialogVisible = true;
      this.disabledCount = 0;
      this.selected = [];
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

      const ouSubBranchId =
        this.filterForm.ouSubBranchId == "" ||
        this.filterForm.ouSubBranchId == null
          ? -99
          : parseInt(this.filterForm.ouSubBranchId);
      const productId =
        this.filterForm.productId == "" || this.filterForm.productId == null
          ? -99
          : parseInt(this.filterForm.productId);
      const dateFrom =
        moment(this.filterForm.dateFrom).format("YYYYMMDD") + "000000";
      const dateTo =
        moment(this.filterForm.dateTo).format("YYYYMMDD") + "235959";
      const flgRecon =
        this.filterForm.flgReconcile == "All"
          ? ""
          : this.filterForm.flgReconcile;
      const paymentMethod =
        this.filterForm.paymentMethod == null
          ? []
          : this.filterForm.paymentMethod;
      return axios
        .post(
          `${themeConfig.app.api_pc}/payment/list`,
          {
            ouBranchId: ouBranchId,
            ouSubBranchId: ouSubBranchId,
            productId: productId,
            settledFrom: dateFrom,
            settledTo: dateTo,
            flgReconcile: flgRecon,
            limit: this.itemPerPage,
            offset: this.ofset,
            keyword: this.filterForm.keyword,
            paymentMethod: paymentMethod,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.mainData.map((item) => {
              if (item.flgReconcile != "N") this.disabledCount += 1;
            });
            this.mainData.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainData[index].merchantIdentityName +
                    "_logo.png")
                ) {
                  this.mainData[index].logoImage =
                    this.mainData[index].merchantIdentityName;
                }
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
              }
            });
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
      // const promise1 = new Promise((resolve, reject) => {
      //   this.getProductList();
      // });

      // const promise2 = new Promise((resolve, reject) => {
      //   this.refreshData();
      // });

      // const promise3 = new Promise((resolve, reject) => {
      //   this.getCountData();
      // });
      this.isDialogVisible = true;
      this.isLoading = true;
      const promises = [
        this.getProductList(),
        this.refreshData(),
        this.getCountData(),
      ];
      Promise.all(promises)
        .then((res) => {
          console.log("this promise success", res);
          this.isDialogVisible = false;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.isDialogVisible = false;
          this.isLoading = false;
        });
    },
  },
};
</script>
