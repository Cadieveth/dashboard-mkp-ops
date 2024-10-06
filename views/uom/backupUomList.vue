LIST
<template>
  <div>
    <uom-edit
      :showLocalEditDialog="showDialogUomEdit"
      @closeEditDialog="handleCloseEditDialog"
      @saveAndCloseEditDialog="handleSaveAndCloseEditDialog"
      @save-and-close-edit-dialog="saveAndCloseEditDialog"
      @refresh-data="refreshData">
    </uom-edit>
    <v-row id="to-top">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h4>Unit of Measurement</h4>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <app-autocomplite-uom-class
                  :form-value.sync="formFilter.uomClass"
                  :clearable="true"
                  :on-clear="handleClear"></app-autocomplite-uom-class>
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
              :click="functionClick" />
            <UomAdd
              :showDialog="showDialogUomAdd"
              @closeDialog="closeUomAddDialog"
              @saveAndCloseDialog="saveAndCloseDialog"
              @save-and-close-dialog="saveAndCloseDialog"
              @refresh-data="refreshData" />
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="filteredUomList"
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
                    <v-list-item @click="goToEditUom(item)" v-show="showEdit">
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
              <template #[`item.uomName`]="{ item }">
                <app-bottom-top-info
                  :top="item.uomName"
                  :bottom="item.uomCode"></app-bottom-top-info>
              </template>
              <template #[`item.active`]="{ item }">
                <v-chip
                  small
                  :class="`${item.active == 'Y' ? 'success' : 'error'}--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.active == 'Y' ? 'success' : 'error'">
                  {{ item.active == "Y" ? "YES" : "NO" }}
                </v-chip>
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
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import AppButton from "@/@core/components/app-button/AppButton.vue";
import { get, post } from "@/services/apiServices";
import UomAdd from "./UomAdd.vue";
import UomEdit from "./UomEdit.vue";
import AppAutocompliteUomClass from "@/@core/components/app-autocomplite-uom/AppAutocompliteUomClass.vue";
import AppBottomTopInfo from "@/@core/components/app-table-component/AppBottomTopInfo.vue";

Vue.use(VueScrollTo);

async function getUomList(context) {
  try {
    const accessToken = context.$session.get("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get(`${themeConfig.app.api_master}/uom/list`, {
      params: {
        keyword: context.formFilter.keyword,
        active: "",
        limit: 25,
        offset: 0,
        uomClass: context.formFilter.uomClass,
      },
      headers: config.headers,
    });

    if (response.data.result !== null && response.data.result.length > 0) {
      context.filteredUomList = response.data.result;
    } else {
      context.filteredUomList = [];
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      context.$router.push({ name: "auth-login" });
    } else {
      console.error("Error while fetching uom list:", error);
      console.log("Error response:", error.response);
      context.filteredUomList = [];
    }
  }
}

export default {
  name: "UomList",
  components: {
    AppCardLoader,
    AppButton,
    UomAdd,
    UomEdit,
    AppAutocompliteUomClass,
    AppBottomTopInfo,
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
      showEditDialog: false,

      showDialogUomEdit: false,

      dialogUomedit: false,

      showButton: false,
      dialogUomAdd: false,
      showDialogUomAdd: false,
      previousScroll: 0,
      currentPage: 1,
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      uomList: [],
      filteredUomList: [],
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
          text: "Unit of Measurement",
          value: "uomName",
          width: "200px",
        },
        {
          text: "Class",
          value: "uomClass",
          width: "200px",
        },
        {
          text: "Status",
          value: "active",
          width: "100px",
        },
      ],

      validators: {
        required,
      },

      formFilter: {
        keyword: "",
        uomClass: "",
      },
    };
  },
  mounted() {
    this.refreshData();
  },
  async mounted() {
    // await getWarehouseCount(this);
    await getUomList(this);
  },
  created() {
    this.getUomList();
  },
  methods: {
    async getUomList() {
      this.$loading(true);

      const keyword = this.formFilter.keyword;
      const active = "";
      const limit = 25;
      const offset = 0;
      const uomClass = this.formFilter.uomClass;
      const url = `${themeConfig.app.api_master}/uom/list?keyword=${keyword}&active=${active}&limit=${limit}&offset=${offset}&uomClass=${uomClass}`;

      try {
        const response = await get(url);
        if (response.data.result !== null && response.data.result.length > 0) {
          this.filteredUomList = response.data.result;
          this.$notify("success", response.data.meta.message);
        } else {
          this.filteredUomList = [];
          this.$notify("warning", "No Data Found");
        }
      } catch (error) {
        this.$notify("error", error.response.data.meta.message);
        console.error("Error while fetching uom list:", error);
        console.log("Error response:", error.response);
        this.filteredUomList = [];
      }
      this.$loading(false);
    },
    async removeData(id) {
      this.$loading(true);

      const url = `${themeConfig.app.api_master}/uom/remove/${id}`;

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
        // await getWarehouseCount(this);
        await getUomList(this);
      } catch (error) {
        console.error("Error refreshing data:", error);
        this.$notify("error", error.response.data.meta.message);
      }
    },
    handleClear() {
      this.formFilter.uomClass = "";
    },
    confirmFilter() {
      this.ofset = 0;
      this.currentPage = 1;
      this.getUomList(this);
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.getUomList();
      this.$scrollTo("#target-table");
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

    functionClick() {
      this.showDialogUomAdd = true;
    },
    closeDialog() {
      this.showDialogUomAdd = false;
    },
    saveAndCloseDialog() {
      this.showDialogUomAdd = false;
    },
    openUomAddDialog() {
      this.showDialogUomAdd = true;
    },
    closeUomAddDialog() {
      this.showDialogUomAdd = false;
    },

    goToEditUom(id) {
      this.showDialogUomEdit = true;
      console.log("Edit button clicked with ID:", id);
    },
    closeEditDialog() {
      this.showDialogUomEdit = false;
    },
    saveAndCloseEditDialog() {
      this.showDialogUomEdit = false;
    },
    openUomEditDialog() {
      this.showDialogUomEdit = true;
    },
    closeUomEditDialog() {
      this.showDialogUomEdit = false;
    },
    handleCloseEditDialog() {
      this.showDialogUomEdit = false;
    },
    handleSaveAndCloseEditDialog() {
      this.showDialogUomEdit = false;
      this.$emit("refresh-data");
    },
  },
  created() {
    this.$root.$on("refresh-data", this.refreshData);
  },
};
</script>
