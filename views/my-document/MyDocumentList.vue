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
        <v-card>
          <v-card-title>
            <span>My Document</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field
                  dense
                  label="Keyword"
                  v-model="filterForm.keyword"
                  persistent-placeholder
                  :placeholder="phKeyword"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-4">
                <v-select
                  label="Status State"
                  v-model="filterForm.statusState"
                  :items="statusStateList"
                  persistent-placeholder
                  :placeholder="phStatusState"
                  dense
                  multiple
                  hide-details
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-menu
                  v-model="menuStart"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="filterForm.dateFrom"
                      :label="startDate"
                      :append-icon="icons.mdiCalendar"
                      readonly
                      dense
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="filterForm.dateFrom"
                    color="primary"
                    @input="menuStart = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-menu
                  v-model="menuEnd"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="filterForm.dateTo"
                      :label="endDate"
                      :append-icon="icons.mdiCalendar"
                      readonly
                      dense
                      persistent-placeholder
                      :placeholder="phDate"
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="filterForm.dateTo"
                    color="primary"
                    @input="menuEnd = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mt-4">
            <v-btn color="primary" small dark @click="confirmFilter()">
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
          </v-card-actions>
          <v-card-text class="mt-8">
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
            <v-data-table
              :headers="headers"
              :items="mainData"
              :search="search"
              :items-per-page="itemPerPage"
              fixed-header
              hide-default-footer
              dense
            >
              <template #[`header.docNo`]>
                {{ docNo }}
              </template>
              <template #[`header.tgl`]>
                {{ docDate }}
              </template>

              <!-- format tanggal-->
              <template #[`item.tgl`]="{ item }">
                {{ dateFormat(item.docDate) }}
              </template>

              <!-- Status Saat ini-->
              <template #[`item.status`]="{ item }">
                <v-chip
                  small
                  :color="
                    item.currentState == 'DRAFT'
                      ? 'warning'
                      : item.currentState == 'INCOMING APPROVED REQUEST'
                      ? 'info'
                      : 'success'
                  "
                  :class="`${
                    item.currentState == 'DRAFT'
                      ? 'warning'
                      : item.currentState == 'INCOMING APPROVED REQUEST'
                      ? 'info'
                      : 'success'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                >
                  {{ item.currentState }}
                </v-chip>
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
                      v-on="on"
                      @click="editData(item)"
                    >
                      <v-icon>
                        {{ icons.mdiClipboardEditOutline }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Edit</span>
                </v-tooltip>
              </template>
            </v-data-table>
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="handlePageChange()"
              total-visible="5"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12"> </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import Form from "vform";
import moment from "moment";
import axios from "@axios";
import themeConfig from "@themeConfig";
import { mdiCalendar, mdiClipboardEditOutline, mdiMagnify } from "@mdi/js";
import { dateFormat, isInArray } from "../../../constan";

export default {
  name: "Child",
  components: { AppCardLoader },
  data() {
    return {
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      phDate: themeConfig.placeholder.date,
      phKeyword: themeConfig.placeholder.keyword,
      phStatusState: themeConfig.placeholder.statusState,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      isDialogVisible: false,
      menuStart: false,
      menuEnd: false,
      search: "",
      currentPage: 1,
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      statusStateList: ["DRAFT", "INCOMING APPROVAL REQUEST", "APPROVED"],
      icons: {
        mdiCalendar,
        mdiMagnify,
        mdiClipboardEditOutline,
      },
      filterForm: new Form({
        keyword: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        statusState: ["DRAFT", "INCOMING APPROVAL REQUEST"],
      }),
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "75px",
        },
        { text: "Nomor Dokumen", value: "docNo", width: "250px" },
        { text: "Tanggal", value: "tgl", width: "125px" },
        { text: "Remark", value: "remark", width: "400px" },
        { text: "Status", align: "center", value: "status", width: "100px" },
        // { text: 'Scheme', align: 'center', value: 'scheme', width:'100px'}
      ],
    };
  },
  mounted() {
    this.refreshData();
    this.$root.$on("formCashBankDisbursReturn", (msg) => {
      this.refreshData();
    });
    this.$root.$on("formCashBankTransferReturn", (msg) => {
      this.refreshData();
    });
  },
  methods: {
    confirmFilter() {
      this.currentPage = 1;
      this.ofset = 0;
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
    handlePageChange() {
      if (this.currentPage == 1) {
        this.ofset = 0;
      } else {
        this.ofset = (this.currentPage - 1) * this.itemPerPage;
      }
      this.refreshData();
    },
    editData(data) {
      console.log(data);
      var item = [data, "editFormDokumen"];
      if (data.scheme == "CB01") {
        this.$root.$emit("formCashBankDisburs", true);
        this.$root.$emit("formCashBankDisbursForm", item);
      } else if (data.scheme == "CB02") {
        this.$root.$emit("formCashBankTransfer2", true);
        this.$root.$emit("formCashBankTransferForm", item);
      } else if (data.scheme == "CB04") {
        this.$root.$emit("formCashBankTransfer", true);
        this.$root.$emit("formCashBankTransferForm", item);
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
        .post(
          `${themeConfig.app.api_master}/approval/current-document/count`,
          {
            keyword: this.filterForm.keyword,
            dateFrom: moment(this.filterForm.dateFrom).format("YYYYMMDD"),
            dateTo: moment(this.filterForm.dateTo).format("YYYYMMDD"),
            statusState: this.filterForm.statusState,
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
          this.notif("error", "Failed", e.response.data.meta.message);
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
          `${themeConfig.app.api_awe}/approval/current-document/list`,
          {
            keyword: this.filterForm.keyword,
            dateFrom: moment(this.filterForm.dateFrom).format("YYYYMMDD"),
            dateTo: moment(this.filterForm.dateTo).format("YYYYMMDD"),
            statusState: this.filterForm.statusState,
            limit: this.itemPerPage,
            offset: this.offset,
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
          this.notif("error", "Failed", e.response.data.message);
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
