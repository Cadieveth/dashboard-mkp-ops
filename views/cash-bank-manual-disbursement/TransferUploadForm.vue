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
    <v-dialog v-model="isDialogVisible" persistent width="400">
      <v-card color="primary" dark>
        <v-card-text class="pt-3" align="center">
          {{ textLoader }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogTransferUpload" persistent width="1200">
      <v-card class="px-4 py-6">
        <v-card-title
          ><span @click="exampleFunc" class="text-xl font-weight-bold"
            >Transfer Confirmation Upload</span
          >
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeDialog()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" class="">
              <app-autocomplite-ou
                :form-value.sync="form.ouId"
                :readOnly="true"
                :clearable="false"
              ></app-autocomplite-ou>
            </v-col>
            <v-col cols="12" md="6" class="">
              <v-text-field
                :label="'Payment Amount'"
                v-model="form.paymentAmount"
                dense
                hide-details
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="">
              <v-text-field
                :label="'Partner Name'"
                v-model="form.partnerName"
                dense
                hide-details
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="">
              <v-text-field
                :label="'Beneficiary Account'"
                v-model="form.beneficiaryAccount"
                dense
                hide-details
                readonly
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" class="">
              <app-autocomplite-cashbank
                :labelText="'Source Bank'"
                :value-bank-ou.sync="form.cashbankId"
                :readOnly="true"
              ></app-autocomplite-cashbank>
            </v-col>

            <v-col cols="12" md="6" class="">
              <v-text-field
                :label="'Source Account No'"
                v-model="form.accountNo"
                dense
                placeholder=""
                hide-details
                readonly
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" class="">
              <v-text-field
                :label="docNo"
                v-model="form.docNo"
                dense
                placeholder="Insert Document No"
                hide-details
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="">
              <app-input-field-date
                :value-date.sync="form.docDate"
                :label-title="'Doc Date'"
                :read-only="true"
              >
              </app-input-field-date>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="">
              <v-text-field
                :label="'Transfer No'"
                v-model="form.transferNo"
                persistent-placeholder
                placeholder="Insert Transfer No"
                dense
                class="mb-0"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="">
              <app-input-field-date
                :value-date.sync="form.transferDate"
                :label-title="'Transfer Date'"
              >
              </app-input-field-date>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="">
              <app-input-field-date
                :value-date.sync="form.transferDateTime"
                :label-title="'Disbursement Date'"
              >
              </app-input-field-date>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="">
              <v-text-field
                :label="'Disbursement Time'"
                v-model="form.transferTime"
                persistent-placeholder
                placeholder="00:00:00"
                dense
                class="mb-0"
                v-mask="'##:##:##'"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="6" class="">
              <v-textarea
                v-model="form.remark"
                label="Remark"
                placeholder="Insert Remark"
                outlined
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="12" sm="6" class="py-0">
              <v-file-input
                v-model="fileTransfer"
                label="Payment Receipt"
                accept="image/*"
                placeholder="Upload Payment Receipt"
                @change="fileUpload"
                outlined
                @click:clear="handleClear"
              >
              </v-file-input>
            </v-col>
            <v-col cols="12" md="12" sm="6" class="py-0 d-flex justify-center">
              <v-img
                :max-width="filePreview === '' ? '0' : '600'"
                :max-height="filePreview === '' ? '0' : '400'"
                contain
                :src="filePreview"
              ></v-img>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-title class="">
          <v-spacer></v-spacer>
          <v-btn
            small
            :dark="form.receipt !== ''"
            :disabled="form.receipt === ''"
            color="primary"
            @click="submitTransfer()"
          >
            <v-icon dark left>{{
              icons.mdiCheckboxMarkedCircleOutline
            }}</v-icon>
            Submit
          </v-btn>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocompliteBank from "@core/components/app-autocomplite-ou/AppAutocompliteBank";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppInputFieldDate from "@/@core/components/app-input-field/AppInputFieldDate.vue";
import AppInputFieldDateTime from "@/@core/components/app-input-field/AppInputFieldDateTime.vue";
import AppAutocompliteCashbank from "@/@core/components/app-autocomplite-ou/AppAutocompliteCashbank.vue";
import { mdiClose, mdiCheckboxMarkedCircleOutline } from "@mdi/js";
import { dateFormat, isInArray, number_format } from "../../../constan";

import { mdiMagnify } from "@mdi/js";
import Form from "vform";
import moment from "moment";
import axios from "@axios";
import themeConfig from "@themeConfig";

import AppInputFieldDateNew from "@/@core/components/app-input-field/AppInputFieldDateNew.vue";

export default {
  name: "ChildFilterDokument",
  components: {
    AppAutocompliteOuCompany,
    AppAutocompliteBank,
    AppInputFieldDate,
    AppInputFieldDateTime,
    AppCardLoader,
    AppAutocompliteOu,
    AppAutocompliteCashbank,
    AppInputFieldDateNew,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      labelDocNo: themeConfig.labeling.docNo,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      docDate: themeConfig.labeling.docDate,
      textLoader: themeConfig.placeholder.remarkLoader,
      isDialogVisible: false,
      filePreview: "",
      disbursementId: -99,
      fileTransfer: null,
      dialogTransferUpload: false,
      menuStart: false,
      menuEnd: false,
      rules: {
        required: (value) => !!value || "Required.",
      },
      icons: {
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
      },
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      form: {},

      timeMask: "##:##:##",
    };
  },
  mounted() {
    this.form = {};
    this.$root.$on("formTransferUpload", async (item) => {
      this.form = {};
      this.fileTransfer = null;
      this.disbursementId = -99;
      this.form = item[0];
      this.form.beneficiaryAccount =
        item[0].beneficiaryAccountName + " - " + item[0].beneficiaryAccountNo;
      this.form.paymentAmount = this.number_format(item[1]);
      this.form.remark = "";
      this.filePreview = "";
      this.form.docDate = moment(item[0].docDate).format("YYYY-MM-DD");
      this.disbursementId = item[0].id;
      this.dialogTransferUpload = true;
    });
  },
  methods: {
    number_format(value) {
      return "Rp. " + number_format(value, 2, ",", ".");
    },
    async fileUpload() {
      this.filePreview = "";
      this.form.receipt = "";
      this.isDialogVisible = true;
      const file = this.fileTransfer;
      const formData = new FormData();
      formData.append("id", file);
      formData.append("file", file);

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const apiEndpoint = `${themeConfig.app.api_cb}/disbursement/transfer/upload`;
      axios
        .post(apiEndpoint, formData, config)
        .then((response) => {
          this.notif("success", "Success", response.data.meta.message);
          this.filePreview = response.data.result.link;
          this.form.receipt = response.data.result.receipt;
          this.isDialogVisible = false;
        })
        .catch((error) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", "Failed to Upload");
          this.filePreview = "";
          this.form.receipt = "";
        });
    },
    closeDialog() {
      this.dialogTransferUpload = false;
      this.$root.$emit("transferUploadReturn");
    },
    changeDateTime(e) {
      console.log(e);
      if (this.form.transferDateTime === undefined) {
        this.form.transferDateTime = e;
      } else {
        this.form.transferDateTime = this.form.transferDateTime;
      }
    },
    changeDisburseTime(e) {
      console.log(e);
      this.form.transferDateTime = e;
    },
    handleClear() {
      this.filePreview = "";
      this.form.receipt = "";
    },
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    submitTransfer() {
      if (
        this.form.transferNo === undefined ||
        this.form.transferDate === undefined ||
        this.form.transferDateTime === undefined ||
        this.form.transferTime === undefined
      ) {
        this.notif("error", "Gagal", "Please Fill The Form");
      } else {
        this.sendData();
      }
    },
    sendData() {
      var transferDateTime =
        this.form.transferDateTime + this.form.transferTime;
      const data = {
        id: this.disbursementId,
        transferNo: this.form.transferNo,
        transferDate: moment(this.form.transferDate).format("YYYYMMDD"),
        transferDatetime: moment(transferDateTime, "YYYY-MM-DDHH:mm:ss").format(
          "YYYYMMDDHHmmss"
        ),
        direction: "DOMESTIC_TRANSFER",
        receipt: this.form.receipt,
        remark: this.form.remark,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/disbursement/transfer/manual`,
          data,
          config
        )
        .then((response) => {
          this.notif("success", "Success", response.data.meta.message);
          this.dialogTransferUpload = false;
          this.$root.$emit("transferUploadReturn");
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
    exampleFunc() {
      console.log(this.form);
    },
  },
};
</script>
