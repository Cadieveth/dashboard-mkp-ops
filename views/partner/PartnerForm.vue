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
      <v-col cols="12">
        <span class="form-header">
          {{ formEdit ? "Update Partner" : "Add Partner" }}
        </span>

        <v-card class="card-style">
          <v-card-actions class="headline">
            <v-spacer></v-spacer>
            <v-btn class="" small dark color="secondary" @click="closeForm()">
              <v-icon dark left>
                {{ icons.mdiExitToApp }}
              </v-icon>
              Exit
            </v-btn>
            <v-btn
              @click="formEdit ? editData() : addData()"
              color="primary"
              dark
              small
              type="submit"
            >
              <v-icon dark left>
                {{ icons.mdiCheckboxMarkedCircleOutline }}
              </v-icon>
              {{ formEdit ? "Update" : "Save" }}
            </v-btn>
          </v-card-actions>
          <v-form
            ref="form"
            @submit.prevent="formEdit ? editData() : addData()"
          >
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <app-autocomplite-ou
                    :form-value.sync="form.ouId"
                    :read-only="false"
                  ></app-autocomplite-ou>
                </v-col>
                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-autocomplete
                    v-model="form.holdingId"
                    class="mb-0"
                    :label="'Holding'"
                    :items="holdingData"
                    item-value="id"
                    item-text="partnerName"
                    persistent-placeholder
                    :placeholder="'Select Holding'"
                    dense
                    hide-details
                  >
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-text-field
                    v-model="form.partnerCode"
                    label="Partner Code"
                    :rules="[validators.required]"
                    persistent-placeholder
                    :placeholder="'Insert Partner Code'"
                    dense
                    class="mb-0"
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-text-field
                    v-model="form.partnerName"
                    label="Partner Name"
                    :rules="[validators.required]"
                    persistent-placeholder
                    :placeholder="'Insert Partner Name'"
                    dense
                    class="mb-0"
                    hide-details="auto"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-autocomplete
                    v-model="form.typePartnerId"
                    :items="typePartnerList"
                    dense
                    item-text="typePartnerName"
                    item-value="id"
                    label="Partner Type"
                    persistent-placeholder
                    :placeholder="'Select Partner Type'"
                    class="mb-0"
                    hide-details="auto"
                    clearable
                    :rules="[(v) => !!v || 'This field is required']"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-autocomplete
                    v-model="form.ctgrPartnerId"
                    :items="ctgrPartnerList"
                    dense
                    item-text="text"
                    persistent-placeholder
                    :placeholder="'Select Partner Category'"
                    item-value="value"
                    label="Partner Category"
                    class="mb-0"
                    hide-details="auto"
                    clearable
                    :rules="[(v) => !!v || 'This field is required']"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-autocomplete
                    v-model="form.lineOfBusiness"
                    :items="businessList"
                    dense
                    item-text="propKey"
                    item-value="code"
                    label="Line of Business"
                    persistent-placeholder
                    :placeholder="'Select Business'"
                    class="mb-0"
                    hide-details="auto"
                    clearable
                    :rules="[(v) => !!v || 'This field is required']"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" md="6"> </v-col>

                <v-col cols="6" md="6" class="pb-0 mt-2">
                  <v-combobox
                    dense
                    v-model="model"
                    :filter="filter"
                    :hide-no-data="!search"
                    :items="items"
                    :search-input.sync="search"
                    persistent-placeholder
                    placeholder="Insert Responsible Email"
                    hide-selected
                    label="Responsible Email"
                    multiple
                    small-chips
                    hide-details
                  >
                    <template #no-data>
                      <v-list-item>
                        <span class="subheading"
                          >Press Enter to Create List:
                        </span>
                        <v-chip label small>
                          {{ search }}
                        </v-chip>
                      </v-list-item>
                    </template>
                    <template #selection="{ attrs, item, parent, selected }">
                      <v-chip
                        v-if="item === Object(item)"
                        v-bind="attrs"
                        color="secondary"
                        :input-value="selected"
                        label
                        small
                      >
                        <span class="pe-2">
                          {{ item.text }}
                        </span>
                        <v-icon small icon @click="parent.selectItem(item)">
                          {{ icons.mdiClose }}
                        </v-icon>
                      </v-chip>
                    </template>
                  </v-combobox>
                </v-col>

                <v-col cols="6" md="6" class="pb-0 mt-2">
                  <v-text-field
                    label="Ext Partner Name"
                    v-model="form.partnerExtName"
                    rows="3"
                    persistent-placeholder
                    :placeholder="'Insert Ext Partner Name'"
                    hide-details="auto"
                    dense
                    class="mb-0"
                  ></v-text-field>
                </v-col>

                <v-col cols="6" md="6" class="pb-0 mt-2">
                  <v-text-field
                    label="Due Date"
                    v-model="form.dueDate"
                    :rules="dueDateRules"
                    persistent-placeholder
                    :placeholder="'Insert Due Date'"
                    :min="0"
                    dense
                    class="mb-0"
                    hide-details="auto"
                    suffix="Days"
                    type="number"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="6" md="6" class="pb-0 mt-2">
                  <vuetify-money
                    dense
                    label="Limit Amount"
                    v-model="form.amountLimit"
                    placeholder="Insert Amount Limit"
                    v-bind:disabled="disabled"
                    v-bind:valueWhenIsEmpty="valueWhenIsEmpty"
                    hide-details
                  />
                </v-col>

                <!-- <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-text-field
                    v-model="form.flgBill"
                    label="Flag Bill"
                    dense
                    class="mb-0"
                    hide-details="auto"
                    clearable
                  ></v-text-field>
                </v-col> -->

                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-text-field
                    v-model="form.phone1"
                    label="Phone 1"
                    :rules="[validators.required]"
                    persistent-placeholder
                    :placeholder="'Insert Phone 1'"
                    dense
                    class="mb-0"
                    hide-details="auto"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-text-field
                    v-model="form.phone2"
                    label="Phone 2"
                    persistent-placeholder
                    :placeholder="'Insert Phone 2'"
                    dense
                    class="mb-0"
                    hide-details="auto"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-text-field
                    v-model="form.city"
                    :rules="[validators.required]"
                    label="City"
                    persistent-placeholder
                    :placeholder="'Insert City'"
                    dense
                    class="mb-0"
                    hide-details="auto"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="6" md="6" class="pb-0 mt-2">
                  <v-text-field
                    v-model="form.stateProvince"
                    label="State or Province"
                    :rules="[validators.required]"
                    persistent-placeholder
                    :placeholder="'Insert State or Province'"
                    dense
                    class="mb-0"
                    hide-details="auto"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="6" md="6" class="pb-0 mt-2">
                  <v-text-field
                    v-model="form.zipCode"
                    label="Zip Code"
                    :rules="[validators.required]"
                    persistent-placeholder
                    :placeholder="'Insert Zip Code'"
                    dense
                    class="mb-0"
                    hide-details="auto"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6"></v-col>

                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-text-field
                    v-model="form.longitude"
                    label="Longitude"
                    dense
                    persistent-placeholder
                    :placeholder="'Insert Longitude'"
                    class="mb-0"
                    hide-details="auto"
                    clearable
                    type="number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-text-field
                    v-model="form.latitude"
                    label="Latitude"
                    dense
                    persistent-placeholder
                    :placeholder="'Insert Latitude'"
                    class="mb-0"
                    hide-details="auto"
                    clearable
                    type="number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12" class="pb-0 mt-2">
                  <v-textarea
                    label="Address Description"
                    :rules="[validators.required]"
                    v-model="form.addressDesc"
                    rows="3"
                    hide-details="auto"
                    dense
                    class="mb-0"
                    outlined
                  ></v-textarea>
                </v-col>

                <v-card-title class="mt-4">
                  <h4>Contact Person</h4>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col class="pb-0" cols="12" md="12">
                      <v-text-field
                        v-model="form.nameCP"
                        label="Contact Person Name"
                        :rules="[validators.required]"
                        dense
                        persistent-placeholder
                        :placeholder="'Insert Contact Person Name'"
                        class="mb-0"
                        hide-details="auto"
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                    <v-col class="mt-2" cols="12" md="6">
                      <v-text-field
                        v-model="form.jobCP"
                        label="Contact Person Job"
                        persistent-placeholder
                        :placeholder="'Insert Contact Person Job'"
                        dense
                        class="mb-0"
                        hide-details="auto"
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                    <v-col class="mt-2" cols="12" md="6">
                      <v-text-field
                        v-model="form.emailCP"
                        label="Contact Person Email"
                        dense
                        persistent-placeholder
                        :placeholder="'Insert Contact Person Email'"
                        class="mb-0"
                        hide-details="auto"
                        clearable
                      >
                      </v-text-field>
                    </v-col>

                    <v-col class="" cols="12" md="6">
                      <v-text-field
                        v-model="form.departement"
                        label="Departement"
                        dense
                        persistent-placeholder
                        :placeholder="'Insert Departement'"
                        class="mb-0"
                        hide-details="auto"
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                    <v-col class="" cols="12" md="6">
                      <v-text-field
                        v-model="form.jobLevel"
                        label="Job Level"
                        dense
                        persistent-placeholder
                        :placeholder="'Insert Job Level'"
                        class="mb-0"
                        hide-details="auto"
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-textarea
                        label="Contact Person Address"
                        :rules="[validators.required]"
                        v-model="form.addressCP"
                        rows="3"
                        hide-details="auto"
                        dense
                        outlined
                        class="mb-0"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-title class="mt-2"><h4>NPWP</h4></v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-text-field
                        v-model="form.npwpNo"
                        label="NPWP No"
                        persistent-placeholder
                        :placeholder="'Insert NPWP No'"
                        dense
                        class="mb-0"
                        hide-details="auto"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                      <v-text-field
                        v-model="form.npwpName"
                        label="NPWP Name"
                        dense
                        persistent-placeholder
                        :placeholder="'Insert NPWP Name'"
                        class="mb-0"
                        hide-details="auto"
                        clearable
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" class="pb-0 mt-2">
                      <v-menu
                        v-model="menuTgl"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="form.npwpDate"
                            label="NPWP Date"
                            :append-icon="icons.mdiCalendar"
                            readonly
                            dense
                            persistent-placeholder
                            :placeholder="'Select NPWP Date'"
                            hide-details
                            v-bind="attrs"
                            v-on="on"
                            clearable
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="form.npwpDate"
                          color="primary"
                          @input="menuTgl = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" class="pb-0 mt-4">
                      <v-textarea
                        label="NPWP Address"
                        v-model="form.address"
                        rows="3"
                        hide-details="auto"
                        dense
                        class="mb-0"
                        outlined
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-row>
            </v-card-text>

            <v-card-actions class="mt-4">
              <v-spacer></v-spacer>
              <v-btn class="" small dark color="secondary" @click="closeForm()">
                <v-icon dark left>
                  {{ icons.mdiExitToApp }}
                </v-icon>
                Exit
              </v-btn>
              <v-btn color="primary" dark small type="submit">
                <v-icon dark left>
                  {{ icons.mdiCheckboxMarkedCircleOutline }}
                </v-icon>
                {{ formEdit ? "Update" : "Save" }}
              </v-btn>
            </v-card-actions>
          </v-form>
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
  mdiExitToApp,
} from "@mdi/js";
import { dateFormat, isInArray } from "../../../constan";
import { ref, watch } from "@vue/composition-api";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import "../../styles/textstyle.css";

export default {
  name: "ChildPartnerForm",
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
      partner: themeConfig.labeling.partner,
      ouTbl: themeConfig.labeling.ouTbl,

      dueDateRules: [(v) => v >= 0],

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
      holdingData: [],
      typePartnerList: [],
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
        {
          text: "NPWP",
          value: "npwp",
          width: "300px",
        },
        {
          text: "NPWP Date",
          value: "npwpTgl",
          width: "150px",
        },
        {
          text: "NPWP Address",
          value: "address",
          width: "350px",
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
        mdiExitToApp,
      },
      filterForm: new Form({
        keyword: "",
        ctgrPartnerId: "",
        active: "",
      }),
      form: new Form({
        id: "",
        ouId: -99,
        holdingId: -99,
        partnerCode: "",
        partnerName: "",
        typePartnerId: -99,
        ctgrPartnerId: "",
        partnerExtName: "",
        dueDate: 0,
        amountLimit: 0,
        addressDesc: "",
        flgBill: "",
        city: "",
        zipCode: "",
        stateProvince: "",
        phone1: "",
        phone2: "",
        longitude: 0,
        latitude: 0,
        lineOfBusiness: "",
        npwpName: "",
        npwpNo: "",
        npwpDate: "",
        address: "",
        beneficiaryEmail: [],
        nameCP: "",
        jobCP: "",
        emailCP: "",
        addressCP: "",
        phone1CP: "",
        phone2CP: "",
        departement: "",
        jobLevel: "",
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

    this.$root.$on("formCreateEditPartner", (msg) => {
      if (msg[0] === "editData") {
        this.getDetail(msg[1].id);
        this.formEdit = true;
        this.form.id = msg[1].id;
      } else {
        this.formEdit = false;
      }
    });
    this.refreshData();
    this.getBusinessList();
    this.getCtgrPartner();
    this.getHolding();
    this.getTypePartnerList();
  },
  methods: {
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
      this.model = [];
      this.formEdit = false;
      this.form.reset();
      this.form.clear();
      this.formData = true;
    },
    editForm(data) {
      this.model = [];
      this.formEdit = true;
      this.form.fill(data);
      this.form.clear();
      this.formData = true;
    },
    closeForm() {
      this.$root.$emit("formPartner", false);
      this.$root.$emit("dataRefreshPartner");
      this.formData = false;
      this.form.beneficiaryEmail = null;
      this.items = [];
      this.form.reset();
      this.form.clear();
      this.model = [];
      this.$refs.form.resetValidation();
      this.formEdit = false;
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
    getTypePartnerList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/type-partner/list`, config)
        .then((response) => {
          if (response.data.result !== null) {
            for (var i = 0; i < response.data.result.length; i++) {
              if (response.data.result[i].groupPartner == "C") {
                var valueToPush = new Array();
                valueToPush["id"] = response.data.result[i].id;
                valueToPush["typePartnerCode"] =
                  response.data.result[i].typePartnerCode;
                valueToPush["typePartnerName"] =
                  response.data.result[i].typePartnerName;
                valueToPush["groupPartner"] =
                  response.data.result[i].groupPartner;
                this.typePartnerList.push(valueToPush);
              }
            }
          } else {
            this.typePartnerList = [];
          }
          // return (this.typePartnerList = response.data.result);
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
                this.form.npwpDate == ""
                  ? ""
                  : moment(this.form.npwpDate).format("YYYYMMDD"),
              address: this.form.address,
              beneficiaryEmail: this.form.beneficiaryEmail,
              cpName: this.form.nameCP,
              cpJob: this.form.jobCP,
              cpEmail: this.form.emailCP,
              cpAddress: this.form.addressCP,
              phone1: this.form.phone1,
              phone2: this.form.phone2,
              department: this.form.departement,
              jobLevel: this.form.jobLevel,
              addressDesc: this.form.addressDesc,
              city: this.form.city,
              zipCode: this.form.zipCode,
              stateOrProvince: this.form.stateProvince,
              longitude:
                this.form.longitude == "" || this.form.longitude == null
                  ? 0
                  : parseInt(this.form.longitude),
              latitude:
                this.form.latitude == "" || this.form.latitude == null
                  ? 0
                  : parseInt(this.form.latitude),
              holdingId: parseInt(this.form.holdingId),
              dueDate:
                this.form.dueDate == "" || this.form.dueDate == null
                  ? 0
                  : parseInt(this.form.dueDate),
              typePartnerId: this.form.typePartnerId,
              amountLimit: this.form.amountLimit,
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
    editData() {
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
            `${themeConfig.app.api_master}/partner/edit`,
            {
              id: parseInt(this.form.id),
              ouId: this.form.ouId,
              partnerCode: this.form.partnerCode,
              partnerName: this.form.partnerName,
              ctgrPartnerId: this.form.ctgrPartnerId,
              extPartnerId: "",
              partnerExtName: this.form.partnerExtName,
              lineOfBusiness: this.form.lineOfBusiness,
              npwpName: this.form.npwpName,
              npwpNo: this.form.npwpNo,
              npwpDate:
                this.form.npwpDate == ""
                  ? ""
                  : moment(this.form.npwpDate).format("YYYYMMDD"),
              address: this.form.address,
              beneficiaryEmail: this.form.beneficiaryEmail,
              cpName: this.form.nameCP,
              cpJob: this.form.jobCP,
              cpEmail: this.form.emailCP,
              cpAddress: this.form.addressCP,
              phone1: this.form.phone1,
              phone2: this.form.phone2,
              department: this.form.departement,
              jobLevel: this.form.jobLevel,
              addressDesc: this.form.addressDesc,
              city: this.form.city,
              zipCode: this.form.zipCode,
              stateOrProvince: this.form.stateProvince,
              longitude:
                this.form.longitude == "" || this.form.longitude == null
                  ? 0
                  : parseInt(this.form.longitude),
              latitude:
                this.form.latitude == "" || this.form.latitude == null
                  ? 0
                  : parseInt(this.form.latitude),
              holdingId: parseInt(this.form.holdingId),
              dueDate:
                this.form.dueDate == "" || this.form.dueDate == null
                  ? 0
                  : parseInt(this.form.dueDate),
              typePartnerId: this.form.typePartnerId,
              amountLimit: this.form.amountLimit,
            },
            config
          )
          .then((response) => {
            this.isDialogVisible = false;
            this.closeForm();
            this.refreshData();
            this.notif("success", "Sukses", "Update data berhasil!.");
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
    getHolding() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          // `${themeConfig.app.api_master}/partner/list`,
          `${themeConfig.app.api_master}/partner/holding/list`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          // this.getCountData();
          if (response.data.result !== null)
            return (this.holdingData = response.data.result);
          this.holdingData = [];
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
    getDetail(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          // `${themeConfig.app.api_master}/partner/list`,
          `${themeConfig.app.api_master}/partner/detail/${id}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result != null) {
            this.form.ouId = response.data.result.partner.ouId;
            this.form.holdingId = response.data.result.partner.holdingId;
            this.form.partnerCode = response.data.result.partner.partnerCode;
            this.form.partnerName = response.data.result.partner.partnerName;
            this.form.ctgrPartnerId =
              response.data.result.partner.ctgrPartnerId;
            this.form.lineOfBusiness =
              response.data.result.partner.lineOfBusiness;
            const emailBeneficiary =
              response.data.result.PartnerCp.beneficiaryEmail;
            this.model =
              emailBeneficiary == "" ? [] : emailBeneficiary.split(",");
            this.form.partnerExtName =
              response.data.result.partner.partnerExtName;
            this.form.phone1 = response.data.result.partnerAddress.phone1;
            this.form.phone2 = response.data.result.partnerAddress.phone2;
            this.form.city = response.data.result.partnerAddress.city;
            this.form.stateProvince =
              response.data.result.partnerAddress.stateOrProvince;
            this.form.zipCode = response.data.result.partnerAddress.zipCode;
            this.form.longitude = response.data.result.partnerAddress.longitude;
            this.form.latitude = response.data.result.partnerAddress.latitude;
            this.form.addressDesc =
              response.data.result.partnerAddress.addressDesc;
            this.form.nameCP = response.data.result.PartnerCp.cpName;
            this.form.jobCP = response.data.result.PartnerCp.cpJob;
            this.form.emailCP = response.data.result.PartnerCp.cpEmail;
            this.form.departement = response.data.result.PartnerCp.department;
            this.form.jobLevel = response.data.result.PartnerCp.cpJob;
            this.form.addressCP = response.data.result.PartnerCp.cpAddress;
            this.form.npwpNo = response.data.result.partnerNpwp.npwpNo;
            this.form.npwpName = response.data.result.partnerNpwp.npwpName;
            this.form.npwpDate =
              response.data.result.partnerNpwp.npwpDate == ""
                ? ""
                : moment().format("YYYY-MM-DD");
            this.form.address = response.data.result.partnerNpwp.address;
            this.form.dueDate = response.data.result.partner.dueDate;
            this.form.typePartnerId =
              response.data.result.partnerType.typePartnerId;
            this.form.amountLimit =
              response.data.result.partnerType.amountLimit;
          } else {
            this.notif("error", "Gagal", response.data.meta.message);
          }
          // this.getCountData();
          // if (response.data.result !== null)
          //   return (this.holdingData = response.data.result);
          // this.holdingData = [];
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
