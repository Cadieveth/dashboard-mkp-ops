<template>
  <v-dialog v-model="openModal" persistent :width="lookupWidth">
    <v-card>
      <v-card-title>
        <span class="font-weight-bold">Disbursement Document Information</span>
        <v-spacer></v-spacer>
        <v-btn color="secondary" icon small @click="closeForm()">
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headersDisbursementInfo"
          :items="disbursementInfo"
          hide-default-footer
          disable-pagination
          fixed-header
          dense
          class="mb-n2"
        >
          <template #[`header.partnerCode`]>
            {{ ou }}
          </template>
          <template #[`item.partnerCode`]="{ item }">
            <div>
              <span
                class="
                  d-block
                  text--primary
                  font-weight-semibold
                  text-truncate
                  mb-n1
                "
                >{{ item.partnerName }}</span
              >
              <span class="text-xs">{{ item.partnerCode }}</span>
            </div>
          </template>

          <template #[`item.countOfDraft`]="{ item }">
            <v-chip
              small
              :class="`${
                item.countOfDraft > 0 ? 'warning' : 'secondary'
              }--text`"
              class="v-chip-light-bg font-weight-semibold text-capitalize"
              :color="item.countOfDraft > 0 ? 'warning' : 'secondary'"
            >
              <span color="warning" v-if="item.countOfDraft > 0">
                {{ item.countOfDraft }} Draft
              </span>
              <span color="warning" v-if="item.countOfDraft === 0">
                {{ item.countOfDraft }} Draft
              </span>
            </v-chip>
          </template>
          <template #[`item.countOfInProgress`]="{ item }">
            <v-chip
              small
              :class="`${
                item.countOfInProgress > 0 ? 'info' : 'secondary'
              }--text`"
              class="v-chip-light-bg font-weight-semibold text-capitalize"
              :color="item.countOfInProgress > 0 ? 'info' : 'secondary'"
            >
              <span color="warning" v-if="item.countOfInProgress > 0">
                {{ item.countOfInProgress }} In Progress
              </span>
              <span color="warning" v-if="item.countOfInProgress === 0">
                {{ item.countOfInProgress }} In Progress
              </span>
            </v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mdiCheckAll, mdiClose, mdiPlus, mdiMagnify } from "@mdi/js";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocompliteOuSubbranchPartner from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranchPartner.vue";
import { dateFormat, isInArray, number_format } from "../../../../constan";
import themeConfig from "@themeConfig";
import axios from "@axios";
import _ from "lodash";
import moment from "moment";
import Form from "vform";

export default {
  name: "ModalComponent",
  components: {
    AppInputFieldDate,
    AppAutocompliteOuSubbranchPartner,
  },
  data() {
    return {
      ou: themeConfig.labeling.ou,
      icons: {
        mdiClose,
        mdiMagnify,
        mdiPlus,
        mdiCheckAll,
      },
      lookupWidth: "full",
      disbursementInfo: [],
      headersDisbursementInfo: [
        {
          text: "OU",
          value: "partnerCode",
          width: "250px",
        },
        {
          text: "Draft Disbursement",
          value: "countOfDraft",
          width: "250px",
        },
        {
          text: "In Progress Disbursement",
          value: "countOfInProgress",
          width: "250px",
        },
      ],
    };
  },
  props: {
    openModal: { type: Boolean, default: true },
    // disbursementInfo: { type: Array, default: () => [] },
  },

  computed: {},
  watch: {},
  mounted() {
    this.checkDisbursementInfo();
  },
  methods: {
    async delay(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    dateFormat(value) {
      return dateFormat(value);
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    closeForm() {
      this.$root.$emit("closeModalDisbursementInfo", false);
    },
    async checkDisbursementInfo() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      try {
        const response = await axios.get(
          `${themeConfig.app.api_master}/partner/disbursement/list`,
          config
        );

        this.disbursementInfo = response.data.result;
        this.disbursementInfo = _.sortBy(this.disbursementInfo, [
          "countOfDraft",
        ]).reverse();
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>
