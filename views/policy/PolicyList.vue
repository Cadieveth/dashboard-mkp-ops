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
            <span>Group Access User</span>
            <v-spacer></v-spacer>
            <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
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
                  Group Access User Input
                  <v-spacer></v-spacer>
                  <v-btn color="secobadry" icon small @click="closeForm()">
                    <v-icon>
                      {{ icons.mdiClose }}
                    </v-icon>
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
                          v-model="form.policyCode"
                          label="Code"
                          :rules="[validators.required]"
                          placeholder="Insert Policy Code"
                          dense
                          hide-details="auto"
                          class="mb-0"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-text-field
                          v-model="form.policyName"
                          label="Name"
                          :rules="[validators.required]"
                          placeholder="Insert Policy Name"
                          dense
                          hide-details="auto"
                          class="mb-0"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark small type="submit">
                      <v-icon dark left>{{
                        icons.mdiCheckboxMarkedCircleOutline
                      }}</v-icon>
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
              :items-per-page="itemPerPage"
              :footer-props="{
                'items-per-page-options': [25, 50, 100],
              }"
              disable-pagination
              fixed-header
              dense
            >
              <!-- action -->
              <template #[`item.actions`]="{ item }">
                <v-tooltip bottom color="warning">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="warning"
                      v-bind="attrs"
                      @click="editForm(item)"
                      v-on="on"
                      v-show="showEdit"
                    >
                      <v-icon>
                        {{ icons.mdiClipboardEditOutline }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Edit</span>
                </v-tooltip>

                <v-tooltip bottom color="info">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                      @click="settingPolicyOu(item.id)"
                      v-show="showSetPolicyOu"
                    >
                      <v-icon>
                        {{ icons.mdiTextBoxCheck }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Set Policy Ou</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import axios from "@axios";
import themeConfig from "@themeConfig";
import Form from "vform";
import { required } from "@core/utils/validation";
import {
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiPlus,
  mdiTextBoxCheck,
} from "@mdi/js";
import { isInArray } from "../../../constan";

export default {
  name: "Child",
  components: { AppCardLoader },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      itemPerPage: 25,
      mainData: [],
      formPolicyOu: true,
      formData: false,
      formEdit: false,
      isDialogVisible: false,
      showAdd:
        isInArray("addPolicy", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray("editPolicy", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showSetPolicyOu:
        isInArray(
          "viewMappingPolicyOu",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      validators: {
        required,
      },
      icons: {
        mdiClipboardEditOutline,
        mdiTextBoxCheck,
        mdiPlus,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
      },
      filterForm: new Form({
        keyword: "",
      }),
      form: new Form({
        id: "",
        policyCode: "",
        policyName: "",
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
          text: "Code",
          value: "policyCode",
          width: "300px",
        },
        {
          text: "Name",
          value: "policyName",
          width: "200px",
        },
      ],
    };
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
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
    settingPolicyOu(id) {
      this.$root.$emit("formPolicyOu", this.formPolicyOu);
      this.$root.$emit("formPolicyOuForm", id);
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
            `${themeConfig.app.api_master}/policy/add`,
            {
              policyCode: this.form.policyCode,
              policyName: this.form.policyName,
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
            if (e.response.status === 401) {
              localStorage.clear();
              sessionStorage.clear();
              router.push({ name: "auth-login" });
            }
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
            `${themeConfig.app.api_master}/policy/edit`,
            {
              id: this.form.id,
              policyCode: this.form.policyCode,
              policyName: this.form.policyName,
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
            if (e.response.status === 401) {
              localStorage.clear();
              sessionStorage.clear();
              router.push({ name: "auth-login" });
            }
          });
      }
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
          `${themeConfig.app.api_master}/policy/list`,
          {
            keyword: this.filterForm.keyword,
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
