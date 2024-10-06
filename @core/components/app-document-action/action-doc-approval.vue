<template>
  <v-card-actions :class="showStatus ? '' : 'mt-6'">
    <history-doc-approval
      @on-close="() => (openHistory = false)"
      :open-dialog="openHistory"
      :approval-history="approvalHistory"
    ></history-doc-approval>
    <app-chip v-show="showStatus" :statusDoc="currentState"></app-chip>
    <v-spacer></v-spacer>
    <app-button
      color="secondary"
      text="Exit"
      :icon-button="icons.mdiExitToApp"
      :click="closeForm"
    />
    <app-button
      color="primary"
      text="Save"
      :icon-button="icons.mdiCheckboxMarkedCircleOutline"
      :click="() => openCloseReason('save')"
      v-show="currentState === 'NONE' && checkHumanTask(createHumanTask)"
    />
    <app-button
      color="primary"
      text="Save"
      :icon-button="icons.mdiCheckboxMarkedCircleOutline"
      :click="() => openCloseReason('edit')"
      v-show="currentState === 'DRAFT' && checkHumanTask(editHumanTask)"
    />
    <app-button
      color="success"
      text="Submit"
      :icon-button="icons.mdiCheckAll"
      v-show="
        ((currentState !== 'APPROVED' && currentState !== 'NONE') ||
          currentState === 'DRAFT') &&
        checkHumanTask(submitHumanTask)
      "
      :click="() => openCloseReason('submit')"
    />
    <app-button
      color="error"
      text="Change Request"
      :icon-button="icons.mdiClose"
      v-show="
        currentState === 'INCOMING APPROVAL REQUEST' &&
        checkHumanTask(changeRequestHumanTask)
      "
      :click="() => openCloseReason('changeRequest')"
    />
    <app-button
      v-show="currentState !== 'NONE'"
      color="info"
      text="History"
      :icon-button="icons.mdiEye"
      :click="getDocHistory"
    />
  </v-card-actions>
</template>

<script>
import themeConfig from "@themeConfig";
import {
  mdiExitToApp,
  mdiCheckboxMarkedCircleOutline,
  mdiCheckAll,
  mdiClose,
  mdiEye,
} from "@mdi/js";
import AppButton from "@/@core/components/app-button/AppButton.vue";
import AppChip from "@/@core/components/app-input-component/AppChip.vue";
import { get } from "@/services/apiServices";
import historyDocApproval from "@/views/sales/invoice-netoff-transactional/component-invoice-netoff-transactional/history-doc-approval";
import { checkHumanTask } from "@/utils/constan";

export default {
  components: {
    AppButton,
    AppChip,
    historyDocApproval,
  },
  props: {
    scheme: { type: String },
    docId: { type: Number },
    showStatus: { type: Boolean, default: true },
    createHumanTask: { type: String },
    editHumanTask: { type: String },
    submitHumanTask: { type: String },
    changeRequestHumanTask: { type: String },
    printHumanTask: { type: String },
    voidHumanTask: { type: String },
  },
  data() {
    return {
      reqId: "",
      currentState: "NONE",
      icons: {
        mdiExitToApp,
        mdiCheckboxMarkedCircleOutline,
        mdiCheckAll,
        mdiClose,
        mdiEye,
      },
      openHistory: false,
      approvalHistory: [],
    };
  },
  watch: {
    docId() {
      this.getDocStatus();
    },
  },
  mounted() {
    this.$root.$on("getInvoiceNetoffDocStatus", (msg) => {
      this.getDocStatus(msg);
    });
  },
  methods: {
    checkHumanTask,
    openCloseReason(type) {
      if (type === "save") {
        this.$emit("on-save", type);
      } else if (type === "edit") {
        this.$emit("on-edit", type);
      } else if (type == "submit") {
        this.$emit("on-submit", type);
      } else if (type === "changeRequest") {
        this.$emit("on-change-request", type);
      } else {
        return;
      }
    },
    closeForm() {
      this.$emit("on-close");
    },
    async getDocStatus(id) {
      const url = `${themeConfig.app.api_awe}/approval/current-document/${
        this.scheme
      }/${id ? id : this.docId}`;
      try {
        const response = await get(url);
        this.currentState = response.data.result.currentState;
        this.reqId = response.data.result.reqId;
      } catch (error) {
        this.$notify("error", error.data.meta.message);
      }
    },
    async getDocHistory() {
      const url = `${themeConfig.app.api_awe}/approval/history-document/${this.reqId}`;
      try {
        const response = await get(url);
        this.approvalHistory = response.data.result.reverse();
        this.openHistory = true;
      } catch (error) {
        this.$notify("error", error.data.meta.message);
      }
    },
  },
};
</script>
