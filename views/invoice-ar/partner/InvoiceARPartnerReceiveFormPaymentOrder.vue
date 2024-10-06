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
    <v-dialog v-model="formGL" persistent width="1200">
      <v-card>
        <v-card-title class="headline px-8 font-weight-bold">
          Input Additional Cost
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="formGL = false">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12" class="p-0">
                <v-data-table
                  :headers="headersGl"
                  :items="mainDataGl"
                  :footer-props="{
                    'items-per-page-options': [25, 50, 100],
                  }"
                  fixed-header
                  dense
                  v-model="selected"
                  item-key="id"
                  show-select
                >
                  <template #[`item.costAmount`]="{ item }">
                    <vuetify-money
                      dense
                      v-model="item.costAmount"
                      v-bind:readonly="false"
                      v-bind:disabled="disabled"
                      v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                      v-bind:options="options"
                      v-bind:properties="properties"
                      hide-details
                    />
                  </template>
                  <template #[`item.remark`]="{ item }">
                    <v-text-field
                      dense
                      outlined
                      hide-details
                      v-model="item.remark"
                    ></v-text-field>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark small @click="addDataCost()">
            <v-icon dark left>
              {{ icons.mdiCheckboxMarkedCircleOutline }}
            </v-icon>
            Add Cost
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="formReason" persistent width="600">
      <v-card>
        <v-card-title class="font-weight-bold px-8">
          Input Reason
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            icon
            small
            @click="
              (formReason = false),
                (formAdd = false),
                (formCr = false),
                (formSubmit = false)
            "
          >
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" class="pb-0">
                <v-textarea
                  outlined
                  dense
                  hide-details
                  label="Reason"
                  v-model="form.reason"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark small @click="saveData()">
            <v-icon dark left>
              {{ icons.mdiCheckboxMarkedCircleOutline }}
            </v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" class="mb-0">
        <span class="form-header"
          >Input Conversion Cash/Bank In Payment Order</span
        >
        <v-card class="card-style">
          <v-card-actions class="mb-6">
            <v-chip
              small
              :class="`${
                form.statusDoc == 'NONE'
                  ? 'secondary'
                  : form.statusDoc == 'DRAFT'
                  ? 'warning'
                  : form.statusDoc == 'INCOMING APPROVAL REQUEST'
                  ? 'primary'
                  : 'success'
              }--text`"
              class="v-chip-light-bg font-weight-semibold text-capitalize"
              :color="
                form.statusDoc == 'NONE'
                  ? 'secondary'
                  : form.statusDoc == 'DRAFT'
                  ? 'warning'
                  : form.statusDoc == 'INCOMING APPROVAL REQUEST'
                  ? 'primary'
                  : 'success'
              "
            >
              {{ form.statusDoc }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn small dark color="secondary" @click="closeForm()">
              <v-icon dark left>
                {{ icons.mdiExitToApp }}
              </v-icon>
              Exit
            </v-btn>
            <v-btn
              small
              dark
              color="primary"
              @click="
                (formReason = true),
                  formEdit == false ? (formAdd = true) : (formAdd = false)
              "
              v-show="
                (form.statusDoc == '' || form.statusDoc == 'D') && showSave
              "
            >
              <v-icon dark left>
                {{ icons.mdiCheckboxMarkedCircleOutline }}
              </v-icon>
              Save
            </v-btn>
            <v-btn
              small
              dark
              color="success"
              @click="(formReason = true), (formSubmit = true)"
              v-show="formEdit && form.statusDoc != 'R' && showSubmit"
            >
              <v-icon dark left>
                {{ icons.mdiCheckboxMarkedCircleOutline }}
              </v-icon>
              Submit
            </v-btn>
            <v-btn
              small
              dark
              color="error"
              @click="(formReason = true), (formCr = true)"
              v-show="formEdit && form.statusDoc == 'I' && showCR"
            >
              <v-icon dark left>
                {{ icons.mdiClose }}
              </v-icon>
              Change Request
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="mb-0">
                <app-autocomplite-ou-company
                  :form-value.sync="form.ouId"
                  :read-only="true"
                  :clearable="false"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <app-autocomplite-partner
                  :form-value.sync="form.partnerId"
                  :read-only="true"
                  :clearable="false"
                ></app-autocomplite-partner>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <v-text-field
                  dense
                  hide-details
                  :label="docNo"
                  :placeholder="phDocNo"
                  v-model="form.docNo"
                  :readonly="formEdit"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <app-input-field-date
                  :value-date.sync="form.docDate"
                  :label-title="docDate"
                  :read-only="formEdit"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <v-text-field
                  dense
                  hide-details
                  :label="extDocNo"
                  :placeholder="phExtDocNo"
                  v-model="form.extDocNo"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <app-input-field-date
                  :value-date.sync="form.extDocDate"
                  :label-title="extDocDate"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field
                  dense
                  hide-details
                  :placeholder="phPaymentRefNo"
                  label="Payment Reference No"
                  v-model="form.paymentRefNo"
                  :readonly="formEdit"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <app-input-field-date
                  :label-title="'Payment Reference Date'"
                  :value-date.sync="form.paymentRefDate"
                  :read-only="formEdit"
                  :clearable="!formEdit"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="mb-0 mt-4">
                <vuetify-money
                  dense
                  v-model="form.totalAmount"
                  label="Total Amount"
                  v-bind:readonly="readonly"
                  v-bind:disabled="disabled"
                  v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                  v-bind:options="options"
                  v-bind:properties="properties"
                  hide-details
                />
              </v-col>
              <v-col cols="12" class="mb-0">
                <v-textarea
                  outlined
                  dense
                  :placeholder="phRemark"
                  hide-details
                  label="Remark"
                  v-model="form.remark"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-title class="py-4"><span>Summary</span></v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" class="pb-0">
                <vuetify-money
                  dense
                  v-model="form.availableAmount"
                  label="Available Amount"
                  v-bind:readonly="readonly"
                  v-bind:disabled="disabled"
                  v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                  v-bind:options="options"
                  v-bind:properties="properties"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="4" class="pb-0">
                <vuetify-money
                  dense
                  v-model="form.totalCostAmount"
                  label="Total Cost Amount"
                  v-bind:readonly="readonly"
                  v-bind:disabled="disabled"
                  v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                  v-bind:options="options"
                  v-bind:properties="properties"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="4" class="pb-0">
                <vuetify-money
                  dense
                  v-model="form.totalNettAmount"
                  label="Total Nett Amount"
                  v-bind:readonly="readonly"
                  v-bind:disabled="disabled"
                  v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                  v-bind:options="options"
                  v-bind:properties="properties"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              small
              class="mb-n4 mt-2"
              outlined
              dark
              color="primary"
              @click="getGlList()"
              v-show="!formEdit"
            >
              <v-icon dark left>{{ icons.mdiPlus }}</v-icon>
              Add Additional Cost
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="mainData"
              :footer-props="{
                'items-per-page-options': [25, 50, 100],
              }"
              fixed-header
              dense
            >
              <!-- format uang-->
              <template #[`item.costAmount`]="{ item }">
                Rp.{{ number_format(item.costAmount) }}
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
                      v-show="!formEdit"
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
          </v-card-text>

          <v-card-text>
            <v-data-table
              :headers="headersSummaryRevenue"
              :items="mainDataSummary"
              :footer-props="{
                'items-per-page-options': [25, 50, 100],
              }"
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
                      >{{ item.cashbankCode }}</span
                    >
                    <span class="text-xs">{{ item.cashbankName }}</span>
                  </div>
                </div>
              </template>

              <template #[`item.akun`]="{ item }">
                <div class="d-flex align-center">
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

              <!-- format uang-->
              <template #[`item.amount`]="{ item }">
                Rp.{{ number_format(item.amount) }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headersInvoicePaymentOrder"
              :items="mainDataPaymentOrder"
              :footer-props="{
                'items-per-page-options': [25, 50, 100],
              }"
              fixed-header
              dense
            >
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
                  <span class="text-xs">{{ item.partnerCode }}</span>
                </div>
              </template>

              <!-- format uang-->
              <template #[`item.amount`]="{ item }">
                Rp.{{ number_format(item.paymentAmount) }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small dark color="secondary" @click="closeForm()">
              <v-icon dark left>
                {{ icons.mdiExitToApp }}
              </v-icon>
              Exit
            </v-btn>
            <v-btn
              small
              dark
              color="primary"
              @click="
                (formReason = true),
                  formEdit == false ? (formAdd = true) : (formAdd = false)
              "
              v-show="
                (form.statusDoc == '' || form.statusDoc == 'D') && showSave
              "
            >
              <v-icon dark left>
                {{ icons.mdiCheckboxMarkedCircleOutline }}
              </v-icon>
              Save
            </v-btn>
            <v-btn
              small
              dark
              color="success"
              @click="(formReason = true), (formSubmit = true)"
              v-show="formEdit && form.statusDoc != 'R' && showSubmit"
            >
              <v-icon dark left>
                {{ icons.mdiCheckboxMarkedCircleOutline }}
              </v-icon>
              Submit
            </v-btn>
            <v-btn
              small
              dark
              color="error"
              @click="(formReason = true), (formCr = true)"
              v-show="formEdit && form.statusDoc == 'I' && showCR"
            >
              <v-icon dark left>
                {{ icons.mdiClose }}
              </v-icon>
              Change Request
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import themeConfig from "@themeConfig";
import {
  mdiCheckboxMarkedCircleOutline,
  mdiClose,
  mdiDelete,
  mdiPlus,
  mdiExitToApp,
} from "@mdi/js";
import {
  dateFormat,
  dateTimeFormat,
  number_format,
  isInArray,
} from "../../../../constan";
import Form from "vform";
import moment from "moment";
import axios from "@axios";
import router from "@/router";
import "../../../styles/textstyle.css";

export default {
  name: "ChildFormPaymentOrder",
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppInputFieldDate,
    AppCardLoader,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      extDocNo: themeConfig.labeling.extDocNo,
      extDocDate: themeConfig.labeling.extDocDate,

      phDocNo: themeConfig.placeholder.docNo,
      phExtDocNo: themeConfig.placeholder.extDocNo,
      phAccountNo: themeConfig.placeholder.accountNo,
      phAccountName: themeConfig.placeholder.accountName,
      phPaymentRefNo: themeConfig.placeholder.paymentRefNo,
      phRemark: themeConfig.placeholder.remark,
      phRefDocNo: themeConfig.placeholder.refDocNo,

      // role
      showSave:
        isInArray(
          "editConversionCashBankInPartnerReceive",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showSubmit:
        isInArray(
          "submitConversionCashBankInPartnerReceive",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showCR:
        isInArray(
          "changeRequestConversionCashBankInPartnerReceive",
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

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      icons: {
        mdiClose,
        mdiPlus,
        mdiDelete,
        mdiCheckboxMarkedCircleOutline,
        mdiExitToApp,
      },

      formGL: false,
      isDialogVisible: false,
      invoiceARPartnerReceiveForm: false,
      formEdit: false,
      formReason: false,
      formAdd: false,
      formCr: false,
      formSubmit: false,
      mainData: [],
      mainDataGl: [],
      mainDataPaymentOrder: [],
      mainDataSummary: [],
      selected: [],
      paymentOrderId: [],
      form: new Form({
        scheme: "CB09",
        id: "",
        ouId: -99,
        docNo: "",
        docDate: moment().format("YYYY-MM-DD"),
        extDocNo: "",
        extDocDate: "",
        partnerId: -99,
        totalAmount: 0,
        remark: "",
        reason: "",
        paymentRefNo: "",
        paymentRefDate: "",
        availableAmount: 0,
        totalCostAmount: 0,
        totalNettAmount: 0,
        statusDoc: "",
        workflowStatus: "",
      }),
      headers: [
        {
          text: "Actions",
          value: "actions",
          width: "100px",
          sortable: false,
        },
        {
          text: "Activity G/L Code",
          value: "activityGlCode",
          width: "150px",
        },
        {
          text: "Activity G/L Name",
          value: "activityGlName",
          width: "250px",
        },
        {
          text: "Amount",
          value: "costAmount",
          width: "150px",
          align: "right",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
      ],
      headersGl: [
        {
          text: "Activity G/L Code",
          value: "activityGlCode",
          width: "150px",
        },
        {
          text: "Activity G/L Name",
          value: "activityGlName",
          width: "350px",
        },
        {
          text: "Amount",
          value: "costAmount",
          width: "150px",
          align: "right",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
      ],
      headersSummaryRevenue: [
        {
          text: "Cash/Bank",
          value: "bank",
          width: "200px",
        },
        {
          text: "Account",
          value: "akun",
          width: "200px",
        },
        {
          text: "Amount",
          value: "amount",
          align: "right",
        },
      ],
      headersInvoicePaymentOrder: [
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
          width: "150px",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("appAutocompliteOuCompany", (msg) => {
      this.$root.$emit("appAutocomplitePartner", msg);
      this.form.partnerId = -99;
    });
    this.$root.$on("InvoiceARPertnerReceiveFormPaymentOrder", (msg) => {
      if (msg[0] == "addData") {
        this.form.statusDoc = "";
        this.form.workflowStatus = "NONE";
        this.formEdit = false;
        this.form.ouId = msg[2].ouId;
        this.form.partnerId = msg[2].partnerId;
        this.form.totalAmount = 0;
        this.mainDataPaymentOrder = msg[1];
        msg[1].forEach((item) => {
          this.form.totalAmount += item.paymentAmount;
          this.paymentOrderId.push(item.id);
        });
        this.form.availableAmount = this.form.totalAmount;
        this.form.totalNettAmount =
          this.form.totalAmount - this.form.totalCostAmount;
        this.getSummaryBankRevenue();
        this.form.statusDoc = "NONE";
      } else if (msg[0] == "editData") {
        this.formEdit = true;
        this.form.clear();
        this.form.reset();
        this.form.id = msg[1].id;
        this.getDetailPaymentOrder(msg[1].id);
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
    closeForm() {
      this.$root.$emit(
        "InvoiceARPertnerReceivebyPaymentOrder",
        this.invoiceARPartnerReceiveForm
      );
    },
    getSummaryBankRevenue() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const keyword = "";
      axios
        .get(
          `${themeConfig.app.api_cb}/payment-order/detail-summary-payment-order-cost-list?paymentOrderId=${this.paymentOrderId}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            // this.mainDataSummary = response.data.result
            this.mainDataSummary = [];
            var result = [];
            response.data.result.reduce(function (res, value) {
              if (!res[value.cashbankId]) {
                res[value.cashbankId] = {
                  accountName: value.accountName,
                  accountNo: value.accountNo,
                  amount: value.amount,
                  bankCode: value.bankCode,
                  cashbankCode: value.cashbankCode,
                  cashbankId: value.cashbankId,
                  cashbankName: value.cashbankName,
                };
                result.push(res[value.cashbankId]);
              } else {
                res[value.cashbankId].amount += value.amount;
              }
              return res;
            }, {});
            this.mainDataSummary = result;
          } else {
            this.mainDataSummary = [];
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
    getGlList() {
      this.formGL = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const keyword = "";
      axios
        .get(
          `${themeConfig.app.api_master}/activity-gl/list?keyword=${keyword}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainDataGl = response.data.result;
            response.data.result.forEach((element, index) => {
              this.mainDataGl[index].remark = "";
            });
          } else {
            this.mainDataGl = [];
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
    addDataCost() {
      this.formGL = false;
      this.mainData = [];
      this.form.totalCostAmount = 0;
      this.selected.forEach((item) => {
        var valueToPush = {};
        valueToPush["id"] = item.id;
        valueToPush["activityGlCode"] = item.activityGlCode;
        valueToPush["activityGlName"] = item.activityGlName;
        valueToPush["costAmount"] =
          item.costAmount == undefined ? 0 : parseFloat(item.costAmount);
        valueToPush["remark"] = item.remark;
        this.mainData.push(valueToPush);
        this.form.totalCostAmount +=
          item.costAmount == undefined ? 0 : parseFloat(item.costAmount);
      });
      this.form.totalNettAmount =
        this.form.availableAmount - this.form.totalCostAmount;
    },
    confirmDialogDraft(id) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.isDialogVisible = true;
          this.mainData = this.mainData.filter(function (item) {
            return item["id"] != id;
          });
          this.selected = this.selected.filter(function (item) {
            return item["id"] != id;
          });
          this.form.totalCostAmount = 0;
          this.mainData.forEach((item) => {
            this.form.totalCostAmount += item.costAmount;
          });
          this.form.totalNettAmount =
            this.form.availableAmount - this.form.totalCostAmount;
          this.isDialogVisible = false;
          setTimeout(() => {
            dialog.close();
          }, 500);
        })
        .catch(() => {});
    },
    getCurDocStatus(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      var docType = "CB09";
      axios
        .get(
          `${themeConfig.app.api_awe}/approval/current-document/${docType}/${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.form.statusDoc = response.data.result.currentState;
            this.form.reqId = response.data.result.reqId;
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
    getDetailPaymentOrder(id) {
      this.form.id = id;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const keyword = "";
      axios
        .get(`${themeConfig.app.api_cb}/payment-order/detail/${id}`, config)
        .then((response) => {
          this.form.totalCostAmount = 0;
          this.form.statusDoc = response.data.result.inOutCashbank.statusDoc;
          this.form.ouId = response.data.result.inOutCashbank.ouId;
          this.form.docNo = response.data.result.inOutCashbank.docNo;
          this.form.docDate = moment(
            response.data.result.inOutCashbank.docDate
          ).format("YYYY-MM-DD");
          this.form.extDocNo = response.data.result.inOutCashbank.extDocNo;
          this.form.extDocDate =
            response.data.result.inOutCashbank.extDocDate == ""
              ? ""
              : moment(response.data.result.inOutCashbank.extDocDate).format(
                  "YYYY-MM-DD"
                );
          this.form.paymentRefNo =
            response.data.result.cashbankPayment[0].paymentReferenceNo;
          this.form.paymentRefDate =
            response.data.result.cashbankPayment[0].paymentReferenceDate == ""
              ? ""
              : moment(
                  response.data.result.cashbankPayment[0].paymentReferenceDate
                ).format("YYYY-MM-DD");
          this.form.partnerId = response.data.result.inOutCashbank.partnerId;
          this.form.remark = response.data.result.inOutCashbank.remark;
          this.mainData = response.data.result.activityGlCostList;
          this.mainDataSummary = response.data.result.cashbankPayment;
          this.mainDataPaymentOrder = response.data.result.cashbankInvoice;
          if (response.data.result.activityGlCostList != null) {
            response.data.result.activityGlCostList.forEach((item) => {
              this.form.totalCostAmount += item.costAmount;
            });
          }
          this.mainDataSummary.forEach((element, index) => {
            this.mainDataSummary[index].amount =
              this.mainDataSummary[index].paymentAmount;
          });
          this.form.totalNettAmount =
            response.data.result.inOutCashbank.paymentAmount -
            this.form.totalCostAmount;
          this.form.totalAmount =
            response.data.result.inOutCashbank.paymentAmount;
          this.form.availableAmount =
            response.data.result.inOutCashbank.paymentAmount;
          this.getCurDocStatus(this.form.id);
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
    saveData() {
      if (this.formAdd) {
        this.addData();
      } else if (this.formCr) {
        this.crData();
      } else if (this.formSubmit) {
        this.submitData();
      } else if (this.formEdit) {
        this.editData();
      }
      this.formReason = false;
    },
    addData() {
      this.isDialogVisible = true;
      this.mainDataSummary.forEach((element, index) => {
        this.mainDataSummary[index].remark = this.form.remark;
      });
      this.mainData.forEach((element, index) => {
        this.mainData[index].ativityGlId = element.id;
      });
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/payment-order/add`,
          {
            scheme: this.form.scheme,
            docNo: this.form.docNo,
            docDate: moment(this.form.docDate).format("YYYYMMDD"),
            ouId:
              this.form.ouId == "" || this.form.ouId == null
                ? -99
                : this.form.ouId,
            partnerId:
              this.form.partnerId == "" || this.form.partnerId == null
                ? -99
                : this.form.partnerId,
            extDocNo: this.form.extDocNo,
            extDocDate:
              this.form.extDocDate == "" || this.form.extDocDate == null
                ? ""
                : moment(this.form.extDocDate).format("YYYYMMDD"),
            paymentRefNo: this.form.paymentRefNo,
            paymentRefDate:
              this.form.paymentRefDate == "" || this.form.paymentRefDate == null
                ? ""
                : moment(this.form.paymentRefDate).format("YYYYMMDD"),
            remark: this.form.remark,
            reason: this.form.reason,
            totalAmount: this.form.totalAmount,
            activityGlList: this.mainData,
            paymentOrderInvoiceList: this.mainDataPaymentOrder,
            paymentOrderCashbankList: this.mainDataSummary,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.form.reason = "";
          this.formEdit = true;
          this.formAdd = false;
          this.getDetailPaymentOrder(response.data.result);
          this.notif("success", "Success", response.data.meta.message);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    editData() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/payment-order/edit`,
          {
            scheme: this.form.scheme,
            id: this.form.id,
            extDocNo: this.form.extDocNo,
            extDocDate:
              this.form.extDocDate == "" || this.form.extDocDate == null
                ? ""
                : moment(this.form.extDocDate).format("YYYYMMDD"),
            remark: this.form.remark,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.form.reason = "";
          this.getDetailPaymentOrder(response.data.result);
          this.notif("success", "Success", response.data.meta.message);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    submitData() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/payment-order/submit`,
          {
            scheme: this.form.scheme,
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.form.reason = "";
          this.getDetailPaymentOrder(response.data.result);
          this.notif("success", "Success", response.data.meta.message);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    crData() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/payment-order/changes-request`,
          {
            scheme: this.form.scheme,
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.form.reason = "";
          this.getDetailPaymentOrder(response.data.result);
          this.notif("success", "Success", response.data.meta.message);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
