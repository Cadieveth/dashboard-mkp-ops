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
      <v-col cols="12" :md="formHistori ? '9' : '12'" class="mb-0">
        <span class="form-header"
          >Input Create Cash/Bank In Partner Receive</span
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
                  formEdit == true ? (formAdd = false) : (formAdd = true)
              "
              v-show="form.workflowStatus != 'RELEASED' && showSave"
            >
              <v-icon dark left>{{
                icons.mdiCheckboxMarkedCircleOutline
              }}</v-icon>
              Save
            </v-btn>
            <v-btn
              small
              dark
              color="success"
              @click="(formReason = true), (formSubmit = true)"
              v-show="
                (form.workflowStatus == 'DRAFT' ||
                  form.workflowStatus == 'INPROGRESS') &&
                submitDraft
              "
            >
              <v-icon dark left>{{ icons.mdiCheckAll }}</v-icon>
              Submit
            </v-btn>
            <v-btn
              small
              dark
              color="error"
              @click="(formReason = true), (formCr = true)"
              v-show="form.workflowStatus == 'INPROGRESS' && showCR"
            >
              <v-icon dark left>{{ icons.mdiClose }}</v-icon>
              Changes Request
            </v-btn>
            <v-btn
              color="info"
              small
              dark
              @click="showHistory()"
              v-show="formEdit && !formHistori"
            >
              <v-icon dark left>
                {{ icons.mdiEyeOutline }}
              </v-icon>
              History
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="mb-0">
                <app-autocomplite-ou-company
                  :form-value.sync="form.ouId"
                  :read-only="true"
                  :clearable="false"
                  :ou-type="'cashbankInPartnerReceiveForm'"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <app-autocomplite-partner
                  :form-value.sync="form.partnerId"
                  :read-only="true"
                  :clearable="false"
                  :partner-type="'cashbankInPartnerReceiveForm'"
                ></app-autocomplite-partner>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <v-text-field
                  dense
                  hide-details
                  :label="docNo"
                  v-model="form.docNo"
                  :placeholder="phDocNo"
                  :readonly="formEdit"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <app-input-field-date
                  :label-title="docDate"
                  :value-date.sync="form.docDate"
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
                  :label-title="extDocDate"
                  :value-date.sync="form.extDocDate"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <app-autocomplite-cashbank-ou
                  :value-bank-ou.sync="form.cashbankId"
                  :read-only="true"
                  :clearable="false"
                  :label-text="'Cash/bank'"
                  :cashbank-type="'cashbankInPartnerReceiveForm'"
                ></app-autocomplite-cashbank-ou>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <app-autocomplite-status
                  :form-value.sync="form.modePayment"
                  :status-type="'TRANSFERMODE'"
                  :lable-tittle="'Mode Payment'"
                  :read-only="formEdit"
                  :clearable="!formEdit"
                ></app-autocomplite-status>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <v-text-field
                  dense
                  hide-details
                  label="Account No"
                  :placeholder="phAccountNo"
                  v-model="form.accountNo"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <v-text-field
                  dense
                  hide-details
                  label="Account Name"
                  v-model="form.accountName"
                  :placeholder="phAccountName"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <v-text-field
                  dense
                  hide-details
                  label="Payment Reference No"
                  :placeholder="phPaymentRefNo"
                  v-model="form.paymentReferenceNo"
                  :readonly="formEdit"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <app-input-field-date
                  :label-title="'Payment Reference Date'"
                  :value-date.sync="form.paymentReferenceDate"
                  :read-only="formEdit"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" class="mb-0">
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
              <v-col cols="12" class="mb-0">
                <vuetify-money
                  label="Total payment"
                  dense
                  v-model="form.totalAmount"
                  v-bind:readonly="true"
                  v-bind:disabled="disabled"
                  v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                  v-bind:options="options"
                  v-bind:properties="properties"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headersGl"
              :items="mainDataGl"
              :footer-props="{
                'items-per-page-options': [25, 50, 100],
              }"
              disable-pagination
              fixed-header
              dense
            >
              <template #[`item.amountGl`]="{ item }">
                Rp. {{ number_format(item.costAmount) }}
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
                      v-show="!formEdit"
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
                  formEdit == true ? (formAdd = false) : (formAdd = true)
              "
              v-show="form.workflowStatus != 'RELEASED' && showSave"
            >
              <v-icon dark left>{{
                icons.mdiCheckboxMarkedCircleOutline
              }}</v-icon>
              Save
            </v-btn>
            <v-btn
              small
              dark
              color="success"
              @click="(formReason = true), (formSubmit = true)"
              v-show="
                (form.workflowStatus == 'DRAFT' ||
                  form.workflowStatus == 'INPROGRESS') &&
                submitDraft
              "
            >
              <v-icon dark left>{{ icons.mdiCheckAll }}</v-icon>
              Submit
            </v-btn>
            <v-btn
              small
              dark
              color="error"
              @click="(formReason = true), (formCr = true)"
              v-show="form.workflowStatus == 'INPROGRESS' && showCR"
            >
              <v-icon dark left>{{ icons.mdiClose }}</v-icon>
              Changes Request
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" v-show="formHistori">
        <span class="form-header">Document History</span>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              text
              small
              fab
              @click="formHistori = false"
            >
              <v-icon dark>
                {{ icons.mdiClose }}
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-timeline
              class="no-dots-shadow pb-4 pb-0 pt-0"
              align-top
              :dense="$vuetify.breakpoint.smAndDown"
              v-for="(item, i) in mainDataHistory"
              :key="i"
            >
              <!-- Timeline Item: Flight -->
              <v-timeline-item
                color="transparent"
                v-show="item.activity === 'CHANGES REQUEST' ? true : false"
              >
                <template #icon>
                  <v-avatar
                    color="error"
                    class="v-avatar-light-bg error--text"
                    size="40"
                  >
                    <v-icon size="24" color="error">
                      {{ icons.mdiClose }}
                    </v-icon>
                  </v-avatar>
                </template>
                <!-- Header -->
                <div class="d-flex align-end mb-1">
                  <v-icon class="me-1">
                    {{ icons.mdiAccountMultipleRemoveOutline }}
                  </v-icon>
                  <p class="mb-0 text--primary font-weight-semibold">
                    <span>{{ item.fullName }}</span>
                  </p>
                </div>
                <v-divider></v-divider>
                <p class="mb-0 text--primary font-weight-semibold">
                  {{ item.nextState }}
                </p>
                <p>{{ item.remark }}</p>
              </v-timeline-item>

              <!-- Timeline Item: Interview -->
              <v-timeline-item
                color="transparent"
                v-show="item.activity !== 'CHANGES REQUEST' ? true : false"
              >
                <template #icon>
                  <v-avatar
                    color="success"
                    class="v-avatar-light-bg success--text"
                    size="40"
                  >
                    <v-icon size="24" color="success">
                      {{
                        item.nextState == "APPROVED"
                          ? icons.mdiCheckAll
                          : icons.mdiCheck
                      }}
                    </v-icon>
                  </v-avatar>
                </template>

                <!-- Person -->
                <div class="d-flex align-end mb-1">
                  <v-icon class="me-1">
                    {{ icons.mdiAccountMultipleCheckOutline }}
                  </v-icon>
                  <p class="mb-0 text--primary font-weight-semibold">
                    <span>{{ item.fullName }}</span>
                  </p>
                </div>
                <v-divider></v-divider>
                <p class="mb-0 text--primary font-weight-semibold">
                  {{ item.nextState }}
                </p>
                <p>{{ item.remark }}</p>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocompliteCashbankOu from "@core/components/app-autocomplite-ou/AppAutocompliteCashbankOu";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppAutocompliteStatus from "@core/components/app-autocomplite-ou/AppAutocompliteStatus";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import Form from "vform";
import moment from "moment";
import themeConfig from "@themeConfig";
import { dateTimeFormat, number_format, isInArray } from "../../../constan";
import {
  mdiAccountMultipleCheckOutline,
  mdiAccountMultipleRemoveOutline,
  mdiCheck,
  mdiCheckAll,
  mdiCheckboxMarkedCircleOutline,
  mdiClose,
  mdiDelete,
  mdiEyeOutline,
  mdiPlus,
  mdiReplay,
  mdiExitToApp,
} from "@mdi/js";
import axios from "@axios";
import router from "@/router";
import "../../styles/textstyle.css";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";

export default {
  name: "ChildForm",
  components: {
    AppAutocompliteOuCompany,
    AppAutocompliteCashbankOu,
    AppAutocomplitePartner,
    AppAutocompliteStatus,
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

      submitDraft: false,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      // role
      showSave:
        isInArray(
          "editCashBankInPartner",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showSubmit:
        isInArray(
          "submitCashBankInPartner",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showCR:
        isInArray(
          "changeRequestCashBankInPartner",
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

      icons: {
        mdiClose,
        mdiPlus,
        mdiDelete,
        mdiEyeOutline,
        mdiCheckboxMarkedCircleOutline,
        mdiCheck,
        mdiCheckAll,
        mdiAccountMultipleCheckOutline,
        mdiAccountMultipleRemoveOutline,
        mdiReplay,
        mdiExitToApp,
      },

      isDialogVisible: false,
      formHistori: false,
      formEdit: false,
      formReason: false,
      formAdd: false,
      formSubmit: false,
      formCr: false,
      mainDataGl: [],
      mainDataHistory: [],
      form: new Form({
        id: "",
        docNo: "",
        docDate: moment().format("YYYY-MM-DD"),
        ouId: -99,
        partnerId: -99,
        cashbankId: -99,
        bankCode: "",
        accountNo: "",
        accountName: "",
        modePayment: "",
        paymentReferenceNo: "",
        paymentReferenceDate: "",
        extDocNo: "",
        extDocDate: "",
        refId: -99,
        refDocTypeId: -99,
        remark: "",
        totalAmount: 0,
        reason: "",
        statusDoc: "",
        workflowStatus: "",
        reqId: -99,
      }),
      headersGl: [
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
    };
  },
  mounted() {
    // this.$root.$on('appAutocompliteOuCompany', msg => {
    //   this.$root.$emit('appAutocomplitePartner', msg)
    //   this.$root.$emit('appAutocompliteOuCashbank', msg)
    // })
    this.submitDraft = false;
    this.$root.$on(
      "appAutocompliteOuCompanyCashbankInPartnerReceiveForm",
      (msg) => {
        this.$root.$emit(
          "appAutocomplitePartnerCashbankInPartnerReceiveForm",
          msg
        );
        this.$root.$emit(
          "appAutocompliteOuCashbankCashbankInPartnerReceiveForm",
          msg
        );
      }
    );
    this.$root.$on("appAutocompliteCashbankOu", (msg) => {
      this.getAccountInfo(msg);
    });
    this.$root.$on("cashbankInPartnerReceiveForm", (msg) => {
      if (msg[0] == "addData") {
        this.$root.$emit(
          "appAutocomplitePartnerCashbankInPartnerReceiveForm",
          msg[1].ouId
        );
        this.$root.$emit(
          "appAutocompliteOuCashbankCashbankInPartnerReceiveForm",
          msg[1].ouId
        );
        this.form.clear();
        this.form.reset();
        this.form.ouId = msg[1].ouId;
        this.form.partnerId = msg[1].partnerId;
        this.form.cashbankId = msg[1].cashbankId;
        this.form.bankCode = msg[1].bankCode;
        this.form.accountNo = msg[1].accountNo;
        this.form.accountName = msg[1].accountName;
        this.form.statusDoc = "NONE";
        this.form.totalAmount = 0;
        this.mainDataGl = msg[2];
        msg[2].forEach((element, index) => {
          this.form.totalAmount +=
            msg[2][index].costAmount == undefined
              ? 0
              : parseFloat(msg[2][index].costAmount);
          this.mainDataGl[index].costAmount =
            msg[2][index].costAmount == undefined
              ? 0
              : parseFloat(msg[2][index].costAmount);
        });
      } else if (msg[0] == "editData") {
        this.formEdit = true;
        this.detailData(msg[1]);
        this.submitDraft = true;
      }
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
      this.$root.$emit("cashbankInPartnerReceive", false);
      this.$root.$emit(
        "cashbankInPartnerReceiveReturn",
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
      const docType = "CB07";
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
    showHistory() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_awe}/approval/history-document/${this.form.reqId}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainDataHistory = [];
            this.formHistori = true;
            response.data.result.sort(
              (a, b) => parseFloat(b.id) - parseFloat(a.id)
            );
            this.mainDataHistory = response.data.result;
          } else {
            this.mainDataHistory = [];
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
    detailData(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_cb}/partner-receive/detail/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.$root.$emit(
            "appAutocomplitePartnerCashbankInPartnerReceiveForm",
            response.data.result.ou.id
          );
          this.$root.$emit(
            "appAutocompliteOuCashbankCashbankInPartnerReceiveForm",
            response.data.result.ou.id
          );
          this.form.id = response.data.result.inOutCashbank.id;
          this.form.ouId = response.data.result.ou.id;
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
          this.form.partnerId = response.data.result.partner.id;
          this.form.cashbankId = response.data.result.cashbank.id;
          this.form.modePayment =
            response.data.result.cashbankPayment.modePayment;
          this.form.accountNo = response.data.result.cashbank.accountNo;
          this.form.accountName = response.data.result.cashbank.accountName;
          this.form.paymentReferenceNo =
            response.data.result.cashbankPayment.paymentReferenceNo;
          this.form.paymentReferenceDate =
            response.data.result.cashbankPayment.paymentReferenceDate == ""
              ? ""
              : moment(
                  response.data.result.inOutCashbank.paymentReferenceDate
                ).format("YYYY-MM-DD");
          this.form.totalAmount =
            response.data.result.inOutCashbank.paymentAmount;
          this.form.remark = response.data.result.inOutCashbank.remark;
          this.mainDataGl = response.data.result.activityGlCostList;
          this.form.statusDoc = response.data.result.inOutCashbank.statusDoc;
          this.form.workflowStatus =
            response.data.result.inOutCashbank.workflowStatus;
          this.getCurDocStatus(this.form.id);
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
    confirmDialogDraft(id) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.isDialogVisible = true;
          this.mainDataGl = this.mainDataGl.filter(function (item) {
            return item["id"] != id;
          });
          this.form.totalAmount = 0;
          this.mainDataGl.forEach((element, index) => {
            this.form.totalAmount += parseFloat(
              this.mainDataGl[index].costAmount
            );
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
    saveData() {
      if (this.formAdd) {
        this.addData();
        this.formAdd = false;
      } else if (this.formCr) {
        this.crData();
        this.formCr = false;
      } else if (this.formSubmit) {
        this.submitData();
        this.formSubmit = false;
      } else if (this.formEdit) {
        this.editData();
        this.formEdit = false;
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
          `${themeConfig.app.api_cb}/partner-receive/add`,
          {
            scheme: "CB07",
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
              this.form.modePayment == "" || this.form.modePayment == null
                ? ""
                : this.form.modePayment,
            paymentReferenceNo: this.form.paymentReferenceNo,
            paymentReferenceDate:
              this.form.paymentReferenceDate == "" ||
              this.form.paymentReferenceDate == null
                ? ""
                : moment(this.form.paymentReferenceDate).format("YYYYMMDD"),
            extDocNo: this.form.extDocNo,
            extDocDate:
              this.form.extDocDate == "" || this.form.extDocDate == null
                ? ""
                : moment(this.form.extDocDate).format("YYYYMMDD"),
            refId: -99,
            refDocTypeId: -99,
            remark: this.form.remark,
            reason: this.form.reason,
            activityGlList: this.mainDataGl,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          // this.closeForm()
          this.form.reason = "";
          this.formEdit = true;
          this.detailData(response.data.result);
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
          `${themeConfig.app.api_cb}/partner-receive/edit`,
          {
            scheme: "CB07",
            id: parseInt(this.form.id),
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
          // this.closeForm()
          this.formEdit = true;
          this.form.reason = "";
          this.detailData(response.data.result);
          this.notif("success", "Success", response.data.meta.message);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.message);
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
          `${themeConfig.app.api_cb}/partner-receive/submit`,
          {
            scheme: "CB07",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.formEdit = true;
          this.form.reason = "";
          this.detailData(response.data.result);
          this.notif("success", "Success", response.data.meta.message);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.message);
        });
    },
    changesRequestData() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/partner-receive/changes-request`,
          {
            scheme: "CB07",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.formEdit = true;
          this.form.reason = "";
          this.detailData(response.data.result);
          this.notif("success", "Success", response.data.meta.message);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.message);
        });
    },
  },
};
</script>
