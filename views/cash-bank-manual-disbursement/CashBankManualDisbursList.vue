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
    <transfer-upload-form></transfer-upload-form>
    <v-card outlined elevation="0">
      <v-row>
        <v-col cols="12" class="pb-0 mt-2">
          <cashbank-manual-disburs-filter-doc></cashbank-manual-disburs-filter-doc>
        </v-col>
        <v-col id="table-approved" cols="12" class="pb-0">
          <v-card-text>
            <v-row class="mb-4">
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
            <v-data-table
              :headers="headers"
              :items="mainDataRelease"
              :items-per-page="itemPerPageRelease"
              :search="searchRelease"
              fixed-header
              hide-default-footer
              dense
            >
              <!--header-->
              <template #[`header.docNo`]>
                {{ docNo }}
              </template>
              <template #[`header.tanggal`]>
                {{ docDate }}
              </template>
              <template #[`header.ou`]>
                {{ ouTbl }}
              </template>

              <!-- format tanggal-->
              <template #[`item.tanggal`]="{ item }">
                {{ dateFormat(item.docDate) }}
              </template>

              <!-- format uang-->
              <template #[`item.transferAmount`]="{ item }">
                Rp.{{ number_format(item.transferAmount) }}
              </template>
              <template #[`item.transferFeeBankAmount`]="{ item }">
                Rp.{{
                  number_format(item.transferFeeBankAmount + item.incomeAmount)
                }}
              </template>
              <template #[`item.paymentAmount`]="{ item }">
                Rp.{{ number_format(item.paymentAmount) }}
              </template>

              <!-- unit business-->
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

              <!-- Mitra -->
              <template #[`item.mitra`]="{ item }">
                <div>
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
                </div>
              </template>

              <!-- penerima-->
              <template #[`item.penerima`]="{ item }">
                <!--                          {{ item.accountNo }} a/n {{ item.accountName }}-->
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
                      >{{ item.beneficiaryAccountName }}</span
                    >
                    <span class="text-xs">{{ item.beneficiaryAccountNo }}</span>
                  </div>
                </div>
              </template>

              <!-- Status Dokumen-->
              <template #[`item.statusDoc`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.workflowStatus == 'DRAFT'
                      ? 'warning'
                      : item.workflowStatus == 'IN PROGRESS'
                      ? 'info'
                      : item.workflowStatus == 'RELEASED'
                      ? 'success'
                      : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="
                    item.workflowStatus == 'DRAFT'
                      ? 'warning'
                      : item.workflowStatus == 'IN PROGRESS'
                      ? 'info'
                      : item.workflowStatus == 'RELEASED'
                      ? 'success'
                      : 'error'
                  "
                >
                  {{
                    item.workflowStatus == "RELEASED"
                      ? "APPROVED"
                      : item.workflowStatus
                  }}
                </v-chip>
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
                      v-on="on"
                      @click="openTransferDialog(item, item.paymentAmount)"
                      v-show="showUpdate"
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
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="handlePageChange('Release')"
              total-visible="5"
              v-scroll-to="'#table-approved'"
            ></v-pagination>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import axios from "@axios";
import themeConfig from "@themeConfig";
import moment from "moment";
import Form from "vform";
import {
  mdiCalendar,
  mdiClipboardEditOutline,
  mdiDelete,
  mdiMagnify,
  mdiPlus,
  mdiReload,
} from "@mdi/js";
import { dateFormat, isInArray, number_format } from "../../../constan";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppAutocompliteBank from "@core/components/app-autocomplite-ou/AppAutocompliteBank";
import AppAutocompliteOuBuMain from "@core/components/app-autocomplite-ou/AppAutocompliteOuBuMain";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import CashbankForDisbursFilterCreate from "@/views/cash-bank-for-disbursement/CashbankForDisbursFilterCreate";
import CashbankManualDisbursFilterDoc from "@/views/cash-bank-manual-disbursement/CashbankManualDisbursFilterDoc";
import TransferUploadForm from "@/views/cash-bank-manual-disbursement/TransferUploadForm.vue";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "Child",
  components: {
    AppAutocompliteOu,
    AppAutocompliteBank,
    AppAutocompliteOuBuMain,
    AppAutocomplitePartner,
    CashbankForDisbursFilterCreate,
    CashbankManualDisbursFilterDoc,
    AppCardLoader,
    TransferUploadForm,
  },
  data() {
    return {
      labelDocNo: themeConfig.labeling.docNo,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,
      ouCode: themeConfig.labeling.ouCodeTbl,
      ouName: themeConfig.labeling.ouNameTbl,
      ou: themeConfig.labeling.ou,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      itemPerPage: 25,

      openLookup: false,
      openDisbursementInfo: false,

      payMethodList: [],
      payMethodPicked: "",
      currentPage: 1,
      isDialogVisible: false,
      currentTab: 0,
      formData: true,
      itemRow: [25, 50, 100],
      //Tab Draft
      searchDraft: "",
      currentPageDraft: 1,
      totalPagesDraft: 1,
      ofsetDraft: 0,
      itemPerPageDraft: 25,
      //Tab InProgress
      searchInProgress: "",
      currentPageInProgress: 1,
      totalPagesInProgress: 1,
      ofsetInProgress: 0,
      itemPerPageInProgress: 25,
      //Tab Release
      searchRelease: "",
      currentPageRelease: 1,
      totalPagesRelease: 1,
      ofsetRelease: 0,
      itemPerPageRelease: 25,
      selected: [],
      mainData: [],
      mainInvoiceData: [],
      mainDataInProgress: [],
      mainDataRelease: [],
      ouList: [],
      statusDocList: [],
      statusDisList: [],
      bankList: [],

      items: [],
      filteredItems: {},

      menuStart: false,
      menuEnd: false,
      formCashBankManualDisburs: true,

      showUpdate:
        isInArray(
          "updateManualDisbursement",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      icons: {
        mdiCalendar,
        mdiMagnify,
        mdiClipboardEditOutline,
        mdiDelete,
        mdiPlus,
      },
      totalPages: 1,
      filterForm: new Form({
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        ouId: -99,
        partnerId: -99,
      }),
      filterFormIn: new Form({
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        docNo: "",
        ouId: -99,
        bankCode: "",
        remark: "",
      }),
      filterFormApproved: new Form({
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        ouId: -99,
        partnerId: -99,
      }),
      filterCreateForm: new Form({
        ouId: -99,
        partnerId: -99,
        ouBranchId: -99,
        ouSubBranchId: [],
        partnerBank: -99,
      }),

      amountTotal: 0,
      listInvoiceAp: [],
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Nomor Dokumen",
          value: "docNo",
          width: "250px",
        },
        {
          text: "Tanggal",
          value: "tanggal",
          width: "150px",
        },
        {
          text: "Unit Bisnis",
          value: "ou",
          width: "170px",
        },
        {
          text: "Partner",
          value: "mitra",
          width: "150px",
        },
        {
          text: "Beneficiary Account",
          value: "penerima",
          width: "250px",
        },
        {
          text: "Payment Amount",
          align: "right",
          value: "paymentAmount",
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
    this.$root.$on("closeModalDisbursementLookup", async (msg) => {
      this.openLookup = false;
    });
    this.$root.$on("closeModalDisbursementInfo", async (msg) => {
      this.openDisbursementInfo = false;
    });

    this.$root.$on("transferUploadReturn", async () => {
      this.refreshData();
    });

    this.$root.$on("filterDisbursementInfo", async (msg) => {
      this.openDisbursementInfo = msg;
    });

    this.$root.$on("filterManualDisbursementDoc", (msg) => {
      this.filterFormApproved = msg;
      this.currentPage = 1;
      this.ofsetRelease = 0;
      this.refreshData();
    });
    this.refreshData();
  },

  methods: {
    async delay(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
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
    sumTotalAmount(data) {
      var amount = 0;
      data.forEach((item) => {
        amount += item.realizationAmount;
      });
      return amount;
    },

    getItemPerPage(val) {
      this.itemPerPage = val;
      this.ofset = 0;
      this.currentPage = 1;
      this.refreshData();
    },
    handleTabChange() {
      this.currentPage = 1;
      this.ofsetDraft = 0;
      this.ofsetInProgress = 0;
      this.ofsetRelease = 0;
      this.itemPerPage = 25;

      this.refreshData();
    },
    filterItems(value) {
      const newobj = Object.fromEntries(
        Object.entries(this.items).filter(([key]) => key == value)
      );

      if (value != null) {
        this.filteredItems = newobj;
      } else {
        this.filteredItems = this.items;
      }
    },
    handlePageChange(value) {
      if (value == "Draft") {
        if (this.current === 1) {
          this.ofsetDraft = 0;
        } else {
          this.ofsetDraft = (this.currentPage - 1) * this.itemPerPage;
        }
        this.refreshData();
      } else if (value == "InProgress") {
        if (this.currentPage === 1) {
          this.ofsetInProgress = 0;
        } else {
          this.ofsetInProgress = (this.currentPage - 1) * this.itemPerPage;
        }
        this.refreshData();
      } else if (value == "Release") {
        if (this.currentPage === 1) {
          this.ofsetRelease = 0;
        } else {
          this.ofsetRelease = (this.currentPage - 1) * this.itemPerPage;
        }
        this.refreshData();
      }
    },
    selectAllToggle(props, index, item) {
      if (props.value == true) {
        for (let i = 0; i < this.mainInvoiceData.length; i++) {
          if (this.mainInvoiceData[i].paymentMethodCode == index) {
            this.mainInvoiceData[i].checked = true;
            this.mainInvoiceData[i].itemAmount =
              this.mainInvoiceData[i].settledAmount +
              this.mainInvoiceData[i].settledAmountAdd -
              (this.mainInvoiceData[i].settledAmountCancel +
                this.mainInvoiceData[i].settledAmountRcv);
          }
        }
      } else {
        for (let i = 0; i < this.mainInvoiceData.length; i++) {
          if (this.mainInvoiceData[i].paymentMethodCode == index) {
            this.mainInvoiceData[i].checked = false;
            this.mainInvoiceData[i].itemAmount = 0;
          }
        }
      }
      this.amountSum();
    },
    async changeFilteredData() {
      // this.items = await this.sortData(this.selected, "ouName");
      this.items = await this.groupDataByCategories(this.selected, [
        "ouName",
        "paymentMethodCode",
      ]);
      this.filteredItems = this.items;
      this.payMethodList = Object.keys(this.filteredItems);
      var newAmount = 0;
      this.selected.forEach((item) => {
        newAmount +=
          item.settledAmount +
          item.settledAmountAdd -
          (item.settledAmountCancel + item.settledAmountRcv);
      });
      this.amountTotal = newAmount;
    },
    selectToggle(evnt, item) {
      if (evnt == true) {
        let amount = 0;
        amount +=
          item.settledAmount +
          item.settledAmountAdd -
          (item.settledAmountCancel + item.settledAmountRcv);
        let dataChange = this.mainInvoiceData.find((obj) => obj.id == item.id);
        if (dataChange) {
          dataChange.checked = false;
          dataChange.itemAmount = 0;
        }
      } else {
        let amount = 0;
        amount +=
          item.settledAmount +
          item.settledAmountAdd -
          (item.settledAmountCancel + item.settledAmountRcv);
        let dataChange = this.mainInvoiceData.find((obj) => obj.id == item.id);
        if (dataChange) {
          dataChange.checked = true;
          dataChange.itemAmount = amount;
        }
      }
      this.amountSum();
    },
    setInvoiceApList() {
      this.listInvoiceAp = [];
      this.amountTotal = 0;
      this.selected.forEach((item) => {
        var valueToPush = {};
        valueToPush["ouId"] = item.ouId;
        valueToPush["ouCode"] = item.ouCode;
        valueToPush["ouName"] = item.ouName;
        valueToPush["refDocTypeId"] = item.docTypeId;
        valueToPush["refDocNo"] = item.docNo;
        valueToPush["refDocDate"] = item.docDate;
        valueToPush["refDueDate"] = item.dueDate;
        valueToPush["refItemId"] = item.id;
        valueToPush["paymentMethodCode"] = item.paymentMethodCode;
        valueToPush["realizationAmount"] =
          item.settledAmount +
          item.settledAmountAdd -
          (item.settledAmountCancel + item.settledAmountRcv);
        valueToPush["remark"] = "";
        this.amountTotal +=
          item.settledAmount +
          item.settledAmountAdd -
          (item.settledAmountCancel + item.settledAmountRcv);
        this.listInvoiceAp.push(valueToPush);
      });
    },
    openTransferDialog(data, amount) {
      const sendData = [data, amount];
      const dataToSend = Object.assign({}, data);
      this.$root.$emit("formTransferUpload", sendData);
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
          this.refreshData();
        });
    },
    async sortData(array, columnName) {
      var sortedData = {};

      for (var i = 0; i < array.length; i++) {
        var object = array[i];

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
    removeData(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_cb}/disbursement/remove/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.notif("success", "Sukses", "Delete data berhasil!.");
          this.refreshData();
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getBank() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/combo/list?comboId=BANK`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.bankList = response.data.result);
          this.bankList = [];
        })
        .catch((e) => {
          this.notif("error", "Gagal", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getCountData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      var data = {
        docNo: this.filterFormApproved.docNo,
        ouId:
          this.filterFormApproved.ouId === ""
            ? -99
            : parseInt(this.filterFormApproved.ouId),
        partnerId:
          this.filterFormApproved.partnerId === ""
            ? -99
            : parseInt(this.filterFormApproved.partnerId),
        dateFrom: moment(this.filterFormApproved.dateFrom).format("YYYYMMDD"),
        dateTo: moment(this.filterFormApproved.dateTo).format("YYYYMMDD"),
      };

      axios
        .get(
          `${themeConfig.app.api_cb}/disbursement/count/transfer/manual?ouId=${data.ouId}&dateFrom=${data.dateFrom}&dateTo=${data.dateTo}&partnerId=${data.partnerId}`,
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
          this.notif("error", "Gagal", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    async refreshData() {
      this.isDialogVisible = true;
      this.mainDataRelease = [];
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      var itemPerPage = this.itemPerPage;
      var ofset = this.ofsetRelease;
      var data = {
        docNo: this.filterFormApproved.docNo,
        ouId:
          this.filterFormApproved.ouId === ""
            ? -99
            : parseInt(this.filterFormApproved.ouId),
        partnerId:
          this.filterFormApproved.partnerId === ""
            ? -99
            : parseInt(this.filterFormApproved.partnerId),
        dateFrom: moment(this.filterFormApproved.dateFrom).format("YYYYMMDD"),
        dateTo: moment(this.filterFormApproved.dateTo).format("YYYYMMDD"),
        limit: itemPerPage,
        offset: ofset,
      };

      axios
        .get(
          `${themeConfig.app.api_cb}/disbursement/list/transfer/manual?ouId=${data.ouId}&dateFrom=${data.dateFrom}&dateTo=${data.dateTo}&partnerId=${data.partnerId}&limit=${data.limit}&offset=${data.offset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getCountData();
          if (response.data.result !== null) {
            this.mainDataRelease = response.data.result;
            this.mainDataRelease.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataRelease[index].beneficiaryBankCode +
                    "_logo.png")
                ) {
                  this.mainDataRelease[index].logoImage =
                    this.mainDataRelease[index].beneficiaryBankCode;
                }
                // do something
              } catch (e) {
                this.mainDataRelease[index].logoImage = "NONE";
                // do something else
              }
            });
          } else {
            this.mainDataRelease = [];
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          console.log(e);
          // if (e.response.status === 401) {
          //   localStorage.clear();
          //   sessionStorage.clear();
          //   router.push({ name: "auth-login" });
          // }
        });
    },

    amountSum() {
      this.amountTotal = 0;
      for (let i = 0; i < this.mainInvoiceData.length; i++) {
        if (this.mainInvoiceData[i].checked) {
          this.amountTotal += this.mainInvoiceData[i].itemAmount;
        }
      }
    },
  },
};
</script>
