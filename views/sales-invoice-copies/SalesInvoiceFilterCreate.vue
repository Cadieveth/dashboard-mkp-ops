<template>
  <div>
    <v-snackbar
      centered
      v-model="snackbar"
      :timeout="timeout"
      :color="color"
      outlined
      text
    >
      {{ text }}
    </v-snackbar>
    <v-card flat>
      <v-card-title><span></span></v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4" class="pb-0 mt-2">
            <app-autocomplite-ou-company
              :form-value.sync="salesInvoiceForm.ouId"
              :ou-type="'salesInvoiceCreate'"
            ></app-autocomplite-ou-company>
          </v-col>
          <v-col cols="12" md="4" class="pb-0 mt-2">
            <app-autocomplite-partner
              :form-value.sync="salesInvoiceForm.partnerId"
              :partner-type="'salesInvoiceCreate'"
            ></app-autocomplite-partner>
          </v-col>
          <v-col cols="12" md="4" class="pb-0 mt-2">
            <v-text-field
              dense
              hide-details
              :label="docNo"
              v-model="salesInvoiceForm.docNo"
              persistent-placeholder
              :placeholder="phDocNo"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4" class="pb-0 mt-2">
            <app-input-field-date
              :label-title="startDate"
              :value-date.sync="salesInvoiceForm.startDate"
            ></app-input-field-date>
          </v-col>
          <v-col cols="12" md="4" class="pb-0 mt-2">
            <app-input-field-date
              :label-title="endDate"
              :value-date.sync="salesInvoiceForm.endDate"
            ></app-input-field-date>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-btn small dark color="primary" @click="updateForm()">
          <v-icon dark left>
            {{ icons.mdiMagnify }}
          </v-icon>
          Filter
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import AppAutocompliteOuCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuCompany";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import Form from "vform";
import moment from "moment";
import themeConfig from "@themeConfig";
import { mdiMagnify } from "@mdi/js";
import { mapGetters, mapActions } from "vuex";
import { delay } from "../../utils/constan";

export default {
  components: {
    AppAutocompliteOuCompany,
    AppAutocomplitePartner,
    AppInputFieldDate,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      phDocNo: themeConfig.placeholder.docNo,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      icons: {
        mdiMagnify,
      },

      form: new Form({
        ouId: -99,
        partnerId: -99,
        docNo: "",
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
      }),
    };
  },
  computed: {
    ...mapGetters(["getSalesInvoiceCreate"]),
    salesInvoiceForm() {
      return this.getSalesInvoiceCreate;
    },
  },
  mounted() {
    this.$root.$on("appAutocompliteOuCompanySalesInvoiceCreate", (msg) => {
      // this.$root.$emit('appAutocomplitePartner', msg)
      this.form.partnerId = -99;
    });
    this.$root.$on("SalesInvoice", (msg) => {
      if (!msg) {
        this.form.clear();
        this.form.reset();
      } else {
      }
    });
  },
  methods: {
    ...mapActions(["setSalesInvoiceCreate", "setIsLoading", "changeLoading"]),
    async updateForm() {
      if (
        this.salesInvoiceForm.partnerId === -99 ||
        this.salesInvoiceForm.partnerId === null
      ) {
        this.notif("error", "Failed", "Please Select Partner");
      } else {
        this.setSalesInvoiceCreate(this.salesInvoiceForm);
        this.$root.$emit("filterSalesInvoiceCreate", this.form);
      }
    },
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
  },
};
</script>
