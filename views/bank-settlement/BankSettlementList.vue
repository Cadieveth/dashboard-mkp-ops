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
    <v-dialog v-model="formEdit" persistent width="1200">
      <v-card>
        <v-card-title class="font-weight-bold">
          {{ showButton ? "Edit Settlement" : "Settlement Detail" }}
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <!-- form edit trx -->
          <v-row>
            <v-col cols="12" md="3" class="mb-0">
              <app-input-field-date
                :value-date.sync="editForm.transactionDate"
                :label-title="'Transaction Date'"
                :dense="false"
                :read-only="true"
              ></app-input-field-date>
            </v-col>
            <v-col cols="12" md="3" class="mb-0 mt-1">
              <vuetify-money
                v-model="editForm.amount"
                label="Receive Amount"
                placeholder="Insert Receive Amount"
              ></vuetify-money>
            </v-col>
            <!-- <v-col cols="12" md="1" class="mb-0 mt-1">
              <vuetify-money
                v-model="editForm.mdr"
                label="MDR Bank"
                placeholder="Insert MDR Bank"
              ></vuetify-money>
            </v-col> -->
            <v-col cols="12" md="1" class="mb-0">
              <v-text-field
                v-model="editForm.mdrPercentage"
                label="MDR %"
                type="number"
                suffix="%"
                readonly
              ></v-text-field>
            </v-col>

            <!-- <v-col cols="12" md="2" class="mb-0 mt-1">
              <vuetify-money
                v-model="editForm.totalAmount"
                label="Total Amount"
                placeholder="Insert Total Amount"
              ></vuetify-money>
            </v-col> -->

            <v-col cols="12" md="5" class="mb-0">
              <v-text-field
                v-model="editForm.remark"
                label="Remark"
                :placeholder="phRemark"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions v-show="showButton">
          <v-spacer></v-spacer>
          <v-btn
            @click="updateSettlement()"
            color="primary"
            dark
            small
            type="submit"
          >
            <v-icon dark left>
              {{ icons.mdiCheckboxMarkedCircleOutline }}
            </v-icon>
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="formPayChannel" persistent width="1100">
      <v-card>
        <v-card-title class="font-weight-bold">
          Add Payment Channel
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closePayChannel()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-data-table
                :headers="headersPayChannel"
                :items="dataPayChannel"
                dense
                item-key="id"
                show-select
                v-model="selected"
                :items-per-page="100"
              >
                <!-- cashbank -->
                <template #[`item.cashbankName`]="{ item }">
                  <div class="d-flex align-center">
                    <v-list-item-avatar left color="#e6e6e6" size="30">
                      <v-avatar left color="#e6e6e6" size="30">
                        <v-img
                          :src="
                            require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                          "
                        ></v-img>
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content style="margin-right: -200px">
                      <v-list-item-title
                        class="font-weight-semibold mb-n2 text-sm"
                        style=""
                      >
                        {{ item.cashbankCode }} | {{ item.accountName }} -
                        {{ item.accountNo }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-xs mt-1 text-xs">
                        {{ item.paymentChannelCode }} -
                        {{ item.subPaymentChannelName }}
                        <span class="font-weight-bold">
                          | MDR Fee: {{ item.mdrFee }}%</span
                        >
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </div>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12" md="6">
              <v-data-table
                :headers="headersPayChannel"
                :items="selected"
                fixed-header
                hide-default-footer
                dense
                :items-per-page="100"
              >
                <!-- cashbank -->
                <template #[`item.cashbankName`]="{ item }">
                  <div class="d-flex align-center">
                    <v-list-item-avatar left color="#e6e6e6" size="30">
                      <v-avatar left color="#e6e6e6" size="30">
                        <v-img
                          :src="
                            require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                          "
                        ></v-img>
                      </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-content style="margin-right: -200px">
                      <v-list-item-title
                        class="font-weight-semibold mb-n2 text-sm"
                        style=""
                      >
                        {{ item.cashbankCode }} | {{ item.accountName }} -
                        {{ item.accountNo }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="text-xs mt-1 text-xs">
                        {{ item.paymentChannelCode }} -
                        {{ item.subPaymentChannelName }}
                        <span class="font-weight-bold">
                          | MDR Fee: {{ item.mdrFee }}%</span
                        >
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </div>
                </template>
              </v-data-table>
              <v-card-actions class="mt-4">
                <v-spacer></v-spacer>
                <v-btn
                  @click="addPayChannel()"
                  color="primary"
                  dark
                  small
                  type="submit"
                >
                  <v-icon dark left>
                    {{ icons.mdiCheckboxMarkedCircleOutline }}
                  </v-icon>
                  Add Payment Channel
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions v-show="showButton">
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" class="mb-0">
        <!-- <span class="form-header">Input Bank Settlement</span> -->
        <v-card>
          <v-card-title>
            <span class="">Detail Bank Settlement</span>
          </v-card-title>
          <v-card-text class="">
            <v-row>
              <v-col cols="12" md="6">
                <app-autocomplite-ou-branch
                  :form-value.sync="form.ouBranchId"
                  ou-branch-type="bankSettlement"
                >
                </app-autocomplite-ou-branch>
              </v-col>
              <v-col cols="12" md="6">
                <app-autocomplite-ou-sub-branch-by-settlement
                  :form-value.sync="form.ouSubBranchId"
                  ou-sub-branch-type="bankSettlement"
                >
                </app-autocomplite-ou-sub-branch-by-settlement>
              </v-col>
              <v-col class="d-flex" cols="12" md="6">
                <app-autocomplite-merchant-identity-bank-settle
                  :form-value.sync="form.merchantIdentityId"
                  :merchant-identity-type="'bankSettlementList'"
                >
                </app-autocomplite-merchant-identity-bank-settle>
                <v-btn
                  class=""
                  @click="openPayChannelList()"
                  icon
                  dark
                  small
                  color="primary"
                >
                  <v-icon dark> {{ icons.mdiPlus }} </v-icon>
                </v-btn>
              </v-col>

              <!-- <v-col cols="12" md="6">
                <app-autocomplite-cashbank
                  :value-bank-ou.sync="form.cashbankId"
                  :labelText="'Account'"
                  :placeholder="'Select Account'"
                >
                </app-autocomplite-cashbank>
              </v-col> -->

              <v-col cols="12" md="6">
                <app-input-field-date
                  :value-date.sync="form.settledDate"
                  :label-title="'Mutation Date'"
                >
                </app-input-field-date>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-tabs grow v-model="currentTab" @change="mainData = []">
              <v-tab> Input Settlement </v-tab>
              <v-tab @click="getSettlementItem()"> Settlement List </v-tab>
              <v-tab @click="getListByTransactionDate()"
                >Summary by Transaction Date</v-tab
              >
            </v-tabs>
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <v-card>
                  <v-card-text>
                    <v-row
                      v-for="(item, index) in settlementItems"
                      :key="index"
                      class="mb-n8"
                    >
                      <v-col cols="12" md="3" class="mb-0">
                        <app-input-field-date
                          :value-date.sync="item.transactionDate"
                          :label-title="'Transaction Date'"
                          :index="index"
                          :maxDate="form.settledDate"
                          :minDate="
                            index > 0
                              ? settlementItems[index - 1].transactionDate
                              : ''
                          "
                          :dense="false"
                        ></app-input-field-date>
                      </v-col>
                      <v-col cols="12" md="3" class="mb-0 mt-1">
                        <vuetify-money
                          @input="handleNewInputSecond(index)"
                          v-model="item.amount"
                          label="Receive Amount"
                          placeholder="Insert Receive Amount"
                        ></vuetify-money>
                      </v-col>
                      <v-col cols="12" md="1" class="mb-0">
                        <v-text-field
                          v-model="item.mdrPercentage"
                          label="MDR %"
                          type="number"
                          suffix="%"
                          readonly
                        ></v-text-field>
                      </v-col>
                      <!-- <v-col cols="12" md="3" class="mb-0 mt-1">
                        <vuetify-money
                          v-model="item.mdr"
                          label="MDR Bank"
                          placeholder="Insert MDR Bank"
                          @input="amountCalculation(index)"
                        ></vuetify-money>
                      </v-col> -->
                      <!-- <v-col cols="12" md="2" class="mb-0 mt-1">
                        <vuetify-money
                          v-model="item.totalAmount"
                          label="Total Amount"
                          placeholder="Insert Total Amount"
                        ></vuetify-money>
                      </v-col> -->
                      <v-col cols="12" md="5" class="mb-0">
                        <v-text-field
                          v-model="item.remark"
                          label="Remark"
                          :placeholder="phRemark"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row class=""> </v-row>
                  </v-card-text>
                  <v-card-actions class="mt-4">
                    <v-spacer></v-spacer>
                    <v-btn
                      v-show="settlementItems.length > 1"
                      color="error"
                      small
                      dark
                      @click="deleteField()"
                    >
                      <v-icon dark left>
                        {{ icons.mdiDelete }}
                      </v-icon>
                      Delete A Row
                    </v-btn>
                    <v-btn color="primary" small dark @click="handleInput()">
                      <v-icon dark left>
                        {{ icons.mdiPlus }}
                      </v-icon>
                      Submit Data
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="info" small dark @click="getSettlementItem()">
                      <v-icon dark left>
                        {{ icons.mdiRefresh }}
                      </v-icon>
                      Refresh
                    </v-btn>
                  </v-card-actions>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="mainDataItem"
                      :footer-props="{
                        'items-per-page-options': [25, 50, 100],
                      }"
                      fixed-header
                      dense
                    >
                      <template #[`item.status`]="{ item }">
                        <v-chip
                          small
                          :class="`${
                            item.status == 'R'
                              ? 'success'
                              : item.status == 'D'
                              ? 'info'
                              : item.status == 'I'
                              ? 'primary'
                              : 'error'
                          }--text`"
                          class="
                            v-chip-light-bg
                            font-weight-semibold
                            text-capitalize
                          "
                          :color="
                            item.status == 'R'
                              ? 'success'
                              : item.status == 'D'
                              ? 'info'
                              : item.status == 'I'
                              ? 'primary'
                              : 'error'
                          "
                        >
                          {{
                            item.status == "R"
                              ? "DONE"
                              : item.status == "D"
                              ? "DRAFT"
                              : item.status == "I"
                              ? "IN PROGRESS"
                              : "NONE"
                          }}
                        </v-chip>
                      </template>

                      <template #[`item.transactionDate`]="{ item }">
                        {{ dateFormat(item.transactionDate) }}
                      </template>

                      <template #[`item.settledDate`]="{ item }">
                        {{ dateFormat(item.settledDate) }}
                      </template>

                      <template #[`item.amount`]="{ item }">
                        Rp.{{ number_format(item.amount) }}
                      </template>

                      <template #[`item.totalAmount`]="{ item }">
                        Rp.{{ number_format(item.totalAmount) }}
                      </template>

                      <template #[`item.mdrPercentage`]="{ item }">
                        {{ number_format(item.mdrPercentage) }}%
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
                              @click="editSettlement(item)"
                            >
                              <v-icon>
                                {{ icons.mdiClipboardEditOutline }}
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>{{
                            item.status != "D" ? "Detail" : "Edit"
                          }}</span>
                        </v-tooltip>
                        <v-tooltip bottom color="error">
                          <template #activator="{ on, attrs }">
                            <v-btn
                              x-small
                              icon
                              color="error"
                              v-bind="attrs"
                              v-on="on"
                              v-show="item.status == 'D'"
                              @click="confirmDelete(item)"
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
              </v-tab-item>
              <v-tab-item>
                <v-card>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="info"
                      small
                      dark
                      @click="getListByTransactionDate()"
                    >
                      <v-icon dark left>
                        {{ icons.mdiRefresh }}
                      </v-icon>
                      Refresh
                    </v-btn>
                  </v-card-actions>
                  <v-card-text>
                    <v-data-table
                      :headers="headersTrxDate"
                      :items="dataItemTrxDate"
                      :footer-props="{
                        'items-per-page-options': [25, 50, 100],
                      }"
                      fixed-header
                      dense
                    >
                      <template #[`item.status`]="{ item }">
                        <v-chip
                          small
                          :class="`${
                            item.status == 'R'
                              ? 'success'
                              : item.status == 'D'
                              ? 'info'
                              : item.status == 'I'
                              ? 'primary'
                              : 'error'
                          }--text`"
                          class="
                            v-chip-light-bg
                            font-weight-semibold
                            text-capitalize
                          "
                          :color="
                            item.status == 'R'
                              ? 'success'
                              : item.status == 'D'
                              ? 'info'
                              : item.status == 'I'
                              ? 'primary'
                              : 'error'
                          "
                        >
                          {{
                            item.status == "R"
                              ? "DONE"
                              : item.status == "D"
                              ? "DRAFT"
                              : item.status == "I"
                              ? "IN PROGRESS"
                              : "NONE"
                          }}
                        </v-chip>
                      </template>

                      <template #[`item.transactionDate`]="{ item }">
                        {{ dateFormat(item.transactionDate) }}
                      </template>

                      <template #[`item.amount`]="{ item }">
                        Rp.{{ number_format(item.amount) }}
                      </template>

                      <template #[`item.totalAmount`]="{ item }">
                        Rp.{{ number_format(item.totalAmount) }}
                      </template>

                      <template #[`item.mdrPercentage`]="{ item }">
                        {{ number_format(item.mdrPercentage) }}%
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
                              @click="editSettlement(item)"
                            >
                              <v-icon>
                                {{ icons.mdiClipboardEditOutline }}
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>{{
                            item.status != "D" ? "Detail" : "Edit"
                          }}</span>
                        </v-tooltip>
                        <v-tooltip bottom color="error">
                          <template #activator="{ on, attrs }">
                            <v-btn
                              x-small
                              icon
                              color="error"
                              v-bind="attrs"
                              v-on="on"
                              v-show="item.status == 'D'"
                              @click="confirmDelete(item)"
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
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppAutocompliteOuBranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuBranch.vue";
import AppInputFieldDate from "@/@core/components/app-input-field/AppInputFieldDate.vue";
import AppAutocompliteMerchantIdentity from "@/@core/components/app-autocomplite-ou/AppAutocompliteMerchantIdentity.vue";
import AppAutocompliteMerchantIdentityBankSettle from "@/@core/components/app-autocomplite-ou/AppAutocompliteMerchantIdentityBankSettle.vue";
import AppAutocompliteCashbank from "@/@core/components/app-autocomplite-ou/AppAutocompliteCashbank.vue";
import AppAutocompliteOuSubBranchBySettlement from "@core/components/app-autocomplite-ou/AppAutocompliteOuSubBranchBySettlement";

import Form from "vform";
import moment from "moment";
import { dateFormat, number_format, isInArray } from "../../../constan";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import {
  mdiFileDocumentOutline,
  mdiCalendar,
  mdiDelete,
  mdiPlus,
  mdiClipboardEditOutline,
  mdiCheckboxMarkedCircleOutline,
  mdiClose,
  mdiRefresh,
} from "@mdi/js";

import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import { throws } from "assert";
import vuetify from "@/plugins/vuetify";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";

Vue.use(VueScrollTo);

export default {
  name: "ChildForBankSettlement",
  components: {
    AppAutocompliteOuBranch,
    AppInputFieldDate,
    AppAutocompliteMerchantIdentity,
    AppAutocompliteCashbank,
    AppAutocompliteMerchantIdentityBankSettle,
    AppCardLoader,
    AppAutocompliteOuSubBranchBySettlement,
  },
  data() {
    return {
      ouBTbl: themeConfig.labeling.ouTblB,
      ouSBTbl: themeConfig.labeling.ouTblSB,

      phRemark: themeConfig.placeholder.remarkText,
      maximalDate: moment().format("YYYY-MM-DD"),

      isDialogVisible: false,
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      formEdit: false,
      showButton: true,
      formPayChannel: false,

      // this variabel is used to lock settlement input field

      valueMdr: 0,

      //date picker
      menuStart: false,
      phDate: themeConfig.placeholder.date,
      readOnly: false,
      clearable: false,

      //settlement items
      settlementItems: [
        {
          transactionDate: "",
          amount: 0,
          mdr: 1,
          mdrPercentage: 0,
          totalAmount: 0,
          remark: "",
        },
      ],

      currentTab: 0,

      disabledCount: 0,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      mainDataItem: [],
      dataItemTrxDate: [],
      dataPayChannel: [],
      selected: [],

      icons: {
        mdiFileDocumentOutline,
        mdiCalendar,
        mdiDelete,
        mdiPlus,
        mdiClipboardEditOutline,
        mdiCheckboxMarkedCircleOutline,
        mdiClose,
        mdiRefresh,
      },

      // header input field form
      form: new Form({
        ouBranchId: -99,
        ouSubBranchId: -99,
        cashbankId: -99,
        merchantIdentityId: -99,
        settledDate: moment().format("YYYY-MM-DD"),
      }),

      editForm: new Form({
        id: -99,
        transactionDate: "",
        amount: 0,
        mdr: 0,
        mdrPercentage: 0,
        totalAmount: 0,
        remark: "",
      }),

      headersTrxDate: [
        {
          text: "Transaction Date",
          value: "transactionDate",
          width: "100px",
        },
        {
          text: "Outlet Code",
          value: "ouCode",
          width: "150px",
        },
        {
          text: "Receive Amount",
          value: "amount",
          width: "150px",
        },
        {
          text: "MDR %",
          value: "mdrPercentage",
          width: "100px",
        },
      ],
      headers: [
        {
          text: "Action",
          value: "actions",
          width: "100px",
        },
        {
          text: "Transaction Date",
          value: "transactionDate",
          width: "100px",
        },
        {
          text: "Mutation Date",
          value: "settledDate",
          width: "100px",
        },
        {
          text: "Receive Amount",
          value: "amount",
          width: "150px",
          align: "right",
        },
        {
          text: "MDR %",
          value: "mdrPercentage",
          width: "100px",
          align: "right",
        },
        {
          text: "Remark",
          value: "remark",
          width: "150px",
        },
        {
          text: "Status",
          value: "status",
          width: "100px",
        },
      ],
      headersPayChannel: [
        {
          text: "Cash/Bank",
          value: "cashbankName",
          width: "500px",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("bankSettlement", (msg) => {
      this.handleNewInput(msg);
    });
    this.$root.$on("appAutocompliteMerchantIdentityBankSettlement", (msg) => {
      this.form.cashbankId = msg.cashbankId;
      this.valueMdr = msg.mdrFee;
      this.addSettlementItems();
    });
    this.getPaymentChannel();
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    customAlert() {
      alert();
    },
    addSettlementItems() {
      this.settlementItems = [
        {
          transactionDate: "",
          amount: 0,
          mdr: 1,
          mdrPercentage: this.valueMdr,
          totalAmount: 0,
          remark: "",
        },
      ];
    },
    cancelSettlement() {
      this.$dialog
        .confirm("Are you sure you want to cancel your input?", {
          loader: true,
        })
        .then((dialog) => {
          this.form.reset();
          this.form.clear();
          setTimeout(() => {
            dialog.close();
          }, 500);
        })
        .catch(() => {
          // this.refreshData()
        });
    },
    editSettlement(item) {
      this.formEdit = true;
      this.editForm.transactionDate = moment(
        item.transactionDate,
        "YYYYMMDD"
      ).format("YYYY-MM-DD");
      this.editForm.amount = item.amount;
      this.editForm.totalAmount = item.totalAmount;
      // change mdr percentage
      this.editForm.mdrPercentage = item.mdrPercentage;

      if (item.status != "D") {
        this.showButton = false;
      } else {
        this.showButton = true;
      }

      this.editForm.mdr = item.mdr;
      this.editForm.remark = item.remark;
      this.editForm.id = item.id;
    },
    confirmDelete(item) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.isDialogVisible = true;
          this.deleteSettlement(item);
          setTimeout(() => {
            dialog.close();
          }, 500);
        })
        .catch(() => {
          // this.refreshData()
        });
    },
    dateFormat(value) {
      return dateFormat(value);
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    closeForm() {
      this.formEdit = false;
    },
    openPayChannelList() {
      this.formPayChannel = true;
      // this.dataPayChannel.filter((item1) => {
      //   return !this.selected.find((item2) => item2.id === item1.id);
      // });
    },
    closePayChannel() {
      this.formPayChannel = false;
    },
    async addPayChannel() {
      var mainData = this.selected;
      await mainData.forEach((element, index) => {
        try {
          if (
            require("@/assets/images/logos/bank_logo/" +
              mainData[index].bankCode +
              "_logo.png")
          ) {
            mainData[index].logoImage = mainData[index].bankCode;
          }
          // do something
        } catch (e) {
          mainData[index].logoImage = "NONE";
          // do something else
        }
      });
      await mainData.forEach((element, index) => {
        try {
          if (
            require("@/assets/images/logos/bank_logo/" +
              mainData[index].paymentChannelName +
              "_logo.png")
          ) {
            mainData[index].payImage = mainData[index].paymentChannelName;
          }
          // do something
        } catch (e) {
          mainData[index].payImage = "NONE";
          // do something else
        }
      });
      this.$root.$emit("appAutocompliteMerchIdentityBankSettle", mainData);
      console.log("add pay channel", mainData);
      this.closePayChannel();
    },
    mdrCalculation(index) {
      // const mdr = (this.settlementItems[index].amount * this.valueMdr) / 100;
      // mdr.toFixed(2);
      // return (this.settlementItems[index].mdr = mdr);
    },
    amountCalculation(index) {
      // return (this.settlementItems[index].totalAmount =
      //   this.settlementItems[index].amount - this.settlementItems[index].mdr);
    },
    addNewField() {
      this.settlementItems.push({
        transactionDate: "",
        amount: 0,
        mdr: 0,
        mdrPercentage: this.valueMdr,
        totalAmount: 0,
        remark: "",
      });
    },
    handleNewInput(index) {
      if (
        index == this.settlementItems.length - 1 &&
        this.settlementItems[index].transactionDate != "" &&
        index == 0
      ) {
        this.addNewField(index);
      }
    },
    handleNewInputSecond(index) {
      if (
        index == this.settlementItems.length - 1 &&
        this.settlementItems[index].amount != 0 &&
        index > 0
      ) {
        this.addNewField();
      }
    },
    deleteField() {
      this.settlementItems.pop();
    },
    handleInput() {
      if (
        this.form.ouBranchId == -99 ||
        this.form.ouSubBranchId == -99 ||
        this.form.cashbankId == -99 ||
        this.form.merchantIdentityId == -99 ||
        this.settlementItems.length <= 1
      ) {
        this.notif("error", "Error", "Please fill out the form first");
      } else {
        // alert("success");
        this.addBankSettlement();
      }
    },
    addBankSettlement() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouSubBranchId =
        this.form.ouSubBranchId == "" || this.form.ouSubBranchId == null
          ? -99
          : parseInt(this.form.ouSubBranchId);
      const cashbankId =
        this.form.cashbankId == "" || this.form.cashbankId == null
          ? -99
          : parseInt(this.form.cashbankId);
      const merchantIdentityId =
        this.form.merchantIdentityId == "" ||
        this.form.merchantIdentityId == null
          ? -99
          : parseInt(this.form.merchantIdentityId);
      const settledDate = moment(this.form.settledDate).format("YYYYMMDD");
      const filterArray = this.settlementItems.filter((obj) => {
        return obj.amount != 0 && obj.transactionDate != "";
      });

      filterArray.map((obj) => {
        (obj.transactionDate = moment(obj.transactionDate).format("YYYYMMDD")),
          (obj.amount = obj.amount),
          (obj.mdr = 0),
          (obj.mdrPercentage = parseFloat(obj.mdrPercentage)),
          (obj.totalAmount = obj.amount),
          (obj.remark = obj.remark);
      });

      axios
        .post(
          `${themeConfig.app.api_cb}/cashbank-settlement-detail/add`,
          {
            ouId: ouSubBranchId,
            cashbankId: cashbankId,
            merchantIdentityId: merchantIdentityId,
            settledDate: settledDate,
            item: filterArray,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.meta.success == true) {
            this.settlementItems = [
              {
                transactionDate: "",
                amount: 0,
                mdr: 0,
                mdrPercentage: this.valueMdr,
                totalAmount: 0,
                remark: "",
              },
            ];
            this.notif("success", "Success", response.data.meta.message);
          }
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
    updateSettlement() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .post(
          `${themeConfig.app.api_cb}/cashbank-settlement-detail/edit`,
          {
            id: this.editForm.id,
            amount: this.editForm.amount,
            mdr: 0,
            mdrPercentage: parseFloat(this.editForm.mdrPercentage),
            totalAmount: this.editForm.amount,
            remark: this.editForm.remark,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.formEdit = false;
          this.getSettlementItem();
          this.notif("success", "Success", response.data.meta.message);
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

    deleteSettlement(item) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .get(
          `${themeConfig.app.api_cb}/cashbank-settlement-detail/remove/${item.id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getSettlementItem();
          this.notif("success", "Success", response.data.meta.message);
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

    getSettlementItem() {
      this.isDialogVisible = true;

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      const ouBranchId =
        this.form.ouBranchId == "" || this.form.ouBranchId == null
          ? -9
          : parseInt(this.form.ouBranchId);
      const ouSubBranchId =
        this.form.ouSubBranchId == "" || this.form.ouSubBranchId == null
          ? -99
          : parseInt(this.form.ouSubBranchId);
      const cashbankId =
        this.form.cashbankId == "" || this.form.cashbankId == null
          ? -99
          : parseInt(this.form.cashbankId);
      const merchantIdentityId =
        this.form.merchantIdentityId == "" ||
        this.form.merchantIdentityId == null
          ? -99
          : parseInt(this.form.merchantIdentityId);
      const settledDate = moment(this.form.settledDate).format("YYYYMMDD");

      axios
        .get(
          `${themeConfig.app.api_cb}/cashbank-settlement-detail/list?ouBranchId=${ouBranchId}&ouSubBranchId=${ouSubBranchId}&cashbankId=${cashbankId}&merchantIdentityId=${merchantIdentityId}&settledDate=${settledDate}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result != null) {
            this.mainDataItem = response.data.result;
          } else {
            this.mainDataItem = [];
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
    },

    getListByTransactionDate() {
      this.isDialogVisible = true;

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      const ouBranchId =
        this.form.ouBranchId == "" || this.form.ouBranchId == null
          ? -9
          : parseInt(this.form.ouBranchId);
      const ouSubBranchId =
        this.form.ouSubBranchId == "" || this.form.ouSubBranchId == null
          ? -99
          : parseInt(this.form.ouSubBranchId);
      const cashbankId =
        this.form.cashbankId == "" || this.form.cashbankId == null
          ? -99
          : parseInt(this.form.cashbankId);
      const merchantIdentityId =
        this.form.merchantIdentityId == "" ||
        this.form.merchantIdentityId == null
          ? -99
          : parseInt(this.form.merchantIdentityId);
      const settledDate = moment(this.form.settledDate).format("YYYYMMDD");

      axios
        .get(
          `${themeConfig.app.api_cb}/cashbank-settlement-detail/summary-list-by-trx-date?ouBranchId=${ouBranchId}&ouSubBranchId=${ouSubBranchId}&cashbankId=${cashbankId}&merchantIdentityId=${merchantIdentityId}&settledDate=${settledDate}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result != null) {
            this.dataItemTrxDate = response.data.result;
          } else {
            this.dataItemTrxDate = [];
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.dataItemTrxDate = [];
          this.notif("error", "Failed", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getPaymentChannel() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/merchant-identity/list-advance?mid=&projectName=&limit=100&offset=0`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            // this.dataPayChannel = response.data.result;
            this.dataPayChannel = response.data.result.filter(
              (item) =>
                item.flgInbound == "Y" &&
                item.projectName != "DEBIT-GPN-ONUS-BDKI-MKP"
            );
            this.dataPayChannel.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.dataPayChannel[index].bankCode +
                    "_logo.png")
                ) {
                  this.dataPayChannel[index].logoImage =
                    this.dataPayChannel[index].bankCode;
                }
                // do something
              } catch (e) {
                this.dataPayChannel[index].logoImage = "NONE";
                // do something else
              }
            });
            this.dataPayChannel.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.dataPayChannel[index].paymentChannelName +
                    "_logo.png")
                ) {
                  this.dataPayChannel[index].payImage =
                    this.dataPayChannel[index].paymentChannelName;
                }
                // do something
              } catch (e) {
                this.dataPayChannel[index].payImage = "NONE";
                // do something else
              }
            });
            // console.log("this data pay", this.dataPayChannel);
          } else {
            this.dataPayChannel = [];
          }
        })
        .catch((e) => {
          this.notif("error", "Gagal", e.response.data.meta.message);
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
