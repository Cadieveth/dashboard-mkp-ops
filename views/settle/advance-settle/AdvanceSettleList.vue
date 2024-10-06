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
    <v-dialog v-model="formDetailList" persistent width="1300">
      <v-card>
        <v-card-title class="font-weight-bold px-8">
          Detail
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headersDetail"
            :items="mainDataDetail"
            hide-default-footer
            disable-pagination
            fixed-header
            dense
          >
            <template #[`item.bank`]="{ item }">
              <div class="d-flex align-center">
                <v-avatar v-if="item.bankCode" color="#e6e6e6" size="30">
                  <v-img
                    :src="
                      require(`@/assets/images/logos/bank_logo/${item.bankCode}_logo.png`)
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
                      require(`@/assets/images/logos/bank_logo/${item.paymentChannelCode}_logo.png`)
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
                    >{{ item.subPaymentChannelName }}</span
                  >
                </div>
              </div>
            </template>

            <template #[`item.receiveAmount`]="{ item }">
              Rp.{{ number_format(item.receiveAmount) }}
            </template>
            <template #[`item.settleAmount`]="{ item }">
              Rp.{{ number_format(item.settleAmount) }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" class="pb-0">
        <v-card>
          <!-- <v-card-title> Advance Settlement </v-card-title> -->
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <app-autocomplite-ou-branch
                  :form-value.sync="filterForm.ouId"
                  :ou-branch-type="module"
                ></app-autocomplite-ou-branch>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <app-autocomplite-ou-subbranch
                  :form-value.sync="filterForm.ouSubBranch"
                  :ou-sub-branch-type="module"
                ></app-autocomplite-ou-subbranch>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="startDate"
                  :value-date.sync="filterForm.startDate"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="endDate"
                  :value-date.sync="filterForm.endDate"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-status
                  :form-value.sync="filterForm.status"
                  :status-type="'STATUSDOC'"
                ></app-autocomplite-status>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-6">
            <v-row>
              <v-col cols="12" md="12">
                <v-btn dark small @click="confirmFilter()" color="primary">
                  <v-icon dark left>
                    {{ icons.mdiMagnify }}
                  </v-icon>
                  Filter
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
          <v-card-text class="mt-4">
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
          <v-card-text id="target-table">
            <v-data-table
              :headers="headers"
              :items="mainData"
              hide-default-footer
              disable-pagination
              fixed-header
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

              <!-- Partner -->
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

              <!-- Payment Method -->
              <template #[`item.paymentChannelName`]="{ item }">
                <div>
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.subPaymentChannelName }}</span
                  >
                  <span class="text-xs">{{ item.paymentChannelName }}</span>
                </div>
              </template>

              <!-- Status Dokumen-->
              <template #[`item.statusDoc`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.statusDoc == 'R'
                      ? 'success'
                      : item.statusDoc == 'D'
                      ? 'info'
                      : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="
                    item.statusDoc == 'R'
                      ? 'success'
                      : item.statusDoc == 'D'
                      ? 'info'
                      : 'error'
                  "
                >
                  {{ item.workflowStatus }}
                </v-chip>
              </template>

              <template #[`item.cashbankName`]="{ item }">
                <div class="d-flex align-center">
                  <v-avatar v-if="item.bankCode" color="#e6e6e6" size="30">
                    <v-img
                      :src="
                        require(`@/assets/images/logos/bank_logo/${item.bankCode}_logo.png`)
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

              <template #[`item.receiveAmount`]="{ item }">
                Rp.{{ number_format(item.receiveAmount) }}
              </template>

              <!-- action -->
              <template #[`item.actions`]="{ item }">
                <v-tooltip bottom color="primary">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="detailData(item.id)"
                    >
                      <v-icon>
                        {{ icons.mdiMagnify }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Detail</span>
                </v-tooltip>
                <v-tooltip bottom color="info">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                      @click="confirmDialog(item)"
                      v-show="item.statusDoc == 'D' && showVoid"
                    >
                      <v-icon>
                        {{ icons.mdiFileRestoreOutline }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Void</span>
                </v-tooltip>
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
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import AppAutocompliteOuBranch from "@core/components/app-autocomplite-ou/AppAutocompliteOuBranch";
import AppAutocompliteOuSubbranch from "@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranch";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocompliteStatus from "@core/components/app-autocomplite-ou/AppAutocompliteStatus";
import Form from "vform";
import {
  mdiCheckAll,
  mdiClose,
  mdiFileDocumentMultipleOutline,
  mdiFileRestoreOutline,
  mdiMagnify,
} from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";
import { dateFormat, number_format, isInArray } from "../../../../constan";
import moment from "moment";

import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    AppAutocompliteOuBranch,
    AppAutocompliteOuSubbranch,
    AppInputFieldDate,
    AppAutocompliteStatus,
    AppCardLoader,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      ouTbl: themeConfig.labeling.ouTbl,
      partner: themeConfig.labeling.partner,

      // role
      showVoid:
        isInArray(
          "voidAdvancedSettlement",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      module: "advanceSettlement",

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      isDialogVisible: false,
      formDetailList: false,

      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      mainDataDetail: [],
      filterForm: new Form({
        ouId: -99,
        ouSubBranch: -99,
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
        status: "",
      }),
      icons: {
        mdiClose,
        mdiMagnify,
        mdiFileRestoreOutline,
        mdiCheckAll,
        mdiFileDocumentMultipleOutline,
      },
      headers: [
        {
          text: "Action",
          align: "left",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Nomor Dok.",
          value: "docNo",
          width: "150px",
        },
        {
          text: "Status",
          value: "statusDoc",
          width: "100px",
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
          text: "Mitra",
          value: "partner",
          width: "200px",
        },
        {
          text: "Receive Amount",
          value: "receiveAmount",
          align: "right",
          width: "250px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
      ],
      headersDetail: [
        {
          text: "Beneficiary Bank",
          value: "bank",
          width: "200px",
        },
        {
          text: "Payment Method",
          value: "payment",
          width: "200px",
        },
        {
          text: "O/S Amount",
          value: "settleAmount",
          align: "right",
          width: "250px",
        },
        {
          text: "Receive Amount",
          value: "receiveAmount",
          align: "right",
          width: "250px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
      ],
    };
  },
  mounted() {
    // this.refreshData();
    this.$root.$on("appAutocompliteOuBranchAdvanceSettlement", (msg) => {
      this.$root.$emit("appAutocompliteOuSubBranchAdvanceSettlement", msg);
      this.filterForm.ouSubBranch = -99;
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
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    dateFormat(value) {
      return dateFormat(value);
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
    closeForm() {
      this.formDetailList = false;
      this.refreshData();
    },
    confirmDialog(id) {
      this.$dialog
        .confirm("Are you sure you want to void this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.voidData(id);
          setTimeout(() => {
            dialog.close();
          }, 1500);
        })
        .catch(() => {
          this.refreshData();
        });
    },
    voidData(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_pc}/advance-settle/void?id=${id}`, config)
        .then((response) => {
          this.refreshData();
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    detailData(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_pc}/advance-settle/receive-list?id=${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.formDetailList = true;
          if (response.data.result !== null)
            return (this.mainDataDetail = response.data.result);
          this.mainDataDetail = [];
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
      const ouSubBranchId =
        this.filterForm.ouSubBranch == "" || this.filterForm.ouSubBranch == null
          ? -99
          : parseInt(this.filterForm.ouSubBranch);
      const dateFrom = moment(this.filterForm.startDate).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.endDate).format("YYYYMMDD");
      const status =
        this.filterForm.status == null ? "" : this.filterForm.status;

      axios
        .get(
          `${themeConfig.app.api_pc}/advance-settle/count?ouId=${ouId}&ouSubBranchId=${ouSubBranchId}&dateFrom=${dateFrom}&dateTo=${dateTo}&status=${status}`,
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
          this.notif("error", "Failed", e.response.data.meta.message);
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
      const ouId =
        this.filterForm.ouId == "" || this.filterForm.ouId == null
          ? -99
          : parseInt(this.filterForm.ouId);
      const ouSubBranchId =
        this.filterForm.ouSubBranch == "" || this.filterForm.ouSubBranch == null
          ? -99
          : parseInt(this.filterForm.ouSubBranch);
      const dateFrom = moment(this.filterForm.startDate).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.endDate).format("YYYYMMDD");
      const status =
        this.filterForm.status == null ? "" : this.filterForm.status;

      axios
        .get(
          `${themeConfig.app.api_pc}/advance-settle/list?ouId=${ouId}&ouSubBranchId=${ouSubBranchId}&dateFrom=${dateFrom}&dateTo=${dateTo}&status=${status}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getCountData();
          if (response.data.result !== null)
            return (this.mainData = response.data.result);
          this.mainData = [];
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
