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
    <v-dialog v-model="formData" persistent width="700">
      <v-card>
        <v-card-title class="font-weight-bold px-8">
          Reason Document
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="formData = false">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12" class="p-0">
                <v-textarea
                  v-model="form.reason"
                  label="Reason"
                  dense
                  outlined
                  hide-details="auto"
                  class="mb-0"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            small
            @click="formEdit ? editData() : addData()"
          >
            <v-icon dark left>{{
              icons.mdiCheckboxMarkedCircleOutline
            }}</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="formEditItem" persistent width="500">
      <v-card>
        <v-card-title class="font-weight-bold px-8">
          Edit Transfer Cash/Bank Item
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="formEditItem = false">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12" class="p-0">
                <vuetify-money
                  v-model="formItem.receiveAmount"
                  thousand-separator="."
                  decimal-separator=","
                  :label="'Receive Amount'"
                />
              </v-col>
              <v-col cols="12" md="12" class="p-0">
                <v-textarea
                  v-model="formItem.remark"
                  label="Remark"
                  dense
                  outlined
                  hide-details="auto"
                  class="mb-0"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark small @click="editDataItemDraft()">
            <v-icon dark left>{{
              icons.mdiCheckboxMarkedCircleOutline
            }}</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" :md="formHistori ? '9' : '12'" class="pb-0">
        <span class="form-header"> Input Transfer Cash/bank </span>
        <v-card>
          <v-card-actions>
            <v-chip
              small
              :class="`${
                form.workflowStatus == 'NONE'
                  ? 'secondary'
                  : form.workflowStatus == 'DRAFT'
                  ? 'warning'
                  : form.workflowStatus == 'INCOMING APPROVAL REQUEST'
                  ? 'primary'
                  : 'success'
              }--text`"
              class="v-chip-light-bg font-weight-semibold text-capitalize"
              :color="
                form.workflowStatus == 'NONE'
                  ? 'secondary'
                  : form.workflowStatus == 'DRAFT'
                  ? 'warning'
                  : form.workflowStatus == 'INCOMING APPROVAL REQUEST'
                  ? 'primary'
                  : 'success'
              "
            >
              {{
                form.workflowStatus == "RELEASED"
                  ? "APPROVED"
                  : form.workflowStatus
              }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn small dark color="secondary" @click="closeForm()">
              <v-icon dark left>
                {{ icons.mdiExitToApp }}
              </v-icon>
              Exit
            </v-btn>
            <v-btn
              color="primary"
              small
              dark
              @click="(formData = true), (type = 'Simpan')"
              v-show="
                (form.workflowStatus == 'DRAFT' && showSimpan) ||
                form.workflowStatus == 'NONE'
              "
            >
              <v-icon dark left>
                {{ icons.mdiCheckboxMarkedCircleOutline }}
              </v-icon>
              Save
            </v-btn>
            <v-btn
              color="success"
              small
              dark
              @click="(formData = true), (type = 'CR')"
              v-show="
                form.workflowStatus == 'INCOMING APPROVAL REQUEST' && showCR
              "
            >
              <v-icon dark left>
                {{ icons.mdiReplay }}
              </v-icon>
              Change Request
            </v-btn>
            <v-btn
              color="success"
              small
              dark
              @click="(formData = true), (type = 'Submit')"
              v-show="
                formEdit && form.workflowStatus != 'APPROVED' && showSubmit
              "
            >
              <v-icon dark left>
                {{ icons.mdiCheckAll }}
              </v-icon>
              Submit
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
            <v-btn
              class="ml-2"
              small
              dark
              color="success"
              @click="printPdf()"
              v-show="form.workflowStatus != 'NONE' ? true : false"
            >
              <v-icon dark left>
                {{ icons.mdiFilePdfOutline }}
              </v-icon>
              Print
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="pb-3">
                <app-autocomplite-ou-company
                  :form-value.sync="form.ouId"
                  :ou-type="'transferCashbankForm'"
                  :read-only="true"
                  :clearable="false"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6" class="pb-0"></v-col>
              <v-col cols="12" md="6" class="pb-3">
                <v-text-field
                  :label="docNo"
                  v-model="form.docNo"
                  dense
                  hide-details
                  placeholder="Insert Document No"
                  :readonly="formEdit"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-3">
                <app-input-field-date
                  :label-title="docDate"
                  :value-date.sync="form.docDate"
                  :read-only="formEdit"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-3">
                <app-autocomplite-cashbank-user
                  :label-text="sourceBank"
                  :value-bank-ou.sync="form.cashbankId"
                  :read-only="true"
                  :clearable="false"
                ></app-autocomplite-cashbank-user>
              </v-col>
              <v-col cols="12" md="6" class="pb-3">
                <app-autocomplite-status
                  :lable-tittle="'Mode Payment'"
                  :form-value.sync="form.modePayment"
                  :status-type="'TRANSFERMODE'"
                  :clearable="!formEdit"
                ></app-autocomplite-status>
              </v-col>
              <v-col cols="12" md="6" class="pb-3">
                <vuetify-money
                  v-model="form.totalAmount"
                  thousand-separator="."
                  decimal-separator=","
                  :read-only="true"
                  :label="'Total Amount'"
                />
              </v-col>
              <v-col cols="12" md="6" class="pb-0"></v-col>
              <v-col cols="12" md="6" class="pb-3">
                <v-textarea
                  label="Remark"
                  v-model="form.remark"
                  placeholder="Insert Remark"
                  dense
                  hide-details
                  rows="4"
                ></v-textarea>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-data-table
                  :headers="
                    form.workflowStatus == 'NONE'
                      ? headersItem
                      : headersItemDraft
                  "
                  :items="mainDataBankList"
                  fixed-header
                  hide-default-footer
                  dense
                >
                  <!-- format uang-->
                  <template #[`item.receiveAmount`]="{ item }">
                    Rp.{{ number_format(item.receiveAmount) }}
                  </template>

                  <template #[`item.transferAmount`]="{ item }">
                    Rp.{{ number_format(item.transferAmount) }}
                  </template>

                  <!-- penerima-->
                  <template #[`item.bank`]="{ item }">
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
                          @click="getDataItemDraft(item)"
                          v-show="form.workflowStatus == 'DRAFT'"
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
                          @click="removeDataItemDraft(item.id)"
                          v-show="form.workflowStatus == 'DRAFT'"
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
      <v-col cols="12" md="3" class="" v-show="formHistori">
        <span class="form-header">History Document</span>
        <v-card>
          <v-card-title class="" style="z-index: 50">
            <span>Approval Flow</span>
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
          <v-card-text class="" style="z-index: 1">
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
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocompliteCashbankUser from "@core/components/app-autocomplite-ou/AppAutocompliteCashbankUser";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocompliteStatus from "@core/components/app-autocomplite-ou/AppAutocompliteStatus";
import themeConfig from "@themeConfig";
import moment from "moment";
import Form from "vform";
import {
  dateFormat,
  generateUUID,
  isInArray,
  number_format,
} from "../../../constan";
import {
  mdiCalendar,
  mdiCheck,
  mdiCheckAll,
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiDelete,
  mdiExitToApp,
  mdiEyeOutline,
  mdiFileDocumentMultipleOutline,
  mdiFilePdfOutline,
  mdiPlus,
  mdiReplay,
} from "@mdi/js";
import axios from "@axios";

export default {
  name: "ChildForm",
  components: {
    AppAutocompliteOuCompany,
    AppAutocompliteCashbankUser,
    AppAutocompliteStatus,
    AppInputFieldDate,
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
      extDocNo: themeConfig.labeling.extDocNo,
      extDocDate: themeConfig.labeling.extDocDate,
      sourceBank: themeConfig.labeling.sourceBank,

      icons: {
        mdiCalendar,
        mdiDelete,
        mdiClose,
        mdiPlus,
        mdiCheckAll,
        mdiCheck,
        mdiReplay,
        mdiCheckboxMarkedCircleOutline,
        mdiEyeOutline,
        mdiClipboardEditOutline,
        mdiExitToApp,
        mdiFileDocumentMultipleOutline,
        mdiFilePdfOutline,
      },

      isDialogVisible: false,
      formTransferCashBank: false,
      formData: false,
      formEdit: false,
      formCashBankTransfer: false,
      formHistori: false,
      editItemList: false,
      formEditItem: false,
      showSubmit:
        isInArray(
          "submitTransferCashbank",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showCR:
        isInArray(
          "changeTransferCashbank",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showSimpan:
        isInArray(
          "editTransferCashbank",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      type: "",
      mainDataHistory: [],
      mainDataBankList: [],
      form: new Form({
        id: -99,
        ouId: -99,
        docNo: "",
        docDate: moment().format("YYYY-MM-DD"),
        cashbankId: -99,
        modePayment: "",
        remark: "",
        reason: "",
        workflowStatus: "",
        reqId: -99,
        totalAmount: 0,
      }),
      formItem: new Form({
        id: -99,
        receiveAmount: 0,
        remark: "",
      }),

      headersItem: [
        {
          text: "Beneficiary Bank",
          value: "bank",
          width: "350px",
        },
        {
          text: "Amount Receive",
          align: "right",
          value: "transferAmount",
          width: "150px",
        },
        {
          text: "Amount Out",
          align: "right",
          value: "transferAmount",
          width: "150px",
        },
        {
          text: "Remark",
          value: "remark",
        },
      ],
      headersItemDraft: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Beneficiary Bank",
          value: "bank",
          width: "350px",
        },
        {
          text: "Amount Receive",
          align: "right",
          value: "receiveAmount",
          width: "150px",
        },
        {
          text: "Amount Out",
          align: "right",
          value: "transferAmount",
          width: "150px",
        },
        {
          text: "Remark",
          value: "remark",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("formTransferCashBankForm", (msg) => {
      if (msg[1] == "addForm") {
        this.form.clear();
        this.form.reset();
        this.formEdit = false;
        this.form.workflowStatus = "NONE";
        this.form.ouId = msg[3].ouId;
        this.form.cashbankId = msg[3].cashbankFromId;
        this.mainDataBankList = msg[2];
        this.form.totalAmount = 0;
        this.mainDataBankList.forEach((element, index) => {
          this.mainDataBankList[index].cashbankToId =
            this.mainDataBankList[index].cashbankId;
          this.mainDataBankList[index].transferAmount =
            this.mainDataBankList[index].amount;
          this.mainDataBankList[index].receiveAmount =
            this.mainDataBankList[index].amount;
          this.form.totalAmount += this.mainDataBankList[index].amount;
        });
      } else if (msg[1] == "editForm") {
        this.form.clear();
        this.form.reset();
        this.formEdit = true;
        this.formHistori = false;
        this.form.id = msg[0];
        this.getDetailTransferCashbank(msg[0]);
      }
    });
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    number_format(value) {
      return number_format(value, 2, ",", ".");
    },
    closeForm() {
      if (
        this.mainDataBankList.length > 0 &&
        this.form.workflowStatus == "NONE"
      ) {
        this.$dialog
          .confirm("Document list item has not been saved, sure exit?.", {
            loader: true,
          })
          .then((dialog) => {
            dialog.close();
            this.mainDataBankList = [];
            this.$root.$emit("formTransferCashBank", this.formTransferCashBank);
            this.$root.$emit("formTransferCashBankReturn", "Cancel deposit!.");
          })
          .catch(() => {});
      } else {
        this.mainDataBankList = [];
        this.$root.$emit("formTransferCashBank", this.formTransferCashBank);
        this.$root.$emit(
          "formTransferCashBankReturn",
          "Tambah data berhasil!."
        );
      }
    },
    getCurDocStatus(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_awe}/approval/current-document/CB10/${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.form.workflowStatus = response.data.result.currentState;
            this.form.reqId = response.data.result.reqId;
          }
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
          this.notif("error", "Gagal", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    addData() {
      if (this.form.modePayment == null || this.form.modePayment == "") {
        this.notif("error", "Info", "Please select mode payment first!.");
        this.formData = false;
      } else {
        this.isDialogVisible = true;
        const config = {
          headers: {
            Authorization: `Bearer ${this.$session.get("accessToken")}`,
            "Access-Control-Allow-Origin": "*",
          },
        };
        axios
          .post(
            `${themeConfig.app.api_cb}/transfer/cashbank/add`,
            {
              scheme: "CB10",
              ouId: this.form.ouId,
              cashbankId: this.form.cashbankId,
              docNo: this.form.docNo,
              docDate: moment(this.form.docDate).format("YYYYMMDD"),
              modePayment: this.form.modePayment,
              reason: this.form.reason,
              remark: this.form.remark,
              transferCashbankItemList: this.mainDataBankList,
            },
            config
          )
          .then((response) => {
            this.formData = false;
            this.formEdit = true;
            this.isDialogVisible = false;
            this.form.clear();
            this.form.reset();
            this.notif("success", "Sukses", "Tambah data berhasil!.");
            this.getDetailTransferCashbank(response.data.result);
            // this.getCurDocStatus(response.data.result)
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
      }
    },
    editData() {
      if (this.formEdit == true && this.type == "Simpan") {
        //Edit data disbursement
        this.editTransferCashbank();
      } else if (this.formEdit == true && this.type == "Submit") {
        //Submit data disbursement
        this.submitTransferCashbank();
      } else if (this.formEdit == true && this.type == "CR") {
        //Change request data disbursement
        this.crTransferCashbank();
      }
    },
    getDetailTransferCashbank(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_cb}/transfer/cashbank/detail/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.form.id = response.data.result.transferCashbank.id;
          this.form.ouId = response.data.result.transferCashbank.ouId;
          this.form.docNo = response.data.result.transferCashbank.docNo;
          this.form.modePayment =
            response.data.result.transferCashbank.modePayment;
          this.form.cashbankId =
            response.data.result.transferCashbank.cashbankId;
          this.form.remark = response.data.result.transferCashbank.remark;
          this.form.workflowStatus =
            response.data.result.transferCashbank.workflowStatus;
          this.form.docDate = moment(
            response.data.result.transferCashbank.docDate
          ).format("YYYY-MM-DD");
          this.form.totalAmount =
            response.data.result.transferCashbank.transferAmount;
          if (response.data.result.transferCashbankItemList !== null) {
            this.form.totalAmount = 0;
            this.mainDataBankList =
              response.data.result.transferCashbankItemList;
            this.mainDataBankList.forEach((element, index) => {
              this.form.totalAmount +=
                this.mainDataBankList[index].receiveAmount;
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataBankList[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainDataBankList[index].logoImage =
                    this.mainDataBankList[index].bankCode;
                }
                // do something
              } catch (e) {
                this.mainDataBankList[index].logoImage = "NONE";
                // do something else
              }
            });
          } else {
            this.mainDataBankList = [];
          }
          this.getCurDocStatus(id);
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
    editTransferCashbank() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/transfer/cashbank/edit`,
          {
            scheme: "CB10",
            id: this.form.id,
            extDocNo: this.form.extDocNo,
            extDocDate:
              this.form.extDocDate == ""
                ? ""
                : moment(this.form.extDocDate).format("YYYYMMDD"),
            modePayment: this.form.modePayment,
            remark: this.form.remark,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.isDialogVisible = false;
          this.form.clear();
          this.form.reset();
          this.notif("success", "Sukses", "Edit data berhasil!.");
          this.getDetailTransferCashbank(response.data.result);
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
    submitTransferCashbank() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/transfer/cashbank/submit`,
          {
            scheme: "CB10",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.isDialogVisible = false;
          this.form.clear();
          this.form.reset();
          this.notif("success", "Sukses", "Submit data berhasil!.");
          this.getDetailTransferCashbank(response.data.result);
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
    crTransferCashbank() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/transfer/cashbank/changes-request
`,
          {
            scheme: "CB10",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.isDialogVisible = false;
          this.form.clear();
          this.form.reset();
          this.notif("success", "Sukses", "Submit data berhasil!.");
          this.getDetailTransferCashbank(response.data.result);
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
    getDetailTransferCashbankReceive(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_cb}/transfer/cashbank/receive/list//${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainDataBankList = response.data.result;
            this.mainDataBankList.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataBankList[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainDataBankList[index].logoImage =
                    this.mainDataBankList[index].bankCode;
                }
                // do something
              } catch (e) {
                this.mainDataBankList[index].logoImage = "NONE";
                // do something else
              }
            });
          } else {
            this.mainDataBankList = [];
          }
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
    getDataItemDraft(data) {
      this.formItem.reset();
      this.formItem.clear();
      this.formItem.fill(data);
      this.formEditItem = true;
    },
    editDataItemDraft() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/transfer/cashbank/edit/receive`,
          {
            id: this.formItem.id,
            receiveAmount: this.formItem.receiveAmount,
            remark: this.formItem.remark,
          },
          config
        )
        .then((response) => {
          this.formEditItem = false;
          this.isDialogVisible = false;
          this.formItem.clear();
          this.formItem.reset();
          this.notif("success", "Sukses", "Edit data berhasil!.");
          this.getDetailTransferCashbankReceive(this.form.id);
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
    removeDataItemDraft(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_cb}/transfer/cashbank/remove/receive/${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.notif("success", "Sukses", "Delete data berhasil!.");
          this.getDetailTransferCashbankReceive(this.form.id);
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
    printPdf() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      let formData = new FormData();
      formData.append("transferCashbankId", this.form.id);
      formData.append("sessionId", generateUUID());
      formData.append(
        "username",
        JSON.parse(this.$session.get("userData")).username
      );
      axios
        .post(
          `${themeConfig.app.api_rp}/cashbank/PrintTransferCashbank`,
          formData,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          window.location.replace(
            `${themeConfig.app.link_export}?filename=${response.data.result.filename}`
          );
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
  },
};
</script>
