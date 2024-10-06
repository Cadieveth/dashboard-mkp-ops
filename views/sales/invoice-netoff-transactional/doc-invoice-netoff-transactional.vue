<template>
  <v-card flat>
    <v-card-text id="table">
      <v-row class="mb-4">
        <v-col md="1" sd="2">
          <v-select
            v-model="itemPerPage"
            :items="[25, 50, 100]"
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
        :items="mainData"
        hide-default-footer
        disable-pagination
        fixed-header
        dense
        item-key="id"
      >
        <template #[`item.actions`]="{ item }">
          <v-tooltip bottom color="warning">
            <template #activator="{ on, attrs }">
              <app-button
                color="warning"
                size="x-small"
                v-show="checkHumanTask('viewSalesInvoice')"
                :icon="true"
                :icon-button="icons.mdiClipboardEditOutline"
                :click="() => editData(item)"
              ></app-button>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom color="error">
            <template #activator="{ on, attrs }">
              <app-button
                color="error"
                size="x-small"
                v-show="
                  invoiceNetoffTabs === 1 &&
                  checkHumanTask('removeSalesInvoiceNettOff')
                "
                :icon="true"
                :icon-button="icons.mdiDelete"
                :click="() => deleteData(item)"
              ></app-button>
            </template>
            <span>Delete</span>
          </v-tooltip>
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

        <template #[`item.grossAmount`]="{ item }">
          {{ formatCurrency(item.grossAmount) }}
        </template>

        <template #[`item.taxAmount`]="{ item }">
          {{ formatCurrency(item.taxAmount) }}
        </template>

        <template #[`item.totalAmount`]="{ item }">
          {{ formatCurrency(item.totalAmount) }}
        </template>
      </v-data-table>
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @input="handlePageChange()"
        total-visible="5"
        v-scroll-to="'#table'"
      ></v-pagination>
    </v-card-text>
  </v-card>
</template>

<script>
import router from "@/router";
import themeConfig from "@themeConfig";
import { mdiClipboardEditOutline, mdiDelete, mdiPlus } from "@mdi/js";
import { dateFormat, dateDisplay } from "../../../utils/dateConstan";
import { checkHumanTask } from "@/utils/constan";
import AppBusinessUnitInfo from "@/@core/components/app-table-component/AppBusinessUnitInfo";
import AppPartnerInfo from "@/@core/components/app-table-component/AppPartnerInfo";
import AppButton from "@/@core/components/app-button/AppButton.vue";
import { mapGetters, mapActions, mapState } from "vuex";
import { post, get } from "@/services/apiServices";
import { formatCurrency } from "../../../utils/currencyConstan";

export default {
  components: {
    AppButton,
    AppBusinessUnitInfo,
    AppPartnerInfo,
  },
  props: {
    currentTab: { type: Number },
  },
  data() {
    return {
      offset: 0,
      currentPage: 1,
      itemPerPage: 25,
      totalPages: 0,
      headers: [
        {
          text: "Actions",
          value: "actions",
          width: "100px",
          align: "center",
          sortable: false,
        },
        {
          text: themeConfig.labeling.docNo,
          value: "docNo",
          width: "200px",
        },
        {
          text: themeConfig.labeling.docDate,
          value: "docDate",
          width: "150px",
        },
        {
          text: themeConfig.labeling.ouTbl,
          value: "ou",
          width: "200px",
        },
        {
          text: "Partner",
          value: "partner",
          width: "200px",
        },
        {
          text: "Gross Amount",
          value: "grossAmount",
          width: "150px",
          align: "right",
          sortable: false,
        },
        {
          text: "Tax Amount",
          value: "taxAmount",
          width: "100px",
          align: "right",
          sortable: false,
        },
        {
          text: "Total Amount",
          value: "totalAmount",
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
      workflowStatus: "",
      mainData: [],
      icons: {
        mdiDelete,
        mdiClipboardEditOutline,
      },
    };
  },
  computed: {
    ...mapState(["invoiceNetoffTabs"]),
    ...mapGetters(["getSalesInvoiceNetoffCreate"]),
    salesInvoiceNetoffForm() {
      return this.getSalesInvoiceNetoffCreate;
    },
  },
  mounted() {
    this.mainData = [];

    if (this.invoiceNetoffTabs === 1) {
      this.workflowStatus = "DRAFT";
      this.refreshData();
    } else if (this.invoiceNetoffTabs === 2) {
      this.workflowStatus = "IN PROGRESS";
      this.refreshData();
    } else if (this.invoiceNetoffTabs === 3) {
      this.workflowStatus = "RELEASED";
      this.refreshData();
    } else {
      return;
    }

    this.$root.$on("salesInvoiceNetoffDraft", (msg) => {
      this.refreshData(msg);
    });
    this.$root.$on("salesInvoiceNetoffInProgress", (msg) => {
      this.refreshData(msg);
    });
    this.$root.$on("salesInvoiceNetoffReleased", (msg) => {
      this.refreshData(msg);
    });
  },
  methods: {
    ...mapActions(["setInvoiceId"]),
    formatCurrency,
    dateDisplay,
    checkHumanTask,

    async getItemPerPage(value) {
      this.itemPerPage = value;
      this.offset = 0;
      this.currentPage = 1;
      this.refreshData();
    },

    async handlePageChange() {
      this.offset = (this.currentPage - 1) * this.itemPerPage;
      this.refreshData();
    },

    async refreshData() {
      this.$loading(true);
      this.mainData = [];

      const ouId = parseInt(this.salesInvoiceNetoffForm.ouId);
      const partnerId = parseInt(this.salesInvoiceNetoffForm.partnerId);
      const docNo = this.salesInvoiceNetoffForm.docNo;
      const dateFrom = dateFormat(this.salesInvoiceNetoffForm.startDate);
      const dateTo = dateFormat(this.salesInvoiceNetoffForm.endDate);
      const workflowStatus = this.workflowStatus;
      const itemPerPage = this.itemPerPage;
      const offset = this.offset;
      const url = `${themeConfig.app.api_sl}/sales-invoice/so/transaction/list?ouId=${ouId}&partnerId=${partnerId}&docNo=${docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&workflowStatus=${workflowStatus}&limit=${itemPerPage}&offset=${offset}`;

      try {
        const response = await get(url);
        if (response.data.result !== null) {
          this.mainData = response.data.result;
        } else {
          this.$notify("warning", "No Data Found");
        }
      } catch (error) {
        this.$notify("error", error.data.meta.message);
      }
      if (this.totalPages < this.itemPerPage) {
        this.countData(workflowStatus);
      } else {
        this.$loading(false);
      }
    },
    async countData() {
      const ouId = parseInt(this.salesInvoiceNetoffForm.ouId);
      const partnerId = parseInt(this.salesInvoiceNetoffForm.partnerId);
      const docNo = this.salesInvoiceNetoffForm.docNo;
      const dateFrom = dateFormat(this.salesInvoiceNetoffForm.startDate);
      const dateTo = dateFormat(this.salesInvoiceNetoffForm.endDate);
      const workflowStatus = this.workflowStatus;
      const url = `${themeConfig.app.api_sl}/sales-invoice/so/transaction/count?ouId=${ouId}&partnerId=${partnerId}&docNo=${docNo}&dateFrom=${dateFrom}&dateTo=${dateTo}&workflowStatus=${workflowStatus}`;

      try {
        const response = await get(url);
        if (response.data.result !== null) {
          this.totalPages = Math.ceil(response.data.result / this.itemPerPage);
          this.$notify("success", response.data.meta.message);
        } else {
          this.$notify("warning", "No Data Found");
        }
      } catch (error) {
        this.$notify("error", error.data.meta.message);
      }
      this.$loading(false);
    },

    async editData(item) {
      this.$loading(true);
      this.setInvoiceId(item.id);
      router.push({ path: "/sales/invoice-netoff/form" });
      this.$loading(false);
    },
    async deleteData(item) {
      const res = await this.$confirm();
      if (!res) {
        return;
      }
      this.$loading(true);
      const url = `${themeConfig.app.api_sl}/sales-invoice/so/transaction/remove/${item.id}`;
      try {
        const response = await get(url);
        this.$notify("success", response.data.meta.message);
        this.refreshData();
      } catch (error) {
        this.$notify("error", error.data.meta.message);
      }
      this.$loading(false);
    },
  },
};
</script>
