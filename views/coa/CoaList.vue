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
          Form Chart of account
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
                    label="Main Acc"
                    placeholder="Insert Main Account"
                    v-model="form.mainAcc"
                    :readonly="formEdit"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mb-0">
                  <v-text-field
                    dense
                    hide-details
                    label="Sub Acc"
                    placeholder="Insert Sub Account"
                    v-model="form.subAcc"
                    :readonly="formEdit"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                  <v-autocomplete
                    :items="mainDataCoaGroup"
                    v-model="form.groupCoaId"
                    placeholder="Select Group Coa"
                    item-text="groupCoaName"
                    item-value="id"
                    label="Group Coa"
                    hide-details="auto"
                    class="mb-0"
                    dense
                    clearable
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" class="mb-0">
                  <v-text-field
                    dense
                    hide-details
                    placeholder="Insert Coa Description"
                    label="Coa Description"
                    v-model="form.coaDesc"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-0 mt-n2">
                  <span class="font-weight-bold">Entry of Account</span>
                  <v-radio-group
                    v-model="form.signCoa"
                    class="mt-0"
                    hide-details
                  >
                    <div class="d-flex flex-wrap demo-space-x">
                      <v-radio
                        label="Debit"
                        color="primary"
                        value="D"
                      ></v-radio>
                      <v-radio
                        label="Credit"
                        color="primary"
                        value="C"
                      ></v-radio>
                      <v-radio
                        label="Revenue"
                        color="primary"
                        value="R"
                        v-show="false"
                      ></v-radio>
                    </div>
                  </v-radio-group>
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
          <v-card-title><span>Chart of Account</span></v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="mb-0">
                <v-text-field
                  dense
                  hide-details
                  placeholder="Insert Main Account"
                  label="Main Acc"
                  v-model="filterForm.mainAcc"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <v-text-field
                  dense
                  placeholder="Insert Sub Account"
                  hide-details
                  label="Sub Acc"
                  v-model="filterForm.subAcc"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-2">
            <v-btn
              id="target-table"
              small
              dark
              color="primary"
              @click="(currentPage = 1), (ofset = 0), refreshData()"
            >
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
          </v-card-actions>
          <v-card-title class="my-n4">
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
            <v-spacer></v-spacer>
            <v-btn
              v-show="showAdd"
              dark
              small
              color="primary"
              @click="addForm()"
            >
              <v-icon dark left>
                {{ icons.mdiPlus }}
              </v-icon>
              Add Data
            </v-btn>
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
              <template #[`item.groupCoa`]="{ item }">
                <div>
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.groupCoaName }}</span
                  >
                  <span class="text-xs">{{ item.groupCoaCode }}</span>
                </div> </template
              ><!-- Status Flag-->
              <template #[`item.signCoa`]="{ item }">
                <v-chip
                  small
                  :class="`${item.signCoa == 'D' ? 'success' : 'error'}--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.signCoa == 'D' ? 'success' : 'error'"
                >
                  {{ item.signCoa == "D" ? "Debit" : "Credit" }}
                </v-chip>
              </template>
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
                <v-tooltip bottom color="error">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                      @click="confirmDialog(item.id)"
                      v-show="showDelete"
                    >
                      <v-icon>
                        {{ icons.mdiDelete }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
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
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import Form from "vform";
import {
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiDelete,
  mdiMagnify,
  mdiPlus,
} from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import { isInArray } from "../../../constan";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: { AppCardLoader },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      textLoader: themeConfig.placeholder.remarkLoader,

      showEdit:
        isInArray("editChartOfAccount", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",

      showAdd:
        isInArray("addChartOfAccount", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",

      showDelete:
        isInArray(
          "deleteChartOfAccount",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      isDialogVisible: false,
      formData: false,
      formEdit: false,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      mainDataCoaGroup: [],
      filterForm: new Form({
        mainAcc: "",
        subAcc: "",
      }),
      form: new Form({
        id: "",
        mainAcc: "",
        subAcc: "",
        groupCoaId: -99,
        coaDesc: "",
        signCoa: "D",
      }),
      icons: {
        mdiMagnify,
        mdiPlus,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
        mdiDelete,
        mdiClipboardEditOutline,
      },
      headers: [
        {
          text: "Actions",
          value: "actions",
          width: "100px",
          sortable: false,
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
          text: "Group",
          value: "groupCoa",
          width: "150px",
        },
        {
          text: "Coa Desc",
          value: "coaDesc",
        },
        {
          text: "Sign Coa",
          value: "signCoa",
          width: "125px",
          align: "center",
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
    addForm() {
      this.form.clear();
      this.form.reset();
      this.getCoaGroup();
      this.formData = true;
    },
    editForm(data) {
      this.formEdit = true;
      this.getCoaGroup();
      this.form.fill(data);
      this.form.clear();
      this.form.groupCoaId = data.groupCoaId;
      this.formData = true;
    },
    closeForm() {
      this.formData = false;
      this.formEdit = false;
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
          `${themeConfig.app.api_master}/coa/add`,
          {
            mainAcc: this.form.mainAcc,
            subAcc: this.form.subAcc,
            groupCoaId:
              this.form.groupCoaId == "" || this.form.groupCoaId == null
                ? -99
                : this.form.groupCoaId,
            coaDesc: this.form.coaDesc,
            signCoa: this.form.signCoa,
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
          `${themeConfig.app.api_master}/coa/edit`,
          {
            id: this.form.id,
            groupCoaId:
              this.form.groupCoaId == "" || this.form.groupCoaId == null
                ? -99
                : this.form.groupCoaId,
            coaDesc: this.form.coaDesc,
            signCoa: this.form.signCoa,
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
    removeData(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/coa/remove/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.notif("success", "Success", response.data.meta.message);
          this.refreshData();
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
    getCoaGroup() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .get(
          `${themeConfig.app.api_master}/coa/group-coa/list?keyword=&typeCoa=&limit=1000&offset=0`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null)
            return (this.mainDataCoaGroup = response.data.result);
          this.mainDataCoaGroup = [];
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
    getCountData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .get(
          `${themeConfig.app.api_master}/coa/count?mainAcc=${this.filterForm.mainAcc}&subAcc=${this.filterForm.subAcc}`,
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
          `${themeConfig.app.api_master}/coa/list?mainAcc=${this.filterForm.mainAcc}&subAcc=${this.filterForm.subAcc}&limit=${this.itemPerPage}&offset=${this.ofset}`,
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
