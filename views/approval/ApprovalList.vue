∫
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
            <span>Approval Flow</span>
            <v-spacer></v-spacer>
            <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="12" class="mb-0">
                <v-text-field
                  v-model="filterForm.keyword"
                  label="Keyword"
                  dense
                  hide-details
                  persistent-placeholder
                  :placeholder="phKeyword"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-btn dark small color="primary" @click="confirmFilter()">
                  <v-icon dark left>
                    {{ icons.mdiMagnify }}
                  </v-icon>
                  Filter
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-title id="target-table" class="align-start my-n4">
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
              class="mt-4"
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
            <v-dialog v-model="formData" persistent width="400">
              <template #activator="{ on, attrs }"> </template>
              <v-card>
                <v-card-title class="headline">
                  Add flow
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" icon small @click="closeForm()">
                    <v-icon>{{ icons.mdiClose }}</v-icon>
                  </v-btn>
                </v-card-title>
                <v-form ref="form" @submit.prevent="addData()">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <v-autocomplete
                          v-model="form.docTypeId"
                          :items="docTypeList"
                          dense
                          :rules="[(v) => !!v || 'This field is required']"
                          item-text="docDesc"
                          item-value="docTypeId"
                          label="Document Type"
                          hide-details="auto"
                          class="mb-0 mt-4"
                          clearable
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12x" class="pb-0">
                        <v-text-field
                          v-model="form.aweFlowDesc"
                          label="Description Flow"
                          :rules="[validators.required]"
                          dense
                          hide-details="auto"
                          class="mb-0 mt-4"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="mt-4">
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
              :items-per-page="itemPerPage"
              fixed-header
              hide-default-footer
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
                      @click="manageFlow(item)"
                      v-on="on"
                      v-show="showManageFlow"
                    >
                      <v-icon>
                        {{ icons.mdiTimelineTextOutline }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Manage Flow</span>
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
import Form from "vform";
import axios from "@axios";
import themeConfig from "@themeConfig";
import moment from "moment";
import { required } from "@core/utils/validation";
import {
  mdiTimelineTextOutline,
  mdiCalendar,
  mdiMagnify,
  mdiPlus,
  mdiClose,
  mdiCheckboxMarkedCircleOutline,
} from "@mdi/js";
import { isInArray } from "../../../constan";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";

Vue.use(VueScrollTo);

export default {
  name: "Child",
  components: { AppCardLoader },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      phKeyword: themeConfig.placeholder.keyword,

      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      docTypeList: [],
      mainData: [],
      states: ["DRAFT", "INCOMING APPROVAL REQUEST", "APPROVED"],
      formData: false,
      formEdit: false,
      formManageFlow: true,
      dateFromMenu: false,
      dateToMenu: false,
      isDialogVisible: false,
      showAdd:
        isInArray("addApprovalFlow", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showManageFlow:
        isInArray(
          "editManageApprovalFlow",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      validators: {
        required,
      },
      icons: {
        mdiTimelineTextOutline,
        mdiCalendar,
        mdiMagnify,
        mdiPlus,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
      },
      filterForm: new Form({
        keyword: "",
      }),
      form: new Form({
        docTypeId: "",
        aweFlowDesc: "",
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
          text: "Scheme",
          value: "scheme",
          width: "150px",
        },
        {
          text: "Flow Descripton",
          value: "aweFlowDesc",
          width: "300px",
        },
      ],
    };
  },
  mounted() {
    this.getDocList();
    this.refreshData();
  },
  methods: {
    confirmFilter() {
      this.ofset = 0;
      this.currentPage = 1;
      this.refreshData();
    },
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
    manageFlow(data) {
      this.$root.$emit("formManageFlow", this.formManageFlow);
      this.$root.$emit("formManageFlowForm", data);
    },
    addForm() {
      this.formEdit = false;
      this.form.reset();
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
            `${themeConfig.app.api_awe}/approval/flow/add`,
            {
              docTypeId: this.form.docTypeId,
              aweFlowDesc: this.form.aweFlowDesc,
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
    getDocList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/document/list`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.docTypeList = response.data.result);
          this.docTypeList = [];
        })
        .catch((e) => {
          this.notif("error", "Gagal", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
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
        .post(
          `${themeConfig.app.api_awe}/approval/awe/count`,
          {
            keyword: this.filterForm.keyword,
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
          this.notif("error", "Gagal", e.response.data.meta.message);
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
        .post(
          `${themeConfig.app.api_awe}/approval/awe/list`,
          {
            keyword: this.filterForm.keyword,
            limit: this.itemPerPage,
            offset: this.ofset,
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
