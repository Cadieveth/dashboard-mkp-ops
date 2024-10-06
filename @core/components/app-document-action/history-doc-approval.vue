<template>
  <v-dialog persistent v-model="openDialog" width="1200">
    <v-card>
      <v-card-title class="font-weight-bold">
        Document History
        <v-spacer></v-spacer>
        <app-button
          :icon="true"
          color="secondary"
          :icon-button="'mdi-close'"
          :click="closeReason"
        ></app-button>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="approvalHistory"
          hide-default-footer
          disable-pagination
          fixed-header
          dense
        >
          <template #[`item.fullName`]="{ item }">
            <app-bottom-top-info
              :top="item.fullName"
              :bottom="item.roleName"
            ></app-bottom-top-info>
          </template>
          <template #[`item.activeDatetime`]="{ item }">
            {{ dateTimeFormat(item.activeDatetime) }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import AppButton from "@/@core/components/app-button/AppButton.vue";
import AppBottomTopInfo from "@/@core/components/app-table-component/AppBottomTopInfo.vue";
import { dateTimeFormat } from "@/utils/dateConstan";

export default {
  components: {
    AppButton,
    AppBottomTopInfo,
  },
  props: {
    openDialog: { type: Boolean, default: false },
    approvalHistory: { type: Array },
  },
  data() {
    return {
      headers: [
        {
          text: "User",
          value: "fullName",
          width: "130px",
        },
        {
          text: "Activity",
          value: "activity",
          width: "150px",
        },
        {
          text: "Previous State",
          value: "previousState",
          width: "180px",
        },
        {
          text: "Next State",
          value: "nextState",
          width: "180px",
        },
        {
          text: "Activity Date Time",
          value: "activeDatetime",
          width: "150px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "150px",
        },
      ],
    };
  },
  methods: {
    dateTimeFormat,
    closeReason() {
      this.$emit("on-close");
    },
  },
};
</script>
