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
                      outlined
                      v-model="item.costAmount"
                      v-bind:readonly="false"
                      v-bind:disabled="disabled"
                      v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                      v-bind:options="options"
                      v-bind:properties="properties"
                      hide-details
                    />
                    <!--                    <v-text-field-->
                    <!--                        dense-->
                    <!--                        outlined-->
                    <!--                        hide-details-->
                    <!--                        v-model="item.amount"-->
                    <!--                    ></v-text-field>-->
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
      <v-col cols="12" class="pb-0">
        <span class="form-header"
          >Input Conversion Cash/Bank In For Partner Receive</span
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
                (form.statusDoc == 'NONE' && showSave) ||
                form.statusDoc == 'DRAFT'
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
              v-show="formEdit && form.statusDoc != 'APPROVED' && showSubmit"
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
              v-show="
                formEdit &&
                form.statusDoc == 'INCOMING APPROVAL REQUEST' &&
                showCR
              "
            >
              <v-icon dark left>
                {{ icons.mdiClose }}
              </v-icon>
              Change Request
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-ou-company
                  :form-value.sync="form.ouId"
                  :read-only="true"
                  :clearable="false"
                  :ou-type="'conversionCashBankInPartnerReceiveForm'"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-partner
                  :form-value.sync="form.partnerId"
                  :read-only="true"
                  :clearable="false"
                  :partner-type="'conversionCashBankInPartnerReceiveForm'"
                ></app-autocomplite-partner>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
                  :label="docNo"
                  v-model="form.docNo"
                  :placeholder="phDocNo"
                  :readonly="!formEdit"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="docDate"
                  :value-date.sync="form.docDate"
                  :read-only="!formEdit"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
                  label="Reference Doc No"
                  :placeholder="phRefDocNo"
                  v-model="form.refDocNo"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="'Reference Doc Date'"
                  :value-date.sync="form.refDocDate"
                  :read-only="true"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
                  :label="extDocNo"
                  :placeholder="phExtDocNo"
                  v-model="form.extDocNo"
                  :readonly="form.statusDoc == 'R'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="extDocDate"
                  :value-date.sync="form.extDocDate"
                  :clearable="form.statusDoc != 'R'"
                  :read-only="form.statusDoc == 'R'"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-cashbank-ou
                  :label-text="'Cash/Bank In'"
                  :value-bank-ou.sync="form.cashbankId"
                  :read-only="true"
                  :clearable="false"
                  :cashbank-type="'conversionCashBankInPartnerReceiveForm'"
                ></app-autocomplite-cashbank-ou>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-status
                  :lable-tittle="'Mode Payment'"
                  :status-type="'TRANSFERMODE'"
                  :form-value.sync="form.paymentMode"
                  :read-only="formEdit"
                  :clearable="!formEdit"
                ></app-autocomplite-status>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
                  label="Account No"
                  :placeholder="phAccountNo"
                  v-model="form.accountNo"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
                  label="Account Name"
                  :placeholder="phAccountName"
                  v-model="form.accountName"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
                  label="Payment Reference No"
                  :placeholder="phPaymentRefNo"
                  v-model="form.paymentRefNo"
                  :readonly="formEdit"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="'Payment Reference Date'"
                  :value-date.sync="form.paymentRefDate"
                  :read-only="formEdit"
                  :clearable="!formEdit"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <vuetify-money
                  dense
                  v-model="form.paymentAmount"
                  label="Payment Realization Amount"
                  v-bind:readonly="readonly"
                  v-bind:disabled="disabled"
                  v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                  v-bind:options="options"
                  v-bind:properties="properties"
                  hide-details
                />
              </v-col>
              <v-col cols="12" class="pb-0 mt-2">
                <v-textarea
                  outlined
                  dense
                  hide-details
                  :placeholder="phRemark"
                  label="Remark"
                  v-model="form.remark"
                  rows="3"
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
          <v-card-actions class="mt-8">
            <v-btn
              class="mt-2 mb-n4"
              small
              dark
              outlined
              color="primary"
              @click="addCost()"
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
              disable-pagination
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
                (form.statusDoc == 'NONE' && showSave) ||
                form.statusDoc == 'DRAFT'
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
              v-show="formEdit && form.statusDoc != 'APPROVED' && showSubmit"
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
              v-show="
                formEdit &&
                form.statusDoc == 'INCOMING APPROVAL REQUEST' &&
                showCR
              "
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
import AppAutocompliteStatus from "@core/components/app-autocomplite-ou/AppAutocompliteStatus";
import AppAutocompliteCashbankOu from "@core/components/app-autocomplite-ou/AppAutocompliteCashbankOu";
import Form from "vform";
import moment from "moment";
import {
  mdiCheckboxMarkedCircleOutline,
  mdiClose,
  mdiDelete,
  mdiPlus,
  mdiExitToApp,
} from "@mdi/js";
import themeConfig from "@themeConfig";
import { dateTimeFormat, number_format, isInArray } from "../../../../constan";
import axios from "@axios";
import router from "@/router";
import "../../../styles/textstyle.css";

export default {
  name: "childForm",
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppInputFieldDate,
    AppAutocompliteStatus,
    AppAutocompliteCashbankOu,
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
      selected: [],
      form: new Form({
        ouId: -99,
        docNo: "",
        docDate: moment().format("YYYY-MM-DD"),
        refDocNo: "",
        refDocDate: "",
        refId: -99,
        refDocType: -99,
        extDocNo: "",
        extDocDate: "",
        partnerId: -99,
        cashbankId: -99,
        paymentMode: "",
        bankCode: "",
        accountNo: "",
        accountName: "",
        paymentRefNo: "",
        paymentRefDate: "",
        paymentAmount: 0,
        remark: "",
        availableAmount: 0,
        totalCostAmount: 0,
        totalNettAmount: 0,
        statusDoc: "",
      }),

      icons: {
        mdiClose,
        mdiPlus,
        mdiDelete,
        mdiCheckboxMarkedCircleOutline,
        mdiExitToApp,
      },
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
    };
  },
  mounted() {
    this.$root.$on("InvoiceARPertnerReceiveForm", (msg) => {
      if (msg[0] == "addData") {
        this.formEdit = false;
        this.form.clear();
        this.form.reset();
        this.$root.$emit(
          "appAutocomplitePartnerConversionCashBankInPartnerReceiveForm",
          msg[1][0].ouId
        );
        this.$root.$emit(
          "appAutocompliteOuCashbankConversionCashBankInPartnerReceiveForm",
          msg[1][0].ouId
        );
        this.form.ouId = msg[1][0].ouId;
        this.form.partnerId = msg[1][0].partnerId;
        this.form.refDocNo = msg[1][0].docNo;
        this.form.refDocDate = moment(msg[1][0].docDate).format("YYYY-MM-DD");
        this.form.paymentAmount = msg[1][0].invoiceAmount;
        this.form.availableAmount = msg[1][0].invoiceAmount;
        this.form.totalNettAmount = msg[1][0].invoiceAmount;
        this.form.refId = msg[1][0].id;
        this.form.refDocTypeId = msg[1][0].docTypeId;
        this.form.statusDoc = "NONE";
        this.form.cashbankId = msg[1][0].cashbankId;
        this.form.accountNo = msg[1][0].accountNo;
        this.form.accountName = msg[1][0].accountName;
        this.mainData = [];
        this.selected = [];
      } else if (msg[0] == "editData") {
        this.formEdit = true;
        this.form.clear();
        this.form.reset();
        this.form.id = msg[1].id;
        this.getDetailCashbankConversion(msg[1].id);
        this.getActivityGlCostDetailList(msg[1].id);
      }
    });
    this.$root.$on("appAutocompliteOuCompany", (msg) => {
      this.$root.$emit("appAutocomplitePartner", msg);
      this.form.partnerId = -99;
      this.$root.$emit("appAutocompliteOuCashbank", msg);
    });
    this.$root.$on("appAutocompliteCashbankOu", (msg) => {
      this.getAccountInfo(msg);
    });
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    dateTimeFormat(value) {
      return dateTimeFormat(value);
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    closeForm() {
      this.$root.$emit(
        "InvoiceARPertnerReceive",
        this.invoiceARPartnerReceiveForm
      );
      this.$root.$emit(
        "InvoiceARPertnerReceiveReturn",
        "Tambah data berhasil!."
      );
    },
    getAccountInfo(msg) {
      this.form.bankCode = msg.bankCode;
      this.form.accountNo = msg.accountNo;
      this.form.accountName = msg.accountName;
    },
    getCurDocStatus(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      var docType = "CB08";
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
    getDetailCashbankConversion(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_cb}/conversion/detail/${id}`, config)
        .then((response) => {
          this.$root.$emit(
            "appAutocomplitePartnerConversionCashBankInPartnerReceiveForm",
            response.data.result[0].ouId
          );
          this.$root.$emit(
            "appAutocompliteOuCashbankConversionCashBankInPartnerReceiveForm",
            response.data.result[0].ouId
          );
          this.form.statusDoc = response.data.result[0].statusDoc;
          this.form.ouId = response.data.result[0].ouId;
          this.form.docNo = response.data.result[0].docNo;
          this.form.docDate = moment(response.data.result[0].docDate).format(
            "YYYY-MM-DD"
          );
          this.form.refDocNo = response.data.result[0].refDocNo;
          this.form.refDocDate =
            response.data.result[0].refDocDate == ""
              ? ""
              : moment(response.data.result[0].refDocDate).format("YYYY-MM-DD");
          this.form.extDocNo = response.data.result[0].extDocNo;
          this.form.extDocDate =
            response.data.result[0].extDocDate == ""
              ? ""
              : moment(response.data.result[0].extDocDate).format("YYYY-MM-DD");
          this.form.partnerId = response.data.result[0].partnerId;
          this.form.cashbankId = response.data.result[0].cashbankId;
          this.form.paymentMode = response.data.result[0].modePayment;
          this.form.accountNo = response.data.result[0].accountNo;
          this.form.accountName = response.data.result[0].accountName;
          this.form.paymentRefNo = response.data.result[0].paymentReferenceNo;
          this.form.paymentRefDate =
            response.data.result[0].paymentReferenceDate == ""
              ? ""
              : moment(response.data.result[0].paymentReferenceDate).format(
                  "YYYY-MM-DD"
                );
          this.form.paymentAmount = response.data.result[0].paymentRefAmount;
          this.form.availableAmount = response.data.result[0].paymentRefAmount;
          this.form.totalCostAmount = response.data.result[0].costPayment;
          this.form.totalNettAmount =
            response.data.result[0].paymentRefAmount -
            response.data.result[0].costPayment;
          this.form.remark = response.data.result[0].remark;
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
    getActivityGlCostDetailList(cashbankId) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_cb}/conversion/list-cost-by-cashbank-id/${cashbankId}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainData = response.data.result;
          } else {
            this.mainData = [];
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
    addCost() {
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
        this.form.totalCostAmount += parseFloat(item.costAmount);
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
        .catch(() => {
          // this.refreshData()
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
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/conversion/add`,
          {
            scheme: "CB08",
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
            cashbankId:
              this.form.cashbankId == "" || this.form.cashbankId == null
                ? -99
                : this.form.cashbankId,
            modePayment:
              this.form.paymentMode == "" || this.form.paymentMode == null
                ? ""
                : this.form.paymentMode,
            bankCode: this.form.bankCode,
            accountNo: this.form.accountNo,
            accountName: this.form.accountName,
            extDocNo: this.form.extDocNo,
            extDocDate:
              this.form.extDocDate == "" || this.form.extDocDate == null
                ? ""
                : moment(this.form.extDocDate).format("YYYYMMDD"),
            refDocNo: this.form.refDocNo,
            refDocDate:
              this.form.refDocDate == "" || this.form.refDocDate == null
                ? ""
                : moment(this.form.refDocDate).format("YYYYMMDD"),
            refDocTypeId: this.form.refDocTypeId,
            refId: this.form.refId,
            paymentRefNo: this.form.paymentRefNo,
            paymentRefDate:
              this.form.paymentRefDate == "" || this.form.paymentRefDate == null
                ? ""
                : moment(this.form.paymentRefDate).format("YYYYMMDD"),
            remark: this.form.remark,
            reason: this.form.reason,
            paymentRealizationAmount: this.form.paymentAmount,
            totalCostAmount: this.form.totalCostAmount,
            activityGlList: this.mainData,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          // this.closeForm()
          this.formEdit = true;
          this.formAdd = false;
          this.form.reason = "";
          this.notif("success", "Success", response.data.meta.message);
          this.form.id = response.data.result;
          this.getDetailCashbankConversion(response.data.result);
          this.getActivityGlCostDetailList(response.data.result);
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
          `${themeConfig.app.api_cb}/conversion/edit`,
          {
            scheme: "CB08",
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
          this.notif("success", "Success", response.data.meta.message);
          this.getDetailCashbankConversion(response.data.result);
          this.getActivityGlCostDetailList(response.data.result);
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
          `${themeConfig.app.api_cb}/conversion/submit`,
          {
            scheme: "CB08",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.form.reason = "";
          this.notif("success", "Success", response.data.meta.message);
          this.getDetailCashbankConversion(response.data.result);
          this.getActivityGlCostDetailList(response.data.result);
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
          `${themeConfig.app.api_cb}/conversion/changes-request`,
          {
            scheme: "CB08",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.form.reason = "";
          this.notif("success", "Success", response.data.meta.message);
          this.getDetailCashbankConversion(response.data.result);
          this.getActivityGlCostDetailList(response.data.result);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
