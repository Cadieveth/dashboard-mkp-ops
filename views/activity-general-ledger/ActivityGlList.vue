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
    <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
    <v-dialog v-model="formData" persistent width="700">
      <v-card>
        <v-card-title class="font-weight-bold">
          Form Activity GL
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-form ref="form" @submit.prevent="formEdit ? editData() : addData()">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="mb-0">
                  <v-text-field
                    dense
                    hide-details
                    label="Code"
                    placeholder="Insert General Ledger Code"
                    v-model="form.activityGlCode"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mb-0">
                  <v-text-field
                    dense
                    placeholder="Insert General Ledger Name"
                    hide-details
                    label="Name"
                    v-model="form.activityGlName"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-autocomplete
                    :items="coaList"
                    v-model="form.coaId"
                    placeholder="Select Chart of Account"
                    item-text="coaDesc"
                    item-value="id"
                    label="Chart of Account"
                    hide-details="auto"
                    class="mb-0"
                    dense
                    clearable
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
    <v-row>
      <v-col cols="12" class="mb-0">
        <v-card>
          <v-card-title><span>Activity General Ledger</span></v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="mb-0">
                <v-text-field
                  dense
                  hide-details
                  label="Keyword"
                  placeholder="Insert Keyword"
                  v-model="filterForm.keyword"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn small dark color="primary" @click="refreshData()">
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
          </v-card-actions>
          <v-card-title class="mt-n4">
            <v-spacer></v-spacer>
            <v-btn
              v-show="showAdd"
              dark
              small
              @click="addForm()"
              color="primary"
            >
              <v-icon dark left>
                {{ icons.mdiPlus }}
              </v-icon>
              Add Data
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="mb-0">
                <v-data-table
                  :headers="headers"
                  :items="mainData"
                  :footer-props="{
                    'items-per-page-options': [25, 50, 100],
                  }"
                  fixed-header
                  dense
                >
                  <template #[`item.actions`]="{ item }">
                    <v-tooltip bottom color="warning">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          x-small
                          icon
                          color="warning"
                          v-bind="attrs"
                          v-on="on"
                          @click="editForm(item)"
                          v-show="showEdit"
                        >
                          <v-icon>
                            {{ icons.mdiClipboardEditOutline }}
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Edit</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="mb-0"> </v-col>
    </v-row>
  </div>
</template>

<script>
import Form from "vform";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import {
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiMagnify,
  mdiPlus,
} from "@mdi/js";
import { isInArray } from "../../../constan";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";

export default {
  name: "ChildList",
  components: { AppCardLoader },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      currentPage: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],

      //role
      showAdd:
        isInArray("addActivityGL", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",

      showEdit:
        isInArray("editActivityGL", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",

      isDialogVisible: false,
      formData: false,
      formEdit: false,
      coaList: [],
      mainData: [],
      filterForm: new Form({
        keyword: "",
      }),
      form: new Form({
        id: "",
        activityGlCode: "",
        activityGlName: "",
        coaId: -99,
      }),
      icons: {
        mdiPlus,
        mdiClose,
        mdiMagnify,
        mdiClipboardEditOutline,
        mdiCheckboxMarkedCircleOutline,
      },
      headers: [
        {
          text: "Actions",
          value: "actions",
          width: "100px",
          sortable: false,
        },
        {
          text: "Code",
          value: "activityGlCode",
          width: "150px",
        },
        {
          text: "Name",
          value: "activityGlName",
          width: "300px",
        },
        {
          text: "Main Acc",
          value: "mainAcc",
          width: "125px",
        },
        {
          text: "Sub Acc",
          value: "subAcc",
          width: "100px",
        },
        {
          text: "Coa Desc",
          value: "coaDesc",
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
      this.form.clear();
      this.form.reset();
      this.getCoaList();
      this.formData = true;
    },
    editForm(data) {
      this.formEdit = true;
      this.getCoaList();
      this.form.fill(data);
      this.form.clear();
      this.form.coaId = data.coaId;
      this.formData = true;
    },
    closeForm() {
      this.formData = false;
      this.formEdit = false;
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
    addData() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .post(
          `${themeConfig.app.api_master}/activity-gl/add`,
          {
            activityGlCode: this.form.activityGlCode,
            activityGlName: this.form.activityGlName,
            coaId: this.form.coaId,
          },
          config
        )
        .then((response) => {
          this.notif("success", "Success", response.data.meta.message);
          this.isDialogVisible = false;
          this.formData = false;
          this.refreshData();
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    editData() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .post(
          `${themeConfig.app.api_master}/activity-gl/edit`,
          {
            id: this.form.id,
            activityGlCode: this.form.activityGlCode,
            activityGlName: this.form.activityGlName,
            coaId: this.form.coaId,
          },
          config
        )
        .then((response) => {
          this.notif("success", "Success", response.data.meta.message);
          this.isDialogVisible = false;
          this.formData = false;
          this.refreshData();
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    getCoaList() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .get(
          `${themeConfig.app.api_master}/coa/list?limit=1000&offset=0`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null)
            return (this.coaList = response.data.result);
          this.coaList = [];
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
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
        .get(
          `${themeConfig.app.api_master}/activity-gl/list?keyword=${this.filterForm.keyword}&limit=${this.itemPerPage}&offset=${this.ofset}`,
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
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
