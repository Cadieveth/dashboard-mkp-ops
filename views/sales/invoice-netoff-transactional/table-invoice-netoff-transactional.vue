<template>
  <v-data-table
    :headers="headers"
    :items="mainData"
    hide-default-footer
    disable-pagination
    fixed-header
    dense
    v-model="selected"
    item-key="id"
    :show-select="showSelect"
    @toggle-select-all="selectAllToggle"
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
</template>

<script>
import { dateDisplay } from "../../../utils/dateConstan";
import { formatCurrency } from "../../../utils/currencyConstan";
import AppBusinessUnitInfo from "@/@core/components/app-table-component/AppBusinessUnitInfo";
import AppPartnerInfo from "@/@core/components/app-table-component/AppPartnerInfo";

export default {
  components: {
    AppBusinessUnitInfo,
    AppPartnerInfo,
  },
  props: {
    headers: { type: Array },
    mainData: { type: Array },
    selected: { type: Array },
    showSelect: { type: Boolean, default: false },
    selectAllToggle: { type: Function, default: () => {} },
    selectToggle: { type: Function, default: () => {} },
  },
  methods: {
    dateDisplay,
    formatCurrency,
  },
};
</script>
