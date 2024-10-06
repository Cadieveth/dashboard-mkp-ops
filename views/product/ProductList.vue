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
            <span>Product</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field
                  v-model="filterForm.keyword"
                  label="Keyword"
                  placeholder="Insert Keyword"
                  dense
                  hide-details
                  class="mb-0"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-select
                  :items="activeList"
                  v-model="filterForm.active"
                  placeholder="Select Status"
                  item-text="text"
                  item-value="value"
                  label="Status"
                  hide-details="auto"
                  class="mb-0"
                  dense
                ></v-select>
              </v-col>
              <v-col id="target-table" cols="12" md="12">
                <v-btn small dark color="primary" @click="confirmFilter()">
                  <v-icon dark left>
                    {{ icons.mdiMagnify }}
                  </v-icon>
                  Filter
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-title class="my-n2">
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
            <v-dialog v-model="formData" persistent width="600">
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
                  Input Product
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
                            v-model="form.productCode"
                            label="Code"
                            :rules="[validators.required]"
                            dense
                            placeholder="Insert Product Code"
                            hide-details="auto"
                            class="mb-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="form.productName"
                            label="Name"
                            placeholder="Insert Product Name"
                            :rules="[validators.required]"
                            dense
                            hide-details="auto"
                            class="mb-0"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <app-autocomplite-category-product
                            :form-value.sync="form.ctgrProductId"
                            :category-type="'addProductForm'"
                          >
                          </app-autocomplite-category-product>
                        </v-col>
                        <v-col cols="12" md="6">
                          <app-autocomplite-sub-category-product
                            :form-value.sync="form.subCtgrProductId"
                            :sub-type="'addProductForm'"
                          >
                          </app-autocomplite-sub-category-product>
                        </v-col>
                        <v-col cols="12" md="6">
                          <app-autocomplite-brand
                            :form-value.sync="form.brandId"
                          >
                          </app-autocomplite-brand>
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
              hide-default-footer
              disable-pagination
              fixed-header
              dense
            >
              <!-- Status Flag sell-->
              <template #[`item.flgSell`]="{ item }">
                <v-chip
                  small
                  :class="`${item.flgSell == 'Y' ? 'success' : 'error'}--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgSell == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgSell == "Y" ? "YA" : "TIDAK" }}
                </v-chip>
              </template>

              <!-- Status Product-->
              <template #[`item.active`]="{ item }">
                <v-chip
                  small
                  :class="`${item.active == 'Y' ? 'success' : 'error'}--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.active == 'Y' ? 'success' : 'error'"
                >
                  {{ item.active == "Y" ? "AKTIF" : "NON AKTIF" }}
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
                      v-show="showEdit"
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
import Form from "vform";
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
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import { required } from "@core/utils/validation";
import AppAutoCompliteSubCategoryProduct from "@/@core/components/app-autocomplite-ou/AppAutoCompliteSubCategoryProduct.vue";
import AppAutocompliteCategoryProduct from "@/@core/components/app-autocomplite-ou/AppAutocompliteCategoryProduct.vue";
import AppAutoCompliteBrand from "@/@core/components/app-autocomplite-ou/AppAutoCompliteBrand.vue";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    AppAutocompliteCategoryProduct,
    "app-autocomplite-sub-category-product": AppAutoCompliteSubCategoryProduct,
    "app-autocomplite-brand": AppAutoCompliteBrand,
    AppCardLoader,
  },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      formData: false,
      formEdit: false,
      isDialogVisible: false,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      showView:
        isInArray("viewProduct", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showAdd:
        isInArray("addProduct", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray("editProduct", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray("removeProduct", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",

      mainData: [],
      ctgrProductLis: [],
      subCtgrProductList: [],
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Product Code",
          value: "productCode",
          width: "200px",
        },
        {
          text: "Name",
          value: "productName",
          width: "300px",
        },
        {
          text: "Category",
          value: "ctgrProductName",
          width: "200px",
        },
        {
          text: "Sub Category",
          value: "subCtgrProductName",
          width: "200px",
        },
        {
          text: "Brand Name",
          value: "brandName",
          width: "300px",
        },
        {
          text: "Sell",
          value: "flgSell",
          width: "100px",
        },
        {
          text: "Status",
          value: "active",
          width: "100px",
        },
      ],
      activeList: [
        {
          value: "",
          text: "All Status",
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
        active: "",
      }),
      form: new Form({
        id: "",
        productCode: "",
        productName: "",
        ctgrProductId: -99,
        subCtgrProductId: -99,
        brandId: -99,
        flgSell: "Y",
      }),
    };
  },
  mounted() {
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
      this.form.clear();
      this.formData = true;
      this.form.fill(data);
      setTimeout(() => {
        this.$root.$emit("appAutocompliteAddProductForm", data.ctgrProductId);
      }, 100);
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
            `${themeConfig.app.api_master}/product/add`,
            {
              productCode: this.form.productCode,
              productname: this.form.productName,
              ctgrProductId: this.form.ctgrProductId,
              subCtgrProductId: this.form.subCtgrProductId,
              brandId: this.form.brandId,
              flgSell: this.form.flgSell,
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
            `${themeConfig.app.api_master}/product/edit`,
            {
              id: this.form.id,
              productCode: this.form.productCode,
              productname: this.form.productName,
              ctgrProductId: this.form.ctgrProductId,
              subCtgrProductId: this.form.subCtgrProductId,
              brandId: this.form.brandId,
              flgSell: this.form.flgSell,
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
        .get(`${themeConfig.app.api_master}/product/remove/${id}`, config)
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
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/product/count`,
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
        .post(
          `${themeConfig.app.api_master}/product/list`,
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
