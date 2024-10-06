<template>
  <div>
    <v-row>
      <v-col cols="12">
        <cashbank-for-disbursement-summary-report-list></cashbank-for-disbursement-summary-report-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import CashbankForDisbursementSummaryReportList
    from "@/views/cash-bank-for-disbursement-summary-report/CashbankForDisbursementSummaryReportList";
  export default {
    name: "Parent",
    components: {
      CashbankForDisbursementSummaryReportList
    }
  }
</script>