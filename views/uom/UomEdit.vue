<template>
  <v-dialog persistent v-model="dialogEdit" width="1000">
    <v-card>
      <v-card-title>
        <v-row align="center">
          <v-col cols="auto">
            <h4>Edit Unit of Measurement</h4>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-icon @click="closeEditDialog"> mdi-close </v-icon>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" class="pb-0 mt-2">
            <v-text-field
              label="Measurement Name"
              persistent-placeholder
              :placeholder="'Insert Measurement Name'"
              dense
              class="mb-0"
              hide-details="auto"
              clearable
              v-model="uomData.uomName"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="pb-0 mt-2">
            <v-text-field
              label="Measurement Code"
              persistent-placeholder
              :placeholder="'Insert Unit Code'"
              dense
              class="mb-0"
              hide-details="auto"
              clearable
              v-model="uomData.uomCode"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="pb-0 mt-2"></v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" class="pb-0 mt-2">
            <app-autocomplite-uom-status
              :form-value.sync="uomData.active"></app-autocomplite-uom-status>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-card-actions class="headline">
          <v-spacer></v-spacer>
          <app-button
            color="primary"
            text="Save"
            icon-button="mdi-checkbox-marked-circle-outline"
            :click="saveUom" />
        </v-card-actions>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import UomList from "./UomList.vue";
import AppButton from "@/@core/components/app-button/AppButton.vue";
import themeConfig from "@themeConfig";
import { get, post } from "@/services/apiServices";
import { required } from "@core/utils/validation";
import AppAutocompliteUomStatus from "@/@core/components/app-autocomplite-uom/AppAutocompliteUomStatus.vue";

export default {
  components: {
    UomList,
    AppButton,
    AppAutocompliteUomStatus,
  },
  props: {
    dialogEdit: { type: Boolean, default: false },
    uomData: {
      type: Object,
      default: () => ({ uomCode: "", uomName: "", active: "" }),
    },
  },
  data() {
    return {
      label: themeConfig.labeling,
      placeholder: themeConfig.placeholder,
    };
  },
  methods: {
    async saveUom() {
      this.$loading(true);

      const url = `${themeConfig.app.api_master}/uom/edit`;

      try {
        const response = await post(url, this.uomData);
        if (response.data.meta.success) {
          this.$notify("success", response.data.meta.message);
          this.$emit("savedUom");
        } else {
          this.$notify("warning", "Something less common occurs");
        }
      } catch (error) {
        this.$notify("error", error.data.meta.message);
      } finally {
        this.$loading(false);
      }
    },
    handleClear() {
      this.formFilter.uomClass = "";
    },
    closeEditDialog() {
      this.$emit("closeEditDialog");
    },
  },
};
</script>
