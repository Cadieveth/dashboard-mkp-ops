<template>
  <v-dialog persistent v-model="dialogAdd" width="1000">
    <v-card>
      <v-card-title>
        <v-row align="center">
          <v-col cols="auto">
            <h4>Add Unit of Measurement</h4>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-icon @click="closeDialog"> mdi-close </v-icon>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" class="pb-0 mt-2">
            <v-text-field
              v-model="uomData.uomName"
              label="Measurement Name"
              persistent-placeholder
              :placeholder="'Insert Measurement Name'"
              dense
              class="mb-0"
              hide-details="auto"
              clearable></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="pb-0 mt-2">
            <v-text-field
              v-model="uomData.uomCode"
              label="Measurement Code"
              persistent-placeholder
              :placeholder="'Insert Unit Code'"
              dense
              class="mb-0"
              hide-details="auto"
              clearable>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="pb-0 mt-2"></v-col>
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
            :click="addUom" />
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

export default {
  components: {
    UomList,
    AppButton,
  },
  props: {
    dialogAdd: { type: Boolean, default: false },
  },
  data() {
    return {
      label: themeConfig.labeling,
      placeholder: themeConfig.placeholder,
      uomData: {
        uomCode: "",
        uomName: "",
        uomClass: "",
      },
    };
  },
  methods: {
    async addUom() {
      this.$loading(true);

      const url = `${themeConfig.app.api_master}/uom/add`;
      const dataSend = {
        uomCode: this.uomData.uomCode ? this.uomData.uomCode : "",
        uomName: this.uomData.uomName ? this.uomData.uomName : "",
        uomClass: "QUANTITY",
      };

      try {
        const response = await post(url, dataSend);
        if (response.data.meta.success) {
          this.$notify("success", response.data.meta.message);
          this.$emit("addedUom");
          this.uomData = {};
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
    closeDialog() {
      this.$emit("closeDialog");
      this.uomData = {};
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
