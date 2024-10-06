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
      <v-card class="card-style">
        <v-card-title class="mt-4 font-weight-bold">
          <span>Input Merchant Identity</span>
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-form ref="form" @submit.prevent="formEdit ? editData() : addData()">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="form.projectName"
                  label="Project Name"
                  placeholder="Insert Project Name"
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-select
                  v-model="form.cashbankId"
                  :items="cashbankList"
                  item-text="cashbankName"
                  placeholder="Select Cash Bank"
                  item-value="id"
                  dense
                  clearable
                  label="Cash/Bank"
                  hide-details="auto"
                  class="mb-0"
                >
                  <template #selection="data">
                    <v-avatar left color="#e6e6e6" size="30">
                      <v-img
                        :src="
                          require(`@/assets/images/logos/bank_logo/${data.item.logoImage}_logo.png`)
                        "
                      ></v-img>
                    </v-avatar>
                    <span class="font-weight-semibold ml-1">{{
                      "&nbsp;" + data.item.cashbankCode + "&nbsp;"
                    }}</span>
                    <span>{{ " - " + data.item.cashbankName }}</span>
                  </template>
                  <template #item="data">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-avatar left color="#e6e6e6" size="24">
                            <v-img
                              :src="
                                require(`@/assets/images/logos/bank_logo/${data.item.logoImage}_logo.png`)
                              "
                            ></v-img>
                          </v-avatar>
                          <span class="font-weight-semibold">{{
                            "&nbsp;" + data.item.cashbankCode + "&nbsp;"
                          }}</span>
                          <span>{{ " - " + data.item.cashbankName }}</span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.mid"
                  label="MID"
                  placeholder="Insert MID"
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="form.subPaymentChannelId"
                  :items="subPaymentChannelList"
                  item-text="subPaymentChannelName"
                  item-value="id"
                  dense
                  placeholder="Select Sub Payment Channel"
                  clearable
                  label="Sub Payment Channel"
                  hide-details="auto"
                  class="mb-0"
                  @change="getPaymentChanelById()"
                >
                  <template #selection="data">
                    <v-avatar left color="#e6e6e6" size="30">
                      <v-img
                        :src="
                          require(`@/assets/images/logos/bank_logo/${
                            data.item.paymentChannelCode == 'COM'
                              ? 'CASH'
                              : data.item.paymentChannelCode == 'BDKI'
                              ? 'DKI'
                              : data.item.logoImage
                          }_logo.png`)
                        "
                      ></v-img>
                    </v-avatar>
                    <span class="font-weight-semibold ml-2">
                      {{ data.item.subPaymentChannelName }}</span
                    >
                  </template>
                  <template #item="data">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-avatar left color="#e6e6e6" size="30">
                            <v-img
                              :src="
                                require(`@/assets/images/logos/bank_logo/${
                                  data.item.paymentChannelCode == 'COM'
                                    ? 'CASH'
                                    : data.item.paymentChannelCode == 'BDKI'
                                    ? 'DKI'
                                    : data.item.logoImage
                                }_logo.png`)
                              "
                            ></v-img>
                          </v-avatar>
                          <span class="font-weight-semibold">
                            {{ data.item.subPaymentChannelName }}</span
                          >
                        </v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" class="mt-2">
                <v-text-field
                  v-model="form.mdrSell"
                  label="MDR Sell(%)"
                  placeholder="Insert MDR Sell(%)"
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="mt-2">
                <v-text-field
                  v-model="form.mdrFee"
                  label="MDR Charge Fee(%)"
                  placeholder="Insert MDR Charge Fee(%)"
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-menu
                  ref="menu"
                  v-model="menuStartCutOffTime"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="form.startCutOffTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.startCutOffTime"
                      label="Start Cut Off Time"
                      :append-icon="icons.mdiClockTimeFourOutline"
                      readonly
                      dense
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuStartCutOffTime"
                    v-model="form.startCutOffTime"
                    color="primary"
                    full-width
                    @click:minute="$refs.menu.save(form.startCutOffTime)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-menu
                  ref="menu2"
                  v-model="menuEndCutOffTime"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="form.endCutOffTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.endCutOffTime"
                      label="End Cut Off Time"
                      :append-icon="icons.mdiClockTimeFourOutline"
                      readonly
                      dense
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuEndCutOffTime"
                    v-model="form.endCutOffTime"
                    color="primary"
                    full-width
                    @click:minute="$refs.menu2.save(form.endCutOffTime)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6" class="mt-2">
                <v-text-field
                  v-model="form.dueDate"
                  label="Due Date"
                  type="number"
                  dense
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 pt-0">
                <v-radio-group
                  label="Auto Correction"
                  v-model="form.flgAutoCorrection"
                  class="mt-0 mb-0"
                  hide-details
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
              <v-col cols="12" md="6" class="pb-0 pt-0">
                <v-radio-group
                  label="Internal Settlement"
                  v-model="form.flgInbound"
                  class="mt-0 mb-0"
                  hide-details
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
              <v-col cols="12" md="6" class="pb-0 pt-0">
                <v-radio-group
                  label="Bank Reconcile"
                  v-model="form.flgBankReconcile"
                  class="mt-0 mb-0"
                  hide-details
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
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small dark color="primary" type="submit">
              <v-icon dark left>{{
                icons.mdiCheckboxMarkedCircleOutline
              }}</v-icon>
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
            <span>Merchant Identity</span>
          </v-card-title>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="6" class="mb-0">
                <v-text-field
                  v-model="filterForm.mid"
                  placeholder="Insert MID"
                  label="MID"
                  dense
                  hide-details
                  class="mb-0"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="mb-0">
                <v-text-field
                  v-model="filterForm.projectName"
                  label="Project Name"
                  placeholder="Insert Project Name"
                  dense
                  hide-details
                  class="mb-0"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12" class="mt-0">
                <v-btn small dark color="primary" @click="confirmFilter()">
                  <v-icon dark left>
                    {{ icons.mdiMagnify }}
                  </v-icon>
                  Filter
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-title class="my-n2">
            <v-spacer></v-spacer>
            <v-btn
              small
              dark
              color="primary"
              @click="addForm()"
              v-show="showAdd"
            >
              <v-icon dark left>
                {{ icons.mdiPlus }}
              </v-icon>
              Add Data
            </v-btn>
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
              <!-- account  -->
              <template #[`item.accountName`]="{ item }">
                <div class="d-flex align-center">
                  <v-avatar color="#e6e6e6" size="30">
                    <v-img
                      :src="
                        require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                      "
                    ></v-img>
                  </v-avatar>

                  <div class="d-flex flex-column ms-3">
                    <span
                      class="
                        d-block
                        text--primary
                        font-weight-semibold
                        text-truncate
                      "
                      >{{ item.accountName }}</span
                    >
                    <span class="text-xs">{{ item.accountNo }}</span>
                  </div>
                </div>
              </template>

              <!-- cashbank -->
              <template #[`item.cashbankName`]="{ item }">
                <div class="d-flex flex-column ms-3">
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                  >
                    {{ item.cashbankName }}
                  </span>
                  <span class="text-xs">
                    {{ item.cashbankCode }}
                  </span>
                </div>
              </template>

              <!-- payment -->
              <template #[`item.payment`]="{ item }">
                <div class="d-flex align-center">
                  <v-avatar
                    v-if="item.paymentChannelName"
                    color="#e6e6e6"
                    size="30"
                  >
                    <v-img
                      :src="
                        require(`@/assets/images/logos/bank_logo/${item.payImage}_logo.png`)
                      "
                    ></v-img>
                    <!-- <v-img
                      :src="require(getImg(item.paymentChannelName))"
                    ></v-img> -->
                  </v-avatar>
                  <span v-else> - </span>
                  <div class="d-flex flex-column ms-3">
                    <span
                      class="
                        d-block
                        text--primary
                        font-weight-semibold
                        text-truncate
                      "
                      >{{ item.subPaymentChannelName }}</span
                    >
                  </div>
                </div>
              </template>

              <template #[`item.cutOff`]="{ item }">
                {{ item.startCutOffTime }} s/d {{ item.endCutOffTime }}
              </template>

              <template #[`item.AutoCorrect`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgAutoCorrection == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgAutoCorrection == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgAutoCorrection == "Y" ? "YES" : "NO" }}
                </v-chip>
              </template>

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
                          v-show="showEdit || showDelete"
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
      <v-col id="target-table" cols="12" md="12"> </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import Form from "vform";
import {
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClockTimeFourOutline,
  mdiClose,
  mdiDelete,
  mdiFormatListBulleted,
  mdiMagnify,
  mdiPlus,
} from "@mdi/js";
import { dateFormat, isInArray } from "../../../constan";
import { required } from "@core/utils/validation";
import axios from "@axios";
import themeConfig from "@themeConfig";
import AppAutocompliteCashbank from "@core/components/app-autocomplite-ou/AppAutocompliteCashbank.vue";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import "../../styles/textstyle.css";

Vue.use(VueScrollTo);

export default {
  name: "Child_List",
  components: {
    AppAutocompliteCashbank,
    AppCardLoader,
  },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      imgName: "",
      currentPage: 1,
      cashBank: themeConfig.labeling.cashBank,

      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      cashbankList: [],
      paymentChannelList: [],
      subPaymentChannelList: [],
      search: "",
      formData: false,
      formEdit: false,
      isDialogVisible: false,
      menuStartCutOffTime: false,
      menuEndCutOffTime: false,
      showAdd:
        isInArray(
          "addMerchantIdentity",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray(
          "editMerchantIdentity",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray(
          "removeMerchantIdentity",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      validators: {
        required,
      },
      filterForm: new Form({
        mid: "",
        projectName: "",
      }),
      form: new Form({
        id: "",
        mid: "",
        projectName: "",
        cashbankId: -99,
        mdrFee: 0,
        mdrSell: 0,
        paymentChannelId: -99,
        subPaymentChannelId: -99,
        startCutOffTime: "00:00",
        endCutOffTime: "23:59",
        flgAutoCorrection: "Y",
        dueDate: 0,
        flgInbound: "Y",
        flgBankReconcile: "Y",
      }),
      icons: {
        mdiMagnify,
        mdiPlus,
        mdiFormatListBulleted,
        mdiClipboardEditOutline,
        mdiDelete,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
        mdiClockTimeFourOutline,
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
          text: "Project",
          value: "projectName",
          width: "200px",
        },
        {
          text: "Account",
          value: "accountName",
          width: "250px",
        },
        {
          text: "Cash/Bank",
          value: "cashbankName",
          width: "200px",
        },
        {
          text: "MID",
          value: "mid",
          width: "200px",
        },
        {
          text: "MDR Sell(%)",
          value: "mdrSell",
          width: "150px",
          align: "right",
        },
        {
          text: "MDR Charge Fee(%)",
          value: "mdrFee",
          width: "160px",
          align: "right",
        },
        {
          text: "Payment Method",
          value: "payment",
          width: "200px",
        },
        {
          text: "Cut Off Time",
          value: "cutOff",
          width: "200px",
        },
        {
          text: "Auto Correction",
          value: "AutoCorrect",
          width: "150px",
          align: "center",
        },
        {
          text: "Internal Settlement",
          value: "flgInbound",
          width: "200px",
          align: "center",
        },
      ],
    };
  },
  mounted() {
    this.getCashBankList();
    this.getPaymentChannel();
    this.getSubPaymentChannel();
    this.refreshData();
    // this.getImg
  },
  methods: {
    confirmFilter() {
      this.currentPage = 1;
      this.ofset = 0;
      this.refreshData();
    },
    getImg(codeImg) {
      try {
        const image = require(`@/assets/images/logos/bank_logo/${codeImg}_logo.png`);

        // do something
      } catch (e) {
        const image = require(`@/assets/images/logos/bank_logo/CASH_logo.png`);
        return image;
        // do something else
      }
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
    closeFormFee() {
      this.formFeeDisbursementPartner = false;
      this.formFee.reset();
      this.formFee.clear();
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
          `${themeConfig.app.api_master}/merchant-identity/add`,
          {
            mid: this.form.mid,
            projectName: this.form.projectName,
            cashbankId: parseInt(this.form.cashbankId),
            mdrFee: parseFloat(this.form.mdrFee),
            mdrSell: parseInt(this.form.mdrSell),
            subPaymentChannelId: parseInt(this.form.subPaymentChannelId),
            startCutOffTime:
              this.form.startCutOffTime.length == 8
                ? this.form.startCutOffTime
                : this.form.startCutOffTime + ":00",
            endCutOffTime:
              this.form.endCutOffTime.length == 8
                ? this.form.endCutOffTime
                : this.form.endCutOffTime + ":59",
            flgAutoCorrection: this.form.flgAutoCorrection,
            dueDate: parseInt(this.form.dueDate),
            flgInbound: this.form.flgInbound,
            flgBankReconcile: this.form.flgBankReconcile,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.formData = false;
          this.refreshData();
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
          `${themeConfig.app.api_master}/merchant-identity/edit`,
          {
            id: this.form.id,
            mid: this.form.mid,
            projectName: this.form.projectName,
            cashbankId: parseInt(this.form.cashbankId),
            mdrFee: parseFloat(this.form.mdrFee),
            mdrSell: parseFloat(this.form.mdrSell),
            subPaymentChannelId: parseInt(this.form.subPaymentChannelId),
            startCutOffTime:
              this.form.startCutOffTime.length == 8
                ? this.form.startCutOffTime
                : this.form.startCutOffTime + ":00",
            endCutOffTime:
              this.form.endCutOffTime.length == 8
                ? this.form.endCutOffTime
                : this.form.endCutOffTime + ":59",
            flgAutoCorrection: this.form.flgAutoCorrection,
            dueDate: parseInt(this.form.dueDate),
            flgInbound: this.form.flgInbound,
            flgBankReconcile: this.form.flgBankReconcile,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.formData = false;
          this.refreshData();
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
    removeData(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/merchant-identity/remove/${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.refreshData();
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
    getCashBankList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/cashbank/list`,
          {
            keyword: "",
            bankCode: "",
            active: "Y",
            limit: 1000,
            offset: 0,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.cashbankList = response.data.result;
            this.cashbankList.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.cashbankList[index].bankCode +
                    "_logo.png")
                ) {
                  this.cashbankList[index].logoImage =
                    this.cashbankList[index].bankCode;
                }
              } catch (e) {
                this.cashbankList[index].logoImage = "NONE";
              }
            });
          } else {
            this.cashbankList = [];
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
    getPaymentChannel() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/payment-channel/list`, config)
        .then((response) => {
          this.getCountData();
          if (response.data.result !== null)
            return (this.paymentChannelList = response.data.result);
          this.paymentChannelList = [];
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
    getSubPaymentChannel() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/payment-channel/sub-payment-channel/list`,
          config
        )
        .then((response) => {
          this.getCountData();
          if (response.data.result !== null) {
            this.subPaymentChannelList = response.data.result;

            this.subPaymentChannelList.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.subPaymentChannelList[index].paymentChannelCode +
                    "_logo.png")
                ) {
                  this.subPaymentChannelList[index].logoImage =
                    this.subPaymentChannelList[index].paymentChannelCode;
                }
                // do something
              } catch (e) {
                this.subPaymentChannelList[index].logoImage = "NONE";
                // do something else
              }
            });
          } else {
            this.subPaymentChannelList = [];
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
    getPaymentChanelById() {
      for (var i = 0; i < this.subPaymentChannelList.length; i++) {
        var obj = this.subPaymentChannelList[i];
        if (obj.id == this.form.subPaymentChannelId) {
          this.form.paymentChannelId = obj.paymentChannelId;
          for (var i = 0; i < this.paymentChannelList.length; i++) {
            var objSub = this.paymentChannelList[i];
            if (objSub.id == this.form.paymentChannelId) {
              this.form.mdrSell = objSub.mdrSell;
              this.form.mdrFee = objSub.mdrFee;
              break;
            }
          }
          break;
        }
      }
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
          `${themeConfig.app.api_master}/merchant-identity/count-list-advance?mid=${this.filterForm.mid}&projectName=${this.filterForm.projectName}`,
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
          `${themeConfig.app.api_master}/merchant-identity/list-advance?mid=${this.filterForm.mid}&projectName=${this.filterForm.projectName}&limit=${this.itemPerPage}&offset=${this.ofset}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.getCountData();
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.mainData.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainData[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainData[index].logoImage =
                    this.mainData[index].bankCode;
                }
                // do something
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
                // do something else
              }
            });
            this.mainData.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainData[index].paymentChannelName +
                    "_logo.png")
                ) {
                  this.mainData[index].payImage =
                    this.mainData[index].paymentChannelName;
                }
                // do something
              } catch (e) {
                this.mainData[index].payImage = "NONE";
                // do something else
              }
            });
          } else {
            this.mainData = [];
          }
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
