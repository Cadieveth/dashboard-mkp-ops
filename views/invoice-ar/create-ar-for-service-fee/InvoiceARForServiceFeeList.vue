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
          <v-card-title>
            <span>Invoicing Transactional</span>
          </v-card-title>
          <v-card-text>
            <v-tabs
              grow
              v-model="currentTab"
              @change="
                currentTab == 0
                  ? refreshData()
                  : currentTab == 1
                  ? refreshInvoiceFeeListDraft()
                  : currentTab == 2
                  ? refreshInvoiceFeeListInprogress()
                  : refreshInvoiceFeeListRealesed()
              "
            >
              <v-tab> Create </v-tab>
              <v-tab> Draft </v-tab>
              <v-tab> In Progress </v-tab>
              <v-tab> Approved </v-tab>
            </v-tabs>
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <v-row>
                  <v-col cols="12" class="mb-0 mt-2">
                    <invoice-a-r-for-service-fee-filter></invoice-a-r-for-service-fee-filter>
                  </v-col>
                  <v-col cols="12" class="mt-n8">
                    <v-card flat>
                      <v-card-title class="">
                        <v-spacer></v-spacer>
                        <span class="me-2">Total Amount:</span>
                        <span class="font-weight-semibold me-3"
                          >Rp. {{ number_format(amountTotal) }}</span
                        >
                        <v-btn
                          small
                          dark
                          color="primary"
                          @click="createInvoice()"
                          v-show="showAdd"
                        >
                          <v-icon dark left>
                            {{ icons.mdiClipboardEditOutline }}
                          </v-icon>
                          Create Account Receivable
                        </v-btn>
                      </v-card-title>
                      <v-card-text>
                        <v-data-table
                          :headers="headers"
                          :items="mainData"
                          :footer-props="{
                            'items-per-page-options': [25, 50, 100],
                          }"
                          disable-pagination
                          fixed-header
                          dense
                        >
                          <template #[`header.ouBranch`]>
                            {{ ouBTbl }}
                          </template>
                          <template #[`header.ouSubBranch`]>
                            {{ ouSBTbl }}
                          </template>

                          <!-- format tanggal-->
                          <template #[`item.docDate`]="{ item }">
                            {{ dateFormat(item.docDate) }}
                          </template>
                          <template #[`item.dateFrom`]="{ item }">
                            {{ dateFormat(item.invoiceDateFrom) }}
                          </template>
                          <template #[`item.dateTo`]="{ item }">
                            {{ dateFormat(item.invoiceDateTo) }}
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
                                >{{ item.ouBranchName }}</span
                              >
                              <span class="text-xs">{{
                                item.ouBranchCode
                              }}</span>
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
                                >{{ item.subBranchName }}</span
                              >
                              <span class="text-xs">{{
                                item.subBranchCode
                              }}</span>
                            </div>
                          </template>

                          <!-- format uang-->
                          <template #[`item.amount`]="{ item }">
                            Rp.{{ number_format(item.amount) }}
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-col cols="12" class="mb-0 mt-2">
                    <invoice-a-r-for-service-fee-filter-doc
                      :filter-type="'DRAFT'"
                    ></invoice-a-r-for-service-fee-filter-doc>
                  </v-col>
                  <v-col id="table-draft" cols="12" class="mt-n8">
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
                                    ? "-"
                                    : dateFormat(item.extDocDate)
                                }}
                              </template>
                              <template #[`item.taxDate`]="{ item }">
                                {{
                                  item.taxDate == ""
                                    ? "- "
                                    : dateTimeFormat(item.taxDate)
                                }}
                              </template>
                              <template #[`item.npwpDate`]="{ item }">
                                {{
                                  item.npwpDate == ""
                                    ? "-"
                                    : dateFormat(item.npwpDate)
                                }}
                              </template>

                              <template #[`item.baseAmount`]="{ item }">
                                Rp.{{ number_format(item.baseAmount) }}
                              </template>
                              <template #[`item.tax`]="{ item }">
                                {{ item.taxName }}(Rp.{{
                                  number_format(item.taxAmount)
                                }})
                              </template>
                              <template #[`item.invoiceAmount`]="{ item }">
                                Rp.{{ number_format(item.invoiceAmount) }}
                              </template>
                              <template #[`item.amount`]="{ item }">
                                Rp.{{ number_format(item.amount) }}
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
                                <v-tooltip bottom color="error">
                                  <template #activator="{ on, attrs }">
                                    <v-btn
                                      x-small
                                      icon
                                      color="error"
                                      v-bind="attrs"
                                      v-on="on"
                                      @click="deleteData(item.id)"
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
              <v-tab-item>
                <v-row>
                  <v-col cols="12" class="mb-0 mt-2">
                    <invoice-a-r-for-service-fee-filter-doc
                      :filter-type="'INPROGRESS'"
                    ></invoice-a-r-for-service-fee-filter-doc>
                  </v-col>
                  <v-col id="table-inprogress" cols="12" class="mt-n8">
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
                                    ? "-"
                                    : dateFormat(item.extDocDate)
                                }}
                              </template>
                              <template #[`item.taxDate`]="{ item }">
                                {{
                                  item.taxDate == ""
                                    ? "- "
                                    : dateTimeFormat(item.taxDate)
                                }}
                              </template>
                              <template #[`item.npwpDate`]="{ item }">
                                {{
                                  item.npwpDate == ""
                                    ? "-"
                                    : dateFormat(item.npwpDate)
                                }}
                              </template>

                              <template #[`item.baseAmount`]="{ item }">
                                Rp.{{ number_format(item.baseAmount) }}
                              </template>
                              <template #[`item.tax`]="{ item }">
                                {{ item.taxName }}(Rp.{{
                                  number_format(item.taxAmount)
                                }})
                              </template>
                              <template #[`item.invoiceAmount`]="{ item }">
                                Rp.{{ number_format(item.invoiceAmount) }}
                              </template>
                              <template #[`item.amount`]="{ item }">
                                Rp.{{ number_format(item.amount) }}
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
              <v-tab-item>
                <v-row>
                  <v-col cols="12" class="mb-0 mt-2">
                    <invoice-a-r-for-service-fee-filter-doc
                      :filter-type="'APPROVED'"
                    ></invoice-a-r-for-service-fee-filter-doc>
                  </v-col>
                  <v-col id="table-approved" cols="12" class="mt-n8">
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
                              :items="mainDataRealesed"
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
                                    ? "-"
                                    : dateFormat(item.extDocDate)
                                }}
                              </template>
                              <template #[`item.taxDate`]="{ item }">
                                {{
                                  item.taxDate == ""
                                    ? "- "
                                    : dateTimeFormat(item.taxDate)
                                }}
                              </template>
                              <template #[`item.npwpDate`]="{ item }">
                                {{
                                  item.npwpDate == ""
                                    ? "-"
                                    : dateFormat(item.npwpDate)
                                }}
                              </template>

                              <template #[`item.baseAmount`]="{ item }">
                                Rp.{{ number_format(item.baseAmount) }}
                              </template>
                              <template #[`item.tax`]="{ item }">
                                {{ item.taxName }}(Rp.{{
                                  number_format(item.taxAmount)
                                }})
                              </template>
                              <template #[`item.invoiceAmount`]="{ item }">
                                Rp.{{ number_format(item.invoiceAmount) }}
                              </template>
                              <template #[`item.amount`]="{ item }">
                                Rp.{{ number_format(item.amount) }}
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import InvoiceARForServiceFeeFilter from "@/views/invoice-ar/create-ar-for-service-fee/InvoiceARForServiceFeeFilter";
import InvoiceARForServiceFeeFilterDoc from "@/views/invoice-ar/create-ar-for-service-fee/InvoiceARForServiceFeeFilterDoc";
import { mdiClipboardEditOutline, mdiDelete } from "@mdi/js";
import Form from "vform";
import themeConfig from "@themeConfig";
import { dateFormat, number_format, isInArray } from "../../../../constan";
import moment from "moment";
import axios from "@axios";
import router from "@/router";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    InvoiceARForServiceFeeFilter,
    InvoiceARForServiceFeeFilterDoc,
    AppCardLoader,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouBTbl: themeConfig.labeling.ouTblB,
      ouSBTbl: themeConfig.labeling.ouTblSB,
      ouTbl: themeConfig.labeling.ouTbl,

      //role
      showAdd:
        isInArray(
          "addInvoicingTransactional",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      showDelete:
        isInArray(
          "deleteInvoicingTransactional",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      currentPage: 1,
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],

      currentTab: 0,
      formInvoiceAr: true,
      isDialogVisible: false,
      amountTotal: 0,
      mainData: [],
      mainDataDraft: [],
      mainDataInProgress: [],
      mainDataRealesed: [],

      filterForm: new Form({
        ouId: -99,
        partnerId: -99,
        invoiceId: -99,
      }),
      filterFormDoc: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      icons: {
        mdiClipboardEditOutline,
        mdiDelete,
      },
      headers: [
        {
          text: "Batch No",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Batch Date",
          value: "docDate",
          width: "150px",
        },
        {
          text: "OU Branch",
          value: "ouBranch",
          width: "150px",
        },
        {
          text: "OU Sub Branch",
          value: "ouSubBranch",
          width: "150px",
        },
        {
          text: "Invoice Date From",
          value: "dateFrom",
          width: "160px",
        },
        {
          text: "Invoice Date To",
          value: "dateTo",
          width: "150px",
        },
        {
          text: "Amount",
          value: "amount",
          width: "200px",
          align: "right",
        },
      ],
      headersDoc: [
        {
          text: "Actions",
          align: "left",
          value: "actions",
          sortable: false,
          width: "100px",
        },
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
          text: "Ext. Doc. No",
          value: "extDocNo",
          width: "200px",
        },
        {
          text: "Ext. Doc. Date",
          value: "extDocDate",
          width: "140px",
        },
        {
          text: "Unit Bisnis",
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
        },
        {
          text: "Tax",
          value: "tax",
          width: "175px",
        },
        {
          text: "Invoice Amount",
          value: "invoiceAmount",
          width: "150px",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("filterCreateInvoiceAR", (msg) => {
      this.filterForm = msg;
      if (this.currentTab == 0) {
        this.refreshData();
      }
    });
    this.$root.$on("filterDocInvoiceAR", (msg) => {
      this.currentPage = 1;
      this.ofset = 0;
      this.filterFormDoc = msg;
      if (this.currentTab == 1) {
        this.refreshInvoiceFeeListDraft();
      } else if (this.currentTab == 2) {
        this.refreshInvoiceFeeListInprogress();
      } else if (this.currentTab == 3) {
        this.refreshInvoiceFeeListRealesed();
      }
    });
    this.$root.$on("InvoiceARReturn", (msg) => {
      this.amountTotal = 0;
      if (this.currentTab == 0) {
        this.filterForm.reset();
        this.filterForm.clear();
        this.$root.$emit("filterCreateInvoiceARReset", this.filterForm);
      } else {
        this.filterFormDoc.reset();
        this.filterFormDoc.clear();
        this.$root.$emit("filterDocInvoiceARReset", this.filterFormDoc);
      }
      if (this.currentTab == 0) {
        this.refreshData();
      } else if (this.currentTab == 1) {
        this.refreshInvoiceFeeListDraft();
      } else if (this.currentTab == 2) {
        this.refreshInvoiceFeeListInprogress();
      } else if (this.currentTab == 3) {
        this.refreshInvoiceFeeListRealesed();
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
        this.refreshInvoiceFeeListDraft();
      } else if (this.currentTab == 2) {
        this.refreshInvoiceFeeListInprogress();
      } else if (this.currentTab == 3) {
        this.refreshInvoiceFeeListRealesed();
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
        this.refreshInvoiceFeeListDraft();
      } else if (this.currentTab == 2) {
        this.refreshInvoiceFeeListInprogress();
      } else if (this.currentTab == 3) {
        this.refreshInvoiceFeeListRealesed();
      }
    },
    createInvoice() {
      if (this.amountTotal > 0) {
        const item = ["addData", this.filterForm.invoiceId];
        this.$root.$emit("formInvoiceAr", this.formInvoiceAr);
        this.$root.$emit("formInvoiceArForm", item);
      } else {
        this.notif("error", "Failed", "No Data Selected!");
      }
    },
    editData(data) {
      const item = ["editData", data.id];
      this.$root.$emit("formInvoiceAr", this.formInvoiceAr);
      this.$root.$emit("formInvoiceArForm", item);
    },
    deleteData(id) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.isDialogVisible = true;
          const config = {
            headers: {
              Authorization: `Bearer ${this.$session.get("accessToken")}`,
              "Access-Control-Allow-Origin": "*",
            },
          };
          axios
            .get(
              `${themeConfig.app.api_fn}/invoice-ar/service-fee/remove/${id}`,
              config
            )
            .then((response) => {
              this.isDialogVisible = false;
              this.notif("success", "Success", response.data.meta.message);
              if (this.currentTab == 1) {
                this.refreshInvoiceFeeListDraft();
              } else if (this.currentTab == 2) {
                this.refreshInvoiceFeeListInprogress();
              } else if (this.currentTab == 3) {
                this.refreshInvoiceFeeListRealesed();
              }
            })
            .catch((e) => {
              this.isDialogVisible = false;
              this.notif("error", "Failed", e.response.data.message);
              if (e.response.status === 401) {
                localStorage.clear();
                sessionStorage.clear();
                router.push({ name: "auth-login" });
              }
            });
          dialog.close();
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
      const invoiceId =
        this.filterForm.invoiceId == "" || this.filterForm.invoiceId == null
          ? -99
          : parseInt(this.filterForm.invoiceId);
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/detail-invoice-ar-for-service-fee-list-by-invoice/${invoiceId}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.amountTotal = 0;
            response.data.result.forEach((element, index) => {
              this.amountTotal += response.data.result[index].amount;
            });
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
    getCountData() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterFormDoc.ouId == "" || this.filterFormDoc.ouId == null
          ? -99
          : parseInt(this.filterFormDoc.ouId);
      const partnerId =
        this.filterFormDoc.partnerId == "" ||
        this.filterFormDoc.partnerId == null
          ? -99
          : parseInt(this.filterFormDoc.partnerId);
      const dateFrom = moment(this.filterFormDoc.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterFormDoc.dateTo).format("YYYYMMDD");
      const workflowStatus =
        this.currentTab == 1
          ? "DRAFT"
          : this.currentTab == 2
          ? "INPROGRESS"
          : "REALESED";
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/count-list?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${this.filterFormDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
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
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    refreshInvoiceFeeListDraft() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterFormDoc.ouId == "" || this.filterFormDoc.ouId == null
          ? -99
          : parseInt(this.filterFormDoc.ouId);
      const partnerId =
        this.filterFormDoc.partnerId == "" ||
        this.filterFormDoc.partnerId == null
          ? -99
          : parseInt(this.filterFormDoc.partnerId);
      const dateFrom = moment(this.filterFormDoc.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterFormDoc.dateTo).format("YYYYMMDD");
      const workflowStatus = "DRAFT";
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/list?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${this.filterFormDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
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
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    refreshInvoiceFeeListInprogress() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterFormDoc.ouId == "" || this.filterFormDoc.ouId == null
          ? -99
          : parseInt(this.filterFormDoc.ouId);
      const partnerId =
        this.filterFormDoc.partnerId == "" ||
        this.filterFormDoc.partnerId == null
          ? -99
          : parseInt(this.filterFormDoc.partnerId);
      const dateFrom = moment(this.filterFormDoc.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterFormDoc.dateTo).format("YYYYMMDD");
      const workflowStatus = "INPROGRESS";
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/list?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${this.filterFormDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
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
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    refreshInvoiceFeeListRealesed() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterFormDoc.ouId == "" || this.filterFormDoc.ouId == null
          ? -99
          : parseInt(this.filterFormDoc.ouId);
      const partnerId =
        this.filterFormDoc.partnerId == "" ||
        this.filterFormDoc.partnerId == null
          ? -99
          : parseInt(this.filterFormDoc.partnerId);
      const dateFrom = moment(this.filterFormDoc.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterFormDoc.dateTo).format("YYYYMMDD");
      const workflowStatus = "RELEASED";
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/list?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${this.filterFormDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getCountData();
          if (response.data.result !== null)
            return (this.mainDataRealesed = response.data.result);
          this.mainDataRealesed = [];
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
