<template>
  <div>
    <uom-add
      :dialogAdd="dialogAddParent"
      @closeDialog="closeDialogAdd"
      @addedUom="handleAddedUom">
    </uom-add>
    <uom-edit
      :dialogEdit="dialogEditParent"
      :uomData="uomDataToEdit"
      @closeEditDialog="closeDialogEdit"
      @savedUom="handleSavedUom"></uom-edit>
    <v-row id="to-top">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h4>Unit of Measurement</h4>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <app-autocomplite-uom-status-filter
                  :form-value.sync="formFilter.active"
                  :clearable="true"></app-autocomplite-uom-status-filter>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
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
            <v-spacer></v-spacer>
            <app-button
              color="primary"
              text="Add Data"
              icon-button="mdi-plus"
              :click="showDialogAdd" />
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
                      @click="removeData(item.id)"
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
import AppBottomTopInfo from "@/@core/components/app-table-component/AppBottomTopInfo.vue";
import AppAutocompliteUomStatusFilter from "@/@core/components/app-autocomplite-uom/AppAutocompliteUomStatusFilter.vue";

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
        active: context.formFilter.active,
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
    AppBottomTopInfo,
    AppAutocompliteUomStatusFilter,
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
      dialogAddParent: false,
      dialogEditParent: false,
      uomDataToEdit: {},
      showButton: false,
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
        active: "",
      },
    };
  },
  mounted() {
    this.refreshData();
  },
  async mounted() {
    await getUomList(this);
  },
  created() {
    this.getUomList();
  },
  methods: {
    async getUomList() {
      this.$loading(true);

      const active = this.formFilter.active ? this.formFilter.active : "";
      const keyword = this.formFilter.keyword ? this.formFilter.keyword : "";
      const limit = 1000;
      const offset = (this.currentPage - 1) * this.itemPerPage;
      const url = `${themeConfig.app.api_master}/uom/list?keyword=${keyword}&active=${active}&limit=${limit}&offset=${offset}`;

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
        this.filteredUomList = [];
      }
      this.$loading(false);
    },
    async removeData(id) {
      const res = await this.$confirm();
      if (!res) {
        return;
      }
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
      } catch (error) {
        this.$notify("error", error.response.data.meta.message);
      }
      this.$loading(false);
    },
    async refreshData() {
      try {
        await getUomList(this);
      } catch (error) {
        this.$notify("error", error.response.data.meta.message);
      }
    },
    confirmFilter() {
      this.ofset = 0;
      this.currentPage = 1;
      this.getUomList();
    },
    showDialogAdd() {
      this.dialogAddParent = true;
    },
    closeDialogAdd() {
      this.dialogAddParent = false;
    },
    async handleAddedUom() {
      await this.refreshData();
      this.dialogAddParent = false;
    },
    goToEditUom(item) {
      this.dialogEditParent = true;
      this.uomDataToEdit = { ...item };
    },
    closeDialogEdit() {
      this.dialogEditParent = false;
    },
    async handleSavedUom() {
      await this.refreshData();
      this.dialogEditParent = false;
    },
  },
  created() {
    this.$root.$on("refresh-data", this.refreshData);
  },
};
</script>
