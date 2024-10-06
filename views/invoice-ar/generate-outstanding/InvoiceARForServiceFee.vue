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
    <v-dialog v-model="isDialogVisible" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text class="pt-3">
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" class="mb-0">
        <v-card>
          <v-card-title>
            <span>Generate Invoicing Forecasting</span>
          </v-card-title>
          <v-card-text>
            <v-tabs grow v-model="currentTab" @change="mainData = []">
              <v-tab> Generate Invoicing Forecast Transactional </v-tab>
              <v-tab> Temporary Invoicing Transactional </v-tab>
            </v-tabs>
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <v-row>
                  <v-col cols="12" class="mb-0">
                    <invoice-a-r-for-service-fee-filter></invoice-a-r-for-service-fee-filter>
                  </v-col>
                  <v-col id="table-generate" cols="12" class="mb-0 mt-2">
                    <v-card flat class="mt-n10">
                      <v-card-title
                        :class="
                          mainData.length > 0 && showGenerateButton
                            ? ''
                            : 'mt-n6'
                        "
                      >
                        <v-spacer> </v-spacer>
                        <v-btn
                          small
                          dark
                          color="primary"
                          @click="generateInvoice()"
                          v-show="mainData.length > 0 && showGenerateButton"
                        >
                          <v-icon dark left>
                            {{ icons.mdiFileDocumentOutline }}
                          </v-icon>
                          Generate
                        </v-btn>
                      </v-card-title>
                      <v-card-text>
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
                          max-height="500px"
                          dense
                        >
                          <template #[`header.ouBranch`]>
                            {{ ouBTbl }}
                          </template>
                          <template #[`header.ouSubBranch`]>
                            {{ ouSBTbl }}
                          </template>

                          <!-- Unit Bisnis -->
                          <template #[`item.ouBranch`]="{ item }">
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

                          <!-- partner -->
                          <template #[`item.ouSubBranch`]="{ item }">
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

                          <!-- format uang-->
                          <template #[`item.amount`]="{ item }">
                            Rp.{{ number_format(item.amount) }}
                          </template>
                        </v-data-table>
                        <v-pagination
                          v-model="currentPage"
                          :length="totalPages"
                          @input="handlePageChange"
                          total-visible="5"
                          v-scroll-to="'#table-generate'"
                        ></v-pagination>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <invoice-a-r-for-service-fee-inquiry-list></invoice-a-r-for-service-fee-inquiry-list>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import InvoiceARForServiceFeeFilter from "@/views/invoice-ar/generate-outstanding/InvoiceARForServiceFeeFilter";
import InvoiceARForServiceFeeInquiryList from "@/views/invoice-ar/generate-outstanding/InvoiceARForServiceFeeInquiryList";
import Form from "vform";
import moment from "moment";
import { dateFormat, number_format, isInArray } from "../../../../constan";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import { mdiFileDocumentOutline } from "@mdi/js";

import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import { throws } from "assert";

Vue.use(VueScrollTo);

export default {
  name: "ChildForServiceFee",
  components: {
    InvoiceARForServiceFeeFilter,
    InvoiceARForServiceFeeInquiryList,
  },
  data() {
    return {
      ouBTbl: themeConfig.labeling.ouTblB,
      ouSBTbl: themeConfig.labeling.ouTblSB,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      showGenerateButton:
        isInArray(
          "generateInvoicingForecasting",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      currentTab: 0,
      isDialogVisible: false,
      showGenerate: 0,
      closingBtn: false,
      disabledCount: 0,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],

      icons: {
        mdiFileDocumentOutline,
      },

      filterForm: new Form({
        ouId: -99,
        partnerId: -99,
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
      headers: [
        {
          text: "OU Branch",
          value: "ouBranch",
          width: "200px",
        },
        {
          text: "OU Sub Branch",
          value: "ouSubBranch",
          width: "150px",
        },
        {
          text: "Amount",
          value: "amount",
          width: "200px",
          align: "right",
        },
      ],
    };
  },
  mounted() {
    // this.refreshData()
    this.$root.$on("generateOutstandingARForServiceFee", (msg) => {
      this.currentPage = 1;
      this.ofset = 0;
      this.filterForm = msg;
      this.refreshData();
      // if (this.filterForm.ouId == -99 || this.filterForm.partnerId == -99) {
      //   this.mainData = [];
      //   this.notif("error", "Failed", "Please Fill Out The Form");
      // } else {
      // }
    });
  },
  methods: {
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
      const partnerId =
        this.filterForm.partnerId == ""
          ? -99
          : parseInt(this.filterForm.partnerId);
      const dateFrom = moment(this.filterForm.startDate).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.endDate).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/count-outstanding-list?ouId=${ouId}&partnerId=${partnerId}&dateForm=${dateFrom}&dateTo=${dateTo}`,
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
          this.showGenerate = response.data.result;
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Gagal", e.response.data.meta.message);
        });
    },
    generateInvoice() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      const partnerId =
        this.filterForm.partnerId == ""
          ? -99
          : parseInt(this.filterForm.partnerId);
      const dateFrom = moment(this.filterForm.startDate).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.endDate).format("YYYYMMDD");
      axios
        .post(
          `${themeConfig.app.api_fn}/invoice-ar/generate-outstanding-list`,
          {
            ouId: ouId,
            partnerId: partnerId,
            dateFrom: dateFrom,
            dateTo: dateTo,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          // if (response.data.result !== null) {
          this.refreshData();
          this.notif(
            "success",
            "Success",
            "Generate outstanding forcast invoice success!!."
          );
          // }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Gagal", e.response.data.meta.message);
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
        this.filterForm.ouId == "" || this.filterForm.ouId == null
          ? -99
          : parseInt(this.filterForm.ouId);
      const partnerId =
        this.filterForm.partnerId == "" || this.filterForm.partnerId == null
          ? -99
          : parseInt(this.filterForm.partnerId);
      const dateFrom = moment(this.filterForm.startDate).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.endDate).format("YYYYMMDD");
      this.mainData = [];
      // if (ouId != -99 && partnerId != -99) {
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/outstanding-list?ouId=${ouId}&partnerId=${partnerId}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.getCountData();
          } else {
            this.mainData = [];
            this.showGenerate = 0;
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Gagal", e.response.data.meta.message);
        });
      // } else {
      //   this.isDialogVisible = false;
      // }
    },
  },
};
</script>
