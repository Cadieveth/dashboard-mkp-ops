<template>
  <div>
    <app-modal-additional-cost :openModal="formGL"> </app-modal-additional-cost>
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
          <span class="form-header">Disbursement Transfer Upload </span>
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
                color="info"
                dark
                small
                @click="showHistory()"
                v-show="formEdit && !formHistori"
              >
                <v-icon dark left>
                  {{ icons.mdiEyeOutline }}
                </v-icon>
                History
              </v-btn>
              <v-btn
                color="success"
                dark
                small
                @click="showHistory()"
                v-show="formEdit && !formHistori"
              >
                <v-icon dark left>
                  {{ icons.mdiEyeOutline }}
                </v-icon>
                Upload Transfer
              </v-btn>
              <!-- <v-tooltip bottom color="info">
                <template #activator="{ on, attrs }">
                  <v-btn
                    color="info"
                    x-small
                    dark
                    fab
                    @click="showHistory()"
                    v-show="formEdit && !formHistori"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon size="22" dark>
                      {{ icons.mdiEyeOutline }}
                    </v-icon>
                  </v-btn>
                </template>
                <span>History</span>
              </v-tooltip> -->

              <v-dialog v-model="formData" persistent width="700">
                <v-card>
                  <v-card-title class="font-weight-bold px-8">
                    Document Reason
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
                      dark
                      small
                      @click="formEdit ? editData() : addData()"
                    >
                      <v-icon dark left>
                        {{ icons.mdiCheckboxMarkedCircleOutline }}
                      </v-icon>
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-actions>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <app-autocomplite-ou
                    :form-value.sync="form.ouId"
                    :readOnly="true"
                    :clearable="!formEdit"
                  ></app-autocomplite-ou>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                  <v-autocomplete
                    label="Bank Source"
                    v-model="form.cashbankId"
                    :items="cashBankList"
                    item-text="cashbankName"
                    item-value="cashbankId"
                    placeholder="Select Bank Source"
                    dense
                    hide-details
                    :readonly="formEdit"
                    :clearable="!formEdit"
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
                    <v-col cols="12" md="6" class="pb-0 mt-2">
                      <v-text-field
                        :label="docNo"
                        v-model="form.docNo"
                        dense
                        placeholder="Insert Document No"
                        hide-details
                        :readonly="formEdit"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0 mt-2">
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
                            :label="docDateLbl"
                            :append-icon="icons.mdiCalendar"
                            readonly
                            dense
                            placeholder="Select Document Date"
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
                    <v-col cols="12" md="6" class="pb-0 mt-2">
                      <v-text-field
                        :label="extDocNo"
                        v-model="form.extDocNo"
                        placeholder="Insert Ext Document No"
                        dense
                        hide-details
                        :readonly="
                          form.statusDoc != 'NONE' && form.statusDoc != 'DRAFT'
                        "
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0 mt-2">
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
                            :label="extDocDateLbl"
                            :append-icon="icons.mdiCalendar"
                            readonly
                            dense
                            hide-details
                            placeholder="Select Ext Document No"
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
                    <v-col cols="12" md="6" class="pb-0 mt-2">
                      <v-select
                        :label="partner"
                        v-model="form.partnerId"
                        placeholder="Select Partner"
                        :items="partnerList"
                        item-text="partnerName"
                        item-value="id"
                        @change="getPartnerBank(form.partnerId)"
                        dense
                        hide-details
                        :readonly="true"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0 mt-2">
                      <v-row>
                        <v-col cols="12" md="12">
                          <v-autocomplete
                            label="Bank Partner"
                            v-model="form.bankCodeId"
                            :items="partnerBankList"
                            placeholder="Select Bank Partner"
                            item-value="id"
                            @change="getAccountInfo(form.bankCodeId)"
                            dense
                            hide-details
                            :readonly="formEdit"
                            :append-icon="icons.mdiCashCheck"
                            @click:append-outer="cekFeeFlip()"
                          >
                            <template #selection="data">
                              <v-avatar left color="#e6e6e6" size="30">
                                <v-img
                                  :src="
                                    require(`@/assets/images/logos/bank_logo/${data.item.logoImage}_logo.png`)
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
                    <v-col cols="12" md="6" class="pb-0 mt-1">
                      <v-text-field
                        label="Account No"
                        v-model="form.accountNo"
                        dense
                        placeholder="Insert Account No"
                        readonly
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0 mt-1">
                      <v-text-field
                        label="Account Name"
                        v-model="form.accountName"
                        placeholder="Insert Account Name"
                        dense
                        readonly
                        hide-details
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="12">
                  <v-row>
                    <v-col cols="12" md="6" class="pb-0" v-show="!formEdit">
                      <vuetify-money
                        dense
                        label="Amount Disbursement"
                        v-model="form.transferAmount"
                        placeholder="Insert Amount Disbursement"
                        readonly
                        v-bind:disabled="disabled"
                        v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                        hide-details
                      />
                      <!-- <vue-numeric
                        :style="{
                          borderBottom: '1px solid #ccc',
                          borderRadius: '0px',
                          padding: '5px',
                          color: $vuetify.theme.isDark ? '#ADAAC4' : '#000000',
                        }"
                        v-model="form.transferAmount"
                        :currency="'Rp.'"
                        v-bind:precision="2"
                        thousand-separator="."
                        decimal-separator=","
                      /> -->
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0" v-show="showFee">
                      <v-text-field
                        label="Admin Fee Bank"
                        placeholder="Insert Admin Fee Bank"
                        v-model="form.transferFeeAmount"
                        dense
                        hide-details
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        class="mt-2"
                        label="Remark"
                        v-model="form.remark"
                        placeholder="Add Remark"
                        outlined
                        readonly
                        dense
                        hide-details
                      ></v-textarea>
                    </v-col>
                    <!-- <v-col col="12" md="12" v-show="formEdit" class="mt-2">
                      <v-card outlined>
 
                      </v-card>
                    </v-col> -->
                    <v-col col="12" md="12" v-show="formEdit">
                      <v-card outlined>
                        <v-card-title class="py-4"
                          ><h4>Disbursement Information</h4></v-card-title
                        >
                        <v-card-text>
                          <v-row class="pt-1">
                            <v-col cols="12" md="3">
                              <v-text-field
                                label="Amount Disbursement"
                                v-model="form.trAmount"
                                dense
                                hide-details
                                readonly
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                              <v-text-field
                                label="Additional Cost"
                                v-model="totalDisbursement"
                                dense
                                hide-details
                                readonly
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                              <v-text-field
                                label="Admin Fee"
                                v-model="form.feeAmount"
                                dense
                                hide-details
                                readonly
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                              <v-text-field
                                label="Nett Transfer to Partner"
                                v-model="form.nettAmount"
                                dense
                                hide-details
                                readonly
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-card-title class="py-4"
                          ><h4>Bank Information</h4></v-card-title
                        >
                        <v-card-text>
                          <v-row class="pt-1">
                            <v-col cols="12" md="6">
                              <v-text-field
                                label="Admin Fee Bank"
                                v-model="form.feeBankAmount"
                                dense
                                hide-details
                                readonly
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-text-field
                                label="Total Transfer"
                                v-model="form.payAmount"
                                dense
                                hide-details
                                readonly
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="py-0 mt-4" cols="12" md="12">
                  <v-card outlined>
                    <v-card-title class="">
                      <span class="">Additional Cost </span>
                      <v-spacer></v-spacer>
                      <v-btn
                        v-show="form.statusDoc === 'NONE'"
                        @click="openGL()"
                        dark
                        small
                        color="info"
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
                        :headers="
                          form.statusDoc === 'NONE'
                            ? headersGlSelect
                            : headersGlSelectNoAction
                        "
                        :items="mainDataCost"
                        disable-pagination
                        hide-default-footer
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
                                @click="confirmDialogDraft(item)"
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
                  </v-card>
                </v-col>

                <v-col v-for="(item, index) in filteredItems" :key="index">
                  <v-card-title class="py-0 mb-n4">
                    <span>
                      {{ index }}
                    </span>
                    <v-spacer></v-spacer>
                    <div></div>
                  </v-card-title>
                  <div v-for="(value, valueIndex) in item" :key="valueIndex">
                    <v-card-text class="pb-0 mb-n2">
                      <p class="text-lg font-weight-bold text-black">
                        ‣ {{ valueIndex }}
                      </p>
                      <v-spacer></v-spacer>
                      <div></div>
                    </v-card-text>
                    <v-data-table
                      :headers="headersInvoiceList"
                      :items="addedAmount(value)"
                      disable-pagination
                      hide-default-footer
                      fixed-header
                      max-height="500px"
                      dense
                    >
                      <template #[`header.ou`]>
                        {{ ouTbl }}
                      </template>

                      <!-- format tanggal-->
                      <template #[`item.docDate`]="{ item }">
                        {{ dateFormat(item.docDate) }}
                      </template>
                      <template #[`item.dueDate`]="{ item }">
                        {{ dateFormat(item.dueDate) }}
                      </template>

                      <!-- format tanggal-->
                      <template #[`item.refDocDate`]="{ item }">
                        {{ dateFormat(item.refDocDate) }}
                      </template>
                      <template #[`item.refDueDate`]="{ item }">
                        {{ dateFormat(item.refDueDate) }}
                      </template>
                      <template #[`item.paymentMethodCode`]="{ item }">
                        <p
                          :class="
                            item.paymentMethodCode === 'Amount'
                              ? 'font-weight-bold mb-n1  text-lg text-muted'
                              : ' mb-n1'
                          "
                        >
                          {{ item.paymentMethodCode }}
                        </p>
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

                      <!-- format uang-->
                      <template #[`item.realizationAmount`]="{ item }">
                        <p
                          :class="
                            item.realizationAmount === sumTotalAmount(value) &&
                            item.paymentMethodCode === 'Amount'
                              ? 'font-weight-bold mb-n1 text-lg text-muted'
                              : ' mb-n1'
                          "
                        >
                          Rp.{{ number_format(item.realizationAmount) }}
                        </p>
                      </template>
                    </v-data-table>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="mt-4">
              <v-spacer></v-spacer>
              <v-btn small dark color="secondary" @click="closeForm()">
                <v-icon dark left>
                  {{ icons.mdiExitToApp }}
                </v-icon>
                Exit
              </v-btn>
              <v-btn
                color="primary"
                dark
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
                Save
              </v-btn>
              <v-btn
                color="error"
                dark
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
                dark
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
      <v-col class="" cols="12" md="3" v-show="formHistori">
        <span class="form-header">Document History</span>
        <v-card>
          <v-card-title class="mt-4">
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
          <v-card-text class="mt-n6">
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
  mdiExitToApp,
  mdiPlus,
  mdiDelete,
} from "@mdi/js";
import Form from "vform";
import axios from "@axios";
import themeConfig from "@themeConfig";
import moment from "moment";
import { dateFormat, isInArray, number_format } from "../../../constan";
import { required } from "@core/utils/validation";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import "../../styles/textstyle.css";
import AppModalAdditionalCost from "@/@core/components/app-modal-popup/AppModalAdditionalCost.vue";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";

export default {
  name: "Child",
  components: {
    AppAutocompliteOu,
    AppModalAdditionalCost,
    AppCardLoader,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      docDateLbl: themeConfig.labeling.docDate,
      extDocNo: themeConfig.labeling.extDocNo,
      extDocDateLbl: themeConfig.labeling.extDocDate,
      partner: themeConfig.labeling.partner,
      ouTbl: themeConfig.labeling.ouTbl,
      ouCode: themeConfig.labeling.ouCodeTbl,
      ouName: themeConfig.labeling.ouNameTbl,
      ou: themeConfig.labeling.ou,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      formGL: false,
      totalDisbursement: 0,

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
      showFee: false,
      showCekFee: false,
      docDate: false,
      extDocDate: false,
      formData: false,
      formEdit: false,
      formHistori: false,
      type: "",
      docTypeId: -99,
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

      items: [],
      filteredItems: [],

      ouList: [],
      cashBankList: [],
      partnerList: [],
      partnerBankList: [],
      mainDataHistory: [],
      invoiceList: [],
      mainDataCost: [],

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
        mdiExitToApp,
        mdiPlus,
        mdiDelete,
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
        partnerBank: -99,
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
          text: "Unit Bisnis",
          value: "ou",
          width: "250px",
        },
        {
          text: "Payment Method",
          value: "paymentMethodCode",
          width: "175px",
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
      headersGlSelect: [
        {
          text: "Action",
          value: "actions",
          width: "50px",
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
      headersGlSelectNoAction: [
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
    };
  },
  async mounted() {
    this.$root.$on("appModalAdditionalCost", (msg) => {
      this.formGL = msg;
    });
    this.$root.$on("additionalCostData", (msg) => {
      this.mainDataCost = msg;
    });
    this.$root.$on("appAutocompliteOuCashbankDisbursementForm", (msg) => {
      this.getChild(msg);
    });
    await this.$root.$on("formCashBankDisbursForm", async (msg) => {
      // this.getOuList()
      this.form.reset();
      this.form.clear();
      this.mainDataCost = [];
      if (msg[1] == "editForm") {
        this.formHistori = false;
        // this.getCurDocStatus(msg[0].id)
        this.getDetailDisbursement(msg[0].id);
        this.formEdit = true;
      } else if (msg[1] == "editFormDokumen") {
        this.formHistori = false;
        // this.getCurDocStatus(msg[0].docId)
        this.getDetailDisbursement(msg[0].docId);
        this.formEdit = true;
      } else {
        // this.invoiceList = [];
        this.formEdit = false;
        this.formHistori = false;
        this.getOuIdDefautl(msg[0]);
        this.form.statusDoc = "NONE";
        // this.invoiceList = msg[2];
        this.form.transferAmount = msg[3];
        this.invoiceList = msg[2];
        // this.items = this.sortData("ouName");
        this.items = await this.groupDataByCategories(this.invoiceList, [
          "ouName",
          "paymentMethodCode",
        ]);
        this.filteredItems = this.items;
        console.log(this.filteredItems);

        // Object.keys(this.filteredItems).forEach((key) => {
        //   this.filteredItems[key].sort((a, b) => {
        //     const dateA = parseInt(a.refDocDate);
        //     const dateB = parseInt(b.refDocDate);
        //     if (dateA < dateB) return -1;
        //     if (dateA > dateB) return 1;
        //     return 0;
        //   });
        // });
      }
    });
  },
  methods: {
    // async getBankCode() {
    //   let bankCode = await this.cashBankList.find(
    //     (item) => item.cashbankId == this.form.cashbankId
    //   );
    //   this.form.bankCode = bankCode.cashbankName;
    // },
    openGL() {
      this.formGL = true;
    },
    sumTotalAmount(data) {
      var amount = 0;
      data.forEach((item) => {
        amount += item.realizationAmount;
      });
      return amount;
    },
    confirmDialogDraft(item) {
      this.$dialog
        .confirm("Delete this additinal cost?", {
          loader: true,
        })
        .then((dialog) => {
          dialog.close();

          const index = this.mainDataCost.findIndex(
            (obj) => obj.id === item.id
          );

          if (index !== -1) {
            this.mainDataCost.splice(index, 1);
          }
          this.$root.$emit("deleteSelectedAdditionalCost", item.id);
        })
        .catch(() => {});
    },
    async getOuIdDefautl(data) {
      this.form.ouId = data.ouId;
      this.form.partnerId = data.partnerId;
      this.form.bankCodeId = data.partnerBank;
      await this.getCashBank(data.ouId);
      await this.getPartner(data.ouId);
      await this.getPartnerBank(data.partnerId);
      await this.getAccountInfo(this.form.bankCodeId);
    },
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    dateFormat(value) {
      const result = value === undefined ? "" : dateFormat(value);
      return result;
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    addedAmount(item) {
      // console.log(item);
      const newData = {
        paymentMethodCode: "Amount",
        realizationAmount: this.sumTotalAmount(item),
      };

      var result = _.concat(item, newData);
      return result;
    },
    closeForm() {
      this.mainDataCost = [];
      this.cashBankList = [];
      this.partnerList = [];
      this.partnerBankList = [];
      this.$root.$emit("formCashBankManualDisburs", false);
      this.$root.$emit("formCashBankDisbursReturn", "Tambah data berhasil!.");
      this.$root.$emit("resetAppModalAdditionalCost", "reset");
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
    sortData(columnName) {
      var sortedData = {};

      for (var i = 0; i < this.invoiceList.length; i++) {
        var object = this.invoiceList[i];

        if (Object.keys(sortedData).indexOf(object[columnName]) === -1) {
          sortedData[object[columnName]] = [];
        }

        sortedData[object[columnName]].push(object);
      }
      return sortedData;
    },
    async groupDataByCategories(dataArray, categoryKeys) {
      const groupedData = dataArray.reduce((result, item) => {
        const categories = categoryKeys.map((key) => item[key]);

        categories.reduce((nestedObj, category, index) => {
          if (!nestedObj[category]) {
            nestedObj[category] = index === categoryKeys.length - 1 ? [] : {};
          }

          return nestedObj[category];
        }, result);

        result[categories[0]][categories[1]].push(item);

        return result;
      }, {});

      return groupedData;
    },
    async getInvoiceCashbank(id) {
      this.invoiceList = [];
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      try {
        let response = await axios.get(
          `${themeConfig.app.api_cb}/disbursement/detail-cashbank-invoice?inOutCashbankId=${id}`,
          config
        );
        if (response.data.result !== null) {
          this.invoiceList = response.data.result;
          // this.items = this.sortData("ouName");
          this.items = await this.groupDataByCategories(this.invoiceList, [
            "ouName",
            "paymentMethodCode",
          ]);
          this.filteredItems = this.items;
          console.log(this.filteredItems);

          // Object.keys(this.filteredItems).forEach((key) => {
          //   this.filteredItems[key].sort((a, b) => {
          //     const dateA = parseInt(a.refDocDate);
          //     const dateB = parseInt(b.refDocDate);
          //     if (dateA < dateB) return -1;
          //     if (dateA > dateB) return 1;
          //     return 0;
          //   });
          // });
        } else {
          this.invoiceList = [];
        }
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
          this.notif("error", "Gagal", e);
        } else {
          this.notif("error", "Gagal", e.response.data.meta.message);
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
            this.notif("error", "Gagal", e.response.data.meta.message);
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
        if (response.data.result !== null) {
          this.partnerBankList = response.data.result;
          this.partnerBankList.forEach((element, index) => {
            try {
              if (
                require("@/assets/images/logos/bank_logo/" +
                  this.partnerBankList[index].bankCode +
                  "_logo.png")
              ) {
                this.partnerBankList[index].logoImage =
                  this.partnerBankList[index].bankCode;
              }
            } catch (e) {
              this.partnerBankList[index].logoImage = "NONE";
            }
          });
          // this.form.accountName = this.partnerBankList.accountName;
          // this.form.accountNo = this.partnerBankList.accountNo;
          // this.form.bankCode = this.partnerBankList.bankCode;
        } else {
          this.partnerBankList = [];
        }
      } catch (e) {
        if (!e.response) {
          this.notif("error", "Gagal", e);
        } else {
          this.notif("error", "Gagal", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        }
      }
    },
    async getAccountInfo(bankCode) {
      for (var i = 0; i < this.partnerBankList.length; i++) {
        var obj = this.partnerBankList[i];
        if (obj.id == bankCode) {
          this.showCekFee = true;
          this.showFee = false;
          // this.form.bankCode = obj.bankCode;
          // this.form.accountNo = obj.accountNo;
          // this.form.accountName = obj.accountName;
          break;
        }
      }
      // partnerBankList
      var accountInfo = await this.partnerBankList.find(
        (item) => item.id == bankCode
      );
      this.form.accountNo = accountInfo.accountNo;
      this.form.accountName = accountInfo.accountName;
      this.form.bankCode = accountInfo.bankCode;
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
      var docType = "CB";
      if (this.docTypeId == 305) {
        docType = "CB05";
      } else if (this.docTypeId == 301) {
        docType = "CB01";
      }
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
          this.notif("error", "Gagal", e.response.data.meta.message);
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
        this.mainDataCost = response.data.result.costList;
        var additional = 0;
        if (this.mainDataCost != null) {
          this.mainDataCost.forEach((item) => {
            additional += item.costAmount;
          });
          this.totalDisbursement = number_format(additional, 2, ",", ".");
        } else {
          this.mainDataCost = [];
          this.totalDisbursement = number_format(0);
        }

        this.docTypeId = response.data.result.inOutCashbank.docTypeId;
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
        await this.getInvoiceCashbank(this.form.id);
        this.getCurDocStatus(id);
        this.isDialogVisible = false;
      } catch (e) {
        this.isDialogVisible = false;
        if (!e.response) {
          this.notif("error", "Gagal", e);
        } else {
          this.notif("error", "Gagal", e.response.data.meta.message);
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

      sessionStorage.removeItem("disbursementCreateForm");
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
            scheme: "CB01",
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
            refDocTypeId: -99,
            refId: -99,
            remark: this.form.remark,
            reason: this.form.reason,
            cashbankId: parseInt(this.form.cashbankId),
            transferAmount: parseFloat(this.form.transferAmount),
            invoiceApList: this.invoiceList,
            costList: this.mainDataCost,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.formEdit = true;
          this.isDialogVisible = false;
          this.notif("success", "Sukses", "Add Data Success!.");
          this.getDetailDisbursement(response.data.result);
          // this.getCurDocStatus(response.data.result)
          // this.closeForm()
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
            scheme: "CB01",
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
          this.getDetailDisbursement(this.form.id);
          this.notif("success", "Sukses", "Edit data berhasil!.");
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
            scheme: "CB01",
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.isDialogVisible = false;
          this.notif("success", "Sukses", "Submit data berhasil!.");
          this.getDetailDisbursement(response.data.result);
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
            scheme: "CB01",
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
  },
};
</script>
