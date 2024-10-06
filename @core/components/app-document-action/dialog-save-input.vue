<template>
  <v-dialog persistent v-model="openDialog" width="500">
    <v-card>
      <v-card-title class="font-weight-bold">
        <p>Input Reason</p>
        <v-spacer></v-spacer>
        <app-button
          :icon="true"
          color="secondary"
          :icon-button="icons.mdiClose"
          :click="closeReason"
        ></app-button>
      </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="reason"
          outlined
          dense
          hide-details
          label="Reason"
        ></v-textarea>
      </v-card-text>
      <v-card-title>
        <v-spacer></v-spacer>
        <app-button
          text="Save"
          :icon-button="icons.mdiCheckAll"
          :click="onSave"
          v-show="reasonType === 'save'"
        >
        </app-button>
        <app-button
          text="Save"
          :icon-button="icons.mdiCheckAll"
          :click="onEdit"
          v-show="reasonType === 'edit'"
        >
        </app-button>
        <app-button
          text="Submit"
          color="success"
          :icon-button="icons.mdiCheckAll"
          :click="onSubmit"
          v-show="reasonType === 'submit'"
        >
        </app-button>
        <app-button
          text="Change Request"
          color="error"
          :icon-button="'mdi-close'"
          :click="onChangeRequest"
          v-show="reasonType === 'changeRequest'"
        >
        </app-button>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
import AppButton from "@/@core/components/app-button/AppButton.vue";
import { mdiClose, mdiCheckAll } from "@mdi/js";

export default {
  name: "saveInputDialog",
  components: {
    AppButton,
  },
  props: {
    openDialog: { type: Boolean, default: false },
    reasonType: { type: String },
  },
  watch: {
    openDialog() {
      this.reason = "";
    },
  },
  data() {
    return {
      icons: { mdiClose, mdiCheckAll },
      reason: "",
    };
  },
  methods: {
    closeReason() {
      this.$emit("on-close");
    },
    onSave() {
      this.$emit("on-save", this.reason);
    },
    onEdit() {
      this.$emit("on-edit", this.reason);
    },
    onSubmit() {
      this.$emit("on-submit", this.reason);
    },
    onChangeRequest() {
      this.$emit("on-change-request", this.reason);
    },
  },
};
</script>
