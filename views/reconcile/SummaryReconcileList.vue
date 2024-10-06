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
    <v-dialog v-model="formErrorMessage" persistent width="1300">
      <v-card class="card-style mt-n4">
        <v-card-title></v-card-title>
        <v-card-title>
          Information
          <v-spacer></v-spacer>
          <v-btn class="ml-2" color="warning" small dark @click="syncData()">
            <v-icon dark left>
              {{ icons.mdiRefresh }}
            </v-icon>
            Sync Data
          </v-btn>
          <v-btn
            class="ml-2"
            color="info"
            small
            dark
            @click="exportExcelError()"
          >
            <v-icon dark left>
              {{ icons.mdiFileExcelOutline }}
            </v-icon>
            Export Excel
          </v-btn>
          <!-- <v-tooltip bottom color="warning">
            <template #activator="{ on, attrs }">
              <v-btn
                x-small
                icon
                color="warning"
                v-bind="attrs"
                @click=""
                v-on="on"
              >
                <v-icon size="22">
                  {{ icons.mdiRefresh }}
                </v-icon>
              </v-btn>
            </template>
            <span>Resynchronize Data</span>
          </v-tooltip>
          <v-tooltip bottom color="info">
            <template #activator="{ on, attrs }">
              <v-btn
                x-small
                icon
                color="info"
                v-bind="attrs"
                @click="exportExcelError()"
                v-on="on"
              >
                <v-icon size="22">
                  {{ icons.mdiFileExcelOutline }}
                </v-icon>
              </v-btn>
            </template>
            <span>Export Excel</span>
          </v-tooltip> -->
          <!-- <v-btn color="info" small dark @click="exportExcelError()">
            <v-icon dark left>
              {{ icons.mdiFileExcelOutline }}
            </v-icon>
            Export Excel
          </v-btn> -->
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headersMessage"
            :items="mainDataMessage"
            :items-per-page="25"
            :footer-props="{
              'items-per-page-options': [25, 50, 100],
            }"
            fixed-header
            class="my-custom-class"
          >
            <!-- format tanggal-->
            <template #[`item.docDate`]="{ item }">
              {{ dateFormat(item.docDate) }}
            </template>
            <template #[`item.settledAt`]="{ item }">
              {{ dateTimeFormat(item.settledAt) }}
            </template>

            <template #[`item.txnAmount`]="{ item }">
              Rp.{{ number_format(item.txnAmount) }}
            </template>
            <template #[`item.grossServiceFee`]="{ item }">
              Rp.{{ number_format(item.grossServiceFee) }}
            </template>
            <template #[`item.mdrFeeAmount`]="{ item }">
              Rp.{{ number_format(item.mdrFeeAmount) }}
            </template>

            <template #[`item.orderTypeId`]="{ item }">
              <span>{{
                item.orderTypeId == 2 ? "APPS2PAY" : "E-TICKETING"
              }}</span>
            </template>

            <template #[`item.docNo`]="{ item }">
              <div>
                <span
                  class="
                    d-block
                    text--primary
                    font-weight-semibold
                    text-truncate
                  "
                  >{{ item.docNo }}</span
                >
                <span class="text-xs">{{
                  item.orderTypeId == 2
                    ? item.referenceExtDocNo
                    : item.paymentReferenceNo
                }}</span>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="formExportExcel" persistent width="600">
      <v-card v-show="isOnQueue">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text class="d-flex justify-center mt-n10">
          <v-img
            max-width="150"
            src="../../assets/images/3d-characters/pose-m-5.png"
            class="align-self-center"
          ></v-img>
        </v-card-text>
        <v-card-text class="text-center mt-n2">
          <span class="font-weight-bold text-lg">
            Your document is on queue...
          </span>
        </v-card-text>
        <v-card-text class="d-flex justify-center mt-n2">
          <table>
            <tbody>
              <tr>
                <td>Group Merchant:</td>
                <th :style="{ maxWidth: '58vh' }">
                  {{ ouName }}
                </th>
              </tr>
              <tr>
                <td>Document Date:</td>
                <th>{{ formatDate(filterForm.settleDate) }}</th>
              </tr>
              <tr>
                <td>Document Status:</td>
                <th>
                  <v-chip
                    small
                    :class="`${
                      statusDoc == 'DONE'
                        ? 'success'
                        : statusDoc == 'IN PROGRESS'
                        ? 'primary'
                        : statusDoc == 'PENDING'
                        ? 'warning'
                        : 'error'
                    }--text`"
                    class="v-chip-light-bg font-weight-semibold text-capitalize"
                    :color="
                      statusDoc == 'DONE'
                        ? 'success'
                        : statusDoc == 'IN PROGRESS'
                        ? 'primary'
                        : statusDoc == 'PENDING'
                        ? 'warning'
                        : 'error'
                    "
                  >
                    {{ statusDoc }}
                  </v-chip>
                </th>
              </tr>
            </tbody>
          </table>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            v-show="statusDoc != 'ERROR'"
            class="ml-2"
            color="info"
            small
            dark
            @click="getDocStatus()"
          >
            <v-icon dark left>
              {{ icons.mdiRefresh }}
            </v-icon>
            Refresh
          </v-btn>
          <v-btn
            v-show="statusDoc == 'ERROR'"
            class="ml-2"
            color="primary"
            small
            dark
            @click="confirmExcel()"
          >
            <v-icon dark left>
              {{ icons.mdiRefresh }}
            </v-icon>
            Regenerate Excel
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-show="!isOnQueue">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text class="d-flex justify-center mt-n10">
          <v-img
            class="ml-6"
            max-width="150"
            src="../../assets/images/3d-characters/pose-m-1.png"
          ></v-img>
        </v-card-text>
        <v-card-text class="text-center mt-n2">
          <span class="font-weight-semibold text-lg">
            Your document is ready!
          </span>
        </v-card-text>
        <v-card-text class="d-flex justify-center mt-n2">
          <table>
            <tbody>
              <tr :style="{ width: '38vw' }">
                <td>Group Merchant:</td>
                <th :style="{ maxWidth: '58vh' }">
                  {{ ouName }}
                </th>
              </tr>
              <tr>
                <td>Document Date:</td>
                <th>{{ formatDate(filterForm.settleDate) }}</th>
              </tr>
              <tr>
                <td>Document Status:</td>
                <th>
                  <v-chip
                    small
                    :class="`${
                      statusDoc == 'DONE'
                        ? 'success'
                        : statusDoc == 'IN PROGRESS'
                        ? 'primary'
                        : statusDoc == 'PENDING'
                        ? 'warning'
                        : 'error'
                    }--text`"
                    class="v-chip-light-bg font-weight-semibold text-capitalize"
                    :color="
                      statusDoc == 'DONE'
                        ? 'success'
                        : statusDoc == 'ON PROGRESS'
                        ? 'primary'
                        : statusDoc == 'PENDING'
                        ? 'warning'
                        : 'error'
                    "
                  >
                    {{ statusDoc }}
                  </v-chip>
                </th>
              </tr>
            </tbody>
          </table>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn class="ml-2" color="info" small dark @click="downloadExist()">
            <v-icon dark left>
              {{ icons.mdiFileExcelOutline }}
            </v-icon>
            Export Excel
          </v-btn>
          <v-btn
            class="ml-2"
            color="primary"
            small
            dark
            @click="confirmExcel()"
          >
            <v-icon dark left>
              {{ icons.mdiFileExcelOutline }}
            </v-icon>
            Generate New Excel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title><span>Closing Merchant Transaction</span></v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <app-autocomplite-ou-branch
                  :form-value.sync="filterForm.ouId"
                ></app-autocomplite-ou-branch>
              </v-col>
              <v-col cols="12" md="6">
                <app-input-field-date
                  :value-date.sync="filterForm.settleDate"
                  :label-title="settleDate"
                ></app-input-field-date>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2">
            <v-btn color="primary" small dark @click="confirmFilter()">
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
          </v-card-actions>
          <v-card-title id="target-table" class="mb-n4">
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
              v-show="isDocAvail"
              class="ml-2"
              color="info"
              small
              dark
              @click="statusChecking()"
            >
              <v-icon dark left>
                {{ icons.mdiFileExcelOutline }}
              </v-icon>
              Export Excel
            </v-btn>
            <v-btn
              class="ml-2"
              v-show="closingBtn && showClosing"
              color="primary"
              small
              dark
              @click="confirmDialog()"
            >
              <v-icon dark left>
                {{ icons.mdiBookCheckOutline }}
              </v-icon>
              Closing Transaction
            </v-btn>
          </v-card-title>
          <!-- <v-card-text>
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
          </v-card-text> -->
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
              show-select
              @toggle-select-all="selectAllToggle"
            >
              <template
                v-slot:item.data-table-select="{ item, isSelected, select }"
              >
                <v-simple-checkbox
                  :ripple="false"
                  :value="isSelected"
                  :readonly="item.statusClosing != 'TODO'"
                  :disabled="item.statusClosing != 'TODO'"
                  @input="select($event)"
                ></v-simple-checkbox>
              </template>

              <template #[`header.ou`]>
                {{ ouTbl }}
              </template>

              <!-- format tanggal-->
              <template #[`item.settlementDate`]="{ item }">
                {{ dateFormat(item.settlementDate) }}
              </template>

              <!-- format tanggal-->
              <template #[`item.processAt`]="{ item }">
                {{ dateFormat(item.processAt) }}
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

              <!-- Status Flag reconcile-->
              <template #[`item.statusClosing`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.statusClosing == 'TODO'
                      ? 'info'
                      : item.statusClosing == 'IN PROGRESS'
                      ? 'warning'
                      : item.statusClosing == 'ON REVIEW'
                      ? 'primary'
                      : item.statusClosing == 'DONE'
                      ? 'success'
                      : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="
                    item.statusClosing == 'TODO'
                      ? 'info'
                      : item.statusClosing == 'IN PROGRESS'
                      ? 'warning'
                      : item.statusClosing == 'ON REVIEW'
                      ? 'primary'
                      : item.statusClosing == 'DONE'
                      ? 'success'
                      : 'error'
                  "
                >
                  {{ item.statusClosing }}
                </v-chip>
              </template>

              <!-- action -->
              <template #[`item.actions`]="{ item }">
                <v-tooltip bottom color="info">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                      @click="downloadData(item)"
                      v-show="
                        (item.statusClosing == 'ON REVIEW' ||
                          item.statusClosing == 'DONE') &&
                        showExcel
                      "
                    >
                      <v-icon>
                        {{ icons.mdiFileExcelOutline }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Download</span>
                </v-tooltip>
                <v-tooltip bottom color="warning">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="warning"
                      v-bind="attrs"
                      v-on="on"
                      v-show="item.statusClosing == 'FAILED'"
                      @click="showErrorMessage(item)"
                    >
                      <v-icon>
                        {{ icons.mdiFileQuestionOutline }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Show Error</span>
                </v-tooltip>
                <v-tooltip bottom color="error">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click="confirmCancel(item.id)"
                      v-show="item.statusClosing == 'ON REVIEW' && showCancel"
                    >
                      <v-icon>
                        {{ icons.mdiCloseCircleOutline }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Cancel Data</span>
                </v-tooltip>
                <v-tooltip bottom color="info">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                      v-show="item.statusClosing == 'FAILED' && showRefresh"
                      @click="confirmCancel(item.id)"
                    >
                      <v-icon>
                        {{ icons.mdiRefresh }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Refresh Data</span>
                </v-tooltip>
              </template>
              <template #[`item.actionsReleased`]="{ item }">
                <v-tooltip bottom color="info">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      text
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                      @click="releseData(item.id)"
                      v-show="item.statusClosing == 'ON REVIEW' && showReleased"
                    >
                      <b>Released</b>
                      <!--                      <v-icon>-->
                      <!--                        {{ icons.mdiCheckboxMarkedCircleOutline }}-->
                      <!--                      </v-icon>-->
                    </v-btn>
                  </template>
                  <span>Released Reconciliation</span>
                </v-tooltip>
              </template>
              <!-- <template slot="no-data">
                <div
                  :style="{
                    height: `250px`,
                  }"
                  v-show="true"
                  class="d-flex flex-column align-center"
                >
                  <v-img
                    max-height="200"
                    max-width="200"
                    src="../../assets/images/avatars/noData.png"
                    alt="No Data Found"
                  ></v-img>
                  <span class="font-weight-semibold text-truncate text-lg">
                    No Data Found
                  </span>
                </div>
              </template> -->
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
import AppAutocompliteOuBranch from "@core/components/app-autocomplite-ou/AppAutocompliteOuBranch";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import Form from "vform";
import moment from "moment";
import {
  mdiBookCheckOutline,
  mdiCheckAll,
  mdiCheckboxMarkedCircleOutline,
  mdiClose,
  mdiCloseCircleOutline,
  mdiFileExcelOutline,
  mdiFileQuestionOutline,
  mdiFileRestoreOutline,
  mdiMagnify,
  mdiRefresh,
} from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import {
  dateFormat,
  dateTimeFormat,
  number_format,
  isInArray,
} from "../../../constan";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import { throws } from "assert";
import { filterTags } from "@/@core/utils/filter";
import { async, fcall } from "q";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    AppInputFieldDate,
    AppAutocompliteOuBranch,
    AppCardLoader,
  },
  data() {
    return {
      settleDate: themeConfig.labeling.settleDate,
      ouTbl: themeConfig.labeling.ouTbl,
      loaderText: themeConfig.placeholder.remarkLoader,

      selected: [],
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      isDocAvail: false,
      statusDoc: "NONE",
      fileName: "",
      ouName: "Group Merchant",

      outletCode: "",
      //role
      showClosing:
        isInArray(
          "closingMerchantTransaction",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      showExcel:
        isInArray(
          "downloadExportMerchantTransaction",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      showReleased:
        isInArray(
          "releasedMerchantTransaction",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      showCancel:
        isInArray(
          "cancelMerchantTransaction",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      showRefresh:
        isInArray(
          "refreshMerchantTransaction",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      isDialogVisible: false,
      closingBtn: false,
      formErrorMessage: false,
      formExportExcel: false,
      isOnQueue: false,
      disabledCount: 0,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      searchItem: "",
      itemRow: [25, 50, 100],
      mainData: [],
      mainDataMessage: [],
      failedTrx: [],
      maxLoop: 4,
      maxLength: 100, // Maximum pixel length allowed
      filterForm: new Form({
        ouId: -99,
        settleDate: moment().format("YYYY-MM-DD"),
      }),
      icons: {
        mdiMagnify,
        mdiFileExcelOutline,
        mdiCheckAll,
        mdiClose,
        mdiFileRestoreOutline,
        mdiFileQuestionOutline,
        mdiRefresh,
        mdiBookCheckOutline,
        mdiCloseCircleOutline,
        mdiCheckboxMarkedCircleOutline,
      },
      headers: [
        {
          text: "#",
          value: "actionsReleased",
          sortable: false,
          width: "75px",
          align: "center",
        },
        {
          text: "Action",
          value: "actions",
          sortable: false,
          width: "150px",
        },
        {
          text: "Unit Bisnis",
          value: "ou",
          width: "200px",
        },
        {
          text: "Settled Date",
          value: "settlementDate",
          width: "150px",
        },
        {
          text: "Process No",
          value: "processNo",
          width: "200px",
        },
        {
          text: "Process Date",
          value: "processAt",
          width: "150px",
        },
        {
          text: "Status Closing",
          value: "statusClosing",
          width: "150px",
        },
        {
          text: "Message",
          value: "message",
          width: "300px",
        },
      ],
      headersMessage: [
        {
          text: "Document No",
          value: "docNo",
          width: "300px",
        },
        {
          text: "Document Date",
          value: "docDate",
          width: "150px",
        },

        // {
        //   text: "Service Fee",
        //   value: "grossServiceFee",
        //   width: "150px",
        //   align: "right",
        // },
        // {
        //   text: "MDR",
        //   value: "mdrFeeAmount",
        //   width: "100px",
        //   align: "right",
        // },
        // {
        //   text: "Pay Ref No",
        //   value: "paymentReferenceNo",
        //   width: "200px",
        // },
        {
          text: "Payment Method",
          value: "paymentMethod",
          width: "150px",
        },
        {
          text: "Settled At",
          value: "settledAt",
          width: "175px",
        },
        {
          text: "Transaction From",
          value: "orderTypeId",
          width: "150px",
        },
        {
          text: "Transaction Amount",
          value: "txnAmount",
          width: "170px",
          align: "right",
        },
        {
          text: "Message",
          value: "message",
          width: "400px",
        },
      ],
    };
  },
  computed: {},
  mounted() {
    // this.refreshData();
  },
  methods: {
    confirmExcel() {
      this.$dialog
        .confirm("Generate Request For New Excel? ", {
          loader: true,
        })
        .then((dialog) => {
          setTimeout(() => {
            dialog.close();
          }, 500);
          this.statusDoc = "IN PROGRESS";
          this.isOnQueue = true;
          this.exportExcel();
          this.statusChecking();
        })
        .catch(() => {
          // this.refreshData();
        });
    },
    getOuName() {
      this.statusDoc = "ON PROGRESS";
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${
            themeConfig.app.api_master
          }/ou/authorized-ou-branch-list?ouId=${-99}`,
          config
        )
        .then((response) => {
          this.isOnQueue = true;
          const result = response.data.result;
          const data = result.find(
            (item) => item.ouId === this.filterForm.ouId
          );
          this.ouName = data.ouName;
          if (data) {
            this.fileName =
              "ReportPosCollectorForDataReconcileAdvance_" +
              data.ouName.replace(/\s/g, "") +
              "_" +
              moment(this.filterForm.settleDate).format("YYYYMMDD");
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    confirmCancel(id) {
      this.$dialog
        .confirm("Are you sure you want to cancel this transaction?", {
          loader: true,
        })
        .then((dialog) => {
          setTimeout(() => {
            dialog.close();
          }, 500);
          this.cancelData(id);
          this.refreshData();
        })
        .catch(() => {
          this.refreshData();
        });
    },
    confirmFilter() {
      if (this.filterForm.ouId != -99 && this.filterForm.ouId != null) {
        this.ofset = 0;
        this.currentPage = 1;
        this.refreshData();
        this.getOuName();
      } else {
        this.notif("error", "failed", "Please Select Group Merchant First!");
      }
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
      const date = moment(value, "YYYY-MM-DD");
      const formattedDate = date.format("LL");
      return formattedDate;
    },
    dateTimeFormat(value) {
      return dateTimeFormat(value);
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
    closeForm() {
      this.formErrorMessage = false;
      this.formExportExcel = false;
    },
    selectAllToggle(props) {
      if (this.selected.length != this.mainData.length - this.disabledCount) {
        this.selected = [];
        props.items.forEach((item) => {
          if (item.statusClosing == "TODO") {
            this.selected.push(item);
          }
        });
      } else {
        this.selected = [];
      }
    },
    confirmDialog() {
      if (this.selected.length > 0) {
        this.$dialog
          .confirm("Are you sure you want to closing transaction this item?.", {
            loader: true,
          })
          .then((dialog) => {
            setTimeout(() => {
              dialog.close();
            }, 500);
            this.closingData();
            this.confirmFilter();
          })
          .catch(() => {
            this.refreshData();
          });
      } else {
        this.notif("error", "Failed", "Data closing is null!!.");
      }
    },
    closingData() {
      this.isDialogVisible = true;
      if (this.selected.length > 0) {
        this.selected.map((item) => {
          this.updateDataClosing(item.id);
        });
      } else {
        this.notif("error", "Failed", "Data closing is null!!.");
      }
      this.isDialogVisible = false;
      this.refreshData();
      this.selectAllToggle();
    },
    updateDataClosing(ID) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_pc}/settle-daily-process/edit_closing/${ID}`,
          config
        )
        .then((response) => {
          this.notif("success", "Success", response.data.meta.message);
          this.refreshData();
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

    async syncData() {
      this.isDialogVisible = true;
      const list = this.mainDataMessage.map((obj) => {
        return {
          docNo: obj.orderTypeId == 2 ? obj.referenceExtDocNo : obj.docNo,
          paymentReferenceNo: obj.paymentReferenceNo,
          trxFrom: obj.orderTypeId == 2 ? "A2P" : "E-TICKETING",
          productCode: obj.productCode,
        };
      });

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .post(
          `${themeConfig.app.api_pc}/sync-trx/failed`,
          {
            outletCode: this.outletCode,
            list: list,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
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
      this.refreshData();
    },

    async showErrorMessage(data) {
      this.isDialogVisible = true;
      this.mainDataMessage = [];
      this.failedTrx = data;
      this.outletCode = data.ouCode;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_pc}/settle-daily-process/message-list?id=${data.id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result != null) {
            this.mainDataMessage = response.data.result;
            this.formErrorMessage = true;
          } else {
            this.mainDataMessage = [];
            // this.notif("error", "Failed", "No Result!");
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
    downloadData(data) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_pc}/settle-daily-process/export-report-pos-collector-for-data-reconcile?txnAdminSettleDailyProcessId=${data.id}&ouCode=${data.ouCode}&ouName=${data.ouName}&processNo=${data.processNo}&settledDate=${data.settlementDate}`,
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
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    releseData(ID) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_pc}/settle-daily-process/released/${ID}`,
          config
        )
        .then((response) => {
          this.notif("success", "Success", response.data.meta.message);
          this.refreshData();
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
    cancelData(ID) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_pc}/settle-daily-process/canceld/${ID}`,
          config
        )
        .then((response) => {
          this.notif("success", "Success", response.data.meta.message);
          this.refreshData();
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

    dataRefresh(item) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      console.log(item);
      // axios
      //   .post(
      //     `${themeConfig.app.api_pc}/settle-daily-process/canceld/${ID}`,
      //     {
      //       DocNo: item.docNo,
      //       PaymentReferenceNo: item,
      //       TrxFrom: "E-TICKETING",
      //       ProductCode: "TIX-PRK",
      //     },
      //     config
      //   )
      //   .then((response) => {
      //     this.notif("success", "Success", response.data.meta.message);
      //     this.refreshData();
      //   })
      //   .catch((e) => {
      //     if (e.response.status === 401) {
      //       localStorage.clear();
      //       sessionStorage.clear();
      //       router.push({ name: "auth-login" });
      //     }
      //     this.notif("error", "Failed", e.response.data.meta.message);
      //   });
    },

    downloadExist() {
      window.location.replace(
        `${themeConfig.app.link_export}?filename=${this.fileName}.xlsx`
      );
    },

    getCountData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" || this.filterForm.ouId == null
          ? -99
          : parseInt(this.filterForm.ouId);
      const settleDate = moment(this.filterForm.settleDate).format("YYYYMMDD");
      if (ouId != -99) {
        axios
          .get(
            `${themeConfig.app.api_pc}/settle-daily-process/count?ouId=${ouId}&settleDate=${settleDate}`,
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
      }
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
        this.filterForm.ouId == "" || this.filterForm.ouId == null
          ? -99
          : parseInt(this.filterForm.ouId);
      const settleDate = moment(this.filterForm.settleDate).format("YYYYMMDD");
      // if (ouId != -99) {
      axios
        .get(
          `${themeConfig.app.api_pc}/settle-daily-process/list?ouId=${ouId}&settleDate=${settleDate}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.mainData.map((item) => {
              if (item.statusClosing != "TODO") this.disabledCount += 1;
            });
            if (this.mainData.length != this.disabledCount) {
              this.closingBtn = true;
            }
            const isStatusClosing = this.mainData.some(
              (item) =>
                item.statusClosing == "DONE" ||
                item.statusClosing == "ON REVIEW"
            );
            if (isStatusClosing) {
              this.isDocAvail = true;
            } else {
              this.isDocAvail = false;
            }
            this.getCountData();
          } else {
            this.mainData = [];
            this.disabledCount = 0;
            this.isDocAvail = false;
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
      // } else {
      //   this.isDialogVisible = false;
      // }
    },
    delay(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    async statusChecking() {
      this.isOnQueue = true;
      this.formExportExcel = true;
      this.statusDoc = "IN PROGRESS";
      await this.delay(1000);
      await this.getDocStatus();
      for (let i = 0; i < 30; i++) {
        await this.delay(2000);
        await this.getDocStatus();

        if (this.statusDoc == "DONE" || this.statusDoc == "ERROR") break;
      }
      // }
    },
    async getDocStatus() {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${this.$session.get("accessToken")}`,
            "Access-Control-Allow-Origin": "*",
          },
        };

        let data = await axios.get(
          `${themeConfig.app.api}/report/check/status?&filename=${this.fileName}&templateName=ReportPosCollectorForDataReconcileAdvance`,
          config
        );

        if (data.status == 200) {
          this.statusDoc =
            data.data.result.status == ""
              ? "IN PROGRESS"
              : data.data.result.status;
          if (data.data.result.exists) {
            if (data.data.result.status != "DONE") {
              this.isOnQueue = true;
            } else {
              this.isOnQueue = false;
            }
          } else {
            this.exportExcel();
            this.isOnQueue = true;
          }
        }
      } catch (e) {
        if (e.response.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          router.push({ name: "auth-login" });
        }
        this.notif("error", "Failed", e.response.data.meta.message);
      }
    },
    exportExcel() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const filteredArray = this.mainData.filter(
        (item) =>
          item.statusClosing == "DONE" || item.statusClosing == "ON REVIEW"
      );
      const txnAdminSettleDailyProcessId = filteredArray.map((item) => item.id);
      this.isOnQueue = true;
      this.isDialogVisible = false;

      axios
        .get(
          `${themeConfig.app.api_pc}/settle-daily-process/export-report-pos-collector-for-data-reconcile-advance?txnAdminSettleDailyProcessId=${txnAdminSettleDailyProcessId}&filename=${this.fileName}&templateName=ReportPosCollectorForDataReconcileAdvance`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result != null) {
            // window.location.replace(
            //   `${themeConfig.app.link_export}?filename=${this.fileName}.xlsx`
            // );
          } else {
            this.isOnQueue = true;
            this.statusDoc = "FAILED";
            this.notif("error", "Failed", "Failed to Export");
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.isOnQueue = true;
          this.statusDoc = "FAILED";
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
      // } else {
      //   this.isDialogVisible = false;
      // }
    },
    exportExcelError() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_pc}/settle-daily-process/export-report-daily-process-failed?txnAdminSettleDailyProcessId=${this.failedTrx.id}&ouCode=${this.failedTrx.ouCode}&ouName=${this.failedTrx.ouName}&settledDate=${this.failedTrx.settlementDate}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result != null) {
            window.location.replace(
              `${themeConfig.app.link_export}?filename=${response.data.result.filename}`
            );
          } else {
            this.notif("error", "Failed", "Failed to Export");
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
      // } else {
      //   this.isDialogVisible = false;
      // }
    },
  },
};
</script>
<style scoped>
th {
  text-align: left;
  padding-left: 32px;
}
.my-custom-class tbody tr {
  height: 100px;
  padding: 10px;
}
</style>
