<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="pb-1 ml-3">
            Partner Bank
            <v-spacer></v-spacer>
            <v-btn color="secondary" text small fab @click="closePartnerBank()">
              <v-icon dark>
                {{ icons.mdiClose }}
              </v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-col cols="12" md="12">
              <v-row>
                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <app-autocomplite-bank
                    :value-bank.sync="form.bankCode"
                  ></app-autocomplite-bank>
                  <!-- <v-select
                    :items="bankList"
                    v-model="form.bankCode"
                    item-text="propKey"
                    item-value="code"
                    hide-details="auto"
                    class="mb-0"
                    label="Bank"
                    dense
                  >
                    <template #selection="data">
                      <v-avatar left color="#e6e6e6" size="30">
                        <v-img
                          :src="
                            require(`@/assets/images/logos/bank_logo/${data.item.code}_logo.png`)
                          "
                        ></v-img>
                      </v-avatar>
                      <span class="font-weight-semibold">
                        {{ data.item.propKey }}</span
                      >
                    </template>
                    <template #item="data">
                      <template>
                        <v-list-item-content>
                          <v-list-item-title>
                            <v-avatar left color="#e6e6e6" size="30">
                              <v-img
                                :src="
                                  require(`@/assets/images/logos/bank_logo/${data.item.code}_logo.png`)
                                "
                              ></v-img>
                            </v-avatar>
                            <span class="font-weight-semibold">
                              {{ data.item.propKey }}</span
                            >
                          </v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-select> -->
                </v-col>

                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-text-field
                    label="Account No"
                    v-model="form.accountNo"
                    persistent-placeholder
                    placeholder="Insert Account No"
                    hide-details
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6" class="pb-0 mt-2">
                  <v-text-field
                    label="Account Name"
                    v-model="form.accountName"
                    persistent-placeholder
                    placeholder="Insert Account Name"
                    hide-details
                    dense
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="mt-2">
                  <v-text-field
                    label="Remark"
                    v-model="form.remark"
                    persistent-placeholder
                    placeholder="Insert Remark"
                    hide-details
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" dark small @click="addForm()"> Cancel </v-btn>
            <v-btn
              v-show="!cekAccount && showAdd"
              color="primary"
              dark
              small
              type="submit"
              @click="addData()"
            >
              Save
            </v-btn>
            <v-btn
              v-show="cekAccount && showAdd"
              :loading="loadings"
              :disabled="loadings"
              @click="triggerLoading('loadings')"
              color="primary"
              dark
              small
              type="submit"
            >
              check account number
              <template #loader>
                <span class="custom-loader">
                  <v-icon light>{{ icons.mdiCached }}</v-icon>
                </span>
              </template>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span>List</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="12">
                <v-data-table
                  :headers="headers"
                  :items="mainData"
                  fixed-header
                  height="450px"
                  dense
                >
                  <!-- action -->
                  <template #[`item.actions`]="{ item }">
                    <v-tooltip bottom color="error">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          x-small
                          icon
                          color="error"
                          v-bind="attrs"
                          @click="confirmDialog(item.id)"
                          v-on="on"
                          v-show="showDelete"
                        >
                          <v-icon>
                            {{ icons.mdiDelete }}
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                  </template>
                  <template #[`item.bankCode`]="{ item }">
                    <div class="d-flex align-center">
                      <v-avatar v-if="item.logoImage" color="#e6e6e6" size="30">
                        <v-img
                          :src="
                            require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                          "
                        ></v-img>
                      </v-avatar>
                      <span v-else> - </span>
                    </div>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "@axios";
import themeConfig from "@themeConfig";
import Form from "vform";
import { mdiCached, mdiClose, mdiDelete } from "@mdi/js";
import { isInArray } from "../../../constan";
import AppAutocompliteBank from "@/@core/components/app-autocomplite-ou/AppAutocompliteBank.vue";

export default {
  name: "childPartnerBank",
  components: {
    AppAutocompliteBank,
  },
  data() {
    return {
      formPartnerBank: false,
      cekAccount: true,
      loadings: false,
      showAdd:
        isInArray("addPartnerBank", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray("removePartnerBank", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      idPartner: "",
      mainData: [],
      bankList: [],
      icons: {
        mdiClose,
        mdiDelete,
        mdiCached,
      },
      headers: [
        {
          text: "",
          value: "actions",
          width: "20px",
        },
        {
          text: "Bank",
          value: "bankCode",
          width: "100px",
        },
        {
          text: "Account No",
          value: "accountNo",
          width: "200px",
        },
        {
          text: "Account Name",
          value: "accountName",
          width: "250px",
        },
        {
          text: "Remark",
          value: "remark",
        },
      ],
      form: new Form({
        bankCode: "",
        accountNo: "",
        accountName: "",
        remark: "",
      }),
    };
  },
  mounted() {
    this.$root.$on("formPartnerBankForm", (id) => {
      this.mainData = [];
      this.idPartner = id;
      this.getPartnerBank(id);
    });
    this.getBankList();
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => {
        this[l] = false;
      }, 3000);

      this.loader = null;
    },
  },
  methods: {
    async triggerLoading() {
      this.loadings = true;
      await this.getAccountInquiryFlip();
      this.loadings = false;
    },
    closePartnerBank() {
      this.$root.$emit("formPartnerBank", this.formPartnerBank);
    },
    addForm() {
      this.form.reset();
      this.form.clear();
    },
    getBankList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/combo/list?comboId=BANK`, config)
        .then((response) => {
          if (response.data.result !== null)
            return (this.bankList = response.data.result);
          this.bankList = [];
        })
        .catch((e) => {
          this.$notify("error", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    async getAccountInquiryFlip() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/cashbank/flip-bank-account-inquiry?accountNo=${this.form.accountNo}&bankCode=${this.form.bankCode}`,
          config
        )
        .then((response) => {
          if (response.data.result.status == "SUCCESS") {
            this.cekAccount = false;
          }
          this.form.accountName = response.data.result.accountHolder;
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          } else if (e.response.status === 400) {
            this.$notify("warning", e.response.data.meta.message);
          } else {
            this.$notify("error", e.response.data.message);
          }
        });
    },
    addData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_master}/partner/add-bank`,
          {
            partnerId: this.idPartner,
            bankCode: this.form.bankCode,
            accountNo: this.form.accountNo,
            accountName: this.form.accountName,
            remark: this.form.remark,
          },
          config
        )
        .then((response) => {
          this.addForm();
          this.getPartnerBank(this.idPartner);
          this.cekAccount = true;
          this.$notify("success", response.data.meta.message);
        })
        .catch((e) => {
          this.cekAccount = true;
          this.$notify("error", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    confirmDialog(id) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.removeData(id);
          setTimeout(() => {
            dialog.close();
          }, 1500);
        })
        .catch(() => {
          this.getPartnerBank(this.idPartner);
        });
    },
    removeData(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_master}/partner/remove-bank/${id}`, config)
        .then((response) => {
          this.getPartnerBank(this.idPartner);
          this.$notify("success", response.data.meta.message);
        })
        .catch((e) => {
          this.$notify("error", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getPartnerBank(id) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/partner/partner-bank-list/${id}`,
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.mainData.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainData[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainData[index].logoImage =
                    this.mainData[index].bankCode;
                }
                // do something
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
                // do something else
              }
            });
          } else {
            this.mainData = [];
          }
        })
        .catch((e) => {
          this.$notify("error", e.response.data.message);
        });
    },
  },
};
</script>
