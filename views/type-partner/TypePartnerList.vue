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
          <v-card-title>
            <span>Type Partner</span>
            <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
          </v-card-title>
          <v-card-title class="my-n2">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              dark
              small
              @click="addForm()"
              v-show="showAdd"
            >
              <v-icon dark left>
                {{ icons.mdiPlus }}
              </v-icon>
              Add Data
            </v-btn>
            <v-dialog v-model="formData" persistent width="700">
              <v-card>
                <v-card-title class="px-8 font-weight-bold">
                  {{ formEdit ? "Update Type Partner" : "Add Type Partner" }}
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" icon small @click="closeForm()">
                    <v-icon>{{ icons.mdiClose }}</v-icon>
                  </v-btn>
                </v-card-title>
                <v-form
                  class="mt-n4"
                  ref="form"
                  @submit.prevent="formEdit ? editData() : addData()"
                >
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="6" class="pb-0 mt-2">
                          <v-text-field
                            v-model="form.typePartnerCode"
                            label="Code"
                            :rules="[validators.required]"
                            dense
                            class="mb-0"
                            hide-details="auto"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 mt-2">
                          <v-text-field
                            v-model="form.typePartnerName"
                            label="Name"
                            :rules="[validators.required]"
                            dense
                            class="mb-0"
                            hide-details="auto"
                            clearable
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" class="pb-0 mt-2">
                          <v-select
                            :items="groupPartnerList"
                            v-model="form.groupPartner"
                            item-text="propKey"
                            item-value="code"
                            label="Group Partner"
                            hide-details="auto"
                            class="mb-0"
                            dense
                            clearable
                            persistent-placeholder
                            placeholder="Select Group Partner"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions class="mt-4 px-8">
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
              hide-default-footer
              disable-pagination
              fixed-header
              dense
            >
              <template #[`item.groupPartner`]="{ item }">
                {{
                  item.groupPartner == "S"
                    ? "SALESMAN"
                    : item.groupPartner == "E"
                    ? "EMPLOYEE"
                    : "CUSTOMER"
                }}
              </template>

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
                          v-show="true"
                        >
                          {{ icons.mdiFormatListBulleted }}
                        </v-icon>
                      </template>
                      <span>More Info</span>
                    </v-tooltip>
                  </template>
                  <v-list dense>
                    <v-list-item @click="editForm(item)" v-show="true">
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

                    <v-list-item @click="confirmDialog(item.id)" v-show="true">
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
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppAutocompliteStatus from "@core/components/app-autocomplite-ou/AppAutocompliteStatus";
import Form from "vform";
import axios from "@axios";
import themeConfig from "@themeConfig";
import {
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiDelete,
  mdiFormatListBulleted,
  mdiPlus,
  mdiTextBoxCheck,
} from "@mdi/js";
import { isInArray } from "../../../constan";
import { required } from "@core/utils/validation";
import moment from "moment";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";

export default {
  name: "childTypeParentList",
  components: {
    AppAutocompliteStatus,
    AppCardLoader,
  },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      isDialogVisible: false,
      formData: false,
      formEdit: false,
      showAdd:
        isInArray("addTypePartner", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray("editTypePartner", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray("removeTypePartner", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",

      validators: {
        required,
      },
      icons: {
        mdiDelete,
        mdiTextBoxCheck,
        mdiPlus,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
        mdiClipboardEditOutline,
        mdiFormatListBulleted,
      },

      mainData: [],
      groupPartnerList: [],
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Type Code",
          value: "typePartnerCode",
          width: "200px",
        },
        {
          text: "Name",
          value: "typePartnerName",
        },
        {
          text: "Group",
          value: "groupPartner",
          width: "300px",
        },
      ],
      form: new Form({
        id: "",
        typePartnerCode: "",
        typePartnerName: "",
        groupPartner: "",
      }),
    };
  },
  mounted() {
    this.getGroupPartnerList();
    this.refreshData();
  },
  methods: {
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
            `${themeConfig.app.api_master}/type-partner/add`,
            {
              typePartnerCode: this.form.typePartnerCode,
              typePartnerName: this.form.typePartnerName,
              groupPartner: this.form.groupPartner,
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.closeForm();
            this.refreshData();
            this.notif("success", "Sukses", "Tambah data berhasil!.");
          })
          .catch((e) => {
            this.isDialogVisible = false;
            this.notif("error", "Gagal", e.response.data.meta.message);
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
            `${themeConfig.app.api_master}/type-partner/edit`,
            {
              id: this.form.id,
              typePartnerCode: this.form.typePartnerCode,
              typePartnerName: this.form.typePartnerName,
              groupPartner: this.form.groupPartner,
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.closeForm();
            this.refreshData();
            this.notif("success", "Sukses", "Update data berhasil!.");
          })
          .catch((e) => {
            this.isDialogVisible = false;
            this.notif("error", "Gagal", e.response.data.meta.message);
            if (e.response.status === 401) {
              localStorage.clear();
              sessionStorage.clear();
              router.push({ name: "auth-login" });
            }
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
        .get(`${themeConfig.app.api_master}/type-partner/remove/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.refreshData();
          this.notif("success", "success", response.data.meta.message);
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
    getGroupPartnerList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/combo/list?comboId=TYPEPARTNER`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.groupPartnerList = response.data.result);
          this.groupPartnerList = [];
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
    refreshData() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/type-partner/list`, config)
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null)
            return (this.mainData = response.data.result);
          this.mainData = [];
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", e.response.data.meta.message);
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
