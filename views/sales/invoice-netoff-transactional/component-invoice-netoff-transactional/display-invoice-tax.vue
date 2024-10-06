<template>
  <div>
    <v-row v-for="item in taxList" :key="item.id">
      <v-col cols="12" md="3" class="">
        <v-text-field
          dense
          hide-details
          readonly
          label="Tax Type"
          :value="item.taxName"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3" class="">
        <v-text-field
          dense
          hide-details
          readonly
          label="DPP"
          :value="formatCurrency(item.baseAmount)"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3" class="">
        <v-text-field
          dense
          hide-details
          readonly
          label="Tax Amount"
          :value="formatCurrency(item.taxAmount)"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3" class="">
        <v-text-field
          dense
          hide-details
          readonly
          label="Total Amount"
          :value="formatCurrency(item.taxAmount + item.baseAmount)"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { formatCurrency } from "@/utils/currencyConstan";

export default {
  props: {
    taxList: { type: Array },
  },
  data() {
    return {};
  },
  methods: {
    formatCurrency,
  },
};
</script>
