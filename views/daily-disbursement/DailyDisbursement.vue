<template>
  <v-row>
    <v-col
      cols="12"
    >
      <daily-disbursement-list></daily-disbursement-list>
    </v-col>
  </v-row>
</template>

<script>
import DailyDisbursementList from '@/views/daily-disbursement/DailyDisbursementList'

export default {
  name: 'Parent',
  components: {
    DailyDisbursementList,
  },
}
</script>