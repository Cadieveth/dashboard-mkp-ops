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
    <v-dialog v-model="dataDepositModal" persistent width="900">
      <v-card class="card-style">
        <v-card-title class="">
          <span class="form-title"
            >Input Settlement With Deposit Item List</span
          >
          <v-spacer></v-spacer>
          <v-btn color="secondary" text small fab @click="closeFormDeposit()">
            <v-icon class="form-icon" dark>
              {{ icons.mdiClose }}
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" class="pb-0">
              <v-autocomplete
                label="Source Bank"
                v-model="formTransferItem.cashbankFromId"
                :items="cashBankList"
                item-text="cashbankName"
                item-value="cashbankId"
                dense
                hide-details
                @change="
                  getAccountInfo('Source Bank', formTransferItem.cashbankFromId)
                "
                readonly
              >
                <template #selection="data">
                  <v-avatar left color="#e6e6e6" size="30">
                    <v-img
                      :src="
                        require(`@/assets/images/logos/bank_logo/${data.item.bankCode}_logo.png`)
                      "
                    ></v-img>
                  </v-avatar>
                  <span class="font-weight-semibold">
                    {{ "&nbsp;" + data.item.cashbankCode }} -
                    {{ data.item.cashbankName }}</span
                  >
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
                          {{ data.item.cashbankCode }} -
                          {{ data.item.cashbankName }}</span
                        >
                      </v-list-item-title>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-autocomplete
                label="Beneficiary Bank"
                v-model="formTransferItem.cashbankToId"
                :items="cashBankList"
                item-text="cashbankName"
                item-value="cashbankId"
                dense
                hide-details
                @change="
                  getAccountInfo(
                    'Beneficiary Bank',
                    formTransferItem.cashbankToId
                  )
                "
                readonly
              >
                <template #selection="data">
                  <v-avatar left color="#e6e6e6" size="30">
                    <v-img
                      :src="
                        require(`@/assets/images/logos/bank_logo/${data.item.bankCode}_logo.png`)
                      "
                    ></v-img>
                  </v-avatar>
                  <span class="font-weight-semibold">
                    {{ "&nbsp;" + data.item.cashbankCode }} -
                    {{ data.item.cashbankName }}</span
                  >
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
                          {{ data.item.cashbankCode }} -
                          {{ data.item.cashbankName }}</span
                        >
                      </v-list-item-title>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 mt-2">
              <v-text-field
                label="Payment No"
                v-model="formTransferItem.paymentRefNo"
                dense
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 mt-2">
              <v-menu
                v-model="menuPaymentRefDate"
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
            <v-col cols="12" md="6" class="pb-0 mt-2">
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
            <v-col
              cols="12"
              md="6"
              class="pb-0 mt-2"
              v-show="form.typeInOutCashbank == 'Y'"
            >
              <vuetify-money
                dense
                v-model="formTransferItem.adminBank"
                label="Admin Bank"
                v-bind:readonly="readonly"
                v-bind:disabled="disabled"
                v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                v-bind:options="options"
                v-bind:properties="properties"
                hide-details
                @input="addAdminBank()"
              />
            </v-col>
            <v-col
              cols="12"
              :md="form.typeInOutCashbank == 'Y' ? '12' : '6'"
              class="pb-0 mt-2"
            >
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
            <v-col cols="12" class="pb-0">
              <v-textarea
                label="Remark"
                v-model="formTransferItem.remark"
                dense
                outlined
                hide-details
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="mt-2">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            small
            dark
            @click="editItem()"
            v-show="editItemList"
          >
            <v-icon dark left>
              {{ icons.mdiClipboardEditOutline }}
            </v-icon>
            Update Item
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="transferDetailModal" persistent width="1200">
      <v-card class="card-style">
        <v-card-title class="">
          <span class="form-title">Transaction Detail</span>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            small
            fab
            @click="closeTransferDetail()"
          >
            <v-icon class="form-icon" dark>
              {{ icons.mdiClose }}
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <app-autocomplite-cashbank-user
                :value-bank-ou.sync="formTransferDetail.cashbankFromId"
                :label-text="'Source Bank'"
                :read-only="true"
                :dense="false"
              >
              </app-autocomplite-cashbank-user>
            </v-col>
            <v-col cols="12" md="6">
              <app-autocomplite-cashbank-user
                :value-bank-ou.sync="formTransferDetail.cashbankToId"
                :label-text="'Beneficiary Bank'"
                :read-only="true"
                :dense="false"
              >
              </app-autocomplite-cashbank-user>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formTransferDetail.paymentRefNo"
                readonly
                dense
                label="Payment Refrence No"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <app-input-field-date
                :label-title="'Payment Refrence Date'"
                :value-date.sync="formTransferDetail.paymentRefDate"
                :read-only="true"
                :dense="true"
              ></app-input-field-date>
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                dense
                v-model="formTransferDetail.amount"
                readonly
                label="Transaction Amount"
              ></v-text-field>
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                dense
                v-model="formTransferDetail.totalTransferAmount"
                readonly
                label="Total Transfer Amount"
              ></v-text-field>
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                dense
                v-model="formTransferDetail.adminBank"
                readonly
                label="Admin Bank"
              ></v-text-field>
            </v-col>
            <v-col class="mt-n4" cols="12" md="6">
              <v-text-field
                dense
                v-model="formTransferDetail.remark"
                readonly
                label="Remark"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" :md="formHistori ? '9' : '12'" class="mb-0">
        <v-row>
          <v-col cols="12" class="mb-0">
            <span class="form-header"
              >Input Settlement With Deposit Item List</span
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
                  <v-col cols="12" md="6" class="pb-0">
                    <app-autocomplite-ou
                      :form-value.sync="form.ouId"
                      :readOnly="formEdit"
                      :clearable="!formEdit"
                    ></app-autocomplite-ou>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0">
                    <app-autocomplite-status
                      :lable-tittle="'Mode Transfer'"
                      :form-value.sync="form.modePayment"
                      :status-type="'TRANSFERMODE'"
                      :read-only="formEdit"
                      :clearable="!formEdit"
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
                  <v-col cols="12" md="6" class="pb-0 mt-2">
                    <v-text-field
                      :label="docNo"
                      v-model="form.docNo"
                      dense
                      hide-details
                      :readonly="formEdit"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0 mt-2">
                    <v-menu
                      v-model="menuDocDate"
                      :close-on-content-click="false"
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
                          readOnly
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
                  <v-col cols="12" md="6" class="pb-0 mt-2">
                    <v-text-field
                      :label="extDocNo"
                      v-model="form.extDocNo"
                      placeholder="Insert Document No"
                      dense
                      hide-details
                      :readonly="
                        form.workflowStatus != 'NONE' &&
                        form.workflowStatus != 'DRAFT'
                      "
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0 mt-2">
                    <v-menu
                      v-model="menuExtDocDate"
                      :close-on-content-click="false"
                      placeholder="Insert Ext Document No"
                      :nudge-right="40"
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
                          placeholder="Select Ext Document Date"
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
                  <v-col cols="12" md="6" class="pb-0 mt-2">
                    <span class="font-weight-bold text-xs"
                      >Transfer Internal</span
                    >
                    <v-radio-group
                      v-model="form.typeInOutCashbank"
                      class="mt-0 mb-0"
                      hide-details
                      @change="editItemByFlgTfInternal()"
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
                  <v-col cols="12" class="pb-0 mt-2">
                    <v-textarea
                      label="Remark"
                      v-model="form.remark"
                      placeholder="Insert Remark"
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
                <span class="form-title">Bank Transfer</span>
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
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="
                    form.workflowStatus === 'NONE' ? headers : headersApproved
                  "
                  :items="mainDataItemList"
                  :items-per-page="25"
                  disable-pagination
                  hide-default-footer
                  fixed-header
                  dense
                >
                  <!-- headers -->
                  <template #[`header.tanggal`]> {{ tanggal }} </template>
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
                            require(`@/assets/images/logos/bank_logo/${item.logoImageFrom}_logo.png`)
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

                  <!-- format tanggal-->
                  <template #[`item.tanggal`]="{ item }">
                    {{ dateFormat(item.paymentRefDate) }}
                  </template>

                  <template #[`item.paymentRefNo`]="{ item }">
                    <div class="d-flex align-center">
                      <v-avatar color="#e6e6e6" size="30">
                        <v-img
                          :src="
                            require(`@/assets/images/logos/bank_logo/${item.logoImageFrom}_logo.png`)
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
                          >{{ item.paymentRefAccountName }}</span
                        >
                        <span class="text-xs">{{ item.paymentRefNo }}</span>
                      </div>
                    </div>
                  </template>

                  <!-- format uang-->

                  <template #[`item.amount`]="{ item }">
                    Rp.{{ number_format(item.amount) }}
                  </template>
                  <template #[`item.amountExt`]="{ item }">
                    Rp.{{ number_format(item.amountExt) }}
                  </template>
                  <template #[`item.adminBank`]="{ item }">
                    Rp.{{ number_format(item.adminBank) }}
                  </template>
                  <template #[`item.transferAmount`]="{ item }">
                    Rp.{{ number_format(item.amount) }}
                  </template>
                  <template #[`item.totalTransferAmount`]="{ item }">
                    Rp.{{
                      form.workflowStatus === "NONE"
                        ? number_format(item.totalTransferAmount)
                        : form.typeInOutCashbank === "Y"
                        ? number_format(item.amount)
                        : number_format(item.totalTransferAmount)
                    }}
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
                    <v-tooltip bottom color="info">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          x-small
                          icon
                          color="info"
                          v-bind="attrs"
                          @click="depositItemDetail(item)"
                          v-on="on"
                          v-show="form.workflowStatus != 'NONE'"
                        >
                          <v-icon>
                            {{ icons.mdiFileDocumentMultipleOutline }}
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Detail</span>
                    </v-tooltip>
                    <v-tooltip bottom color="primary">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          x-small
                          icon
                          color="primary"
                          v-bind="attrs"
                          @click="depositConfrim(item.id)"
                          v-on="on"
                          v-show="form.workflowStatus != 'NONE'"
                        >
                          <v-icon>
                            {{ icons.mdiCashCheck }}
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Deposit</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-card-text>

              <v-card-title>
                <span class="form-title">Bank Transfer by Document</span>
                <v-spacer></v-spacer>
                <v-dialog
                  v-model="formDataTransferCashbank"
                  persistent
                  width="1200"
                >
                  <v-card>
                    <v-card-title class="font-weight-bold px-8">
                      Bank Transfer Document
                      <v-spacer></v-spacer>
                      <v-btn
                        color="secondary"
                        icon
                        small
                        @click="formDataTransferCashbank = false"
                      >
                        <v-icon>{{ icons.mdiClose }}</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" md="6" class="pb-0">
                            <app-autocomplite-cashbank-user
                              :label-text="sourceBank"
                              :value-bank-ou.sync="
                                formBankDocument.cashbankFromId
                              "
                            ></app-autocomplite-cashbank-user>
                          </v-col>
                          <v-col cols="12" md="6" class="pb-0">
                            <app-autocomplite-cashbank-user
                              :label-text="beneficiaryBank"
                              :value-bank-ou.sync="
                                formBankDocument.cashbankToId
                              "
                            ></app-autocomplite-cashbank-user>
                          </v-col>
                          <v-col cols="12" md="4" class="pb-0">
                            <v-btn
                              dark
                              small
                              color="primary"
                              @click="getTransferCashbankDocument()"
                            >
                              <v-icon dark left>
                                {{ icons.mdiMagnify }}
                              </v-icon>
                              Filter
                            </v-btn>
                          </v-col>
                          <v-col cols="12" md="12" class="p-0">
                            <v-data-table
                              :headers="headersCahsbankDocument"
                              :items="mainDataCahsbankDocument"
                              hide-default-footer
                              disable-pagination
                              fixed-header
                              max-height="500px"
                              dense
                              v-model="selected"
                              item-key="id"
                              show-select
                            >
                              <!--header-->
                              <template #[`header.docNo`]>
                                {{ docNo }}
                              </template>
                              <template #[`header.docDate`]>
                                {{ docDate }}
                              </template>

                              <!-- format tanggal-->
                              <template #[`item.docDate`]="{ item }">
                                {{ dateFormat(item.docDate) }}
                              </template>

                              <template #[`item.account`]="{ item }">
                                <!--                          {{ item.accountNo }} a/n {{ item.accountName }}-->
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
                                    <span class="text-xs">{{
                                      item.accountNo
                                    }}</span>
                                  </div>
                                </div>
                              </template>

                              <!-- format uang-->
                              <template #[`item.amount`]="{ item }">
                                Rp.{{ number_format(item.transferAmount) }}
                              </template>
                            </v-data-table>
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
                        @click="addItemTransferBank()"
                      >
                        <v-icon dark left>
                          {{ icons.mdiPlus }}
                        </v-icon>
                        Add Document
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-btn
                  dark
                  small
                  color="primary"
                  @click="showDokumentTransferCashbank()"
                  v-show="!formEdit"
                >
                  <v-icon dark left>
                    {{ icons.mdiMagnify }}
                  </v-icon>
                  Look Up Document
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="headersTransferCahsbank"
                  :items="mainDataTransferCahsbank"
                  :footer-props="{
                    'items-per-page-options': [25, 50, 100],
                  }"
                  hide-default-footer
                  disable-pagination
                  fixed-header
                  max-height="500px"
                  dense
                >
                  <!--header-->
                  <template #[`header.docNo`]>
                    {{ docNo }}
                  </template>
                  <template #[`header.docDate`]>
                    {{ docDate }}
                  </template>

                  <!-- format tanggal-->
                  <template #[`item.docDate`]="{ item }">
                    {{ dateFormat(item.docDate) }}
                  </template>

                  <template #[`item.account`]="{ item }">
                    <!--                          {{ item.accountNo }} a/n {{ item.accountName }}-->
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

                  <!-- format uang-->
                  <template #[`item.amount`]="{ item }">
                    Rp.{{ number_format(item.transferAmount) }}
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
                          @click="removeItemTransferBank(item.id)"
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

              <v-card-title
                ><span class="form-title"
                  >Detail Bank Transfer by Merchant</span
                ></v-card-title
              >
              <v-card-text>
                <v-data-table
                  :headers="headersDeposit"
                  :items="mainDataDeposit"
                  hide-default-footer
                  disable-pagination
                  fixed-header
                  max-height="500px"
                  dense
                >
                  <!--header-->
                  <template #[`header.ouBranch`]>
                    {{ ouBranch }}
                  </template>
                  <template #[`header.ouSubBranch`]>
                    {{ ouSubBranch }}
                  </template>
                  <template #[`header.account`]>
                    {{ sourceBank }}
                  </template>

                  <!-- Unit Bisnis -->
                  <template #[`item.ouBranch`]="{ item }">
                    <div>
                      <span
                        class="
                          d-block
                          text--primary
                          font-weight-semibold
                          text-truncate
                        "
                        >{{ item.ouBranchName }}</span
                      >
                      <span class="text-xs">{{ item.ouBranchCode }}</span>
                    </div>
                  </template>
                  <template #[`item.ouSubBranch`]="{ item }">
                    <div>
                      <span
                        class="
                          d-block
                          text--primary
                          font-weight-semibold
                          text-truncate
                        "
                        >{{ item.ouSubBranchName }}</span
                      >
                      <span class="text-xs">{{ item.ouSubBranchCode }}</span>
                    </div>
                  </template>

                  <!-- penerima-->
                  <template #[`item.account`]="{ item }">
                    <!--                          {{ item.accountNo }} a/n {{ item.accountName }}-->
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

                  <!-- format uang-->
                  <template #[`item.amount`]="{ item }">
                    Rp.{{ number_format(item.amount) }}
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-actions class="mt-2">
                <v-spacer></v-spacer>
                <v-btn small dark color="secondary" @click="closeForm('close')">
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
          <v-col cols="12" class="pb-0"> </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="3" class="" v-show="formHistori">
        <!--        v-scroll.self="onScroll" class="overflow-y-auto" max-height="700"-->
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
  mdiFileDocumentMultipleOutline,
  mdiFilePdfOutline,
  mdiMagnify,
  mdiCashCheck,
} from "@mdi/js";
import { dateFormat, isInArray, number_format } from "../../../constan";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppAutocompliteCashbankOu from "@core/components/app-autocomplite-ou/AppAutocompliteCashbank";
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocompliteOuBranch from "@core/components/app-autocomplite-ou/AppAutocompliteOuBranch";
import AppAutocompliteCashbank from "@core/components/app-autocomplite-ou/AppAutocompliteCashbank";
import AppAutocompliteCashbankUser from "@/@core/components/app-autocomplite-ou/AppAutocompliteCashbankUser.vue";
import AppAutocompliteStatus from "@core/components/app-autocomplite-ou/AppAutocompliteStatus";
import AppInputFieldDate from "@/@core/components/app-input-field/AppInputFieldDate.vue";
import "../../styles/textstyle.css";

export default {
  name: "ChildForm",
  components: {
    AppAutocompliteOu,
    AppAutocompliteCashbankOu,
    AppAutocompliteStatus,
    AppAutocompliteCashbank,
    AppAutocompliteOuBranch,
    AppAutocompliteOuCompany,
    AppAutocompliteCashbankUser,
    AppInputFieldDate,
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
      tanggal: themeConfig.labeling.tanggal,
      beneficiaryBank: themeConfig.labeling.beneficiaryBank,

      userId: JSON.parse(this.$session.get("userData")).uid,

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
      dataDepositModal: false,
      transferDetailModal: false,
      menuDocDate: false,
      menuExtDocDate: false,
      menuPaymentRefDate: false,
      formData: false,
      formEdit: false,
      formCashBankTransfer: false,
      formHistori: false,
      editItemList: false,
      formDataTransferCashbank: false,
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
      docTypeId: -99,
      ouList: [],
      activityGlList: [],
      cashBankList: [],
      mainDataItemList: [],
      mainDataHistory: [],
      mainDataDeposit: [],
      mainDataTransferCahsbank: [],
      mainDataCahsbankDocument: [],
      selected: [],
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
        mdiMagnify,
        mdiCashCheck,
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
        typeInOutCashbank: "N",
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
        adminBank: 0,
        totalTransferAmount: 0,
        remark: "",
      }),

      formTransferDetail: new Form({
        cashbankFromId: -99,
        cashbankToId: -99,
        paymentRefNo: "",
        paymentRefDate: "",
        amount: 0,
        totalTransferAmount: 0,
        adminBank: 0,
        remark: "",
      }),

      formBankDocument: new Form({
        cashbankFromId: -99,
        cashbankToId: -99,
      }),
      inOutCashbankId: -99,
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
          text: "Admin Bank",
          align: "right",
          value: "adminBank",
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
        // {
        //   text: 'Activity', value: 'activityGl', width: '250px',
        // },

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
          text: "Tanggal",
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
          text: "Admin Bank",
          align: "right",
          value: "adminBank",
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
      headersApproved: [
        // {
        //   text: 'Activity', value: 'activityGl', width: '250px',
        // },
        {
          text: "Action",
          value: "actions",
          align: "center",
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
          text: "Payment Bank To",
          value: "paymentRefNo",
          width: "200px",
        },
        // {
        //   text: "Tanggal",
        //   value: "tanggal",
        //   width: "150px",
        // },
        {
          text: "Amount",
          align: "right",
          value: "amount",
          width: "150px",
        },
        {
          text: "Amount Add",
          align: "right",
          value: "amountExt",
          width: "150px",
        },
        {
          text: "Amount Cash Out",
          align: "right",
          value: "totalTransferAmount",
          width: "175px",
        },
        // {
        //   text: "Remark",
        //   value: "remark",
        //   width: "300px",
        // },
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
      headersTransferCahsbank: [
        {
          text: "Action",
          value: "actions",
          align: "center",
          sortable: false,
          width: "100px",
        },
        {
          text: "Doc No",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Doc Date",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Bank",
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
      headersCahsbankDocument: [
        {
          text: "Doc No",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Doc Date",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Bank",
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
    this.inOutCashbankId = -99;
    this.$root.$on("appAutocompliteOu", (msg) => {
      this.form.ouId = msg;
      this.getChild(msg);
    });
    this.$root.$on("appAutocompliteCashbankOu", (msg) => {
      this.getAccountInfo(msg);
    });
    this.$root.$on("formCashBankTransferForm", (msg) => {
      this.getActivityGl();
      this.form.reset();
      this.form.clear();
      if (msg[1] === "editForm") {
        this.inOutCashbankId = msg[0].id;
        this.formHistori = false;
        this.getDetailTransfer(msg[0].id);
        // this.getCurDocStatus(msg[0].id)
        this.formEdit = true;
      } else if (msg[1] === "editFormDokumen") {
        this.formHistori = false;
        this.getDetailTransfer(msg[0].docId);
        // this.getCurDocStatus(msg[0].docId)
        this.formEdit = true;
      } else {
        this.formEdit = false;
        this.mainDataItemList = [];
        this.mainDataCahsbankDocument = [];
        this.selected = [];
        this.mainDataTransferCahsbank = [];
        this.formBankDocument.cashbankFromId = -99;
        this.formBankDocument.cashbankToId = -99;
        this.mainDataDeposit = msg[2];
        this.form.workflowStatus = "NONE";
        this.form.ouId = msg[3].ouId;
        this.getChild(msg[3].ouId);
        var cashbankToId = msg[3].cashbankToId;
        var bankCodeTo = msg[3].bankCodeTo;
        var accountNoTo = msg[3].accountNoTo;
        var accountNameTo = msg[3].accountNameTo;
        var id = 0;
        var result = [];
        this.mainDataDeposit.reduce(function (res, value) {
          if (!res[value.cashbankId]) {
            id += 1;
            res[value.cashbankId] = {
              id: id,
              cashbankFromId: parseInt(value.cashbankId),
              cashbankToId: parseInt(cashbankToId),
              bankCodeFrom: value.bankCode,
              accountNoFrom: value.accountNo,
              accountNameFrom: value.accountName,
              bankCode: bankCodeTo,
              accountNo: accountNoTo,
              accountName: accountNameTo,
              paymentRefNo: "",
              paymentRefDate: moment().format("YYYYMMDD"),
              amount: parseFloat(value.amount),
              adminBank: parseFloat(0),
              totalTransferAmount: parseFloat(value.amount),
              remark: "",
            };
            result.push(res[value.cashbankId]);
          } else {
            res[value.cashbankId].amount += parseFloat(value.amount);
            res[value.cashbankId].totalTransferAmount += parseFloat(
              value.amount
            );
          }
          return res;
        }, {});
        this.mainDataItemList = result;
        this.mainDataItemList.forEach((element, index) => {
          try {
            if (
              require("@/assets/images/logos/bank_logo/" +
                this.mainDataItemList[index].bankCodeFrom +
                "_logo.png")
            ) {
              this.mainDataItemList[index].logoImageFrom =
                this.mainDataItemList[index].bankCodeFrom;
            }
            // do something
          } catch (e) {
            this.mainDataItemList[index].logoImageFrom = "NONE";
            // do something else
          }
        });
        this.mainDataItemList.forEach((element, index) => {
          try {
            if (
              require("@/assets/images/logos/bank_logo/" +
                this.mainDataItemList[index].bankCode +
                "_logo.png")
            ) {
              this.mainDataItemList[index].logoImage =
                this.mainDataItemList[index].bankCode;
            }
            // do something
          } catch (e) {
            this.mainDataItemList[index].logoImage = "NONE";
            // do something else
          }
        });
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
    addAdminBank() {
      var i =
        parseFloat(this.formTransferItem.adminBank) +
        parseFloat(this.formTransferItem.amount);
      this.formTransferItem.totalTransferAmount = i;
    },
    closeFormDeposit() {
      this.dataDepositModal = false;
    },
    closeTransferDetail() {
      this.transferDetailModal = false;
    },
    depositConfrim(id) {
      this.$dialog
        .confirm("Deposit this transaction?.", {
          loader: true,
        })
        .then((dialog) => {
          this.depositItem(id);
          dialog.close();
        })
        .catch(() => {
          dialog.close();
        });
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
            this.$root.$emit("formCashBankTransfer", this.formCashBankTransfer);
            this.$root.$emit("formCashBankTransferReturn", "Cancel deposit!.");
          })
          .catch(() => {});
      } else {
        this.ouList = [];
        this.cashBankList = [];
        this.$root.$emit("formCashBankTransfer", this.formCashBankTransfer);
        this.$root.$emit(
          "formCashBankTransferReturn",
          "Tambah data berhasil!."
        );
      }
    },
    async depositItemDetail(item) {
      // number_format
      // this.formTransferDetail = data;
      this.formTransferDetail.cashbankToId = parseInt(item.cashbankToId);
      this.formTransferDetail.paymentRefDate = moment(
        item.paymentRefDate
      ).format("YYYY-MM-DD");
      this.formTransferDetail.amount = "Rp. " + number_format(item.amount);
      this.formTransferDetail.totalTransferAmount =
        "Rp. " + number_format(item.totalTransferAmount);
      this.formTransferDetail.cashbankFromId = item.cashbankFromId;
      this.formTransferDetail.remark = item.remark;
      this.formTransferDetail.paymentRefNo = item.paymentRefNo;
      this.formTransferDetail.adminBank =
        "Rp. " + number_format(item.adminBank);
      this.transferDetailModal = true;
    },
    getCashBank() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/policy/cashbank/list/available/${this.userId}`,
          // {
          //   limit: 1000,
          //   offset: 0,
          // },
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.cashBankList = response.data.result);
          this.cashBankList = [];
        })
        .catch((e) => {
          this.notif("error", "Gagal", e.response.data.meta.message);
        });
    },
    getChild() {
      this.$root.$emit("appAutocompliteOuCashbank", this.form.ouId);
    },
    getAccountInfo(tipe, id) {
      for (var i = 0; i < this.cashBankList.length; i++) {
        var obj = this.cashBankList[i];
        if (tipe == "Source Bank") {
          if (obj.cashbankId == id) {
            this.formTransferItem.bankCode = obj.bankCode;
            this.formTransferItem.accountNo = obj.accountNo;
            this.formTransferItem.accountName = obj.accountName;
            break;
          }
        } else if (tipe == "Beneficiary Bank") {
          if (obj.cashbankId == id) {
            this.formTransferItem.bankCode = obj.bankCode;
            this.formTransferItem.accountNo = obj.accountNo;
            this.formTransferItem.accountName = obj.accountName;
            break;
          }
        }
      }
    },
    printPdf() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      const json = {
        inOutCashbankId: this.form.id,
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(json));

      axios
        .post(
          `${themeConfig.app.api}/report/cashbank/PrintDepositBankTransfer`,
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
        });
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
          this.notif("error", "Gagal", e.response.data.meta.message);
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
      this.getCashBank();
      this.getChild();
      this.formEdit = false;
      this.editItemList = true;
      this.dataDepositModal = true;
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
      valueToPush["adminBank"] = parseFloat(this.formTransferItem.adminBank);
      valueToPush["totalTransferAmount"] =
        this.formTransferItem.totalTransferAmount;
      valueToPush["remark"] = this.formTransferItem.remark;
      this.mainDataItemList.push(valueToPush);
      this.formTransferItem.clear();
      this.formTransferItem.reset();
      this.notif("success", "Sukses", "Item list berhasil ditambahkan!.");
      this.isDialogVisible = false;
    },
    editItem() {
      this.isDialogVisible = true;
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
          this.mainDataItemList[index].remark = this.formTransferItem.remark;
          this.mainDataItemList[index].adminBank = parseFloat(
            this.formTransferItem.adminBank
          );
          this.formTransferItem.clear();
          this.formTransferItem.reset();
          this.editItemList = false;
        }
      });
      this.isDialogVisible = false;
      this.dataDepositModal = false;
    },
    editItemByFlgTfInternal() {
      this.isDialogVisible = true;
      if (this.form.typeInOutCashbank == "N") {
        this.mainDataItemList.forEach((element, index) => {
          this.mainDataItemList[index].adminBank = 0;
        });
      }
      this.isDialogVisible = false;
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
            scheme: "CB04",
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
            typeInOutCashbank: this.form.typeInOutCashbank == "Y" ? "IN" : "O",
            transferList: this.mainDataItemList,
            depositList: this.mainDataDeposit,
            transferCashbankList: this.mainDataTransferCahsbank,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.formEdit = true;
          this.notif("success", "Sukses", "Tambah data berhasil!.");

          this.formData = false;
          this.formEdit = true;
          this.isDialogVisible = false;
          this.form.reason = "";
          this.notif("success", "Sukses", "Tambah data berhasil!.");
          this.getDetailTransfer(response.data.result);
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
      if (this.docTypeId == 302) {
        docType = "CB02";
      } else if (this.docTypeId == 304) {
        docType = "CB04";
      }
      axios
        .get(
          `${themeConfig.app.api_awe}/approval/current-document/${docType}/${id}`,
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
          this.form.modePayment =
            response.data.result.inOutCashbankCustom.modePayment;
          this.docTypeId = response.data.result.inOutCashbank.docTypeId;
          this.form.remark = response.data.result.inOutCashbank.remark;
          this.form.typeInOutCashbank =
            response.data.result.inOutCashbank.typeInOutCashbank === "IN"
              ? "Y"
              : "N";
          this.form.docDate = moment(
            response.data.result.inOutCashbank.docDate
          ).format("YYYY-MM-DD");
          this.form.extDocDate =
            response.data.result.inOutCashbank.extDocDate == ""
              ? ""
              : moment(response.data.result.inOutCashbank.extDocDate).format(
                  "YYYY-MM-DD"
                );
          if (response.data.result.inOutCashbankTransferItemList !== null) {
            this.mainDataItemList =
              response.data.result.inOutCashbankTransferItemList;
            this.mainDataItemList.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataItemList[index].bankCodeFrom +
                    "_logo.png")
                ) {
                  this.mainDataItemList[index].logoImageFrom =
                    this.mainDataItemList[index].bankCodeFrom;
                }
                // do something
              } catch (e) {
                this.mainDataItemList[index].logoImageFrom = "NONE";
                // do something else
              }
            });
            this.mainDataItemList.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataItemList[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainDataItemList[index].logoImage =
                    this.mainDataItemList[index].bankCode;
                }
                // do something
              } catch (e) {
                this.mainDataItemList[index].logoImage = "NONE";
                // do something else
              }
            });
          } else {
            this.mainDataItemList = [];
          }
          if (response.data.result.depositList !== null) {
            this.mainDataDeposit = response.data.result.depositList;
          } else {
            this.mainDataDeposit = [];
          }
          if (response.data.result.transferBankDocumentList !== null) {
            this.mainDataTransferCahsbank =
              response.data.result.transferBankDocumentList;
            this.mainDataTransferCahsbank.forEach((element, index) => {
              this.mainDataTransferCahsbank[index].transferAmount =
                this.mainDataTransferCahsbank[index].amount;
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataTransferCahsbank[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainDataTransferCahsbank[index].logoImage =
                    this.mainDataTransferCahsbank[index].bankCode;
                }
              } catch (e) {
                this.mainDataTransferCahsbank[index].logoImage = "NONE";
              }
            });
          } else {
            this.mainDataTransferCahsbank = [];
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
            scheme: "CB04",
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
          this.notif("success", "Sukses", "Edit data berhasil!.");
          this.getDetailTransfer(response.data.result);
          this.getCurDocStatus(response.data.result);
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
            scheme: "CB04",
            id: this.form.id,
            reason: this.form.reason,
          },
          config
        )
        .then((response) => {
          this.formData = false;
          this.isDialogVisible = false;
          this.notif("success", "Sukses", "Submit data berhasil!.");
          this.getDetailTransfer(response.data.result);
          this.getCurDocStatus(response.data.result);
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
            scheme: "CB04",
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
    getTransferCashbankDocument() {
      this.isDialogVisible = true;
      var ouId = this.form.ouId == "" ? -99 : parseInt(this.form.ouId);
      var cashbankFromId =
        this.formBankDocument.cashbankFromId == ""
          ? -99
          : parseInt(this.formBankDocument.cashbankFromId);
      var cashbankToId =
        this.formBankDocument.cashbankToId == ""
          ? -99
          : parseInt(this.formBankDocument.cashbankToId);
      var status =
        "?ouId=" +
        ouId +
        "&cashbankFromId=" +
        cashbankFromId +
        "&cashbankToId=" +
        cashbankToId;

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_cb}/transfer/receive/list${status}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainDataCahsbankDocument = response.data.result;
            this.mainDataCahsbankDocument.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataCahsbankDocument[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainDataCahsbankDocument[index].logoImage =
                    this.mainDataCahsbankDocument[index].bankCode;
                }
              } catch (e) {
                this.mainDataCahsbankDocument[index].logoImage = "NONE";
              }
            });
          } else {
            this.mainDataCahsbankDocument = [];
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status == 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    showDokumentTransferCashbank() {
      this.formDataTransferCashbank = true;
    },
    addItemTransferBank() {
      this.mainDataTransferCahsbank = this.selected;
      this.formDataTransferCashbank = false;
    },
    removeItemTransferBank(id) {
      this.mainDataTransferCahsbank = this.mainDataTransferCahsbank.filter(
        function (item) {
          return item["id"] != id;
        }
      );
      this.selected = this.selected.filter(function (item) {
        return item["id"] != id;
      });
    },
    depositItem(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_cb}/transfer/create-deposit/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.getDetailTransfer(this.form.id);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status == 401) {
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
