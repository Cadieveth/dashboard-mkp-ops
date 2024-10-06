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
      <v-col cols="12" :md="formHistori ? '9' : '12'" class="mb-0">
        <v-row>
          <v-col cols="12" class="mb-0">
            <span class="form-header"
              >Input Settlement Without Deposit Item List</span
            >
            <v-card class="card-style">
              <v-card-actions class="mb-6">
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
              </v-card-actions>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6" class="pb-0">
                    <app-autocomplite-ou
                      :form-value.sync="form.ouId"
                      :readOnly="formEdit"
                      :ou-type="'cashbankTransferWithoutDeposit'"
                    ></app-autocomplite-ou>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0">
                    <app-autocomplite-status
                      :lable-tittle="'Mode Transfer'"
                      :form-value.sync="form.modePayment"
                      :status-type="'TRANSFERMODE'"
                    ></app-autocomplite-status>
                  </v-col>
                  <v-col cols="12" md="6" v-show="false" class="pb-0">
                    <v-autocomplete
                      label="Activity"
                      v-model="form.activityGlId"
                      :items="activityGlList"
                      item-value="id"
                      item-text="activityGlName"
                      class="mb-0"
                      outlined
                      dense
                      hide-details
                      clearable
                    >
                      <template #selection="data">
                        <span class="font-weight-semibold">
                          {{ data.item.activityGlCode }}
                        </span>
                        <span> - {{ data.item.activityGlName }}</span>
                      </template>
                      <template #item="data">
                        <template>
                          <v-list-item-content>
                            <v-list-item-title>
                              <span class="font-weight-semibold">
                                {{ data.item.activityGlCode }}
                              </span>
                              <span> - {{ data.item.activityGlName }}</span>
                            </v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6" class="mt-2">
                    <v-text-field
                      :label="docNo"
                      v-model="form.docNo"
                      placeholder="Insert Document No"
                      dense
                      hide-details
                      :readonly="formEdit"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="mt-2">
                    <v-menu
                      v-model="menuDocDate"
                      :close-on-content-click="false"
                      placeholder="Insert Document Date"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="form.docDate"
                          :label="docDate"
                          :append-icon="icons.mdiCalendar"
                          readonly
                          dense
                          hide-details
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.docDate"
                        color="primary"
                        :readonly="formEdit"
                        @input="menuDocDate = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0">
                    <v-text-field
                      :label="extDocNo"
                      v-model="form.extDocNo"
                      dense
                      hide-details
                      placeholder="Insert Ext Document No"
                      :readonly="
                        form.workflowStatus != 'NONE' &&
                        form.workflowStatus != 'DRAFT'
                      "
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0">
                    <v-menu
                      v-model="menuExtDocDate"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      placeholder="Insert Ext Document Date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="form.extDocDate"
                          :label="extDocDate"
                          :append-icon="icons.mdiCalendar"
                          readonly
                          dense
                          hide-details
                          v-bind="attrs"
                          v-on="on"
                          clearable
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="form.extDocDate"
                        color="primary"
                        @input="menuExtDocDate = false"
                        :readonly="
                          form.workflowStatus != 'NONE' &&
                          form.workflowStatus != 'DRAFT'
                        "
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" class="pb-0 mt-2">
                    <v-textarea
                      label="Remark"
                      v-model="form.remark"
                      placeholder="Add Remark"
                      outlined
                      dense
                      :readonly="formEdit"
                      hide-details
                      rows="3"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-title>
                <span class="form-title"> Account Information </span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6" class="pb-0">
                    <app-autocomplite-cashbank-ou
                      :value-bank-ou.sync="formTransferItem.cashbankFromId"
                      :read-only="formEdit || editItemList"
                      :label-text="'Source Bank'"
                      :cashbank-type="'cashbankTransfer'"
                    ></app-autocomplite-cashbank-ou>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0">
                    <app-autocomplite-cashbank-ou
                      :value-bank-ou.sync="formTransferItem.cashbankToId"
                      :read-only="formEdit || editItemList"
                      :label-text="'Beneficiary Bank'"
                      :cashbank-type="'cashbankTransfer'"
                    ></app-autocomplite-cashbank-ou>
                  </v-col>
                  <!-- <v-col cols="12" md="6" class="pb-0 mt-2">
                            <app-autocomplite-cashbank-ou
                              :value-bank-ou.sync="
                                formTransferItem.cashbankToId
                              "
                              :read-only="formEdit || editItemList"
                              :label-text="'Beneficiary Bank'"
                            ></app-autocomplite-cashbank-ou>
                          </v-col> -->
                  <v-col cols="12" md="6" class="mt-2">
                    <v-text-field
                      label="Payment No"
                      v-model="formTransferItem.paymentRefNo"
                      placeholder="Insert Payment No"
                      dense
                      hide-details="auto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="mt-2">
                    <v-menu
                      v-model="menuPaymentRefDate"
                      placeholder="Insert Payment Ref Date"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="formTransferItem.paymentRefDate"
                          label="Payment Date"
                          :append-icon="icons.mdiCalendar"
                          readonly
                          dense
                          hide-details
                          v-bind="attrs"
                          v-on="on"
                          clearable
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="formTransferItem.paymentRefDate"
                        color="primary"
                        @input="menuPaymentRefDate = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0">
                    <vuetify-money
                      dense
                      v-model="formTransferItem.amount"
                      label="Amount"
                      v-bind:readonly="readonly || editItemList"
                      v-bind:disabled="disabled"
                      v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                      v-bind:options="options"
                      v-bind:properties="properties"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0">
                    <vuetify-money
                      dense
                      v-model="formTransferItem.totalTransferAmount"
                      label="Total Transfer Amount"
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
                      label="Remark"
                      v-model="formTransferItem.remark"
                      placeholder="Add Remark"
                      dense
                      outlined
                      hide-details
                      rows="3"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions> </v-card-actions>
              <v-card-title>
                <span class="form-title">Transfer Item List</span>
                <v-spacer></v-spacer>
                <v-dialog v-model="formData" persistent width="700">
                  <v-card>
                    <v-card-title class="font-weight-bold px-8">
                      Reason Document
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
                              placeholder="Add Reason"
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
                <v-btn
                  class="mt-4"
                  color="primary"
                  outlined
                  small
                  dark
                  @click="editItemList ? editItem() : addItem()"
                >
                  <v-icon dark left>
                    {{
                      editItemList
                        ? icons.mdiClipboardEditOutline
                        : icons.mdiPlus
                    }}
                  </v-icon>
                  {{ editItemList ? "Update Item" : "Add Item" }}
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="
                    form.workflowStatus == 'NONE' ? headers : headersEdit
                  "
                  :items="mainDataItemList"
                  :items-per-page="25"
                  :footer-props="{
                    'items-per-page-options': [25, 50, 100],
                  }"
                  fixed-header
                  dense
                >
                  <!-- GL Activity-->
                  <template #[`item.activityGl`]="{ item }">
                    <div class="d-flex align-center">
                      <div class="d-flex flex-column ms-3">
                        <span
                          class="
                            d-block
                            text--primary
                            font-weight-semibold
                            text-truncate
                          "
                          >{{ item.activityGlName }}</span
                        >
                        <span class="text-xs">{{ item.activityGlCode }}</span>
                      </div>
                    </div>
                  </template>

                  <!-- rekening info -->
                  <template #[`item.sumber`]="{ item }">
                    <div class="d-flex align-center">
                      <v-avatar color="#e6e6e6" size="30">
                        <v-img
                          :src="
                            require(`@/assets/images/logos/bank_logo/${item.bankCodeFrom}_logo.png`)
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
                          >{{ item.accountNameFrom }}</span
                        >
                        <span class="text-xs">{{ item.accountNoFrom }}</span>
                      </div>
                    </div>
                  </template>
                  <template #[`item.tujuan`]="{ item }">
                    <div class="d-flex align-center">
                      <v-avatar color="#e6e6e6" size="30">
                        <v-img
                          :src="
                            require(`@/assets/images/logos/bank_logo/${item.bankCode}_logo.png`)
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

                  <!-- format tanggal-->
                  <template #[`item.tanggal`]="{ item }">
                    {{ dateFormat(item.paymentRefDate) }}
                  </template>

                  <!-- format uang-->
                  <template #[`item.transferAmount`]="{ item }">
                    Rp.{{ number_format(item.amount) }}
                  </template>
                  <template #[`item.totalTransferAmount`]="{ item }">
                    Rp.{{ number_format(item.totalTransferAmount) }}
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
                          @click="editDataItem(item)"
                          v-on="on"
                          v-show="!formEdit"
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
                          @click="confirmDialog(item.id)"
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
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" class="mb-0"> </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="3" v-show="formHistori">
        <!--        v-scroll.self="onScroll" class="overflow-y-auto" max-height="700"-->
        <v-card>
          <v-card-title class="pt-0">
            <span>History Document</span>
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
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import Form from "vform";
import moment from "moment";
import axios from "@axios";
import themeConfig from "@themeConfig";
import {
  mdiCalendar,
  mdiCheck,
  mdiCheckAll,
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiDelete,
  mdiEyeOutline,
  mdiPlus,
  mdiReplay,
  mdiExitToApp,
} from "@mdi/js";
import { dateFormat, isInArray, number_format } from "../../../constan";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppAutocompliteCashbankOu from "@core/components/app-autocomplite-ou/AppAutocompliteCashbankOu";
import AppAutocompliteStatus from "@core/components/app-autocomplite-ou/AppAutocompliteStatus";
import "../../styles/textstyle.css";

export default {
  name: "ChildForm",
  components: {
    AppAutocompliteOu,
    AppAutocompliteCashbankOu,
    AppAutocompliteStatus,
    AppCardLoader,
  },
  data() {
    return {
      labelDocNo: themeConfig.labeling.docNo,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      extDocNo: themeConfig.labeling.extDocNo,
      extDocDate: themeConfig.labeling.extDocDate,
      ouBranch: themeConfig.labeling.ouTblB,
      ouSubBranch: themeConfig.labeling.ouTblSB,
      sourceBank: themeConfig.labeling.sourceBank,

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

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      isDialogVisible: false,
      menuDocDate: false,
      menuExtDocDate: false,
      menuPaymentRefDate: false,
      formData: false,
      formEdit: false,
      formCashBankTransfer: false,
      formHistori: false,
      editItemList: false,
      showSubmit:
        isInArray(
          "submitCashbankTransfer",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showCR:
        isInArray(
          "changesCashbankTransfer",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showSimpan:
        isInArray(
          "editCashbankTransfer",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      type: "",
      ouList: [],
      activityGlList: [],
      cashBankList: [],
      mainDataItemList: [],
      mainDataHistory: [],
      mainDataDeposit: [],
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
      },

      form: new Form({
        id: "",
        reqId: "",
        ouId: -99,
        activityGlId: -99,
        docNo: "",
        docDate: moment().format("YYYY-MM-DD"),
        extDocNo: "",
        extDocDate: "",
        modePayment: "",
        reason: "",
        remark: "",
        workflowStatus: "NONE",
      }),

      formTransferItem: new Form({
        id: "",
        tenantId: "",
        inOutCashbankId: "",
        cashbankFromId: -99,
        cashbankToId: -99,
        bankCode: "",
        accountNo: "",
        accountName: "",
        bankCodeTo: "",
        accountNoTo: "",
        accountNameTo: "",
        paymentRefNo: "",
        paymentRefDate: moment().format("YYYY-MM-DD"),
        amount: 0,
        totalTransferAmount: 0,
        remark: "",
      }),
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Source Bank",
          value: "sumber",
          width: "250px",
        },
        {
          text: "Beneficiary Bank",
          value: "tujuan",
          width: "250px",
        },
        {
          text: "Payment Ref No",
          value: "paymentRefNo",
          width: "200px",
        },
        {
          text: "Payment Ref Date",
          value: "tanggal",
          width: "200px",
        },
        {
          text: "Amount",
          align: "right",
          value: "transferAmount",
          width: "150px",
        },
        {
          text: "Total Transfer",
          align: "right",
          value: "totalTransferAmount",
          width: "175px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
      ],
      headersEdit: [
        {
          text: "Activity",
          value: "activityGl",
          width: "250px",
        },
        {
          text: "Source Bank",
          value: "sumber",
          width: "250px",
        },
        {
          text: "Beneficiary Bank",
          value: "tujuan",
          width: "250px",
        },
        {
          text: "Payment Ref No",
          value: "paymentRefNo",
          width: "200px",
        },
        {
          text: "Date",
          value: "tanggal",
          width: "150px",
        },
        {
          text: "Amount",
          align: "right",
          value: "transferAmount",
          width: "150px",
        },
        {
          text: "Total Transfer",
          align: "right",
          value: "totalTransferAmount",
          width: "175px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
      ],
      headersDeposit: [
        {
          text: "OUBranch",
          value: "ouBranch",
          width: "200px",
        },
        {
          text: "OUSubBranch",
          value: "ouSubBranch",
          width: "200px",
        },
        {
          text: "Account",
          value: "account",
          width: "200px",
        },
        {
          text: "Amount",
          value: "amount",
          width: "200px",
          align: "right",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("appAutocompliteOuCashbankTransferWithoutDeposit", (msg) => {
      this.form.ouId = msg;
      // this.getChild(msg);
    });
    this.$root.$on("appAutocompliteCashbankOu", (msg) => {
      this.getAccountInfo(msg);
    });
    this.$root.$on("formCashBankTransferForm2", (msg) => {
      this.getActivityGl();
      this.form.reset();
      this.form.clear();
      if (msg[1] == "editForm") {
        this.formHistori = false;
        this.getDetailTransfer(msg[0].id);
        this.getCurDocStatus(msg[0].id);
        this.formEdit = true;
      } else if (msg[1] == "editFormDokumen") {
        this.formHistori = false;
        this.getDetailTransfer(msg[0].docId);
        this.getCurDocStatus(msg[0].docId);
        this.formEdit = true;
      } else {
        this.formEdit = false;
        this.mainDataItemList = [];
        this.form.workflowStatus = "NONE";
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
      if (
        this.mainDataItemList.length > 0 &&
        this.form.workflowStatus == "NONE"
      ) {
        this.$dialog
          .confirm("Document list item has not been saved, sure exit?.", {
            loader: true,
          })
          .then((dialog) => {
            dialog.close();
            this.ouList = [];
            this.cashBankList = [];
            this.formTransferItem.clear();
            this.formTransferItem.reset();
            this.$root.$emit(
              "formCashBankTransfer2",
              this.formCashBankTransfer
            );
            this.$root.$emit("formCashBankTransferReturn", "Cancel deposit!.");
          })
          .catch(() => {});
      } else {
        this.formTransferItem.clear();
        this.formTransferItem.reset();
        this.ouList = [];
        this.cashBankList = [];
        this.$root.$emit("formCashBankTransfer2", this.formCashBankTransfer);
        this.$root.$emit(
          "formCashBankTransferReturn",
          "Tambah data berhasil!."
        );
      }
    },
    getChild() {
      this.$root.$emit(
        "appAutocompliteOuCashbankTransferWithoutDeposit",
        this.form.ouId
      );
    },
    getAccountInfo(msg) {
      if (msg.type == "Source Bank") {
        this.formTransferItem.bankCode = msg.bankCode;
        this.formTransferItem.accountNo = msg.accountNo;
        this.formTransferItem.accountName = msg.accountName;
      } else if (msg.type == "Beneficiary Bank") {
        this.formTransferItem.bankCodeTo = msg.bankCode;
        this.formTransferItem.accountNoTo = msg.accountNo;
        this.formTransferItem.accountNameTo = msg.accountName;
      }
    },
    getActivityGl() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/activity-gl/list`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.activityGlList = response.data.result);
          this.activityGlList = [];
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    confirmDialog(id) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.removeData(id);
          setTimeout(() => {
            dialog.close();
          }, 1500);
        })
        .catch(() => {
          // this.refreshData()
        });
    },
    editDataItem(data) {
      this.formEdit = false;
      this.editItemList = true;
      this.formTransferItem.fill(data);
      this.formTransferItem.clear();
      this.formTransferItem.paymentRefDate = moment(data.paymentRefDate).format(
        "YYYY-MM-DD"
      );
    },
    addItem() {
      this.isDialogVisible = true;
      var id = 1;
      if (this.mainDataItemList.length > 0) {
        id = this.mainDataItemList[this.mainDataItemList.length - 1].id + 1;
      }
      var valueToPush = {};
      valueToPush["id"] = id;
      valueToPush["cashbankFromId"] = parseInt(
        this.formTransferItem.cashbankFromId
      );
      valueToPush["cashbankToId"] = parseInt(
        this.formTransferItem.cashbankToId
      );
      valueToPush["bankCodeFrom"] = this.formTransferItem.bankCode;
      valueToPush["accountNoFrom"] = this.formTransferItem.accountNo;
      valueToPush["accountNameFrom"] = this.formTransferItem.accountName;
      valueToPush["bankCode"] = this.formTransferItem.bankCodeTo;
      valueToPush["accountNo"] = this.formTransferItem.accountNoTo;
      valueToPush["accountName"] = this.formTransferItem.accountNameTo;
      valueToPush["paymentRefNo"] = this.formTransferItem.paymentRefNo;
      valueToPush["paymentRefDate"] = moment(
        this.formTransferItem.paymentRefDate
      ).format("YYYYMMDD");
      valueToPush["amount"] = parseFloat(this.formTransferItem.amount);
      valueToPush["totalTransferAmount"] = parseFloat(
        this.formTransferItem.totalTransferAmount
      );
      valueToPush["remark"] = this.formTransferItem.remark;
      this.mainDataItemList.push(valueToPush);
      this.formTransferItem.clear();
      this.formTransferItem.reset();
      this.notif("success", "Sukses", "Item list berhasil ditambahkan!.");
      this.isDialogVisible = false;
    },
    editItem() {
      this.mainDataItemList.forEach((element, index) => {
        if (element.id === this.formTransferItem.id) {
          this.mainDataItemList[index].paymentRefNo =
            this.formTransferItem.paymentRefNo;
          this.mainDataItemList[index].totalTransferAmount = parseFloat(
            this.formTransferItem.totalTransferAmount
          );
          this.mainDataItemList[index].paymentRefDate = moment(
            this.formTransferItem.paymentRefDate
          ).format("YYYYMMDD");
          this.formTransferItem.clear();
          this.formTransferItem.reset();
          this.editItemList = false;
        }
      });
    },
    removeData(id) {
      this.isDialogVisible = true;
      this.mainDataItemList = this.mainDataItemList.filter(function (item) {
        return item["id"] != id;
      });
      this.isDialogVisible = false;
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
          `${themeConfig.app.api_cb}/transfer/add`,
          {
            scheme: "CB02",
            ouId: this.form.ouId,
            docNo: this.form.docNo,
            activityGlId: this.form.activityGlId,
            docDate: moment(this.form.docDate).format("YYYYMMDD"),
            extDocNo: this.form.extDocNo,
            extDocDate:
              this.form.extDocDate == ""
                ? ""
                : moment(this.form.extDocDate).format("YYYYMMDD"),
            modePayment: this.form.modePayment,
            reason: this.form.reason,
            remark: this.form.remark,
            transferList: this.mainDataItemList,
          },
          config
        )
        .then((response) => {
          // this.formData = false
          // this.formEdit = true
          // this.notif('success','Sukses','Tambah data berhasil!.')

          this.formData = false;
          this.formEdit = true;
          this.isDialogVisible = false;
          this.form.reason = "";
          this.notif("success", "Sukses", "Tambah data berhasil!.");
          this.getDetailTransfer(response.data.result);
          this.getCurDocStatus(response.data.result);
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
          `${themeConfig.app.api_awe}/approval/current-document/CB02/${id}`,
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
          this.notif("error", "Failed", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getDetailTransfer(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_cb}/transfer/detail/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.form.id = response.data.result.inOutCashbank.id;
          this.form.ouId = response.data.result.inOutCashbank.ouId;
          this.form.activityGlId =
            response.data.result.inOutCashbank.activityGlId;
          this.form.docNo = response.data.result.inOutCashbank.docNo;
          this.form.extDocNo = response.data.result.inOutCashbank.extDocNo;
          this.form.remark = response.data.result.inOutCashbank.remark;
          this.form.docDate = moment(
            response.data.result.inOutCashbank.docDate
          ).format("YYYY-MM-DD");
          this.form.extDocDate =
            response.data.result.inOutCashbank.extDocDate == ""
              ? ""
              : moment(response.data.result.inOutCashbank.extDocDate).format(
                  "YYYY-MM-DD"
                );
          this.form.modePayment =
            response.data.result.inOutCashbank.modePayment;
          if (response.data.result.inOutCashbankTransferItemList !== null) {
            this.mainDataItemList =
              response.data.result.inOutCashbankTransferItemList;
          } else {
            this.mainDataItemList = [];
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
    editData() {
      if (this.formEdit == true && this.type == "Simpan") {
        //Edit data disbursement
        this.editTransfer();
      } else if (this.formEdit == true && this.type == "Submit") {
        //Submit data disbursement
        this.submitTransfer();
      } else if (this.formEdit == true && this.type == "CR") {
        //Change request data disbursement
        this.changeRequestTransfer();
      }
    },
    editTransfer() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/transfer/edit`,
          {
            scheme: "CB02",
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
          this.form.reason = "";
          this.notif("success", "Sukses", "Edit data berhasil!.");
          this.getDetailTransfer(response.data.result);
          this.getCurDocStatus(response.data.result);
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
    submitTransfer() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/transfer/submit`,
          {
            scheme: "CB02",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.isDialogVisible = false;
          this.form.reason = "";
          this.notif("success", "Sukses", "Submit data berhasil!.");
          this.getDetailTransfer(response.data.result);
          this.getCurDocStatus(response.data.result);
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
    changeRequestTransfer() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_cb}/transfer/changes-request`,
          {
            scheme: "CB02",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.isDialogVisible = false;
          this.notif("success", "Sukses", "Change Request data berhasil!.");
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
