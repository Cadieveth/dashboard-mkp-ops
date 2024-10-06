mt-2
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
    <v-dialog v-model="formData" persistent width="400">
      <v-card>
        <v-card-title class="headline">
          Update
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-form ref="form" @submit.prevent="updateDueDate()">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="12" class="pb-0">
                  <v-menu
                    v-model="dueDate"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.dueDate"
                        :label="dueDateTbl"
                        :append-icon="icons.mdiCalendar"
                        readonly
                        dense
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.dueDate"
                      color="primary"
                      @input="dueDate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark small type="submit">
              <v-icon dark left>
                {{ icons.mdiCheckboxMarkedCircleOutline }}
              </v-icon>
              Simpan
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="formDetailList" persistent width="1250">
      <!-- Dialog Content -->
      <v-card class="card-style">
        <v-col cols="12" class="pb-0">
          <v-card flat>
            <v-card-actions class="d-flex justify-content-between">
              <span class="font-weight-bold">
                {{ dialogDetail.docNo }} -
                {{ formatDate(dialogDetail.docDate) }}</span
              >
              <v-spacer></v-spacer>
              <v-chip
                small
                :class="`${
                  dialogDetail.flgPayment == 'N'
                    ? 'warning'
                    : dialogDetail.flgPayment == 'Y'
                    ? 'success'
                    : 'secondary'
                }--text`"
                class="v-chip-light-bg font-weight-semibold text-capitalize"
                :color="
                  dialogDetail.flgPayment == 'N'
                    ? 'warning'
                    : dialogDetail.flgPayment == 'Y'
                    ? 'success'
                    : 'secondary'
                "
              >
                {{
                  dialogDetail.flgPayment == "N"
                    ? "NOT PAID"
                    : dialogDetail.flgPayment == "Y"
                    ? "PAID"
                    : "NONE"
                }}
              </v-chip>

              <v-btn color="secondary" icon small @click="closeForm()">
                <v-icon>{{ icons.mdiClose }}</v-icon>
              </v-btn>
            </v-card-actions>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6" class="mb-n4">
                  <!-- <app-autocomplite-partner
                    :form-value.sync="dialogDetail.partnerId"
                    :read-only="true"
                  >
                  </app-autocomplite-partner> -->
                  <v-text-field
                    label="Partner"
                    v-model="dialogDetail.partner"
                    dense
                    readonly
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mb-n4">
                  <vuetify-money
                    dense
                    v-model="dialogDetail.amount"
                    label="Amount"
                    v-bind:readonly="true"
                    backgroundColor="Transparent"
                  >
                  </vuetify-money>
                </v-col>
                <v-col cols="12" md="6" class="mb-n4">
                  <!-- <app-autocomplite-ou-branch
                    :form-value.sync="dialogDetail.ouId"
                    ou-branch-type="invoicePartnerList"
                    :read-only="true"
                  >
                  </app-autocomplite-ou-branch> -->
                  <v-text-field
                    label="Group Merchant"
                    v-model="groupMerchant"
                    dense
                    readonly
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mb-n4">
                  <!-- <app-autocomplite-ou-subbranch
                    :form-value.sync="dialogDetail.ouBranchId"
                    ou-sub-branch-type="invoicePartnerList"
                    :read-only="true"
                  >
                  </app-autocomplite-ou-subbranch> -->
                  <v-text-field
                    label="Merchant"
                    v-model="merchant"
                    dense
                    readonly
                  >
                  </v-text-field>
                </v-col>
                <!-- <v-col cols="12" md="6" class="">
                  <v-text-field
                    label="Document No"
                    v-model="dialogDetail.docNo"
                    dense
                    readonly
                  >
                  </v-text-field>
                </v-col> -->
                <!-- <v-col cols="12" md="6" class="">
                  <app-input-field-date
                    :value-date.sync="docDate"
                    label-title="Document Date"
                    :read-only="true"
                  ></app-input-field-date>
                </v-col> -->
              </v-row>
            </v-card-text>
            <v-card-title class="mt-n2">
              <span>Detail by Payment Method</span>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headerPayment"
                :items="mainPayment"
                :footer-props="{
                  'items-per-page-options': [25, 50, 100],
                }"
                disable-pagination
                fixed-header
                max-height="500px"
                dense
              >
                <template #[`header.ou`]>
                  {{ ouTbl }}
                </template>
                <!-- Unit Bisnis -->
                <!-- <template #[`item.ou`]="{ item }">
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
                </template> -->

                <!-- format uang-->
                <template #[`item.bankAmount`]="{ item }">
                  Rp.{{ number_format(item.bankAmount) }}
                </template>
                <template #[`item.bankAmountRcv`]="{ item }">
                  Rp.{{ number_format(item.bankAmountRcv) }}
                </template>
                <template #[`item.settledAmount`]="{ item }">
                  Rp.{{ number_format(item.settledAmount) }}
                </template>
                <template #[`item.settledAmountAdd`]="{ item }">
                  Rp.{{ number_format(item.settledAmountAdd) }}
                </template>
                <template #[`item.settledAmountCancel`]="{ item }">
                  Rp.{{ number_format(item.settledAmountCancel) }}
                </template>
                <template #[`item.settledAmountRcv`]="{ item }">
                  Rp.{{ number_format(item.settledAmountRcv) }}
                </template>

                <template #[`item.statusItem`]="{ item }">
                  <v-chip
                    small
                    :class="`${
                      item.statusItem == 'N' || item.statusItem == 'R'
                        ? 'warning'
                        : item.statusItem == 'I'
                        ? 'info'
                        : 'success'
                    }--text`"
                    class="v-chip-light-bg font-weight-semibold text-capitalize"
                    :color="
                      item.statusItem == 'N' || item.statusItem == 'R'
                        ? 'warning'
                        : item.statusItem == 'I'
                        ? 'info'
                        : 'success'
                    "
                  >
                    {{
                      item.statusItem == "N" || item.statusItem == "R"
                        ? "NOT FULFILLMENT"
                        : item.statusItem == "I"
                        ? "ON FULFILLMENT"
                        : "FULFILLMENT"
                    }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-card flat>
            <v-card-title class="mt-n8">
              <span>Detail Settlement from Bank</span>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headerItem"
                :items="mainItem"
                :footer-props="{
                  'items-per-page-options': [25, 50, 100],
                }"
                disable-pagination
                fixed-header
                max-height="500px"
                dense
              >
                <template #[`header.ou`]>
                  {{ ouTbl }}
                </template>
                <template #[`header.partner`]>
                  {{ partner }}
                </template>
                <template #[`header.bank`]>
                  {{ beneficiaryBank }}
                </template>

                <!-- format tanggal-->
                <template #[`item.docDate`]="{ item }">
                  {{ dateFormat(item.docDate) }}
                </template>
                <template #[`item.extDocDate`]="{ item }">
                  {{
                    extDocDate == null || extDocDate == ""
                      ? "-"
                      : dateFormat(item.extDocDate)
                  }}
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

                <!-- Partner -->
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

                <!-- payment -->
                <template #[`item.payment`]="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar
                      v-if="item.paymentChannelCode"
                      color="#e6e6e6"
                      size="30"
                    >
                      <v-img
                        :src="
                          require(`@/assets/images/logos/bank_logo/${item.logoChannelCode}_logo.png`)
                        "
                      ></v-img>
                    </v-avatar>
                    <span v-else> - </span>
                    <div class="d-flex flex-column ms-3">
                      <span
                        class="
                          d-block
                          text--primary
                          font-weight-semibold
                          text-truncate
                        "
                        >{{ item.paymentMethodCode }}</span
                      >
                    </div>
                  </div>
                </template>

                <template #[`item.bank`]="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar v-if="item.bankCode" color="#e6e6e6" size="30">
                      <v-img
                        :src="
                          require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                        "
                      ></v-img>
                    </v-avatar>
                    <span v-else> - </span>
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
                <template #[`item.paymentAmount`]="{ item }">
                  Rp.{{ number_format(item.paymentAmount) }}
                </template>
                <template #[`item.osAmount`]="{ item }">
                  Rp.{{ number_format(item.amount - item.paymentAmount) }}
                </template>

                <!-- Status Flag payment-->
                <template #[`item.flgPayment`]="{ item }">
                  <v-chip
                    small
                    :class="`${
                      item.flgPayment == 'N'
                        ? 'warning'
                        : item.flgPayment == 'Y'
                        ? 'success'
                        : 'info'
                    }--text`"
                    class="v-chip-light-bg font-weight-semibold text-capitalize"
                    :color="
                      item.flgPayment == 'N'
                        ? 'warning'
                        : item.flgPayment == 'Y'
                        ? 'success'
                        : 'info'
                    "
                  >
                    {{
                      item.flgPayment == "N"
                        ? "NOT PAID"
                        : item.flgPayment == "Y"
                        ? "PAID"
                        : "NONE"
                    }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" class="pb-0">
          <v-card flat>
            <v-card-title class="mt-n8">
              <span>Detail Disbursement to Merchant</span>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headerDisbursement"
                :items="mainDisbursement"
                :footer-props="{
                  'items-per-page-options': [25, 50, 100],
                }"
                disable-pagination
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
                <template #[`item.refDocDate`]="{ item }">
                  {{ dateFormat(item.refDocDate) }}
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
                <template #[`item.amount`]="{ item }">
                  Rp.{{ number_format(item.amount) }}
                </template>
                <template #[`item.realizationAmount`]="{ item }">
                  Rp.{{ number_format(item.realizationAmount) }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" class="pb-0">
        <v-card>
          <!-- <v-card-title
            ><span>Progress Account Payable For Merchant</span></v-card-title
          > -->
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <app-autocomplite-ou-company
                  :form-value.sync="filterForm.ouId"
                  :ou-type="'progressForPartner'"
                ></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <app-autocomplite-partner
                  :form-value.sync="filterForm.partnerId"
                  :partner-type="'progressForPartner'"
                ></app-autocomplite-partner>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="startDate"
                  :value-date.sync="filterForm.dateFrom"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <app-input-field-date
                  :label-title="endDate"
                  :value-date.sync="filterForm.dateTo"
                ></app-input-field-date>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <app-autocomplite-status
                  :form-value.sync="filterForm.status"
                ></app-autocomplite-status>
              </v-col>
              <v-col cols="12" md="3" sm="6" class="pb-0 mt-2">
                <v-text-field
                  dense
                  :label="docNo"
                  v-model="filterForm.docNo"
                  hide-details
                  persistent-placeholder
                  :placeholder="phDocNo"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-4">
            <v-btn small dark color="primary" @click="confirmFilter()">
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
          </v-card-actions>
          <v-card-title id="target-table" class="mb-n2">
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
            <v-spacer></v-spacer>
            <v-btn
              v-show="false"
              small
              dark
              color="primary"
              @click="formUpdateDuedate()"
            >
              <v-icon dark left>
                {{ icons.mdiCalendarCheck }}
              </v-icon>
              Due Date Update
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="mainData"
              hide-default-footer
              disable-pagination
              fixed-header
              dense
              v-model="selected"
              item-key="id"
            >
              <!-- show-select
              @toggle-select-all="selectAllToggle" -->
              <template #[`header.ouName`]>
                {{ ouTbl }}
              </template>
              <template #[`header.ouSB`]>
                {{ ouTblSB }}
              </template>
              <template #[`header.docNo`]>
                {{ docNo }}
              </template>
              <template #[`header.docDate`]>
                {{ docDate }}
              </template>
              <template #[`header.dueDate`]>
                {{ dueDateTbl }}
              </template>
              <template #[`header.partner`]>
                {{ partnerHeader }}
              </template>

              <!-- format tanggal-->
              <template #[`item.docDate`]="{ item }">
                {{ dateFormat(item.docDate) }}
              </template>
              <template #[`item.dueDate`]="{ item }">
                {{ dateFormat(item.dueDate) }}
              </template>

              <template
                v-slot:item.data-table-select="{ item, isSelected, select }"
              >
                <v-simple-checkbox
                  :ripple="false"
                  :value="isSelected"
                  :readonly="item.flgPayment != 'N'"
                  :disabled="item.flgPayment != 'N'"
                  @input="select($event)"
                ></v-simple-checkbox>
              </template>

              <!-- Unit Bisnis -->
              <template #[`item.ouName`]="{ item }">
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
              <template #[`item.ouSB`]="{ item }">
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

              <!-- payment -->
              <template #[`item.payment`]="{ item }">
                <div class="d-flex align-center">
                  <v-avatar
                    v-if="item.paymentChannelCode"
                    color="#e6e6e6"
                    size="30"
                  >
                    <v-img
                      :src="
                        require(`@/assets/images/logos/bank_logo/${item.paymentChannelCode}_logo.png`)
                      "
                    ></v-img>
                  </v-avatar>
                  <span v-else> - </span>
                  <div class="d-flex flex-column ms-3">
                    <span
                      class="
                        d-block
                        text--primary
                        font-weight-semibold
                        text-truncate
                      "
                      >{{ item.subPaymentChannelName }}</span
                    >
                  </div>
                </div>
              </template>

              <!-- Status Flag payment-->
              <template #[`item.flgPayment`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgPayment == 'N'
                      ? 'warning'
                      : item.flgPayment == 'Y'
                      ? 'success'
                      : 'info'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="
                    item.flgPayment == 'N'
                      ? 'warning'
                      : item.flgPayment == 'Y'
                      ? 'success'
                      : 'info'
                  "
                >
                  {{
                    item.flgPayment == "N"
                      ? "NOT PAID"
                      : item.flgPayment == "Y"
                      ? "PAID"
                      : "SEMI"
                  }}
                </v-chip>
              </template>

              <template #[`item.status`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.statusDoc == 'I' ? 'warning' : 'success'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.statusDoc == 'I' ? 'warning' : 'success'"
                >
                  {{ item.workflowStatus }}
                </v-chip>
              </template>

              <template #[`item.statusDueDate`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    now <= dateFormat(item.dueDate) ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="now <= dateFormat(item.dueDate) ? 'success' : 'error'"
                >
                  {{
                    now <= dateFormat(item.dueDate)
                      ? "NOT DUE DATE"
                      : "DUE DATE"
                  }}
                </v-chip>
              </template>

              <!-- format uang-->
              <template #[`item.amount`]="{ item }">
                Rp.{{ number_format(item.amount) }}
              </template>
              <template #[`item.paymentAmount`]="{ item }">
                Rp.{{ number_format(item.paymentAmount) }}
              </template>
              <template #[`item.invoiceAmount`]="{ item }">
                Rp.{{ number_format(item.invoiceAmount) }}
              </template>

              <template #[`item.actions`]="{ item }">
                <v-tooltip bottom color="primary">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="detailData(item)"
                    >
                      <v-icon>
                        {{ icons.mdiFileDocumentMultipleOutline }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Detail</span>
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
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocompliteStatus from "@core/components/app-autocomplite-ou/AppAutocompliteStatus";
import AppAutocompliteOuBranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuBranch.vue";
import AppAutocompliteOuSubbranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranch.vue";
import Form from "vform";
import moment from "moment";
import {
  mdiCalendar,
  mdiCalendarCheck,
  mdiCheckboxMarkedCircleOutline,
  mdiClose,
  mdiFileDocumentMultipleOutline,
  mdiMagnify,
} from "@mdi/js";
import { dateFormat, number_format, isInArray } from "../../../../constan";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";

import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import "../../../styles/textstyle.css";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppInputFieldDate,
    AppAutocompliteStatus,
    AppAutocompliteOuBranch,
    AppAutocompliteOuSubbranch,
    AppCardLoader,
  },
  data() {
    return {
      partnerHeader: themeConfig.labeling.partner,
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      dueDateTbl: themeConfig.labeling.dueDate,
      ouTbl: themeConfig.labeling.ouTblB,
      ouTblSB: themeConfig.labeling.ouTblSB,
      bankAccount: themeConfig.labeling.bankAccount,
      beneficiaryBank: themeConfig.labeling.beneficiaryBank,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      phDocNo: themeConfig.placeholder.docNo,

      // docDate: "",

      now: moment().format("DD MMM YYYY"),
      dueDate: false,
      selected: [],
      itemsDuedate: [],
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      dialogDetail: [],
      dialogDocDate: "",

      partner: "",
      groupMerchant: "",
      merchant: "",

      // role
      showDueDate:
        isInArray(
          "editDueDateProgressAPForMerchant",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      isDialogVisible: false,
      closingBtn: false,
      disabledCount: 0,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      mainPayment: [],
      mainItem: [],
      mainDisbursement: [],
      showUpdateDueDate: false,
      formData: false,
      formDetailList: false,
      icons: {
        mdiMagnify,
        mdiClose,
        mdiCalendar,
        mdiCalendarCheck,
        mdiCheckboxMarkedCircleOutline,
        mdiFileDocumentMultipleOutline,
      },
      filterForm: new Form({
        ouId: -99,
        partnerId: -99,
        status: "",
        docNo: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      form: new Form({
        dueDate: moment().format("YYYY-MM-DD"),
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
          text: "No Dok",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Tanggal",
          value: "docDate",
          width: "150px",
        },
        // {
        //   text: "Tanggal Jatuh Tempo",
        //   value: "dueDate",
        //   width: "200px",
        // },
        {
          text: "Unit Bisnis",
          value: "ouName",
          width: "300px",
        },
        {
          text: "Unit Bisnis",
          value: "ouSB",
          width: "300px",
        },
        {
          text: "Mitra",
          value: "partner",
          width: "200px",
        },
        {
          text: "Payment",
          value: "flgPayment",
          width: "125px",
          align: "center",
        },
        // {
        //   text: 'Amount', value: 'amount', align: 'right', width: '150px',
        // },
        // {
        //   text: 'Payment Amount', value: 'paymentAmount', align: 'right', width: '150px',
        // },
        {
          text: "Amount",
          value: "invoiceAmount",
          align: "right",
          width: "150px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
        // {
        //   text: "Status",
        //   value: "statusDueDate",
        //   width: "200px",
        //   align: "center",
        // },
      ],
      headerPayment: [
        // {
        //   text: "Unit Bisnis",
        //   value: "ou",
        //   width: "200px",
        // },
        {
          text: "Payment Method",
          value: "paymentMethodCode",
          width: "200px",
        },
        // {
        //   text: 'Bank Amount', value: 'bankAmount', align: 'right', width: '150px',
        // },
        // {
        //   text: 'Bank Receive Amount', value: 'bankAmountRcv', align: 'right', width: '200px',
        // },
        {
          text: "Settle Amount",
          value: "settledAmount",
          align: "right",
          width: "150px",
        },
        {
          text: "Settle Add Amount",
          value: "settledAmountAdd",
          align: "right",
          width: "175px",
        },
        {
          text: "Settle Cancel Amount",
          value: "settledAmountCancel",
          align: "right",
          width: "175px",
        },
        {
          text: "Settle Receive Amount",
          value: "settledAmountRcv",
          align: "right",
          width: "175px",
        },
        {
          text: "Status",
          value: "statusItem",
          width: "200px",
        },
      ],
      headerItem: [
        // {
        //   text: "Doc No",
        //   value: "docNo",
        //   width: "200px",
        // },
        // {
        //   text: "Doc Date",
        //   value: "docDate",
        //   width: "200px",
        // },
        // {
        //   text: "Ext Doc No",
        //   value: "extDocNo",
        //   width: "200px",
        // },
        // {
        //   text: "Ext Doc Date",
        //   value: "extDocDate",
        //   width: "200px",
        // },
        // {
        //   text: "Unit Bisnis",
        //   value: "ou",
        //   width: "200px",
        // },
        // {
        //   text: "Mitra",
        //   value: "partner",
        //   width: "200px",
        // },
        {
          text: "Kas/Bank",
          value: "bank",
          width: "200px",
        },
        {
          text: "Payment Method",
          value: "payment",
          width: "200px",
        },
        {
          text: "Amount",
          value: "amount",
          align: "right",
          width: "150px",
        },
        {
          text: "Payment",
          value: "paymentAmount",
          align: "right",
          width: "150px",
        },
        {
          text: "O/S Amount",
          value: "osAmount",
          align: "right",
          width: "150px",
        },
        {
          text: "Status",
          value: "flgPayment",
          width: "200px",
        },
      ],
      headerDisbursement: [
        {
          text: "Doc No",
          value: "docNo",
          width: "200px",
        },
        {
          text: "Doc Date",
          value: "docDate",
          width: "200px",
        },
        {
          text: "Ref Doc No",
          value: "refDocNo",
          width: "200px",
        },
        {
          text: "Ref Doc Date",
          value: "refDocDate",
          width: "200px",
        },
        {
          text: "Unit Bisnis",
          value: "ou",
          width: "200px",
        },
        {
          text: "Payment Method",
          value: "paymentMethodCode",
          width: "200px",
        },
        {
          text: "Amount",
          value: "amount",
          align: "right",
          width: "150px",
        },
        {
          text: "Realization",
          value: "realizationAmount",
          align: "right",
          width: "150px",
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
    // this.refreshData();
    this.$root.$on("appAutocompliteOuCompanyProgressForPartner", (msg) => {
      // this.$root.$emit("appAutocomplitePartner", msg);
      this.filterForm.partnerId = -99;
    });
    this.dialogDocDate = moment(
      this.dialogDetail.docDate,
      "YYYYMMDD"
    ).toISOString();
  },
  methods: {
    confirmFilter() {
      this.ofset = 0;
      this.currentPage = 1;
      this.refreshData();
    },
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    dateFormat(value) {
      if (value != "") {
        return dateFormat(value.substring(0, 8));
      } else {
        return "";
      }
    },
    formatDate(value) {
      return moment(value).format("LL");
    },
    dateForm(value) {
      const isoDate = moment(value, "YYYYMMDD").toISOString();
      return isoDate;
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    getItemPerPage(val) {
      this.itemPerPage = val;
      this.ofset = 0;
      this.currentPage = 1;
      this.refreshData();
    },
    handlePageChange(value) {
      this.currentPage = value;
      if (this.currentPage == 1) {
        this.ofset = 0;
      } else {
        this.ofset = (this.currentPage - 1) * this.itemPerPage;
      }
      this.refreshData();
    },
    selectAllToggle(props) {
      if (this.selected.length != this.mainData.length - this.disabledCount) {
        this.selected = [];
        props.items.forEach((item) => {
          if (item.flgPayment == "N") {
            this.selected.push(item);
          }
        });
      } else {
        this.selected = [];
      }
    },
    formUpdateDuedate() {
      this.isDialogVisible = true;
      this.itemsDuedate = [];
      if (this.selected.length > 0) {
        this.selected.map((item) => {
          this.itemsDuedate.push(item.invoiceApId);
        });
        this.formData = true;
      } else {
        this.notif("error", "", "No Document Picked!");
        this.showUpdateDueDate = false;
      }
      this.isDialogVisible = false;
    },
    closeForm() {
      this.formDetailList = false;
      this.formData = false;
      this.form.reset();
      this.form.clear();
    },
    updateDueDate() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_fn}/invoice/edit`,
          {
            dueDate: moment(this.form.dueDate).format("YYYYMMDD"),
            id: this.itemsDuedate,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.refreshData();
          this.closeForm();
          this.selected = [];
          this.notif("success", "Success", response.data.meta.message);
        })
        .catch((e) => {
          this.snackbar = true;
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    detailData(data) {
      this.formDetailList = true;
      this.dialogDetail = data;
      this.detailPayment(data.invoiceApId);
      // this.dialogDetail.docDate = moment(data.docDate, "YYYYMMDD").format(
      //   "YYYY-MM-DD"
      // );
      this.detailItem(data.invoiceApId);
      this.detailDisbursement(data.invoiceApId);
      this.groupMerchant =
        this.dialogDetail.ouName + " - " + this.dialogDetail.ouCode;
      this.dialogDetail.partner =
        this.dialogDetail.partnerName + " - " + this.dialogDetail.partnerCode;
      this.merchant =
        this.dialogDetail.ouBranchName + " - " + this.dialogDetail.ouBranchCode;
      setTimeout(() => {
        this.$root.$emit("appAutocompliteOuBranchInvoiceAPPartner", data.ouId);
      }, 300);
    },
    detailPayment(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice/detail-payment-bank-list?refInvoiceId=${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainPayment = response.data.result;
          } else {
            this.mainPayment = [];
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
    detailItem(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice/detail-rincian-bank-item-list?refInvoiceId=${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;

          if (response.data.result !== null) {
            this.mainItem = response.data.result;
            this.mainItem.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainItem[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainItem[index].logoImage =
                    this.mainItem[index].bankCode;
                  this.mainItem[index].logoChannelCode =
                    this.mainItem[index].paymentChannelCode;
                }
              } catch (e) {
                this.mainItem[index].logoImage = "NONE";
                this.mainItem[index].logoChannelCode = "NONE";
              }
            });
          } else {
            this.mainItem = [];
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
    detailDisbursement(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice/detail-payment-realization-disbursement-list?refInvoiceId=${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainDisbursement = response.data.result;
          } else {
            this.mainDisbursement = [];
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
    getCountData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      const partnerId =
        this.filterForm.partnerId == ""
          ? -99
          : parseInt(this.filterForm.partnerId);
      const status =
        this.filterForm.status == "" || this.filterForm.status == null
          ? ""
          : this.filterForm.status;
      const dateFrom = moment(this.filterForm.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.dateTo).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice/count-partner-list?ouId=${ouId}&partnerId=${partnerId}&dateFrom=${dateFrom}&dateTo=${dateTo}&status=${status}`,
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
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    refreshData() {
      this.isDialogVisible = true;
      this.closingBtn = false;
      this.disabledCount = 0;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId);
      const partnerId =
        this.filterForm.partnerId == ""
          ? -99
          : parseInt(this.filterForm.partnerId);
      const status =
        this.filterForm.status == "" || this.filterForm.status == null
          ? ""
          : this.filterForm.status;
      const dateFrom = moment(this.filterForm.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterForm.dateTo).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_fn}/invoice/partner-list?ouId=${ouId}&partnerId=${partnerId}&dateFrom=${dateFrom}&dateTo=${dateTo}&status=${status}&docNo=${this.filterForm.docNo}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.mainData.map((item) => {
              if (item.flgPayment != "N") this.disabledCount += 1;
            });
            if (this.mainData.length != this.disabledCount) {
              this.closingBtn = true;
            }

            this.getCountData();
          } else {
            this.mainData = [];
            this.disabledCount = 0;
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

<style>
th {
  text-align: left;
  padding-left: 8px;
  font-size: small;
  padding-bottom: -10px;
}
td {
  font-size: small;
  padding-bottom: -10px;
}
</style>
