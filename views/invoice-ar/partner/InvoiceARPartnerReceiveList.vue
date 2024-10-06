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
            <span class="">Conversion Cash/Bank In Partner Receive</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="mb-0">
                <v-tabs
                  grow
                  v-model="currentTab"
                  @change="
                    currentTab == 0
                      ? refreshData()
                      : currentTab == 1
                      ? refreshDataByPaymentOrder()
                      : refreshDataConversionCashbank()
                  "
                >
                  <v-tab> Create Invoicing Transactional </v-tab>
                  <v-tab v-show="false"> Create Payment Order Internal </v-tab>
                  <v-tab> Draft </v-tab>
                  <v-tab> In Progress </v-tab>
                  <v-tab> Approved </v-tab>
                </v-tabs>
                <v-tabs-items v-model="currentTab">
                  <v-tab-item class="mt-2">
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <invoice-a-r-partner-receive-filter></invoice-a-r-partner-receive-filter>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-card flat>
                          <v-card-title class="mt-n4 mb-n4">
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              small
                              dark
                              v-show="showCreate"
                              @click="createConversion()"
                            >
                              <v-icon dark left>{{ icons.mdiPlus }}</v-icon>
                              Create
                            </v-btn>
                          </v-card-title>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" class="pb-0">
                                <v-data-table
                                  :headers="headers"
                                  :items="mainData"
                                  :footer-props="{
                                    'items-per-page-options': [25, 50, 100],
                                  }"
                                  disable-pagination
                                  fixed-header
                                  dense
                                  v-model="selected"
                                  single-select
                                  item-key="id"
                                  show-select
                                >
                                  <template #[`header.docNo`]>
                                    {{ docNo }}
                                  </template>
                                  <template #[`header.docDate`]>
                                    {{ docDate }}
                                  </template>

                                  <!-- format tanggal-->
                                  <template #[`item.docDate`]="{ item }">
                                    {{ dateFormat(item.docDate) }}
                                  </template>

                                  <template #[`item.cashbankName`]="{ item }">
                                    <div>
                                      <span
                                        class="
                                          d-block
                                          text--primary
                                          font-weight-semibold
                                          text-truncate
                                        "
                                        >{{ item.cashbankName }}</span
                                      >
                                      <span class="text-xs">{{
                                        item.cashbankCode
                                      }}</span>
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
                                      <span class="text-xs">{{
                                        item.partnerCode
                                      }}</span>
                                    </div>
                                  </template>

                                  <!-- format uang-->
                                  <template #[`item.amount`]="{ item }">
                                    Rp.{{ number_format(item.invoiceAmount) }}
                                  </template>
                                </v-data-table>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-tab-item>

                  <v-tab-item class="mt-2" v-show="false">
                    <v-row>
                      <v-col cols="12" class="mb-0">
                        <invoice-a-r-partner-receive-filter-payment-order></invoice-a-r-partner-receive-filter-payment-order>
                      </v-col>
                      <v-col cols="12" class="mb-0">
                        <v-card flat>
                          <v-card-title>
                            <v-spacer></v-spacer>
                            <v-btn
                              small
                              dark
                              color="primary"
                              @click="createPaymentOrder()"
                            >
                              <v-icon dark left>
                                {{ icons.mdiPlus }}
                              </v-icon>
                              Create
                            </v-btn>
                          </v-card-title>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" class="mb-0">
                                <v-data-table
                                  :headers="headers"
                                  :items="mainDatabyPaymentOrder"
                                  :footer-props="{
                                    'items-per-page-options': [25, 50, 100],
                                  }"
                                  disable-pagination
                                  fixed-header
                                  dense
                                  v-model="selectedByPaymentOrder"
                                  item-key="id"
                                  show-select
                                >
                                  <template #[`header.docNo`]>
                                    {{ docNo }}
                                  </template>
                                  <template #[`header.docDate`]>
                                    {{ docDate }}
                                  </template>
                                  <template #[`header.amount`]>
                                    Payment Amount
                                  </template>

                                  <!-- format tanggal-->
                                  <template #[`item.docDate`]="{ item }">
                                    {{ dateFormat(item.docDate) }}
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
                                      <span class="text-xs">{{
                                        item.partnerCode
                                      }}</span>
                                    </div>
                                  </template>

                                  <!-- format uang-->
                                  <template #[`item.amount`]="{ item }">
                                    Rp.{{ number_format(item.paymentAmount) }}
                                  </template>
                                </v-data-table>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-tab-item>

                  <v-tab-item class="mt-2">
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <invoice-a-r-partner-receive-filter-doc
                          :filter-type="'DRAFT'"
                        ></invoice-a-r-partner-receive-filter-doc>
                      </v-col>
                      <v-col id="table-draft" cols="12" class="mb-0">
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
                                  <template #[`item.refDocDate`]="{ item }">
                                    {{
                                      item.refDocDate == ""
                                        ? ""
                                        : dateFormat(item.refDocDate)
                                    }}
                                  </template>
                                  <template #[`item.paymenyRefDate`]="{ item }">
                                    {{ dateFormat(item.paymenyRefDate) }}
                                  </template>

                                  <template
                                    #[`item.paymentRefAmount`]="{ item }"
                                  >
                                    Rp.{{
                                      number_format(item.paymentRefAmount)
                                    }}
                                  </template>
                                  <template #[`item.costPayment`]="{ item }">
                                    Rp.{{ number_format(item.costPayment) }}
                                  </template>
                                  <template #[`item.paymentAmount`]="{ item }">
                                    Rp.{{ number_format(item.paymentAmount) }}
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
                                    <v-tooltip bottom color="error">
                                      <template #activator="{ on, attrs }">
                                        <v-btn
                                          x-small
                                          icon
                                          color="error"
                                          v-bind="attrs"
                                          v-on="on"
                                          v-show="showDelete"
                                          @click="confirmDialog(item)"
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
                      <v-col cols="12" class="pb-0">
                        <invoice-a-r-partner-receive-filter-doc
                          :filter-type="'INPROGRESS'"
                        ></invoice-a-r-partner-receive-filter-doc>
                      </v-col>
                      <v-col id="table-inprogress" cols="12" class="mb-0">
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
                                  <template #[`item.refDocDate`]="{ item }">
                                    {{
                                      item.refDocDate == ""
                                        ? ""
                                        : dateFormat(item.refDocDate)
                                    }}
                                  </template>
                                  <template #[`item.paymenyRefDate`]="{ item }">
                                    {{ dateFormat(item.paymenyRefDate) }}
                                  </template>

                                  <template
                                    #[`item.paymentRefAmount`]="{ item }"
                                  >
                                    Rp.{{
                                      number_format(item.paymentRefAmount)
                                    }}
                                  </template>
                                  <template #[`item.costPayment`]="{ item }">
                                    Rp.{{ number_format(item.costPayment) }}
                                  </template>
                                  <template #[`item.paymentAmount`]="{ item }">
                                    Rp.{{ number_format(item.paymentAmount) }}
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
                      <v-col cols="12" class="pb-0">
                        <invoice-a-r-partner-receive-filter-doc
                          :filter-type="'APPROVED'"
                        ></invoice-a-r-partner-receive-filter-doc>
                      </v-col>
                      <v-col id="table-approved" cols="12" class="mb-0">
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
                                  <template #[`item.refDocDate`]="{ item }">
                                    {{
                                      item.refDocDate == ""
                                        ? ""
                                        : dateFormat(item.refDocDate)
                                    }}
                                  </template>
                                  <template #[`item.paymenyRefDate`]="{ item }">
                                    {{ dateFormat(item.paymenyRefDate) }}
                                  </template>

                                  <template
                                    #[`item.paymentRefAmount`]="{ item }"
                                  >
                                    Rp.{{
                                      number_format(item.paymentRefAmount)
                                    }}
                                  </template>
                                  <template #[`item.costPayment`]="{ item }">
                                    Rp.{{ number_format(item.costPayment) }}
                                  </template>
                                  <template #[`item.paymentAmount`]="{ item }">
                                    Rp.{{ number_format(item.paymentAmount) }}
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
import InvoiceARPartnerReceiveFilter from "@/views/invoice-ar/partner/InvoiceARPartnerReceiveFilter";
import InvoiceARPartnerReceiveFilterDoc from "@/views/invoice-ar/partner/InvoiceARPartnerReceiveFilterDoc";
import InvoiceARPartnerReceiveFilterPaymentOrder from "@/views/invoice-ar/partner/InvoiceARPartnerReceiveFilterPaymentOrder";
import themeConfig from "@themeConfig";
import Form from "vform";
import moment from "moment";
import { mdiClipboardEditOutline, mdiDelete, mdiPlus } from "@mdi/js";
import { dateFormat, number_format, isInArray } from "../../../../constan";
import axios from "@axios";
import router from "@/router";

import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import "../../../styles/textstyle.css";

Vue.use(VueScrollTo);

export default {
  name: "childList",
  components: {
    InvoiceARPartnerReceiveFilter,
    InvoiceARPartnerReceiveFilterDoc,
    InvoiceARPartnerReceiveFilterPaymentOrder,
    AppCardLoader,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,

      icons: {
        mdiPlus,
        mdiDelete,
        mdiClipboardEditOutline,
      },

      // role
      showCreate:
        isInArray(
          "addConversionCashBankInPartnerReceive",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      showDelete:
        isInArray(
          "deleteConversionCashBankInPartnerReceive",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

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
      selected: [],
      selectedByPaymentOrder: [],

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      isDialogVisible: false,
      invoiceARPartnerReceiveForm: true,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      mainDatabyPaymentOrder: [],
      mainDataGlList: [],
      mainDataDraft: [],
      mainDataInProgress: [],
      mainDataReleased: [],
      mainDataGlSelect: [],
      form: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
      formPaymentOrder: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
      formDoc: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
      headers: [
        {
          text: "Doc Type",
          value: "docType",
          width: "250px",
        },
        {
          text: "No. Dok.",
          value: "docNo",
          width: "250px",
        },
        {
          text: "Tanggal Dok.",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Cash/Bank",
          value: "cashbankName",
          width: "170px",
        },
        {
          text: "Partner",
          value: "partner",
          width: "200px",
        },
        {
          text: "Invoice Amount",
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
      headersGlSelect: [
        {
          text: "Activity G/L",
          value: "activityGlCode",
          width: "150px",
        },
        {
          text: "Coa Desc",
          value: "coaDesc",
          width: "350px",
        },
      ],
      headersGlList: [
        {
          text: "Activity G/L",
          value: "activityGlCode",
          width: "150px",
        },
        {
          text: "Coa Desc",
          value: "coaDesc",
          width: "250px",
        },
        {
          text: "Amount",
          value: "amount",
          width: "150px",
          align: "right",
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
          width: "200px",
        },
        {
          text: "Tanggal Dok.",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Ext. Doc No",
          value: "extDocNo",
          width: "200px",
        },
        {
          text: "Ext. Doc Date",
          value: "extDocDate",
          width: "175px",
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
          text: "Invoice No",
          value: "refDocNo",
          width: "200px",
        },
        {
          text: "Invoice Date",
          value: "refDocDate",
          width: "150px",
        },
        {
          text: "Payment Ref No",
          value: "paymentReferenceNo",
          width: "200px",
        },
        {
          text: "Payment Ref Date",
          value: "paymenyRefDate",
          width: "175px",
        },
        // {
        //   text: 'Realization Amount', value: 'paymentRefAmount', width: '200px', align: 'right',
        // },
        // {
        //   text: 'Cost Amount', value: 'costPayment', width: '200px', align: 'right',
        // },
        {
          text: "Payment Nett Amount",
          value: "paymentAmount",
          width: "200px",
          align: "right",
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
    this.$root.$on("filterInvoiceARPartnerReceive", (msg) => {
      this.form = msg;
      this.refreshData();
    });
    this.$root.$on("InvoiceARPartnerReceiveFilterpaymentOrder", (msg) => {
      this.formPaymentOrder = msg;
      this.refreshDataByPaymentOrder();
    });
    this.$root.$on("filterInvoiceARPartnerReceiveDoc", (msg) => {
      this.currentPage = 1;
      this.ofset = 0;
      this.formDoc = msg;
      this.refreshDataConversionCashbank();
    });
    this.$root.$on("InvoiceARPertnerReceiveReturn", (msg) => {
      if (this.currentTab == 0) {
        this.refreshData();
      } else if (this.currentTab == 1) {
        this.refreshDataByPaymentOrder();
      } else {
        this.refreshDataConversionCashbank();
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
      this.refreshDataConversionCashbank();
    },
    handlePageChange(value) {
      this.currentPage = value;
      if (this.currentPage == 1) {
        this.ofset = 0;
      } else {
        this.ofset = (this.currentPage - 1) * this.itemPerPage;
      }
      this.refreshDataConversionCashbank();
    },
    createConversion() {
      if (this.selected.length > 0) {
        this.$root.$emit(
          "InvoiceARPertnerReceive",
          this.invoiceARPartnerReceiveForm
        );
        const data = ["addData", this.selected];
        this.$root.$emit("InvoiceARPertnerReceiveForm", data);
      } else {
        this.notif("error", "Failed", "Please select invoice first!.");
      }
    },
    createPaymentOrder() {
      // if (this.selected.length > 0) {
      this.$root.$emit(
        "InvoiceARPertnerReceivebyPaymentOrder",
        this.invoiceARPartnerReceiveForm
      );
      const data = [
        "addData",
        this.selectedByPaymentOrder,
        this.formPaymentOrder,
      ];
      this.$root.$emit("InvoiceARPertnerReceiveFormPaymentOrder", data);
      // }else{
      //   this.notif('error','Failed', "Please select invoice first!.")
      // }
    },
    refreshDataActivityGl() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const keyword = "";
      axios
        .get(
          `${themeConfig.app.api_master}/activity-gl/list?keyword=${this.formPaymentOrder.keyword}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainDataGlList = response.data.result;
            this.mainDataGlList.forEach((element, index) => {
              this.mainDataGlList[index].amount = 0;
            });
          } else {
            this.mainDataGlList = [];
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
        this.form.ouId == "" || this.form.ouId == null
          ? -99
          : parseInt(this.form.ouId);
      const partnerId =
        this.form.partnerId == "" || this.form.partnerId == null
          ? -99
          : parseInt(this.form.partnerId);
      const dateFrom = moment(this.form.startDate).format("YYYYMMDD");
      const dateTo = moment(this.form.endDate).format("YYYYMMDD");
      // if (partnerId == -99) {
      //   this.isDialogVisible = false;
      //   this.mainData = [];
      // } else {
      axios
        .get(
          `${themeConfig.app.api_cb}/conversion/invoice-ar-list?ouId=${ouId}&partnerId=${partnerId}&docNo=${this.form.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.selected = [];
          if (response.data.result !== null) {
            this.mainData = response.data.result;
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
      // }
    },
    refreshDataByPaymentOrder() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.formPaymentOrder.ouId == "" || this.formPaymentOrder.ouId == null
          ? -99
          : parseInt(this.formPaymentOrder.ouId);
      const partnerId =
        this.formPaymentOrder.partnerId == "" ||
        this.formPaymentOrder.partnerId == null
          ? -99
          : parseInt(this.formPaymentOrder.partnerId);
      const dateFrom = moment(this.formPaymentOrder.startDate).format(
        "YYYYMMDD"
      );
      const dateTo = moment(this.formPaymentOrder.endDate).format("YYYYMMDD");
      if (partnerId == -99) {
        this.isDialogVisible = false;
        this.mainDatabyPaymentOrder = [];
      } else {
        axios
          .get(
            `${themeConfig.app.api_cb}/payment-order/list?ouId=${ouId}&partnerId=${partnerId}&docNo=${this.formPaymentOrder.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.selectedByPaymentOrder = [];
            if (response.data.result !== null) {
              this.mainDatabyPaymentOrder = response.data.result;
            } else {
              this.mainDatabyPaymentOrder = [];
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
      }
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
        this.formDoc.ouId == "" || this.formDoc.ouId == null
          ? -99
          : parseInt(this.formDoc.ouId);
      const partnerId =
        this.formDoc.partnerId == "" || this.formDoc.partnerId == null
          ? -99
          : parseInt(this.formDoc.partnerId);
      const dateFrom = moment(this.formDoc.startDate).format("YYYYMMDD");
      const dateTo = moment(this.formDoc.endDate).format("YYYYMMDD");
      const workflowStatus =
        this.currentTab == 2
          ? "DRAFT"
          : this.currentTab == 3
          ? "INPROGRESS"
          : this.currentTab == 4
          ? "REALESED"
          : "";
      axios
        .get(
          `${themeConfig.app.api_cb}/conversion/count-list?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${this.formDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
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
    editData(data) {
      if (data.docTypeId == 308) {
        this.$root.$emit(
          "InvoiceARPertnerReceive",
          this.invoiceARPartnerReceiveForm
        );
        const item = ["editData", data];
        this.$root.$emit("InvoiceARPertnerReceiveForm", item);
      } else if (data.docTypeId == 309) {
        this.$root.$emit(
          "InvoiceARPertnerReceivebyPaymentOrder",
          this.invoiceARPartnerReceiveForm
        );
        const item = ["editData", data, ""];
        this.$root.$emit("InvoiceARPertnerReceiveFormPaymentOrder", item);
      }
    },
    confirmDialog(data) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.removeData(data);
          setTimeout(() => {
            dialog.close();
          }, 500);
        })
        .catch(() => {
          this.refreshData();
        });
    },
    removeData(data) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      var modul = "";
      if (data.docTypeId == 309) {
        modul = "payment-order";
      } else if (data.docTypeId == 308) {
        modul = "conversion";
      }
      axios
        .get(`${themeConfig.app.api_cb}/${modul}/remove/${data.id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.notif("success", "Success", response.data.meta.message);
          this.refreshDataConversionCashbank();
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
    },
    refreshDataConversionCashbank() {
      if (this.currentTab == 2) {
        this.refreshDataConversionCashbankDraft();
      } else if (this.currentTab == 3) {
        this.refreshDataConversionCashbankInProgress();
      } else if (this.currentTab == 4) {
        this.refreshDataConversionCashbankReleased();
      }
    },
    refreshDataConversionCashbankDraft() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.formDoc.ouId == "" || this.formDoc.ouId == null
          ? -99
          : parseInt(this.formDoc.ouId);
      const partnerId =
        this.formDoc.partnerId == "" || this.formDoc.partnerId == null
          ? -99
          : parseInt(this.formDoc.partnerId);
      const dateFrom = moment(this.formDoc.startDate).format("YYYYMMDD");
      const dateTo = moment(this.formDoc.endDate).format("YYYYMMDD");
      const workflowStatus = "DRAFT";
      axios
        .get(
          `${themeConfig.app.api_cb}/conversion/list?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${this.formDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
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
    refreshDataConversionCashbankInProgress() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.formDoc.ouId == "" || this.formDoc.ouId == null
          ? -99
          : parseInt(this.formDoc.ouId);
      const partnerId =
        this.formDoc.partnerId == "" || this.formDoc.partnerId == null
          ? -99
          : parseInt(this.formDoc.partnerId);
      const dateFrom = moment(this.formDoc.startDate).format("YYYYMMDD");
      const dateTo = moment(this.formDoc.endDate).format("YYYYMMDD");
      const workflowStatus = "INPROGRESS";
      axios
        .get(
          `${themeConfig.app.api_cb}/conversion/list?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${this.formDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
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
    refreshDataConversionCashbankReleased() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.formDoc.ouId == "" || this.formDoc.ouId == null
          ? -99
          : parseInt(this.formDoc.ouId);
      const partnerId =
        this.formDoc.partnerId == "" || this.formDoc.partnerId == null
          ? -99
          : parseInt(this.formDoc.partnerId);
      const dateFrom = moment(this.formDoc.startDate).format("YYYYMMDD");
      const dateTo = moment(this.formDoc.endDate).format("YYYYMMDD");
      const workflowStatus = "RELEASED";
      axios
        .get(
          `${themeConfig.app.api_cb}/conversion/list?workflowStatus=${workflowStatus}&ouId=${ouId}&partnerId=${partnerId}&docNo=${this.formDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
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
