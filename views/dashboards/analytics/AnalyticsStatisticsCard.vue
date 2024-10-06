<template>
  <v-card>
    <v-card-title class="align-start mb-0 pt-1">
      <span class="font-weight-semibold">Statistics Transaction</span>
      <v-spacer></v-spacer>
      <!--      <v-btn icon small class="me-n3 mt-n2">-->
      <!--        <v-icon>-->
      <!--          {{ icons.mdiDotsVertical }}-->
      <!--        </v-icon>-->
      <!--      </v-btn>-->
    </v-card-title>
    <!-- 
    <v-card>
      <v-card-title>
        <v-file-input
          v-model="file"
          accept="image/*"
          placeholder="Pick an avatar"
        >
        </v-file-input>
        <v-btn @click="exampleFunc">Submit</v-btn>
      </v-card-title>
    </v-card> -->

    <v-card-subtitle class="mb-0 mt-n5 pb-1">
      <span class="font-weight-semibold text--primary me-1">{{
        dateStart
      }}</span>
      <span> s/d </span>
      <span class="font-weight-semibold text--primary me-1">{{ dateEnd }}</span>
    </v-card-subtitle>

    <v-card-text>
      <v-row>
        <v-col cols="6" md="3" class="d-flex align-center">
          <v-avatar size="44" color="warning" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiTrendingUp }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">Transaction</p>
            <h3 class="text-xl font-weight-semibold">
              {{ trx }}
            </h3>
          </div>
        </v-col>
        <v-col cols="6" md="3" class="d-flex align-center">
          <v-avatar size="44" color="success" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiBankOutline }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">MDR</p>
            <h3 class="text-xl font-weight-semibold">
              {{ partner }}
            </h3>
          </div>
        </v-col>
        <v-col cols="6" md="3" class="d-flex align-center">
          <v-avatar size="44" color="primary" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiCurrencyUsd }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">Service Fee</p>
            <h3 class="text-xl font-weight-semibold">
              {{ serviceFee }}
            </h3>
          </div>
        </v-col>
        <v-col cols="6" md="3" class="d-flex align-center">
          <v-avatar size="44" color="info" rounded class="elevation-1">
            <v-icon dark color="white" size="30">
              {{ icons.mdiCurrencyUsd }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">Revenue</p>
            <h3 class="text-xl font-weight-semibold">
              {{ revenue }}
            </h3>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiAccountOutline,
  mdiCurrencyUsd,
  mdiTrendingUp,
  mdiDotsVertical,
  mdiLabelOutline,
  mdiBankOutline,
} from "@mdi/js";
import moment from "moment";

import AnalyticsCongratulationJohn from "@/views/dashboards/analytics/AnalyticsCongratulationJohn";
import axios from "@axios";
import themeConfig from "@themeConfig";
export default {
  components: {
    AnalyticsCongratulationJohn,
  },
  setup() {
    const statisticsData = [
      {
        title: "Mdr",
        total: "245k",
      },
      {
        title: "Revenue",
        total: "12.5k",
      },
      {
        title: "Service Fee",
        total: "1.54k",
      },
      {
        title: "Transaksi",
        total: "88k",
      },
    ];

    const resolveStatisticsIconVariation = (data) => {
      if (data === "Service Fee")
        return { icon: mdiCurrencyUsd, color: "primary" };
      if (data === "Mdr") return { icon: mdiBankOutline, color: "success" };
      if (data === "Transaksi")
        return { icon: mdiTrendingUp, color: "warning" };
      if (data === "Revenue") return { icon: mdiCurrencyUsd, color: "info" };

      return { icon: mdiAccountOutline, color: "success" };
    };

    return {
      statisticsData,
      resolveStatisticsIconVariation,

      // icons
      file: null,
      icons: {
        mdiDotsVertical,
        mdiTrendingUp,
        mdiAccountOutline,
        mdiLabelOutline,
        mdiCurrencyUsd,
        mdiBankOutline,
      },
      dateStart: "",
      dateEnd: "",
      partner: 0,
      revenue: 0,
      serviceFee: 0,
      trx: 0,
    };
  },
  mounted() {
    this.dateStart = moment(
      AnalyticsCongratulationJohn.data().filterForm.startDate
    ).format("DD MMMM YYYY");
    this.dateEnd = moment(
      AnalyticsCongratulationJohn.data().filterForm.endDate
    ).format("DD MMMM YYYY");
    this.$root.$on("formFilter", (data) => {
      this.dateStart = moment(data.startDate).format("DD MMMM YYYY");
      this.dateEnd = moment(data.endDate).format("DD MMMM YYYY");
      this.getCountPartner();
    });
    this.getCountPartner();
  },
  methods: {
    exampleFunc(event) {
      const file = this.file;
      const formData = new FormData();
      formData.append("file", file);

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const apiEndpoint = `${themeConfig.app.api_cb}/disbursement/transfer/upload`;
      axios
        .post(apiEndpoint, formData, config)
        .then((response) => {
          console.log("File uploaded successfully!", response.data);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    },
    getCountPartner() {
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
            keyword: "",
            ctgrPartnerId: -99,
            active: "Y",
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.partner = response.data.result;
          } else {
            this.partner = 0;
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
  },
};
</script>
