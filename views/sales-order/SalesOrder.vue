<template>
  <div>
    <v-row>
      <v-col cols="12" v-show="!formSalesOrder">
        <sales-order-list> </sales-order-list>
      </v-col>
      <v-col cols="12" v-show="formSalesOrder">
        <sales-order-form></sales-order-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SalesOrderForm from "@/views/sales-order/SalesOrderForm.vue";
import SalesOrderList from "@/views/sales-order/SalesOrderList.vue";

export default {
  name: "Parent",
  components: {
    SalesOrderForm,
    SalesOrderList,
  },
  data() {
    return {
      formSalesOrder: false,
    };
  },
  mounted() {
    this.$root.$on("SalesInvoice", (msg) => {
      this.formSalesOrder = msg;
    });
  },
};
</script>
