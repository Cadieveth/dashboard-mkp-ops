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
        <v-card-title class="headline">
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
                  <template #[`item.amount`]="{ item }">
                    <vuetify-money
                      dense
                      v-model="item.amount"
                      v-bind:disabled="disabled"
                      v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                      v-bind:options="options"
                      v-bind:properties="properties"
                      v-bind:backgroundColor="'#F8F8F8'"
                      hide-details
                    />
                  </template>
                  <template #[`item.remark`]="{ item }">
                    <v-text-field
                      background-color="#F8F8F8"
                      dense
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
    <v-dialog v-model="formCalculateTax" persistent width="800">
      <v-card>
        <v-card-title class="font-weight-bold px-8">
          Input Additional Tax
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="formCalculateTax = false">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6" class="p-0">
                <v-text-field
                  dense
                  hide-details
                  label="Tax No"
                  v-model="mainDataSummaryTax[0].taxNo"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="p-0">
                <v-menu
                  v-model="taxDate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="mainDataSummaryTax[0].taxDate"
                      label="Tax Date"
                      :append-icon="icons.mdiCalendar"
                      readonly
                      dense
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="mainDataSummaryTax[0].taxDate"
                    color="primary"
                    @input="taxDate = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-textarea
                  outlined
                  dense
                  hide-details
                  label="Remark"
                  v-model="mainDataSummaryTax[0].remark"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark small @click="addTax()">
            <v-icon dark left>
              {{ icons.mdiCheckboxMarkedCircleOutline }}
            </v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="formReason" persistent width="500">
      <v-card>
        <v-card-title class="card-style">
          <span class="top-title"> Input Reason </span>
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
        </v-card-text>
        <v-card-actions class="mt-4">
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

    <v-dialog v-model="formDescLine" persistent width="500">
      <v-card>
        <v-card-title class="headline">
          Input Note
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="formDescLine = false">
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
                  label="Note"
                  v-model="form.descLine1"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark small @click="exportPDF()">
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
        <span class="form-header"> Input Invoicing </span>

        <v-card class="card-style">
          <v-card-title class="">
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
              class="mr-2 v-chip-light-bg font-weight-semibold text-capitalize"
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
              {{ form.statusDoc ? form.statusDoc : "NONE" }}
            </v-chip>
            <v-spacer></v-spacer>

            <v-btn
              class="ml-2"
              small
              dark
              color="secondary"
              @click="closeFormInvoice('close')"
            >
              <v-icon dark left>
                {{ icons.mdiExitToApp }}
              </v-icon>
              Exit
            </v-btn>
            <v-btn
              class="ml-2"
              small
              dark
              color="info"
              @click="(formReason = true), (formCr = true)"
              v-show="form.statusDoc == 'APPROVED' ? true : false"
            >
              <v-icon dark left>
                {{ icons.mdiFilePdfOutline }}
              </v-icon>
              Export PDF
            </v-btn>
            <v-btn
              class="ml-2"
              small
              dark
              color="primary"
              @click="
                (formReason = true),
                  formEdit == false ? (formAdd = true) : (formAdd = false)
              "
            >
              <v-icon dark left>
                {{ icons.mdiCheckboxMarkedCircleOutline }}
              </v-icon>
              Save
            </v-btn>
            <v-btn
              class="ml-2"
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
              class="ml-2"
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
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-ou-company
                  :form-value.sync="form.ouId"
                  :ou-type="'invoicingTransactionForm'"
                  :read-only="true"
                  :clearable="false"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-cashbank-user
                  :value-bank-ou.sync="form.cashbankId"
                  :label-text="'Cash/Bank'"
                  :read-only="cashbankRead"
                ></app-autocomplite-cashbank-user>
              </v-col>

              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
                  persistent-placeholder
                  placeholder="Insert Document No"
                  :label="docNo"
                  v-model="form.docNo"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="docDate"
                  :value-date.sync="form.docDate"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
                  persistent-placeholder
                  placeholder="Insert Ext Document No"
                  :label="extDocNo"
                  v-model="form.extDocNo"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="extDocDate"
                  :value-date.sync="form.extDocDate"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
                  label="Invoice No"
                  persistent-placeholder
                  placeholder="Insert Invoice No"
                  v-model="form.invoiceNo"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="'Invoice Date'"
                  :value-date.sync="form.invoiceDate"
                  :read-only="true"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-partner
                  :form-value.sync="form.partnerId"
                  :partner-type="'invoicingTransactionForm'"
                  :read-only="true"
                  :clearable="false"
                ></app-autocomplite-partner>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="'Due Date'"
                  :value-date.sync="form.dueDate"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  label="NPWP Name"
                  hide-details
                  v-model="form.partnerNPWP"
                  persistent-placeholder
                  placeholder="Insert Partner NPWP"
                  readonly
                  v-show="false"
                ></v-text-field>
              </v-col>
              <!-- <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  persistent-placeholder
                  placeholder="PlaceHolder"
                  label="Regular"
                ></v-text-field>
              </v-col> -->
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
                  label="NPWP No"
                  persistent-placeholder
                  placeholder="Insert Partner NPWP No"
                  v-model="form.partnerNPWPNo"
                  readonly
                  v-show="false"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12" class="pb-0 mt-2">
                <v-row>
                  <v-col cols="12" md="6" class="pb-0 mt-2">
                    <v-text-field
                      dense
                      hide-details
                      label="NPWP Address"
                      persistent-placeholder
                      placeholder="Insert Partner NPWP Address"
                      v-model="form.partnerNPWPAdress"
                      readonly
                      v-show="false"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-n10">
                <!--                <div class="d-flex demo-space-x flex-wrap">-->
                <!--                  <v-switch-->
                <!--                      v-model="form.flgTax"-->
                <!--                      flat-->
                <!--                      label="Flg Tax"-->
                <!--                      hide-details-->
                <!--                      @change="addTax()"-->
                <!--                  ></v-switch>-->
                <!--                </div>-->
                <span class="text-xs font-weight-bold">Flg Tax</span>
                <v-radio-group
                  v-model="form.flgTax"
                  class="mt-0 mb-0"
                  hide-details
                  @change="addTax()"
                >
                  <div class="d-flex flex-wrap demo-space-x">
                    <v-radio
                      label="Yes"
                      color="primary"
                      value="Y"
                      class="mb-0"
                    ></v-radio>
                    <v-radio
                      label="No"
                      color="primary"
                      value="N"
                      class="mb-0"
                    ></v-radio>
                  </div>
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="6"></v-col>
              <v-col
                cols="12"
                md="6"
                class="pb-0 mt-2"
                v-show="form.flgTax == 'Y'"
              >
                <v-autocomplete
                  label="Tax Type"
                  :items="taxList"
                  item-text="taxName"
                  item-value="id"
                  v-model="form.typeTax"
                  class="mb-0 mt-2"
                  dense
                  hide-details
                  :clearable="!formEdit"
                  @change="addTax()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="12" class="pb-0 mt-2">
                <v-textarea
                  outlined
                  dense
                  hide-details
                  label="Remark"
                  v-model="form.remark"
                  rows="3"
                ></v-textarea>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-4">
                <vuetify-money
                  dense
                  v-model="form.invoiceAmount"
                  label="Total Invoice Amount"
                  v-bind:disabled="true"
                  v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                  v-bind:options="options"
                  v-bind:properties="properties"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="12">
                <span class="top-title py-2">Summary</span>
              </v-col>
              <!-- <v-col class="mt-n6" cols="12" md="12">
                <v-divider></v-divider>
              </v-col> -->
            </v-row>
          </v-card-title>

          <v-card-text class="mt-2 px-n4">
            <v-row>
              <v-col cols="12" md="4" class="pb-0">
                <vuetify-money
                  dense
                  v-model="form.availableAmount"
                  v-bind:disabled="true"
                  label="Available Amount"
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
                  v-bind:disabled="true"
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
                  v-bind:readonly="true"
                  v-bind:disabled="true"
                  v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                  v-bind:options="options"
                  v-bind:properties="properties"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-title
            ><span class="top-title">Tax Summary</span></v-card-title
          >
          <v-card-text>
            <v-data-table
              :headers="headersSummaryTax"
              :items="mainDataSummaryTax"
              :footer-props="{
                'items-per-page-options': [25, 50, 100],
              }"
              disable-pagination
              fixed-header
              dense
            >
              <!-- headers -->
              <template #[`header.actions`]> # </template>
              <!-- format uang-->
              <template #[`item.amount`]="{ item }">
                Rp.{{ number_format(item.baseAmount) }}
              </template>
              <template #[`item.taxAmount`]="{ item }">
                Rp.{{ number_format(item.taxAmount) }}
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
                      @click="formCalculateTax = true"
                      v-show="
                        form.flgTax == 'Y' &&
                        (form.typeTax != '' || form.typeTax != null) &&
                        !formEdit
                      "
                      v-on="on"
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
          </v-card-text>

          <v-card-text class="mb-2">
            <v-btn
              small
              dark
              color="primary"
              @click="getGlList()"
              v-show="!formEdit"
              outlined
            >
              <v-icon dark left>{{ icons.mdiPlus }}</v-icon>
              Add Additional Cost
            </v-btn>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headersGlSelect"
              :items="mainData"
              :footer-props="{
                'items-per-page-options': [25, 50, 100],
              }"
              fixed-header
              dense
            >
              <!-- format uang-->
              <template #[`item.amount`]="{ item }">
                Rp.{{ number_format(item.amount) }}
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

          <v-card-actions class="mt-4">
            <v-spacer></v-spacer>
            <v-btn
              class="ml-2"
              small
              dark
              color="secondary"
              @click="closeFormInvoice('close')"
            >
              <v-icon dark left>
                {{ icons.mdiExitToApp }}
              </v-icon>
              Exit
            </v-btn>
            <v-btn
              class="ml-2"
              small
              dark
              color="primary"
              @click="
                (formReason = true),
                  formEdit == false ? (formAdd = true) : (formAdd = false)
              "
            >
              <v-icon dark left>
                {{ icons.mdiCheckboxMarkedCircleOutline }}
              </v-icon>
              Save
            </v-btn>
            <v-btn
              class="ml-2"
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
              class="ml-2"
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
import AppAutocompliteOuBuMain from "@core/components/app-autocomplite-ou/AppAutocompliteOuBuMain";
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocompliteCashbank from "@core/components/app-autocomplite-ou/AppAutocompliteCashbank.vue";
import AppAutocompliteCashbankUser from "@/@core/components/app-autocomplite-ou/AppAutocompliteCashbankUser.vue";
import {
  mdiAlarmPanelOutline,
  mdiCalendar,
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiDelete,
  mdiPlus,
  mdiFilePdfBox,
  mdiFilePdfOutline,
  mdiExitToApp,
} from "@mdi/js";
import moment from "moment";
import themeConfig from "@themeConfig";
import { dateFormat, number_format, isInArray } from "../../../../constan";
import axios from "@axios";
import router from "@/router";
import Form from "vform";
import "../../../styles/textstyle.css";
import { required } from "@core/utils/validation";

export default {
  name: "ChildForm",
  components: {
    AppAutocompliteOuBuMain,
    AppAutocompliteOuCompany,
    AppAutocompliteCashbank,
    AppAutocomplitePartner,
    AppInputFieldDate,
    AppAutocompliteCashbankUser,
    AppCardLoader,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      extDocNo: themeConfig.labeling.extDocNo,
      extDocDate: themeConfig.labeling.extDocDate,
      ouBTbl: themeConfig.labeling.ouTblB,
      ouSBTbl: themeConfig.labeling.ouTblSB,
      cashBank: themeConfig.labeling.cashBank,
      cashbankRead: false,
      idPartner: 13,
      partnerType: "cashbankDisbursementCreate",
      //role

      validators: {
        required,
      },

      showEdit:
        isInArray(
          "editInvoicingTransactional",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showSubmit:
        isInArray(
          "submitInvoicingTransactional",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      showCR:
        isInArray(
          "changeRequestInvoicingTransactional",
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

      formCalculateTax: false,
      taxDate: false,
      formInvoiceAr: false,
      isDialogVisible: false,
      formEdit: false,
      formReason: false,
      formDescLine: false,
      formAdd: false,
      formCr: false,
      formSubmit: false,
      formGL: false,
      icons: {
        mdiPlus,
        mdiDelete,
        mdiClose,
        mdiAlarmPanelOutline,
        mdiCalendar,
        mdiCheckboxMarkedCircleOutline,
        mdiClipboardEditOutline,
        mdiFilePdfBox,
        mdiFilePdfOutline,
        mdiExitToApp,
      },
      form: new Form({
        id: "",
        ouId: -99,
        docNo: "",
        docDate: moment().format("YYYY-MM-DD"),
        extDocNo: "",
        extDocDate: "",
        invoiceNo: "",
        invoiceDate: moment().format("YYYY-MM-DD"),
        partnerId: -99,
        dueDate: moment().format("YYYY-MM-DD"),
        partnerNPWP: "",
        partnerNPWPAdress: "",
        partnerNPWPNo: "",
        flgTax: "N",
        typeTax: "",
        remark: "",
        reason: "",
        invoiceAmount: 0,
        refDocTypeId: -99,
        refId: -99,
        statusDoc: "",
        availableAmount: 0,
        totalCostAmount: 0,
        totalNettAmount: 0,
        cashbankId: 0,
        descLine1: "",
      }),
      mainDataSummaryTax: [
        {
          taxType: "",
          taxValue: 0,
          baseAmount: 0,
          taxAmount: 0,
          taxNo: "",
          taxDate: "",
          remark: "",
        },
      ],
      invoiceDetailData: [],
      taxList: [],
      mainData: [],
      mainDataGl: [],
      selected: [],
      headersSummaryTax: [
        {
          text: "Actions",
          value: "actions",
          width: "100px",
          sortable: false,
        },
        {
          text: "Tax Type",
          value: "taxType",
          width: "200px",
        },
        {
          text: "Tax Value(%)",
          value: "taxValue",
          width: "150px",
        },
        {
          text: "Base Amount",
          value: "amount",
          width: "200px",
        },
        {
          text: "Tax Amount",
          value: "taxAmount",
          width: "200px",
        },
        {
          text: "Tax No",
          value: "taxNo",
          width: "150px",
        },
        {
          text: "Tax Date",
          value: "taxDate",
          width: "200px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "200px",
        },
      ],
      headers: [
        {
          text: "Batch No",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Batch Date",
          value: "docDate",
          width: "150px",
        },
        {
          text: "OU Branch",
          value: "ouBranch",
          width: "150px",
        },
        {
          text: "OU Sub Branch",
          value: "ouSubBranch",
          width: "150px",
        },
        {
          text: "Invoice Date From",
          value: "dateFrom",
          width: "160px",
        },
        {
          text: "Invoice Date To",
          value: "dateTo",
          width: "150px",
        },
        {
          text: "Amount",
          value: "amount",
          width: "200px",
          align: "right",
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
          value: "amount",
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
          value: "amount",
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
    this.$root.$on("formInvoiceArForm", (msg) => {
      if (msg[0] == "addData") {
        this.mainData = [];
        this.form.clear();
        this.form.reset();
        this.form.statusDoc = "NONE";
        this.formAdd = true;
        this.formEdit = false;
        this.mainDataSummaryTax[0].taxType = "";
        this.mainDataSummaryTax[0].taxValue = 0;
        this.mainDataSummaryTax[0].baseAmount = 0;
        this.mainDataSummaryTax[0].taxAmount = 0;
        this.mainDataSummaryTax[0].taxNo = "";
        this.mainDataSummaryTax[0].taxDate = "";
        this.mainDataSummaryTax[0].remark = "";
        this.getDetailInvoiceAR(msg[1]);
        this.invoiceARForFeeList(msg[1]);
        this.getTaxList();
        this.cashbankRead = false;
      } else if (msg[0] == "editData") {
        this.formAdd = false;
        this.formEdit = true;
        this.cashbankRead = true;
        this.getEditInvoiceARDetail(msg[1]);
        this.getTaxList();
      }
    });
  },
  methods: {
    closeFormInvoice(msg) {
      this.form.reset();
      this.form.clear();
      this.$root.$emit("formInvoiceAr", this.formInvoiceAr);
      this.$root.$emit("InvoiceARReturn", msg);
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
        valueToPush["amount"] =
          item.amount == undefined ? 0 : parseFloat(item.amount);
        valueToPush["remark"] = item.remark;
        this.mainData.push(valueToPush);
        this.form.totalCostAmount +=
          item.amount == undefined ? 0 : parseFloat(item.amount);
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
            this.form.totalCostAmount += item.amount;
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
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/add`,
          {
            scheme: "FA02",
            ouId:
              this.form.ouId == "" || this.form.ouId == null
                ? -99
                : this.form.ouId,
            docNo: this.form.docNo,
            docDate: moment(this.form.docDate).format("YYYYMMDD"),
            extDocNo: this.form.extDocNo,
            extDocDate:
              this.form.extDocDate == "" || this.form.extDocDate == null
                ? ""
                : moment(this.form.extDocDate).format("YYYYMMDD"),
            partnerId:
              this.form.partnerId == "" || this.form.partnerId == null
                ? -99
                : this.form.partnerId,
            refDocTypeId: this.form.refDocTypeId,
            refId: this.form.refId,
            dueDate:
              this.form.dueDate == "" || this.form.dueDate == null
                ? ""
                : moment(this.form.dueDate).format("YYYYMMDD"),
            flgAmount: this.form.flgTax,
            taxId:
              this.form.typeTax == "" || this.form.typeTax == null
                ? -99
                : this.form.typeTax,
            taxPercentage: this.mainDataSummaryTax[0].taxValue,
            taxNo: this.mainDataSummaryTax[0].taxNo,
            taxDate:
              this.mainDataSummaryTax[0].taxDate == "" ||
              this.mainDataSummaryTax[0].taxDate == null
                ? ""
                : moment(this.mainDataSummaryTax[0].taxDate).format("YYYYMMDD"),
            taxRemark: this.mainDataSummaryTax[0].remark,
            baseAmount: this.form.invoiceAmount,
            taxAmount: this.mainDataSummaryTax[0].taxAmount,
            remark: this.form.remark,
            reason: this.form.reason,
            activityGlList: this.mainData,
            cashbankId: this.form.cashbankId,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.formAdd = false;
          this.formEdit = true;
          this.form.reason = "";
          this.getEditInvoiceARDetail(response.data.result);
          this.notif("success", "Success", response.data.meta.message);
          this.cashbankRead = true;
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
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/edit`,
          {
            scheme: "FA02",
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
          this.getEditInvoiceARDetail(response.data.result);
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
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/changes-request`,
          {
            scheme: "FA02",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getEditInvoiceARDetail(response.data.result);
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
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/submit`,
          {
            scheme: "FA02",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getEditInvoiceARDetail(response.data.result);
          this.notif("success", "Success", response.data.meta.message);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    addTax() {
      if (this.form.flgTax == "Y") {
        this.taxList.forEach((element, index) => {
          if (this.form.typeTax == this.taxList[index].id) {
            this.mainDataSummaryTax[0].taxType = this.taxList[index].taxName;
            this.mainDataSummaryTax[0].taxValue =
              this.taxList[index].percentage;
            this.mainDataSummaryTax[0].taxAmount =
              parseFloat(this.mainDataSummaryTax[0].baseAmount) *
              (parseFloat(this.taxList[index].percentage) / 100);
            this.form.availableAmount =
              this.form.invoiceAmount + this.mainDataSummaryTax[0].taxAmount;
            this.form.totalNettAmount =
              this.form.availableAmount - this.form.totalCostAmount;
            return;
          }
        });
        if (this.form.typeTax == null) {
          this.mainDataSummaryTax[0].taxAmount = 0;
          this.mainDataSummaryTax[0].taxValue = 0;
          this.mainDataSummaryTax[0].taxType = "";
          this.mainDataSummaryTax[0].remark = "";
          this.mainDataSummaryTax[0].taxAmount = "";
        }
      } else {
        this.form.typeTax = "";
        this.mainDataSummaryTax[0].taxType = "";
        this.mainDataSummaryTax[0].taxValue = 0;
        this.mainDataSummaryTax[0].taxAmount = 0;
        this.mainDataSummaryTax[0].taxNo = "";
        this.mainDataSummaryTax[0].taxDate = "";
        this.mainDataSummaryTax[0].remark = "";
        this.form.availableAmount =
          this.form.invoiceAmount + this.mainDataSummaryTax[0].taxAmount;
        this.form.totalNettAmount =
          this.form.availableAmount - this.form.totalCostAmount;
      }
      this.formCalculateTax = false;
    },
    getTaxList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/tax/list`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.taxList = response.data.result);
          this.taxList = [];
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
    getCurDocStatus(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      var docType = "FA02";
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
    getEditInvoiceARDetail(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/service-fee/detail/${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.$root.$emit(
              "appAutocompliteOuCompanyInvoicingTransactionForm",
              response.data.result.invoiceAr.ouId
            );
            this.form.cashbankId = response.data.result.cashbank.id;
            this.form.id = response.data.result.invoiceAr.id;
            this.form.statusDoc = response.data.result.invoiceAr.statusDoc;
            this.form.ouId = response.data.result.invoiceAr.ouId;
            this.form.docNo = response.data.result.invoiceAr.docNo;
            this.form.docDate = moment(
              response.data.result.invoiceAr.docDate
            ).format("YYYY-MM-DD");
            this.form.invoiceNo = response.data.result.temporaryInvoiceAr.docNo;
            this.form.invoiceDate = moment(
              response.data.result.temporaryInvoiceAr.docDate
            ).format("YYYY-MM-DD");
            this.form.partnerId = response.data.result.invoiceAr.partnerId;
            this.form.partnerNPWP = response.data.result.partnerNpwp.npwpName;
            this.form.partnerNPWPAdress =
              response.data.result.partnerNpwp.address;
            this.form.partnerNPWPNo = response.data.result.partnerNpwp.npwpNo;
            this.form.flgTax = response.data.result.invoiceArTax.flgAmount;
            this.form.typeTax = response.data.result.invoiceArTax.taxId;
            this.form.remark = response.data.result.invoiceArBalance.remark;
            this.mainDataSummaryTax[0].taxType =
              response.data.result.tax.taxName;
            this.mainDataSummaryTax[0].taxValue =
              response.data.result.invoiceArTax.taxPercentage;
            this.mainDataSummaryTax[0].baseAmount =
              response.data.result.invoiceArTax.baseAmount;
            this.mainDataSummaryTax[0].taxAmount =
              response.data.result.invoiceArTax.taxAmount;
            this.mainDataSummaryTax[0].taxNo =
              response.data.result.invoiceArTax.taxNo;
            this.mainDataSummaryTax[0].taxDate =
              response.data.result.invoiceArTax.taxDate == ""
                ? ""
                : moment(response.data.result.invoiceArTax.taxDate).format(
                    "YYYY-MM-DD"
                  );
            this.mainDataSummaryTax[0].remark =
              response.data.result.invoiceArTax.remark;
            this.mainData = response.data.result.invoiceArCost;
            this.invoiceARForFeeList(
              response.data.result.invoiceArBalance.refId
            );
            this.form.totalCostAmount = 0;
            if (response.data.result.invoiceArCost != null) {
              response.data.result.invoiceArCost.forEach((item) => {
                this.form.totalCostAmount += item.amount;
              });
            }
            this.form.totalNettAmount =
              response.data.result.invoiceArBalance.amount;
            this.form.availableAmount =
              this.form.totalNettAmount + this.form.totalCostAmount;
            this.form.invoiceAmount =
              response.data.result.invoiceArBalance.amount +
              this.form.totalCostAmount -
              response.data.result.invoiceArTax.taxAmount;
            this.getCurDocStatus(this.form.id);
          } else {
            this.form.clear();
            this.form.reset();
          }
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
    exportPDF() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const invoiceId = this.form.id;
      const descLine1 = this.form.descLine1;
      axios
        .get(
          `${
            themeConfig.app.api_fn
          }/invoice-ar/service-fee/print?invoiceArId=${parseInt(
            invoiceId
          )}&descLine1=${descLine1}`,
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
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getDetailInvoiceAR(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/detail-invoice-ar/${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.$root.$emit(
              "appAutocompliteOuCompanyInvoicingTransactionForm",
              response.data.result[0].ouId
            );
            this.form.ouId = response.data.result[0].ouId;
            this.form.invoiceNo = response.data.result[0].docNo;
            this.form.invoiceDate = moment(
              response.data.result[0].docDate
            ).format("YYYY-MM-DD");
            this.form.partnerId = response.data.result[0].partnerId;
            this.form.partnerNPWP = response.data.result[0].npwpName;
            this.form.partnerNPWPAdress = response.data.result[0].address;
            this.form.partnerNPWPNo = response.data.result[0].npwpNo;
            this.form.invoiceAmount = response.data.result[0].amount;
            this.form.refDocTypeId = response.data.result[0].docTypeId;
            this.form.refId = response.data.result[0].invoiceArId;
            this.mainDataSummaryTax[0].baseAmount =
              response.data.result[0].amount;
            this.form.availableAmount = response.data.result[0].amount;
            this.form.totalCostAmount = 0;
            this.form.totalNettAmount = response.data.result[0].amount;
          } else {
            this.form.clear();
            this.form.reset();
          }
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
    invoiceARForFeeList(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice-ar/detail-invoice-ar-for-service-fee-list-by-invoice/${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.invoiceDetailData = response.data.result;
          } else {
            this.invoiceDetailData = [];
          }
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
  },
};
</script>
