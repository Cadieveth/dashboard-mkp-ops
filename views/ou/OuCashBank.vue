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
      <v-col cols="12" md="12">
        <v-card>
          <v-card-title>
            <span>Mapping Cash/Bank</span>
            <v-spacer></v-spacer>
            <v-btn color="secondary" text small fab @click="closeOuCashBank()">
              <v-icon dark>
                {{ icons.mdiClose }}
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-card outlined>
                  <v-card-title>
                    <span class="font-weight-bold">Cash/Bank Available</span>
                    <v-spacer></v-spacer>
                    <v-btn small dark color="primary" @click="addCashBankOu()">
                      <v-icon dark left>
                        {{ icons.mdiPlus }}
                      </v-icon>
                      Add Cash/Bank
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="mainDataNotMapping"
                      :items-per-page="1000"
                      :footer-props="{
                        'items-per-page-options': [1000],
                      }"
                      hide-default-footer
                      dense
                      fixed-header
                      v-model="selected"
                      item-key="cashbankId"
                      show-select
                    >
                      <!-- Akun-->
                      <template #[`item.noAkun`]="{ item }">
                        <!--                          {{ item.accountNo }} a/n {{ item.accountName }}-->
                        <div class="d-flex align-center">
                          <v-avatar color="#e6e6e6" size="30">
                            <v-img
                              :src="
                                require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                              "
                            ></v-img>
                          </v-avatar>

                          <div class="d-flex flex-column ms-3">
                            <span
                              class="
                                d-block
                                text--primary
                                font-weight-semibold
                                text-truncate
                              "
                              >{{ item.accountName }}</span
                            >
                            <span class="text-xs">{{ item.accountNo }}</span>
                          </div>
                        </div>
                      </template>

                      <!-- action -->
                      <!-- <template #[`item.actions`]="{ item }">
                        <v-tooltip bottom color="warning">
                          <template #activator="{ on, attrs }">
                            <div class="d-flex demo-space-x flex-wrap">
                              <v-checkbox
                                v-model="checked"
                                :value="item.id"
                                hide-details
                                @click="selectRow(item, 'yes')"
                              ></v-checkbox>
                            </div>
                          </template>
                        </v-tooltip>
                      </template> -->
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card outlined>
                  <v-card-title>
                    <span class="font-weight-bold">Cash/Bank Selected</span>
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="mainDataMapping"
                      :items-per-page="1000"
                      :footer-props="{
                        'items-per-page-options': [1000],
                      }"
                      hide-default-footer
                      dense
                    >
                      <!-- Akun-->
                      <template #[`item.noAkun`]="{ item }">
                        <!--                          {{ item.accountNo }} a/n {{ item.accountName }}-->
                        <div class="d-flex align-center">
                          <v-avatar color="#e6e6e6" size="30">
                            <v-img
                              :src="
                                require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                              "
                            ></v-img>
                          </v-avatar>

                          <div class="d-flex flex-column ms-3">
                            <span
                              class="
                                d-block
                                text--primary
                                font-weight-semibold
                                text-truncate
                              "
                              >{{ item.accountName }}</span
                            >
                            <span class="text-xs">{{ item.accountNo }}</span>
                          </div>
                        </div>
                      </template>

                      <!-- action -->
                      <!-- <template #[`item.actions`]="{ item }">
                        <v-tooltip bottom color="warning">
                          <template #activator="{ on, attrs }">
                            <div class="d-flex demo-space-x flex-wrap">
                              <v-checkbox
                                v-model="checked"
                                :value="item.id"
                                hide-details
                                @click="selectRow(item, 'not')"
                              ></v-checkbox>
                            </div>
                          </template>
                        </v-tooltip>
                      </template> -->
                      <template #[`item.actions`]="{ item }">
                        <v-tooltip bottom color="error">
                          <template #activator="{ on, attrs }">
                            <v-btn
                              x-small
                              icon
                              color="error"
                              v-bind="attrs"
                              v-on="on"
                              @click="removeCashBankOu(item)"
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import { mdiArrowLeft, mdiClose, mdiPlus, mdiDelete } from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";

export default {
  name: "Child",
  components: { AppCardLoader },
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      checked: false,
      isDialogVisible: false,

      selected: [],

      formOuCashBank: false,
      idOu: "",
      mainDataNotMapping: [],
      mainDataMapping: [],
      icons: {
        mdiClose,
        mdiPlus,
        mdiDelete,
      },
      headers: [
        {
          text: "",
          value: "actions",
          width: "20px",
        },
        {
          text: "Code",
          value: "cashbankCode",
          width: "200px",
        },
        {
          text: "Bank",
          value: "noAkun",
          width: "200px",
        },
      ],
    };
  },
  mounted() {
    this.$root.$on("formOuCashBankForm", (id) => {
      this.idOu = id;
      this.getCashBankOuNotMapping(id);
      this.getCashBankOuMapping(id);
    });
  },
  methods: {
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    closeOuCashBank() {
      this.$root.$emit("formOuCashBank", this.formOuCashBank);
    },
    selectRow(data, select) {
      if (select === "yes") {
        this.addCashBankOu(data, this.idOu);
      } else {
        this.removeCashBankOu(data, this.idOu);
      }
      this.checked = false;
    },
    addData() {
      console.log(this.selected);
      const newArr = this.selected.map(
        ({ cashbankCode, cashbankId, cashbankName }) => ({
          cashbankId,
          cashbankCode,
          cashbankName,
        })
      );
      console.log(newArr);
    },
    addCashBankOu(data, id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const selectedCashbank = this.selected.map(
        ({ cashbankCode, cashbankId, cashbankName }) => ({
          cashbankId,
          cashbankCode,
          cashbankName,
        })
      );
      axios
        .post(
          `${themeConfig.app.api_master}/cashbank-ou/add`,
          {
            ouId: parseInt(this.idOu),
            // cashbankList: [
            //   {
            //     cashbankId: parseInt(data.cashbankId),
            //     cashbankCode: data.cashbankCode,
            //     cashbankName: data.cashbankName,
            //   },
            // ],
            cashbankList: selectedCashbank,
          },
          config
        )
        .then((response) => {
          this.checked = false;
          this.getCashBankOuNotMapping(this.idOu);
          this.getCashBankOuMapping(this.idOu);
          this.notif("success", "Success", "Cash/Bank Added!");
        })
        .catch((e) => {
          this.notif("error", "Gagal", e.response.data.meta.message);
        });
    },
    removeCashBankOu(data, id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/cashbank-ou/remove/${data.cashbankId}`,
          config
        )
        .then((response) => {
          this.checked = false;
          this.getCashBankOuNotMapping(this.idOu);
          this.getCashBankOuMapping(this.idOu);
          this.notif("success", "Success", "Cash/Bank Removed!");
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    getCashBankOuNotMapping(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/cashbank-ou/list/unassigned/${id}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainDataNotMapping = response.data.result;
            this.mainDataNotMapping.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataNotMapping[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainDataNotMapping[index].logoImage =
                    this.mainDataNotMapping[index].bankCode;
                }
              } catch (e) {
                this.mainDataNotMapping[index].logoImage = "NONE";
              }
            });
          } else {
            this.mainDataNotMapping = [];
          }
          this.isDialogVisible = false;
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
          this.isDialogVisible = false;
        });
    },
    getCashBankOuMapping(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/cashbank-ou/list/${id}`, config)
        .then((response) => {
          if (response.data.result !== null) {
            this.mainDataMapping = response.data.result;
            this.mainDataMapping.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataMapping[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainDataMapping[index].logoImage =
                    this.mainDataMapping[index].bankCode;
                }
              } catch (e) {
                this.mainDataMapping[index].logoImage = "NONE";
              }
            });
          } else {
            this.mainDataMapping = [];
          }
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
  },
};
</script>
