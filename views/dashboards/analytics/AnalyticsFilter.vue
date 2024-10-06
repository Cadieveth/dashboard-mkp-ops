<template>
  <v-card class="greeting-card">
    <v-row class="ma-0 pa-0">
      <v-col cols="12">
        <v-card-text class="pr-0 pl-0">
          <v-row>
            <!--            <v-col cols="12"  md="4">-->
            <!--              <v-select-->
            <!--                  label="Product"-->
            <!--                  :items="productList"-->
            <!--                  hide-details-->
            <!--                  dense-->
            <!--                  v-model="filterForm.product"-->
            <!--                  item-text="productName"-->
            <!--                  item-value="id"-->
            <!--              ></v-select>-->
            <!--            </v-col>-->
            <v-col cols="12" md="5">
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
                    v-model="filterForm.startDate"
                    label="Start Date"
                    :prepend-inner-icon="icons.mdiCalendar"
                    readonly
                    dense
                    hide-details
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filterForm.startDate"
                  color="primary"
                  @input="menuStart = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="5">
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
                    v-model="filterForm.endDate"
                    label="End Date"
                    :prepend-inner-icon="icons.mdiCalendar"
                    readonly
                    dense
                    hide-details
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filterForm.endDate"
                  color="primary"
                  @input="menuEnd = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="2" md="2">
              <v-btn small color="primary" @click="refreshData()">
                <v-icon dark left>
                  {{ icons.mdiMagnify }}
                </v-icon>
                Filter
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<style lang="scss" scoped>
.greeting-card {
  position: relative;
  .greeting-card-bg {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .greeting-card-trophy {
    position: absolute;
    bottom: 10%;
    right: 8%;
  }
}
// rtl
.v-application {
  &.v-application--is-rtl {
    .greeting-card-bg {
      right: initial;
      left: 0;
      transform: rotateY(180deg);
    }
    .greeting-card-trophy {
      left: 8%;
      right: initial;
    }
  }
}
</style>

<script>
import { mdiCalendar, mdiMagnify, mdiReload } from "@mdi/js";
import Form from "vform";
import moment from "moment";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";

export default {
  name: "Child",
  data() {
    return {
      menuStart: false,
      menuEnd: false,
      icons: {
        mdiCalendar,
        mdiReload,
        mdiMagnify,
      },
      productList: [],
      filterForm: new Form({
        startDate: moment().format("YYYY-MM-") + "01",
        endDate: moment().format("YYYY-MM-DD"),
        product: -99,
      }),
    };
  },
  mounted() {
    this.refreshData();
    this.getProductList();
  },
  methods: {
    refreshData() {
      this.$root.$emit("formFilter", this.filterForm);
    },
    getProductList() {
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
            brandCode: ["M.23.001", "M.23.003"],
            limit: 9999,
            offset: 0,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null)
            return (this.productList = response.data.result);
          this.productList = [];
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
  },
};
</script>
