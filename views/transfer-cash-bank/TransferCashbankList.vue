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
    <v-dialog v-model="cashbankItemList" persistent width="1200">
      <v-card class="px-4 pb-6">
        <v-card-title class="font-weight-bold">
          <span> Cash/Bank Item </span>
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="d-flex justify-content-between">
          <v-row class="">
            <v-col cols="12" md="6" sm="6" class="pb-0">
              <v-text-field
                label="Cash/Bank Code/Name"
                placeholder="Insert Cash/Bank Code or Name"
                v-model="formFilterCashbank.cashbank"
                dense
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="pb-0">
              <v-text-field
                label="Account No/Name"
                placeholder="Insert Account No or Account Name"
                v-model="formFilterCashbank.account"
                dense
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-btn
            class="ml-4"
            color="primary"
            small
            dark
            @click="getCashbankList()"
          >
            <v-icon dark left>
              {{ icons.mdiMagnify }}
            </v-icon>
            Filter
          </v-btn>
        </v-card-text>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn color="success" small dark @click="addDataItemDraft()">
            <v-icon dark left>
              {{ icons.mdiPlus }}
            </v-icon>
            Add To Bucked
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headersCashbank"
            :items="mainDataCashbankList"
            hide-default-footer
            disable-pagination
            fixed-header
            dense
            v-model="selected"
            item-key="cashbankId"
            show-select
          >
            <!-- penerima-->
            <template #[`item.account`]="{ item }">
              <!--                          {{ item.accountNo }} a/n {{ item.accountName }}-->
              <div class="d-flex align-center">
                <v-avatar color="#e6e6e6" size="30">
                  <v-img
                    :src="
                      require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                    "
                  ></v-img>
                </v-avatar>

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
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span>Transfer Cashbank</span>
          </v-card-title>
          <v-card-text>
            <div>
              <v-tabs grow v-model="currentTab" @change="refreshDataFilter()">
                <v-tab> Create </v-tab>
                <v-tab> Draft </v-tab>
                <v-tab> In Progress </v-tab>
                <v-tab> Approved </v-tab>
              </v-tabs>
              <v-tabs-items v-model="currentTab">
                <v-tab-item>
                  <v-row>
                    <v-col cols="12" class="pb-0 mt-2">
                      <transfer-cashbank-filter-create></transfer-cashbank-filter-create>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-card flat>
                        <v-card-title class="pt-0">
                          <v-btn
                            color="primary"
                            small
                            dark
                            @click="cashbankItemList = true"
                          >
                            <v-icon dark left>
                              {{ icons.mdiMagnify }}
                            </v-icon>
                            Look Up
                          </v-btn>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="primary"
                            small
                            dark
                            @click="addData()"
                            v-show="showAdd"
                          >
                            <v-icon dark left>
                              {{ icons.mdiPlus }}
                            </v-icon>
                            Create
                          </v-btn>
                        </v-card-title>
                        <v-card-text>
                          <v-data-table
                            :headers="headersCreate"
                            :items="mainDataCreate"
                            fixed-header
                            hide-default-footer
                            dense
                          >
                            <!-- format uang-->
                            <template #[`item.amount`]="{ item }">
                              <!--                              Rp.{{ number_format(item.amount) }}-->
                              <vuetify-money
                                v-model="item.amount"
                                thousand-separator="."
                                decimal-separator=","
                              />
                            </template>

                            <!-- Cash/Bank-->
                            <template #[`item.cashbankCode`]="{ item }">
                              {{ item.cashbankCode }} - {{ item.cashbankName }}
                            </template>

                            <!-- penerima-->
                            <template #[`item.account`]="{ item }">
                              {{ item.accountNo }} a/n {{ item.accountName }}
                            </template>

                            <!-- action -->
                            <template #[`item.actions`]="{ item }">
                              <v-tooltip bottom color="error">
                                <template #activator="{ on, attrs }">
                                  <v-btn
                                    x-small
                                    icon
                                    color="error"
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="
                                      removeDataItemDraft(item.cashbankId)
                                    "
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
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row id="table-draft">
                    <v-col cols="12" class="pb-0 mt-2">
                      <transfer-cashbank-filter-doc></transfer-cashbank-filter-doc>
                    </v-col>
                    <v-col cols="12" class="pb-0 mt-2">
                      <v-card flat>
                        <v-card-text>
                          <v-row class="mb-4">
                            <v-col md="1" sd="2">
                              <v-select
                                v-model="itemPerPageDraft"
                                :items="itemRow"
                                label="Rows"
                                class="select"
                                hide-details
                                :menu-props="{ maxWidth: '250' }"
                                @change="getItemPerPage('Draft')"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" offset-md="7" md="4">
                              <v-text-field
                                v-model="searchDraft"
                                :append-icon="icons.mdiMagnify"
                                label="Search"
                                single-line
                                hide-details
                                dense
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-data-table
                            :headers="headersDoc"
                            :items="mainDataDraft"
                            :items-per-page="itemPerPageDraft"
                            :search="searchDraft"
                            fixed-header
                            hide-default-footer
                            dense
                          >
                            <!--header-->
                            <template #[`header.docNo`]>
                              {{ docNo }}
                            </template>
                            <template #[`header.tanggal`]>
                              {{ docDate }}
                            </template>
                            <template #[`header.ou`]>
                              {{ ouTbl }}
                            </template>

                            <!-- Business Unit-->
                            <template #[`item.ou`]="{ item }">
                              {{ item.ouCode }} - {{ item.ouName }}
                            </template>

                            <!-- format tanggal-->
                            <template #[`item.tanggal`]="{ item }">
                              {{ dateFormat(item.docDate) }}
                            </template>

                            <!-- format uang-->
                            <template #[`item.amount`]="{ item }">
                              Rp.{{ number_format(item.transferAmount) }}
                            </template>

                            <!-- penerima-->
                            <template #[`item.penerima`]="{ item }">
                              <!--                          {{ item.accountNo }} a/n {{ item.accountName }}-->
                              <div class="d-flex align-center">
                                <v-avatar color="#e6e6e6" size="30">
                                  <v-img
                                    :src="
                                      require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                                    "
                                  ></v-img>
                                </v-avatar>

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
                                  <span class="text-xs">{{
                                    item.accountNo
                                  }}</span>
                                </div>
                              </div>
                            </template>

                            <!-- action -->
                            <template #[`item.actions`]="{ item }">
                              <v-tooltip bottom color="warning">
                                <template #activator="{ on, attrs }">
                                  <v-btn
                                    x-small
                                    icon
                                    color="warning"
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="editData(item.id)"
                                    v-show="showEdit"
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
                                    @click="removeData(item.id)"
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
                            v-model="currentPageDraft"
                            :length="totalPagesDraft"
                            @input="handlePageChange('Draft')"
                            total-visible="5"
                            v-scroll-to="'#table-draft'"
                          ></v-pagination>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row id="table-inprogress">
                    <v-col cols="12" class="pb-0 mt-2">
                      <transfer-cashbank-filter-doc></transfer-cashbank-filter-doc>
                    </v-col>
                    <v-col cols="12" class="pb-0 mt-2">
                      <v-card flat>
                        <v-card-text>
                          <v-row class="mb-4">
                            <v-col md="1" sd="2">
                              <v-select
                                v-model="itemPerPageInProgress"
                                :items="itemRow"
                                label="Rows"
                                class="select"
                                hide-details
                                :menu-props="{ maxWidth: '250' }"
                                @change="getItemPerPage('InProgress')"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" offset-md="7" md="4">
                              <v-text-field
                                v-model="searchInProgress"
                                :append-icon="icons.mdiMagnify"
                                label="Search"
                                single-line
                                hide-details
                                dense
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-data-table
                            :headers="headersDoc"
                            :items="mainDataInProgress"
                            :items-per-page="itemPerPageInProgress"
                            :search="searchInProgress"
                            fixed-header
                            hide-default-footer
                            dense
                          >
                            <!--header-->
                            <template #[`header.docNo`]>
                              {{ docNo }}
                            </template>
                            <template #[`header.tanggal`]>
                              {{ docDate }}
                            </template>
                            <template #[`header.ou`]>
                              {{ ouTbl }}
                            </template>

                            <!-- Business Unit-->
                            <template #[`item.ou`]="{ item }">
                              {{ item.ouCode }} - {{ item.ouName }}
                            </template>

                            <!-- format tanggal-->
                            <template #[`item.tanggal`]="{ item }">
                              {{ dateFormat(item.docDate) }}
                            </template>

                            <!-- format uang-->
                            <template #[`item.amount`]="{ item }">
                              Rp.{{ number_format(item.transferAmount) }}
                            </template>

                            <!-- penerima-->
                            <template #[`item.penerima`]="{ item }">
                              <!--                          {{ item.accountNo }} a/n {{ item.accountName }}-->
                              <div class="d-flex align-center">
                                <v-avatar color="#e6e6e6" size="30">
                                  <v-img
                                    :src="
                                      require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                                    "
                                  ></v-img>
                                </v-avatar>

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
                                  <span class="text-xs">{{
                                    item.accountNo
                                  }}</span>
                                </div>
                              </div>
                            </template>

                            <!-- action -->
                            <template #[`item.actions`]="{ item }">
                              <v-tooltip bottom color="warning">
                                <template #activator="{ on, attrs }">
                                  <v-btn
                                    x-small
                                    icon
                                    color="warning"
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="editData(item.id)"
                                    v-show="showEdit"
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
                            v-model="currentPageInProgress"
                            :length="totalPagesInProgress"
                            @input="handlePageChange('Draft')"
                            total-visible="5"
                            v-scroll-to="'#table-inprogress'"
                          ></v-pagination>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row id="table-released">
                    <v-col cols="12" class="pb-0 mt-2">
                      <transfer-cashbank-filter-doc></transfer-cashbank-filter-doc>
                    </v-col>
                    <v-col cols="12" class="pb-0 mt-2">
                      <v-card flat>
                        <v-card-text>
                          <v-row class="mb-4">
                            <v-col md="1" sd="2">
                              <v-select
                                v-model="itemPerPageRelease"
                                :items="itemRow"
                                label="Rows"
                                class="select"
                                hide-details
                                :menu-props="{ maxWidth: '250' }"
                                @change="getItemPerPage('Release')"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" offset-md="7" md="4">
                              <v-text-field
                                v-model="searchRelease"
                                :append-icon="icons.mdiMagnify"
                                label="Search"
                                single-line
                                hide-details
                                dense
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-data-table
                            :headers="headersDoc"
                            :items="mainDataRelease"
                            :items-per-page="itemPerPageRelease"
                            :search="searchRelease"
                            fixed-header
                            hide-default-footer
                            dense
                          >
                            <!--header-->
                            <template #[`header.docNo`]>
                              {{ docNo }}
                            </template>
                            <template #[`header.tanggal`]>
                              {{ docDate }}
                            </template>
                            <template #[`header.ou`]>
                              {{ ouTbl }}
                            </template>

                            <!-- Business Unit-->
                            <template #[`item.ou`]="{ item }">
                              {{ item.ouCode }} - {{ item.ouName }}
                            </template>

                            <!-- format tanggal-->
                            <template #[`item.tanggal`]="{ item }">
                              {{ dateFormat(item.docDate) }}
                            </template>

                            <!-- format uang-->
                            <template #[`item.amount`]="{ item }">
                              Rp.{{ number_format(item.transferAmount) }}
                            </template>

                            <!-- penerima-->
                            <template #[`item.penerima`]="{ item }">
                              <!--                          {{ item.accountNo }} a/n {{ item.accountName }}-->
                              <div class="d-flex align-center">
                                <v-avatar color="#e6e6e6" size="30">
                                  <v-img
                                    :src="
                                      require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                                    "
                                  ></v-img>
                                </v-avatar>

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
                                  <span class="text-xs">{{
                                    item.accountNo
                                  }}</span>
                                </div>
                              </div>
                            </template>

                            <!-- action -->
                            <template #[`item.actions`]="{ item }">
                              <v-tooltip bottom color="warning">
                                <template #activator="{ on, attrs }">
                                  <v-btn
                                    x-small
                                    icon
                                    color="warning"
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="editData(item.id)"
                                    v-show="showEdit"
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
                            v-model="currentPageRelease"
                            :length="totalPagesRelease"
                            @input="handlePageChange('Release')"
                            total-visible="5"
                            v-scroll-to="'#table-released'"
                          ></v-pagination>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
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
import TransferCashbankFilterCreate from "@/views/transfer-cash-bank/TransferCashbankFilterCreate";
import TransferCashbankFilterDoc from "@/views/transfer-cash-bank/TransferCashbankFilterDoc";
import Form from "vform";
import {
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiDelete,
  mdiDeleteOutline,
  mdiMagnify,
  mdiPlus,
} from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";
import { dateFormat, isInArray, number_format } from "../../../constan";
import useAppConfig from "@core/@app-config/useAppConfig";
import moment from "moment";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import "../../styles/textstyle.css";
import { log } from "console";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    TransferCashbankFilterCreate,
    TransferCashbankFilterDoc,
    AppCardLoader,
  },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,

      itemRow: [25, 50, 100],
      //Tab Draft
      searchDraft: "",
      currentPageDraft: 1,
      totalPagesDraft: 1,
      ofsetDraft: 0,
      itemPerPageDraft: 25,
      //Tab InProgress
      searchInProgress: "",
      currentPageInProgress: 1,
      totalPagesInProgress: 1,
      ofsetInProgress: 0,
      itemPerPageInProgress: 25,
      //Tab Release
      searchRelease: "",
      currentPageRelease: 1,
      totalPagesRelease: 1,
      ofsetRelease: 0,
      itemPerPageRelease: 25,

      // role
      showAdd:
        isInArray(
          "addTransferCashbank",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray(
          "editTransferCashbank",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray(
          "removeTransferCashbank",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      readonly: false,
      disabled: false,
      outlined: true,
      clearable: true,
      valueWhenIsEmpty: "",
      options: {
        locale: "pt-BR",
        prefix: "",
        suffix: "",
        decimal: ",",
        thousands: ".",
        length: 20,
        precision: 0,
        autoDecimalMode: false,
      },
      properties: {
        hint: "my hint",
      },

      isDialogVisible: false,
      cashbankItemList: false,
      cashbankItemForm: false,
      formTransferCashBank: true,
      currentTab: 0,
      icons: {
        mdiPlus,
        mdiDelete,
        mdiMagnify,
        mdiClose,
        mdiClipboardEditOutline,
        mdiCheckboxMarkedCircleOutline,
      },
      selected: [],
      mainDataCreate: [],
      mainDataDraft: [],
      mainDataInProgress: [],
      mainDataRelease: [],
      mainDataCashbankList: [],
      formFilterCreate: new Form({
        ouId: -99,
        cashbankFromId: -99,
      }),
      formFilterCashbank: new Form({
        cashbank: "",
        account: "",
      }),
      form: new Form({
        ouId: -99,
        accountNo: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      formIn: new Form({
        ouId: -99,
        accountNo: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      formApproved: new Form({
        ouId: -99,
        accountNo: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      headersCreate: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "40px",
        },
        {
          text: "Cash/Bank",
          value: "cashbankName",
          width: "150px",
        },
        {
          text: "Bank",
          value: "bankCode",
          width: "170px",
        },
        {
          text: "Account",
          value: "account",
          width: "300px",
        },
        {
          text: "Amount",
          align: "right",
          value: "amount",
          width: "150px",
        },
      ],
      headersCashbank: [
        {
          text: "Cash/Bank",
          value: "cashbankName",
          width: "250px",
        },

        {
          text: "Account",
          value: "account",
        },
      ],
      headersDoc: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Ou",
          value: "ou",
          width: "250px",
        },
        {
          text: "Doc No",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Doc Date",
          value: "tanggal",
          width: "150px",
        },
        // {
        //   text: "Bank",
        //   value: "bankCode",
        //   width: "150px",
        // },
        {
          text: "Account",
          value: "penerima",
          width: "250px",
        },
        {
          text: "Amount",
          align: "right",
          value: "amount",
          width: "150px",
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
    this.$root.$on("filterTransferCashbankCreate", (msg) => {
      this.formFilterCreate.ouId = msg.ouId;
      this.formFilterCreate.cashbankFromId = msg.cashbankFromId;
    });
    this.getCashbankList();
    this.$root.$on("filterTransferCashbankDoc", (msg) => {
      if (this.currentTab == 1) {
        this.form = msg;
        this.currentPageDraft = 1;
        this.ofsetDraft = 0;
      } else if (this.currentTab == 2) {
        this.formIn = msg;
        this.currentPageInProgress = 1;
        this.ofsetInProgress = 0;
      } else if (this.currentTab == 3) {
        this.formApproved = msg;
        this.currentPageRelease = 1;
        this.ofsetRelease = 0;
      }
      this.refreshData();
    });
    this.$root.$on("formTransferCashBankReturn", (msg) => {
      this.getCashbankList();
      if (msg != "Cancel deposit!.") {
        this.formFilterCreate.clear();
        this.formFilterCreate.reset();
        this.mainDataDraft = [];
        this.selected = [];
        this.mainDataCreate = [];
        this.formFilterCreate.ouId = -99;
        this.$root.$emit("resetOu", "transferCashbank");
        this.$root.$emit("resetCashbankUser", "transferCashbank");
        if (this.currentTab > 0) {
          this.refreshData();
        }
      } else {
        if (this.currentTab > 0) {
          this.refreshData();
        }
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
      return number_format(value, 2, ",", ".");
    },
    handlePageChange(value) {
      if (value == "Draft") {
        if (this.currentPageDraft == 1) {
          this.ofsetDraft = 0;
        } else {
          this.ofsetDraft = (this.currentPageDraft - 1) * this.itemPerPageDraft;
        }
        this.refreshData();
      } else if (value == "InProgress") {
        if (this.currentPageInProgress == 1) {
          this.ofsetInProgress = 0;
        } else {
          this.ofsetInProgress =
            (this.currentPageInProgress - 1) * this.itemPerPageInProgress;
        }
        this.refreshData();
      } else if (value == "Release") {
        if (this.currentPageRelease == 1) {
          this.ofsetRelease = 0;
        } else {
          this.ofsetRelease =
            (this.currentPageRelease - 1) * this.itemPerPageRelease;
        }
        this.refreshData();
      }
    },
    getItemPerPage(val) {
      if (val == "Draft") {
        this.currentPageDraft = 1;
        this.ofsetDraft = 0;
        this.refreshData();
      } else if (val == "InProgress") {
        this.currentPageInProgress = 1;
        this.ofsetInProgress = 0;
        this.refreshData();
      } else if (val == "Release") {
        this.currentPageRelease = 1;
        this.ofsetRelease = 0;
        this.refreshData();
      }
    },
    closeForm() {
      this.cashbankItemList = false;
    },
    addData() {
      if (
        this.formFilterCreate.ouId == -99 ||
        this.formFilterCreate.ouId == null
      ) {
        this.notif("error", "Failed", "Please Select Business Unit");
      } else if (
        this.formFilterCreate.cashbankFromId == -99 ||
        this.formFilterCreate.cashbankFromId == null
      ) {
        this.notif("error", "Failed", "Please Select Source Bank");
      } else if (this.mainDataCreate.length == 0) {
        this.notif("error", "Failed", "Please Add Beneficiary Bank");
      } else {
        var error = false;
        for (var i = 0; i < this.mainDataCreate.length; i++) {
          var obj = this.mainDataCreate[i];
          if (obj.amount <= 0) {
            var message =
              "Amount cash/bank " + obj.cashbankName + " must be more than 0";
            this.notif("error", "Failed", message);
            error = true;
            break;
          }
        }
        if (error == false) {
          var item = [
            null,
            "addForm",
            this.mainDataCreate,
            this.formFilterCreate,
          ];
          this.$root.$emit("formTransferCashBank", this.formTransferCashBank);
          this.$root.$emit("formTransferCashBankForm", item);
        }
      }
    },
    editData(id) {
      var item = [id, "editForm", this.mainDataCreate, this.formFilterCreate];
      this.$root.$emit("formTransferCashBank", this.formTransferCashBank);
      this.$root.$emit("formTransferCashBankForm", item);
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
        .get(`${themeConfig.app.api_cb}/transfer/cashbank/remove/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.notif("success", "Sukses", "Delete data berhasil!.");
          this.refreshData();
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getCashbankList() {
      var list = [];
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/policy/cashbank/list/available/${
            JSON.parse(this.$session.get("userData")).uid
          }`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainDataCashbankList = response.data.result;
            // this.mainDataCashbankList.forEach((element, index) => {
            //     this.mainDataCashbankList[index].amount = 0;
            // });
            if (
              this.formFilterCashbank.cashbank != "" &&
              this.formFilterCashbank.account != ""
            ) {
              if (this.mainDataCashbankList.length > 0) {
                this.mainDataCashbankList.forEach((element, index) => {
                  if (
                    (element.cashbankCode.indexOf(
                      this.formFilterCashbank.cashbank.toUpperCase()
                    ) > -1 ||
                      element.cashbankName.indexOf(
                        this.formFilterCashbank.cashbank.toUpperCase()
                      ) > -1) &&
                    (element.accountNo.indexOf(
                      this.formFilterCashbank.account.toUpperCase()
                    ) > -1 ||
                      element.accountName.indexOf(
                        this.formFilterCashbank.account.toUpperCase()
                      ) > -1)
                  ) {
                    list.push(element);
                  }
                });
                this.mainDataCashbankList = list;
              }
            } else if (
              this.formFilterCashbank.cashbank != "" &&
              this.formFilterCashbank.account == ""
            ) {
              if (this.mainDataCashbankList.length > 0) {
                this.mainDataCashbankList.forEach((element, index) => {
                  if (
                    element.cashbankCode.indexOf(
                      this.formFilterCashbank.cashbank.toUpperCase()
                    ) > -1 ||
                    element.cashbankName.indexOf(
                      this.formFilterCashbank.cashbank.toUpperCase()
                    ) > -1
                  ) {
                    list.push(element);
                  }
                });
                this.mainDataCashbankList = list;
              }
            } else if (
              this.formFilterCashbank.cashbank == "" &&
              this.formFilterCashbank.account != ""
            ) {
              if (this.mainDataCashbankList.length > 0) {
                this.mainDataCashbankList.forEach((element, index) => {
                  if (
                    element.accountNo.indexOf(
                      this.formFilterCashbank.account.toUpperCase()
                    ) > -1 ||
                    element.accountName.indexOf(
                      this.formFilterCashbank.account.toUpperCase()
                    ) > -1
                  ) {
                    list.push(element);
                  }
                });
                this.mainDataCashbankList = list;
              }
            }
            this.mainDataCashbankList.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataCashbankList[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainDataCashbankList[index].logoImage =
                    this.mainDataCashbankList[index].bankCode;
                }
              } catch (e) {
                this.mainDataCashbankList[index].logoImage = "NONE";
              }
            });
          } else {
            this.mainDataCashbankList = [];
          }
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    addDataItemDraft() {
      this.mainDataCreate = this.selected;
      // this.mainDataCreate.forEach((element, index) => {
      //     this.mainDataCreate[index].amount = 0;
      // });
      this.closeForm();
    },
    removeDataItemDraft(id) {
      var myNewArray = this.mainDataCreate.filter(function (item) {
        return item.cashbankId !== id;
      });
      this.mainDataCreate = myNewArray;
      this.selected = myNewArray;
    },
    refreshDataFilter() {
      if (this.currentTab > 0) {
        this.refreshData();
      }
    },
    refreshData() {
      this.isDialogVisible = true;
      if (this.currentTab == 1) {
        var ouId = this.form.ouId == "" ? -99 : parseInt(this.form.ouId);
        var itemPerPage = this.itemPerPageDraft;
        var ofset = this.ofsetDraft;
        var status =
          "?ouId=" +
          ouId +
          "&accountNo=" +
          this.form.accountNo +
          "&dateFrom=" +
          moment(this.form.dateFrom).format("YYYYMMDD") +
          "&dateTo=" +
          moment(this.form.dateTo).format("YYYYMMDD") +
          "&workflowStatus=DRAFT&limit=" +
          itemPerPage +
          "&offset=" +
          ofset;
      } else if (this.currentTab == 2) {
        var ouId = this.formIn.ouId == "" ? -99 : parseInt(this.formIn.ouId);
        var itemPerPage = this.itemPerPageInProgress;
        var ofset = this.ofsetInProgress;
        var status =
          "?ouId=" +
          ouId +
          "&accountNo=" +
          this.formIn.accountNo +
          "&dateFrom=" +
          moment(this.formIn.dateFrom).format("YYYYMMDD") +
          "&dateTo=" +
          moment(this.formIn.dateTo).format("YYYYMMDD") +
          "&workflowStatus=IN PROGRESS&limit=" +
          itemPerPage +
          "&offset=" +
          ofset;
      } else if (this.currentTab == 3) {
        var ouId =
          this.formApproved.ouId == "" ? -99 : parseInt(this.formApproved.ouId);
        var itemPerPage = this.itemPerPageRelease;
        var ofset = this.ofsetRelease;
        var status =
          "?ouId=" +
          ouId +
          "&accountNo=" +
          this.formApproved.accountNo +
          "&dateFrom=" +
          moment(this.formApproved.dateFrom).format("YYYYMMDD") +
          "&dateTo=" +
          moment(this.formApproved.dateTo).format("YYYYMMDD") +
          "&workflowStatus=RELEASED&limit=" +
          itemPerPage +
          "&offset=" +
          ofset;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_cb}/transfer/cashbank/list${status}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (this.currentTab == 1) {
            this.getCountData("Draft");
            if (response.data.result !== null) {
              this.mainDataDraft = response.data.result;
              this.mainDataDraft.forEach((element, index) => {
                try {
                  if (
                    require("@/assets/images/logos/bank_logo/" +
                      this.mainDataDraft[index].bankCode +
                      "_logo.png")
                  ) {
                    this.mainDataDraft[index].logoImage =
                      this.mainDataDraft[index].bankCode;
                  }
                } catch (e) {
                  this.mainDataDraft[index].logoImage = "NONE";
                }
              });
            } else {
              this.mainDataDraft = [];
            }
          } else if (this.currentTab == 2) {
            this.getCountData("InProgress");
            if (response.data.result !== null) {
              this.mainDataInProgress = response.data.result;
              this.mainDataInProgress.forEach((element, index) => {
                try {
                  if (
                    require("@/assets/images/logos/bank_logo/" +
                      this.mainDataInProgress[index].bankCode +
                      "_logo.png")
                  ) {
                    this.mainDataInProgress[index].logoImage =
                      this.mainDataInProgress[index].bankCode;
                  }
                } catch (e) {
                  this.mainDataInProgress[index].logoImage = "NONE";
                }
              });
            } else {
              this.mainDataInProgress = [];
            }
          } else if (this.currentTab == 3) {
            this.getCountData("Release");
            if (response.data.result !== null) {
              this.mainDataRelease = response.data.result;
              this.mainDataRelease.forEach((element, index) => {
                try {
                  if (
                    require("@/assets/images/logos/bank_logo/" +
                      this.mainDataRelease[index].bankCode +
                      "_logo.png")
                  ) {
                    this.mainDataRelease[index].logoImage =
                      this.mainDataRelease[index].bankCode;
                  }
                } catch (e) {
                  this.mainDataRelease[index].logoImage = "NONE";
                }
              });
            } else {
              this.mainDataRelease = [];
            }
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status == 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    getCountData(value) {
      if (value == "Draft") {
        var ouId = this.form.ouId == "" ? -99 : parseInt(this.form.ouId);
        var status =
          "?ouId=" +
          ouId +
          "&accountNo=" +
          this.form.accountNo +
          "&dateFrom=" +
          moment(this.form.dateFrom).format("YYYYMMDD") +
          "&dateTo=" +
          moment(this.form.dateTo).format("YYYYMMDD") +
          "&workflowStatus=DRAFT";
      } else if (value == "InProgress") {
        var ouId = this.formIn.ouId == "" ? -99 : parseInt(this.formIn.ouId);
        var status =
          "?ouId=" +
          ouId +
          "&accountNo=" +
          this.formIn.accountNo +
          "&dateFrom=" +
          moment(this.formIn.dateFrom).format("YYYYMMDD") +
          "&dateTo=" +
          moment(this.formIn.dateTo).format("YYYYMMDD") +
          "&workflowStatus=IN PROGRESS";
      } else if (value == "Release") {
        var ouId =
          this.formApproved.ouId == "" ? -99 : parseInt(this.formApproved.ouId);
        var status =
          "?ouId=" +
          ouId +
          "&accountNo=" +
          this.formApproved.accountNo +
          "&dateFrom=" +
          moment(this.formApproved.dateFrom).format("YYYYMMDD") +
          "&dateTo=" +
          moment(this.formApproved.dateTo).format("YYYYMMDD") +
          "&workflowStatus=RELEASED";
      }

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_cb}/transfer/cashbank/count${status}`,
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
          this.notif("error", "Failed", e.response.data.message);
        });
    },
  },
};
</script>
