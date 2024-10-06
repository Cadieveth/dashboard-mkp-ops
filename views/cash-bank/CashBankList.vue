<template>
  <div @keydown.esc="closeForm()">
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
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span>{{ cashBank }} </span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" class="pb-0">
                <v-text-field
                  v-model="formFilter.keyword"
                  label="Keyword"
                  placeholder="Insert Keyword"
                  class="mb-0"
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="pb-0">
                <v-text-field
                  v-model="formFilter.bankCode"
                  label="Account No"
                  placeholder="Insert Account No"
                  class="mb-0"
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="mb-0">
                <v-select
                  :items="activeList"
                  v-model="formFilter.active"
                  item-text="text"
                  placeholder="Select Cash/Bank Status"
                  item-value="value"
                  hide-details="auto"
                  class="mb-0"
                  label="Status"
                  dense
                ></v-select>
              </v-col>
              <v-col cols="12" md="12">
                <v-btn small dark color="primary" @click="refreshData()">
                  <v-icon dark left>
                    {{ icons.mdiMagnify }}
                  </v-icon>
                  Filter
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="formData" persistent width="800">
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
                  {{ formEdit ? "Update Cash/Bank" : "Add Cash/Bank" }}
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
                            v-model="form.cashbankCode"
                            label="Cash/Bank Code"
                            placeholder="Insert Cash/Bank Code"
                            :rules="[validators.required]"
                            dense
                            hide-details="auto"
                            class="mb-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="form.cashbankName"
                            label="Cash/Bank Name"
                            placeholder="Insert Cash/Bank Name"
                            :rules="[validators.required]"
                            dense
                            hide-details="auto"
                            class="mb-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            :items="flagCashBankList"
                            v-model="form.flgCashBank"
                            placeholder="Select Flag Cash/Bank"
                            :rules="[validators.required]"
                            item-text="propKey"
                            item-value="code"
                            hide-details="auto"
                            class="mb-0"
                            label="Flag Cash/Bank"
                            dense
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <app-autocomplite-bank
                            :value-bank.sync="form.bankCode"
                          ></app-autocomplite-bank>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="form.accountNo"
                            label="Account No"
                            placeholder="Insert Account No"
                            :rules="[validators.required]"
                            @keypress="hanyaAngka($event)"
                            dense
                            hide-details="auto"
                            class="mb-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="form.accountName"
                            placeholder="Insert Account Name"
                            label="Name"
                            :rules="[validators.required]"
                            dense
                            hide-details="auto"
                            class="mb-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                          <v-autocomplete
                            :items="coaList"
                            v-model="form.coaId"
                            item-text="coaDesc"
                            placeholder="Select Chart of Account"
                            item-value="id"
                            label="Chart of Account"
                            hide-details="auto"
                            class="mb-0"
                            dense
                            clearable
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-textarea
                            label="Remark"
                            v-model="form.remark"
                            placeholder="Add Remark"
                            hide-details="auto"
                            dense
                            outlined
                            class="mb-0"
                          ></v-textarea>
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
            <v-data-table
              :headers="headers"
              :items="mainData"
              :footer-props="{
                'items-per-page-options': [25, 50, 100],
              }"
              fixed-header
              dense
            >
              <!-- Akun-->
              <template #[`item.noAkun`]="{ item }">
                <div class="d-flex align-center">
                  <v-tooltip bottom colors="primary">
                    <template #activator="{ on, attrs }">
                      <v-avatar
                        color="#e6e6e6"
                        v-bind="attrs"
                        v-on="on"
                        size="30"
                      >
                        <v-img
                          :src="
                            require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                          "
                        >
                        </v-img>
                      </v-avatar>
                    </template>
                    {{ item.bankCode }}
                  </v-tooltip>
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

              <!-- coaDesc -->
              <template #[`item.coaDesc`]="{ item }">
                <div class="d-flex align-center">
                  {{ item.coaDesc }}
                </div>
              </template>

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
                      @click="confirmDialogActive(item.id, item.active)"
                      v-on="on"
                      v-show="showActive"
                    >
                      <v-icon>
                        {{
                          item.active == "Y"
                            ? icons.mdiLock
                            : icons.mdiLockOpenVariantOutline
                        }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{
                    item.active == "Y" ? "Inactivate" : "Activate"
                  }}</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="12"> </v-col>
    </v-row>
  </div>
</template>

<script>
import Form from "vform";
import axios from "@axios";
import themeConfig from "@themeConfig";
import {
  mdiBankOutline,
  mdiCash,
  mdiCashRegister,
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardEditOutline,
  mdiClose,
  mdiLock,
  mdiLockOpenVariantOutline,
  mdiMagnify,
  mdiPlus,
} from "@mdi/js";
import { required } from "@core/utils/validation";
import { isInArray } from "../../../constan";
import AppAutocompliteBank from "@core/components/app-autocomplite-ou/AppAutocompliteBank";
import router from "@/router";
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";

export default {
  name: "Child",
  components: {
    AppAutocompliteBank,
    AppCardLoader,
  },
  data() {
    return {
      cashBank: themeConfig.labeling.cashBank,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      icons: {
        mdiClipboardEditOutline,
        mdiCash,
        mdiCashRegister,
        mdiBankOutline,
        mdiLock,
        mdiLockOpenVariantOutline,
        mdiMagnify,
        mdiPlus,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
      },
      formData: false,
      formEdit: false,
      isDialogVisible: false,
      showAdd:
        isInArray("addCashbank", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray("editCashbank", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showActive:
        isInArray("editActiveCashbank", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      bankList: [],
      coaList: [],
      mainData: [],
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Cash/Bank Code",
          value: "cashbankCode",
          width: "200px",
        },
        {
          text: "Cash/Bank Name",
          value: "cashbankName",
          width: "300px",
        },
        {
          text: "Account",
          value: "noAkun",
          width: "200px",
        },
        {
          text: "COA",
          value: "coaDesc",
          width: "200px",
        },
        {
          text: "Type",
          align: "center",
          value: "flgCashBankName",
          width: "100px",
        },
      ],
      activeList: [
        {
          value: "",
          text: "All",
        },
        {
          value: "Y",
          text: "Active",
        },
        {
          value: "N",
          text: "Non Active",
        },
      ],
      flagCashBankList: [],
      validators: {
        required,
      },
      formFilter: new Form({
        keyword: "",
        bankCode: "",
        active: "",
      }),
      form: new Form({
        id: "",
        cashbankCode: "",
        cashbankName: "",
        flgCashBank: "",
        bankCode: "",
        accountNo: "",
        accountName: "",
        remark: "",
        coaId: -99,
      }),
    };
  },
  mounted() {
    this.getCoaList();
    this.getBankList();
    this.getFlagCashBank();
    this.refreshData();
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    hanyaAngka: function ($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        // 46 is dot
        $event.preventDefault();
      }
    },
    getBankList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/combo/list?comboId=BANK`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.bankList = response.data.result);
          this.bankList = [];
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
    getFlagCashBank() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/combo/list?comboId=FLGCASHBANK`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.flagCashBankList = response.data.result);
          this.flagCashBankList = [];
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
            `${themeConfig.app.api_master}/cashbank/add`,
            {
              cashbankCode: this.form.cashbankCode,
              cashbankName: this.form.cashbankName,
              flgCashbank: this.form.flgCashBank,
              bankCode: this.form.bankCode,
              accountNo: this.form.accountNo,
              accountName: this.form.accountName,
              remark: this.form.remark,
              coaId: this.form.coaId,
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.refreshData();
            this.closeForm();
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
            `${themeConfig.app.api_master}/cashbank/edit`,
            {
              id: this.form.id,
              cashbankCode: this.form.cashbankCode,
              cashbankName: this.form.cashbankName,
              flgCashBank: this.form.flgCashBank,
              bankCode: this.form.bankCode,
              accountNo: this.form.accountNo,
              accountName: this.form.accountName,
              remark: this.form.remark,
              coaId: this.form.coaId,
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.refreshData();
            this.closeForm();
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
        .get(`${themeConfig.app.api_master}/cashbank/edit-active/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.refreshData();
          this.notif("success", "Sukses", text);
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
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
          this.notif("error", "Gagal", e.response.data.meta.message);
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
          `${themeConfig.app.api_master}/cashbank/list`,
          {
            keyword: this.formFilter.keyword,
            bankCode: this.formFilter.bankCode,
            active: this.formFilter.active,
            limit: 1000,
            offset: 0,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
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
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
              }
            });
          } else {
            this.mainData = [];
          }
          // return (this.mainData = response.data.result);
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
