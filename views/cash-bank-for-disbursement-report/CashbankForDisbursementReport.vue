<template>
  <div>
    <v-row>
      <v-col cols="12">
        <cashbank-for-disbursement-report-list></cashbank-for-disbursement-report-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import CashbankForDisbursementReportList
    from "@/views/cash-bank-for-disbursement-report/CashbankForDisbursementReportList";

  export default {
    name : "ReportParent",
    components: {
      CashbankForDisbursementReportList
    }
  }
</script>