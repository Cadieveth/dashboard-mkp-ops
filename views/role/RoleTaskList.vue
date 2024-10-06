<template>
  <v-row>
    <v-col cols="12" md="12">
      <v-card>
        <v-card-title>
          <span>Role</span>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text small fab @click="closeRoleTask()">
            <v-icon dark>
              {{ icons.mdiClose }}
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="6" sm="12">
              <v-card outlined>
                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="mainDataNotMapping"
                    :items-per-page="1000"
                    :footer-props="{
                      'items-per-page-options': [1000],
                    }"
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
                              @click="selectRow(item, 'yes')"
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
                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="mainDataMapping"
                    :items-per-page="1000"
                    :footer-props="{
                      'items-per-page-options': [1000],
                    }"
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
                              @click="selectRow(item, 'not')"
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
import { mdiArrowLeft, mdiClose } from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";
import { isInArray } from "../../../constan";

export default {
  name: "Child",
  data() {
    return {
      formRoleList: false,
      selected: [],
      mainDataMapping: [],
      mainDataNotMapping: [],
      idRole: "",
      icons: {
        mdiClose,
      },
      headers: [
        {
          text: "",
          value: "actions",
          width: "100px",
        },
        {
          text: "Module",
          value: "moduleName",
          width: "300px",
        },
        {
          text: "Task",
          value: "taskCode",
          width: "300px",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("formRoleTaskForm", (id) => {
      this.idRole = id;
      this.listTaskMapping(id);
      this.listTaskNotMapping(id);
    });
  },
  methods: {
    selectRow(data, select) {
      if (select === "yes") {
        this.addRoleTask(data, this.idRole);
      } else {
        this.removeRoleTask(data, this.idRole);
      }
    },
    closeRoleTask() {
      this.$root.$emit("formRoleTask", this.formRoleList);
    },
    addRoleTask(data, idRole) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/role-task/add`,
          {
            roleId: idRole,
            taskList: [
              {
                id: data.id,
                taskCode: data.taskCode,
                taskName: data.taskName,
              },
            ],
          },
          config
        )
        .then((response) => {
          this.listTaskMapping(idRole);
          this.listTaskNotMapping(idRole);
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
    removeRoleTask(data, idRole) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/role-task/remove/${data.id}`,
          config
        )
        .then((response) => {
          this.listTaskMapping(idRole);
          this.listTaskNotMapping(idRole);
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
    listTaskMapping(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/role-task/list/${id}`, config)
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
    listTaskNotMapping(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/role-task/list/unassigned/${id}`,
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
