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
          <v-card-title><span>Group Chart of Account</span></v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="mb-0">
                <v-text-field
                  dense
                  hide-details
                  placeholder="Insert Placeholder"
                  label="Keyword"
                  v-model="filterForm.keyword"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-radio-group
                  v-model="filterForm.typeCoa"
                  class="mt-0 mb-0"
                  hide-details
                >
                  <div class="d-flex flex-wrap demo-space-x">
                    <v-radio
                      label="All"
                      color="primary"
                      value="All"
                      class="mb-0"
                    ></v-radio>
                    <v-radio
                      label="Asset"
                      color="primary"
                      value="A"
                      class="mb-0"
                    ></v-radio>
                    <v-radio
                      label="Liabilities"
                      color="primary"
                      value="L"
                      class="mb-0"
                    ></v-radio>
                    <v-radio
                      label="Revenue"
                      color="primary"
                      value="R"
                      class="mb-0"
                    ></v-radio>
                    <v-radio label="Cost" color="primary" value="C"></v-radio>
                  </div>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              id="target-table"
              dark
              small
              color="primary"
              @click="confirmFilter()"
            >
              <v-icon dark left>
                {{ icons.mdiMagnify }}
              </v-icon>
              Filter
            </v-btn>
          </v-card-actions>
          <v-card-title> </v-card-title>
          <v-card-text class="mt-n4">
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
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="mainData"
              hide-default-footer
              disable-pagination
              fixed-header
              max-height="500px"
              dense
            >
              <!-- headers -->
              <template #[`header.flgSubOu`]>
                {{ subOu }}
              </template>
              <template #[`item.type`]="{ item }">
                {{
                  item.typeCoa == "A"
                    ? "Asset"
                    : item.typeCoa == "L"
                    ? "Liabilities"
                    : item.typeCoa == "R"
                    ? "Revenue"
                    : "Cost"
                }}
              </template>
              <!-- Status Flag-->
              <template #[`item.flgDetail`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgDetail == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgDetail == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgDetail == "Y" ? "YES" : "NO" }}
                </v-chip>
              </template>
              <template #[`item.flgSubLedgerCoa`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgSubLedgerCoa == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgSubLedgerCoa == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgSubLedgerCoa == "Y" ? "YES" : "NO" }}
                </v-chip>
              </template>
              <template #[`item.flgSubOu`]="{ item }">
                <v-chip
                  small
                  :class="`${item.flgSubOu == 'Y' ? 'success' : 'error'}--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgSubOu == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgSubOu == "Y" ? "YES" : "NO" }}
                </v-chip>
              </template>
              <template #[`item.flgSubPartner`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgSubPartner == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgSubPartner == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgSubPartner == "Y" ? "YES" : "NO" }}
                </v-chip>
              </template>
              <template #[`item.flgSubProduct`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgSubproduct == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgSubProduct == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgSubProduct == "Y" ? "YES" : "NO" }}
                </v-chip>
              </template>
              <template #[`item.flgSubRc`]="{ item }">
                <v-chip
                  small
                  :class="`${item.flgSubRc == 'Y' ? 'success' : 'error'}--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgSubRc == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgSubRc == "Y" ? "YES" : "NO" }}
                </v-chip>
              </template>
              <template #[`item.flgSubSegment`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgSubSegment == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgSubSegment == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgSubSegment == "Y" ? "YES" : "NO" }}
                </v-chip>
              </template>
              <template #[`item.flgSystem`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgSystem == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgSystem == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgSystem == "Y" ? "YES" : "NO" }}
                </v-chip>
              </template>
              <template #[`item.flgUserDefined`]="{ item }">
                <v-chip
                  small
                  :class="`${
                    item.flgUserDefined == 'Y' ? 'success' : 'error'
                  }--text`"
                  class="v-chip-light-bg font-weight-semibold text-capitalize"
                  :color="item.flgUserDefined == 'Y' ? 'success' : 'error'"
                >
                  {{ item.flgUserDefined == "Y" ? "YES" : "NO" }}
                </v-chip>
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
import { mdiMagnify } from "@mdi/js";
import moment from "moment";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import { dateFormat, number_format } from "../../../constan";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: { AppCardLoader },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      subOu: themeConfig.labeling.ouB,
      isDialogVisible: false,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,
      ofset: 0,
      itemPerPage: 25,
      itemRow: [25, 50, 100],
      mainData: [],
      filterForm: new Form({
        keyword: "",
        typeCoa: "All",
      }),
      icons: {
        mdiMagnify,
      },
      headers: [
        {
          text: "Code",
          value: "groupCoaCode",
          width: "150px",
        },
        {
          text: "Name",
          value: "groupCoaName",
          width: "150px",
        },
        {
          text: "Type",
          value: "type",
          width: "100px",
        },
        {
          text: "Detail",
          value: "flgDetail",
          width: "150px",
          align: "center",
        },
        {
          text: "Sub Ledger Coa",
          value: "flgSubLedgerCoa",
          width: "150px",
          align: "center",
        },
        {
          text: "Sub OU",
          value: "flgSubOu",
          width: "150px",
          align: "center",
        },
        {
          text: "Sub Partner",
          value: "flgSubPartner",
          width: "150px",
          align: "center",
        },
        {
          text: "Sub Product",
          value: "flgSubProduct",
          width: "150px",
          align: "center",
        },
        {
          text: "Sub Rc",
          value: "flgSubRc",
          width: "150px",
          align: "center",
        },
        {
          text: "Sub Segment",
          value: "flgSubSegment",
          width: "150px",
          align: "center",
        },
        {
          text: "System",
          value: "flgSystem",
          width: "150px",
          align: "center",
        },
        {
          text: "User Defined",
          value: "flgUserDefined",
          width: "150px",
          align: "center",
        },
      ],
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
    getCountData() {
      const coaType =
        this.filterForm.typeCoa == "All" ? "" : this.filterForm.typeCoa;

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .get(
          `${themeConfig.app.api_master}/coa/group-coa/count?keyword${this.filterForm.keyword}&typeCoa=${coaType}`,
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
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    refreshData() {
      const coaType =
        this.filterForm.typeCoa == "All" ? "" : this.filterForm.typeCoa;
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .get(
          `${themeConfig.app.api_master}/coa/group-coa/list?keyword=${this.filterForm.keyword}&typeCoa=${coaType}&limit=${this.itemPerPage}&offset=${this.ofset}`,
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
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
