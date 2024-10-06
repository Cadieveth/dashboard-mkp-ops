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
        <invoic-a-r-filter></invoic-a-r-filter>
      </v-col>
      <v-col cols="12" class="pb-0">
        <v-card>
          <v-card-title><span>List</span></v-card-title>
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
              <template #[`header.partner`]>
                {{ partner }}
              </template>

              <!-- format tanggal-->
              <template #[`item.docDate`]="{ item }">
                {{ dateFormat(item.docDate) }}
              </template>
              <template #[`item.extDocDate`]="{ item }">
                {{ extDocDate == "" ? "" : dateFormat(item.extDocDate) }}
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
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
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

              <!-- Status Flag payment-->
              <template #[`item.status`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.statusDoc == 'R'
                      ? 'success'
                      : item.statusDoc == 'F'
                      ? 'error'
                      : item.statusDoc == 'I'
                      ? 'warning'
                      : 'info'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="
                    item.statusDoc == 'R'
                      ? 'success'
                      : item.statusDoc == 'F'
                      ? 'error'
                      : item.statusDoc == 'I'
                      ? 'warning'
                      : 'info'
                  "
                >
                  {{ item.workflowStatus }}
                </v-chip>
              </template>

              <!-- format uang-->
              <template #[`item.amount`]="{ item }">
                Rp.{{ number_format(item.amount) }}
              </template>
              <template #[`item.addAmount`]="{ item }">
                Rp.{{ number_format(item.addAmount) }}
              </template>
              <template #[`item.invoiceAmount`]="{ item }">
                Rp.{{ number_format(item.invoiceAmount) }}
              </template>
              <template #[`item.paymentAmount`]="{ item }">
                Rp.{{ number_format(item.paymentAmount) }}
              </template>
            </v-data-table>
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="handlePageChange"
              total-visible="5"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import InvoicARFilter from "@/views/invoice-ar/InvoicARFilter";
import Form from "vform";
import moment from "moment";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import { dateFormat, number_format } from "../../../constan";

export default {
  name: "ChildList",
  components: {
    InvoicARFilter,
    AppCardLoader,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,
      partner: themeConfig.labeling.partner,

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
      mainData: [],
      filterForm: new Form({
        ouId: -99,
        partnerId: -99,
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        docNo: "",
      }),
      headers: [
        {
          text: "Doc No",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Doc Date",
          value: "docDate",
          width: "200px",
        },
        {
          text: "Due Date",
          value: "dueDate",
          width: "200px",
        },
        // {
        //   text: 'Ext Doc No', value: 'extDocNo', width: '200px',
        // },
        // {
        //   text: 'Ext Doc Date', value: 'extDocDate', width: '200px',
        // },
        {
          text: "OU",
          value: "ou",
          width: "200px",
        },
        {
          text: "Partner",
          value: "partner",
          width: "200px",
        },
        {
          text: "Amount",
          value: "amount",
          width: "150px",
          align: "right",
        },
        {
          text: "Add Amount",
          value: "addAmount",
          width: "175px",
          align: "right",
        },
        {
          text: "Invoice Amount",
          value: "invoiceAmount",
          width: "200px",
          align: "right",
        },
        {
          text: "Status Payment",
          value: "flgPayment",
          width: "200px",
          align: "center",
        },
        {
          text: "Payment Amount",
          value: "paymentAmount",
          width: "175px",
          align: "right",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
        {
          text: "Status",
          value: "status",
          width: "100px",
          align: "center",
        },
      ],
    };
  },
  mounted() {
    this.refreshData();
    this.$root.$on("filterInvoiceAR", (msg) => {
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
      const dateFrom = moment(this.filterForm.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.dateTo).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/count-list?ouId=${ouId}&partnerId=${partnerId}&dateFrom=${dateFrom}&dateTo=${dateTo}&docNo=${this.filterForm.docNo}`,
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
      const partnerId =
        this.filterForm.partnerId == ""
          ? -99
          : parseInt(this.filterForm.partnerId);
      const dateFrom = moment(this.filterForm.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.dateTo).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/list?ouId=${ouId}&partnerId=${partnerId}&dateFrom=${dateFrom}&dateTo=${dateTo}&docNo=${this.filterForm.docNo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainData = response.data.result;
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
