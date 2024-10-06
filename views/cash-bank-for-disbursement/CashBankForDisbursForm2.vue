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
      <v-col cols="12" :md="formHistori ? '9' : '12'">
        <v-form>
          <v-card>
            <v-card-title class="pt-0">
              <span>Pelimpahan</span>
              <v-spacer></v-spacer>
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
              <v-btn
                color="secondary"
                text
                small
                fab
                @click="showHistory()"
                v-show="formEdit && !formHistori"
              >
                <v-icon dark>
                  {{ icons.mdiEyeOutline }}
                </v-icon>
              </v-btn>
              <v-btn color="secondary" text small fab @click="closeForm()">
                <v-icon dark>
                  {{ icons.mdiClose }}
                </v-icon>
              </v-btn>
              <v-dialog v-model="formData" persistent width="700">
                <v-card>
                  <v-card-title class="headline">
                    Reason Dokumen
                    <v-spacer></v-spacer>
                    <v-btn
                      color="secondary"
                      icon
                      small
                      @click="formData = false"
                    >
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
                      outlined
                      small
                      @click="formEdit ? editData() : addData()"
                    >
                      <v-icon dark left>
                        {{ icons.mdiCheckboxMarkedCircleOutline }}
                      </v-icon>
                      Simpan
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <app-autocomplite-ou
                    :form-value.sync="form.ouId"
                    :readOnly="formEdit"
                  ></app-autocomplite-ou>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                  <v-autocomplete
                    label="Kas Bank"
                    v-model="form.cashbankId"
                    :items="cashBankList"
                    item-text="cashbankName"
                    item-value="cashbankId"
                    outlined
                    dense
                    hide-details
                    :readonly="formEdit"
                    clearable
                  >
                    <template #selection="data">
                      {{ data.item.cashbankCode }} -
                      {{ data.item.cashbankName }}
                    </template>
                    <template #item="data">
                      <template>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ data.item.cashbankCode }} -
                            {{ data.item.cashbankName }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="12">
                  <v-row>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-text-field
                        label="Nomor Dokumen"
                        v-model="form.docNo"
                        outlined
                        dense
                        hide-details
                        :readonly="formEdit"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-menu
                        v-model="docDate"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="form.docDate"
                            label="Tanggal Dokumen"
                            :append-icon="icons.mdiCalendar"
                            readonly
                            dense
                            outlined
                            hide-details
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="form.docDate"
                          color="primary"
                          :readonly="formEdit"
                          @input="docDate = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-text-field
                        label="Ext. Nomor Dokumen"
                        v-model="form.extDocNo"
                        outlined
                        dense
                        hide-details
                        :readonly="
                          form.statusDoc != 'NONE' && form.statusDoc != 'DRAFT'
                        "
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-menu
                        v-model="extDocDate"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="form.extDocDate"
                            label="Ext. Tanggal Dokumen"
                            :append-icon="icons.mdiCalendar"
                            readonly
                            dense
                            outlined
                            hide-details
                            v-bind="attrs"
                            v-on="on"
                            clearable
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="form.extDocDate"
                          color="primary"
                          @input="extDocDate = false"
                          :readonly="
                            form.statusDoc != 'NONE' &&
                            form.statusDoc != 'DRAFT'
                          "
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-select
                        label="Mitra"
                        v-model="form.partnerId"
                        :items="partnerList"
                        item-text="partnerName"
                        item-value="id"
                        @change="getPartnerBank(form.partnerId)"
                        outlined
                        dense
                        hide-details
                        :readonly="formEdit"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-row>
                        <v-col cols="12" md="12">
                          <v-autocomplete
                            label="Bank Mitra"
                            v-model="form.bankCodeId"
                            :items="partnerBankList"
                            item-value="id"
                            @change="getAccountInfo(form.bankCodeId)"
                            outlined
                            dense
                            hide-details
                            :readonly="formEdit"
                            :append-outer-icon="icons.mdiCashCheck"
                            @click:append-outer="cekFeeFlip()"
                          >
                            <template #selection="data">
                              <v-avatar left color="#e6e6e6" size="30">
                                <v-img
                                  :src="
                                    require(`@/assets/images/logos/bank_logo/${data.item.bankCode}_logo.png`)
                                  "
                                ></v-img>
                              </v-avatar>
                              <span class="font-weight-semibold">{{
                                "&nbsp;" + data.item.accountNo + "&nbsp;"
                              }}</span>
                              <span>{{ " a/n " + data.item.accountName }}</span>
                            </template>
                            <template #item="data">
                              <template>
                                <v-list-item-content>
                                  <v-list-item-title>
                                    <v-avatar left color="#e6e6e6" size="30">
                                      <v-img
                                        :src="
                                          require(`@/assets/images/logos/bank_logo/${data.item.bankCode}_logo.png`)
                                        "
                                      ></v-img>
                                    </v-avatar>
                                    <span class="font-weight-semibold">
                                      {{ data.item.accountNo }}</span
                                    >
                                    a/n
                                    {{ data.item.accountName }}
                                  </v-list-item-title>
                                </v-list-item-content>
                              </template>
                            </template>
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-text-field
                        label="Nomor Akun"
                        v-model="form.accountNo"
                        outlined
                        dense
                        hide-details
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-text-field
                        label="Nama Akun"
                        v-model="form.accountName"
                        outlined
                        dense
                        hide-details
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="12">
                  <v-row>
                    <v-col cols="12" md="6" class="pb-0" v-show="!formEdit">
                      <vuetify-money
                        dense
                        outlined
                        label="Nominal Pelimpahan"
                        v-model="form.transferAmount"
                        :readonly="formEdit"
                        v-bind:disabled="disabled"
                        v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                        v-bind:options="options"
                        v-bind:properties="properties"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0" v-show="showFee">
                      <v-text-field
                        label="Admin Fee Bank"
                        v-model="form.transferFeeAmount"
                        outlined
                        dense
                        hide-details
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col col="12" md="12" v-show="formEdit">
                      <v-card outlined>
                        <v-card-title
                          ><h6>Informasi Pelimpahan</h6></v-card-title
                        >
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" md="4">
                              <v-text-field
                                label="Nominal Pelimpahan"
                                v-model="form.trAmount"
                                outlined
                                dense
                                hide-details
                                readonly
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field
                                label="Admin Fee"
                                v-model="form.feeAmount"
                                outlined
                                dense
                                hide-details
                                readonly
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field
                                label="Nett Transfer Mitra"
                                v-model="form.nettAmount"
                                outlined
                                dense
                                hide-details
                                readonly
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col col="12" md="12" v-show="formEdit">
                      <v-card outlined>
                        <v-card-title><h6>Informasi Bank</h6></v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" md="4">
                              <v-text-field
                                label="Admin Fee Bank"
                                v-model="form.feeBankAmount"
                                outlined
                                dense
                                hide-details
                                readonly
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field
                                label="Total Transfer"
                                v-model="form.payAmount"
                                outlined
                                dense
                                hide-details
                                readonly
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        label="Remark"
                        v-model="form.remark"
                        outlined
                        dense
                        hide-details
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="12" class="pb-0">
                  <v-data-table
                    :headers="headersInvoiceList"
                    :items="invoiceList"
                    :footer-props="{
                      'items-per-page-options': [25, 50, 100],
                    }"
                    disable-pagination
                    fixed-header
                    max-height="500px"
                    dense
                  >
                    <!-- format tanggal-->
                    <template #[`item.refDocDate`]="{ item }">
                      {{ dateFormat(item.refDocDate) }}
                    </template>
                    <template #[`item.refDueDate`]="{ item }">
                      {{ dateFormat(item.refDueDate) }}
                    </template>

                    <!-- format uang-->
                    <template #[`item.realizationAmount`]="{ item }">
                      Rp.{{ number_format(item.realizationAmount) }}
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer
              ><v-btn
                color="primary"
                outlined
                small
                @click="addDataReason('Simpan')"
                v-show="
                  form.statusDoc == 'NONE' ||
                  (form.statusDoc == 'DRAFT' && showSimpan)
                "
              >
                <v-icon dark left>
                  {{ icons.mdiCheckboxMarkedCircleOutline }}
                </v-icon>
                Simpan
              </v-btn>
              <v-btn
                color="info"
                outlined
                small
                @click="addDataReason('CR')"
                v-show="
                  formEdit &&
                  form.statusDoc == 'INCOMING APPROVAL REQUEST' &&
                  showCR
                "
              >
                <v-icon dark left>
                  {{ icons.mdiReplay }}
                </v-icon>
                Change Request
              </v-btn>
              <v-btn
                color="success"
                outlined
                small
                @click="addDataReason('Submit')"
                v-show="formEdit && form.statusDoc != 'APPROVED' && showSubmit"
              >
                <v-icon dark left>
                  {{ icons.mdiCheckAll }}
                </v-icon>
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
      <v-col cols="12" md="3" v-show="formHistori">
        <span class="form-header">Document History</span>
        <v-card>
          <v-card-title class="pt-0">
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
import {
  mdiAccountMultipleCheckOutline,
  mdiAccountMultipleRemoveOutline,
  mdiCalendar,
  mdiCashCheck,
  mdiCheck,
  mdiCheckAll,
  mdiCheckboxMarkedCircleOutline,
  mdiClose,
  mdiEyeOutline,
  mdiReplay,
} from "@mdi/js";
import Form from "vform";
import axios from "@axios";
import themeConfig from "@themeConfig";
import moment from "moment";
import { dateFormat, isInArray, number_format } from "../../../constan";
import { required } from "@core/utils/validation";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";

export default {
  name: "Child",
  components: {
    AppAutocompliteOu,
    AppCardLoader,
  },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      disabled: false,
      outlined: true,
      clearable: true,
      valueWhenIsEmpty: "",
      options: {
        locale: "pt-BR",
        prefix: "",
        suffix: "",
        length: 20,
        precision: 0,
      },
      properties: {
        hint: "my hint",
      },

      isDialogVisible: false,
      showFee: false,
      showCekFee: false,
      docDate: false,
      extDocDate: false,
      formData: false,
      formEdit: false,
      formHistori: false,
      type: "",
      formCashBankDisburs: false,
      showSubmit:
        isInArray("submitDisbursement", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showCR:
        isInArray(
          "changesRequestDisbursement",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showSimpan:
        isInArray("editDisbursement", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      ouList: [],
      cashBankList: [],
      partnerList: [],
      partnerBankList: [],
      mainDataHistory: [],
      invoiceList: [],
      icons: {
        mdiClose,
        mdiCashCheck,
        mdiCalendar,
        mdiEyeOutline,
        mdiCheck,
        mdiCheckAll,
        mdiAccountMultipleCheckOutline,
        mdiAccountMultipleRemoveOutline,
        mdiCheckboxMarkedCircleOutline,
        mdiReplay,
      },
      validators: {
        required,
      },
      form: new Form({
        id: "",
        docNo: "",
        docDate: moment().format("YYYY-MM-DD"),
        extDocNo: "",
        extDocDate: "",
        ouId: -99,
        partnerId: -99,
        bankCodeId: -99,
        bankCode: "",
        accountNo: "",
        accountName: "",
        refDocTypeId: -99,
        refId: -99,
        remark: "",
        reason: "",
        cashbankId: -99,
        transferAmount: 0,
        transferFeeAmount: 0,
        grandAmount: 0,
        statusDoc: "",
        reqId: "",
        trAmount: "",
        feeAmount: "",
        nettAmount: "",
        feeBankAmount: "",
        payAmount: "",
      }),
      headersInvoiceList: [
        {
          text: "Doc No",
          value: "refDocNo",
          width: "250px",
        },
        {
          text: "Doc Date",
          value: "refDocDate",
          width: "150px",
        },
        {
          text: "Due Date",
          value: "refDueDate",
          width: "150px",
        },
        {
          text: "Amount",
          value: "realizationAmount",
          align: "right",
          width: "200px",
        },
        {
          text: "Remark",
          value: "remark",
        },
      ],
    };
  },
  async mounted() {
    this.$root.$on("appAutocompliteOu", (msg) => {
      this.getChild(msg);
    });
    await this.$root.$on("formCashBankDisbursForm", (msg) => {
      this.form.reset();
      this.form.clear();
      if (msg[1] == "editForm") {
        this.formHistori = false;
        this.getCurDocStatus(msg[0].id);
        this.getDetailDisbursement(msg[0].id);
        this.formEdit = true;
      } else if (msg[1] == "editFormDokumen") {
        this.formHistori = false;
        this.getCurDocStatus(msg[0].docId);
        this.getDetailDisbursement(msg[0].docId);
        this.formEdit = true;
      } else {
        this.formEdit = false;
        this.formHistori = false;
        this.getOuIdDefautl(msg[0]);
        this.form.statusDoc = "NONE";
        this.invoiceList = msg[2];
        this.form.transferAmount = msg[3];
      }
    });
  },
  methods: {
    async getOuIdDefautl(data) {
      this.form.ouId = data.ouId;
      this.form.partnerId = data.partnerId;
      await this.getCashBank(data.ouId);
      await this.getPartner(data.ouId);
      await this.getPartnerBank(data.partnerId);
    },
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
      return number_format(value, 0, ",", ".");
    },
    closeForm() {
      this.cashBankList = [];
      this.partnerList = [];
      this.partnerBankList = [];
      this.$root.$emit("formCashBankDisburs", this.formCashBankDisburs);
      this.$root.$emit("formCashBankDisbursReturn", "Tambah data berhasil!.");
    },
    addDataReason(type) {
      if (type !== "CR") {
        this.form.reason = "";
      }
      this.formData = true;
      this.type = type;
    },
    getChild() {
      this.getCashBank(this.form.ouId);
      this.getPartner(this.form.ouId);
    },
    async getCashBank(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      try {
        let response = await axios.get(
          `${themeConfig.app.api_master}/cashbank-ou/list-bank-disbursement/${id}`,
          config
        );
        if (response.data.result !== null)
          return (this.cashBankList = response.data.result);
        this.cashBankList = [];
      } catch (e) {
        if (!e.response) {
          this.notif("error", "Failed", e);
        } else {
          this.notif("error", "Failed", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        }
      }
    },
    async getPartner(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      try {
        let response = await axios.post(
          `${themeConfig.app.api_master}/partner/list`,
          {
            ctgrPartnerId: -99,
            ouId: parseInt(id),
            limit: 1000,
            offset: 0,
          },
          config
        );
        if (response.data.result !== null)
          return (this.partnerList = response.data.result);
        this.partnerList = [];
      } catch (e) {
        if (!e.response) {
          this.notif("error", "Failed", e);
        } else {
          this.notif("error", "Failed", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        }
      }
    },
    cekFeeFlip() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      if (
        this.form.accountNo != "" &&
        this.form.bankCode != "" &&
        this.formEdit == false
      ) {
        this.isDialogVisible = true;
        axios
          .get(
            `${themeConfig.app.api_master}/cashbank/flip-bank-account-inquiry?accountNo=${this.form.accountNo}&bankCode=${this.form.bankCode}`,
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.showFee = true;
            this.form.transferFeeAmount = number_format(
              response.data.result.fee,
              2,
              ",",
              "."
            );
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
      }
    },
    async getPartnerBank(id) {
      this.showCekFee = false;
      this.showFee = false;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      try {
        let response = await axios.get(
          `${themeConfig.app.api_master}/partner/partner-bank-list/${id}`,
          config
        );
        if (response.data.result !== null)
          return (this.partnerBankList = response.data.result);
        this.partnerBankList = [];
      } catch (e) {
        if (!e.response) {
          this.notif("error", "Failed", e);
        } else {
          this.notif("error", "Failed", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        }
      }
    },
    getAccountInfo(bankCode) {
      for (var i = 0; i < this.partnerBankList.length; i++) {
        var obj = this.partnerBankList[i];
        if (obj.id == bankCode) {
          this.showCekFee = true;
          this.showFee = false;
          this.form.bankCode = obj.bankCode;
          this.form.accountNo = obj.accountNo;
          this.form.accountName = obj.accountName;
          break;
        }
      }
    },
    async getAccountId(bankCode, account, name) {
      for (var i = 0; i < this.partnerBankList.length; i++) {
        var obj = this.partnerBankList[i];
        if (
          obj.bankCode == bankCode &&
          obj.accountNo == account &&
          obj.accountName == name
        ) {
          this.form.bankCodeId = obj.id;
          break;
        }
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
          `${themeConfig.app.api_awe}/approval/current-document/CB01/${id}`,
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
    async getDetailDisbursement(id) {
      this.isDialogVisible = true;
      this.form.id = id;

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      try {
        let response = await axios.get(
          `${themeConfig.app.api_cb}/disbursement/detail/${id}`,
          config
        );
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
        this.form.cashbankId =
          response.data.result.inOutCashbankDisbursement.cashbankId;
        this.form.bankCode =
          response.data.result.inOutCashbankDisbursement.bankCode;
        this.form.accountNo =
          response.data.result.inOutCashbankDisbursement.accountNo;
        this.form.accountName =
          response.data.result.inOutCashbankDisbursement.accountName;
        this.form.transferAmount = number_format(
          response.data.result.inOutCashbankDisbursement.transferAmount,
          2,
          ",",
          "."
        );
        this.form.transferFeeAmount = number_format(
          response.data.result.inOutCashbankDisbursement.transferFeeAmount,
          2,
          ",",
          "."
        );
        this.form.grandAmount = number_format(
          response.data.result.inOutCashbankDisbursement.transferAmount -
            response.data.result.inOutCashbankDisbursement.transferFeeAmount,
          2,
          ",",
          "."
        );
        this.form.remark = response.data.result.inOutCashbank.remark;
        this.form.trAmount = number_format(
          response.data.result.inOutCashbankDisbursement.transferAmount,
          2,
          ",",
          "."
        );
        this.form.feeAmount = number_format(
          response.data.result.inOutCashbank.incomeAmount +
            response.data.result.inOutCashbankDisbursement
              .transferFeeBankAmount,
          2,
          ",",
          "."
        );
        this.form.nettAmount = number_format(
          response.data.result.inOutCashbankDisbursement.nettTransferAmount,
          2,
          ",",
          "."
        );
        this.form.feeBankAmount = number_format(
          response.data.result.inOutCashbankDisbursement.transferFeeBankAmount,
          2,
          ",",
          "."
        );
        this.form.payAmount = number_format(
          response.data.result.inOutCashbank.paymentAmount,
          2,
          ",",
          "."
        );

        await this.getCashBank(response.data.result.ou.id);
        await this.getPartner(response.data.result.ou.id);
        await this.getPartnerBank(response.data.result.partner.id);
        await this.getAccountId(
          this.form.bankCode,
          this.form.accountNo,
          this.form.accountName
        );
        this.isDialogVisible = false;
      } catch (e) {
        this.isDialogVisible = false;
        if (!e.response) {
          this.notif("error", "Failed", e);
        } else {
          this.notif("error", "Failed", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        }
      }
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
          `${themeConfig.app.api_cb}/disbursement/add`,
          {
            docNo: this.form.docNo,
            docDate: moment(this.form.docDate).format("YYYYMMDD"),
            extDocNo: this.form.extDocNo,
            extDocDate:
              this.form.extDocDate == ""
                ? ""
                : moment(this.form.extDocDate).format("YYYYMMDD"),
            ouId: parseInt(this.form.ouId),
            partnerId: parseInt(this.form.partnerId),
            bankCode: this.form.bankCode,
            accountNo: this.form.accountNo,
            accountName: this.form.accountName,
            refDocTypeId: 301,
            refId: -99,
            remark: this.form.remark,
            reason: this.form.reason,
            cashbankId: parseInt(this.form.cashbankId),
            transferAmount: parseFloat(this.form.transferAmount),
            invoiceApList: this.invoiceList,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.formEdit = true;
          this.isDialogVisible = false;
          this.notif("success", "Sukses", "Tambah data berhasil!.");
          this.getCurDocStatus(response.data.result);
          this.getDetailDisbursement(response.data.result);
          // this.closeForm()
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
    editData() {
      if (this.formEdit == true && this.type == "Simpan") {
        //Edit data disbursement
        this.editDisbursement();
      } else if (this.formEdit == true && this.type == "Submit") {
        //Submit data disbursement
        this.submitDisbursement();
      } else if (this.formEdit == true && this.type == "CR") {
        //Change request data disbursement
        this.changeRequestDisbursement();
      }
    },
    editDisbursement() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/disbursement/edit`,
          {
            id: this.form.id,
            extDocNo: this.form.extDocNo,
            extDocDate:
              this.form.extDocDate == ""
                ? ""
                : moment(this.form.extDocDate).format("YYYYMMDD"),
            remark: this.form.remark,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.isDialogVisible = false;
          this.notif("success", "Success", response.data.meta.message);
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
    submitDisbursement() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/disbursement/submit`,
          {
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.isDialogVisible = false;
          this.notif("success", "Success", response.data.meta.message);
          this.getCurDocStatus(response.data.result);
          this.getDetailDisbursement(response.data.result);
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
    changeRequestDisbursement() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/disbursement/changes-request`,
          {
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.isDialogVisible = false;
          this.notif("success", "Success", response.data.meta.message);
          this.closeForm();
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
  },
};
</script>
