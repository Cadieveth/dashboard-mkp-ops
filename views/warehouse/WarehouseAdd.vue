<template>
  <div>
    <v-snackbar v-model="snackbar.show" outlined text color="error">
      {{ snackbar.message }}
    </v-snackbar>
    <v-row>
      <v-col cols="12">
        <span class="form-header">
          <h4>Add Warehouse</h4>
        </span>
        <v-card class="card-style">
          <v-card-actions class="headline">
            <v-spacer></v-spacer>
            <app-button
              color="secondary"
              text="Exit"
              icon-button="mdi-exit-to-app"
              :click="goToWarehousePage" />
            <app-button
              color="primary"
              text="Save"
              icon-button="mdi-checkbox-marked-circle-outline"
              :click="addWarehouse" />
          </v-card-actions>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  v-model="warehouseData.warehouseCode"
                  label="Warehouse Code"
                  persistent-placeholder
                  :placeholder="'Insert Warehouse Code'"
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
                  v-model="warehouseData.warehouseName"
                  label="Warehouse Name"
                  persistent-placeholder
                  :placeholder="'Insert Warehouse Name'"
                  dense
                  class="mb-0"
                  hide-details="auto"
                  clearable
                  :rules="[
                    (v) => !!v || 'This field is required',
                  ]"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-warehouse-type
                  :clearable="true"
                  :form-value.sync="warehouseData.warehouseType"
                  :read-only="false"
                  :on-clear="handleClearOu"></app-autocomplite-warehouse-type>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-ou-company
                  :clearable="true"
                  :form-value.sync="warehouseData.ouId"
                  :read-only="false"
                  :on-clear="handleClearOu"></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-text-field
                  v-model="warehouseData.country"
                  label="Country"
                  persistent-placeholder
                  :placeholder="'Insert Country'"
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
                  v-model="warehouseData.province"
                  label="Province"
                  persistent-placeholder
                  :placeholder="'Insert Province'"
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
                  v-model="warehouseData.city"
                  label="City"
                  persistent-placeholder
                  :placeholder="'Insert City'"
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
                  v-model="warehouseData.zipCode"
                  label="Zip Code"
                  persistent-placeholder
                  :placeholder="'Insert Zip Code'"
                  dense
                  class="mb-0"
                  hide-details="auto"
                  clearable
                  :rules="[
                    (v) => !!v || 'This field is required',
                  ]"></v-text-field>
              </v-col>
              <v-col cols="12" md="12" class="pb-0 mt-2">
                <v-textarea
                  v-model="warehouseData.address"
                  label="Address"
                  rows="3"
                  hide-details="auto"
                  dense
                  class="mb-0"
                  outlined
                  :rules="[
                    (v) => !!v || 'This field is required',
                  ]"></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { required } from "@core/utils/validation";
import AppButton from "@/@core/components/app-button/AppButton.vue";
import themeConfig from "@themeConfig";
import AppAutocompliteWarehouseType from "@/@core/components/app-autocomplite-warehouse/AppAutocompliteWarehouseType.vue";
import AppAutocompliteOuCompany from "@/@core/components/app-autocomplite-for-filter/AppAutocompliteOuCompany.vue";
import { get, post } from "@/services/apiServices";

export default {
  components: {
    AppButton,
    AppAutocompliteWarehouseType,
    AppAutocompliteOuCompany,
  },
  data() {
    return {
      label: themeConfig.labeling,
      placeholder: themeConfig.placeholder,
      warehouseData: {
        warehouseCode: "",
        warehouseName: "",
        ouId: null,
        country: "",
        province: "",
        city: "",
        address: "",
        zipCode: "",
        warehouseType: "",
      },
      snackbar: {
        show: false,
        message: "",
      },
    };
  },
  methods: {
    async addWarehouse() {
      this.$loading(true);

      const url = `${themeConfig.app.api_master}/warehouse/add`;

      try {
        const response = await post(url, this.warehouseData);
        if (response.data.meta.success) {
          this.$notify("success", response.data.meta.message);
          this.$router.push({ name: "warehouse" });
        } else {
          this.$notify("warning", "Something less common occurs");
        }
      } catch (error) {
        this.$notify("error", error.response.data.meta.message);
        console.error("Invalid API Add response:", response.data);
        console.error("Error while adding warehouse:", error);
      }
      this.$loading(false);
    },
    goToWarehousePage() {
      this.$router.push({ name: "warehouse" });
    },
    handleClearOu() {
      this.formFilter.ouId = -99;
      this.formFilter.warehouseType = "";
    },
  },
  validations: {
    warehouseData: {
      warehouseCode: {
        required,
      },
      warehouseName: {
        required,
      },
      ouId: {
        required,
      },
      country: {
        required,
      },
      province: {
        required,
      },
      city: {
        required,
      },
      address: {
        required,
      },
      zipCode: {
        required,
      },
      warehouseType: {
        required,
      },
    },
  },
};
</script>
