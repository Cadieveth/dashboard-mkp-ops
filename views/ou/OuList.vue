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
    <v-dialog v-model="formDataOutlet" persistent width="1000">
      <v-card>
        <v-card-title class="headline font-weight-bold">
          Form Outlet
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-form
          ref="form"
          @submit.prevent="formEditOutlet ? editDataOutlet() : addDataOutlet()"
        >
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="">
                  <app-autocomplite-partner
                    :form-value.sync="formOutlet.partnerId"
                  >
                  </app-autocomplite-partner>
                </v-col>
                <v-col cols="12" md="6" class="">
                  <v-text-field
                    v-model="formOutlet.outletName"
                    label="Outlet Name"
                    dense
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="">
                  <v-autocomplete
                    :label="ouSB"
                    :items="ouList"
                    v-model="formOutlet.ouSettlementId"
                    item-value="ouId"
                    item-text="ouName"
                    class="mb-0"
                    dense
                    hide-details
                    persistent-placeholder
                    :placeholder="phOuSB"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" class="">
                  <v-menu
                    v-model="menuStart"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="formOutlet.startTrxDate"
                        :label="'Start Transaction Date'"
                        :append-icon="icons.mdiCalendar"
                        readonly
                        dense
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                        persistent-placeholder
                        :placeholder="phDate"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formOutlet.startTrxDate"
                      :max="new Date().toISOString().substr(0, 10)"
                      min="1950-01-01"
                      color="primary"
                      @input="menuStart = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="mb-0">
                  <v-radio-group
                    v-model="formOutlet.flgInbound"
                    class="mt-0 mb-0"
                    hide-details
                    label="Bank Reconcile Settlement"
                  >
                    <div class="d-flex flex-wrap demo-space-x">
                      <v-radio
                        label="Yes"
                        color="primary"
                        value="Y"
                        class="mb-0"
                      ></v-radio>
                      <v-radio
                        label="No"
                        color="primary"
                        value="N"
                        class="mb-0"
                      ></v-radio>
                    </div>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="3" class="mb-0">
                  <v-radio-group
                    v-model="formOutlet.flgAr"
                    class="mt-0 mb-0"
                    hide-details
                    label="Account Receivable(AR)"
                  >
                    <div class="d-flex flex-wrap demo-space-x">
                      <v-radio
                        label="Invoicing"
                        color="primary"
                        value="Y"
                        class="mb-0"
                      ></v-radio>
                      <v-radio
                        label="Nett Off"
                        color="primary"
                        value="N"
                        class="mb-0"
                      ></v-radio>
                    </div>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="3" class="mb-0">
                  <v-radio-group
                    v-model="formOutlet.flgComission"
                    class="mt-0 mb-0"
                    hide-details
                    label="Partner Comission"
                  >
                    <div class="d-flex flex-wrap demo-space-x">
                      <v-radio
                        label="Yes"
                        color="primary"
                        value="Y"
                        class="mb-0"
                      ></v-radio>
                      <v-radio
                        label="No"
                        color="primary"
                        value="N"
                        class="mb-0"
                      ></v-radio>
                    </div>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="3" class="mb-0">
                  <v-radio-group
                    v-model="formOutlet.flgServiceFeeTax"
                    class="mt-0 mb-0"
                    hide-details
                    label="Service Fee Tax"
                  >
                    <div class="d-flex flex-wrap demo-space-x">
                      <v-radio
                        label="Yes"
                        color="primary"
                        value="Y"
                        class="mb-0"
                      ></v-radio>
                      <v-radio
                        label="No"
                        color="primary"
                        value="N"
                        class="mb-0"
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
      <v-col id="target-table" cols="12" md="12">
        <v-card>
          <v-card-title class="align-start">
            <span>Business Unit</span>
            <v-spacer></v-spacer>
            <!-- <v-col cols="12" md="12" class="">
              <app-autocomplite-partner></app-autocomplite-partner>
            </v-col> -->
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
                >
                  <v-icon dark left>{{ icons.mdiPlus }}</v-icon>
                  Add Data
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="px-8 font-weight-bold">
                  {{ formEdit ? "Update Business Unit" : "Add Business Unit" }}
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
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="form.ouCode"
                            label="Code"
                            :rules="[validators.required]"
                            placeholder="Insert Business Unit Code"
                            dense
                            hide-details="auto"
                            class="mb-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="form.ouName"
                            label="Name"
                            :rules="[validators.required]"
                            placeholder="Insert Business Unit Name"
                            dense
                            hide-details="auto"
                            class="mb-0"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          :md="typeOu == 'COM' ? '12' : '6'"
                          v-show="!formEdit"
                        >
                          <v-autocomplete
                            v-model="form.ouTypeId"
                            :items="ouTypeList"
                            dense
                            :rules="[(v) => !!v || 'This field is required']"
                            item-text="ouTypeName"
                            item-value="id"
                            label="Type"
                            placeholder="Select Business Unit Type"
                            hide-details="auto"
                            class="mb-0"
                            clearable
                            @change="showParentList(form.ouTypeId)"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          v-show="typeOu != 'COM' && !formEdit"
                        >
                          <v-autocomplete
                            v-model="form.ouParentId"
                            :items="parentList"
                            dense
                            item-text="ouName"
                            item-value="id"
                            placeholder="Select Parent"
                            label="Parent"
                            hide-details="auto"
                            class="mb-0"
                            clearable
                          ></v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-container>
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
                  label="Search"
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
              fixed-header
              hide-default-footer
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
                          v-show="
                            showEdit ||
                            showDelete ||
                            showActive ||
                            showCBOu ||
                            (showAddOutlet && item.ouTypeCode == 'OUT')
                          "
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

                    <v-list-item
                      @click="settingCashBankOu(item.id)"
                      v-show="showCBOu"
                    >
                      <v-list-item-icon class="me-2 mt-1">
                        <v-icon size="18" color="secondary">
                          {{ icons.mdiDelete }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="pt-0">
                        <v-list-item-title class="secondary--text"
                          >Set Cash Bank Ou</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      @click="createOutlet(item)"
                      v-show="item.ouTypeCode == 'OUT' && showAddOutlet"
                    >
                      <v-list-item-icon class="me-2 mt-1">
                        <v-icon size="18" color="secondary">
                          {{ icons.mdiHomeCityOutline }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="pt-0">
                        <v-list-item-title class="secondary--text"
                          >Create Outlet</v-list-item-title
                        >
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
              total-visible="7"
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
import axios from "@axios";
import themeConfig from "@themeConfig";
import { required } from "@core/utils/validation";
import {
  mdiAccountCashOutline,
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiDelete,
  mdiEyeOffOutline,
  mdiEyeOutline,
  mdiFormatListBulleted,
  mdiHomeCityOutline,
  mdiLock,
  mdiLockOpenVariantOutline,
  mdiMagnify,
  mdiPlus,
  mdiTextBoxCheck,
} from "@mdi/js";
import { dateFormat, dateFormatIso, isInArray } from "../../../constan";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import AppAutocompliteOuSubbranch from "@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranch";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import AppAutocomplitePartner from "@/@core/components/app-autocomplite-for-filter/AppAutocomplitePartner";
import moment from "moment";

Vue.use(VueScrollTo);

export default {
  name: "Child",
  components: {
    AppAutocompliteOuSubbranch,
    AppInputFieldDate,
    AppCardLoader,
    AppAutocomplitePartner,
  },
  data() {
    return {
      partner: themeConfig.labeling.partner,
      ouSB: themeConfig.labeling.ouSB,
      phOuSB: themeConfig.placeholder.ouSB,
      phDate: themeConfig.placeholder.date,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      dataForParent: [],
      ouTypeList: [],
      parentList: [],
      partnerList: [],
      ouList: [],
      formData: false,
      formDataOutlet: false,
      formEdit: false,
      formEditOutlet: false,
      formOuCashBank: true,
      isDialogVisible: false,
      menuStart: false,
      showAdd:
        isInArray("addOu", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray("editOu", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray("removeOu", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showActive:
        isInArray("editActiveOu", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showCBOu:
        isInArray(
          "viewMappingCashbankOu",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showAddOutlet:
        isInArray("addOutlet", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      search: "",
      typeOu: "",
      filterForm: new Form({
        keyword: "",
        active: "",
      }),
      form: new Form({
        id: "",
        ouCode: "",
        ouName: "",
        ouParentId: "",
        ouTypeId: "",
      }),
      formOutlet: new Form({
        id: "",
        ouId: -99,
        outletName: "",
        flgInbound: "Y",
        partnerId: -99,
        flgAr: true,
        flgComission: true,
        flgServiceFeeTax: "N",
        ouSettlementId: -99,
        startTrxDate: moment().format("YYYY-MM-DD"),
      }),
      outletForm: {},
      validators: {
        required,
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
        mdiHomeCityOutline,
      },
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "75px",
        },
        {
          text: "Code",
          value: "ouCode",
        },
        {
          text: "Name",
          value: "ouName",
        },
        {
          text: "Type",
          value: "ouTypeName",
          width: "200px",
        },
        {
          text: "Parent",
          value: "ouParentName",
          width: "300px",
        },
      ],
    };
  },
  mounted() {
    this.getOuType();
    this.refreshData();
  },
  methods: {
    onClearPartner() {
      alert("as");
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
    getCountData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/ou/count-list`,
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
          this.notif("error", "Failed", e.response.data.meta.message);
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
          `${themeConfig.app.api_master}/partner/list`,
          {
            keyword: "",
            ctgrPartnerId: -99,
            active: "Y",
            limit: 2000,
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
          this.notif("error", "Failed", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    showParentList(str) {
      var typeOu = "";
      this.ouTypeList.map(function (type) {
        if (type.id == str) {
          typeOu = type.ouTypeCode;
        }
      });
      this.typeOu = typeOu;

      if (this.typeOu === "COM") {
        this.form.ouParentId = "";
        this.parentList = [];
      } else {
        this.form.ouParentId = "";
        this.parentList = [];
        Array.from(this.dataForParent).forEach((element) => {
          if (this.typeOu === "BRA" && element.ouTypeCode === "COM") {
            this.parentList.push(element);
          } else if (this.typeOu === "OUT" && element.ouTypeCode === "BRA") {
            this.parentList.push(element);
          } else if (this.typeOu === "DEP" && element.ouTypeCode === "OUT") {
            this.parentList.push(element);
          }
        });
      }
    },
    settingCashBankOu(id) {
      this.$root.$emit("formOuCashBank", this.formOuCashBank);
      this.$root.$emit("formOuCashBankForm", id);
    },
    addForm() {
      this.formEdit = false;
      this.form.reset();
      this.form.clear();
      this.formData = true;
      this.getOuListForParent();
    },
    editForm(data) {
      this.getOuListForParent();
      this.formEdit = true;
      this.form.fill(data);
      this.form.clear();
      this.formData = true;
    },
    closeForm() {
      if (this.formData == true) {
        this.formData = false;
        this.form.reset();
        this.form.clear();
        this.$refs.form.resetValidation();
      } else if (this.formDataOutlet == true) {
        this.formDataOutlet = false;
        this.formOutlet.reset();
        this.formOutlet.clear();
        // this.$refs.form.resetValidation()
      }
    },
    createOutlet(data) {
      this.formOutlet.reset();
      this.formOutlet.clear();
      this.formDataOutlet = true;
      this.formOutlet.ouId = data.id;
      this.getPartnerList();
      this.getOuSubBranchList(data.ouParentId);
      this.getOutletList(data);
    },
    getOuSubBranchList(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/ou/authorized-ou-sub-branch-list?ouId=${id}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.ouList = response.data.result);
          this.ouList = [];
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Gagal", e.response.data.message);
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
    // start outlet
    getOutletList(data) {
      this.outletForm = {};
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${
            themeConfig.app.api_master
          }/outlet/list?outletName=&ouId=${parseInt(
            data.id
          )}&limit=10&offset=0`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            // this.formOutlet = response.data.result[0];
            this.formOutlet.startTrxDate =
              response.data.result[0].startTrxDate === ""
                ? ""
                : dateFormatIso(response.data.result[0].startTrxDate);
            this.formOutlet.id = response.data.result[0].id;
            this.formOutlet.ouId = response.data.result[0].ouId;
            this.formOutlet.outletName = response.data.result[0].outletName;
            this.formOutlet.flgInbound = response.data.result[0].flgInbound;
            this.formOutlet.partnerId = response.data.result[0].partnerId;
            this.formOutlet.flgAr = response.data.result[0].flgAr;
            this.formOutlet.flgComission = response.data.result[0].flgComission;
            this.formOutlet.ouSettlementId =
              response.data.result[0].ouSettlementId;
            this.formOutlet.startTrxDate = moment(
              response.data.result[0].startTrxDate
            ).format("YYYY-MM-DD");
            this.formOutlet.flgServiceFeeTax =
              response.data.result[0].flgServiceFeeTax;
            this.formEditOutlet = true;
          } else {
            this.formEditOutlet = false;
            this.formOutlet.reset();
            this.formOutlet.clear();
            this.formOutlet.ouId = data.id;
            this.formOutlet.outletName = data.ouCode + " - " + data.ouName;
          }
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    addDataOutlet() {
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
            `${themeConfig.app.api_master}/outlet/add`,
            {
              ouId:
                this.formOutlet.ouId == ""
                  ? -99
                  : parseInt(this.formOutlet.ouId),
              outletName: this.formOutlet.outletName,
              flgInbound: this.formOutlet.flgInbound,
              partnerId:
                this.formOutlet.partnerId == ""
                  ? -99
                  : parseInt(this.formOutlet.partnerId),
              flgAr: this.formOutlet.flgAr,
              flgComission: this.formOutlet.flgComission,
              flgServiceFeeTax: this.formOutlet.flgServiceFeeTax,
              ouSettlementId:
                this.formOutlet.ouSettlementId == null
                  ? -99
                  : parseInt(this.formOutlet.ouSettlementId),
              startTrxDate: moment(this.formOutlet.startTrxDate).format(
                "YYYYMMDD"
              ),
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
    editDataOutlet() {
      console.log("this.formOutlet", this.formOutlet);
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
            `${themeConfig.app.api_master}/outlet/edit`,
            {
              id: this.formOutlet.id,
              ouId:
                this.formOutlet.ouId === ""
                  ? -99
                  : parseInt(this.formOutlet.ouId),
              outletName: this.formOutlet.outletName,
              flgInbound: this.formOutlet.flgInbound,
              partnerId:
                this.formOutlet.partnerId === "" ||
                this.formOutlet.partnerId === null
                  ? -99
                  : parseInt(this.formOutlet.partnerId),
              flgAr: this.formOutlet.flgAr,
              flgComission: this.formOutlet.flgComission,
              flgServiceFeeTax: this.formOutlet.flgServiceFeeTax,
              ouSettlementId:
                this.formOutlet.ouSettlementId === null
                  ? -99
                  : parseInt(this.formOutlet.ouSettlementId),
              startTrxDate: moment(this.formOutlet.startTrxDate).format(
                "YYYYMMDD"
              ),
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
    // end outlet
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
            `${themeConfig.app.api_master}/ou/add`,
            {
              ouCode: this.form.ouCode,
              ouName: this.form.ouName,
              ouParentId:
                this.form.ouParentId == ""
                  ? -99
                  : parseInt(this.form.ouParentId),
              ouTypeId: parseInt(this.form.ouTypeId),
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.closeForm();
            this.refreshData();
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
            `${themeConfig.app.api_master}/ou/edit`,
            {
              id: this.form.id,
              ouCode: this.form.ouCode,
              ouName: this.form.ouName,
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.closeForm();
            this.refreshData();
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
    removeData(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/ou/remove/${id}`, config)
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
    activeData(id, status) {
      if (status == "Y") {
        var text = "Data berhasil Non Active!.";
      } else {
        var text = "Data berhasil Active!.";
      }
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/ou/edit-active/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.refreshData();
          this.notif("success", "Success", text);
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
    getOuType() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/ou/list-ou-type`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.ouTypeList = response.data.result);
          this.ouTypeList = [];
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getOuListForParent() {
      this.isDialogVisible = true;
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
          this.isDialogVisible = false;
          if (response.data.result !== null)
            return (this.dataForParent = response.data.result);
          this.dataForParent = [];
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
          `${themeConfig.app.api_master}/ou/list`,
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
