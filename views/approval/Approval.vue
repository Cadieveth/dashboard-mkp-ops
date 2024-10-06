<template>
  <v-row>
    <v-col
        v-show="!formManageFlow"
        cols="12"
    >
      <approval-list></approval-list>
    </v-col>
    <v-col
      v-show="formManageFlow"
      cols="12">
      <manage-flow-approval></manage-flow-approval>
    </v-col>
  </v-row>
</template>

<script>
import ApprovalList from "@/views/approval/ApprovalList";
import ManageFlowApproval from "@/views/approval/ManageFlowApproval";

export default {
  name: 'Parent',
  components: {
    ApprovalList,
    ManageFlowApproval,
  },
  data() {
    return {
      formManageFlow: false,
    }
  },
  mounted() {
    this.$root.$on('formManageFlow', msg => {
      this.formManageFlow = msg
    })
  }
}
</script>