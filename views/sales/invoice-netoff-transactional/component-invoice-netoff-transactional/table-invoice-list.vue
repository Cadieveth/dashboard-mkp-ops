<template>
  <v-data-table
    :headers="headers"
    :items="mainData"
    hide-default-footer
    disable-pagination
    fixed-header
    dense
  >
    <template #[`item.docDate`]="{ item }">
      {{ dateDisplay(item.docDate) }}
    </template>

    <template #[`item.ou`]="{ item }">
      <app-business-unit-info :data="item"></app-business-unit-info>
    </template>

    <template #[`item.partner`]="{ item }">
      <app-partner-info :data="item"></app-partner-info>
    </template>

    <template #[`item.total`]="{ item }">
      {{
        formatCurrency(status === "NONE" ? item.grossSellPrice : item.amount)
      }}
    </template>
  </v-data-table>
</template>

<script>
import themeConfig from "@themeConfig";
import AppBusinessUnitInfo from "@/@core/components/app-table-component/AppBusinessUnitInfo.vue";
import AppPartnerInfo from "@/@core/components/app-table-component/AppPartnerInfo.vue";
import { dateDisplay } from "@/utils/dateConstan";
import { formatCurrency } from "@/utils/currencyConstan";

export default {
  components: {
    AppBusinessUnitInfo,
    AppPartnerInfo,
  },
  props: {
    mainData: { type: Array },
    status: { type: String },
  },
  watch: {},
  data() {
    return {
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
          value: "total",
          width: "160px",
          align: "right",
        },
      ],
    };
  },
  methods: {
    formatCurrency,
    dateDisplay,
  },
};
</script>
