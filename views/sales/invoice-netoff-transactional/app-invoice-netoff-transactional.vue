<!-- Create
    -> Panggil Component create-invoice-netoff-transactional
Input
    -> Pindah page dan panggil componen input-invoice-netoff-transactional
Draft
    -> Panggil Component view-invoice-netoff-transctional
In Pogress
    -> Panggil Component view-invoice-netoff-transctional
Approved
    -> Panggil Component view-invoice-netoff-transctional 
    -> Jika custom panggil Component view-approved-invoice-netoff-transctional -->
<template>
  <v-card>
    <v-card-title>
      <span>Sales Invoice Net Off Transactional</span>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-tabs grow :value="invoiceNetoffTabs" @change="changeTabs">
            <v-tab> Create </v-tab>
            <v-tab> Draft </v-tab>
            <v-tab> In Progress </v-tab>
            <v-tab> Approved </v-tab>
          </v-tabs>
          <v-tabs-items :value="invoiceNetoffTabs" class="mt-4">
            <v-tab-item>
              <v-row>
                <v-col cols="12" class="">
                  <filter-invoice-netoff-transactional></filter-invoice-netoff-transactional>
                </v-col>
                <v-col cols="12" class="">
                  <create-invoice-netoff-transactional></create-invoice-netoff-transactional>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col cols="12" class="">
                  <filter-invoice-netoff-transactional
                    :filter-type="'DRAFT'"
                  ></filter-invoice-netoff-transactional>
                </v-col>
                <v-col cols="12" class="">
                  <doc-invoice-netoff-transactional
                    ref="draftDoc"
                  ></doc-invoice-netoff-transactional>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col cols="12" class="">
                  <filter-invoice-netoff-transactional
                    :filter-type="'IN PROGRESS'"
                  ></filter-invoice-netoff-transactional>
                </v-col>
                <v-col cols="12" class="">
                  <doc-invoice-netoff-transactional
                    ref="inProgressDoc"
                  ></doc-invoice-netoff-transactional>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col cols="12" class="">
                  <filter-invoice-netoff-transactional
                    :filter-type="'RELEASED'"
                  ></filter-invoice-netoff-transactional>
                </v-col>
                <v-col cols="12" class="">
                  <doc-invoice-netoff-transactional
                    ref="releasedDoc"
                  ></doc-invoice-netoff-transactional>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import filterInvoiceNetoffTransactional from "@/views/sales/invoice-netoff-transactional/filter-invoice-netoff-transactional";
import createInvoiceNetoffTransactional from "@/views/sales/invoice-netoff-transactional/create-invoice-netoff-transactional";
import docInvoiceNetoffTransactional from "@/views/sales/invoice-netoff-transactional/doc-invoice-netoff-transactional.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import { delay } from "@/utils/constan";

export default {
  components: {
    filterInvoiceNetoffTransactional,
    createInvoiceNetoffTransactional,
    docInvoiceNetoffTransactional,
  },
  computed: {
    ...mapState(["invoiceNetoffTabs"]),
  },
  data() {
    return {
      currentTab: 0,
    };
  },

  methods: {
    ...mapActions(["setInvoiceNetoffTabs"]),
    async changeTabs(newVal) {
      this.$store.dispatch("resetVuex");
      this.setInvoiceNetoffTabs(newVal);
      await this.$nextTick();
      await delay(100);
      if (newVal === 1) {
        this.$refs.draftDoc.refreshData("DRAFT");
      } else if (newVal === 2) {
        this.$refs.inProgressDoc.refreshData("IN PROGRESS");
      } else if (newVal === 3) {
        this.$refs.releasedDoc.refreshData("RELEASED");
      } else {
        return;
      }
    },
  },
};
</script>
