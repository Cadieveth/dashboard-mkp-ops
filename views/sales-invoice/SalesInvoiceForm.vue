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
    <v-dialog v-model="formReason" persistent width="500">
      <v-card>
        <v-card-title class="headline">
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
                      v-bind:readonly="false"
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
                      dense
                      background-color="#F8F8F8"
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
                  v-model="formTax.taxNo"
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
                      v-model="formTax.taxDate"
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
                    v-model="formTax.taxDate"
                    color="primary"
                    @input="taxDate = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" class="pb-0">
                <span class="font-weight-bold text-xs">Flg Include Tax</span>
                <v-radio-group
                  v-model="formTax.flgIncTax"
                  class="mt-0 mb-0"
                  hide-details
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
              <v-col cols="12" class="pb-0">
                <v-textarea
                  outlined
                  dense
                  hide-details
                  label="Remark"
                  v-model="formTax.remark"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark small @click="addTaxInfo()">
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
        <span class="form-header">Input Sales Invoice</span>
        <v-card outlined class="card-style">
          <v-card-actions class="mb-n4">
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
              {{ form.statusDoc === "D" ? "DRAFT" : form.statusDoc }}
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
                (form.statusDoc == 'NONE' ||
                  form.statusDoc == 'DRAFT' ||
                  form.statusDoc == 'D') &&
                showSave
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
                {{ icons.mdiCheckAll }}
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
                  :clearable="false"
                  :read-only="true"
                  :ou-type="'salesInvoiceForm'"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-partner
                  :form-value.sync="form.partnerId"
                  :clearable="false"
                  :read-only="true"
                  :partner-type="'salesInvoiceForm'"
                ></app-autocomplite-partner>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
                  :label="docNo"
                  v-model="form.docNo"
                  :readonly="formEdit"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="docDate"
                  :value-date.sync="form.docDate"
                  :read-only="formEdit"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  hide-details
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
              <v-col cols="12" class="pb-0 mt-2">
                <v-row>
                  <v-col cols="12" md="6">
                    <app-input-field-date
                      :label-title="dueDate"
                      :value-date.sync="form.dueDate"
                    ></app-input-field-date>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <span class="font-weight-bold text-xs">Flg Tax</span>
                <v-radio-group
                  v-model="form.flgTaxAmount"
                  class="mt-0 mb-0"
                  hide-details
                  @change="addTax()"
                  :readonly="formEdit"
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
              <v-col cols="12" md="6" class="pb-0 mt-3">
                <v-autocomplete
                  label="Tax Type"
                  :items="taxList"
                  item-text="taxName"
                  item-value="id"
                  v-model="form.taxId"
                  class="mb-0"
                  dense
                  hide-details
                  :clearable="!formEdit"
                  @change="addTax()"
                  v-show="form.flgTaxAmount == 'Y'"
                  :readonly="formEdit"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6"></v-col>

              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-textarea
                  outlined
                  dense
                  hide-details
                  :class="form.flgTaxAmount != 'Y' ? 'mt-n6' : ''"
                  label="Remark"
                  v-model="form.remark"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row> </v-row>
          </v-card-text>
          <v-card-title><span>Summary</span></v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" class="pb-0">
                <vuetify-money
                  dense
                  v-model="form.totalAmount"
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
                  v-model="form.totalGrandAmount"
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
          <v-card-title>
            <span class="font-weight-bold">Tax</span>
            <v-spacer></v-spacer>
            <!--                    <v-btn-->
            <!--                        dark-->
            <!--                        small-->
            <!--                        color="info"-->
            <!--                        v-show="form.flgTaxAmount == 'Y' && (form.taxId != '' || form.taxId != null) && !formEdit"-->
            <!--                        @click="formCalculateTax = true"-->
            <!--                    >-->
            <!--                      <v-icon-->
            <!--                          dark-->
            <!--                          left-->
            <!--                      >-->
            <!--                        {{icons.mdiPlus}}-->
            <!--                      </v-icon>-->
            <!--                      Add Additional Tax-->
            <!--                    </v-btn>-->
          </v-card-title>
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
              <!-- format uang-->
              <template #[`item.baseAmount`]="{ item }">
                Rp.{{ number_format(item.baseAmount) }}
              </template>
              <template #[`item.taxAmount`]="{ item }">
                Rp.{{ number_format(item.taxAmount) }}
              </template>

              <!-- format tanggal-->
              <template #[`item.taxDate`]="{ item }">
                {{ item.taxDate == "" ? "-" : dateFormat(item.taxDate) }}
              </template>

              <template #[`item.taxNo`]="{ item }">
                {{ item.taxNo == "" ? "-" : item.taxNo }}
              </template>

              <template #[`item.flgIncTax`]="{ item }">
                <!--                {{ item.flgIncTax == "" ? "-" : (item.flgIncTax == "Y" ? "Yes" : "No") }}-->
                <v-chip
                  small
                  :class="`${
                    item.flgIncTax == ''
                      ? 'secondary'
                      : item.flgIncTax == 'Y'
                      ? 'success'
                      : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="
                    item.flgIncTax == ''
                      ? 'secondary'
                      : item.flgIncTax == 'Y'
                      ? 'success'
                      : 'error'
                  "
                >
                  {{
                    item.flgIncTax == ""
                      ? "-"
                      : item.flgIncTax == "Y"
                      ? "YES"
                      : "NO"
                  }}
                </v-chip>
              </template>

              <template #[`item.remark`]="{ item }">
                {{ item.remark == "" ? "-" : item.remark }}
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
                        form.flgTaxAmount == 'Y' &&
                        (form.taxId != '' || form.taxId != null) &&
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
          <v-card-title> Detail Items </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headersItem"
              :items="mainDataSalesOrder"
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

              <!-- unit bisnis -->
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
                Rp.{{ number_format(item.amount) }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-title>
            <span>Additional Cost</span>
            <v-spacer></v-spacer>
            <v-btn
              dark
              small
              color="info"
              @click="getGlList()"
              v-show="!formEdit"
              outlined
            >
              <v-icon dark left>
                {{ icons.mdiPlus }}
              </v-icon>
              Add Additional Cost
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headersGlSelect"
              :items="mainDataCost"
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
          <v-card-actions class="mt-2">
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
                (form.statusDoc == 'NONE' ||
                  form.statusDoc == 'DRAFT' ||
                  form.statusDoc == 'D') &&
                showSave
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
                {{ icons.mdiCheckAll }}
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
import themeConfig from "@themeConfig";
import {
  mdiCheckAll,
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiDelete,
  mdiPlus,
  mdiExitToApp,
} from "@mdi/js";
import { dateFormat, number_format, isInArray } from "../../../constan";
import Form from "vform";
import moment from "moment";
import axios from "@axios";
import router from "@/router";
import "../../styles/textstyle.css";
import { throws } from "assert";

export default {
  name: "ChildForm",
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
      dueDate: themeConfig.labeling.dueDate,
      ouTbl: themeConfig.labeling.ouTbl,

      showSave:
        isInArray("editSalesInvoice", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",

      showSubmit:
        isInArray("submitSalesInvoice", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",

      showCR:
        isInArray(
          "changeRequestSalesInvoice",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      icons: {
        mdiPlus,
        mdiDelete,
        mdiClose,
        mdiCheckAll,
        mdiCheckboxMarkedCircleOutline,
        mdiClipboardEditOutline,
        mdiExitToApp,
      },

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

      isDialogVisible: false,
      salesInvoiceForm: false,
      form: new Form({
        id: "",
        ouId: -99,
        partnerId: -99,
        docNo: "",
        docDate: moment().format("YYYY-MM-DD"),
        extDocNo: "",
        extDocDate: "",
        dueDate: "",
        remark: "",
        statusDoc: "",
        flgTaxAmount: "N",
        taxId: "",
        totalAmount: 0,
        totalTaxAmount: 0,
        totalCostAmount: 0,
        totalGrandAmount: 0,
      }),
      formTax: new Form({
        taxNo: "",
        taxDate: moment().format("YYYY-MM-DD"),
        flgIncTax: "N",
        remark: "",
      }),
      formAdd: true,
      formEdit: false,
      formCr: false,
      formSubmit: false,
      formReason: false,
      formCalculateTax: false,
      formGL: false,
      taxDate: false,
      selected: [],
      taxList: [],
      dataSummaryTax: [
        {
          taxId: -99,
          taxType: "",
          taxPercentage: 0,
          baseAmount: 0,
          taxAmount: 0,
          taxNo: "",
          taxDate: "",
          remark: "",
        },
      ],
      mainDataSummaryTax: [
        {
          taxId: -99,
          taxType: "",
          taxPercentage: 0,
          baseAmount: 0,
          taxAmount: 0,
          taxNo: "",
          taxDate: "",
          remark: "",
          flgIncTax: "",
        },
      ],
      mainDataSalesOrder: [],
      mainDataCost: [],
      mainDataGl: [],
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
          value: "taxPercentage",
          width: "150px",
        },
        {
          text: "Base Amount",
          value: "baseAmount",
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
          text: "Flg Include Tax",
          value: "flgIncTax",
          width: "175px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "200px",
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
      headersItem: [
        {
          text: "No. Dok.",
          value: "docNo",
          width: "300px",
        },
        {
          text: "Tanggal Dok.",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Ou",
          value: "ou",
          width: "200px",
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
          width: "350px",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("appAutocompliteOuCompany", (msg) => {
      // this.$root.$emit("appAutocomplitePartner", msg);
      this.form.partnerId = -99;
    });
    this.getTaxList();

    this.$root.$on("SalesInvoiceForm", (msg) => {
      if (msg[0] == "addData") {
        this.form.clear();
        this.form.reset();
        this.$root.$emit("appAutocomplitePartnerSalesInvoiceForm", msg[2].ouId);
        this.formAdd = true;
        this.formEdit = false;
        this.mainDataSalesOrder = msg[1];
        this.form.ouId = msg[2].ouId;
        this.form.partnerId = msg[2].partnerId;
        this.form.statusDoc = "NONE";
        var totalAmount = 0;
        var totalTaxAmount = 0;
        msg[1].forEach((element, index) => {
          this.mainDataSalesOrder[index].amount = msg[1][index].nettItemAmount;
          totalAmount += msg[1][index].nettItemAmount;
          totalTaxAmount += msg[1][index].taxAmount;
        });
        this.form.totalAmount = totalAmount;
        this.mainDataSummaryTax[0].baseAmount = totalAmount;
        this.mainDataSummaryTax[0].taxAmount = totalTaxAmount;
        this.form.totalGrandAmount = totalAmount;

        if (msg[1][0].taxId != -99) {
          this.form.flgTaxAmount = "Y";
          this.form.taxId = msg[1][0].taxId;
          this.mainDataSummaryTax[0].taxId = msg[1][0].taxId;
          this.mainDataSummaryTax[0].taxType = msg[1][0].taxName;
          this.mainDataSummaryTax[0].taxPercentage = msg[1][0].taxPercentage;
          this.mainDataSummaryTax[0].taxAmount = msg[1][0].taxAmount;
        } else {
          this.form.flgTaxAmount = "N";
        }
      } else if (msg[0] == "editData") {
        console.log(msg);
        this.formAdd = false;
        this.formEdit = true;
        this.getDetail(msg[1].id);
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
      this.$root.$emit("SalesInvoice", this.salesInvoiceForm);
    },
    addTaxInfo() {
      this.mainDataSummaryTax[0].taxNo = this.formTax.taxNo;
      this.mainDataSummaryTax[0].taxDate = moment(this.formTax.taxDate).format(
        "YYYYMMDD"
      );
      this.mainDataSummaryTax[0].flgIncTax = this.formTax.flgIncTax;
      this.mainDataSummaryTax[0].remark = this.formTax.remark;
      this.formCalculateTax = false;
    },
    addTax() {
      if (this.form.flgTaxAmount == "Y") {
        this.taxList.forEach((element, index) => {
          if (this.form.taxId == this.taxList[index].id) {
            this.mainDataSummaryTax[0].taxId = this.taxList[index].id;
            this.mainDataSummaryTax[0].taxType = this.taxList[index].taxName;
            this.mainDataSummaryTax[0].taxPercentage =
              this.taxList[index].percentage;
            this.mainDataSummaryTax[0].taxAmount =
              parseFloat(this.mainDataSummaryTax[0].baseAmount) *
              (parseFloat(this.taxList[index].percentage) / 100);
            return;
          }
        });
        if (this.form.taxId == null) {
          this.mainDataSummaryTax[0].taxAmount = 0;
          this.mainDataSummaryTax[0].taxPercentage = 0;
          this.mainDataSummaryTax[0].taxType = "";
          this.mainDataSummaryTax[0].remark = "";
        }
        console.log(this.form.taxId);
      } else {
        this.form.typeTax = "";
        this.mainDataSummaryTax[0].taxId = -99;
        this.mainDataSummaryTax[0].taxType = "";
        this.mainDataSummaryTax[0].taxPercentage = 0;
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
        this.mainDataCost.push(valueToPush);
        this.form.totalCostAmount +=
          item.amount == undefined ? 0 : parseFloat(item.amount);
      });
      this.form.totalGrandAmount =
        this.form.totalAmount - this.form.totalCostAmount;
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
          this.form.totalGrandAmount =
            this.form.totalAmount - this.form.totalCostAmount;
          this.isDialogVisible = false;
          setTimeout(() => {
            dialog.close();
          }, 500);
        })
        .catch(() => {});
    },
    getDetail(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_sl}/sales-invoice/detail/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.$root.$emit(
            "appAutocomplitePartnerSalesInvoiceForm",
            response.data.result.invoice[0].ouId
          );
          this.form.id = response.data.result.invoice[0].id;
          this.form.ouId = response.data.result.invoice[0].ouId;
          this.form.partnerId = response.data.result.invoice[0].partnerId;
          this.form.docNo = response.data.result.invoice[0].docNo;
          this.form.docDate = response.data.result.invoice[0].docDate;
          this.form.extDocNo = response.data.result.invoice[0].extDocNo;
          this.form.extDocDate =
            response.data.result.invoice[0].extDocDate == ""
              ? ""
              : moment(response.data.result.invoice[0].extDocDate).format(
                  "YYYY-MM-DD"
                );
          this.form.dueDate =
            response.data.result.invoice[0].dueDate == ""
              ? ""
              : moment(response.data.result.invoice[0].dueDate).format(
                  "YYYY-MM-DD"
                );
          this.form.remark = response.data.result.invoice[0].remark;
          this.form.statusDoc = response.data.result.invoice[0].statusDoc;
          this.form.flgTaxAmount =
            response.data.result.invoiceTax[0].flgTaxAmount;
          this.form.taxId = response.data.result.invoiceTax[0].taxId;
          this.form.totalAmount = response.data.result.invoice[0].grossAmount;
          this.form.totalTaxAmount = response.data.result.invoice[0].taxAmount;
          this.form.totalCostAmount = 0;
          this.mainDataCost = response.data.result.invoiceCost;
          this.mainDataSalesOrder = response.data.result.invoiceItem;
          this.mainDataSummaryTax = response.data.result.invoiceTax;
          this.mainDataSummaryTax[0].taxType =
            response.data.result.invoiceTax[0].taxName;
          response.data.result.invoiceCost.forEach((item) => {
            this.form.totalCostAmount += item.amount;
          });

          this.form.totalGrandAmount =
            this.form.totalAmount +
            this.form.totalTaxAmount -
            this.form.totalCostAmount;
          this.getCurDocStatus(this.form.id);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.meta.message);
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
      var docType = "SA02";
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
          `${themeConfig.app.api_sl}/sales-invoice/add`,
          {
            scheme: "SA02",
            ouId:
              this.form.ouId == null || this.form.ouId == ""
                ? -99
                : this.form.ouId,
            docNo: this.form.docNo,
            docDate: moment(this.form.docDate).format("YYYYMMDD"),
            extDocNo: this.form.extDocNo,
            extDocDate:
              this.form.extDocDate == ""
                ? ""
                : moment(this.form.extDocDate).format("YYYYMMDD"),
            partnerId:
              this.form.partnerId == null || this.form.partnerId == ""
                ? -99
                : this.form.partnerId,
            dueDate:
              this.form.dueDate == ""
                ? ""
                : moment(this.form.dueDate).format("YYYYMMDD"),
            grossAmount: this.form.totalAmount,
            taxAmount: this.mainDataSummaryTax[0].taxAmount,
            totalCostAmount: this.form.totalCostAmount,
            flgTaxAmount: this.form.flgTaxAmount,
            invoiceCostList: this.mainDataCost,
            // invoiceTaxList: this.mainDataSummaryTax,
            tax: this.mainDataSummaryTax,
            invoiceItemList: this.mainDataSalesOrder,
            remark: this.form.remark,
            reason: this.form.reason,
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
          this.getDetail(response.data.result);
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
          `${themeConfig.app.api_sl}/sales-invoice/edit`,
          {
            scheme: "SA02",
            id: this.form.id,
            extDocNo: this.form.extDocNo,
            extDocDate:
              this.form.extDocDate == "" || this.form.extDocDate == null
                ? ""
                : moment(this.form.extDocDate).format("YYYYMMDD"),
            dueDate:
              this.form.dueDate == "" || this.form.dueDate == null
                ? ""
                : moment(this.form.dueDate).format("YYYYMMDD"),
            remark: this.form.remark,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.form.reason = "";
          this.notif("success", "Success", response.data.meta.message);
          this.getDetail(response.data.result);
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
          `${themeConfig.app.api_sl}/sales-invoice/submit`,
          {
            scheme: "SA02",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.form.reason = "";
          this.notif("success", "Success", response.data.meta.message);
          this.getDetail(response.data.result);
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
          `${themeConfig.app.api_sl}/sales-invoice/changes-request`,
          {
            scheme: "SA02",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.form.reason = "";
          this.notif("success", "Success", response.data.meta.message);
          this.getDetail(response.data.result);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
