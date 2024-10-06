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
          <v-card-title
            ><span>Create Cash/Bank In Partner Receive</span></v-card-title
          >
          <v-card-text>
            <v-tabs
              grow
              v-model="currentTab"
              @change="currentTab == 0 ? refreshData() : refreshCashbankList()"
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
                    <cash-bank-in-partner-receive-filter-create></cash-bank-in-partner-receive-filter-create>
                  </v-col>
                  <v-col cols="12" class="mb-0">
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" md="6" class="mb-0">
                            <div class="mb-8">
                              <v-btn
                                small
                                dark
                                color="info"
                                @click="addActivityGl()"
                              >
                                <v-icon dark left>
                                  {{ icons.mdiPlus }}
                                </v-icon>
                                Add
                              </v-btn>
                            </div>
                            <v-data-table
                              :headers="headersGlList"
                              :items="mainDataGlList"
                              :footer-props="{
                                'items-per-page-options': [25, 50, 100],
                              }"
                              fixed-header
                              dense
                              v-model="selected"
                              item-key="id"
                              show-select
                            >
                            </v-data-table>
                          </v-col>
                          <v-col cols="12" md="6" class="mb-0">
                            <div class="mb-8">
                              <v-btn
                                small
                                dark
                                color="primary"
                                @click="addForm()"
                                v-show="showCreate"
                              >
                                <v-icon dark left>
                                  {{ icons.mdiPlus }}
                                </v-icon>
                                Create
                              </v-btn>
                            </div>
                            <v-data-table
                              :headers="headersGlSelect"
                              :items="mainDataGlSelect"
                              :footer-props="{
                                'items-per-page-options': [25, 50, 100],
                              }"
                              disable-pagination
                              fixed-header
                              dense
                            >
                              <template #[`item.amountGl`]="{ item }">
                                <vuetify-money
                                  dense
                                  v-model="item.costAmount"
                                  v-bind:readonly="readonly"
                                  v-bind:disabled="disabled"
                                  v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                                  v-bind:options="options"
                                  v-bind:properties="properties"
                                  v-bind:backgroundColor="'#F8F8F8'"
                                  hide-details
                                />
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
                                      @click="confirmDialogDraft(item.id)"
                                      v-on="on"
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
                    <cash-bank-in-partner-receive-filter-doc
                      :filter-type="'DRAFT'"
                    ></cash-bank-in-partner-receive-filter-doc>
                  </v-col>
                  <v-col id="table-draft" cols="12" class="mb-0">
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <v-col md="1" sd="2">
                            <v-select
                              v-model="itemPerPageDraft"
                              :items="itemRow"
                              label="Rows"
                              class="select"
                              hide-details
                              :menu-props="{ maxWidth: '250' }"
                              @change="getItemPerPage"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row>
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
                                      @click="editData(item.id)"
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
                                      v-show="deleteDraft"
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
                    <cash-bank-in-partner-receive-filter-doc
                      :filter-type="'INPROGRESS'"
                    ></cash-bank-in-partner-receive-filter-doc>
                  </v-col>
                  <v-col id="table-inprogress" cols="12" class="mb-0">
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <v-col md="1" sd="2">
                            <v-select
                              v-model="itemPerPageInProgress"
                              :items="itemRow"
                              label="Rows"
                              class="select"
                              hide-details
                              :menu-props="{ maxWidth: '250' }"
                              @change="getItemPerPage"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row>
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
                                      @click="editData(item.id)"
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
                    <cash-bank-in-partner-receive-filter-doc
                      :filter-type="'APPROVED'"
                    ></cash-bank-in-partner-receive-filter-doc>
                  </v-col>
                  <v-col id="table-approved" cols="12" class="mb-0">
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <v-col md="1" sd="2">
                            <v-select
                              v-model="itemPerPageRelease"
                              :items="itemRow"
                              label="Rows"
                              class="select"
                              hide-details
                              :menu-props="{ maxWidth: '250' }"
                              @change="getItemPerPage"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" class="mb-0">
                            <v-data-table
                              :headers="headersDoc"
                              :items="mainDataRelease"
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
                                      @click="editData(item.id)"
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
import CashBankInPartnerReceiveFilterCreate from "@/views/cash-bank-in-partner-receive/CashBankInPartnerReceiveFilterCreate";
import CashBankInPartnerReceiveFilterDoc from "@/views/cash-bank-in-partner-receive/CashBankInPartnerReceiveFilterDoc";
import themeConfig from "@themeConfig";
import axios from "@axios";
import router from "@/router";
import Form from "vform";
import { mdiClipboardEditOutline, mdiDelete, mdiPlus } from "@mdi/js";
import {
  dateFormat,
  dateTimeFormat,
  number_format,
  isInArray,
} from "../../../constan";
import moment from "moment";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    CashBankInPartnerReceiveFilterCreate,
    CashBankInPartnerReceiveFilterDoc,
    AppCardLoader,
  },
  data() {
    return {
      labelDocNo: themeConfig.labeling.docNo,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,

      deleteDraft:
        isInArray(
          "deleteCashBankInPartner",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      // role
      showCreate:
        isInArray(
          "addCashBankInPartner",
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
        length: 20,
        precision: 2,
      },
      properties: {
        hint: "my hint",
      },

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      isDialogVisible: false,
      currentTab: 0,
      formData: true,
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
      selected: [],
      mainDataGlList: [],
      mainDataGlSelect: [],
      mainDataDraft: [],
      mainDataInProgress: [],
      mainDataRelease: [],
      filterFormCreate: new Form({
        ouId: -99,
        cashbankId: -99,
        bankCode: "",
        accountNo: "",
        accountName: "",
        partnerId: -99,
        keyword: "",
      }),
      filterFormDoc: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
      icons: {
        mdiPlus,
        mdiDelete,
        mdiClipboardEditOutline,
      },
      headersGlList: [
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
      headersGlSelect: [
        {
          text: "Actions",
          value: "actions",
          width: "100px",
          sortable: false,
        },
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
          value: "amountGl",
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
          text: "Doc No",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Doc Date",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Ext Doc No",
          value: "extDocNo",
          width: "200px",
        },
        {
          text: "Ext Doc Date",
          value: "extDocDate",
          width: "150px",
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
          value: "paymentAmount",
          width: "150px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "250px",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("cashbankInPartnerFilterCreate", (msg) => {
      this.filterFormCreate = msg;
      this.refreshDataActivityGl();
    });
    this.$root.$on("cashbankInPartnerFilterDoc", (msg) => {
      if (this.currentTab == 1) {
        this.ofsetDraft = 0;
        this.currentPageDraft = 1;
      } else if (this.currentTab == 2) {
        this.ofsetInProgress = 0;
        this.currentPageInProgress = 1;
      } else if (this.currentTab == 3) {
        this.ofsetRelease = 0;
        this.currentPageRelease = 1;
      }
      this.filterFormDoc = msg;
      this.refreshCashbankList();
    });
    this.$root.$on("cashbankInPartnerReceiveReturn", (msg) => {
      if (this.currentTab == 0) {
        this.refreshData();
      } else {
        this.refreshCashbankList();
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
      return dateFormat(value.substring(0, 8));
    },
    dateTimeFormat(value) {
      return dateTimeFormat(value);
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    getItemPerPage(val) {
      if (this.currentTab == 1) {
        this.itemPerPageDraft = val;
        this.ofset = 0;
        this.currentPage = 1;
        this.refreshDataDraft();
      } else if (this.currentTab == 2) {
        this.itemPerPageInProgress = val;
        this.ofset = 0;
        this.currentPage = 1;
        this.refreshDataInProgress();
      } else if (this.currentTab == 3) {
        this.itemPerPageRelease = val;
        this.ofset = 0;
        this.currentPage = 1;
        this.refreshDataReleased();
      }
    },
    handlePageChange(value) {
      if (this.currentTab == 1) {
        this.currentPageDraft = value;
        if (this.currentPageDraft == 1) {
          this.ofsetDraft = 0;
        } else {
          this.ofsetDraft = (this.currentPageDraft - 1) * this.itemPerPageDraft;
        }
        this.refreshDataDraft();
      } else if (this.currentTab == 2) {
        this.currentPageInProgress = value;
        if (this.currentPageInProgress == 1) {
          this.ofsetInProgress = 0;
        } else {
          this.ofsetInProgress =
            (this.currentPageInProgress - 1) * this.itemPerPageInProgress;
        }
        this.refreshDataInProgress();
      } else if (this.currentTab == 3) {
        this.currentPageRelease = value;
        if (this.currentPageRelease == 1) {
          this.ofsetRelease = 0;
        } else {
          this.ofsetRelease =
            (this.currentPageRelease - 1) * this.itemPerPageRelease;
        }
        this.refreshDataReleased();
      }
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
          }, 1500);
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
        .get(`${themeConfig.app.api_cb}/partner-receive/remove/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.notif("success", "Success", response.data.meta.message);
          this.refreshCashbankList();
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
    addForm() {
      if (
        this.mainDataGlSelect.length > 0 &&
        this.filterFormCreate.ouId != -99 &&
        this.filterFormCreate.ouId != null &&
        this.filterFormCreate.cashbankId != -99 &&
        this.filterFormCreate.cashbankId != null &&
        this.filterFormCreate.partnerId != -99 &&
        this.filterFormCreate.partnerId != null
      ) {
        this.$root.$emit("cashbankInPartnerReceive", this.formData);
        const data = ["addData", this.filterFormCreate, this.mainDataGlSelect];
        this.$root.$emit("cashbankInPartnerReceiveForm", data);
      } else {
        this.notif(
          "error",
          "Failed",
          "Please select activity GL and filter first!."
        );
      }
    },
    editData(id) {
      this.$root.$emit("cashbankInPartnerReceive", this.formData);
      const data = ["editData", id, ""];
      this.$root.$emit("cashbankInPartnerReceiveForm", data);
    },
    addActivityGl() {
      if (this.selected.length > 0) {
        this.mainDataGlSelect = this.selected;
      } else {
        this.notif("error", "Failed", "Please select activity GL first!.");
      }
    },
    confirmDialogDraft(id) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.isDialogVisible = true;
          this.mainDataGlSelect = this.mainDataGlSelect.filter(function (item) {
            return item["id"] != id;
          });
          this.selected = this.selected.filter(function (item) {
            return item["id"] != id;
          });
          this.isDialogVisible = false;
          setTimeout(() => {
            dialog.close();
          }, 500);
        })
        .catch(() => {
          // this.refreshData()
        });
    },
    refreshData() {
      this.mainDataGlList = [];
      this.mainDataGlSelect = [];
      this.selected = [];
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
          `${themeConfig.app.api_master}/activity-gl/list?keyword=${this.filterFormCreate.keyword}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainDataGlList = response.data.result;
          } else {
            this.mainDataGlList = [];
          }
        })
        .catch((e) => {
          console.log(e);
          this.notif("error", "Gagal", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getCountData(val) {
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
      const dateFrom = moment(this.filterFormDoc.startDate).format("YYYYMMDD");
      const dateTo = moment(this.filterFormDoc.endDate).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_cb}/partner-receive/count?ouId=${ouId}&partnerId=${partnerId}&docNo=${this.filterFormDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&workflowStatus=${val}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            if (val == "DRAFT") {
              if (response.data.result > this.itemPerPageDraft) {
                this.totalPagesDraft = Math.ceil(
                  response.data.result / this.itemPerPageDraft
                );
              }
            } else if (val == "INPROGRESS") {
              if (response.data.result > this.itemPerPageInProgress) {
                this.totalPagesInProgress = Math.ceil(
                  response.data.result / this.itemPerPageInProgress
                );
              }
            } else if (val == "RELEASED") {
              if (response.data.result > this.itemPerPageRelease) {
                this.totalPagesRelease = Math.ceil(
                  response.data.result / this.itemPerPageRelease
                );
              }
            }
          } else {
            if (val == "DRAFT") {
              this.totalPagesDraft = 1;
            } else if (val == "INPROGRESS") {
              this.totalPagesInProgress = 1;
            } else if (val == "RELEASED") {
              this.totalPagesRelease = 1;
            }
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
    refreshCashbankList() {
      if (this.currentTab == 1) {
        this.refreshDataDraft();
      } else if (this.currentTab == 2) {
        this.refreshDataInProgress();
      } else if (this.currentTab == 3) {
        this.refreshDataReleased();
      }
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
        this.filterFormDoc.ouId == "" || this.filterFormDoc.ouId == null
          ? -99
          : parseInt(this.filterFormDoc.ouId);
      const partnerId =
        this.filterFormDoc.partnerId == "" ||
        this.filterFormDoc.partnerId == null
          ? -99
          : parseInt(this.filterFormDoc.partnerId);
      const dateFrom = moment(this.filterFormDoc.startDate).format("YYYYMMDD");
      const dateTo = moment(this.filterFormDoc.endDate).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_cb}/partner-receive/list?ouId=${ouId}&partnerId=${partnerId}&docNo=${this.filterFormDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&workflowStatus=DRAFT&limit=${this.itemPerPageDraft}&offset=${this.ofsetDraft}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainDataDraft = response.data.result;
            this.getCountData("DRAFT");
          } else {
            this.mainDataDraft = [];
            this.totalPagesDraft = 1;
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
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
        this.filterFormDoc.ouId == "" || this.filterFormDoc.ouId == null
          ? -99
          : parseInt(this.filterFormDoc.ouId);
      const partnerId =
        this.filterFormDoc.partnerId == "" ||
        this.filterFormDoc.partnerId == null
          ? -99
          : parseInt(this.filterFormDoc.partnerId);
      const dateFrom = moment(this.filterFormDoc.startDate).format("YYYYMMDD");
      const dateTo = moment(this.filterFormDoc.endDate).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_cb}/partner-receive/list?ouId=${ouId}&partnerId=${partnerId}&docNo=${this.filterFormDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&workflowStatus=INPROGRESS&limit=${this.itemPerPageDraft}&offset=${this.ofsetDraft}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainDataInProgress = response.data.result;
            this.getCountData("INPROGRESS");
          } else {
            this.mainDataInProgress = [];
            this.totalPagesInProgress = 1;
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
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
        this.filterFormDoc.ouId == "" || this.filterFormDoc.ouId == null
          ? -99
          : parseInt(this.filterFormDoc.ouId);
      const partnerId =
        this.filterFormDoc.partnerId == "" ||
        this.filterFormDoc.partnerId == null
          ? -99
          : parseInt(this.filterFormDoc.partnerId);
      const dateFrom = moment(this.filterFormDoc.startDate).format("YYYYMMDD");
      const dateTo = moment(this.filterFormDoc.endDate).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_cb}/partner-receive/list?ouId=${ouId}&partnerId=${partnerId}&docNo=${this.filterFormDoc.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&workflowStatus=RELEASED&limit=${this.itemPerPageDraft}&offset=${this.ofsetDraft}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainDataRelease = response.data.result;
            this.getCountData("RELEASED");
          } else {
            this.mainDataRelease = [];
            this.totalPagesRelease = 1;
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", e.response.data.message);
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
