<template>
  <div>
    <dialog-save-input
      @on-close="() => openCloseReason()"
      @on-save="saveDocument"
      @on-edit="editDocument"
      @on-submit="submitDocument"
      @on-change-request="changeRequestDoc"
      :open-dialog="reasonDialog"
      :reason-type="reasonType"
    ></dialog-save-input>
    <v-row>
      <v-col>
        <span class="form-header">Input Sales Invoice</span>
        <v-card class="card-style">
          <action-doc-approval
            ref="topActionDoc"
            :doc-id="invoiceId"
            :scheme="'SA02'"
            createHumanTask="addSalesInvoiceNettOff"
            editHumanTask="editSalesInvoiceNettOff"
            submitHumanTask="submitSalesInvoiceNettOff"
            changeRequestHumanTask="changeRequestSalesInvoiceNettOff"
            @on-save="openCloseReason"
            @on-edit="openCloseReason"
            @on-submit="openCloseReason"
            @on-change-request="openCloseReason"
            @on-close="closeForm"
          ></action-doc-approval>
          <v-card-text class="mt-4">
            <v-row>
              <v-col cols="12" md="6">
                <app-autocomplite-ou-company
                  :form-value="form.ouId"
                  :read-only="true"
                  :clearable="false"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6" class="">
                <app-autocomplite-partner
                  :form-value.sync="form.partnerId"
                  :clearable="false"
                  :read-only="true"
                ></app-autocomplite-partner>
              </v-col>
              <v-col cols="12" md="6" class="">
                <v-text-field
                  dense
                  hide-details
                  :label="label.docNo"
                  v-model="form.docNo"
                  :placeholder="placeholder.docNo"
                  :readonly="workflowStatus !== 'NONE'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="">
                <app-input-field-date
                  :label-title="label.docDate"
                  :value-date.sync="form.docDate"
                  :placeholder="placeholder.docDate"
                  :read-only="workflowStatus !== 'NONE'"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="">
                <v-text-field
                  dense
                  hide-details
                  :label="label.extDocNo"
                  v-model="form.extDocNo"
                  :placeholder="placeholder.extDocNo"
                  :readonly="
                    workflowStatus !== 'NONE' && workflowStatus !== 'DRAFT'
                  "
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="">
                <app-input-field-date
                  :label-title="label.extDocDate"
                  :value-date.sync="form.extDocDate"
                  :placeholder="placeholder.extDocDate"
                  :read-only="
                    workflowStatus !== 'NONE' && workflowStatus !== 'DRAFT'
                  "
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="">
                <app-input-field-date
                  :label-title="label.dueDate"
                  :value-date.sync="form.dueDate"
                  :placeholder="placeholder.dueDate"
                  :read-only="
                    workflowStatus !== 'NONE' && workflowStatus !== 'DRAFT'
                  "
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="12" class="">
                <v-textarea
                  outlined
                  dense
                  hide-details
                  label="Remark"
                  :placeholder="placeholder.remark"
                  v-model="form.remark"
                  :readonly="
                    workflowStatus !== 'NONE' && workflowStatus !== 'DRAFT'
                  "
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-title v-show="invoiceTax.length > 0" class="pb-0">
            <p>Tax Information</p>
          </v-card-title>
          <v-card-text v-show="invoiceTax.length > 0">
            <display-invoice-tax :tax-list="invoiceTax"></display-invoice-tax>
          </v-card-text>
          <v-card-title class="pb-0">
            <p>Detail Items</p>
          </v-card-title>
          <v-card-text>
            <table-invoice-list
              :status="workflowStatus"
              :main-data="invoiceItemList"
            ></table-invoice-list>
          </v-card-text>
          <action-doc-approval
            ref="bottomActionDoc"
            :doc-id="invoiceId"
            :scheme="'SA02'"
            :show-status="false"
            createHumanTask="addSalesInvoiceNettOff"
            editHumanTask="editSalesInvoiceNettOff"
            submitHumanTask="submitSalesInvoiceNettOff"
            changeRequestHumanTask="changeRequestSalesInvoiceNettOff"
            @on-save="openCloseReason"
            @on-edit="openCloseReason"
            @on-submit="openCloseReason"
            @on-change-request="openCloseReason"
            @on-close="closeForm"
          ></action-doc-approval>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  mdiExitToApp,
  mdiCheckboxMarkedCircleOutline,
  mdiCheckAll,
  mdiClose,
} from "@mdi/js";
import themeConfig from "@themeConfig";
import { mapGetters, mapActions, mapState } from "vuex";
import AppChip from "@/@core/components/app-input-component/AppChip";
import AppButton from "@/@core/components/app-button/AppButton.vue";
import AppAutocompliteOuCompany from "@/@core/components/app-autocomplite/AppAutocompliteOuCompany.vue";
import AppAutocomplitePartner from "@/@core/components/app-autocomplite/AppAutocomplitePartner.vue";
import AppInputFieldDate from "@/@core/components/app-input-field/AppInputFieldDate";
import AppBottomTopInfo from "@/@core/components/app-table-component/AppBottomTopInfo";
import AppBusinessUnitInfo from "@/@core/components/app-table-component/AppBusinessUnitInfo.vue";
import AppPartnerInfo from "@/@core/components/app-table-component/AppPartnerInfo.vue";
import {
  dateFormat,
  dateDisplay,
  dateForComponent,
  dateFormatRequired,
} from "../../../utils/dateConstan";
import dialogSaveInput from "./component-invoice-netoff-transactional/dialog-save-input.vue";
import { formatCurrency } from "../../../utils/currencyConstan";
import { sumTotalAmount } from "@/utils/arrayConstan";
import { delay } from "@/utils/constan";
import { get, post } from "@/services/apiServices";
import tableInvoiceList from "./component-invoice-netoff-transactional/table-invoice-list.vue";
import displayInvoiceTax from "./component-invoice-netoff-transactional/display-invoice-tax.vue";
import actionDocApproval from "@/views/sales/invoice-netoff-transactional/component-invoice-netoff-transactional/action-doc-approval.vue";
import moment from "moment";

export default {
  components: {
    AppChip,
    AppButton,
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppInputFieldDate,
    AppBottomTopInfo,
    AppBusinessUnitInfo,
    AppPartnerInfo,
    dialogSaveInput,
    tableInvoiceList,
    displayInvoiceTax,
    actionDocApproval,
  },
  data() {
    return {
      label: themeConfig.labeling,
      placeholder: themeConfig.placeholder,
      icons: {
        mdiExitToApp,
        mdiCheckboxMarkedCircleOutline,
        mdiCheckAll,
        mdiClose,
      },
      reasonDialog: false,
      documentType: "create",
      workflowStatus: "NONE",
      form: {
        ouId: -99,
        partnerId: -99,
        docNo: "",
        docDate: moment().format("YYYY-MM-DD"),
        extDocNo: "",
        extDocDate: "",
        dueDate: "",
        remark: "",
      },
      reasonType: "",
      currentState: "",

      items: [],
      invoiceId: -99,
      invoiceItemList: [],
      invoiceTax: [],
    };
  },
  watch: {
    invoiceId(newVal) {
      this.getSalesInvoiceNetoffDetail(newVal);
    },
    workflowStatus(newVal) {
      console.log("workflowStatus", newVal);
    },
  },
  computed: {
    ...mapState(["invoiceNetoffTabs"]),
    ...mapGetters([
      "getSalesInvoiceNetoffCreate",
      "getSalesInvoiceNetoffSelected",
      "getInvoiceId",
    ]),
    salesInvoiceNetoffForm() {
      return this.getSalesInvoiceNetoffCreate;
    },
    salesInvoiceNetoffSelected() {
      return this.getSalesInvoiceNetoffSelected;
    },
    id() {
      return this.getInvoiceId;
    },
  },
  mounted() {
    this.form = this.salesInvoiceNetoffForm;
    this.invoiceId = this.id;
    this.invoiceItemList = this.salesInvoiceNetoffSelected;
  },
  methods: {
    ...mapActions(["resetVuex", "setInvoiceId"]),
    dateDisplay,
    formatCurrency,
    sumTotalAmount,
    dateForComponent,
    closeForm() {
      window.history.back();
      this.setInvoiceId(-99);
    },
    openCloseReason(type) {
      this.reasonType = type;
      this.reasonDialog = !this.reasonDialog;
    },

    async getDocHistory(id) {
      this.$refs.topActionDoc.getDocStatus(id);
      this.$refs.bottomActionDoc.getDocStatus(id);
    },

    async saveDocument(reason) {
      this.$loading(true);
      const body = {
        scheme: "SA02",
        ouId: this.form.ouId,
        docNo: this.form.docNo,
        docDate: dateFormat(this.form.docDate),
        extDocNo: this.form.extDocNo,
        extDocDate: dateFormat(this.form.extDocDate),
        partnerId: this.form.partnerId,
        dueDate: dateFormat(this.form.dueDate),
        invoiceItemList: this.salesInvoiceNetoffSelected,
        remark: this.form.remark,
        reason: reason,
      };
      const url = `${themeConfig.app.api_sl}/sales-invoice/so/transaction/add`;
      try {
        const response = await post(url, body);
        this.$store.dispatch("resetVuex");
        this.$notify("success", response.data.meta.message);
        this.form = {};
        this.getSalesInvoiceNetoffDetail(response.data.result);
        this.getDocHistory(response.data.result);
        this.invoiceId = response.data.result;
        this.reasonDialog = false;
      } catch (error) {
        this.$notify("error", error.data.meta.message);
      }
      this.$loading(false);
    },

    async editDocument(reason) {
      this.$loading(true);
      const body = {
        scheme: "SA02",
        id: this.invoiceId,
        extDocNo: this.form.extDocNo,
        extDocDate: dateFormat(this.form.extDocDate),
        dueDate: dateFormat(this.form.dueDate),
        remark: this.form.remark,
        reason: reason,
      };
      const url = `${themeConfig.app.api_sl}/sales-invoice/so/transaction/edit`;
      try {
        const response = await post(url, body);
        this.$notify("success", response.data.meta.message);
        this.getSalesInvoiceNetoffDetail(response.data.result);
        this.invoiceId = response.data.result;
        this.getDocHistory(response.data.result);
        this.reasonDialog = false;
      } catch (error) {
        this.$notify("error", error.data.meta.message);
      }
      this.$loading(false);
    },

    async submitDocument(reason) {
      this.$loading(true);
      const body = {
        scheme: "SA02",
        id: this.invoiceId,
        reason: reason,
      };
      const url = `${themeConfig.app.api_sl}/sales-invoice/so/transaction/submit`;
      try {
        const response = await post(url, body);
        this.$store.dispatch("resetVuex");
        this.$notify("success", response.data.meta.message);
        this.form = {};
        this.getSalesInvoiceNetoffDetail(response.data.result);
        this.invoiceId = response.data.result;
        this.getDocHistory(response.data.result);
        this.reasonDialog = false;
      } catch (error) {
        this.$notify("error", error.data.meta.message);
      }
      this.$loading(false);
    },

    async changeRequestDoc(reason) {
      this.$loading(true);
      const body = {
        scheme: "SA02",
        id: this.invoiceId,
        reason: reason,
      };
      const url = `${themeConfig.app.api_sl}/sales-invoice/so/transaction/changes-request`;
      try {
        const response = await post(url, body);
        this.$store.dispatch("resetVuex");
        this.$notify("success", response.data.meta.message);
        this.form = {};
        this.getSalesInvoiceNetoffDetail(response.data.result);
        this.invoiceId = response.data.result;
        this.getDocHistory(response.data.result);
        this.reasonDialog = false;
      } catch (error) {
        this.$notify("error", error.data.meta.message);
      }
      this.$loading(false);
    },

    async getSalesInvoiceNetoffDetail(id) {
      this.$loading(true);
      const url = `${themeConfig.app.api_sl}/sales-invoice/so/transaction/detail/${id}`;
      try {
        const response = await get(url);
        this.form = {
          ...response.data.result.invoice,
          docDate: dateForComponent(response.data.result.invoice.docDate),
          extDocDate: dateForComponent(response.data.result.invoice.extDocDate),
          dueDate: dateForComponent(response.data.result.invoice.dueDate),
        };
        this.workflowStatus = response.data.result.invoice.workflowStatus;
        this.invoiceItemList = response.data.result.invoiceItemList;
        this.invoiceTax = response.data.result.invoiceTax;
      } catch (error) {
        this.$notify("error", error.data.meta.message);
      }
      this.$loading(false);
    },
  },
};
</script>
