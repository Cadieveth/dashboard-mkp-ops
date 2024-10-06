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
    <v-dialog v-model="depositItemList" persistent width="1200">
      <v-card class="px-4 pb-6">
        <v-card-title class="font-weight-bold">
          <span> Deposit Item </span>
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="d-flex justify-content-between">
          <v-row class="">
            <v-col cols="12" md="4" sm="6" class="pb-0">
              <app-autocomplite-ou-branch
                :form-value.sync="formCreate.ouBranchId"
                :ou-branch-type="'cashbankTransferCreate'"
              ></app-autocomplite-ou-branch>
            </v-col>
            <v-col cols="12" md="4" sm="6" class="pb-0">
              <app-autocomplite-ou-subbranch
                :ou-sub-branch-type="'cashbankTransferCreate'"
                :form-value.sync="formCreate.ouSubBranchId"
              ></app-autocomplite-ou-subbranch>
            </v-col>
            <v-col cols="12" md="4" sm="12" class="pb-0">
              <app-autocomplite-cashbank-user
                :value-bank-ou.sync="formCreate.cashbankFromId"
                :label-text="'Source Bank'"
              ></app-autocomplite-cashbank-user>
            </v-col>
          </v-row>

          <v-btn
            class="ml-4"
            color="primary"
            small
            dark
            @click="refreshDataDeposit()"
          >
            <v-icon dark left>
              {{ icons.mdiMagnify }}
            </v-icon>
            Filter
          </v-btn>
        </v-card-text>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn color="success" small dark @click="addDataItemDraft()">
            <v-icon dark left>
              {{ icons.mdiPlus }}
            </v-icon>
            Add To Bucked
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div>
            <v-tabs grow v-model="currentTabDeposit">
              <v-tab> Daily </v-tab>
              <v-tab> Special </v-tab>
            </v-tabs>
            <v-tabs-items v-model="currentTabDeposit">
              <v-tab-item>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <v-card flat>
                      <v-card-text class="pb-4">
                        <v-data-table
                          :headers="headersDeposit"
                          :items="mainDataDepositDaily"
                          hide-default-footer
                          disable-pagination
                          fixed-header
                          dense
                          v-model="selected"
                          item-key="id"
                          show-select
                          @toggle-select-all="selectAllToggle"
                        >
                          <!--header-->
                          <template #[`header.ouBranch`]>
                            {{ ouBranch }}
                          </template>
                          <template #[`header.ouSubBranch`]>
                            {{ ouSubBranch }}
                          </template>
                          <template #[`header.account`]>
                            {{ sourceBank }}
                          </template>

                          <!-- Unit Bisnis -->
                          <template #[`item.ouBranch`]="{ item }">
                            <div>
                              <span
                                class="
                                  d-block
                                  text--primary
                                  font-weight-semibold
                                  text-truncate
                                "
                                >{{ item.ouBranchName }}</span
                              >
                              <span class="text-xs">{{
                                item.ouBranchCode
                              }}</span>
                            </div>
                          </template>
                          <template #[`item.ouSubBranch`]="{ item }">
                            <div>
                              <span
                                class="
                                  d-block
                                  text--primary
                                  font-weight-semibold
                                  text-truncate
                                "
                                >{{ item.ouSubBranchName }}</span
                              >
                              <span class="text-xs">{{
                                item.ouSubBranchCode
                              }}</span>
                            </div>
                          </template>

                          <!-- penerima-->
                          <template #[`item.account`]="{ item }">
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
                                <span class="text-xs">{{
                                  item.accountNo
                                }}</span>
                              </div>
                            </div>
                          </template>

                          <!-- format uang-->
                          <template #[`item.amount`]="{ item }">
                            Rp.{{ number_format(item.amount) }}
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row id="table-special">
                  <v-col cols="12" class="pb-0">
                    <v-card flat>
                      <v-card-text class="pb-4">
                        <v-data-table
                          :headers="headersDeposit"
                          :items="mainDataDepositSpecial"
                          hide-default-footer
                          disable-pagination
                          fixed-header
                          dense
                          v-model="selectedSpecial"
                          item-key="id"
                          show-select
                          @toggle-select-all="selectAllToggle"
                        >
                          <!-- <template
                                                v-slot:item.data-table-select="{
                                                  item,
                                                  isSelected,
                                                  select,
                                                }"
                                              >
                                                <v-simple-checkbox
                                                  :ripple="false"
                                                  :value="isSelected"
                                                  @input="select($event)"
                                                  @click="selectToggle(isSelected, item)"
                                                ></v-simple-checkbox>
                                              </template> -->

                          <!--header-->
                          <template #[`header.ouBranch`]>
                            {{ ouBranch }}
                          </template>
                          <template #[`header.ouSubBranch`]>
                            {{ ouSubBranch }}
                          </template>
                          <template #[`header.account`]>
                            {{ sourceBank }}
                          </template>

                          <!-- Unit Bisnis -->
                          <template #[`item.ouBranch`]="{ item }">
                            <div>
                              <span
                                class="
                                  d-block
                                  text--primary
                                  font-weight-semibold
                                  text-truncate
                                "
                                >{{ item.ouBranchName }}</span
                              >
                              <span class="text-xs">{{
                                item.ouBranchCode
                              }}</span>
                            </div>
                          </template>
                          <template #[`item.ouSubBranch`]="{ item }">
                            <div>
                              <span
                                class="
                                  d-block
                                  text--primary
                                  font-weight-semibold
                                  text-truncate
                                "
                                >{{ item.ouSubBranchName }}</span
                              >
                              <span class="text-xs">{{
                                item.ouSubBranchCode
                              }}</span>
                            </div>
                          </template>

                          <!-- penerima-->
                          <template #[`item.account`]="{ item }">
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
                                <span class="text-xs">{{
                                  item.accountNo
                                }}</span>
                              </div>
                            </div>
                          </template>

                          <!-- format uang-->
                          <template #[`item.amount`]="{ item }">
                            Rp.{{ number_format(item.amount) }}
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-card-text>
        <!-- <v-card-title>
          <v-spacer></v-spacer>
   
        </v-card-title> -->
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class=""><span>Deposit Settlement</span></v-card-title>
          <v-card-text>
            <!-- Tabel list kas/bank transfer -->
            <div>
              <v-tabs grow v-model="currentTab" @change="refreshDataFilter()">
                <v-tab> Create </v-tab>
                <v-tab> Draft </v-tab>
                <v-tab> In Progress </v-tab>
                <v-tab> Approved </v-tab>
              </v-tabs>
              <v-tabs-items v-model="currentTab">
                <v-tab-item>
                  <v-row>
                    <v-col cols="12" class="pb-0 mt-2">
                      <cash-bank-transfer-filter-create></cash-bank-transfer-filter-create>

                      <v-card-title class="mt-n12 pt-0">
                        <!-- <v-btn
                            color="success"
                            small
                            dark
                            @click="addDataItemDraft()"
                          >
                            <v-icon dark left>
                              {{ icons.mdiPlus }}
                            </v-icon>
                            Add To Bucked
                          </v-btn> -->
                        <v-spacer></v-spacer>

                        <v-btn
                          color="primary"
                          small
                          dark
                          @click="addData()"
                          v-show="showAdd"
                        >
                          <v-icon dark left>
                            {{ icons.mdiPlus }}
                          </v-icon>
                          Create Deposit
                        </v-btn>
                        <span class="me-2"> </span>
                        <v-btn
                          color="primary"
                          small
                          dark
                          @click="addDataWithoutDeposit()"
                          v-show="false"
                        >
                          <v-icon dark left>
                            {{ icons.mdiPlus }}
                          </v-icon>
                          Create Without Deposit
                        </v-btn>
                      </v-card-title>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-card flat>
                        <v-card-title class="mt-n6 py-0">
                          <v-spacer></v-spacer>
                          <span class="menu-title me-2">Total Amount:</span>
                          <span class="bold-title me-3"
                            >Rp. {{ number_format(amountTotal) }}</span
                          >
                        </v-card-title>
                        <v-card-text class="mt-n10">
                          <v-row>
                            <v-col cols="12" md="0" class=""> </v-col>
                            <v-col cols="12" md="12" class="">
                              <v-data-table
                                :headers="headersDepositDraft"
                                :items="mainDataDepositBucked"
                                hide-default-footer
                                disable-pagination
                                fixed-header
                                dense
                              >
                                <!--header-->
                                <template #[`header.ouBranch`]>
                                  {{ ouBranch }}
                                </template>
                                <template #[`header.ouSubBranch`]>
                                  {{ ouSubBranch }}
                                </template>
                                <template #[`header.account`]>
                                  {{ sourceBank }}
                                </template>

                                <!-- Unit Bisnis -->
                                <template #[`item.ouBranch`]="{ item }">
                                  <div>
                                    <span
                                      class="
                                        d-block
                                        text--primary
                                        font-weight-semibold
                                        text-truncate
                                      "
                                      >{{ item.ouBranchName }}</span
                                    >
                                    <span class="text-xs">{{
                                      item.ouBranchCode
                                    }}</span>
                                  </div>
                                </template>
                                <template #[`item.ouSubBranch`]="{ item }">
                                  <div>
                                    <span
                                      class="
                                        d-block
                                        text--primary
                                        font-weight-semibold
                                        text-truncate
                                      "
                                      >{{ item.ouSubBranchName }}</span
                                    >
                                    <span class="text-xs">{{
                                      item.ouSubBranchCode
                                    }}</span>
                                  </div>
                                </template>

                                <!-- penerima-->
                                <template #[`item.account`]="{ item }">
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
                                      <span class="text-xs">{{
                                        item.accountNo
                                      }}</span>
                                    </div>
                                  </div>
                                </template>

                                <!-- format uang-->
                                <template #[`item.amount`]="{ item }">
                                  Rp.{{ number_format(item.amount) }}
                                </template>

                                <!-- action -->
                                <template #[`item.actions`]="{ item }">
                                  <v-tooltip bottom color="error">
                                    <template #activator="{ on, attrs }">
                                      <v-btn
                                        x-small
                                        icon
                                        color="error"
                                        v-bind="attrs"
                                        @click="confirmDialogDraft(item.id)"
                                        v-on="on"
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
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row id="table-draft">
                    <v-col cols="12" class="pb-0 mt-2">
                      <cash-bank-transfer-filter-doc></cash-bank-transfer-filter-doc>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-card flat>
                        <v-card-text>
                          <v-row class="mb-4">
                            <v-col md="1" sd="2">
                              <v-select
                                v-model="itemPerPageDraft"
                                :items="itemRow"
                                label="Rows"
                                class="select"
                                hide-details
                                :menu-props="{ maxWidth: '250' }"
                                @change="getItemPerPage('Draft')"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" offset-md="7" md="4">
                              <v-text-field
                                v-model="searchDraft"
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
                            :items-per-page="itemPerPageDraft"
                            :search="searchDraft"
                            fixed-header
                            hide-default-footer
                            dense
                          >
                            <!--header-->
                            <template #[`header.docNo`]>
                              {{ docNo }}
                            </template>
                            <template #[`header.tanggal`]>
                              {{ docDate }}
                            </template>
                            <template #[`header.ou`]>
                              {{ ouTbl }}
                            </template>

                            <!-- format tanggal-->
                            <template #[`item.tanggal`]="{ item }">
                              {{ dateFormat(item.docDate) }}
                            </template>

                            <!-- format uang-->
                            <template #[`item.paymentAmount`]="{ item }">
                              Rp.{{ number_format(item.transferAmount) }}
                            </template>

                            <!-- penerima-->
                            <template #[`item.penerima`]="{ item }">
                              {{ item.accountNo }} a/n {{ item.accountName }}
                            </template>

                            <!-- unit business-->
                            <template #[`item.ou`]="{ item }">
                              <div>
                                <span
                                  class="
                                    d-block
                                    text--primary
                                    font-weight-semibold
                                    text-truncate
                                  "
                                  >{{ item.ouName }}</span
                                >
                                <span class="text-xs">{{ item.ouCode }}</span>
                              </div>
                            </template>

                            <!-- Status Disbursement-->
                            <template #[`item.statusDis`]="{ item }">
                              <v-chip
                                small
                                :class="`${
                                  item.statusDisbursement == 'D'
                                    ? 'warning'
                                    : item.statusDisbursement == 'I'
                                    ? 'info'
                                    : item.statusDisbursement == 'R'
                                    ? 'success'
                                    : 'error'
                                }--text`"
                                class="
                                  v-chip-light-bg
                                  font-weight-semibold
                                  text-capitalize
                                "
                                :color="
                                  item.statusDisbursement == 'D'
                                    ? 'warning'
                                    : item.statusDisbursement == 'I'
                                    ? 'info'
                                    : item.statusDisbursement == 'R'
                                    ? 'success'
                                    : 'error'
                                "
                              >
                                {{
                                  item.statusDisbursement == "D"
                                    ? "DRAFT"
                                    : item.statusDisbursement == "I"
                                    ? "INPROGRESS"
                                    : item.statusDisbursement == "R"
                                    ? "RELEASED"
                                    : "FAILED"
                                }}
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
                                    v-show="showEdit"
                                  >
                                    <v-icon>
                                      {{ icons.mdiClipboardEditOutline }}
                                    </v-icon>
                                  </v-btn>
                                </template>
                                <span>Edit</span>
                              </v-tooltip>
                              <v-tooltip bottom color="error">
                                <template #activator="{ on, attrs }">
                                  <v-btn
                                    x-small
                                    icon
                                    color="error"
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="confirmDialog(item.id)"
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
                          </v-data-table>
                          <v-pagination
                            v-model="currentPageDraft"
                            :length="totalPagesDraft"
                            @input="handlePageChange('Draft')"
                            total-visible="5"
                            v-scroll-to="'#table-draft'"
                          ></v-pagination>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row id="table-inprogress">
                    <v-col cols="12" class="pb-0 mt-2">
                      <cash-bank-transfer-filter-doc></cash-bank-transfer-filter-doc>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-card flat>
                        <v-card-text>
                          <v-row class="mb-4">
                            <v-col md="1" sd="2">
                              <v-select
                                v-model="itemPerPageInProgress"
                                :items="itemRow"
                                label="Rows"
                                class="select"
                                hide-details
                                :menu-props="{ maxWidth: '250' }"
                                @change="getItemPerPage('InProgress')"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" offset-md="7" md="4">
                              <v-text-field
                                v-model="searchInProgress"
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
                            :items="mainDataInProgress"
                            :items-per-page="itemPerPageInProgress"
                            :search="searchInProgress"
                            fixed-header
                            hide-default-footer
                            dense
                          >
                            <!--header-->
                            <template #[`header.docNo`]>
                              {{ docNo }}
                            </template>
                            <template #[`header.tanggal`]>
                              {{ docDate }}
                            </template>
                            <template #[`header.ou`]>
                              {{ ouTbl }}
                            </template>

                            <!-- format tanggal-->
                            <template #[`item.tanggal`]="{ item }">
                              {{ dateFormat(item.docDate) }}
                            </template>

                            <!-- format uang-->
                            <!--                            <template #[`item.transferAmount`]="{ item }">-->
                            <!--                              Rp.{{ number_format(item.transferAmount) }}-->
                            <!--                            </template>-->
                            <!--                            <template-->
                            <!--                              #[`item.transferFeeBankAmount`]="{ item }"-->
                            <!--                            >-->
                            <!--                              Rp.{{ number_format(item.transferFeeBankAmount) }}-->
                            <!--                            </template>-->
                            <template #[`item.paymentAmount`]="{ item }">
                              Rp.{{ number_format(item.transferAmount) }}
                            </template>

                            <!-- penerima-->
                            <template #[`item.penerima`]="{ item }">
                              {{ item.accountNo }} a/n {{ item.accountName }}
                            </template>

                            <!-- unit business-->
                            <template #[`item.ou`]="{ item }">
                              <div>
                                <span
                                  class="
                                    d-block
                                    text--primary
                                    font-weight-semibold
                                    text-truncate
                                  "
                                  >{{ item.ouName }}</span
                                >
                                <span class="text-xs">{{ item.ouCode }}</span>
                              </div>
                            </template>

                            <!-- Status Disbursement-->
                            <template #[`item.statusDis`]="{ item }">
                              <v-chip
                                small
                                :class="`${
                                  item.statusDisbursement == 'D'
                                    ? 'warning'
                                    : item.statusDisbursement == 'I'
                                    ? 'info'
                                    : item.statusDisbursement == 'R'
                                    ? 'success'
                                    : 'error'
                                }--text`"
                                class="
                                  v-chip-light-bg
                                  font-weight-semibold
                                  text-capitalize
                                "
                                :color="
                                  item.statusDisbursement == 'D'
                                    ? 'warning'
                                    : item.statusDisbursement == 'I'
                                    ? 'info'
                                    : item.statusDisbursement == 'R'
                                    ? 'success'
                                    : 'error'
                                "
                              >
                                {{
                                  item.statusDisbursement == "D"
                                    ? "DRAFT"
                                    : item.statusDisbursement == "I"
                                    ? "INPROGRESS"
                                    : item.statusDisbursement == "R"
                                    ? "RELEASED"
                                    : "FAILED"
                                }}
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
                                    v-show="showEdit"
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
                            v-model="currentPageInProgress"
                            :length="totalPagesInProgress"
                            @input="handlePageChange('InProgress')"
                            total-visible="5"
                            v-scroll-to="'#table-inprogress'"
                          ></v-pagination>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row id="table-approved">
                    <v-col cols="12" class="pb-0 mt-2">
                      <cash-bank-transfer-filter-doc></cash-bank-transfer-filter-doc>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-card flat>
                        <v-card-text>
                          <v-row class="mb-4">
                            <v-col md="1" sd="2">
                              <v-select
                                v-model="itemPerPageRelease"
                                :items="itemRow"
                                label="Rows"
                                class="select"
                                hide-details
                                :menu-props="{ maxWidth: '250' }"
                                @change="getItemPerPage('Release')"
                              ></v-select>
                            </v-col>
                            <v-col cols="12" offset-md="7" md="4">
                              <v-text-field
                                v-model="searchRelease"
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
                            :items="mainDataRelease"
                            :items-per-page="itemPerPageRelease"
                            :search="searchRelease"
                            fixed-header
                            hide-default-footer
                            dense
                          >
                            <!--header-->
                            <template #[`header.docNo`]>
                              {{ docNo }}
                            </template>
                            <template #[`header.tanggal`]>
                              {{ docDate }}
                            </template>
                            <template #[`header.ou`]>
                              {{ ouTbl }}
                            </template>

                            <!-- format tanggal-->
                            <template #[`item.tanggal`]="{ item }">
                              {{ dateFormat(item.docDate) }}
                            </template>

                            <!-- format uang-->
                            <!--                            <template #[`item.transferAmount`]="{ item }">-->
                            <!--                              Rp.{{ number_format(item.transferAmount) }}-->
                            <!--                            </template>-->
                            <!--                            <template-->
                            <!--                              #[`item.transferFeeBankAmount`]="{ item }"-->
                            <!--                            >-->
                            <!--                              Rp.{{ number_format(item.transferFeeBankAmount) }}-->
                            <!--                            </template>-->
                            <template #[`item.paymentAmount`]="{ item }">
                              Rp.{{ number_format(item.transferAmount) }}
                            </template>

                            <!-- penerima-->
                            <template #[`item.penerima`]="{ item }">
                              {{ item.accountNo }} a/n {{ item.accountName }}
                            </template>

                            <!-- unit business-->
                            <template #[`item.ou`]="{ item }">
                              <div>
                                <span
                                  class="
                                    d-block
                                    text--primary
                                    font-weight-semibold
                                    text-truncate
                                  "
                                  >{{ item.ouName }}</span
                                >
                                <span class="text-xs">{{ item.ouCode }}</span>
                              </div>
                            </template>

                            <!-- Status Dokumen-->
                            <template #[`item.statusDoc`]="{ item }">
                              <v-chip
                                small
                                :class="`${
                                  item.statusDisbursement == 'D'
                                    ? 'warning'
                                    : item.statusDisbursement == 'I'
                                    ? 'info'
                                    : item.statusDisbursement == 'R'
                                    ? 'success'
                                    : 'error'
                                }--text`"
                                class="
                                  v-chip-light-bg
                                  font-weight-semibold
                                  text-capitalize
                                "
                                :color="
                                  item.workflowStatus == 'DRAFT'
                                    ? 'warning'
                                    : item.workflowStatus == 'IN PROGRESS'
                                    ? 'info'
                                    : item.workflowStatus == 'RELEASED'
                                    ? 'success'
                                    : 'error'
                                "
                              >
                                {{
                                  item.workflowStatus == "RELEASED"
                                    ? "APPROVED"
                                    : item.workflowStatus
                                }}
                              </v-chip>
                            </template>

                            <!-- Status Disbursement-->
                            <template #[`item.statusDis`]="{ item }">
                              <v-chip
                                outlined
                                :color="
                                  item.statusDisbursement == 'D'
                                    ? 'warning'
                                    : item.statusDisbursement == 'I'
                                    ? 'info'
                                    : item.statusDisbursement == 'R'
                                    ? 'success'
                                    : 'error'
                                "
                              >
                                {{
                                  item.statusDisbursement == "D"
                                    ? "DRAFT"
                                    : item.statusDisbursement == "I"
                                    ? "INPROGRESS"
                                    : item.statusDisbursement == "R"
                                    ? "RELEASED"
                                    : "FAILED"
                                }}
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
                                    v-show="showEdit"
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
                            v-model="currentPageRelease"
                            :length="totalPagesRelease"
                            @input="handlePageChange('Release')"
                            total-visible="5"
                            v-scroll-to="'table-approved'"
                          ></v-pagination>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
              </v-tabs-items>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import moment from "moment";
import Form from "vform";
import {
  mdiCalendar,
  mdiClipboardEditOutline,
  mdiDelete,
  mdiMagnify,
  mdiPlus,
  mdiClose,
} from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";
import { dateFormat, isInArray, number_format } from "../../../constan";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import CashBankTransferFilterDoc from "@/views/cash-bank-transfer/CashBankTransferFilterDoc";
import CashBankTransferFilterCreate from "@/views/cash-bank-transfer/CashBankTransferFilterCreate";
import AppAutocompliteOuBranch from "@core/components/app-autocomplite-ou/AppAutocompliteOuBranch";
import AppAutocompliteOuSubbranch from "@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranch";

import AppAutocompliteCashbankUser from "@/@core/components/app-autocomplite-ou/AppAutocompliteCashbankUser.vue";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import "../../styles/textstyle.css";
import { log } from "console";

Vue.use(VueScrollTo);

export default {
  name: "Child",
  components: {
    AppAutocompliteOu,
    CashBankTransferFilterDoc,
    CashBankTransferFilterCreate,
    AppAutocompliteOuBranch,
    AppAutocompliteOuSubbranch,
    AppAutocompliteCashbankUser,
    AppCardLoader,
  },
  data() {
    return {
      labelDocNo: themeConfig.labeling.docNo,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,
      ouCode: themeConfig.labeling.ouCodeTbl,
      ouName: themeConfig.labeling.ouNameTbl,
      ouBranch: themeConfig.labeling.ouTblB,
      ouSubBranch: themeConfig.labeling.ouTblSB,
      sourceBank: themeConfig.labeling.sourceBank,
      phOuSB: themeConfig.labeling.ouSB,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",

      isDialogVisible: false,
      menuStart: false,
      menuEnd: false,
      formCashBankTransfer: true,
      formCashBankTransferWithoutDeposit: true,

      // role
      showAdd:
        isInArray(
          "addCashbankTransfer",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray(
          "editCashbankTransfer",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray(
          "removeCashbankTransfer",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      // deposit pop up
      depositItemList: false,

      ouList: [],
      currentTab: 0,
      currentTabDeposit: 0,
      itemRow: [25, 50, 100],
      //Tab Draft
      searchDraft: "",
      currentPageDraft: 1,
      totalPagesDraft: 1,
      ofsetDraft: 0,
      itemPerPageDraft: 25,
      //Tab InProgress
      searchInProgress: "",
      currentPageInProgress: 1,
      totalPagesInProgress: 1,
      ofsetInProgress: 0,
      itemPerPageInProgress: 25,
      //Tab Release
      searchRelease: "",
      currentPageRelease: 1,
      totalPagesRelease: 1,
      ofsetRelease: 0,
      itemPerPageRelease: 25,
      mainData: [],
      mainDataInProgress: [],
      mainDataRelease: [],
      mainDataDeposit: [],
      mainDataDepositDaily: [],
      mainDataDepositSpecial: [],
      selected: [],
      selectedSpecial: [],
      mainDataDepositBucked: [],
      mainDataConfig: [],
      amountTotal: 0,
      icons: {
        mdiCalendar,
        mdiDelete,
        mdiClipboardEditOutline,
        mdiMagnify,
        mdiPlus,
        mdiClose,
      },
      formCreate: new Form({
        ouId: -99,
        ouBranchId: -99,
        cashbankFromId: -99,
        cashbankToId: -99,
        bankCodeTo: "",
        accountNoTo: "",
        accountNameTo: "",
        ouSubBranchId: -99,
      }),

      form: new Form({
        ouId: -99,
        docNo: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      formIn: new Form({
        ouId: -99,
        docNo: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      formApproved: new Form({
        ouId: -99,
        docNo: "",
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "Nomor Dokumen",
          value: "docNo",
          width: "250px",
        },
        {
          text: "Tanggal",
          value: "tanggal",
          width: "150px",
        },
        {
          text: "Unit Bisnis",
          value: "ou",
          width: "170px",
        },
        {
          text: "Amount",
          align: "right",
          value: "paymentAmount",
          width: "150px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "500px",
        },
      ],
      headersDeposit: [
        {
          text: "OUBranch",
          value: "ouBranch",
          width: "200px",
        },
        {
          text: "OUSubBranch",
          value: "ouSubBranch",
          width: "150px",
        },
        {
          text: "Account",
          value: "account",
          width: "200px",
        },
        {
          text: "Amount",
          value: "amount",
          width: "150px",
          align: "right",
        },
      ],
      headersDepositDraft: [
        {
          text: "Actions",
          align: "center",
          value: "actions",
          sortable: false,
          width: "100px",
        },
        {
          text: "OUBranch",
          value: "ouBranch",
          width: "200px",
        },
        {
          text: "OUSubBranch",
          value: "ouSubBranch",
          width: "150px",
        },
        {
          text: "Account",
          value: "account",
          width: "200px",
        },
        {
          text: "Amount",
          value: "amount",
          width: "150px",
          align: "right",
        },
      ],
    };
  },
  mounted() {
    this.refreshDataFilter();
    this.$root.$on("formCashBankTransferReturn", (msg) => {
      if (msg != "Cancel deposit!.") {
        this.amountTotal = 0;
        this.selected = [];
        this.mainDataDepositBucked = [];
      } else {
        if (this.currentTab == 0) {
          // this.refreshDataDeposit();
          this.amountTotal = 0;
          this.mainDataDepositBucked.forEach((element, index) => {
            this.amountTotal += this.mainDataDepositBucked[index].amount;
          });
        } else {
          this.refreshData();
        }
      }
      this.mainDataDepositBucked = [];
      this.mainDataDeposit = [];
      this.amountTotal = 0;
    });
    this.$root.$on("filterTransferCreate", async (msg) => {
      this.formCreate.ouId = msg.ouId;
      this.mainDataDeposit = [];
      this.formCreate.cashbankToId = msg.cashbankToId;
      await this.getConfigSpecialDeposit();
      await this.refreshDataDeposit();
      this.depositItemList = true;
    });
    this.$root.$on("filterTransferCreateBeneficiaryBank", (msg) => {
      this.formCreate.bankCodeTo = msg.bankCode;
      this.formCreate.accountNameTo = msg.accountName;
      this.formCreate.accountNoTo = msg.accountNo;
    });
    this.$root.$on("filterTransferCreateSourceBank", (msg) => {
      //     bankCodeTo: "",
      // accountNoTo: "",
      // accountNameTo: "",
      // this.formCreate.bankCodeTo = msg.bankCode;
      // this.formCreate.accountNameTo = msg.accountName;
      // this.formCreate.accountNoTo = msg.accountNo;
    });
    this.$root.$on("filterTransferDoc", (msg) => {
      if (this.currentTab == 1) {
        this.form = msg;
        this.currentPageDraft = 1;
        this.ofsetDraft = 0;
      } else if (this.currentTab == 2) {
        this.formIn = msg;
        this.currentPageInProgress = 1;
        this.ofsetInProgress = 0;
      } else if (this.currentTab == 3) {
        this.formApproved = msg;
        this.currentPageRelease = 1;
        this.ofsetRelease = 0;
      }
      this.refreshData();
    });
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
    number_format(value) {
      return number_format(value, 2, ",", ".");
    },
    getItemPerPage(val) {
      if (val == "Draft") {
        this.currentPageDraft = 1;
        this.ofsetDraft = 0;
        this.refreshData();
      } else if (val == "InProgress") {
        this.currentPageInProgress = 1;
        this.ofsetInProgress = 0;
        this.refreshData();
      } else if (val == "Release") {
        this.currentPageRelease = 1;
        this.ofsetRelease = 0;
        this.refreshData();
      }
    },
    closeForm() {
      this.depositItemList = false;
    },
    handlePageChange(value) {
      if (value == "Draft") {
        if (this.currentPageDraft == 1) {
          this.ofsetDraft = 0;
        } else {
          this.ofsetDraft = (this.currentPageDraft - 1) * this.itemPerPageDraft;
        }
        this.refreshData();
      } else if (value == "InProgress") {
        if (this.currentPageInProgress == 1) {
          this.ofsetInProgress = 0;
        } else {
          this.ofsetInProgress =
            (this.currentPageInProgress - 1) * this.itemPerPageInProgress;
        }
        this.refreshData();
      } else if (value == "Release") {
        if (this.currentPageRelease == 1) {
          this.ofsetRelease = 0;
        } else {
          this.ofsetRelease =
            (this.currentPageRelease - 1) * this.itemPerPageRelease;
        }
        this.refreshData();
      }
    },
    selectAllToggle(props) {
      // this.amountTotal = 0
      if (props.value == true) {
        // props.items.forEach(item => {
        //   this.amountTotal += (item.amount)
        // });
      } else {
        // this.amountTotal = 0
      }
    },
    selectToggle(evnt, item) {
      if (evnt == true) {
        this.amountTotal -= item.amount;
      } else {
        this.amountTotal += item.amount;
      }
    },
    addDataItemDraft() {
      // if (this.currentTabDeposit == 0){
      // this.selectedSpecial = []
      // this.mainDataDepositBucked = []
      if (this.selected.length === 0 && this.selectedSpecial.length === 0) {
        this.notif("error", "Failed", "Please select deposit item!!");
      } else {
        if (this.mainDataDepositBucked.length === 0) {
          this.mainDataDepositBucked = this.mainDataDepositBucked.concat(
            this.selected
          );
          this.mainDataDepositBucked = this.mainDataDepositBucked.concat(
            this.selectedSpecial
          );
        } else {
          this.selected.forEach((listDeposit, item) => {
            var find = 0;
            this.mainDataDepositBucked.forEach((element, index) => {
              if (element.id == listDeposit.id) {
                find = +1;
              }
            });
            if (find == 0) {
              this.mainDataDepositBucked.push(this.selected[item]);
            }
          });

          this.selectedSpecial.forEach((listDeposit, item) => {
            var find = 0;
            this.mainDataDepositBucked.forEach((element, index) => {
              if (element.id == listDeposit.id) {
                find = +1;
              }
            });
            if (find == 0) {
              this.mainDataDepositBucked.push(this.selectedSpecial[item]);
            }
          });
        }
        this.amountTotal = 0;
        this.mainDataDepositBucked.forEach((element, index) => {
          this.amountTotal += this.mainDataDepositBucked[index].amount;
        });
        this.depositItemList = false;
      }
      // }
      // else{
      // this.selected = []
      // this.mainDataDepositBucked = []
      //     if (this.selectedSpecial.length === 0) {
      //       this.notif("error", "Failed", "Please select deposit item!!");
      //     }
      //     else {
      //       if (this.mainDataDepositBucked.length === 0) {
      //         this.mainDataDepositBucked = this.mainDataDepositBucked.concat(
      //             this.selectedSpecial
      //         );
      //       }
      //       else {
      //         this.selectedSpecial.forEach((listDeposit, item) => {
      //           var find = 0;
      //           this.mainDataDepositBucked.forEach((element, index) => {
      //             if (element.id == listDeposit.id) {
      //               find = +1;
      //             }
      //           });
      //           if (find == 0) {
      //             this.mainDataDepositBucked.push(this.selectedSpecial[item]);
      //           }
      //         });
      //       }
      //       this.amountTotal = 0;
      //       this.mainDataDepositBucked.forEach((element, index) => {
      //         this.amountTotal += this.mainDataDepositBucked[index].amount;
      //       });
      //       this.depositItemList = false;
      //     // }
      //   // }
    },
    addData() {
      if (
        this.mainDataDepositBucked.length == 0 ||
        this.amountTotal == 0 ||
        this.formCreate.cashbankToId == "" ||
        this.formCreate.cashbankToId == null ||
        this.formCreate.cashbankToId == -99
      ) {
        this.notif(
          "error",
          "Failed",
          "Please select at least 1 data and select Beneficiary bank first!!."
        );
      } else {
        var item = [
          null,
          "addForm",
          this.mainDataDepositBucked,
          this.formCreate,
        ];
        this.$root.$emit("formCashBankTransfer", this.formCashBankTransfer);
        this.$root.$emit("formCashBankTransferForm", item);
      }
    },
    addDataWithoutDeposit() {
      var item = [null, "addForm", [], []];
      this.$root.$emit(
        "formCashBankTransfer2",
        this.formCashBankTransferWithoutDeposit
      );
      this.$root.$emit("formCashBankTransferForm2", item);
    },
    editData(data) {
      if (data.docTypeId == 302) {
        var item = [data, "editForm", [], -99];
        this.$root.$emit(
          "formCashBankTransfer2",
          this.formCashBankTransferWithoutDeposit
        );
        this.$root.$emit("formCashBankTransferForm2", item);
      } else {
        var item = [data, "editForm", [], -99];
        this.$root.$emit("formCashBankTransfer", this.formCashBankTransfer);
        this.$root.$emit("formCashBankTransferForm", item);
      }
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
          this.refreshData();
        });
    },
    confirmDialogDraft(id) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.isDialogVisible = true;
          this.mainDataDepositBucked = this.mainDataDepositBucked.filter(
            function (item) {
              return item["id"] != id;
            }
          );
          this.amountTotal = 0;
          this.mainDataDepositBucked.forEach((element, index) => {
            this.amountTotal += this.mainDataDepositBucked[index].amount;
          });
          if (this.currentTabDeposit == 0) {
            this.selected = this.mainDataDepositBucked;
          } else if (this.currentTabDeposit == 1) {
            this.selectedSpecial = this.mainDataDepositBucked;
          }
          this.isDialogVisible = false;
          setTimeout(() => {
            dialog.close();
          }, 500);
        })
        .catch(() => {
          // this.refreshData()
        });
    },
    removeData(id) {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(`${themeConfig.app.api_cb}/transfer/remove/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.notif("success", "Success", response.data.meta.message);
          this.refreshData();
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
    getCountData(value) {
      if (value == "Draft") {
        var status = "?workflowStatus=DRAFT";
        var data = {
          docNo: this.form.docNo,
          ouId: this.form.ouId == "" ? -99 : parseInt(this.form.ouId),
          dateFrom: moment(this.form.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.form.dateTo).format("YYYYMMDD"),
        };
      } else if (value == "InProgress") {
        var status = "?workflowStatus=IN PROGRESS";
        var data = {
          docNo: this.formIn.docNo,
          ouId: this.formIn.ouId == "" ? -99 : parseInt(this.formIn.ouId),
          dateFrom: moment(this.formIn.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.formIn.dateTo).format("YYYYMMDD"),
        };
      } else if (value == "Release") {
        var status = "?workflowStatus=RELEASED";
        var data = {
          docNo: this.formApproved.docNo,
          ouId:
            this.formApproved.ouId == ""
              ? -99
              : parseInt(this.formApproved.ouId),
          dateFrom: moment(this.formApproved.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.formApproved.dateTo).format("YYYYMMDD"),
        };
      }

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(`${themeConfig.app.api_cb}/transfer/count${status}`, data, config)
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
          this.notif("error", "Failed", e.response.data.message);
        });
    },
    refreshDataFilter() {
      if (this.currentTab == 0) {
        this.refreshDataDeposit();
      } else {
        this.refreshData();
      }
    },
    refreshData() {
      this.isDialogVisible = true;
      if (this.currentTab == 1) {
        var status = "?workflowStatus=DRAFT";
        var itemPerPage = this.itemPerPageDraft;
        var ofset = this.ofsetDraft;
        var data = {
          docNo: this.form.docNo,
          ouId: this.form.ouId == "" ? -99 : parseInt(this.form.ouId),
          dateFrom: moment(this.form.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.form.dateTo).format("YYYYMMDD"),
          limit: itemPerPage,
          offset: ofset,
        };
      } else if (this.currentTab == 2) {
        var status = "?workflowStatus=IN PROGRESS";
        var itemPerPage = this.itemPerPageInProgress;
        var ofset = this.ofsetInProgress;
        var data = {
          docNo: this.formIn.docNo,
          ouId: this.formIn.ouId == "" ? -99 : parseInt(this.formIn.ouId),
          dateFrom: moment(this.formIn.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.formIn.dateTo).format("YYYYMMDD"),
          limit: itemPerPage,
          offset: ofset,
        };
      } else if (this.currentTab == 3) {
        var status = "?workflowStatus=RELEASED";
        var itemPerPage = this.itemPerPageRelease;
        var ofset = this.ofsetRelease;
        var data = {
          docNo: this.formApproved.docNo,
          ouId:
            this.formApproved.ouId == ""
              ? -99
              : parseInt(this.formApproved.ouId),
          dateFrom: moment(this.formApproved.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.formApproved.dateTo).format("YYYYMMDD"),
          limit: itemPerPage,
          offset: ofset,
        };
      }

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(`${themeConfig.app.api_cb}/transfer/list${status}`, data, config)
        .then((response) => {
          this.isDialogVisible = false;
          if (this.currentTab == 1) {
            this.getCountData("Draft");
            if (response.data.result !== null)
              return (this.mainData = response.data.result);
            this.mainData = [];
          } else if (this.currentTab == 2) {
            this.getCountData("InProgress");
            if (response.data.result !== null)
              return (this.mainDataInProgress = response.data.result);
            this.mainDataInProgress = [];
          } else if (this.currentTab == 3) {
            this.getCountData("Release");
            if (response.data.result !== null)
              return (this.mainDataRelease = response.data.result);
            this.mainDataRelease = [];
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status == 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
    },
    async refreshDataDeposit() {
      this.isDialogVisible = true;
      this.mainDataDepositDaily = [];
      this.mainDataDepositSpecial = [];
      this.selected = [];
      this.selectedSpecial = [];

      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.formCreate.ouId == "" || this.formCreate.ouId == null
          ? -99
          : parseInt(this.formCreate.ouId);
      const ouBranchId =
        this.formCreate.ouBranchId == "" || this.formCreate.ouBranchId == null
          ? -99
          : parseInt(this.formCreate.ouBranchId);
      const cashbankId =
        this.formCreate.cashbankFromId == "" ||
        this.formCreate.cashbankFromId == null
          ? -99
          : parseInt(this.formCreate.cashbankFromId);

      axios
        .get(
          `${themeConfig.app.api_cb}/deposit/outstanding-cashbank-balance-for-deposit-list?ouId=${ouId}&ouBranchId=${ouBranchId}&cashbankId=${cashbankId}`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (response.data.result !== null) {
            this.mainDataDeposit = response.data.result;
            var ouSubBranch =
              ouBranchId != -99 && ouBranchId != null
                ? this.formCreate.ouSubBranchId
                : -99;
            if (ouSubBranch != -99 && ouSubBranch != null) {
              this.mainDataDeposit = this.mainDataDeposit.filter(function (
                item
              ) {
                return item["ouSubBuId"] == ouSubBranch;
              });
            }
            this.mainDataDeposit.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataDeposit[index].bankCode +
                    "_logo.png")
                ) {
                  this.mainDataDeposit[index].logoImage =
                    this.mainDataDeposit[index].bankCode;
                }
              } catch (e) {
                this.mainDataDeposit[index].logoImage = "NONE";
              }
            });
            // this.depositItemList = true;
            var myNewArray = this.mainDataDeposit;
            var myNewArray1 = [];
            this.mainDataConfig.forEach((element, index) => {
              var i = this.mainDataConfig[index].toString();
              myNewArray = myNewArray.filter(function (item) {
                if (item["ouSubBranchCode"] == i) {
                  myNewArray1.push(item);
                }
                return item["ouSubBranchCode"] != i;
              });
            });
            this.mainDataDepositDaily = myNewArray;
            this.mainDataDepositSpecial = myNewArray1;
          } else {
            this.mainDataDeposit = [];
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          console.log(e.response.data.message);
        });
    },
    async getConfigSpecialDeposit() {
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_master}/system-config/list?parameterCode=MERCHANT_SPECIAL_DEPOSIT`,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          // this.notif("success", "Success", response.data.meta.message);
          if (response.data.result !== null) {
            this.mainDataConfig =
              response.data.result.parameterValue.split(",");
          } else {
            this.mainDataConfig = [];
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          // this.notif("error", "Failed", e.response.data.message);
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
