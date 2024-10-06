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
      <v-col id="target-table" cols="12">
        <v-card>
          <v-card-title class="align-start">
            <span>User</span>
            <v-spacer></v-spacer>
            <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
            <v-dialog v-model="formData" persistent width="700">
              <template #activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="addForm()"
                  v-show="showAdd"
                  class="mt-1"
                >
                  <v-icon dark left>{{ icons.mdiPlus }}</v-icon>
                  Add Data
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="px-8 font-weight-bold">
                  <span>
                    {{ formEdit ? "Update User" : "Add User" }}
                  </span>

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
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="12">
                          <v-text-field
                            v-model="form.fullName"
                            label="Name"
                            :rules="[validators.required]"
                            dense
                            persistent-placeholder
                            :placeholder="phName"
                            hide-details="auto"
                            class="mb-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="form.username"
                            :readonly="formEdit"
                            label="Username"
                            :rules="[validators.required]"
                            persistent-placeholder
                            :placeholder="phUsername"
                            dense
                            hide-details="auto"
                            class="mb-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="form.email"
                            label="Email"
                            :rules="[
                              validators.required,
                              validators.emailValidator,
                            ]"
                            persistent-placeholder
                            :placeholder="phEmail"
                            dense
                            hide-details="auto"
                            class="mb-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" v-show="!formEdit">
                          <v-text-field
                            v-model="form.password"
                            label="Password"
                            :rules="formEdit ? [] : [validators.required]"
                            dense
                            :type="isPasswordVisible ? 'text' : 'password'"
                            placeholder="Password"
                            :append-icon="
                              isPasswordVisible
                                ? icons.mdiEyeOffOutline
                                : icons.mdiEyeOutline
                            "
                            persistent-placeholder
                            hide-details="auto"
                            class="mb-0"
                            @click:append="
                              isPasswordVisible = !isPasswordVisible
                            "
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" v-show="!formEdit">
                          <v-text-field
                            v-model="form.confirmPassword"
                            label="Confirm Password"
                            :rules="
                              formEdit
                                ? []
                                : [
                                    validators.required,
                                    validators.confirmedValidator(
                                      form.confirmPassword,
                                      form.password
                                    ),
                                  ]
                            "
                            dense
                            :type="isPasswordVisible ? 'text' : 'password'"
                            placeholder="Password"
                            persistent-placeholder
                            :append-icon="
                              isPasswordVisible
                                ? icons.mdiEyeOffOutline
                                : icons.mdiEyeOutline
                            "
                            hide-details="auto"
                            class="mb-0"
                            @click:append="
                              isPasswordVisible = !isPasswordVisible
                            "
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-autocomplete
                            v-model="form.roleId"
                            :items="roleList"
                            dense
                            :rules="[(v) => !!v || 'This field is required']"
                            item-text="roleName"
                            persistent-placeholder
                            :placeholder="phRoleName"
                            item-value="id"
                            label="Role"
                            hide-details="auto"
                            class="mb-0"
                            clearable
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-autocomplete
                            v-model="form.ouDefaultId"
                            :items="partnerList"
                            dense
                            item-text="ouName"
                            persistent-placeholder
                            :placeholder="phOuDefault"
                            item-value="id"
                            label="Default Business Unit"
                            hide-details="auto"
                            clearable
                            class="mb-0"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-autocomplete
                            v-model="form.policyDefaultId"
                            :items="policyList"
                            dense
                            :rules="[(v) => !!v || 'This field is required']"
                            item-text="policyName"
                            item-value="id"
                            persistent-placeholder
                            :placeholder="phPolicyName"
                            label="Default Policy"
                            hide-details="auto"
                            clearable
                            class="mb-0"
                          ></v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-container>
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
            <v-row>
              <v-col md="1" sd="2">
                <v-select
                  v-model="itemPerPage"
                  :items="itemRow"
                  label="Rows"
                  class="select"
                  hide-details
                  :menu-props="{ maxWidth: '250' }"
                  @change="getItemPerPage"
                ></v-select>
              </v-col>
              <v-col cols="12" offset-md="7" md="4">
                <v-text-field
                  v-model="search"
                  :append-icon="icons.mdiMagnify"
                  label="Search.."
                  single-line
                  hide-details
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="mainData"
              :items-per-page="itemPerPage"
              :search="search"
              hide-default-footer
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
                          v-show="showEdit || showDelete || showActive"
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
                      v-show="showDelete"
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
                      @click="confirmDialogActive(item.id, item.active)"
                      v-show="showActive"
                    >
                      <v-list-item-icon class="me-2 mt-1">
                        <v-icon size="18" color="info">
                          {{
                            item.active == "Y"
                              ? icons.mdiLock
                              : icons.mdiLockOpenVariantOutline
                          }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="pt-0">
                        <v-list-item-title class="info--text">{{
                          item.active == "Y" ? "Inactivate" : "Activate"
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="handlePageChange"
              total-visible="5"
              v-scroll-to="'#target-table'"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  confirmedValidator,
  emailValidator,
  passwordValidator,
  required,
} from "@core/utils/validation";
import Form from "vform";
import themeConfig from "@themeConfig";
import { isInArray } from "../../../constan";
import {
  mdiAccountCashOutline,
  mdiClipboardEditOutline,
  mdiDelete,
  mdiTextBoxCheck,
  mdiEyeOutline,
  mdiEyeOffOutline,
  mdiLock,
  mdiLockOpenVariantOutline,
  mdiMagnify,
  mdiPlus,
  mdiClose,
  mdiCheckboxMarkedCircleOutline,
  mdiFormatListBulleted,
} from "@mdi/js";
import router from "@/router";
import axios from "@axios";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";

Vue.use(VueScrollTo);

export default {
  name: "Child",
  components: {
    AppCardLoader,
  },
  data() {
    return {
      ouTbl: themeConfig.labeling.ouTbl,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      phName: themeConfig.placeholder.name,
      phEmail: themeConfig.placeholder.email,
      phOuDefault: themeConfig.placeholder.ouDefault,
      phPolicyName: themeConfig.placeholder.policyName,
      phRoleName: themeConfig.placeholder.roleName,
      phUsername: themeConfig.placeholder.username,

      isDialogVisible: false,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      formData: false,
      formEdit: false,
      isPasswordVisible: false,
      showAdd:
        isInArray("addUser", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray("editUser", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray("removeUser", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showActive:
        isInArray("editActiveUser", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      validators: {
        required,
        emailValidator,
        passwordValidator,
        confirmedValidator,
      },
      icons: {
        mdiClipboardEditOutline,
        mdiAccountCashOutline,
        mdiDelete,
        mdiTextBoxCheck,
        mdiEyeOutline,
        mdiEyeOffOutline,
        mdiLock,
        mdiLockOpenVariantOutline,
        mdiMagnify,
        mdiPlus,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
        mdiFormatListBulleted,
      },
      roleList: [],
      partnerList: [],
      policyList: [],
      mainData: [],
      search: "",
      filterForm: new Form({
        keyword: "",
        active: "",
      }),
      form: new Form({
        id: "",
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        roleId: "",
        ouDefaultId: "",
        policyDefaultId: "",
      }),
      headers: [
        {
          text: "Actions",
          align: "center",
          value: "actions",
          sortable: false,
          width: "125px",
        },
        {
          text: "Name",
          value: "fullName",
          width: "300px",
        },
        {
          text: "Username",
          value: "username",
          width: "200px",
        },
        {
          text: "E-mail",
          value: "email",
        },
        {
          text: "Role",
          value: "roleName",
          width: "200px",
        },
        {
          text: "Default Business Unit",
          value: "ouName",
          width: "200px",
        },
      ],
    };
  },
  mounted() {
    this.getRoleList();
    this.getPartnerList();
    this.getPolicyList();
    this.refreshData();
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    getItemPerPage(val) {
      this.itemPerPage = val;
      this.ofset = 0;
      this.currentPage = 1;
      this.refreshData();
    },
    handlePageChange(value) {
      this.currentPage = value;
      if (this.currentPage == 1) {
        this.ofset = 0;
      } else {
        this.ofset = (this.currentPage - 1) * this.itemPerPage;
      }
      this.refreshData();
    },
    getCountData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/users/count-list`,
          {
            keyword: this.filterForm.keyword,
            active: this.filterForm.active,
          },
          config
        )
        .then((response) => {
          if (
            response.data.result !== null &&
            response.data.result > this.itemPerPage
          ) {
            this.totalPages = Math.ceil(
              response.data.result / this.itemPerPage
            );
          } else {
            this.totalPages = 1;
          }
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.message);
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
          this.removeData(id);
          setTimeout(() => {
            dialog.close();
          }, 1500);
        })
        .catch(() => {
          this.refreshData();
        });
    },
    confirmDialogActive(id, status) {
      if (status == "Y") {
        var text = "Are you sure you want to inactivate this item?.";
      } else {
        var text = "Are you sure you want to activate this item?.";
      }
      this.$dialog
        .confirm(text, {
          loader: true,
        })
        .then((dialog) => {
          this.activeData(id, status);
          setTimeout(() => {
            dialog.close();
          }, 1500);
        })
        .catch(() => {
          this.refreshData();
        });
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
          this.notif("error", "Failed", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getPartnerList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/ou/list`,
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
            return (this.partnerList = response.data.result);
          this.partnerList = [];
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getPolicyList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/policy/list`,
          {
            keyword: this.filterForm.keyword,
            limit: 1000,
            offset: 0,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.policyList = response.data.result);
          this.policyList = [];
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
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
            `${themeConfig.app.api_master}/users/add`,
            {
              fullName: this.form.fullName,
              username: this.form.username,
              email: this.form.email,
              password: this.form.password,
              roleId: parseInt(this.form.roleId),
              ouDefaultId:
                this.form.ouDefaultId == ""
                  ? -99
                  : parseInt(this.form.ouDefaultId),
              policyDefaultId: parseInt(this.form.policyDefaultId),
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
            this.snackbar = true;
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
            `${themeConfig.app.api_master}/users/edit`,
            {
              id: this.form.id,
              fullName: this.form.fullName,
              email: this.form.email,
              roleId: parseInt(this.form.roleId),
              ouDefaultId:
                this.form.ouDefaultId == ""
                  ? -99
                  : parseInt(this.form.ouDefaultId),
              policyDefaultId: parseInt(this.form.policyDefaultId),
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
        .get(`${themeConfig.app.api_master}/users/remove/${id}`, config)
        .then((response) => {
          this.refreshData();
          this.notif("success", "Success", response.data.meta.message);
          this.isDialogVisible = false;
        })
        .catch((e) => {
          this.notif("error", "Failed", e);
        });
    },
    activeData(id, status) {
      this.isDialogVisible = true;
      if (status == "Y") {
        var text = "Data berhasil Non Active!.";
      } else {
        var text = "Data berhasil Active!.";
      }
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/users/edit-active/${id}`, config)
        .then((response) => {
          this.refreshData();
          this.notif("success", "Success", text);
          this.isDialogVisible = false;
        })
        .catch((e) => {
          this.notif("error", "Failed", e);
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
          `${themeConfig.app.api_master}/users/list`,
          {
            keyword: this.filterForm.keyword,
            active: this.filterForm.active,
            limit: this.itemPerPage,
            offset: this.ofset,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getCountData();
          if (response.data.result !== null)
            return (this.mainData = response.data.result);
          this.mainData = [];
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Failed", e.response.data.message);
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
