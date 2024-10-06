<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12" md="12">
            <v-card>
              <v-card-title>
                <span>Approval Flow Setting</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model="form.scheme"
                      label="Scheme"
                      dense
                      readonly
                      hide-details="auto"
                      class="mb-0"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-textarea
                      v-model="form.aweFlowDesc"
                      label="Flow Desc"
                      dense
                      outlined
                      readonly
                      hide-details="auto"
                      class="mb-0"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-tooltip bottom color="primary">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          icon
                          @click="itemFlowForm('user')"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark>
                            {{ icons.mdiAccountCheckOutline }}
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Add Flow Item User</span>
                    </v-tooltip>
                    <v-tooltip bottom color="warning">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="warning"
                          icon
                          @click="itemFlowForm('role')"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark>
                            {{ icons.mdiBookCheckOutline }}
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Add Flow Item Role</span>
                    </v-tooltip>
                    <v-tooltip bottom color="error">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="error"
                          icon
                          @click="closeForm()"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark>
                            {{ icons.mdiCloseCircleOutline }}
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Close</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="12" v-show="itemCard">
            <v-card>
              <v-card-title>
                <span>Item Flow {{ itemFlow }}</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    md="12"
                    v-show="itemFlow == 'User' ? true : false"
                  >
                    <v-autocomplete
                      v-model="form.userId"
                      :items="userList"
                      dense
                      item-text="fullName"
                      item-value="id"
                      label="User"
                      hide-details="auto"
                      class="mb-0"
                    ></v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    md="12"
                    v-show="itemFlow == 'Role' ? true : false"
                  >
                    <v-autocomplete
                      v-model="form.roleId"
                      :items="roleList"
                      dense
                      item-text="roleName"
                      item-value="id"
                      label="Role"
                      hide-details="auto"
                      class="mb-0"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-tooltip bottom color="primary">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          icon
                          @click="(userNext = true), (roleNext = false)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark>
                            {{ icons.mdiAccountPlusOutline }}
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Add Flow Next User</span>
                    </v-tooltip>
                    <v-tooltip bottom color="warning">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="warning"
                          icon
                          @click="(roleNext = true), (userNext = false)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark>
                            {{ icons.mdiBookPlusOutline }}
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Add Flow Next Role</span>
                    </v-tooltip>
                    <v-tooltip bottom color="error">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="error"
                          icon
                          @click="(roleNext = false), (userNext = false)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon dark>
                            {{ icons.mdiCancel }}
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Finish</span>
                    </v-tooltip>
                  </v-col>
                  <!--              Next User or Role-->
                  <v-col cols="12" md="12" v-show="userNext">
                    <v-autocomplete
                      v-model="form.nextUserId"
                      :items="userList"
                      outlined
                      dense
                      item-text="fullName"
                      item-value="id"
                      label="User"
                      hide-details="auto"
                      class="mb-0"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="12" v-show="roleNext">
                    <v-autocomplete
                      v-model="form.nextRoleId"
                      :items="roleList"
                      outlined
                      dense
                      item-text="roleName"
                      item-value="id"
                      label="Role"
                      hide-details="auto"
                      class="mb-0"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" outlined small @click="itemCard = false">
                  Batal
                </v-btn>
                <v-btn color="primary" outlined small @click="addItem()">
                  Simpan
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="12" v-show="false">
        <v-card>
          <v-card-title></v-card-title>
          <v-card-text>
            <v-simple-table
              fixed-header
              hide-default-footer
              height="450px"
              dense
            >
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User/Role</th>
                  <th>Rules</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in mainData" :key="item.id">
                  <td>
                    <v-btn
                      x-small
                      icon
                      color="error"
                      @click="confirmDialog(item.id)"
                    >
                      <v-icon>
                        {{ icons.mdiDeleteOutline }}
                      </v-icon>
                    </v-btn>
                  </td>
                  <td>
                    {{
                      item.userId == -99
                        ? "Role: " + item.roleName
                        : "User: " + item.fullName
                    }}
                  </td>
                  <td>{{ item.aweFlowExp }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title> Flow Approval </v-card-title>

          <v-card-text>
            <v-timeline
              class="no-dots-shadow pb-4 pb-0 pt-0"
              align-top
              :dense="$vuetify.breakpoint.smAndDown"
              v-for="(item, i) in mainData"
              :key="i"
            >
              <!-- Timeline Item: Flight -->
              <v-timeline-item
                color="transparent"
                v-show="item.roleId !== -99 ? true : false"
              >
                <template #icon>
                  <v-avatar
                    color="primary"
                    class="v-avatar-light-bg primary--text"
                    size="40"
                  >
                    <v-icon size="24" color="primary">
                      {{ icons.mdiBookSettingsOutline }}
                    </v-icon>
                  </v-avatar>
                </template>
                <!-- Header -->
                <div class="d-flex justify-space-between">
                  <p class="mb-1 text--primary font-weight-semibold">
                    {{ item.roleName == "" ? "-" : item.roleName }}
                  </p>
                  <small>
                    <v-btn
                      x-small
                      icon
                      color="error"
                      @click="confirmDialog(item.id)"
                    >
                      <v-icon>
                        {{ icons.mdiDeleteOutline }}
                      </v-icon>
                    </v-btn>
                  </small>
                </div>

                <!-- Content -->
                <p class="mb-1">
                  <span>{{ item.aweFlowExp }}</span>
                </p>
                <span class="d-flex align-center">
                  <span class="text--primary font-weight-semibold text-sm">
                    <!--                    {{ item.createUsername }}-->
                  </span>
                </span>
              </v-timeline-item>

              <!-- Timeline Item: Interview -->
              <v-timeline-item
                color="transparent"
                v-show="item.userId !== -99 ? true : false"
              >
                <template #icon>
                  <v-avatar
                    color="success"
                    class="v-avatar-light-bg success--text"
                    size="40"
                  >
                    <v-icon size="24" color="success">
                      {{ icons.mdiAccountSettingsOutline }}
                    </v-icon>
                  </v-avatar>
                </template>

                <!-- Person -->
                <div
                  class="d-flex justify-space-between align-center flex-wrap"
                >
                  <!-- Avatar & Personal Info -->
                  <span class="d-flex align-bottom mt-2">
                    <v-avatar size="40" class="me-2">
                      <v-img src="@/assets/images/avatars/2.png"></v-img>
                    </v-avatar>
                    <div class="d-flex flex-column">
                      <p class="text--primary font-weight-semibold mb-0">
                        {{ item.fullName == "" ? "-" : item.fullName }}
                      </p>
                      <span>{{ item.aweFlowExp }}</span>
                      <span class="text--primary font-weight-semibold text-sm">
                        <!--                        {{ item.createUsername }}-->
                      </span>
                    </div>
                  </span>

                  <small>
                    <v-btn
                      x-small
                      icon
                      color="error"
                      @click="confirmDialog(item.id)"
                    >
                      <v-icon>
                        {{ icons.mdiDeleteOutline }}
                      </v-icon>
                    </v-btn>
                  </small>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import moment from "moment";
import Form from "vform";
import {
  mdiDeleteOutline,
  mdiAccountCheckOutline,
  mdiBookCheckOutline,
  mdiCloseCircleOutline,
  mdiAccountPlusOutline,
  mdiBookPlusOutline,
  mdiCancel,
  mdiAccountSettingsOutline,
  mdiBookSettingsOutline,
} from "@mdi/js";

export default {
  name: "Child",
  data() {
    return {
      itemCard: false,
      userNext: false,
      roleNext: false,
      formManageFlow: false,
      itemFlow: "",
      aweFlowId: "",
      mainData: [],
      userList: [],
      roleList: [],
      icons: {
        mdiDeleteOutline,
        mdiAccountCheckOutline,
        mdiAccountPlusOutline,
        mdiBookCheckOutline,
        mdiBookPlusOutline,
        mdiCloseCircleOutline,
        mdiCancel,
        mdiAccountSettingsOutline,
        mdiBookSettingsOutline,
      },
      form: new Form({
        scheme: "",
        aweFlowDesc: "",
        flgUserRole: "",
        userId: -99,
        roleId: -99,
        nextUserId: -99,
        nextRoleId: -99,
      }),
    };
  },
  mounted() {
    this.$root.$on("formManageFlowForm", (data) => {
      this.aweFlowId = data.id;
      this.form.fill(data);
      this.form.clear();
      this.getFlowItem(data.id);
    });
    this.getRoleList();
    this.getUserList();
  },
  methods: {
    notif(Type, Title, Text) {
      this.notif({
        group: "foo",
        type: Type,
        duration: 1000,
        title: Title,
        text: Text,
      });
    },
    closeForm() {
      this.itemCard = false;
      this.$root.$emit("formManageFlow", this.formManageFlow);
    },
    itemFlowForm(str) {
      if (str == "role") {
        this.itemCard = true;
        this.userNext = false;
        this.roleNext = false;
        this.itemFlow = "Role";
        this.form.flgUserRole = "";
        this.form.userId = -99;
        this.form.roleId = -99;
        this.form.nextUserId = -99;
        this.form.nextRoleId = -99;
      } else if (str == "user") {
        this.itemCard = true;
        this.userNext = false;
        this.roleNext = false;
        this.itemFlow = "User";
        this.form.flgUserRole = "";
        this.form.userId = -99;
        this.form.roleId = -99;
        this.form.nextUserId = -99;
        this.form.nextRoleId = -99;
      }
    },
    addItem() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_awe}/approval/flow/add-item`,
          {
            aweFlowId: this.aweFlowId,
            flgUserRole:
              this.userNext == true ? "U" : this.roleNext == true ? "R" : "",
            userId: this.form.userId,
            roleId: this.form.roleId,
            nextUserId: this.userNext == true ? this.form.nextUserId : -99,
            nextRoleId: this.roleNext == true ? this.form.nextRoleId : -99,
          },
          config
        )
        .then((response) => {
          this.itemCard = false;
          this.getFlowItem(this.aweFlowId);
          this.$notify("success", response.data.meta.message);
        })
        .catch((e) => {
          this.$notify("error", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    confirmDialog(id) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.removeFlow(id);
          setTimeout(() => {
            dialog.close();
          }, 1500);
        })
        .catch(() => {
          this.refreshData();
        });
    },
    removeFlow(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_awe}/approval/flow/remove-item/${id}`,
          config
        )
        .then((response) => {
          this.getFlowItem(this.aweFlowId);
          this.$notify("success", response.data.meta.message);
        })
        .catch((e) => {
          this.$notify("error", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getUserList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/users/list`,
          {
            keyword: "",
            active: "",
            limit: 1000,
            offset: 0,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.userList = response.data.result);
          this.userList = [];
        })
        .catch((e) => {
          this.$notify("error", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getRoleList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/role/list`,
          {
            keyword: "",
            type: "",
            limit: 1000,
            offset: 0,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.roleList = response.data.result);
          this.roleList = [];
        })
        .catch((e) => {
          this.$notify("error", e.response.data.message);
        });
    },
    getFlowItem(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_awe}/approval/awe-item/list/${id}`, config)
        .then((response) => {
          if (response.data.result !== null) {
            response.data.result.sort(
              (a, b) => parseFloat(b.id) - parseFloat(a.id)
            );
            this.mainData = response.data.result;
          } else {
            this.mainData = [];
          }
        })
        .catch((e) => {
          this.$notify("error", e.response.data.message);
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
