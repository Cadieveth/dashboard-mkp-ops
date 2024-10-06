<template>
  <v-card flat>
    <v-card-title class="py-0">
      <v-spacer></v-spacer>
      <app-button
        :click="createData"
        v-show="checkHumanTask('addSalesInvoice')"
        :icon-button="icons.mdiPlus"
        text="Create"></app-button>
    </v-card-title>
    <v-card-title class="py-0">
      <v-spacer></v-spacer>
      <v-fade-transition>
        <span>Total Amount: {{ totalGrossSellPrice() }}</span>
      </v-fade-transition>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="salesInvoiceNetoffData"
        hide-default-footer
        disable-pagination
        fixed-header
        dense
        :value="salesInvoiceNetoffSelected"
        item-key="id"
        show-select
        @toggle-select-all="selectAllToggle($event)">
        <template v-slot:item.data-table-select="{ item, isSelected, select }">
          <v-simple-checkbox
            :ripple="false"
            :value="isSelected"
            @click="selectToggle(isSelected, item)"></v-simple-checkbox>
        </template>

        <template #[`item.docDate`]="{ item }">
          {{ dateDisplay(item.docDate) }}
        </template>

        <template #[`item.ou`]="{ item }">
          <app-business-unit-info :data="item"></app-business-unit-info>
        </template>

        <template #[`item.partner`]="{ item }">
          <app-partner-info :data="item"></app-partner-info>
        </template>

        <template #[`item.grossSellPrice`]="{ item }">
          {{ formatCurrency(item.grossSellPrice) }}
        </template>

        <template #[`item.taxAmount`]="{ item }">
          {{ formatCurrency(item.taxAmount) }}
        </template>

        <template #[`item.nettSellPrice`]="{ item }">
          {{ formatCurrency(item.nettSellPrice) }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "@axios";
import router from "@/router";
import themeConfig from "@themeConfig";
import { mdiClipboardEditOutline, mdiDelete, mdiPlus } from "@mdi/js";
import { isInArray } from "../../../../constan";
import { dateFormat, dateDisplay } from "../../../utils/dateConstan";
import { formatCurrency } from "../../../utils/currencyConstan";
import { sumTotalAmount } from "../../../utils/arrayConstan";
import AppBusinessUnitInfo from "@/@core/components/app-table-component/AppBusinessUnitInfo";
import AppPartnerInfo from "@/@core/components/app-table-component/AppPartnerInfo";
import AppButton from "@/@core/components/app-button/AppButton.vue";
import { mapGetters, mapActions, mapState } from "vuex";

import { get, post } from "@/services/apiServices";
import { checkHumanTask } from "@/utils/constan";

export default {
  components: {
    AppBusinessUnitInfo,
    AppPartnerInfo,
    AppButton,
  },
  computed: {
    ...mapState(["salesInvoiceNetoffData", "salesInvoiceNetoffSelected"]),
    ...mapGetters([
      "getSalesInvoiceNetoffCreate",
      "getSalesInvoiceNetoffSelected",
      "getSalesInvoiceNetoffData",
    ]),
    salesInvoiceNetoffForm() {
      return this.getSalesInvoiceNetoffCreate;
    },
    salesInvoiceNetoffSelected() {
      return this.getSalesInvoiceNetoffSelected;
    },
  },
  data() {
    return {
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,

      showCreate:
        isInArray("addSalesInvoice", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username === "superadmin",
      icons: {
        mdiPlus,
        mdiDelete,
        mdiClipboardEditOutline,
      },

      form: {},
      mainData: [],
      headers: [
        {
          text: themeConfig.labeling.docNo,
          value: "docNo",
          width: "250px",
        },
        {
          text: themeConfig.labeling.docDate,
          value: "docDate",
          width: "120px",
        },
        {
          text: "Partner",
          value: "partner",
          width: "200px",
        },
        {
          text: "Total Amount",
          value: "grossSellPrice",
          width: "160px",
          align: "right",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("filterSalesInvoiceCreate", () => {
      this.refreshData();
    });
  },
  methods: {
    ...mapActions([
      "setIsLoading",
      "setSalesInvoiceNetoffSelected",
      "setSalesInvoiceNetoffData",
      "resetVuex",
    ]),
    formatCurrency,
    dateDisplay,
    checkHumanTask,
    async createData() {
      if (this.salesInvoiceNetoffForm.partnerId === -99) {
        this.$notify("warning", "Please Select a Partner");
      } else if (this.salesInvoiceNetoffSelected.length === 0) {
        this.$notify(
          "warning",
          "Please Select a Sales Invoice Data from the Table"
        );
      } else {
        router.push({ path: "/sales/invoice-netoff/form" });
      }
    },
    totalGrossSellPrice() {
      const totalAmount = sumTotalAmount(
        "grossSellPrice",
        this.salesInvoiceNetoffSelected
      );
      return this.formatCurrency(totalAmount);
    },
    selectAllToggle(event) {
      if (event.value) {
        this.setSalesInvoiceNetoffSelected(event.items);
      } else {
        this.setSalesInvoiceNetoffSelected([]);
      }
    },
    selectToggle(event, item) {
      if (event) {
        const result = this.salesInvoiceNetoffSelected.filter(
          (data) => data.id !== item.id
        );
        this.setSalesInvoiceNetoffSelected(result);
      } else {
        const result = this.salesInvoiceNetoffSelected;
        result.push(item);
        this.setSalesInvoiceNetoffSelected(result);
      }
    },
    async refreshData() {
      this.$loading(true);
      this.setSalesInvoiceNetoffData([]);

      const ouId = parseInt(this.salesInvoiceNetoffForm.ouId);
      const partnerId = parseInt(this.salesInvoiceNetoffForm.partnerId);
      const docNo = this.salesInvoiceNetoffForm.docNo;
      const dateFrom = dateFormat(this.salesInvoiceNetoffForm.startDate);
      const dateTo = dateFormat(this.salesInvoiceNetoffForm.endDate);
      const url = `${themeConfig.app.api_sl}/sales-invoice/so/transaction/outstanding/list?ouId=${ouId}&partnerId=${partnerId}&docNo=${docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}`;

      try {
        const response = await get(url);
        if (response.data.result !== null) {
          this.$notify("success", response.data.meta.message);
          this.setSalesInvoiceNetoffData(response.data.result);
        } else {
          this.$notify("warning", "No Data Found");
        }
      } catch (e) {
        this.$notify("error", e.data.message); // error message fix format
        if (e.response.status === 401) {
          this.resetVuex();
        }
      }
      this.$loading(false);
    },
  },
};
</script>
