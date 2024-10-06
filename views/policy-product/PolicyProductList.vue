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
      <v-col cols="12" class="mb-0">
        <v-card>
          <v-card-title> Policy Product </v-card-title>
          <v-card-text>
            <v-autocomplete
              v-model="filterForm.userId"
              :items="userList"
              dense
              item-text="fullName"
              placeholder="Select User"
              item-value="id"
              label="User"
              hide-details="auto"
              class="mb-0 mt-6"
              @change="refreshDataAvailable(), refreshDataUnavailable()"
            ></v-autocomplete>
          </v-card-text>
          <v-row no-gutters class="mb-2">
            <v-col cols="12" md="6" class="">
              <v-card flat>
                <v-card-title>
                  <span class="font-weight-bold">Product Unavailable</span>

                  <v-spacer></v-spacer>
                  <v-btn
                    v-show="showAdd"
                    small
                    dark
                    color="primary"
                    @click="addData()"
                  >
                    <v-icon dark left>
                      {{ icons.mdiPlus }}
                    </v-icon>
                    Add Policy
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="headersUn"
                    :items="productListUn"
                    :items-per-page="itemPerPage"
                    :footer-props="{
                      'items-per-page-options': [25, 50, 100],
                    }"
                    disable-pagination
                    fixed-header
                    dense
                    v-model="selected"
                    item-key="id"
                    show-select
                  >
                    <template #[`item.productName`]="{ item }">
                      <div class="d-flex align-center">
                        <div class="d-flex flex-column ms-3">
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
                      </div>
                    </template>

                    <!-- Sub Category -->
                    <template #[`item.subCategory`]="{ item }">
                      <div>
                        <span
                          class="
                            d-block
                            text--primary
                            font-weight-semibold
                            text-truncate
                          "
                          >{{ item.subCtgrProductName }}</span
                        >
                        <span class="text-xs">{{
                          item.subCtgrProductCode
                        }}</span>
                      </div>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" class="mb-0">
              <v-card flat>
                <v-card-title class="">
                  <span class="font-weight-bold">Product Available</span>
                </v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="productList"
                    :items-per-page="itemPerPage"
                    :footer-props="{
                      'items-per-page-options': [25, 50, 100],
                    }"
                    disable-pagination
                    fixed-header
                    dense
                  >
                    <template #[`item.productName`]="{ item }">
                      <div class="d-flex align-center">
                        <div class="d-flex flex-column ms-3">
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
                      </div>
                    </template>

                    <!-- Sub Category -->
                    <template #[`item.subCategory`]="{ item }">
                      <div>
                        <span
                          class="
                            d-block
                            text--primary
                            font-weight-semibold
                            text-truncate
                          "
                          >{{ item.subCtgrProductName }}</span
                        >
                        <span class="text-xs">{{
                          item.subCtgrProductCode
                        }}</span>
                      </div>
                    </template>

                    <template #[`item.actions`]="{ item }">
                      <v-tooltip bottom color="error">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            x-small
                            icon
                            color="error"
                            v-bind="attrs"
                            v-on="on"
                            v-show="showDelete"
                            @click="confirmDialog(item.id)"
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
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import axios from "@axios";
import themeConfig from "@themeConfig";
import Form from "vform";
import router from "@/router";
import { mdiDelete, mdiPlus } from "@mdi/js";
import { isInArray } from "../../../constan";

export default {
  name: "ChildList",
  components: { AppCardLoader },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      // role
      showAdd:
        isInArray("addPolicyProduct", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray(
          "removePolicyProduct",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      itemPerPage: 25,
      isDialogVisible: false,
      productList: [],
      productListUn: [],
      selected: [],
      userList: [],
      filterForm: new Form({
        userId: -99,
      }),
      icons: {
        mdiDelete,
        mdiPlus,
      },
      headersUn: [
        {
          text: "Product",
          value: "productName",
        },
        {
          text: "Sub Category",
          value: "subCategory",
        },
        {
          text: "Brand",
          value: "brandName",
        },
      ],
      headers: [
        {
          text: "Actions",
          align: "center",
          value: "actions",
          sortable: false,
          width: "50px",
        },
        {
          text: "Product",
          value: "productName",
        },
        {
          text: "Sub Category",
          value: "subCategory",
        },
        {
          text: "Brand",
          value: "brandName",
        },
      ],
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    addData() {
      if (this.selected.length > 0) {
        const policyProductList = [];
        this.selected.forEach((element) => {
          policyProductList.push(element.id);
        });
        this.isDialogVisible = true;
        const config = {
          headers: {
            Authorization: `Bearer ${this.$session.get("accessToken")}`,
            "Access-Control-Allow-Origin": "*",
          },
        };
        axios
          .post(
            `${themeConfig.app.api_master}/policy/product/add`,
            {
              userId: this.filterForm.userId,
              policyProductList: policyProductList,
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.selected = [];
            this.refreshDataUnavailable();
            this.refreshDataAvailable();
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
      } else {
        this.notif("error", "Failed", "Please select cash/bank first!.");
      }
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
          }, 500);
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
        .get(
          `${themeConfig.app.api_master}/policy/product/remove/${this.filterForm.userId}/${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.notif("success", "Success", response.data.meta.message);
          this.refreshDataAvailable();
          this.refreshDataUnavailable();
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
    getUserList() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/users/list`,
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
            return (this.userList = response.data.result);
          this.userList = [];
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
    refreshDataAvailable() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/policy/product/list/available/${this.filterForm.userId}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          // if (response.data.result !== null)
          //   return (this.cashbankList = response.data.result);

          // this.cashbankList = [];
          if (response.data.result !== null) {
            this.productList = response.data.result;
          } else {
            this.productList = [];
          }
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
    refreshDataUnavailable() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/policy/product/list/unavailable/${this.filterForm.userId}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.productListUn = response.data.result;
          } else {
            this.productListUn = [];
          }
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
