<template>
  <div class="text-center">
    <v-dialog v-model="showDialog" width="1000">
      <v-card>
        <v-card-title>
          <h4>Add Unit of Measurement</h4>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" class="pb-0 mt-2">
              <v-text-field
                v-model="uomData.uomCode"
                label="UoM Code"
                persistent-placeholder
                :placeholder="'Insert Unit of Measurement Code'"
                dense
                class="mb-0"
                hide-details="auto"
                clearable
                :rules="[
                  (v) => !!v || 'This field is required',
                ]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 mt-2">
              <v-text-field
                v-model="uomData.uomName"
                label="UoM Name"
                persistent-placeholder
                :placeholder="'Insert Unit of Measurement Name'"
                dense
                class="mb-0"
                hide-details="auto"
                clearable
                :rules="[
                  (v) => !!v || 'This field is required',
                ]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 mt-2">
              <app-autocomplite-uom-class
                :clearable="true"
                :form-value.sync="uomData.uomClass"
                :read-only="false"
                :on-clear="handleClear"></app-autocomplite-uom-class>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-card-actions class="headline">
            <v-spacer></v-spacer>
            <app-button
              color="secondary"
              text="Exit"
              icon-button="mdi-exit-to-app"
              :click="closeDialog" />
            <app-button
              color="primary"
              text="Save"
              icon-button="mdi-checkbox-marked-circle-outline"
              :click="saveAndCloseDialog" />
          </v-card-actions>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { get, post } from "@/services/apiServices";
import { required } from "@core/utils/validation";
import AppButton from "@/@core/components/app-button/AppButton.vue";
import themeConfig from "@themeConfig";
import AppAutocompliteUomClass from "@/@core/components/app-autocomplite-uom/AppAutocompliteUomClass.vue";
import UomList from "./UomList.vue";

export default {
  components: {
    AppButton,
    AppAutocompliteUomClass,
    UomList,
  },
  props: {
    showDialog: Boolean,
  },
  data() {
    return {
      showDialogLocal: this.showDialog,
      localShowDialog: this.showDialog,
      label: themeConfig.labeling,
      placeholder: themeConfig.placeholder,
      uomData: {
        uomCode: "",
        uomName: "",
        uomClass: "",
      },
      snackbar: {
        show: false,
        message: "",
      },
    };
  },
  methods: {
    async addUom() {
      this.$loading(true);

      const url = `${themeConfig.app.api_master}/uom/add`;

      try {
        const response = await post(url, this.uomData);
        if (response.data.meta.success) {
          this.$notify("success", response.data.meta.message);
          // this.$router.push({ name: "uom" });
        } else {
          this.$notify("warning", "Something less common occurs");
        }
      } catch {
        this.$notify("error", error.response.data.meta.message);
        console.error("Invalid API Add response:", response.data);
        console.error("Error while adding warehouse:", error);
      }
      this.$loading(false);
    },
    async saveAndCloseDialog() {
      try {
        await this.addUom();
        this.$emit("save-and-close-dialog");
        this.$emit("refresh-data");
      } catch (error) {
        console.error("Terjadi kesalahan saat menambahkan UOM:", error);
      }
      this.showDialogLocal = false;
    },
    handleClear() {
      this.formFilter.uomClass = "";
    },
    closeDialog() {
      this.localShowDialog = false;
      this.$emit("closeDialog");
    },
  },
  validations: {
    uomData: {
      uomCode: {
        required,
      },
      uomName: {
        required,
      },
      uomClass: {
        required,
      },
    },
  },
};
</script>
