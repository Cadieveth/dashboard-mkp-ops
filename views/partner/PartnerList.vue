<template>
  <div>
    <v-snackbar
      top
      v-model="snackbar"
      :timeout="timeout"
      :color="color"
      outlined
      text>
      {{ text }}
    </v-snackbar>
    <v-row id="to-top">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span>{{ partner }}</span>
            <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" class="pb-0">
                <v-text-field
                  v-model="filterForm.keyword"
                  label="Keyword"
                  persistent-placeholder
                  placeholder="Insert Keyword"
                  dense
                  hide-details
                  class="mb-0"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="pb-0">
                <v-select
                  :items="ctgrPartnerList"
                  v-model="filterForm.ctgrPartnerId"
                  item-text="text"
                  item-value="value"
                  label="Partner Category"
                  hide-details="auto"
                  class="mb-0"
                  dense
                  clearable
                  persistent-placeholder
                  placeholder="Select Partner Category"></v-select>
              </v-col>
              <v-col cols="12" md="4" class="pb-0">
                <v-select
                  :items="activeList"
                  v-model="filterForm.active"
                  item-text="text"
                  item-value="value"
                  label="Status"
                  hide-details="auto"
                  class="mb-0"
                  dense></v-select>
              </v-col>
              <v-col id="target-table" cols="12" md="12" class="mt-4">
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
                @change="getItemPerPage"></v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              dark
              small
              @click="addForm()"
              v-show="showAdd">
              <v-icon dark left>
                {{ icons.mdiPlus }}
              </v-icon>
              Add Data
            </v-btn>
            <v-dialog v-model="formData" persistent width="700">
              <v-card>
                <v-card-title class="headline">
                  {{ formEdit ? "Update Partner" : "Add Partner" }}
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" icon small @click="closeForm()">
                    <v-icon>{{ icons.mdiClose }}</v-icon>
                  </v-btn>
                </v-card-title>
                <v-form
                  ref="form"
                  @submit.prevent="formEdit ? editData() : addData()">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="12" class="pb-0">
                          <app-autocomplite-ou
                            :form-value.sync="form.ouId"
                            :read-only="false"></app-autocomplite-ou>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 mt-2">
                          <v-text-field
                            v-model="form.partnerCode"
                            label="Code"
                            :rules="[validators.required]"
                            dense
                            class="mb-0"
                            hide-details="auto"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 mt-2">
                          <v-text-field
                            v-model="form.partnerName"
                            label="Name"
                            :rules="[validators.required]"
                            dense
                            class="mb-0"
                            hide-details="auto"
                            clearable></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 mt-2">
                          <v-autocomplete
                            v-model="form.ctgrPartnerId"
                            :items="ctgrPartnerList"
                            dense
                            item-text="text"
                            item-value="value"
                            label="Category"
                            class="mb-0"
                            hide-details="auto"
                            clearable
                            :rules="[
                              (v) => !!v || 'This field is required',
                            ]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0 mt-2">
                          <v-autocomplete
                            v-model="form.lineOfBusiness"
                            :items="businessList"
                            dense
                            item-text="propKey"
                            item-value="code"
                            label="Partner Business Type"
                            class="mb-0"
                            hide-details="auto"
                            clearable
                            :rules="[
                              (v) => !!v || 'This field is required',
                            ]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="12" class="pb-0 mt-2">
                          <v-combobox
                            dense
                            v-model="model"
                            :filter="filter"
                            :hide-no-data="!search"
                            :items="items"
                            :search-input.sync="search"
                            hide-selected
                            label="Responsible Email"
                            multiple
                            small-chips
                            hide-details>
                            <template #no-data>
                              <v-list-item>
                                <span class="subheading"
                                  >Tekan enter untuk membuat list:
                                </span>
                                <v-chip label small>
                                  {{ search }}
                                </v-chip>
                              </v-list-item>
                            </template>
                            <template
                              #selection="{ attrs, item, parent, selected }">
                              <v-chip
                                v-if="item === Object(item)"
                                v-bind="attrs"
                                color="secondary"
                                :input-value="selected"
                                label
                                small>
                                <span class="pe-2">
                                  {{ item.text }}
                                </span>
                                <v-icon
                                  small
                                  icon
                                  @click="parent.selectItem(item)">
                                  {{ icons.mdiClose }}
                                </v-icon>
                              </v-chip>
                            </template>
                          </v-combobox>
                        </v-col>
                        <v-col cols="12" md="12" class="pb-0 mt-2">
                          <v-textarea
                            label="Ext Partner Name"
                            v-model="form.partnerExtName"
                            rows="3"
                            hide-details="auto"
                            outlined
                            dense
                            class="mb-0"></v-textarea>
                        </v-col>
                        <v-col cols="12" md="12" class="pb-0">
                          <v-card outlined>
                            <v-card-title class="pt-2"
                              ><h6>NPWP</h6></v-card-title
                            >
                            <v-card-text>
                              <v-row>
                                <v-col cols="12" md="6" class="pb-0">
                                  <v-text-field
                                    v-model="form.npwpNo"
                                    label="No NPWP"
                                    dense
                                    class="mb-0"
                                    hide-details="auto"
                                    clearable></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" class="pb-0">
                                  <v-text-field
                                    v-model="form.npwpName"
                                    label="NPWP Name"
                                    dense
                                    class="mb-0"
                                    hide-details="auto"
                                    clearable></v-text-field>
                                </v-col>
                                <v-col cols="12" class="pb-0 mt-2">
                                  <v-menu
                                    v-model="menuTgl"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="form.npwpDate"
                                        label="NPWP Date"
                                        :append-icon="icons.mdiCalendar"
                                        readonly
                                        dense
                                        hide-details
                                        v-bind="attrs"
                                        v-on="on"
                                        clearable></v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="form.npwpDate"
                                      color="primary"
                                      @input="menuTgl = false"></v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col cols="12" class="pb-0 mt-2">
                                  <v-textarea
                                    label="NPWP Address"
                                    v-model="form.address"
                                    rows="3"
                                    hide-details="auto"
                                    dense
                                    outlined
                                    class="mb-0"></v-textarea>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
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

            <!-- end of dialog Add Data -->
            <v-dialog
              v-model="formFeeDisbursementPartner"
              persistent
              width="400">
              <v-card>
                <v-card-title class="headline">
                  Set Transfer Fee
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" icon small @click="closeFormFee()">
                    <v-icon>{{ icons.mdiClose }}</v-icon>
                  </v-btn>
                </v-card-title>
                <v-form
                  ref="form"
                  @submit.prevent="addFeeDisbursementPartner()">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" class="pb-0">
                          <vuetify-money
                            dense
                            label="Partner Transfer Fee"
                            v-model="formFee.parameterValue"
                            v-bind:disabled="disabled"
                            v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                            v-bind:options="options"
                            v-bind:properties="properties"
                            hide-details />
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
                      {{ formEditFee ? "Update" : "Save" }}
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
              dense>
              <template #[`header.ouName`]>
                {{ ouTbl }}
              </template>
              <!-- format tanggal-->
              <template #[`item.npwp`]="{ item }">
                {{ item.npwpNo }}
                {{ item.npwpName != "" ? "(" + item.npwpName + ")" : "" }}
              </template>

              <!-- format tanggal-->
              <template #[`item.npwpTgl`]="{ item }">
                {{ item.npwpDate != "" ? dateFormat(item.npwpDate) : "" }}
              </template>

              <!-- action -->
              <!-- <template #[`item.actions`]="{ item }">
                <v-tooltip bottom color="secondary">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="secondary"
                      v-bind="attrs"
                      v-on="on"
                      @click="settingBankPartner(item.id)"
                      v-show="showSetMitraBank"
                    >
                      <v-icon>
                        {{ icons.mdiTextBoxCheck }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Set Partner Bank</span>
                </v-tooltip>
                <v-tooltip bottom color="secondary">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      x-small
                      icon
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                      @click="settingFeeDisbursementPartner(item.partnerCode)"
                      v-show="showSetMitraBank"
                    >
                      <v-icon>
                        {{ icons.mdiAccountCashOutline }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Transfer Fee</span>
                </v-tooltip>
              </template> -->

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
                          v-show="showSetMitraBank">
                          {{ icons.mdiFormatListBulleted }}
                        </v-icon>
                      </template>
                      <span>More Info</span>
                    </v-tooltip>
                  </template>
                  <v-list dense>
                    <v-list-item @click="editForm(item)" v-show="true">
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
                      @click="settingBankPartner(item.id)"
                      v-show="showSetMitraBank">
                      <v-list-item-icon class="me-2 mt-1">
                        <v-icon size="18" color="secondary">
                          {{ icons.mdiTextBoxCheck }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="pt-0">
                        <v-list-item-title class="secondary--text"
                          >Set Partner Bank</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      @click="settingFeeDisbursementPartner(item.partnerCode)"
                      v-show="showSetMitraBank">
                      <v-list-item-icon class="me-2 mt-1">
                        <v-icon size="18" color="info">
                          {{ icons.mdiAccountCashOutline }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content class="pt-0">
                        <v-list-item-title class="info--text">
                          Transfer Fee
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
    <!-- <button class="scroll-down-button" v-show="showButton" @click="toTop()">
      <v-icon class="iconUp" dark left>
        {{ icons.mdiArrowUpBold }}
      </v-icon>
    </button> -->
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import Form from "vform";
import axios from "@axios";
import themeConfig from "@themeConfig";
import moment from "moment";
import { required } from "@core/utils/validation";
import {
  mdiAccountCashOutline,
  mdiCalendar,
  mdiCheckboxMarkedCircleOutline,
  mdiClose,
  mdiDelete,
  mdiMagnify,
  mdiPlus,
  mdiTextBoxCheck,
  mdiClipboardEditOutline,
  mdiFormatListBulleted,
  mdiArrowUpBold,
} from "@mdi/js";
import { dateFormat, isInArray } from "../../../constan";
import { ref, watch } from "@vue/composition-api";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import { throws } from "assert";

Vue.use(VueScrollTo);

export default {
  name: "childParentList",
  components: {
    AppAutocompliteOu,
    AppCardLoader,
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
          // eslint-disable-next-line no-param-reassign
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
      partner: themeConfig.labeling.partner,
      ouTbl: themeConfig.labeling.ouTbl,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      items: [
        {
          text: "",
        },
      ],

      isDialogVisible: false,
      formData: false,
      formEdit: false,
      menuTgl: false,
      showAdd:
        isInArray("addPartner", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showSetMitraBank:
        isInArray(
          "viewMappingPartnerBank",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      formPartnerBank: true,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      ctgrPartnerList: [],
      businessList: [],
      OuList: [],
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
          text: "Partner Code",
          value: "partnerCode",
          width: "200px",
        },
        {
          text: "Name",
          value: "partnerName",
          width: "300px",
        },
        {
          text: "Category",
          value: "ctgrPartnerName",
          width: "300px",
        },
        {
          text: "Unit Bisnis",
          value: "ouName",
          width: "200px",
        },
        {
          text: "Partner Type",
          value: "lineOfBusiness",
          width: "150px",
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
      validators: {
        required,
      },
      icons: {
        mdiDelete,
        mdiTextBoxCheck,
        mdiCalendar,
        mdiMagnify,
        mdiPlus,
        mdiClose,
        mdiCheckboxMarkedCircleOutline,
        mdiAccountCashOutline,
        mdiClipboardEditOutline,
        mdiFormatListBulleted,
        mdiArrowUpBold,
      },
      filterForm: new Form({
        keyword: "",
        ctgrPartnerId: "",
        active: "",
      }),
      form: new Form({
        id: "",
        ouId: "",
        partnerCode: "",
        partnerName: "",
        ctgrPartnerId: "",
        partnerExtName: "",
        lineOfBusiness: "",
        npwpName: "",
        npwpNo: "",
        npwpDate: "",
        address: "",
        beneficiaryEmail: [],
      }),
      formEditFee: false,
      formFeeDisbursementPartner: false,
      disabled: false,
      options: {
        locale: "pt-BR",
        prefix: "",
        suffix: "",
        length: 20,
        precision: 0,
      },
      properties: {
        hint: "my hint",
      },
      valueWhenIsEmpty: "",
      formFee: new Form({
        id: "",
        parameterCode: "",
        parameterValue: "",
      }),
    };
  },
  mounted() {
    this.$root.$on("appAutocompliteOu", (msg) => {
      this.form.ouId = msg;
    });
    this.$root.$on("dataRefreshPartner", () => {
      this.refreshData();
    });
    this.getBusinessList();
    this.getCtgrPartner();
    this.refreshData();

    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (window.scrollY > this.previousScroll) {
        this.showButton = true;
      } else {
        this.showButton = false;
      }
      this.previousScroll = window.scrollY;
    },
    toTop() {
      // document.body.scrollTop = 0; // For Safari
      // document.documentElement.scrollTop = 0;
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
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
    addForm() {
      this.$root.$emit("formPartner", true);
      // this.model = [];
      // this.formEdit = false;
      // this.form.reset();
      // this.form.clear();
      // this.formData = false;
    },
    editForm(data) {
      const item = ["editData", data];
      this.$root.$emit("formCreateEditPartner", item);
      this.$root.$emit("formPartner", true);
      // this.model = [];
      // this.formEdit = true;
      // this.form.fill(data);
      // this.form.clear();
      // this.formData = true;
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
    settingBankPartner(id) {
      this.$root.$emit("formPartnerBank", this.formPartnerBank);
      this.$root.$emit("formPartnerBankForm", id);
    },
    settingFeeDisbursementPartner(partnerCode) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/partner/fee-disbursement-list/${partnerCode}`,
          config
        )
        .then((response) => {
          this.formFee.parameterCode = partnerCode;
          this.formFeeDisbursementPartner = true;
          if (response.data.result !== null) {
            this.formEditFee = true;
            this.formFee.parameterValue = response.data.result.parameterValue;
          } else {
            this.formEditFee = false;
            this.formFee.parameterValue = "";
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getBusinessList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/combo/list?comboId=LINEOFBUSINESS`,
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.businessList = response.data.result);
          this.businessList = [];
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getCtgrPartner() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/partner/ctgr-partner-list`, config)
        .then((response) => {
          if (response.data.result !== null) {
            response.data.result.forEach((element) => {
              var valueToPush = {};
              valueToPush["value"] = element.id;
              valueToPush["text"] = element.ctgrPartnerName;
              this.ctgrPartnerList.push(valueToPush);
            });
          } else {
            this.ctgrPartnerList = [];
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
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
          `${themeConfig.app.api_master}/partner/count`,
          {
            keyword: this.filterForm.keyword,
            ctgrPartnerId:
              this.filterForm.ctgrPartnerId == ""
                ? -99
                : parseInt(this.filterForm.ctgrPartnerId),
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
          this.notif("error", "Gagal", e.response.data.meta.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    addData() {
      this.form.beneficiaryEmail = [];
      for (var i = 0; i < this.model.length; i++) {
        this.form.beneficiaryEmail.push(this.model[i].text);
      }
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
            `${themeConfig.app.api_master}/partner/add`,
            {
              ouId: this.form.ouId,
              partnerCode: this.form.partnerCode,
              partnerName: this.form.partnerName,
              ctgrPartnerId: this.form.ctgrPartnerId,
              partnerExtName: this.form.partnerExtName,
              lineOfBusiness: this.form.lineOfBusiness,
              npwpName: this.form.npwpName,
              npwpNo: this.form.npwpNo,
              npwpDate:
                this.form.npwpDate != ""
                  ? moment(this.form.npwpDate).format("YYYYMMDD")
                  : "",
              address: this.form.address,
              beneficiaryEmail: this.form.beneficiaryEmail,
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.closeForm();
            this.refreshData();
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
    addFeeDisbursementPartner() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/partner/fee-disbursement/add`,
          {
            ParameterCode: this.formFee.parameterCode,
            ParameterValue: this.formFee.parameterValue,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.closeFormFee();
          this.refreshData();
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
    },
    editFeeDisbursementPartner() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/partner/fee-disbursement/edit`,
          {
            ParameterCode: this.formFee.parameterCode,
            ParameterValue: this.formFee.parameterValue,
          },
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          this.closeFormFee();
          this.refreshData();
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
          `${themeConfig.app.api_master}/partner/list`,
          {
            keyword: this.filterForm.keyword,
            ctgrPartnerId:
              this.filterForm.ctgrPartnerId == ""
                ? -99
                : parseInt(this.filterForm.ctgrPartnerId),
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

<style>
.scroll-down-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background-color: #1b71ce;
  color: white;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.iconUp {
  justify-self: center;
  height: 50px;
  width: 50px;
  margin-left: 8px;
}
</style>
