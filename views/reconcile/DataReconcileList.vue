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
    <!--  Form add mutasi bank-->
    <v-dialog v-model="formData" persistent width="800">
      <v-card>
        <v-card-title class="mb-4">
          Input Bank Statement
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="12" class="pb-0">
              <app-autocomplite-ou-company
                :form-value.sync="form.ouId"
                :ou-type="'bankStatementForm'"
              ></app-autocomplite-ou-company>
            </v-col>
            <v-col cols="12" md="12" class="pb-0 mt-2">
              <app-autocomplite-cashbank-ou
                :value-bank-ou.sync="form.cashbankId"
                :label-text="cashBank"
                :cashbank-type="'bankStatementForm'"
              ></app-autocomplite-cashbank-ou>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 mt-2">
              <v-text-field
                dense
                :label="docNo"
                v-model="form.docNo"
                persistent-placeholder
                placeholder="Insert Document No"
                class="pb-0"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 mt-2">
              <app-input-field-date
                :value-date.sync="form.docDate"
                :label-title="docDate"
              ></app-input-field-date>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 mt-2">
              <app-input-field-date
                :value-date.sync="form.mutationDateFrom"
                :label-title="'Mutation From '"
              ></app-input-field-date>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 mt-2">
              <app-input-field-date
                :value-date.sync="form.mutationDateTo"
                :label-title="'Mutation To '"
              ></app-input-field-date>
            </v-col>
            <v-col cols="12" md="12" class="pb-0 mt-2">
              <vuetify-money
                dense
                label="Amount"
                v-model="form.creditAmount"
                v-bind:disabled="disabled"
                v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                v-bind:options="options"
                v-bind:properties="properties"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="12" class="pb-0 mt-2">
              <v-textarea
                outlined
                dense
                label="Remark"
                v-model="form.remark"
                hide-details
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="mt-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" dark small @click="addData()">
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
        <v-card>
          <v-card-title><span>Bank Statement</span></v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3" sm="6" class="pb-0">
                <app-autocomplite-ou-company
                  :form-value.sync="filterForm.ouId"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0">
                <app-input-field-date
                  :label-title="startDate"
                  :value-date.sync="filterForm.dateFrom"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0">
                <app-input-field-date
                  :label-title="endDate"
                  :value-date.sync="filterForm.dateTo"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0">
                <app-autocomplite-status
                  :form-value.sync="filterForm.status"
                  :status-type="'STATUSDOC'"
                ></app-autocomplite-status>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="12" class="pb-0 mt-2">
                    <v-text-field
                      dense
                      persistent-placeholder
                      placeholder="Insert Keyword"
                      label="Keyword"
                      v-model="filterForm.keyword"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions id="target-table" class="mt-4">
            <v-btn color="primary" small dark @click="confirmFilter()">
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
          </v-card-actions>
          <v-card-title>
            <span>List</span>
            <v-spacer></v-spacer>
            <v-btn
              v-show="showCreate"
              color="primary"
              dark
              small
              @click="addForm()"
            >
              <v-icon dark left>
                {{ icons.mdiPlus }}
              </v-icon>
              Create
            </v-btn>
          </v-card-title>
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
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="mainData"
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

              <!-- format tanggal-->
              <template #[`item.mutation`]="{ item }">
                {{ dateFormat(item.mutationDateFrom) }} s/d
                {{ dateFormat(item.mutationDateTo) }}
              </template>

              <!-- format uang-->
              <template #[`item.creditAmount`]="{ item }">
                Rp.{{ number_format(item.creditAmount) }}
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

              <template #[`item.bank`]="{ item }">
                <app-bank-info-table
                  :bankCode="item.bankCode"
                  :accountName="item.accountName"
                  :accountNo="item.accountNo"
                ></app-bank-info-table>
              </template>

              <template #[`item.statusDoc`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.statusDoc == 'D'
                      ? 'info'
                      : item.statusDoc == 'I'
                      ? 'warning'
                      : item.statusDoc == 'R'
                      ? 'primary'
                      : 'success'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="
                    item.statusDoc == 'D'
                      ? 'info'
                      : item.statusDoc == 'I'
                      ? 'warning'
                      : item.statusDoc == 'R'
                      ? 'primary'
                      : 'success'
                  "
                >
                  {{ item.workflowStatus }}
                </v-chip>
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
                      @click="voidData(item.id)"
                      v-show="item.statusDoc == 'D' && showVoid"
                    >
                      <v-icon>
                        {{ icons.mdiCloseCircleOutline }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Void</span>
                </v-tooltip>
              </template>
            </v-data-table>
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="handlePageChange"
              total-visible="5"
              v-scroll-to="'#target-table'"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppAutocompliteOuBuMain from "@core/components/app-autocomplite-ou/AppAutocompliteOuBuMain";
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocompliteCashbankOu from "@core/components/app-autocomplite-ou/AppAutocompliteCashbankOu";
import AppAutocompliteStatus from "@core/components/app-autocomplite-ou/AppAutocompliteStatus";
import AppBankInfoTable from "@/@core/components/app-bank-info/AppBankInfoTable";
import moment from "moment";
import Form from "vform";
import {
  mdiCheckboxMarkedCircleOutline,
  mdiClose,
  mdiCloseCircleOutline,
  mdiMagnify,
  mdiPlus,
} from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";
import { dateFormat, number_format, isInArray } from "../../../constan";
import router from "@/router";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "Parent",
  components: {
    AppAutocompliteOu,
    AppAutocompliteOuBuMain,
    AppAutocompliteOuCompany,
    AppInputFieldDate,
    AppAutocompliteCashbankOu,
    AppAutocompliteStatus,
    AppCardLoader,
    AppBankInfoTable,
  },
  data() {
    return {
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,
      cashBank: themeConfig.labeling.cashBank,

      // role
      showVoid:
        isInArray("voidBankStatement", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showCreate:
        isInArray("addBankStatement", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",

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
        precision: 2,
      },
      properties: {
        hint: "my hint",
      },

      isDialogVisible: false,
      currentPage: 1,
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      formData: false,
      statusList: [
        {
          value: "",
          text: "All",
        },
        {
          value: "V",
          text: "Void",
        },
        {
          value: "R",
          text: "Released",
        },
      ],
      filterForm: new Form({
        ouId: -99,
        keyword: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        status: "",
      }),
      form: new Form({
        id: "",
        ouId: -99,
        docNo: "",
        docDate: moment().format("YYYY-MM-DD"),
        cashbankId: -99,
        mutationDateFrom: moment().format("YYYY-MM-DD"),
        mutationDateTo: moment().format("YYYY-MM-DD"),
        creditAmount: 0,
        remark: "",
      }),
      icons: {
        mdiMagnify,
        mdiPlus,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
        mdiCloseCircleOutline,
      },
      headers: [
        {
          text: "Action",
          value: "actions",
          sortable: false,
          width: "50px",
        },
        {
          text: "Nomor Dokumen",
          value: "docNo",
          width: "150px",
        },
        {
          text: "Tanggal Dokumen",
          value: "docDate",
          width: "175px",
        },
        {
          text: "Unit Bisnis",
          value: "ou",
          width: "200px",
        },
        {
          text: "Bank Account",
          value: "bank",
          width: "200px",
        },
        {
          text: "Amount",
          value: "creditAmount",
          width: "150px",
          align: "right",
        },
        {
          text: "Mutation Date",
          value: "mutation",
          width: "300px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
        {
          text: "Status",
          value: "statusDoc",
          width: "100px",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("appAutocompliteOuCompanyBankStatementForm", (msg) => {
      this.$root.$emit("appAutocompliteOuCashbankBankStatementForm", msg);
      this.form.cashbankId = -99;
    });
    this.refreshData();
  },
  methods: {
    confirmFilter() {
      this.currentPage = 1;
      this.ofset = 0;
      this.refreshData();
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
      return number_format(value, 2, ",", ".");
    },
    getItemPerPage() {
      this.refreshData();
    },
    handlePageChange() {
      if (this.currentPage == 1) {
        this.ofset = 0;
      } else {
        this.ofset = (this.currentPage - 1) * this.itemPerPage;
      }
      this.refreshData();
    },
    closeForm() {
      this.formData = false;
      this.form.reset();
      this.form.clear();
      // this.$refs.form.resetValidation()
    },
    addForm() {
      this.form.reset();
      this.form.clear();
      this.formData = true;
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
          `${themeConfig.app.api_cb}/bank-reconcile/add`,
          {
            ouId: this.form.ouId != "" ? this.form.ouId : -99,
            docNo: this.form.docNo,
            docDate:
              this.form.docDate != ""
                ? moment(this.form.docDate).format("YYYYMMDD")
                : "",
            cashbankId: this.form.cashbankId != "" ? this.form.cashbankId : -99,
            mutationDateFrom:
              this.form.mutationDateFrom != ""
                ? moment(this.form.mutationDateFrom).format("YYYYMMDD")
                : "",
            mutationDateTo:
              this.form.mutationDateTo != ""
                ? moment(this.form.mutationDateTo).format("YYYYMMDD")
                : "",
            creditAmount: parseFloat(this.form.creditAmount),
            remark: this.form.remark,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.closeForm();
          this.refreshData();
          this.notif("success", "Success", response.data.meta.message);
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
    },
    voidData(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_cb}/bank-reconcile/void/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.refreshData();
          this.notif("success", "Success", response.data.meta.message);
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
    },
    getCountData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      const dateFrom = moment(this.filterForm.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.dateTo).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_cb}/bank-reconcile/count?ouId=${ouId}&keyword=${this.filterForm.keyword}&status=${this.filterForm.status}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
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
          this.notif("error", "Gagal", e.response.data.message);
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
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      const dateFrom = moment(this.filterForm.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.dateTo).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_cb}/bank-reconcile/list?ouId=${ouId}&keyword=${this.filterForm.keyword}&status=${this.filterForm.status}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getCountData();
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.mainData.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainData[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainData[index].logoImage =
                    this.mainData[index].bankCode;
                }
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
              }
            });
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
          this.notif("error", "Gagal", e.response.data.meta.message);
        });
    },
  },
};
</script>
