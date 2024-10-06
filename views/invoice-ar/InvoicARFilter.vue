<template>
  <v-card outlined>
    <v-card-title>
      <span>Inquiry Account Receivable</span>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3" sm="6" class="pb-0">
          <app-autocomplite-ou-bu-main :form-value.sync="filterForm.ouId"></app-autocomplite-ou-bu-main>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0">
          <app-autocomplite-partner :form-value.sync="filterForm.partnerId"></app-autocomplite-partner>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0">
          <app-input-field-date :value-date.sync="filterForm.dateFrom" :label-title="dateFrom"></app-input-field-date>
        </v-col>
        <v-col cols="12" md="3" sm="6" class="pb-0">
          <app-input-field-date :value-date.sync="filterForm.dateTo" :label-title="dateTo"></app-input-field-date>
        </v-col>
        <v-col cols md="6" class="pb-0">
          <v-text-field
            outlined
            dense
            hide-details
            :label="docNo"
            v-model="filterForm.docNo"
            ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        small
        dark
        color="primary"
        @click="refreshInvoiceARList()"
        >
        <v-icon
          left
          dark
          >{{icons.mdiMagnify}}</v-icon>
        Filter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import AppAutocompliteOuBuMain from "@core/components/app-autocomplite-ou/AppAutocompliteOuBuMain";
  import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
  import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
  import Form from "vform";
  import moment from "moment";
  import themeConfig from "@themeConfig";
  import {mdiMagnify} from "@mdi/js";

  export default {
    name: 'ChildFilter',
    components: {
      AppAutocompliteOuBuMain,
      AppAutocomplitePartner,
      AppInputFieldDate,
    },
    data(){
      return{
        dateFrom : themeConfig.labeling.startDate,
        dateTo : themeConfig.labeling.endDate,
        docNo : themeConfig.labeling.docNo,
        filterForm: new Form({
          ouId: -99,
          partnerId: -99,
          dateFrom: moment().format("YYYY-MM-")+'01',
          dateTo: moment().format("YYYY-MM-DD"),
          docNo: '',
        }),
        icons: {
          mdiMagnify,
        },
      }
    },
    mounted() {
      this.$root.$on('appAutocompliteOuBuMain', msg => {
        this.$root.$emit('appAutocomplitePartner', msg)
        this.filterForm.partnerId = -99
      })
    },
    methods:{
      refreshInvoiceARList(){
        this.$root.$emit('filterInvoiceAR', this.filterForm)
      }
    }
  }
</script>