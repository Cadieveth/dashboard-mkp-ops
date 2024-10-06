<template>
  <div>
    <v-dialog v-model="openModal" persistent width="1200">
      <v-card>
        <v-card-title class="headline px-8 font-weight-bold">
          Input Additional Cost
          <v-spacer></v-spacer>
          <v-btn color="primary" dark small @click="addDataCost()">
            <v-icon dark left>
              {{ icons.mdiCheckboxMarkedCircleOutline }}
            </v-icon>
            Add Cost
          </v-btn>
          <v-btn color="secondary" icon small @click="closeModal()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="py-0">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="keyword"
              :append-icon="icons.mdiMagnify"
              label="Search"
              placeholder="Search Additional Cost"
              single-line
              hide-details
              dense
              @input="addCost()"
            >
            </v-text-field>
          </v-col>
        </v-card-text>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12" class="p-0">
                <v-data-table
                  :headers="headersGl"
                  :items="mainDataGl"
                  :footer-props="{
                    'items-per-page-options': [25, 50, 100],
                  }"
                  fixed-header
                  dense
                  v-model="selected"
                  item-key="id"
                  show-select
                >
                  <template #[`item.costAmount`]="{ item }">
                    <vuetify-money
                      dense
                      outlined
                      v-model="item.costAmount"
                      v-bind:readonly="false"
                      v-bind:disabled="disabled"
                      v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                      v-bind:options="options"
                      v-bind:properties="properties"
                      hide-details
                    />
                    <!--                    <v-text-field-->
                    <!--                        dense-->
                    <!--                        outlined-->
                    <!--                        hide-details-->
                    <!--                        v-model="item.amount"-->
                    <!--                    ></v-text-field>-->
                  </template>
                  <template #[`item.remark`]="{ item }">
                    <v-text-field
                      dense
                      outlined
                      hide-details
                      v-model="item.remark"
                    ></v-text-field>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark small @click="addDataCost()">
            <v-icon dark left>
              {{ icons.mdiCheckboxMarkedCircleOutline }}
            </v-icon>
            Add Cost
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiClose, mdiMagnify, mdiCheckboxMarkedCircleOutline } from "@mdi/js";
import themeConfig from "@themeConfig";
import axios from "axios";

export default {
  name: "ChildComponentAdditionalCost",
  props: {
    valueBank: { type: String, default: "" },
    openModal: { type: Boolean, default: true },
    // selected: { type: Array, default: [] },
  },
  data() {
    return {
      readonly: true,
      disabled: false,
      outlined: true,
      clearable: true,
      valueWhenIsEmpty: "",
      keyword: "",
      options: {
        locale: "pt-BR",
        prefix: "",
        suffix: "",
        length: 20,
        precision: 2,
      },
      properties: {
        hint: "my hint",
      },
      mainDataGl: [],
      selected: [],
      searchAddCost: "",
      icons: {
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
        mdiMagnify,
      },
      headersGl: [
        {
          text: "Activity G/L Code",
          value: "activityGlCode",
          width: "150px",
        },
        {
          text: "Activity G/L Name",
          value: "activityGlName",
          width: "350px",
        },
        {
          text: "Amount",
          value: "costAmount",
          width: "150px",
          align: "right",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
      ],
      headersGlNoAction: [
        {
          text: "Activity G/L Code",
          value: "activityGlCode",
          width: "150px",
        },
        {
          text: "Activity G/L Name",
          value: "activityGlName",
          width: "350px",
        },
        {
          text: "Amount",
          value: "costAmount",
          width: "150px",
          align: "right",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
      ],
    };
  },
  mounted() {
    this.addCost();
    this.selected = [];
    this.$root.$on("resetAppModalAdditionalCost", () => {
      this.addCost();
      this.selected = [];
    });
    this.$root.$on("deleteSelectedAdditionalCost", (msg) => {
      const index = this.selected.findIndex((obj) => obj.id === msg);

      if (index !== -1) {
        this.selected.splice(index, 1);
      }
    });
  },
  methods: {
    async closeModal() {
      await this.$root.$emit("appModalAdditionalCost", false);
    },
    async addDataCost() {
      var data = [];
      var totalCostAmount = 0;

      this.selected.forEach((item) => {
        var valueToPush = {};
        valueToPush["id"] = item.id;
        valueToPush["activityGlCode"] = item.activityGlCode;
        valueToPush["activityGlName"] = item.activityGlName;
        valueToPush["ouRcId"] = -99;
        valueToPush["segmentId"] = -99;
        valueToPush["costAmount"] =
          item.costAmount == undefined ? 0 : parseFloat(item.costAmount);
        valueToPush["remark"] = item.remark;
        data.push(valueToPush);
        totalCostAmount +=
          item.costAmount == undefined ? 0 : parseFloat(item.costAmount);
      });
      this.$root.$emit("additionalCostData", data);
      this.closeModal();
    },
    addCost() {
      this.formGL = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .get(
          `${themeConfig.app.api_master}/activity-gl/list?keyword=${this.keyword}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainDataGl = response.data.result;
            response.data.result.forEach((element, index) => {
              this.mainDataGl[index].remark = "";
            });
          } else {
            this.mainDataGl = [];
          }
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
  },
};
</script>
