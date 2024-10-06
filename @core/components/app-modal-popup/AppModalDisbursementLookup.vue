<template>
  <v-dialog v-model="openModal" persistent :width="lookupWidth">
    <v-card>
      <v-card-title>
        <span class="font-weight-bold">Look Up Disbursement</span>
        <v-spacer></v-spacer>
        <v-btn color="secondary" icon small @click="closeForm()">
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text v-show="!noDisbursementItem" class="">
        <v-row>
          <v-col cols="12" md="3" class="pb-0">
            <app-autocomplite-ou-subbranch-partner
              :form-value.sync="form.ouSubBranchId"
              ou-sub-branch-type="cashbankDisbursementLookup"
              :partner-id="partnerId"
              :handle-clear="handleClearOuSub"
            >
            </app-autocomplite-ou-subbranch-partner>
          </v-col>
          <v-col cols="12" md="3" class="mb-0">
            <app-input-field-date
              :label-title="'Date From'"
              :value-date.sync="form.dateFrom"
              :clearable="true"
              :handle-clear="handleClearDateFrom"
            ></app-input-field-date>
          </v-col>
          <v-col cols="12" md="3" class="mb-0">
            <app-input-field-date
              :label-title="'Date To'"
              :value-date.sync="form.dateTo"
              :clearable="true"
              :handle-clear="handleClearDateTo"
            ></app-input-field-date>
          </v-col>
          <v-col></v-col>
        </v-row>
      </v-card-text>
      <v-card-title v-show="!noDisbursementItem" class="">
        <v-btn class="mr-2" color="primary" small dark @click="addData()">
          <v-icon dark left>{{ icons.mdiPlus }}</v-icon>
          Create Disbursement
        </v-btn>
        <v-btn
          :color="isAllSelected ? 'error' : 'success'"
          small
          dark
          @click="selectAllData()"
        >
          <v-icon dark left>{{
            isAllSelected ? icons.mdiClose : icons.mdiCheckAll
          }}</v-icon>
          {{ isAllSelected ? "De-Select All " : "Select All" }}
        </v-btn>
        <v-spacer></v-spacer>
        <div class="mr-4 text-lg">
          <span class="me-2">Total Amount:</span>
          <span class="font-weight-semibold"
            >Rp. {{ number_format(amount) }}</span
          >
        </div>
      </v-card-title>
      <v-card-text class="d-flex justify-center" v-show="noDisbursementItem">
        <p class="font-weight-bold text-xl px-20" v-show="noDisbursementItem">
          Disbursement Data not Found
        </p>
      </v-card-text>
      <v-card-text v-show="!noDisbursementItem" class="">
        <v-tabs grow v-model="activeTab" @change="changeTab">
          <v-tab v-for="(tabName, tabIndex) in uniqueNames" :key="tabName">
            {{ tabName }}
          </v-tab>
        </v-tabs>

        <v-card-text
          class="d-flex justify-center"
          v-show="disbursementData.length === 0"
        >
          <p
            class="font-weight-bold text-xl px-20"
            v-show="disbursementData.length === 0"
          >
            Disbursement Data not Found
          </p>
        </v-card-text>
        <div v-for="(value, valueIndex) in sortedData" :key="valueIndex">
          <v-card-title>
            {{ dateFormat(valueIndex) }}
          </v-card-title>
          <v-data-table
            :headers="headersInvoiceList"
            :items="value"
            hide-default-footer
            disable-pagination
            fixed-header
            dense
            v-model="selected"
            item-key="id"
            show-select
            @toggle-select-all="selectAllToggle($event)"
          >
            <template #[`header.ou`]>
              {{ ou }}
            </template>

            <template
              v-slot:item.data-table-select="{ item, isSelected, select }"
            >
              <v-simple-checkbox
                :ripple="false"
                :value="isSelected"
                @input="select($event)"
                @click="selectToggle(isSelected, item)"
              ></v-simple-checkbox>
            </template>

            <!-- format tanggal-->
            <template #[`item.docDate`]="{ item }">
              {{ dateFormat(item.docDate) }}
            </template>
            <template #[`item.dueDate`]="{ item }">
              {{ item.dueDate == "" ? "-" : dateFormat(item.dueDate) }}
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

            <!-- format uang-->
            <template #[`item.amount`]="{ item }">
              Rp.{{
                number_format(
                  item.settledAmount +
                    item.settledAmountAdd -
                    (item.settledAmountCancel + item.settledAmountRcv)
                )
              }}
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mdiCheckAll, mdiClose, mdiPlus, mdiMagnify } from "@mdi/js";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocompliteOuSubbranchPartner from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranchPartner.vue";
import { dateFormat, isInArray, number_format } from "../../../../constan";
import themeConfig from "@themeConfig";
import _ from "lodash";
import moment from "moment";
import Form from "vform";

export default {
  name: "ModalComponent",
  components: {
    AppInputFieldDate,
    AppAutocompliteOuSubbranchPartner,
  },
  data() {
    return {
      ou: themeConfig.labeling.ou,
      selectedItems: [],
      showSelectAll: true,
      selected: [],
      icons: {
        mdiClose,
        mdiMagnify,
        mdiPlus,
        mdiCheckAll,
      },
      lookupWidth: "full",
      amount: 0,
      docDate: themeConfig.labeling.docDate,
      form: new Form({
        dateFrom: "",
        dateTo: "",
        ouSubBranchId: null,
      }),
      isAllSelected: false,
      noDisbursementItem: true,
      activeTab: 0,
      headersInvoiceList: [
        {
          text: "Doc No",
          value: "docNo",
          width: "250px",
        },
        {
          text: "Doc Date",
          value: "docDate",
          width: "125px",
        },
        {
          text: "OU",
          value: "ou",
          width: "250px",
        },
        {
          text: "Payment Method",
          value: "paymentMethodCode",
          width: "150px",
        },
        {
          text: "Amount",
          value: "amount",
          align: "right",
          width: "200px",
        },
      ],
      tabPaymentMethod: [],
      disbursementData: [],
      disbursementSelected: [],
    };
  },
  props: {
    openModal: { type: Boolean, default: true },
    disbursementItem: { type: Array, default: () => [] },
    selectedItem: { type: Array, default: () => [] },
    partnerId: { type: Number, default: -99 },
  },

  computed: {
    uniqueNames() {
      const initialArray = [
        "FLAZZ",
        "BRIZZI",
        "E-MONEY",
        "TAPCASH",
        "DEBIT",
        "QRIS",
      ];
      this.tabPaymentMethod = [];
      const result = Array.from(
        new Set(this.disbursementItem.map((item) => item.paymentMethodCode))
      );
      this.tabPaymentMethod = this.arraySortBy(result, initialArray);
      return this.arraySortBy(result, initialArray);
    },
    sortedData() {
      //   var mapData = _.filter(this.disbursementItem, function (i) {
      //     return i.paymentMethodCode === "DEBIT";
      //   });
      var grouped = _.groupBy(this.disbursementData, "docDate");
      return grouped;
    },

    groupedData() {
      const result = {};
      this.disbursementData.forEach((data) => {
        if (!result[data.paymentMethodCode]) {
          result[data.paymentMethodCode] = [];
        }
        result[data.paymentMethodCode].push(data);
      });
      return result;
    },
  },
  watch: {
    disbursementItem(newVal) {
      this.executeFunction();
    },
    tabPaymentMethod(newVal) {
      this.dataFiltration();
      var result = _.filter(this.disbursementData, function (i) {
        return i.paymentMethodCode === newVal[0];
      });
      this.disbursementData = result;
    },
    selected(newVal) {
      this.amount = 0;

      this.selected.forEach((item) => {
        this.amount +=
          item.settledAmount +
          item.settledAmountAdd -
          (item.settledAmountCancel + item.settledAmountRcv);
      });
    },
    "form.ouSubBranchId": {
      async handler(newVal) {
        await this.dataFiltration();
        const paymentMethod = this.tabPaymentMethod[this.activeTab];
        var result = _.filter(this.disbursementData, function (i) {
          return i.paymentMethodCode === paymentMethod;
        });
        this.disbursementData = result;
      },
      deep: true,
    },
    "form.dateFrom": {
      async handler(newVal) {
        await this.dataFiltration();
        const paymentMethod = this.tabPaymentMethod[this.activeTab];
        var result = _.filter(this.disbursementData, function (i) {
          return i.paymentMethodCode === paymentMethod;
        });
        this.disbursementData = result;
      },
      deep: true,
    },
    "form.dateTo": {
      async handler(newVal) {
        await this.dataFiltration();
        const paymentMethod = this.tabPaymentMethod[this.activeTab];
        var result = _.filter(this.disbursementData, function (i) {
          return i.paymentMethodCode === paymentMethod;
        });
        this.disbursementData = result;
      },
      deep: true,
    },
  },
  mounted() {
    this.executeFunction();
  },
  methods: {
    changeTab(item) {
      const paymentMethod = this.tabPaymentMethod[item];
      this.dataFiltration();
      var result = _.filter(this.disbursementData, function (i) {
        return i.paymentMethodCode === paymentMethod;
      });
      this.disbursementData = result;
    },
    arraySortBy(array, initialArray) {
      // return _.sortBy(array, (item) => item.charAt(0));
      return _.sortBy(array, (item) => initialArray.indexOf(item));
    },
    async delay(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    async handleClearOuSub() {
      this.form.ouSubBranchId = null;
    },
    handleClearDateFrom() {
      this.form.dateFrom = "";
    },
    handleClearDateTo() {
      this.form.dateTo = "";
    },
    executeFunction() {
      console.log("disbursementItem", this.disbursementItem);
      if (this.disbursementItem.length === 0) {
        this.noDisbursementItem = true;
      } else {
        this.noDisbursementItem = false;
      }
    },
    async dataFiltration() {
      if (
        this.form.ouSubBranchId !== null &&
        this.form.dateFrom !== "" &&
        this.form.dateTo !== ""
      ) {
        this.disbursementData = _.filter(this.disbursementItem, (obj) => {
          const date = moment(obj.docDate, "YYYYMMDD");
          return (
            date.isSameOrAfter(this.form.dateFrom) &&
            date.isSameOrBefore(this.form.dateTo) &&
            obj.ouId === this.form.ouSubBranchId
          );
        });
      } else if (
        this.form.ouSubBranchId !== null &&
        this.form.dateFrom === "" &&
        this.form.dateTo === ""
      ) {
        this.disbursementData = _.filter(this.disbursementItem, (obj) => {
          const date = moment(obj.docDate, "YYYYMMDD");
          return obj.ouId === this.form.ouSubBranchId;
        });
      } else if (
        this.form.ouSubBranchId !== null &&
        this.form.dateFrom !== "" &&
        this.form.dateTo === ""
      ) {
        this.disbursementData = _.filter(this.disbursementItem, (obj) => {
          const date = moment(obj.docDate, "YYYYMMDD");
          return (
            date.isSameOrAfter(this.form.dateFrom) &&
            obj.ouId === this.form.ouSubBranchId
          );
        });
      } else if (
        this.form.ouSubBranchId !== null &&
        this.form.dateFrom === "" &&
        this.form.dateTo !== ""
      ) {
        this.disbursementData = _.filter(this.disbursementItem, (obj) => {
          const date = moment(obj.docDate, "YYYYMMDD");
          return (
            date.isSameOrBefore(this.form.dateTo) &&
            obj.ouId === this.form.ouSubBranchId
          );
        });
      } else if (
        this.form.ouSubBranchId === null &&
        this.form.dateTo !== "" &&
        this.form.dateFrom !== ""
      ) {
        this.disbursementData = _.filter(this.disbursementItem, (obj) => {
          const date = moment(obj.docDate, "YYYYMMDD");
          return (
            date.isSameOrAfter(this.form.dateFrom) &&
            date.isSameOrBefore(this.form.dateTo)
          );
        });
      } else if (
        this.form.ouSubBranchId === null &&
        this.form.dateTo === "" &&
        this.form.dateFrom !== ""
      ) {
        this.disbursementData = _.filter(this.disbursementItem, (obj) => {
          const date = moment(obj.docDate, "YYYYMMDD");
          return date.isSameOrAfter(this.form.dateFrom);
        });
      } else if (
        this.form.ouSubBranchId === null &&
        this.form.dateTo !== "" &&
        this.form.dateFrom === ""
      ) {
        this.disbursementData = _.filter(this.disbursementItem, (obj) => {
          const date = moment(obj.docDate, "YYYYMMDD");
          return date.isSameOrBefore(this.form.dateTo);
        });
      } else if (
        this.form.ouSubBranchId === null &&
        this.form.dateFrom === "" &&
        this.form.dateTo === ""
      ) {
        this.disbursementData = this.disbursementItem;
      }
      this.disbursementSelected = this.disbursementData;
      if (this.disbursementSelected.length <= this.selected.length) {
        this.isAllSelected = true;
      } else {
        this.isAllSelected = false;
      }
    },

    selectAllData() {
      if (this.isAllSelected === true) {
        this.selected = [];
        this.isAllSelected = false;
      } else {
        var selectedResult = _.unionBy(
          this.selected,
          this.disbursementSelected,
          "id"
        );
        this.selected = selectedResult;
        this.isAllSelected = true;
      }
    },
    setInvoiceApList() {
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
    addData() {
      this.closeForm();
      var messages = {
        selected: this.selected,
        amount: this.amount,
      };
      this.$root.$emit("disbursementSelectedItem", messages);
    },
    dateFormat(value) {
      return dateFormat(value);
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    selectAll() {
      this.showSelectAll = false;
      this.selectedItems = this.items.map((item) => item.id);
    },
    deSelectAll() {
      this.showSelectAll = true;
      this.selectedItems = [];
    },
    closeForm() {
      this.$root.$emit("closeModalDisbursementLookup", false);
      // console.log(this.form);
    },
    clearDocDate() {
      this.form.docDate = "";
    },
    onTabClick(tabName) {
      //   console.log("tabName", tabName);
    },
    sortData(array, columnName) {
      var sortedData = {};

      for (var i = 0; i < array.length; i++) {
        var object = array[i];

        if (Object.keys(sortedData).indexOf(object[columnName]) === -1) {
          sortedData[object[columnName]] = [];
        }

        sortedData[object[columnName]].push(object);
      }
      //   console.log(sortedData);
      return sortedData;
    },
    isDataAvaiable(data, paymentMethodCode, docDate) {
      const result = data.filter(
        (item) =>
          item.paymentMethodCode === paymentMethodCode &&
          item.docDate === docDate
      );
      if (result === []) {
        return false;
      } else {
        return true;
      }
    },
    separateData(data, paymentMethodCode, docDate) {
      const result = data.filter(
        (item) =>
          item.paymentMethodCode === paymentMethodCode &&
          item.docDate === docDate
      );
      //   console.log(paymentMethodCode, result);
      return result;
    },
    selectAllToggle(props) {
      // console.log(props.items);
    },
    async selectToggle(event, item) {
      console.log(event, item);
      if (event === true) {
        console.log("satu");
        this.selected.filter((item) => item.id !== item.id);
        console.log("dua");
      } else {
        this.selected.push(item);
        console.log("push");
      }
    },
    async filterData(data, type) {
      this.disbursementData = _.filter(this.disbursementItem, (obj) => {
        const date = moment(obj.docDate, "YYYYMMDD");
        return (
          date.isSameOrAfter(this.form.dateFrom) &&
          date.isSameOrBefore(this.form.dateTo)
        );
      });
    },
  },
};
</script>
