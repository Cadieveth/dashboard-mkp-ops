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
    <v-dialog v-model="formData" persistent width="980">
      <v-card>
        <v-card-title class="headline font-weight-bold">
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-form ref="form" @submit.prevent="formEdit ? editData() : addData()">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" class="pb-0">
                  <v-select
                    :items="partnerList"
                    v-model="form.partnerId"
                    item-text="partnerName"
                    item-value="id"
                    label="Partner"
                    hide-details="auto"
                    class="mb-0"
                    dense
                    :readonly="formEdit"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                  <v-text-field
                    v-model="form.outletName"
                    label="Outlet Name"
                    placeholder="Insert Outlet Name"
                    dense
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                  <v-autocomplete
                    :label="ouSB"
                    :items="ouList"
                    v-model="form.ouSettlementId"
                    item-value="ouId"
                    item-text="ouName"
                    class="mb-0"
                    dense
                    hide-details
                    persistent-placeholder
                    :placeholder="phOuSB"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
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
                        v-model="form.startTrxDate"
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
                      v-model="form.startTrxDate"
                      :max="new Date().toISOString().substr(0, 10)"
                      min="1950-01-01"
                      color="primary"
                      @input="menuStart = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="3" class="mb-0">
                  <v-radio-group
                    v-model="form.flgInbound"
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
                    v-model="form.flgAr"
                    class="mt-0 mb-0"
                    hide-details
                    label="Account Receivable"
                  >
                    <div class="d-flex flex-wrap demo-space-x">
                      <v-radio
                        label="Invoicing"
                        color="primary"
                        value="Y"
                        class="mb-0"
                      ></v-radio>
                      <v-radio
                        label="Net Off"
                        color="primary"
                        value="N"
                        class="mb-0"
                      ></v-radio>
                    </div>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" md="3" class="mb-0">
                  <v-radio-group
                    v-model="form.flgComission"
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
                    v-model="form.flgServiceFeeTax"
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
            <v-btn color="primary" small type="submit">
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
      <v-col cols="12" md="12">
        <v-card>
          <v-card-title>
            <span>Outlet</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="filterForm.outletName"
                  label="Outlet Name"
                  dense
                  placeholder="Insert Outlet Name"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <app-autocomplite-ou
                  :form-value.sync="filterForm.ouId"
                  :readOnly="formData"
                ></app-autocomplite-ou>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col id="target-table" cols="12" md="12" class="mt-2">
                <v-btn color="primary" small @click="confirmFilter()">
                  <v-icon dark left>
                    {{ icons.mdiMagnify }}
                  </v-icon>
                  Filter
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
          <v-card-title>
            <v-spacer></v-spacer>
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
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="mainData"
              hide-default-footer
              disable-pagination
              fixed-header
              dense
            >
              <!-- headers -->
              <template #[`header.ouName`]>
                {{ ou }}
              </template>

              <template #[`header.flgAr`]>
                {{ accReceivable }}
              </template>

              <!-- Unit Bisnis -->
              <template #[`item.ou`]="{ item }">
                <div>
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.ouName }}</span
                  >
                  <span class="text-xs">{{ item.ouCode }}</span>
                </div>
              </template>

              <!-- Unit Bisnis -->
              <template #[`item.ouSettlementName`]="{ item }">
                <div>
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.ouSettlementName }}</span
                  >
                  <span class="text-xs">{{ item.ouSettlementCode }}</span>
                </div>
              </template>

              <!-- Produk -->
              <template #[`item.partner`]="{ item }">
                <div>
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.partnerName }}</span
                  >
                  <span class="text-xs">{{ item.partnerCode }}</span>
                </div>
              </template>

              <!-- Status Flag Inbound-->
              <template #[`item.flgInbound`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgInbound == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgInbound == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgInbound == "Y" ? "YES" : "NO" }}
                </v-chip>
              </template>

              <!-- Status Flag AR-->
              <template #[`item.flgAr`]="{ item }">
                <v-chip
                  small
                  :class="`${item.flgAr == 'Y' ? 'primary' : 'accent'}--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgAr == 'Y' ? 'primary' : 'accent'"
                >
                  {{ item.flgAr == "Y" ? "INVOICING" : "NET OFF" }}
                </v-chip>
              </template>

              <!-- Status Flag AR-->
              <template #[`item.flgComission`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgComission == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgComission == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgComission == "Y" ? "YES" : "NO" }}
                </v-chip>
              </template>

              <!-- Status Flag Service Fee Tax-->
              <template #[`item.flgServiceFeeTax`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgServiceFeeTax == 'Y'
                      ? 'success'
                      : item.flgServiceFeeTax == 'N'
                      ? 'error'
                      : 'secondary'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="
                    item.flgComission == 'Y'
                      ? 'success'
                      : item.flgServiceFeeTax == 'N'
                      ? 'error'
                      : 'secondary'
                  "
                >
                  {{
                    item.flgServiceFeeTax == "Y"
                      ? "YES"
                      : item.flgServiceFeeTax == "N"
                      ? "NO"
                      : "NONE"
                  }}
                </v-chip>
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
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import Form from "vform";
import axios from "@axios";
import themeConfig from "@themeConfig";
import { required } from "@core/utils/validation";
import AppAutocomplitePartner from "@/@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import {
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiDelete,
  mdiFormatListBulleted,
  mdiLock,
  mdiLockOpenVariantOutline,
  mdiMagnify,
  mdiPlus,
} from "@mdi/js";
import { dateFormat, isInArray } from "../../../constan";
import moment from "moment";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "ChilsList",
  components: {
    AppAutocompliteOu,
    AppCardLoader,
    AppAutocomplitePartner,
  },
  data() {
    return {
      ouSB: themeConfig.labeling.ouSB,
      phOuSB: themeConfig.placeholder.ouSB,
      phDate: themeConfig.placeholder.date,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      ou: themeConfig.labeling.ou,
      accReceivable: themeConfig.labeling.accountReceivable,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      ouList: [],
      partnerList: [],
      showEdit:
        isInArray("editOutlet", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray("removeOutlet", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showActive:
        isInArray("activeOutlet", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      isDialogVisible: false,
      formData: false,
      formEdit: false,
      menuStart: false,
      filterForm: new Form({
        outletName: "",
        ouId: -99,
      }),
      form: new Form({
        id: "",
        ouId: -99,
        outletName: "",
        flgInbound: "Y",
        partnerId: -99,
        flgAr: "Y",
        flgComission: "Y",
        flgServiceFeeTax: "N",
        ouSettlementId: -99,
        startTrxDate: moment().format("YYYY-MM-DD"),
      }),
      headers: [
        {
          text: "Actions",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "OU",
          value: "ouName",
          width: "300px",
        },
        {
          text: "Outlet",
          value: "outletName",
          width: "250px",
        },
        {
          text: "Organization Unit Settlement",
          value: "ouSettlementName",
          width: "300px",
        },
        {
          text: "Settlement from Account MKP",
          value: "flgInbound",
          width: "220px",
          align: "center",
        },
        {
          text: "Partner",
          value: "partnerName",
          width: "250px",
        },
        {
          text: "Invoicing",
          value: "flgAr",
          width: "200px",
          align: "center",
        },
        {
          text: "Partner Comission",
          value: "flgComission",
          width: "160px",
          align: "center",
        },
        {
          text: "Service Fee Tax",
          value: "flgServiceFeeTax",
          width: "160px",
          align: "center",
        },
      ],
      validators: {
        required,
      },
      icons: {
        mdiPlus,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
        mdiMagnify,
        mdiClipboardEditOutline,
        mdiDelete,
        mdiLockOpenVariantOutline,
        mdiLock,
        mdiFormatListBulleted,
      },
    };
  },
  mounted() {
    this.getPartnerList();
    this.refreshData();
  },
  methods: {
    confirmFilter() {
      this.currentPage = 1;
      this.ofset = 0;
      this.refreshData();
    },
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    dateFormat(value) {
      return dateFormat(value);
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
      this.form.startTrxDate = moment(data.startTrxDate).format("YYYY-MM-DD");
      this.getOuSubBranchList(data.ouParentId);
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
    closeForm() {
      this.formData = false;
      this.form.reset();
      this.form.clear();
      this.$refs.form.resetValidation();
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
          this.notif("error", "Failed", e.response.data.meta.message);
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
            `${themeConfig.app.api_master}/outlet/add`,
            {
              ouId: this.form.ouId == "" ? -99 : parseInt(this.form.ouId),
              outletName: this.form.outletName,
              flgInbound: this.form.flgInbound,
              partnerId:
                this.form.partnerId == "" ? -99 : parseInt(this.form.partnerId),
              flgAr: this.form.flgAr,
              flgComission: this.form.flgComission,
              ouSettlementId:
                this.form.ouSettlementId == null
                  ? -99
                  : parseInt(this.form.ouSettlementId),
              startTrxDate: moment(this.form.startTrxDate).format("YYYYMMDD"),
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
            `${themeConfig.app.api_master}/outlet/edit`,
            {
              id: this.form.id,
              ouId: this.form.ouId == "" ? -99 : parseInt(this.form.ouId),
              outletName: this.form.outletName,
              flgInbound: this.form.flgInbound,
              partnerId:
                this.form.partnerId == "" ? -99 : parseInt(this.form.partnerId),
              flgAr: this.form.flgAr,
              flgComission: this.form.flgComission,
              flgServiceFeeTax: this.form.flgServiceFeeTax,
              ouSettlementId:
                this.form.ouSettlementId == null
                  ? -99
                  : parseInt(this.form.ouSettlementId),
              startTrxDate: moment(this.form.startTrxDate).format("YYYYMMDD"),
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
        .get(`${themeConfig.app.api_master}/outlet/remove/${id}`, config)
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
        .get(`${themeConfig.app.api_master}/outlet/edit-active/${id}`, config)
        .then((response) => {
          this.refreshData();
          this.notif("success", "Success", text);
          this.isDialogVisible = false;
        })
        .catch((e) => {
          this.notif("error", "Failed", e);
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
          `${themeConfig.app.api_master}/outlet/count?outletName=${this.filterForm.outletName}&ouId=${this.filterForm.ouId}`,
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
        .get(
          `${themeConfig.app.api_master}/outlet/list?outletName=${this.filterForm.outletName}&ouId=${this.filterForm.ouId}&limit=${this.itemPerPage}&offset=${this.ofset}`,
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
