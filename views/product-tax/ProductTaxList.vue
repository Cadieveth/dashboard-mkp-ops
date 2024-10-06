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
    <v-row>
      <v-col cols="12" md="12">
        <v-card>
          <v-card-title class="align-start">
            <span>Product Tax</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="12" class="pb-0">
                <v-text-field
                  v-model="filterForm.keyword"
                  label="Keyword"
                  dense
                  placeholder="Insert Keyword"
                  hide-details
                  class="mb-0"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <app-autocomplite-ou
                  :form-value.sync="filterForm.ouId"
                  :read-only="false"
                ></app-autocomplite-ou>
              </v-col>
              <v-col cols="12" md="6" class="pb-0 mt-2">
                <v-select
                  :items="productList"
                  v-model="filterForm.productId"
                  item-text="productName"
                  placeholder="Select Product"
                  item-value="id"
                  label="Product"
                  hide-details="auto"
                  class="mb-0"
                  dense
                  clearable
                ></v-select>
              </v-col>
              <v-col id="target-table" cols="12" md="12" class="pb-2 mt-4">
                <v-btn small dark color="primary" @click="confirmFilter()">
                  <v-icon dark left>
                    {{ icons.mdiMagnify }}
                  </v-icon>
                  Filter
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
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
                <v-card-title class="font-weight-bold">
                  Input Product Tax
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
                        <v-col cols="12" md="12" class="pb-0">
                          <app-autocomplite-ou
                            :form-value.sync="form.ouId"
                            :read-only="formEdit"
                          ></app-autocomplite-ou>
                        </v-col>
                        <v-col cols="12" md="12" class="pb-0 mt-2">
                          <v-select
                            :items="productList"
                            v-model="form.productId"
                            item-text="productName"
                            item-value="id"
                            label="Product"
                            hide-details="auto"
                            class="mb-0"
                            dense
                            clearable
                            :readonly="formEdit"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 mt-2">
                          <v-select
                            :items="taxList"
                            v-model="form.taxId"
                            item-text="taxName"
                            item-value="id"
                            label="Tax"
                            hide-details="auto"
                            class="mb-0"
                            dense
                            clearable
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 mt-2">
                          <v-select
                            :items="flgIncList"
                            v-model="form.flgIncTax"
                            item-text="text"
                            item-value="value"
                            label="Tax Type"
                            hide-details="auto"
                            class="mb-0"
                            dense
                            clearable
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="6" class="mt-2">
                          <v-menu
                            v-model="dateFrom"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="form.dateFrom"
                                label="Active From"
                                :append-icon="icons.mdiCalendar"
                                readonly
                                dense
                                hide-details
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="form.dateFrom"
                              color="primary"
                              @input="dateFrom = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" md="6" class="mt-2">
                          <v-menu
                            v-model="dateTo"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                v-model="form.dateTo"
                                label="Active To"
                                :append-icon="icons.mdiCalendar"
                                readonly
                                dense
                                hide-details
                                v-bind="attrs"
                                v-on="on"
                                clearable
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="form.dateTo"
                              color="primary"
                              @input="dateTo = false"
                            ></v-date-picker>
                          </v-menu>
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
              <!-- headers -->
              <template #[`header.ou`]>
                {{ ou }}
              </template>
              <!-- format tanggal-->
              <template #[`item.from`]="{ item }">
                {{ dateFormat(item.dateFrom) }}
              </template>

              <!-- format tanggal-->
              <template #[`item.to`]="{ item }">
                {{ dateFormat(item.dateTo) }}
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

              <!-- Produk -->
              <template #[`item.produk`]="{ item }">
                <div>
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.productName }}</span
                  >
                  <span class="text-xs">{{ item.productCode }}</span>
                </div>
              </template>

              <!-- Tax -->
              <template #[`item.tax`]="{ item }">
                <div>
                  <span
                    class="
                      d-block
                      text--primary
                      font-weight-semibold
                      text-truncate
                    "
                    >{{ item.taxCode }} - {{ item.taxName }}</span
                  >
                </div>
              </template>

              <!-- Status Flag sell-->
              <template #[`item.flgIncTax`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgIncTax == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgIncTax == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgIncTax == "Y" ? "INCLUDE" : "EXCLUDE" }}
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
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import { required } from "@core/utils/validation";
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
import Form from "vform";
import { dateFormat, isInArray } from "../../../constan";
import moment from "moment";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    AppAutocompliteOu,
    AppCardLoader,
  },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      ou: themeConfig.labeling.ou,
      formData: false,
      formEdit: false,
      isDialogVisible: false,
      dateFrom: false,
      dateTo: false,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      showAdd:
        isInArray("addProductTax", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray("editProductTax", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray("removeProductTax", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",

      mainData: [],
      productList: [],
      ouList: [],
      taxList: [],
      flgIncList: [
        {
          value: "Y",
          text: "INCLUDE",
        },
        {
          value: "N",
          text: "EXCLUDE",
        },
      ],
      headers: [
        {
          text: "",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "OU",
          value: "ou",
          width: "200px",
        },
        {
          text: "Product",
          value: "produk",
          width: "200px",
        },
        {
          text: "Tax",
          value: "tax",
          width: "200px",
        },
        {
          text: "Include Tax",
          value: "flgIncTax",
          width: "150px",
        },
        {
          text: "Active From",
          value: "from",
          width: "200px",
        },
        {
          text: "Active To",
          value: "to",
          width: "200px",
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

      filterForm: new Form({
        keyword: "",
        ouId: -99,
        productId: -99,
      }),
      form: new Form({
        id: "",
        ouId: -99,
        productId: -99,
        taxId: -99,
        flgIncTax: "",
        dateFrom: moment().format("YYYY-MM-DD"),
        dateTo: "",
      }),
    };
  },
  mounted() {
    this.$root.$on("appAutocompliteOu", (msg) => {
      if (this.formData == true) {
        this.form.ouId = msg;
      } else if (this.formData == false) {
        this.filterForm.ouId = msg;
      }
    });
    this.getProductList();
    this.getTaxList();
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
    getProductList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/product/list`,
          {
            keyword: "",
            active: "",
            limit: 9999,
            offset: 0,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.productList = response.data.result);
          this.productList = [];
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
    getTaxList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/tax/list`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.taxList = response.data.result);
          this.taxList = [];
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
            `${themeConfig.app.api_master}/product-tax/add`,
            {
              ouId: this.form.ouId == "" ? -99 : parseInt(this.form.ouId),
              productId:
                this.form.productId == "" ? -99 : parseInt(this.form.productId),
              taxId: this.form.taxId == "" ? -99 : parseInt(this.form.taxId),
              flgIncTax: this.form.flgIncTax == "" ? -99 : this.form.flgIncTax,
              dateFrom: moment(this.form.dateFrom).format("YYYYMMDD"),
              dateTo:
                this.form.dateTo == ""
                  ? "30001231"
                  : moment(this.form.dateTo).format("YYYYMMDD"),
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
            `${themeConfig.app.api_master}/product-tax/edit`,
            {
              id: this.form.id,
              ouId: this.form.ouId == "" ? -99 : parseInt(this.form.ouId),
              productId:
                this.form.productId == "" ? -99 : parseInt(this.form.productId),
              taxId: this.form.taxId == "" ? -99 : parseInt(this.form.taxId),
              flgIncTax: this.form.flgIncTax == "" ? -99 : this.form.flgIncTax,
              dateFrom: moment(this.form.dateFrom).format("YYYYMMDD"),
              dateTo:
                this.form.dateTo == ""
                  ? "30001231"
                  : moment(this.form.dateTo).format("YYYYMMDD"),
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
        .get(`${themeConfig.app.api_master}/product-tax/remove/${id}`, config)
        .then((response) => {
          this.refreshData();
          this.notif("success", "Success", response.data.meta.message);
          this.isDialogVisible = false;
        })
        .catch((e) => {
          this.notif("error", "Failed", e);
        });
    },
    getCountData() {
      const ouId = this.form.ouId == "" ? -99 : parseInt(this.form.ouId);
      const productId =
        this.form.productId == "" ? -99 : parseInt(this.form.productId);
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/product-tax/count?keyword=${this.filterForm.keyword}&ouId=${ouId}&productId=${productId}`,
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
    refreshData() {
      const ouId = this.form.ouId == "" ? -99 : parseInt(this.form.ouId);
      const productId =
        this.form.productId == "" ? -99 : parseInt(this.form.productId);
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/product-tax/list?keyword=${this.filterForm.keyword}&ouId=${ouId}&productId=${productId}&limit=${this.itemPerPage}&offset=${this.ofset}`,
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
