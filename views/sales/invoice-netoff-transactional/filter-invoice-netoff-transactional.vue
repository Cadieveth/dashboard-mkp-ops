<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" class="pb-0">
          <app-autocomplite-ou-company
            :form-value.sync="salesInvoiceForm.ouId"
            @onClear="onClearOu"></app-autocomplite-ou-company>
        </v-col>
        <v-col cols="12" md="4" class="pb-0">
          <app-autocomplite-partner
            :form-value.sync="salesInvoiceNetoffForm.partnerId"
            type="filterForm"
            :ou-id="salesInvoiceForm.ouId"></app-autocomplite-partner>
        </v-col>
        <v-col cols="12" md="4" class="pb-0">
          <v-text-field
            dense
            :label="labeling.docNo"
            v-model="salesInvoiceForm.docNo"
            :placeholder="placeholder.docNo"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" class="pb-0">
          <app-input-field-date
            :label-title="labeling.startDate"
            :value-date.sync="
              salesInvoiceForm.startDate
            "></app-input-field-date>
        </v-col>
        <v-col cols="12" md="4" class="pb-0">
          <app-input-field-date
            :label-title="labeling.endDate"
            :value-date.sync="salesInvoiceForm.endDate"></app-input-field-date>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mt-4">
      <app-button :click="updateForm" :text="'Filter'"></app-button>
    </v-card-actions>
  </v-card>
</template>

<script>
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-for-filter/AppAutocompliteOuCompany";
import AppAutocomplitePartner from "@core/components/app-autocomplite-for-filter/AppAutocomplitePartner";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppButton from "../../../@core/components/app-button/AppButton.vue";
import themeConfig from "@themeConfig";
import { mdiMagnify } from "@mdi/js";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppInputFieldDate,
    AppButton,
  },
  props: {
    filterType: { type: String, default: "CREATE" },
  },
  data() {
    return {
      labeling: themeConfig.labeling,
      placeholder: themeConfig.placeholder,

      icons: {
        mdiMagnify,
      },
    };
  },
  computed: {
    ...mapGetters([
      "getSalesInvoiceNetoffCreate",
      "getSalesInvoiceNetoffSelected",
    ]),
    salesInvoiceNetoffForm() {
      return this.getSalesInvoiceNetoffCreate;
    },
    salesInvoiceNetoffSelected() {
      return this.getSalesInvoiceNetoffSelected;
    },
  },
  mounted() {},
  methods: {
    ...mapActions([
      "setSalesInvoiceNetoffCreate",
      "setIsLoading",
      "changeLoading",
    ]),
    onClearOu() {
      this.salesInvoiceNetoffForm.ouId = -99;
      this.salesInvoiceNetoffForm.partnerId = -99;
    },
    updateForm() {
      console.log(this.filterType);
      if (this.filterType === "CREATE") {
        this.createSalesInvoice();
      } else if (this.filterType === "DRAFT") {
        this.$root.$emit("salesInvoiceNetoffDraft", this.filterType);
      } else if (this.filterType === "IN PROGRESS") {
        this.$root.$emit("salesInvoiceNetoffInProgress", this.filterType);
      } else if (this.filterType === "RELEASED") {
        this.$root.$emit("salesInvoiceNetoffReleased", this.filterType);
      }
    },
    createSalesInvoice() {
      if (
        this.salesInvoiceNetoffForm.partnerId === -99 ||
        this.salesInvoiceNetoffForm.partnerId === null
      ) {
        this.$notify("error", "Please Select Partner");
      } else {
        this.setSalesInvoiceNetoffCreate(this.salesInvoiceNetoffForm);
        this.$root.$emit("filterSalesInvoiceCreate");
      }
    },
  },
};
</script>
