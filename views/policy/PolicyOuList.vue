<template>
  <v-row>
    <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
    <v-col cols="12" md="12">
      <v-card>
        <v-card-title>
          <span>Set Policy Organization Unit</span>

          <v-spacer></v-spacer>
          <v-btn color="secondary" text small fab @click="closePolicyOu()">
            <v-icon dark>
              {{ icons.mdiClose }}
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="6" sm="12">
              <v-card outlined>
                <v-card-title class="d-flex justify-content-between">
                  <v-spacer></v-spacer>
                  <v-btn color="primary" dark small @click="selectAll()">
                    <v-icon dark left>
                      {{ icons.mdiCheckAll }}
                    </v-icon>
                    Select All
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="mainDataNotMapping"
                    disable-pagination
                    hide-default-footer
                    dense
                  >
                    <!-- action -->
                    <template #[`item.actions`]="{ item }">
                      <v-tooltip bottom color="warning">
                        <template #activator="{ on, attrs }">
                          <div class="d-flex demo-space-x flex-wrap">
                            <v-checkbox
                              :value="item.id"
                              hide-details
                              @click="selectRow(item.id, 'yes')"
                            ></v-checkbox>
                          </div>
                        </template>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col md="6" sm="12">
              <v-card outlined>
                <v-card-title class="d-flex justify-content-between">
                  <v-spacer></v-spacer>
                  <v-btn color="error" dark small @click="deselectAll()">
                    <v-icon dark left>
                      {{ icons.mdiTrashCan }}
                    </v-icon>
                    Remove All
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="mainDataMapping"
                    disable-pagination
                    hide-default-footer
                    dense
                  >
                    <!-- action -->
                    <template #[`item.actions`]="{ item }">
                      <v-tooltip bottom color="warning">
                        <template #activator="{ on, attrs }">
                          <div class="d-flex demo-space-x flex-wrap">
                            <v-checkbox
                              :value="item.id"
                              hide-details
                              @click="selectRow(item.id, 'not')"
                            ></v-checkbox>
                          </div>
                        </template>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import axios from "@axios";
import themeConfig from "@themeConfig";
import { mdiArrowLeft, mdiClose, mdiCheckAll, mdiTrashCan } from "@mdi/js";

export default {
  name: "Child",
  components: { AppCardLoader },
  data() {
    return {
      idPolicy: "",
      formPolicyOu: false,
      mainDataMapping: [],
      mainDataNotMapping: [],
      icons: {
        mdiClose,
        mdiCheckAll,
        mdiTrashCan,
      },
      isDialogVisible: false,
      headers: [
        {
          text: "",
          value: "actions",
          width: "100px",
        },
        {
          text: "Code",
          value: "ouCode",
          width: "300px",
        },
        {
          text: "Name",
          value: "ouName",
          width: "300px",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("formPolicyOuForm", (id) => {
      this.idPolicy = id;
      this.listOuMapping(id);
      this.listOuNotMapping(id);
    });
  },
  methods: {
    closePolicyOu() {
      this.$root.$emit("formPolicyOu", this.formPolicyOu);
    },
    selectRow(idOu, select) {
      if (select === "yes") {
        this.addPolicyOu(idOu, this.idPolicy);
      } else {
        this.removePolicyOu(idOu, this.idPolicy);
      }
    },
    delay(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    async selectAll() {
      this.isDialogVisible = true;
      await this.mainDataNotMapping.forEach((item) => {
        this.addPolicyOu(item.id, this.idPolicy);
      });
      await this.delay(1000);
      this.isDialogVisible = false;
    },
    async deselectAll() {
      this.isDialogVisible = true;
      await this.mainDataMapping.forEach((item) => {
        this.removePolicyOu(item.id, this.idPolicy);
      });
      await this.delay(1000);
      this.isDialogVisible = false;
    },
    addPolicyOu(idOu, id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/policy-ou/add`,
          {
            policyId: parseInt(id),
            ouId: parseInt(idOu),
          },
          config
        )
        .then((response) => {
          this.listOuMapping(id);
          this.listOuNotMapping(id);
        })
        .catch((e) => {
          this.notif({
            group: "foo",
            type: "error",
            duration: 1000,
            title: e,
          });
        });
    },
    removePolicyOu(idOu, id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/policy-ou/remove/${idOu}`, config)
        .then((response) => {
          this.listOuMapping(id);
          this.listOuNotMapping(id);
        })
        .catch((e) => {
          this.notif({
            group: "foo",
            type: "error",
            duration: 1000,
            title: e,
          });
        });
    },
    listOuMapping(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/policy-ou/list/${id}`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.mainDataMapping = response.data.result);
          this.mainDataMapping = [];
        })
        .catch((e) => {
          this.notif({
            group: "foo",
            type: "error",
            duration: 1000,
            title: e,
          });
        });
    },
    listOuNotMapping(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/policy-ou/list/unassigned/${id}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.mainDataNotMapping = response.data.result);
          this.mainDataNotMapping = [];
        })
        .catch((e) => {
          this.notif({
            group: "foo",
            type: "error",
            duration: 1000,
            title: e,
          });
        });
    },
  },
};
</script>
