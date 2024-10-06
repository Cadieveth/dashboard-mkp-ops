<template>
  <div>
    <v-row id="to-top">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h4>Warehouse</h4>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <app-autocomplite-ou-company
                  :form-value.sync="formFilter.ouId"
                  :clearable="true"></app-autocomplite-ou-company>
              </v-col>
              <v-col cols="12" md="4">
                <app-autocomplite-warehouse-type
                  :form-value.sync="formFilter.warehouseType"
                  :clearable="true"></app-autocomplite-warehouse-type>
              </v-col>
              <v-col cols="12" md="4" class="pb-0">
                <v-text-field
                  v-model="formFilter.keyword"
                  label="Keyword"
                  clearable
                  persistent-placeholder
                  placeholder="Insert Keyword"
                  dense></v-text-field>
              </v-col>
              <v-col id="target-table" cols="12" md="12" class="mt-4">
                <app-button
                  color="primary"
                  text="Filter"
                  icon-button="mdi-magnify"
                  :click="confirmFilter" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-title class="my-n2">
            <v-col md="1" sd="2">
              <v-select
                v-model="itemPerPage"
                :items="itemRow"
                label="Rows"
                class="select"></v-select>
            </v-col>
            <v-spacer></v-spacer>
            <app-button
              color="primary"
              text="Add Data"
              icon-button="mdi-plus"
              :click="goToAddWarehouse" />
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="filteredWarehouseList"
              hide-default-footer
              disable-pagination
              fixed-header
              dense>
              <template v-slot:no-data>
                <div class="text-center">{{ noDataMessage }}</div>
              </template>
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
                          v-show="showEdit || showDelete">
                          mdi-format-list-bulleted
                        </v-icon>
                      </template>
                      <span>More Info</span>
                    </v-tooltip>
                  </template>
                  <v-list dense>
                    <v-list-item
                      @click="goToEditWarehouse(item)"
                      v-show="showEdit">
                      <v-list-item-icon class="me-2 mt-1">
                        <v-icon size="18" color="warning"
                          >mdi-clipboard-edit-outline</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-content class="pt-0">
                        <v-list-item-title
                          class="warning--text"
                          style="padding-top: 10px"
                          >Edit</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click="confirmDialog(item.id)"
                      v-show="showDelete">
                      <v-list-item-icon class="me-2 mt-1">
                        <v-icon size="18" color="error"> mdi-delete </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="pt-0">
                        <v-list-item-title
                          class="error--text"
                          style="padding-top: 10px">
                          Delete
                        </v-list-item-title>
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
              v-scroll-to="'#target-table'"></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col id="target-table" cols="12"> </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import axios from "@axios";
import themeConfig from "@themeConfig";
import { required } from "@core/utils/validation";
import { isInArray } from "../../../constan";
import { ref, watch } from "@vue/composition-api";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import AppAutocompliteOuCompany from "@/@core/components/app-autocomplite-for-filter/AppAutocompliteOuCompany.vue";
import AppAutocompliteWarehouseType from "@/@core/components/app-autocomplite-warehouse/AppAutocompliteWarehouseType.vue";
import AppButton from "@/@core/components/app-button/AppButton.vue";
import { get, post } from "@/services/apiServices";

Vue.use(VueScrollTo);

async function getWarehouseList(context) {
  try {
    const accessToken = context.$session.get("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.get(
      `${themeConfig.app.api_master}/warehouse/list`,
      {
        params: {
          keyword: context.formFilter.keyword,
          warehouseType: context.formFilter.warehouseType,
          ouId: context.formFilter.ouId,
          active: "Y",
          limit: context.itemPerPage,
          offset: (context.currentPage - 1) * context.itemPerPage,
        },
        headers: config.headers,
      }
    );

    if (response.data.result !== null && response.data.result.length > 0) {
      context.filteredWarehouseList = response.data.result;
    } else {
      context.filteredWarehouseList = [];
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      context.$router.push({ name: "auth-login" });
    } else {
      console.error("Error while fetching warehouse list:", error);
      console.log("Error response:", error.response);
      context.filteredWarehouseList = [];
    }
  }
}

async function getWarehouseCount(context) {
  try {
    const accessToken = context.$session.get("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.get(
      `${themeConfig.app.api_master}/warehouse/count`,
      {
        params: {
          keyword: context.formFilter.keyword,
          ouId: context.formFilter.ouId,
          active: "Y",
        },
        headers: config.headers,
      }
    );

    context.totalPages = Math.ceil(response.data.result / context.itemPerPage);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      context.$router.push({ name: "auth-login" });
    } else {
      console.error("Error while fetching warehouse count:", error);
      console.log("Error response:", error.response);
    }
  }
}

export default {
  name: "childParentList",
  components: {
    AppAutocompliteOu,
    AppCardLoader,
    AppAutocompliteOuCompany,
    AppAutocompliteWarehouseType,
    AppButton,
  },
  setup() {
    const activator = ref(null);
    const attach = ref(null);
    const colors = [
      "primary",
      "secondary",
      "success",
      "info",
      "warning",
      "error",
    ];
    const editing = ref();
    const editingIndex = ref(-1);
    const items = ref([
      {
        text: "Foo",
      },
    ]);
    const nonce = ref(1);
    const menu = ref(false);
    const model = ref([]);
    const search = ref();
    const edit = (index, item) => {
      if (!editing.value) {
        editing.value = item;
        editingIndex.value = index;
      } else {
        editing.value = null;
        editingIndex.value = -1;
      }
    };
    const filter = (item, queryText, itemText) => {
      if (item.header) return false;

      const hasValue = (val) => (val != null ? val : "");

      const text = hasValue(itemText);
      const query = hasValue(queryText);

      return (
        text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      );
    };

    watch(model, (val, prev) => {
      if (val.length === prev.length) return;

      model.value = val.map((v) => {
        if (typeof v === "string") {
          v = {
            text: v,
          };

          items.value.push(v);

          nonce.value += 1;
        }

        return v;
      });
    });

    return {
      items,
      activator,
      attach,
      editing,
      editingIndex,
      menu,
      search,
      model,
      colors,
      nonce,

      edit,
      filter,
    };
  },
  data() {
    return {
      showButton: false,
      previousScroll: 0,
      currentPage: 1,
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      warehouseList: [],
      selectedLocation: "",
      defaultWarehouseType: "",
      selectedWarehouseType: "",
      filteredWarehouseList: [],
      noDataMessage: "No data available",
      showEdit:
        isInArray("editUser", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray("removeUser", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Warehouse Code",
          value: "warehouseCode",
          width: "150px",
        },
        {
          text: "Name",
          value: "warehouseName",
          width: "300px",
        },
        {
          text: "Type",
          value: "warehouseType",
          width: "150px",
        },
        {
          text: "Location Business unit",
          value: "ouName",
          width: "200px",
        },
        {
          text: "Country",
          value: "country",
          width: "150px",
        },
        {
          text: "Province",
          value: "province",
          width: "150px",
        },
        {
          text: "City",
          value: "city",
          width: "150px",
        },
        {
          text: "Address",
          value: "address",
          width: "250px",
        },
        {
          text: "Zip Code",
          value: "zipCode",
          width: "150px",
        },
      ],

      validators: {
        required,
      },

      formFilter: {
        ouId: -99,
        keyword: "",
        selectedLocation: "",
        warehouseType: "",
      },
    };
  },
  mounted() {
    this.refreshData();
  },
  async mounted() {
    await getWarehouseCount(this);
    await getWarehouseList(this);
  },
  created() {
    this.formFilter.selectedLocation = this.defaultOuId;
    this.getWarehouseList();
  },
  methods: {
    async getWarehouseList() {
      this.$loading(true);

      const keyword = this.formFilter.keyword ? this.formFilter.keyword : "";
      const warehouseType = this.formFilter.warehouseType
        ? this.formFilter.warehouseType
        : "";
      const ouId = this.formFilter.ouId ? this.formFilter.ouId : -99;
      const active = "Y";
      const limit = this.itemPerPage;
      const offset = (this.currentPage - 1) * this.itemPerPage;
      const url = `${themeConfig.app.api_master}/warehouse/list?keyword=${keyword}&warehouseType=${warehouseType}&ouId=${ouId}&active=${active}&limit=${limit}&offset=${offset}`;

      try {
        const response = await get(url);
        if (response.data.result !== null && response.data.result.length > 0) {
          this.filteredWarehouseList = response.data.result;
          this.$notify("success", response.data.meta.message);
        } else {
          this.filteredWarehouseList = [];
          this.$notify("warning", "No Data Found");
        }
      } catch (error) {
        this.$notify("error", error.response.data.meta.message);
        console.error("Error while fetching warehouse list:", error);
        console.log("Error response:", error.response);
        this.filteredWarehouseList = [];
      }
      this.$loading(false);
    },
    async removeData(id) {
      this.$loading(true);

      const url = `${themeConfig.app.api_master}/warehouse/remove/${id}`;

      try {
        const response = await get(url);
        if (response.status === 200) {
          this.$notify("success", response.data.meta.message);
          this.refreshData();
        } else {
          this.$notify("warning", "Wrong Response");
        }
      } catch {
        this.$notify("error", error.response.data.meta.message);
      }
      this.$loading(false);
    },
    async refreshData() {
      try {
        await getWarehouseCount(this);
        await getWarehouseList(this);
      } catch (error) {
        console.error("Error refreshing data:", error);
        this.$notify("error", error.response.data.meta.message);
      }
    },
    confirmFilter() {
      this.ofset = 0;
      this.currentPage = 1;
      this.getWarehouseList(this);
    },
    applyFilter() {
      this.filteredWarehouseList = this.warehouseList.filter((item) => {
        const isOuIdMatch =
          this.selectedLocation === "" || item.ouId === this.selectedLocation;
        return isOuIdMatch;
      });

      this.totalPages = Math.ceil(
        this.filteredWarehouseList.length / this.itemPerPage
      );
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.getWarehouseList();
      this.$scrollTo("#target-table");
    },
    goToAddWarehouse() {
      this.$router.push({ name: "warehouseAdd" });
    },
    goToEditWarehouse(item) {
      this.$router.push({ name: "warehouseEdit", params: { id: item.id } });
    },
    confirmDialog(id) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?", {
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
  },
};
</script>
