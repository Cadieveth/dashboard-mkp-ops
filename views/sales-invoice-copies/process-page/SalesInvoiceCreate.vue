<template>
  <v-card flat>
    <v-card-title>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <v-fade-transition>
          <p v-if="selected.length > 0" class="pr-3">
            Total Amount: {{ formatCurrency(totalAmount) }}
          </p>
        </v-fade-transition>
        <p class="mt-n1">
          <v-btn
            dark
            small
            color="primary"
            @click="createData()"
            v-show="showCreate"
          >
            <v-icon dark left>
              {{ icons.mdiPlus }}
            </v-icon>
            Create
          </v-btn>
        </p>
      </div>
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
        show-select
        @toggle-select-all="selectAllToggle($event)"
      >
        <template v-slot:item.data-table-select="{ item, isSelected, select }">
          <v-simple-checkbox
            :ripple="false"
            :value="isSelected"
            @click="selectToggle(isSelected, item)"
          ></v-simple-checkbox>
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
import { dataSalesInvoice } from "../SalesInvoiceData";
import AppBusinessUnitInfo from "@/@core/components/app-table-component/AppBusinessUnitInfo";
import AppPartnerInfo from "@/@core/components/app-table-component/AppPartnerInfo";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "SalesInvoiceCreate",
  components: {
    AppBusinessUnitInfo,
    AppPartnerInfo,
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
      // mainData: dataSalesInvoice,
      mainData: [],
      selected: [],
      totalAmount: 0,

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
          text: "Taxable Amount",
          value: "nettSellPrice",
          width: "160px",
          align: "right",
        },
        {
          text: "Tax Amount",
          value: "taxAmount",
          width: "160px",
          align: "right",
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
  computed: {
    ...mapGetters(["getSalesInvoiceCreate"]),
    salesInvoiceForm() {
      return this.getSalesInvoiceCreate;
    },
  },
  watch: {
    selected() {
      this.amountCalculation();
    },
  },
  mounted() {
    // this.$root.$on("filterSalesInvoiceCreate", (msg) => {
    //   this.selected = [];
    //   this.refreshDataSalesOrder();
    // });
  },
  methods: {
    ...mapActions(["setIsLoading"]),
    formatCurrency,
    dateDisplay,
    createData() {
      router.push({ path: "/sales/invoice-netoff/form" });
    },
    amountCalculation() {
      this.totalAmount = sumTotalAmount("grossSellPrice", this.selected);
    },
    selectAllToggle(event) {},
    selectToggle(event, item) {
      if (event) {
        this.selected = this.selected.filter((data) => data.id !== item.id);
      } else {
        this.selected.push(item);
      }
    },
    refreshDataSalesOrder() {
      this.setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId = parseInt(this.salesInvoiceForm.ouId);
      const partnerId = parseInt(this.salesInvoiceForm.partnerId);
      const dateFrom = dateFormat(this.salesInvoiceForm.startDate);
      const dateTo = dateFormat(this.salesInvoiceForm.endDate);
      axios
        .get(
          `${themeConfig.app.api_sl}/sales-invoice/so/transaction/outstanding/list?ouId=${ouId}&partnerId=${partnerId}&docNo=${this.salesInvoiceForm.docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainData = response.data.result;
          } else {
            this.mainData = [];
          }
          this.setIsLoading(false);
        })
        .catch((e) => {
          this.setIsLoading(false);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Gagal", e.response.data.meta.message);
        });
    },
  },
};
</script>
