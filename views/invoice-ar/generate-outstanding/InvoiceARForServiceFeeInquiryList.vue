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
    <v-dialog v-model="formDetailList" persistent width="1200">
      <!-- Dialog Content -->
      <v-card>
        <v-card-title class="font-weight-bold px-8">
          <span>Invoice Detail</span>
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headerDetail"
            :items="dataDetail"
            :footer-props="{
              'items-per-page-options': [25, 50, 100],
            }"
            disable-pagination
            fixed-header
            max-height="500px"
            dense
          >
            <template #[`item.ouBranchName`]="{ item }">
              <div class="d-flex align-center">
                <div class="d-flex flex-column ms-3">
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
              </div>
            </template>
            <template #[`item.ouSubBuName`]="{ item }">
              <div class="d-flex align-center">
                <div class="d-flex flex-column ms-3">
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.ouSubBuName }}</span
                  >
                  <span class="text-xs">{{ item.ouSubBuCode }}</span>
                </div>
              </div>
            </template>

            <template #[`item.amount`]="{ item }">
              Rp.{{ number_format(item.amount) }}
            </template>

            <template #[`item.invoiceDateFrom`]="{ item }">
              {{ dateFormat(item.invoiceDateFrom) }}
            </template>

            <template #[`item.invoiceDateTo`]="{ item }">
              {{ dateFormat(item.invoiceDateTo) }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" class="mb-0">
        <invoice-a-r-for-service-fee-inquiry-filter></invoice-a-r-for-service-fee-inquiry-filter>
      </v-col>
      <v-col id="table-temporary" cols="12" class="mb-0">
        <v-card flat class="mt-n2">
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
              <template #[`header.docNo`]>
                {{ docNo }}
              </template>
              <template #[`header.docDate`]>
                {{ docDate }}
              </template>
              <template #[`header.ouBranch`]>
                {{ ouBTbl }}
              </template>
              <template #[`header.ouSubBranch`]>
                {{ ouSBTbl }}
              </template>

              <template #[`item.actions`]="{ item }">
                <v-tooltip bottom color="primary">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      @click="detailData(item)"
                      x-small
                      icon
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>
                        {{ icons.mdiFileDocumentMultipleOutline }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Detail</span>
                </v-tooltip>
              </template>

              <!-- format tanggal-->
              <template #[`item.docDate`]="{ item }">
                {{ dateFormat(item.docDate) }}
              </template>
              <!-- <template #[`item.invoiceDateFrom`]="{ item }">
                {{ dateFormat(item.invoiceDateFrom) }}
              </template>
              <template #[`item.invoiceDateTo`]="{ item }">
                {{ dateFormat(item.invoiceDateTo) }}
              </template> -->
              <template #[`item.partnerName`]="{ item }">
                <div class="d-flex align-center">
                  <div class="d-flex flex-column ms-3">
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
              v-scroll-to="'#table-temporary'"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import InvoiceARForServiceFeeInquiryFilter from "@/views/invoice-ar/generate-outstanding/InvoiceARForServiceFeeInquiryFilter";
import Form from "vform";
import { dateFormat, number_format } from "../../../../constan";
import moment from "moment";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import { mdiFileDocumentMultipleOutline, mdiClose } from "@mdi/js";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    InvoiceARForServiceFeeInquiryFilter,
    AppCardLoader,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouBTbl: themeConfig.labeling.ouTblB,
      ouSBTbl: themeConfig.labeling.ouTblSB,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      formDetailList: false,
      dataDetail: [],
      headerDetail: [
        {
          text: "Group Merchant",
          value: "ouBranchName",
          width: "300px",
        },
        {
          text: "Merchant",
          value: "ouSubBuName",
          width: "300px",
        },
        {
          text: "Amount",
          value: "amount",
          width: "100px",
          align: "right",
        },
        {
          text: "Date From",
          value: "invoiceDateFrom",
          width: "150px",
        },
        {
          text: "Date To",
          value: "invoiceDateTo",
          width: "150px",
        },
      ],

      currentTab: 0,
      isDialogVisible: false,
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
        mdiFileDocumentMultipleOutline,
        mdiClose,
      },

      filterForm: new Form({
        ouId: -99,
        partnerId: -99,
        status: "",
        keyword: "",
        dateFrom: moment().format("YYYY-MM-DD"),
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Batch No",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Btach Date",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Partner",
          value: "partnerName",
          width: "150px",
        },
        {
          text: "Amount of Invoice",
          value: "amount",
          width: "200px",
          align: "right",
        },
      ],
    };
  },
  mounted() {
    this.refreshData();
    this.$root.$on("inquirySummaryARForServiceFee", (msg) => {
      this.currentPage = 1;
      this.ofset = 0;
      this.filterForm = msg;
      this.refreshData();
    });
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    closeForm() {
      this.formDetailList = false;
    },
    dateFormat(value) {
      return dateFormat(value);
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    detailData(item) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .get(
          // `${themeConfig.app.api_fn}/invoice-ar/inquiry-summary-list?ouId=${ouId}&partnerId=${partnerId}&status=${status}&keyword=${this.filterForm.keyword}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/temp/detail?id=${item.id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.formDetailList = true;
          this.dataDetail = response.data.result;
          // if (response.data.result !== null) {
          // } else {
          //   this.mainData = [];
          // }
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
      const status =
        this.filterForm.status == "" || this.filterForm.status == null
          ? ""
          : this.filterForm.staus;
      const dateFrom = moment(this.filterForm.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.dateTo).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/temp/count?ouId=${ouId}&partnerId=${partnerId}}&dateFrom=${dateFrom}&dateTo=${dateTo}&keyword=${this.filterForm.keyword}`,
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
      const status =
        this.filterForm.status == "" || this.filterForm.status == null
          ? ""
          : this.filterForm.staus;
      const dateFrom = moment(this.filterForm.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.dateTo).format("YYYYMMDD");
      axios
        .get(
          // `${themeConfig.app.api_fn}/invoice-ar/inquiry-summary-list?ouId=${ouId}&partnerId=${partnerId}&status=${status}&keyword=${this.filterForm.keyword}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/temp/list?ouId=${ouId}&partnerId=${partnerId}&dateFrom=${dateFrom}&dateTo=${dateTo}&keyword=${this.filterForm.keyword}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.getCountData();
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
