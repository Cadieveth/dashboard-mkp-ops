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
          <v-card-title>Invoice A/P Settlement</v-card-title>
          <v-card-text>
            <div>
              <v-tabs class="mb-4" grow v-model="currentTab">
                <v-tab> Progress Account Payable For Merchant </v-tab>
                <v-tab> Progress Account Payable For Bank </v-tab>
              </v-tabs>
              <v-tabs-items v-model="currentTab">
                <v-tab-item>
                  <invoice-partner-list></invoice-partner-list>
                </v-tab-item>
                <v-tab-item>
                  <v-card>
                    <!-- <v-card-title
                      ><span
                        >Progress Account Payable For Bank</span
                      ></v-card-title
                    > -->
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                          <app-autocomplite-ou-branch
                            :form-value.sync="filterForm.ouId"
                            :ou-branch-type="'progressForBank'"
                          ></app-autocomplite-ou-branch>
                        </v-col>
                        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                          <app-autocomplite-ou-subbranch
                            :form-value.sync="filterForm.ouBranchId"
                            :ou-sub-branch-type="'progressForBank'"
                          ></app-autocomplite-ou-subbranch>
                        </v-col>
                        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                          <app-input-field-date
                            :label-title="startDate"
                            :value-date.sync="filterForm.dateFrom"
                          ></app-input-field-date>
                        </v-col>
                        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                          <app-input-field-date
                            :label-title="endDate"
                            :value-date.sync="filterForm.dateTo"
                          ></app-input-field-date>
                        </v-col>
                        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                          <app-autocomplite-cashbank
                            :value-bank-ou.sync="filterForm.cashbankId"
                            :label-text="cashBank"
                          ></app-autocomplite-cashbank>
                        </v-col>
                        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                          <app-autocomplite-payment-method
                            :form-value.sync="filterForm.paymentMethod"
                          ></app-autocomplite-payment-method>
                        </v-col>
                        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                          <app-autocomplite-status
                            :form-value.sync="filterForm.status"
                          ></app-autocomplite-status>
                        </v-col>
                        <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                          <v-text-field
                            dense
                            :label="docNo"
                            v-model="filterForm.docNo"
                            hide-details
                            persistent-placeholder
                            :placeholder="phDocNo"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions class="mt-4">
                      <v-btn
                        dark
                        small
                        color="primary"
                        @click="confirmFilter()"
                      >
                        <v-icon dark left>
                          {{ icons.mdiMagnify }}
                        </v-icon>
                        Filter
                      </v-btn>
                    </v-card-actions>
                    <v-card-title id="target-table">
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
                    </v-card-title>
                    <v-card-text>
                      <v-data-table
                        :headers="headers"
                        :items="mainData"
                        hide-default-footer
                        disable-pagination
                        fixed-header
                        max-height="500px"
                        dense
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
                        <template #[`header.ouSB`]>
                          {{ ouTblSB }}
                        </template>
                        <template #[`header.partner`]>
                          {{ partner }}
                        </template>
                        <template #[`header.bank`]>
                          {{ beneficiaryBank }}
                        </template>

                        <!-- format tanggal-->
                        <template #[`item.docDate`]="{ item }">
                          {{ dateFormat(item.docDate) }}
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
                        <!-- Unit Bisnis -->
                        <template #[`item.ouSB`]="{ item }">
                          <div>
                            <span
                              class="
                                d-block
                                text--primary
                                font-weight-semibold
                                text-truncate
                              "
                              >{{ item.ouBranchName }}</span
                            >
                            <span class="text-xs">{{ item.ouBranchCode }}</span>
                          </div>
                        </template>

                        <!-- partner -->
                        <template #[`item.partner`]="{ item }">
                          <div>
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
                        </template>

                        <template #[`item.bank`]="{ item }">
                          <div class="d-flex align-center">
                            <v-avatar
                              v-if="item.bankCode"
                              color="#e6e6e6"
                              size="30"
                            >
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

                        <!-- payment -->
                        <template #[`item.payment`]="{ item }">
                          <div class="d-flex align-center">
                            <v-avatar
                              v-if="item.paymentChannelCode"
                              color="#e6e6e6"
                              size="30"
                            >
                              <v-img
                                :src="
                                  require(`@/assets/images/logos/bank_logo/${item.logoChannelCode}_logo.png`)
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
                                >{{ item.paymentMethodCode }}</span
                              >
                            </div>
                          </div>
                        </template>

                        <!-- Status Flag payment-->
                        <template #[`item.flgPayment`]="{ item }">
                          <v-chip
                            small
                            :class="`${
                              item.flgPayment == 'Y'
                                ? 'success'
                                : item.flgPayment == 'N'
                                ? 'error'
                                : 'warning'
                            }--text`"
                            class="
                              v-chip-light-bg
                              font-weight-semibold
                              text-capitalize
                            "
                            :color="
                              item.flgPayment == 'Y'
                                ? 'success'
                                : item.flgPayment == 'N'
                                ? 'error'
                                : 'warning'
                            "
                          >
                            {{
                              item.flgPayment == "Y"
                                ? "PAID"
                                : item.flgPayment == "N"
                                ? "NOT PAID"
                                : "IN PROGRESS"
                            }}
                          </v-chip>
                        </template>

                        <!-- format uang-->
                        <template #[`item.amount`]="{ item }">
                          Rp.{{ number_format(item.amount) }}
                        </template>
                        <template #[`item.paymentAmount`]="{ item }">
                          Rp.{{ number_format(item.paymentAmount) }}
                        </template>
                        <template #[`item.balance`]="{ item }">
                          Rp.{{
                            number_format(item.amount - item.paymentAmount)
                          }}
                        </template>
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
                </v-tab-item>
              </v-tabs-items>
            </div>
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
import AppAutocompliteCashbank from "@core/components/app-autocomplite-ou/AppAutocompliteCashbank";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocomplitePaymentMethod from "@core/components/app-autocomplite-ou/AppAutocomplitePaymentMethod";
import AppAutocompliteStatus from "@core/components/app-autocomplite-ou/AppAutocompliteStatus";

import InvoicePartnerList from "../partner/InvoicePartnerList.vue";

import Form from "vform";
import moment from "moment";
import { mdiMagnify } from "@mdi/js";
import { dateFormat, number_format } from "../../../../constan";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";

import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    AppAutocompliteOuBranch,
    AppAutocompliteOuSubbranch,
    AppAutocompliteCashbank,
    AppInputFieldDate,
    AppAutocomplitePaymentMethod,
    AppAutocompliteStatus,
    InvoicePartnerList,
    AppCardLoader,
  },
  data() {
    return {
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      cashBank: themeConfig.labeling.cashBank,
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTblB,
      ouTblSB: themeConfig.labeling.ouTblSB,
      partner: themeConfig.labeling.partner,
      bankAccount: themeConfig.labeling.bankAccount,
      beneficiaryBank: themeConfig.labeling.beneficiaryBank,
      phDocNo: themeConfig.placeholder.docNo,

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
      itemRow: [25, 50, 100],
      currentTab: 0,
      mainData: [],
      icons: {
        mdiMagnify,
      },
      filterForm: new Form({
        docNo: "",
        ouId: -99,
        ouBranchId: -99,
        cashbankId: -99,
        paymentMethod: "",
        status: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      headers: [
        {
          text: "No Dok",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Tanggal Dok",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Doc Desc",
          value: "docDesc",
          width: "125px",
        },
        {
          text: "Unit Bisnis",
          value: "ou",
          width: "200px",
        },
        {
          text: "Unit Bisnis",
          value: "ouSB",
          width: "200px",
        },
        {
          text: "Mitra",
          value: "partner",
          width: "200px",
        },
        {
          text: "Bank Penampung",
          value: "bank",
          width: "200px",
        },
        {
          text: "Payment Method",
          value: "payment",
          width: "200px",
        },
        {
          text: "Status",
          value: "flgPayment",
          width: "100px",
        },
        {
          text: "Amount",
          value: "amount",
          align: "right",
          width: "150px",
        },
        {
          text: "Payment Amount",
          value: "paymentAmount",
          align: "right",
          width: "150px",
        },
        {
          text: "O/S Amount",
          value: "balance",
          align: "right",
          width: "150px",
        },
      ],
    };
  },
  mounted() {
    // this.refreshData();
    this.$root.$on("appAutocompliteOuBranchProgressForBank", (msg) => {
      // this.$root.$emit("appAutocompliteOuSubBranch", msg);
      this.filterForm.ouBranchId = -99;
    });
  },
  methods: {
    confirmFilter() {
      this.ofset = 0;
      this.currentPage = 1;
      this.refreshData();
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
    getCountData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      const ouBranchId =
        this.filterForm.ouBranchId == ""
          ? -99
          : parseInt(this.filterForm.ouBranchId);
      const cashbankId =
        this.filterForm.cashbankId == ""
          ? -99
          : parseInt(this.filterForm.cashbankId);
      const paymentMethod =
        this.filterForm.paymentMethod == null
          ? ""
          : this.filterForm.paymentMethod;
      const status =
        this.filterForm.status == null ? "" : this.filterForm.status;
      const dateFrom = moment(this.filterForm.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.dateTo).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice/count-bank-list?ouId=${ouId}&branchId=${ouBranchId}&dateFrom=${dateFrom}&dateTo=${dateTo}&docNo=${this.filterForm.docNo}&cashbankId=${cashbankId}&paymentMethod=${paymentMethod}&status=${status}`,
          config
        )
        .then((response) => {
          if (
            response.data.result !== null &&
            response.data.result > this.itemPerPage
          ) {
            this.totalPages = Math.ceil(
              response.data.result / this.itemPerPage
            );
          } else {
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
      this.isDialogVisible = true;
      this.closingBtn = false;
      this.disabledCount = 0;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      const ouBranchId =
        this.filterForm.ouBranchId == ""
          ? -99
          : parseInt(this.filterForm.ouBranchId);
      const cashbankId =
        this.filterForm.cashbankId == ""
          ? -99
          : parseInt(this.filterForm.cashbankId);
      const paymentMethod =
        this.filterForm.paymentMethod == null
          ? ""
          : this.filterForm.paymentMethod;
      const status =
        this.filterForm.status == null ? "" : this.filterForm.status;
      const dateFrom = moment(this.filterForm.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.dateTo).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice/bank-list?ouId=${ouId}&branchId=${ouBranchId}&dateFrom=${dateFrom}&dateTo=${dateTo}&docNo=${this.filterForm.docNo}&cashbankId=${cashbankId}&paymentMethod=${paymentMethod}&status=${status}&limit=${this.itemPerPage}&offset=${this.ofset}`,
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
                  this.mainData[index].logoChannelCode =
                    this.mainData[index].paymentChannelCode;
                }
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
                this.mainData[index].logoChannelCode = "NONE";
              }
            });
            this.getCountData();
          } else {
            this.mainData = [];
            this.disabledCount = 0;
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
