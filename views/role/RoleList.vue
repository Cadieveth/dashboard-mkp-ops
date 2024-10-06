<template>
  <div>
    <v-snackbar
      top
      v-model="snackbar"
      :timeout="timeout"
      :color="color"
      outlined
      text
    >
      {{ text }}
    </v-snackbar>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="align-start">
            <span>Role</span>
            <v-spacer></v-spacer>
            <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field
                  v-model="filterForm.keyword"
                  placeholder="Insert Keyword"
                  label="Keyword"
                  dense
                  hide-details="auto"
                  class="mb-0"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-autocomplete
                  v-model="filterForm.type"
                  :items="typeListFilter"
                  dense
                  item-text="text"
                  placeholder="Select Role Type"
                  item-value="value"
                  label="Type"
                  hide-details="auto"
                  class="mb-0"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="12" class="pb-0 mt-2">
                <v-btn small dark color="primary" @click="refreshData()">
                  <v-icon dark left>
                    {{ icons.mdiMagnify }}
                  </v-icon>
                  Filter
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-title class="align-start mt-n2">
            <v-spacer></v-spacer>
            <v-dialog v-model="formData" persistent width="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="addForm()"
                  v-show="showAdd"
                >
                  <v-icon dark left>
                    {{ icons.mdiPlus }}
                  </v-icon>
                  Add Data
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="font-weight-bold">
                  {{ formEdit ? "Update Role" : "Add Role" }}
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" icon small @click="closeForm()">
                    <v-icon>{{ icons.mdiClose }}</v-icon>
                  </v-btn>
                </v-card-title>
                <v-form
                  ref="form"
                  @submit.prevent="formEdit ? editData() : addData()"
                >
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-text-field
                          v-model="form.roleName"
                          label="Role Name"
                          placeholder="Insert Role Name"
                          :rules="[validators.required]"
                          dense
                          hide-details="auto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-autocomplete
                          v-model="form.type"
                          placeholder="Select Role Type"
                          :items="typeList"
                          :rules="[validators.required]"
                          hide-details="auto"
                          dense
                          label="Type"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark small type="submit">
                      <v-icon dark left>
                        {{ icons.mdiCheckboxMarkedCircleOutline }}
                      </v-icon>
                      {{ formEdit ? "Update" : "Save" }}
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="mainData"
              :items-per-page="25"
              :footer-props="{
                'items-per-page-options': [25, 50, 100],
              }"
              fixed-header
              dense
            >
              <!-- action -->
              <template #[`item.actions`]="{ item }">
                <v-menu offset-y right nudge-bottom="0" min-width="130">
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip bottom>
                      <template #activator="{ on: tooltip }">
                        <v-icon
                          color="secondary"
                          size="18"
                          v-bind="attrs"
                          v-on="{ ...tooltip, ...menu }"
                          v-show="showEdit || showDelete || showSetRoleTask"
                        >
                          {{ icons.mdiFormatListBulleted }}
                        </v-icon>
                      </template>
                      <span>More Info</span>
                    </v-tooltip>
                  </template>
                  <v-list dense>
                    <v-list-item @click="editForm(item)" v-show="showEdit">
                      <v-list-item-icon class="me-2 mt-1">
                        <v-icon size="18" color="warning">
                          {{ icons.mdiClipboardEditOutline }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="pt-0">
                        <v-list-item-title class="warning--text"
                          >Edit</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      @click="confirmDialog(item.id)"
                      v-show="showEdit"
                    >
                      <v-list-item-icon class="me-2 mt-1">
                        <v-icon size="18" color="error">
                          {{ icons.mdiDelete }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="pt-0">
                        <v-list-item-title class="error--text"
                          >Delete</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      @click="settingRoleTask(item.id)"
                      v-show="showSetRoleTask"
                    >
                      <v-list-item-icon class="me-2 mt-1">
                        <v-icon size="18" color="info">
                          {{ icons.mdiTextBoxCheck }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="pt-0">
                        <v-list-item-title class="info--text"
                          >Set Role Task</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12"> </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import axios from "@axios";
import themeConfig from "@themeConfig";
import Form from "vform";
import { emailValidator, required } from "@core/utils/validation";

import {
  mdiClipboardEditOutline,
  mdiAccountCashOutline,
  mdiDelete,
  mdiTextBoxCheck,
  mdiMagnify,
  mdiPlus,
  mdiClose,
  mdiCheckboxMarkedCircleOutline,
  mdiFormatListBulleted,
} from "@mdi/js";
import { isInArray } from "../../../constan";
import router from "@/router";

export default {
  name: "Child",
  components: { AppCardLoader },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      isDialogVisible: false,
      formRoleList: true,
      formData: false,
      formEdit: false,
      showAdd:
        isInArray("addRole", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray("editRole", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray("removeRole", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showSetRoleTask:
        isInArray("viewRoleTask", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      typeList: ["ADMIN", "USER"],
      typeListFilter: [
        {
          text: "ALL TYPE ROLE",
          value: "",
        },
        {
          text: "ADMIN",
          value: "ADMIN",
        },
        {
          text: "USER",
          value: "USER",
        },
      ],
      validators: {
        required,
      },
      icons: {
        mdiClipboardEditOutline,
        mdiAccountCashOutline,
        mdiDelete,
        mdiTextBoxCheck,
        mdiMagnify,
        mdiPlus,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
        mdiFormatListBulleted,
      },
      mainData: [],
      filterForm: new Form({
        keyword: "",
        type: "",
      }),
      form: new Form({
        id: "",
        roleName: "",
        type: "",
      }),
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "125px",
        },
        {
          text: "Role",
          value: "roleName",
          width: "300px",
        },
        {
          text: "Type",
          value: "type",
        },
      ],
    };
  },
  mounted() {
    this.refreshData();
    this.$root.$on("getListRole", () => {
      this.refreshData();
    });
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    confirmDialog(id) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.removeData(id);
          setTimeout(() => {
            dialog.close();
          }, 1500);
        })
        .catch(() => {
          this.refreshData();
        });
    },
    settingRoleTask(id) {
      this.$root.$emit("formRoleTask", this.formRoleList);
      this.$root.$emit("formRoleTaskForm", id);
    },
    addForm() {
      this.formEdit = false;
      this.form.reset();
      this.form.clear();
      this.formData = true;
    },
    editForm(data) {
      this.formEdit = true;
      this.form.fill(data);
      this.form.clear();
      this.formData = true;
    },
    closeForm() {
      this.formData = false;
      this.form.reset();
      this.form.clear();
      this.$refs.form.resetValidation();
    },
    addData() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.isDialogVisible = true;
        const config = {
          headers: {
            Authorization: `Bearer ${this.$session.get("accessToken")}`,
            "Access-Control-Allow-Origin": "*",
          },
        };
        axios
          .post(
            `${themeConfig.app.api_master}/role/add`,
            {
              roleName: this.form.roleName,
              type: this.form.type,
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.refreshData();
            this.closeForm();
            this.notif("success", "Success", response.data.meta.message);
          })
          .catch((e) => {
            this.isDialogVisible = false;
            this.notif("error", "Failed", e.response.data.meta.message);
          });
      }
    },
    editData() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.isDialogVisible = true;
        const config = {
          headers: {
            Authorization: `Bearer ${this.$session.get("accessToken")}`,
            "Access-Control-Allow-Origin": "*",
          },
        };
        axios
          .post(
            `${themeConfig.app.api_master}/role/edit`,
            {
              id: this.form.id,
              roleName: this.form.roleName,
              type: this.form.type,
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.refreshData();
            this.closeForm();
            this.notif("success", "Success", response.data.meta.message);
          })
          .catch((e) => {
            this.isDialogVisible = false;
            this.notif("error", "Failed", e.response.data.meta.message);
          });
      }
    },
    removeData(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/role/remove/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.refreshData();
          this.notif("success", "Success", response.data.meta.message);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    refreshData() {
      this.isDialogVisible = true;
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
            keyword: this.filterForm.keyword,
            type: this.filterForm.type,
            limit: 1000,
            offset: 0,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null)
            return (this.mainData = response.data.result);
          this.mainData = [];
        })
        .catch((e) => {
          this.isDialogVisible = false;
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
