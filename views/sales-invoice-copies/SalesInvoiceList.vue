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
      <v-col cols="12" class="mb-0">
        <v-card>
          <v-card-title>
            <span>Sales Invoice</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="mb-0">
                <v-tabs
                  grow
                  v-model="currentTab"
                  @change="
                    currentTab == 0
                      ? refreshDataSalesOrder()
                      : currentTab == 1
                      ? refreshDataDraft()
                      : currentTab == 2
                      ? refreshDataInProgress()
                      : refreshDataReleased()
                  "
                >
                  <v-tab> Create </v-tab>
                  <v-tab> Draft </v-tab>
                  <v-tab> In Progress </v-tab>
                  <v-tab> Approved </v-tab>
                </v-tabs>
                <v-tabs-items v-model="currentTab">
                  <v-tab-item class="mt-2">
                    <v-row>
                      <v-col cols="12" class="mb-0">
                        <sales-invoice-filter-create></sales-invoice-filter-create>
                      </v-col>
                      <v-col cols="12" class="mt-n6">
                        <sales-invoice-create></sales-invoice-create>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item class="mt-2">
                    <v-row>
                      <v-col cols="12" class="mb-0">
                        <sales-invoice-filter-doc></sales-invoice-filter-doc>
                      </v-col>
                      <v-col id="table-draft" cols="12" class="mb-0 mt-n6">
                        <v-card flat>
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
                              <v-col cols="12" class="mb-0">
                                <v-data-table
                                  :headers="headersDoc"
                                  :items="mainDataDraft"
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

                                  <!-- format tanggal-->
                                  <template #[`item.docDate`]="{ item }">
                                    {{ dateFormat(item.docDate) }}
                                  </template>
                                  <template #[`item.extDocDate`]="{ item }">
                                    {{
                                      item.extDocDate == ""
                                        ? ""
                                        : dateFormat(item.extDocDate)
                                    }}
                                  </template>

                                  <template #[`item.grossAmount`]="{ item }">
                                    Rp.{{ number_format(item.grossAmount) }}
                                  </template>
                                  <template #[`item.taxAmount`]="{ item }">
                                    Rp.{{ number_format(item.taxAmount) }}
                                  </template>
                                  <template #[`item.amount`]="{ item }">
                                    Rp.{{ number_format(item.totalAmount) }}
                                  </template>

                                  <!-- Unit Bisnis -->
                                  <template #[`item.ou`]="{ item }">
                                    <app-business-unit-info
                                      :data="item"
                                    ></app-business-unit-info>
                                  </template>

                                  <!-- Partner -->
                                  <template #[`item.partner`]="{ item }">
                                    <app-partner-info
                                      :data="item"
                                    ></app-partner-info>
                                  </template>

                                  <template #[`item.actions`]="{ item }">
                                    <v-tooltip bottom color="warning">
                                      <template #activator="{ on, attrs }">
                                        <v-btn
                                          x-small
                                          icon
                                          color="warning"
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="editData(item)"
                                        >
                                          <v-icon>
                                            {{ icons.mdiClipboardEditOutline }}
                                          </v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Edit</span>
                                    </v-tooltip>
                                    <v-tooltip bottom color="error">
                                      <template #activator="{ on, attrs }">
                                        <v-btn
                                          x-small
                                          icon
                                          color="error"
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="confirmDialog(item.id)"
                                          v-show="showDelete"
                                        >
                                          <v-icon>
                                            {{ icons.mdiDelete }}
                                          </v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Delete</span>
                                    </v-tooltip>
                                  </template>
                                </v-data-table>
                                <v-pagination
                                  v-model="currentPage"
                                  :length="totalPages"
                                  @input="handlePageChange"
                                  total-visible="5"
                                  v-scroll-to="'#table-draft'"
                                ></v-pagination>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item class="mt-2">
                    <v-row>
                      <v-col cols="12" class="mb-0">
                        <sales-invoice-filter-doc></sales-invoice-filter-doc>
                      </v-col>
                      <v-col id="table-inprogress" cols="12" class="mb-0 mt-n6">
                        <v-card flat>
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
                              <v-col cols="12" class="mb-0">
                                <v-data-table
                                  :headers="headersDoc"
                                  :items="mainDataInProgress"
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

                                  <!-- format tanggal-->
                                  <template #[`item.docDate`]="{ item }">
                                    {{ dateFormat(item.docDate) }}
                                  </template>
                                  <template #[`item.extDocDate`]="{ item }">
                                    {{
                                      item.extDocDate == ""
                                        ? ""
                                        : dateFormat(item.extDocDate)
                                    }}
                                  </template>

                                  <template #[`item.grossAmount`]="{ item }">
                                    Rp.{{ number_format(item.grossAmount) }}
                                  </template>
                                  <template #[`item.taxAmount`]="{ item }">
                                    Rp.{{ number_format(item.taxAmount) }}
                                  </template>
                                  <template #[`item.amount`]="{ item }">
                                    Rp.{{ number_format(item.totalAmount) }}
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
                                      <span class="text-xs">{{
                                        item.ouCode
                                      }}</span>
                                    </div>
                                  </template>

                                  <!-- Produk -->
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
                                      <span class="text-xs">{{
                                        item.partnerCode
                                      }}</span>
                                    </div>
                                  </template>

                                  <template #[`item.actions`]="{ item }">
                                    <v-tooltip bottom color="warning">
                                      <template #activator="{ on, attrs }">
                                        <v-btn
                                          x-small
                                          icon
                                          color="warning"
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="editData(item)"
                                        >
                                          <v-icon>
                                            {{ icons.mdiClipboardEditOutline }}
                                          </v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Edit</span>
                                    </v-tooltip>
                                  </template>
                                </v-data-table>
                                <v-pagination
                                  v-model="currentPage"
                                  :length="totalPages"
                                  @input="handlePageChange"
                                  total-visible="5"
                                  v-scroll-to="'#table-inprogress'"
                                ></v-pagination>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item class="mt-2">
                    <v-row>
                      <v-col cols="12" class="mb-0">
                        <sales-invoice-filter-doc></sales-invoice-filter-doc>
                      </v-col>
                      <v-col id="table-approved" cols="12" class="mb-0 mt-n6">
                        <v-card flat>
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
                              <v-col cols="12" class="mb-0">
                                <v-data-table
                                  :headers="headersDoc"
                                  :items="mainDataReleased"
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

                                  <!-- format tanggal-->
                                  <template #[`item.docDate`]="{ item }">
                                    {{ dateFormat(item.docDate) }}
                                  </template>
                                  <template #[`item.extDocDate`]="{ item }">
                                    {{
                                      item.extDocDate == ""
                                        ? ""
                                        : dateFormat(item.extDocDate)
                                    }}
                                  </template>

                                  <template #[`item.grossAmount`]="{ item }">
                                    Rp.{{ number_format(item.grossAmount) }}
                                  </template>
                                  <template #[`item.taxAmount`]="{ item }">
                                    Rp.{{ number_format(item.taxAmount) }}
                                  </template>
                                  <template #[`item.amount`]="{ item }">
                                    Rp.{{ number_format(item.totalAmount) }}
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
                                      <span class="text-xs">{{
                                        item.ouCode
                                      }}</span>
                                    </div>
                                  </template>

                                  <!-- Produk -->
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
                                      <span class="text-xs">{{
                                        item.partnerCode
                                      }}</span>
                                    </div>
                                  </template>

                                  <template #[`item.actions`]="{ item }">
                                    <v-tooltip bottom color="warning">
                                      <template #activator="{ on, attrs }">
                                        <v-btn
                                          x-small
                                          icon
                                          color="warning"
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="editData(item)"
                                        >
                                          <v-icon>
                                            {{ icons.mdiClipboardEditOutline }}
                                          </v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Edit</span>
                                    </v-tooltip>
                                  </template>
                                </v-data-table>
                                <v-pagination
                                  v-model="currentPage"
                                  :length="totalPages"
                                  @input="handlePageChange"
                                  total-visible="5"
                                  v-scroll-to="'#table-approved'"
                                ></v-pagination>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                </v-tabs-items>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import SalesInvoiceFilterCreate from "@/views/sales-invoice/SalesInvoiceFilterCreate";
import SalesInvoiceFilterDoc from "@/views/sales-invoice/SalesInvoiceFilterDoc";
import themeConfig from "@themeConfig";
import { mdiClipboardEditOutline, mdiDelete, mdiPlus } from "@mdi/js";
import Form from "vform";
import moment from "moment";
import { dateFormat, number_format, isInArray } from "../../../constan";
import axios from "@axios";
import router from "@/router";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import { dataSalesInvoice } from "./SalesInvoiceData";
import AppBusinessUnitInfo from "@/@core/components/app-table-component/AppBusinessUnitInfo";
import AppPartnerInfo from "@/@core/components/app-table-component/AppPartnerInfo.vue";
import SalesInvoiceCreate from "@/views/sales-invoice/process-page/SalesInvoiceCreate";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    SalesInvoiceFilterCreate,
    SalesInvoiceFilterDoc,
    AppCardLoader,
    AppBusinessUnitInfo,
    AppPartnerInfo,
    SalesInvoiceCreate,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,

      showCreate:
        isInArray("addSalesInvoice", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray("deleteSalesInvoice", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",

      icons: {
        mdiPlus,
        mdiDelete,
        mdiClipboardEditOutline,
      },

      readonly: true,
      disabled: false,
      outlined: true,
      clearable: true,
      valueWhenIsEmpty: "",
      options: {
        locale: "pt-BR",
        prefix: "",
        suffix: "",
        length: 20,
        precision: 2,
      },
      properties: {
        hint: "my hint",
      },

      currentTab: 0,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      isDialogVisible: false,
      salesInvoiceForm: true,
      form: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
      formDraft: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
      formInProgress: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
      formRelease: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      selected: [],
      mainData: dataSalesInvoice,
      mainDataDraft: [],
      mainDataInProgress: [],
      mainDataReleased: [],
      headers: [
        {
          text: "No. Dok.",
          value: "docNo",
          width: "300px",
        },
        {
          text: "Tanggal Dok.",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Ou",
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
          width: "200px",
          align: "right",
          sortable: false,
        },
        {
          text: "Remark",
          value: "remark",
          width: "350px",
        },
      ],
      headersDoc: [
        {
          text: "Actions",
          value: "actions",
          width: "100px",
          sortable: false,
        },
        {
          text: "No. Dok.",
          value: "docNo",
          width: "300px",
        },
        {
          text: "Tanggal Dok.",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Ou",
          value: "ou",
          width: "200px",
        },
        {
          text: "Partner",
          value: "partner",
          width: "200px",
        },
        {
          text: "Gross Amount",
          value: "grossAmount",
          width: "150px",
          align: "right",
          sortable: false,
        },
        {
          text: "Tax Amount",
          value: "taxAmount",
          width: "100px",
          align: "right",
          sortable: false,
        },
        {
          text: "Total Amount",
          value: "amount",
          width: "200px",
          align: "right",
          sortable: false,
        },
        {
          text: "Remark",
          value: "remark",
          width: "350px",
        },
      ],
    };
  },
  mounted() {
    // this.$root.$on("filterSalesInvoiceCreate", (msg) => {
    //   this.form = msg;
    //   this.refreshDataSalesOrder();
    // });
    this.$root.$on("filterSalesInvoiceDoc", (msg) => {
      this.currentPage = 1;
      this.ofset = 0;
      if (this.currentTab == 1) {
        this.formDraft = msg;
        this.refreshDataDraft();
      } else if (this.currentTab == 2) {
        this.formInProgress = msg;
        this.refreshDataInProgress();
      } else if (this.currentTab == 3) {
        this.formRelease = msg;
        this.refreshDataReleased();
      }
    });
    this.$root.$on("SalesInvoice", (msg) => {
      if (!msg) {
        this.mainData = [];
      } else {
      }
    });
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    dateFormat(value) {
      return dateFormat(value);
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    getItemPerPage(val) {
      this.itemPerPage = val;
      this.ofset = 0;
      this.currentPage = 1;
      if (this.currentTab == 1) {
        this.refreshDataDraft();
      } else if (this.currentTab == 2) {
        this.refreshDataInProgress();
      } else if (this.currentTab == 3) {
        this.refreshDataReleased();
      }
    },
    handlePageChange(value) {
      this.currentPage = value;
      if (this.currentPage == 1) {
        this.ofset = 0;
      } else {
        this.ofset = (this.currentPage - 1) * this.itemPerPage;
      }
      if (this.currentTab == 1) {
        this.refreshDataDraft();
      } else if (this.currentTab == 2) {
        this.refreshDataInProgress();
      } else if (this.currentTab == 3) {
        this.refreshDataReleased();
      }
    },
    createData() {
      if (this.selected.length > 0) {
        this.$root.$emit("SalesInvoice", this.salesInvoiceForm);
        const data = ["addData", this.selected, this.form];
        this.$root.$emit("SalesInvoiceForm", data);
      } else {
        this.notif("error", "Failed", "Please select sales order first!.");
      }
    },
    editData(data) {
      this.$root.$emit("SalesInvoice", this.salesInvoiceForm);
      const item = ["editData", data, ""];
      this.$root.$emit("SalesInvoiceForm", item);
    },
    confirmDialog(id) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.removeData(id);
          setTimeout(() => {
            dialog.close();
          }, 500);
        })
        .catch(() => {
          this.refreshData();
        });
    },
    removeData(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_sl}/sales-invoice/remove/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.notif("success", "Success", response.data.meta.message);
          this.refreshDataDraft();
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
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      var ouId = -99;
      var partnerId = -99;
      var dateFrom = "";
      var dateTo = "";
      var workflowStatus = "";
      var docNo = "";

      if (this.currentTab == 1) {
        ouId =
          this.formDraft.ouId == "" || this.formDraft.ouId == null
            ? -99
            : parseInt(this.formDraft.ouId);
        partnerId =
          this.formDraft.partnerId == "" || this.formDraft.partnerId == null
            ? -99
            : parseInt(this.formDraft.partnerId);
        dateFrom = moment(this.formDraft.startDate).format("YYYYMMDD");
        dateTo = moment(this.formDraft.endDate).format("YYYYMMDD");
        docNo = this.formDraft.docNo;
        workflowStatus = "DRAFT";
      } else if (this.currentTab == 2) {
        ouId =
          this.formInProgress.ouId == "" || this.formInProgress.ouId == null
            ? -99
            : parseInt(this.formInProgress.ouId);
        partnerId =
          this.formInProgress.partnerId == "" ||
          this.formInProgress.partnerId == null
            ? -99
            : parseInt(this.formInProgress.partnerId);
        dateFrom = moment(this.formInProgress.startDate).format("YYYYMMDD");
        dateTo = moment(this.formInProgress.endDate).format("YYYYMMDD");
        docNo = this.formInProgress.docNo;
        workflowStatus = "INPROGRESS";
      } else if (this.currentTab == 3) {
        ouId =
          this.formRelease.ouId == "" || this.formRelease.ouId == null
            ? -99
            : parseInt(this.formRelease.ouId);
        partnerId =
          this.formRelease.partnerId == "" || this.formRelease.partnerId == null
            ? -99
            : parseInt(this.formRelease.partnerId);
        dateFrom = moment(this.formRelease.startDate).format("YYYYMMDD");
        dateTo = moment(this.formRelease.endDate).format("YYYYMMDD");
        docNo = this.formRelease.docNo;
        workflowStatus = "REALESED";
      }
      axios
        .get(
          `${themeConfig.app.api_sl}/sales-invoice/count?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            if (response.data.result > this.itemPerPage) {
              this.totalPages = Math.ceil(
                response.data.result / this.itemPerPage
              );
            }
          } else {
            this.totalPages = 1;
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
    },
    refreshDataSalesOrder() {
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
      const dateFrom = moment(this.form.startDate).format("YYYYMMDD");
      const dateTo = moment(this.form.endDate).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_sl}/sales-invoice/so/transaction/outstanding/list?ouId=${ouId}&partnerId=${partnerId}&docNo=${this.form.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.selected = [];
          if (response.data.result !== null) {
            this.mainData = response.data.result;
          } else {
            // temporary
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
          this.notif("error", "Gagal", e.response.data.meta.message);
        });
    },
    refreshDataDraft() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.formDraft.ouId == "" || this.formDraft.ouId == null
          ? -99
          : parseInt(this.formDraft.ouId);
      const partnerId =
        this.formDraft.partnerId == "" || this.formDraft.partnerId == null
          ? -99
          : parseInt(this.formDraft.partnerId);
      const dateFrom = moment(this.formDraft.startDate).format("YYYYMMDD");
      const dateTo = moment(this.formDraft.endDate).format("YYYYMMDD");
      const workflowStatus = "DRAFT";
      axios
        .get(
          `${themeConfig.app.api_sl}/sales-invoice/list?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${this.formDraft.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getCountData();
          if (response.data.result !== null)
            return (this.mainDataDraft = response.data.result);
          this.mainDataDraft = [];
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
    refreshDataInProgress() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.formInProgress.ouId == "" || this.formInProgress.ouId == null
          ? -99
          : parseInt(this.formInProgress.ouId);
      const partnerId =
        this.formInProgress.partnerId == "" ||
        this.formInProgress.partnerId == null
          ? -99
          : parseInt(this.formInProgress.partnerId);
      const dateFrom = moment(this.formInProgress.startDate).format("YYYYMMDD");
      const dateTo = moment(this.formInProgress.endDate).format("YYYYMMDD");
      const workflowStatus = "INPROGRESS";
      axios
        .get(
          `${themeConfig.app.api_sl}/sales-invoice/list?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${this.formInProgress.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getCountData();
          if (response.data.result !== null)
            return (this.mainDataInProgress = response.data.result);
          this.mainDataInProgress = [];
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
    refreshDataReleased() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.formRelease.ouId == "" || this.formRelease.ouId == null
          ? -99
          : parseInt(this.formRelease.ouId);
      const partnerId =
        this.formRelease.partnerId == "" || this.formRelease.partnerId == null
          ? -99
          : parseInt(this.formRelease.partnerId);
      const dateFrom = moment(this.formRelease.startDate).format("YYYYMMDD");
      const dateTo = moment(this.formRelease.endDate).format("YYYYMMDD");
      const workflowStatus = "RELEASED";
      axios
        .get(
          `${themeConfig.app.api_sl}/sales-invoice/list?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${this.formRelease.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getCountData();
          if (response.data.result !== null)
            return (this.mainDataReleased = response.data.result);
          this.mainDataReleased = [];
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
  },
};
</script>
