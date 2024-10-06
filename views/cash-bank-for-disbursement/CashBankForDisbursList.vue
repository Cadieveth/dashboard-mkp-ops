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
    <app-modal-disbursement-lookup
      v-if="openLookup"
      :open-modal="openLookup"
      :disbursement-item="mainInvoiceData"
      :partner-id="filterCreateForm.partnerId"
      :selected-item="selected"
    ></app-modal-disbursement-lookup>
    <app-modal-disbursement-info
      v-if="openDisbursementInfo"
      :open-modal="openDisbursementInfo"
    ></app-modal-disbursement-info>

    <app-card-loader :open-loader="isDialogVisible"></app-card-loader>
    <v-row>
      <!--      <v-col cols="12" v-show="currentTab > 0">-->
      <!--        <cashbank-for-disburs-filter-doc></cashbank-for-disburs-filter-doc>-->
      <!--      </v-col>-->
      <!--      <v-col cols="12" v-show="currentTab == 0">-->
      <!--        <cashbank-for-disburs-filter-create></cashbank-for-disburs-filter-create>-->
      <!--      </v-col>-->
      <v-col cols="12">
        <v-card>
          <v-card-title><span>Disbursement </span></v-card-title>
          <v-card-text>
            <div>
              <v-tabs grow v-model="currentTab" @change="handleTabChange()">
                <v-tab> Create </v-tab>
                <v-tab> Draft </v-tab>
                <v-tab> In Progress </v-tab>
                <v-tab> Approved </v-tab>
              </v-tabs>
              <v-tabs-items v-model="currentTab">
                <v-tab-item>
                  <v-row>
                    <v-col cols="12" class="pb-0 mt-2">
                      <cashbank-for-disburs-filter-create></cashbank-for-disburs-filter-create>
                      <v-card-title class="mt-n12 pt-0">
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          small
                          dark
                          @click="addData()"
                          v-show="
                            showAdd &&
                            currentTab == 0 &&
                            mainInvoiceData.length > 0
                          "
                        >
                          <v-icon dark left>{{ icons.mdiPlus }}</v-icon>
                          Create Disbursement
                        </v-btn>
                      </v-card-title>
                      <v-card-title class="mt-n6">
                        <v-autocomplete
                          :style="{ maxWidth: '250px' }"
                          v-show="payMethodList.length > 0"
                          label="Merchant"
                          :items="payMethodList"
                          v-model="payMethodPicked"
                          persistent-placeholder
                          :placeholder="'Select Merchant'"
                          dense
                          hide-details
                          clearable
                          @change="filterItems"
                        >
                        </v-autocomplete>
                        <v-spacer></v-spacer>
                        <div v-show="payMethodList.length > 0">
                          <span class="me-2">Total Amount:</span>
                          <span class="font-weight-semibold"
                            >Rp. {{ number_format(amountTotal) }}</span
                          >
                        </div>
                      </v-card-title>
                    </v-col>
                    <v-col v-show="true" cols="12" class="pb-0">
                      <v-card
                        flat
                        :class="[payMethodList.length > 0 ? 'mt-n10' : '']"
                      >
                        <v-card-text
                          v-for="(item, index) in filteredItems"
                          :key="index"
                        >
                          <v-card-title class="py-0 mb-n4">
                            <span>
                              {{ index }}
                            </span>
                            <v-spacer></v-spacer>
                            <div></div>
                          </v-card-title>
                          <div
                            v-for="(value, valueIndex) in item"
                            :key="valueIndex"
                          >
                            <v-card-text class="pb-0 mb-n2">
                              <p class="text-lg font-weight-bold text-black">
                                ‣ {{ valueIndex }}
                              </p>
                              <v-spacer></v-spacer>
                              <div></div>
                            </v-card-text>
                            <v-data-table
                              :headers="headersInvoiceList"
                              :items="addedAmount(value)"
                              hide-default-footer
                              disable-pagination
                              fixed-header
                              dense
                              class="mb-n2"
                            >
                              <template #[`item.actions`]="{ item }">
                                <v-tooltip bottom color="error">
                                  <template #activator="{ on, attrs }">
                                    <v-btn
                                      x-small
                                      icon
                                      color="error"
                                      v-bind="attrs"
                                      @click="deleteSelected(item)"
                                      v-show="
                                        item.paymentMethodCode !== 'Amount'
                                      "
                                    >
                                      <v-icon>
                                        {{ icons.mdiDelete }}
                                      </v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Delete</span>
                                </v-tooltip>
                              </template>
                              <template #[`header.ou`]>
                                {{ ou }}
                              </template>

                              <template
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
                              </template>

                              <!-- format tanggal-->
                              <template #[`item.docDate`]="{ item }">
                                {{ dateFormat(item.docDate) }}
                              </template>
                              <template #[`item.dueDate`]="{ item }">
                                {{
                                  item.dueDate == ""
                                    ? "-"
                                    : dateFormat(item.dueDate)
                                }}
                              </template>

                              <!-- Unit Bisnis -->
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

                              <!-- Partner -->
                              <template #[`item.partner`]="{ item }">
                                <div>
                                  <span
                                    class="
                                      d-block
                                      text--primary
                                      font-weight-semibold
                                      text-truncate
                                    "
                                    >{{ item.partnerName }}</span
                                  >
                                  <span class="text-xs">{{
                                    item.partnerCode
                                  }}</span>
                                </div>
                              </template>
                              <template #[`item.paymentMethodCode`]="{ item }">
                                <p
                                  :class="
                                    item.paymentMethodCode === 'Amount'
                                      ? 'font-weight-bold mb-n1  text-lg text-muted'
                                      : ' mb-n1'
                                  "
                                >
                                  {{ item.paymentMethodCode }}
                                </p>
                              </template>

                              <!-- format uang-->
                              <template #[`item.amount`]="{ item }">
                                <p
                                  :class="
                                    item.paymentMethodCode === 'Amount'
                                      ? 'font-weight-bold mb-n1 text-lg text-muted'
                                      : ' mb-n1'
                                  "
                                >
                                  Rp.{{ amountCount(item, value) }}
                                </p>
                              </template>
                            </v-data-table>
                          </div>
                        </v-card-text>
                        <v-card-text v-show="false" class="mt-n4">
                          <v-data-table
                            :headers="headersInvoiceList"
                            :items="selected"
                            fixed-header
                            hide-default-footer
                            disable-pagination
                            dense
                            item-key="id"
                          >
                            <template #[`header.ou`]>
                              {{ ou }}
                            </template>

                            <template
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
                            </template>

                            <!-- format tanggal-->
                            <template #[`item.docDate`]="{ item }">
                              {{ dateFormat(item.docDate) }}
                            </template>
                            <template #[`item.dueDate`]="{ item }">
                              {{
                                item.dueDate == ""
                                  ? "-"
                                  : dateFormat(item.dueDate)
                              }}
                            </template>

                            <!-- Unit Bisnis -->
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

                            <!-- Partner -->
                            <template #[`item.partner`]="{ item }">
                              <div>
                                <span
                                  class="
                                    d-block
                                    text--primary
                                    font-weight-semibold
                                    text-truncate
                                  "
                                  >{{ item.partnerName }}</span
                                >
                                <span class="text-xs">{{
                                  item.partnerCode
                                }}</span>
                              </div>
                            </template>

                            <!-- format uang-->
                            <template #[`item.amount`]="{ item }">
                              Rp.{{
                                number_format(
                                  item.settledAmount +
                                    item.settledAmountAdd -
                                    (item.settledAmountCancel +
                                      item.settledAmountRcv)
                                )
                              }}
                            </template>
                          </v-data-table>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col v-show="mainInvoiceData.length <= 0">
                      <v-card flat>
                        <v-card-text>
                          <v-data-table
                            :headers="headersInvoiceList"
                            hide-default-footer
                            disable-pagination
                            fixed-header
                            dense
                          >
                          </v-data-table>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row>
                    <v-col cols="12" class="pb-0 mt-2">
                      <cashbank-for-disburs-filter-doc></cashbank-for-disburs-filter-doc>
                    </v-col>
                    <v-col id="table-draft" cols="12" class="pb-0">
                      <v-card flat class="mt-n6">
                        <v-card-title>
                          <v-spacer></v-spacer>
                        </v-card-title>
                        <v-card-text>
                          <v-row class="mb-4">
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
                            :items-per-page="itemPerPage"
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
                            <template #[`item.transferAmount`]="{ item }">
                              Rp.{{ number_format(item.transferAmount) }}
                            </template>
                            <template
                              #[`item.transferFeeBankAmount`]="{ item }"
                            >
                              Rp.{{
                                number_format(
                                  item.transferFeeBankAmount + item.incomeAmount
                                )
                              }}
                            </template>
                            <template #[`item.paymentAmount`]="{ item }">
                              Rp.{{ number_format(item.paymentAmount) }}
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

                            <!-- Mitra -->
                            <template #[`item.mitra`]="{ item }">
                              <div>
                                <div>
                                  <span
                                    class="
                                      d-block
                                      text--primary
                                      font-weight-semibold
                                      text-truncate
                                    "
                                    >{{ item.partnerName }}</span
                                  >
                                  <span class="text-xs">{{
                                    item.partnerCode
                                  }}</span>
                                </div>
                              </div>
                            </template>

                            <!-- penerima-->
                            <template #[`item.penerima`]="{ item }">
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

                            <template #[`item.statusDoc`]="{ item }">
                              <v-chip
                                small
                                :class="`${
                                  item.workflowStatus == 'DRAFT'
                                    ? 'warning'
                                    : item.workflowStatus == 'IN PROGRESS'
                                    ? 'info'
                                    : item.workflowStatus == 'RELEASED'
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
                                    ? "IN PROGRESS"
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
                                    v-show="item.statusDoc == 'D' && showDelete"
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
                            v-model="currentPage"
                            :length="totalPages"
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
                  <v-row>
                    <v-col cols="12" class="pb-0 mt-2">
                      <cashbank-for-disburs-filter-doc></cashbank-for-disburs-filter-doc>
                    </v-col>
                    <v-col id="table-inprogress" cols="12" class="pb-0">
                      <v-card flat class="mt-n6">
                        <v-card-title>
                          <v-spacer></v-spacer>
                        </v-card-title>
                        <v-card-text>
                          <v-row class="mb-4">
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
                            :items-per-page="itemPerPage"
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
                            <template #[`item.transferAmount`]="{ item }">
                              Rp.{{ number_format(item.transferAmount) }}
                            </template>
                            <template
                              #[`item.transferFeeBankAmount`]="{ item }"
                            >
                              Rp.{{
                                number_format(
                                  item.transferFeeBankAmount + item.incomeAmount
                                )
                              }}
                            </template>
                            <template #[`item.paymentAmount`]="{ item }">
                              Rp.{{ number_format(item.paymentAmount) }}
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

                            <!-- Mitra -->
                            <template #[`item.mitra`]="{ item }">
                              <div>
                                <div>
                                  <span
                                    class="
                                      d-block
                                      text--primary
                                      font-weight-semibold
                                      text-truncate
                                    "
                                    >{{ item.partnerName }}</span
                                  >
                                  <span class="text-xs">{{
                                    item.partnerCode
                                  }}</span>
                                </div>
                              </div>
                            </template>

                            <!-- penerima-->
                            <template #[`item.penerima`]="{ item }">
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

                            <template #[`item.statusDoc`]="{ item }">
                              <v-chip
                                small
                                :class="`${
                                  item.workflowStatus == 'DRAFT'
                                    ? 'warning'
                                    : item.workflowStatus == 'IN PROGRESS'
                                    ? 'info'
                                    : item.workflowStatus == 'RELEASED'
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
                                    ? "IN PROGRESS"
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
                            v-model="currentPage"
                            :length="totalPages"
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
                  <v-row>
                    <v-col cols="12" class="pb-0 mt-2">
                      <cashbank-for-disburs-filter-doc></cashbank-for-disburs-filter-doc>
                    </v-col>
                    <v-col id="table-approved" cols="12" class="pb-0">
                      <v-card flat class="mt-n6">
                        <v-card-title>
                          <v-spacer></v-spacer>
                        </v-card-title>
                        <v-card-text>
                          <v-row class="mb-4">
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
                            <template #[`item.transferAmount`]="{ item }">
                              Rp.{{ number_format(item.transferAmount) }}
                            </template>
                            <template
                              #[`item.transferFeeBankAmount`]="{ item }"
                            >
                              Rp.{{
                                number_format(
                                  item.transferFeeBankAmount + item.incomeAmount
                                )
                              }}
                            </template>
                            <template #[`item.paymentAmount`]="{ item }">
                              Rp.{{ number_format(item.paymentAmount) }}
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

                            <!-- Mitra -->
                            <template #[`item.mitra`]="{ item }">
                              <div>
                                <div>
                                  <span
                                    class="
                                      d-block
                                      text--primary
                                      font-weight-semibold
                                      text-truncate
                                    "
                                    >{{ item.partnerName }}</span
                                  >
                                  <span class="text-xs">{{
                                    item.partnerCode
                                  }}</span>
                                </div>
                              </div>
                            </template>

                            <!-- penerima-->
                            <template #[`item.penerima`]="{ item }">
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

                            <!-- Status Dokumen-->
                            <template #[`item.statusDoc`]="{ item }">
                              <v-chip
                                small
                                :class="`${
                                  item.workflowStatus == 'DRAFT'
                                    ? 'warning'
                                    : item.workflowStatus == 'IN PROGRESS'
                                    ? 'info'
                                    : item.workflowStatus == 'RELEASED'
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
                                    ? "IN PROGRESS"
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
                            v-model="currentPage"
                            :length="totalPages"
                            @input="handlePageChange('Release')"
                            total-visible="5"
                            v-scroll-to="'#table-approved'"
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
import axios from "@axios";
import themeConfig from "@themeConfig";
import moment from "moment";
import Form from "vform";
import {
  mdiCalendar,
  mdiClipboardEditOutline,
  mdiDelete,
  mdiMagnify,
  mdiPlus,
  mdiReload,
} from "@mdi/js";
import { dateFormat, isInArray, number_format } from "../../../constan";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppAutocompliteBank from "@core/components/app-autocomplite-ou/AppAutocompliteBank";
import AppAutocompliteOuBuMain from "@core/components/app-autocomplite-ou/AppAutocompliteOuBuMain";
import AppAutocomplitePartner from "@core/components/app-autocomplite-ou/AppAutocomplitePartner";
import CashbankForDisbursFilterCreate from "@/views/cash-bank-for-disbursement/CashbankForDisbursFilterCreate";
import CashbankForDisbursFilterDoc from "@/views/cash-bank-for-disbursement/CashbankForDisbursFilterDoc";
import AppModalDisbursementLookup from "@core/components/app-modal-popup/AppModalDisbursementLookup";
import AppModalDisbursementInfo from "@core/components/app-modal-popup/AppModalDisbursementInfo";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";

Vue.use(VueScrollTo);

export default {
  name: "Child",
  components: {
    AppAutocompliteOu,
    AppAutocompliteBank,
    AppAutocompliteOuBuMain,
    AppAutocomplitePartner,
    CashbankForDisbursFilterCreate,
    CashbankForDisbursFilterDoc,
    AppModalDisbursementLookup,
    AppCardLoader,
    AppModalDisbursementInfo,
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
      ou: themeConfig.labeling.ou,

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      itemPerPage: 25,

      openLookup: false,
      openDisbursementInfo: false,

      payMethodList: [],
      payMethodPicked: "",
      currentPage: 1,
      isDialogVisible: false,
      currentTab: 0,
      formData: true,
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
      selected: [],
      mainData: [],
      mainInvoiceData: [],
      mainDataInProgress: [],
      mainDataRelease: [],
      ouList: [],
      statusDocList: [],
      statusDisList: [],
      bankList: [],

      items: [],
      filteredItems: {},

      menuStart: false,
      menuEnd: false,
      formCashBankDisburs: true,
      showAdd:
        isInArray("addDisbursement", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showEdit:
        isInArray("editDisbursement", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      showDelete:
        isInArray("removeDisbursement", this.$session.get("accessHumanTask")) ||
        JSON.parse(this.$session.get("userData")).username == "superadmin",
      icons: {
        mdiCalendar,
        mdiMagnify,
        mdiClipboardEditOutline,
        mdiDelete,
        mdiPlus,
      },
      totalPages: 1,
      filterForm: new Form({
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        docNo: "",
        ouId: -99,
        bankCode: "",
        remark: "",
      }),
      filterFormIn: new Form({
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        docNo: "",
        ouId: -99,
        bankCode: "",
        remark: "",
      }),
      filterFormApproved: new Form({
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        docNo: "",
        ouId: -99,
        bankCode: "",
        remark: "",
      }),
      filterCreateForm: new Form({
        ouId: -99,
        partnerId: -99,
        ouBranchId: -99,
        ouSubBranchId: [],
        partnerBank: -99,
        productIdentifier: "",
      }),

      amountTotal: 0,
      listInvoiceAp: [],
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
          text: "Partner",
          value: "mitra",
          width: "150px",
        },
        {
          text: "Beneficiary Account",
          value: "penerima",
          width: "250px",
        },
        {
          text: "Amount",
          align: "right",
          value: "transferAmount",
          width: "150px",
        },
        {
          text: "Admin Fee Bank",
          align: "right",
          value: "transferFeeBankAmount",
          width: "150px",
        },
        {
          text: "Credit Amount",
          align: "right",
          value: "paymentAmount",
          width: "150px",
        },
        {
          text: "Remark",
          value: "remark",
          width: "300px",
        },
        {
          text: "Status Disbursement",
          align: "center",
          value: "statusDis",
          width: "175px",
          sortable: false,
        },
      ],
      headersInvoiceList: [
        {
          text: "Actions",
          value: "actions",
          width: "100px",
          align: "center",
          sortable: false,
        },
        {
          text: "Doc No",
          value: "docNo",
          width: "250px",
        },
        {
          text: "Doc Date",
          value: "docDate",
          width: "125px",
        },
        {
          text: themeConfig.labeling.ouTbl,
          value: "ou",
          width: "250px",
        },
        {
          text: "Payment Method",
          value: "paymentMethodCode",
          width: "150px",
        },
        {
          text: "Amount",
          value: "amount",
          align: "right",
          width: "200px",
        },
      ],
    };
  },
  mounted() {
    sessionStorage.removeItem("disbursementCreateForm");
    this.$root.$on("disbursementSelectedItem", async (msg) => {
      this.selected = _.concat(this.selected, msg.selected);
      this.selected = _.uniqBy(this.selected, "id");
      // this.items = await this.sortData(this.selected, "ouName");
      this.items = await this.groupDataByCategories(this.selected, [
        "ouName",
        "paymentMethodCode",
      ]);
      this.filteredItems = this.items;
      this.payMethodList = Object.keys(this.filteredItems);
      this.amountTotal = msg.amount;
    });
    this.getBank();
    this.$root.$on("closeModalDisbursementLookup", async (msg) => {
      this.openLookup = false;
    });
    this.$root.$on("closeModalDisbursementInfo", async (msg) => {
      this.openDisbursementInfo = false;
    });

    this.$root.$on("filterDisbursementInfo", async (msg) => {
      this.openDisbursementInfo = msg;
    });

    this.$root.$on("filterDisbursementCreate", async (msg) => {
      this.filterCreateForm = msg;
      if (
        this.filterCreateForm.ouId !== -99 &&
        this.filterCreateForm.partnerId !== -99
      ) {
        this.refreshInvoiceList();
      }
      if (this.currentTab === 0 && this.mainInvoiceData !== []) {
        sessionStorage.setItem(
          "disbursementCreateForm",
          JSON.stringify(this.filterCreateForm)
        );
        this.openLookup = true;
      }
    });
    this.$root.$on(
      "appAutocomplitePartnerCashbankDisbursementCreate",
      (msg) => {
        const storedVForm = sessionStorage.getItem("disbursementCreateForm");
        const storedFilterForm = JSON.parse(storedVForm);
        if (msg !== parseInt(storedFilterForm.partnerId)) {
          this.amountTotal = 0;
          this.selected = [];
          this.filteredItems = {};
          this.payMethodList = [];
          this.mainInvoiceData = [];
          sessionStorage.removeItem("disbursementCreateForm");
        }
      }
    );
    this.$root.$on(
      "appAutocompliteOuCompanyCashbankDisbursementCreate",
      (msg) => {
        const storedVForm = sessionStorage.getItem("disbursementCreateForm");
        const storedFilterForm = JSON.parse(storedVForm);
        if (msg !== parseInt(storedFilterForm.ouId)) {
          this.amountTotal = 0;
          this.selected = [];
          this.filteredItems = {};
          this.payMethodList = [];
          this.mainInvoiceData = [];
          sessionStorage.removeItem("disbursementCreateForm");
        }
      }
    );

    this.$root.$on("filterDisbursementDoc", (msg) => {
      if (this.currentTab == 1) {
        this.filterForm = msg;
        this.currentPage = 1;
        this.ofsetDraft = 0;
      } else if (this.currentTab == 2) {
        this.filterFormIn = msg;
        this.currentPage = 1;
        this.ofsetInProgress = 0;
      } else if (this.currentTab == 3) {
        this.filterFormApproved = msg;
        this.currentPage = 1;
        this.ofsetRelease = 0;
      }
      this.refreshData();
    });
    if (this.currentTab > 0) {
      this.refreshData();
    } else if (this.currentTab == 0) {
      if (
        this.filterCreateForm.ouId !== -99 &&
        this.filterCreateForm.partnerId !== -99
      ) {
        this.refreshInvoiceList();
      }
      // this.refreshInvoiceList();
    }
    this.$root.$on("formCashBankDisbursReturn", (msg) => {
      this.mainInvoiceData = [];
      if (this.currentTab > 0) {
        this.refreshData();
      } else if (this.currentTab === 0) {
        if (sessionStorage.getItem("disbursementCreateForm") === null) {
          this.selected = [];
        }
        if (
          this.filterCreateForm.ouId !== -99 &&
          this.filterCreateForm.partnerId !== -99
        ) {
          this.refreshInvoiceList();
        }
      }
    });
  },
  watch: {
    selected(newVal) {
      this.changeFilteredData();
    },
  },
  methods: {
    realizationAmountSum(value) {
      var newAmount = 0;
      value.forEach((data) => {
        newAmount +=
          data.settledAmount +
          data.settledAmountAdd -
          (data.settledAmountCancel + data.settledAmountRcv);
      });
      return newAmount;
    },
    amountCount(item, value) {
      if (item.paymentMethodCode === "Amount") {
        var newAmount = this.realizationAmountSum(value);
        return this.number_format(item.amount);
      } else {
        return this.number_format(
          item.settledAmount +
            item.settledAmountAdd -
            (item.settledAmountCancel + item.settledAmountRcv)
        );
      }
    },

    async changeFilteredData() {
      // this.items = await this.sortData(this.selected, "ouName");
      this.items = await this.groupDataByCategories(this.selected, [
        "ouName",
        "paymentMethodCode",
      ]);
      this.filteredItems = this.items;
      this.payMethodList = Object.keys(this.filteredItems);
      var newAmount = 0;
      this.selected.forEach((item) => {
        newAmount +=
          item.settledAmount +
          item.settledAmountAdd -
          (item.settledAmountCancel + item.settledAmountRcv);
      });
      this.amountTotal = newAmount;
    },
    delay(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    dateFormat(value) {
      const result = value === undefined ? "" : dateFormat(value);
      return result;
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    sumTotalAmount(data) {
      var amount = 0;
      data.forEach((item) => {
        amount += item.realizationAmount;
      });
      return amount;
    },
    addedAmount(item) {
      // console.log(item);
      const newData = {
        paymentMethodCode: "Amount",
        amount: this.realizationAmountSum(item),
      };

      var result = _.concat(item, newData);
      return result;
    },
    deleteSelected(item) {
      this.$dialog
        .confirm("Are you sure you want to delete this item?.", {
          loader: true,
        })
        .then((dialog) => {
          this.isDialogVisible = true;
          this.selected = this.selected.filter((data) => data.id !== item.id);
          // console.log("selected", this.selected);
          this.isDialogVisible = false;
          setTimeout(() => {
            dialog.close();
          }, 500);
        })
        .catch(() => {});
    },
    getItemPerPage(val) {
      if (this.currentTab == 1) {
        this.itemPerPage = val;
        this.ofset = 0;
        this.currentPage = 1;
      } else if (this.currentTab == 2) {
        this.itemPerPage = val;
        this.ofset = 0;
        this.currentPage = 1;
      } else if (this.currentTab == 3) {
        this.itemPerPage = val;
        this.ofset = 0;
        this.currentPage = 1;
      }
      this.refreshData();
    },
    handleTabChange() {
      this.currentPage = 1;
      this.ofsetDraft = 0;
      this.ofsetInProgress = 0;
      this.ofsetRelease = 0;
      this.itemPerPage = 25;
      if (this.currentTab > 0) {
        this.refreshData();
      } else {
        if (
          this.filterCreateForm.ouId !== -99 &&
          this.filterCreateForm.partnerId !== -99
        ) {
          this.refreshInvoiceList();
        }
      }
    },
    filterItems(value) {
      const newobj = Object.fromEntries(
        Object.entries(this.items).filter(([key]) => key == value)
      );

      if (value != null) {
        this.filteredItems = newobj;
      } else {
        this.filteredItems = this.items;
      }
    },
    handlePageChange(value) {
      if (value == "Draft") {
        if (this.current === 1) {
          this.ofsetDraft = 0;
        } else {
          this.ofsetDraft = (this.currentPage - 1) * this.itemPerPage;
        }
        this.refreshData();
      } else if (value == "InProgress") {
        if (this.currentPage === 1) {
          this.ofsetInProgress = 0;
        } else {
          this.ofsetInProgress = (this.currentPage - 1) * this.itemPerPage;
        }
        this.refreshData();
      } else if (value == "Release") {
        if (this.currentPage === 1) {
          this.ofsetRelease = 0;
        } else {
          this.ofsetRelease = (this.currentPage - 1) * this.itemPerPage;
        }
        this.refreshData();
      }
    },
    selectAllToggle(props, index, item) {
      if (props.value == true) {
        for (let i = 0; i < this.mainInvoiceData.length; i++) {
          if (this.mainInvoiceData[i].paymentMethodCode == index) {
            this.mainInvoiceData[i].checked = true;
            this.mainInvoiceData[i].itemAmount =
              this.mainInvoiceData[i].settledAmount +
              this.mainInvoiceData[i].settledAmountAdd -
              (this.mainInvoiceData[i].settledAmountCancel +
                this.mainInvoiceData[i].settledAmountRcv);
          }
        }
      } else {
        for (let i = 0; i < this.mainInvoiceData.length; i++) {
          if (this.mainInvoiceData[i].paymentMethodCode == index) {
            this.mainInvoiceData[i].checked = false;
            this.mainInvoiceData[i].itemAmount = 0;
          }
        }
      }
      this.amountSum();
    },
    selectToggle(evnt, item) {
      if (evnt == true) {
        let amount = 0;
        amount +=
          item.settledAmount +
          item.settledAmountAdd -
          (item.settledAmountCancel + item.settledAmountRcv);
        let dataChange = this.mainInvoiceData.find((obj) => obj.id == item.id);
        if (dataChange) {
          dataChange.checked = false;
          dataChange.itemAmount = 0;
        }
      } else {
        let amount = 0;
        amount +=
          item.settledAmount +
          item.settledAmountAdd -
          (item.settledAmountCancel + item.settledAmountRcv);
        let dataChange = this.mainInvoiceData.find((obj) => obj.id == item.id);
        if (dataChange) {
          dataChange.checked = true;
          dataChange.itemAmount = amount;
        }
      }
      this.amountSum();
    },
    setInvoiceApList() {
      this.listInvoiceAp = [];
      this.amountTotal = 0;
      this.selected.forEach((item) => {
        var valueToPush = {};
        valueToPush["ouId"] = item.ouId;
        valueToPush["ouCode"] = item.ouCode;
        valueToPush["ouName"] = item.ouName;
        valueToPush["refDocTypeId"] = item.docTypeId;
        valueToPush["refDocNo"] = item.docNo;
        valueToPush["refDocDate"] = item.docDate;
        valueToPush["refDueDate"] = item.dueDate;
        valueToPush["refItemId"] = item.id;
        valueToPush["paymentMethodCode"] = item.paymentMethodCode;
        valueToPush["realizationAmount"] =
          item.settledAmount +
          item.settledAmountAdd -
          (item.settledAmountCancel + item.settledAmountRcv);
        valueToPush["remark"] = "";
        this.amountTotal +=
          item.settledAmount +
          item.settledAmountAdd -
          (item.settledAmountCancel + item.settledAmountRcv);
        valueToPush["productIdentifier"] = item.productIdentifier;
        this.listInvoiceAp.push(valueToPush);
      });
    },
    addData() {
      // console.log(this.selected);
      if (this.selected.length == 0) {
        this.notif("error", "Gagal", "Please choose at data from list first!!");
      } else if (
        this.filterCreateForm.partnerBank === -99 ||
        this.filterCreateForm.partnerBank === null
      ) {
        this.notif("error", "Gagal", "Please choose partner bank!!");
      } else {
        this.setInvoiceApList();
        var item = [
          this.filterCreateForm,
          "addForm",
          this.listInvoiceAp,
          this.amountTotal,
        ];
        this.$root.$emit("formCashBankDisburs", this.formCashBankDisburs);
        this.$root.$emit("formCashBankDisbursForm", item);
      }
    },
    editData(data) {
      this.listInvoiceAp = [];
      // this.amountTotal = 0;
      var item = [data, "editForm", this.listInvoiceAp, this.amountTotal];
      this.$root.$emit("formCashBankDisburs", this.formCashBankDisburs);
      this.$root.$emit("formCashBankDisbursForm", item);
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
    async sortData(array, columnName) {
      var sortedData = {};

      for (var i = 0; i < array.length; i++) {
        var object = array[i];

        if (Object.keys(sortedData).indexOf(object[columnName]) === -1) {
          sortedData[object[columnName]] = [];
        }

        sortedData[object[columnName]].push(object);
      }
      return sortedData;
    },
    async groupDataByCategories(dataArray, categoryKeys) {
      const groupedData = dataArray.reduce((result, item) => {
        const categories = categoryKeys.map((key) => item[key]);

        categories.reduce((nestedObj, category, index) => {
          if (!nestedObj[category]) {
            nestedObj[category] = index === categoryKeys.length - 1 ? [] : {};
          }

          return nestedObj[category];
        }, result);

        result[categories[0]][categories[1]].push(item);

        return result;
      }, {});

      return groupedData;
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
        .get(`${themeConfig.app.api_cb}/disbursement/remove/${id}`, config)
        .then((response) => {
          this.isDialogVisible = false;
          this.notif("success", "Sukses", "Delete data berhasil!.");
          this.refreshData();
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getBank() {
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
          this.notif("error", "Gagal", e.response.data.message);
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getCountData(value) {
      if (this.currentTab == 1) {
        var status = "?workflowStatus=DRAFT";
        var itemPerPage = this.itemPerPage;
        var ofset = this.ofsetDraft;
        var data = {
          docNo: this.filterForm.docNo,
          ouId:
            this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId),
          dateFrom: moment(this.filterForm.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.filterForm.dateTo).format("YYYYMMDD"),
          bankCode: this.filterForm.bankCode,
          remark: this.filterForm.remark,
          limit: itemPerPage,
          offset: ofset,
        };
      } else if (this.currentTab == 2) {
        var status = "?workflowStatus=IN PROGRESS";
        var itemPerPage = this.itemPerPage;
        var ofset = this.ofsetInProgress;
        var data = {
          docNo: this.filterFormIn.docNo,
          ouId:
            this.filterFormIn.ouId == ""
              ? -99
              : parseInt(this.filterFormIn.ouId),
          dateFrom: moment(this.filterFormIn.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.filterFormIn.dateTo).format("YYYYMMDD"),
          bankCode: this.filterFormIn.bankCode,
          remark: this.filterFormIn.remark,
          limit: itemPerPage,
          offset: ofset,
        };
      } else if (this.currentTab == 3) {
        var status = "?workflowStatus=RELEASED";
        var itemPerPage = this.itemPerPage;
        var ofset = this.ofsetRelease;
        var data = {
          docNo: this.filterFormApproved.docNo,
          ouId:
            this.filterFormApproved.ouId == ""
              ? -99
              : parseInt(this.filterFormApproved.ouId),
          dateFrom: moment(this.filterFormApproved.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.filterFormApproved.dateTo).format("YYYYMMDD"),
          bankCode: this.filterFormApproved.bankCode,
          remark: this.filterFormApproved.remark,
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
        .post(
          `${themeConfig.app.api_cb}/disbursement/count${status}`,
          data,
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
          this.notif("error", "Gagal", e.response.data.message);
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
      if (this.currentTab == 1) {
        var status = "?workflowStatus=DRAFT";
        var itemPerPage = this.itemPerPage;
        var ofset = this.ofsetDraft;
        var data = {
          docNo: this.filterForm.docNo,
          ouId:
            this.filterForm.ouId == "" ? -99 : parseInt(this.filterForm.ouId),
          dateFrom: moment(this.filterForm.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.filterForm.dateTo).format("YYYYMMDD"),
          bankCode: this.filterForm.bankCode,
          remark: this.filterForm.remark,
          limit: itemPerPage,
          offset: ofset,
        };
      } else if (this.currentTab == 2) {
        var status = "?workflowStatus=IN PROGRESS";
        var itemPerPage = this.itemPerPage;
        var ofset = this.ofsetInProgress;
        var data = {
          docNo: this.filterFormIn.docNo,
          ouId:
            this.filterFormIn.ouId == ""
              ? -99
              : parseInt(this.filterFormIn.ouId),
          dateFrom: moment(this.filterFormIn.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.filterFormIn.dateTo).format("YYYYMMDD"),
          bankCode: this.filterFormIn.bankCode,
          remark: this.filterFormIn.remark,
          limit: itemPerPage,
          offset: ofset,
        };
      } else if (this.currentTab == 3) {
        var status = "?workflowStatus=RELEASED";
        var itemPerPage = this.itemPerPage;
        var ofset = this.ofsetRelease;
        var data = {
          docNo: this.filterFormApproved.docNo,
          ouId:
            this.filterFormApproved.ouId == ""
              ? -99
              : parseInt(this.filterFormApproved.ouId),
          dateFrom: moment(this.filterFormApproved.dateFrom).format("YYYYMMDD"),
          dateTo: moment(this.filterFormApproved.dateTo).format("YYYYMMDD"),
          bankCode: this.filterFormApproved.bankCode,
          remark: this.filterFormApproved.remark,
          limit: itemPerPage,
          offset: ofset,
        };
      }

      axios
        .post(
          `${themeConfig.app.api_cb}/disbursement/list${status}`,
          data,
          config
        )
        .then((response) => {
          this.isDialogVisible = false;
          if (this.currentTab == 1) {
            this.getCountData("Draft");
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
          } else if (this.currentTab == 2) {
            this.getCountData("InProgress");
            if (response.data.result !== null) {
              this.mainDataInProgress = response.data.result;
              this.mainDataInProgress.forEach((element, index) => {
                try {
                  if (
                    require("@/assets/images/logos/bank_logo/" +
                      this.mainDataInProgress[index].bankCode +
                      "_logo.png")
                  ) {
                    this.mainDataInProgress[index].logoImage =
                      this.mainDataInProgress[index].bankCode;
                  }
                  // do something
                } catch (e) {
                  this.mainDataInProgress[index].logoImage = "NONE";
                  // do something else
                }
              });
            } else {
              this.mainDataInProgress = [];
            }
          } else if (this.currentTab == 3) {
            this.getCountData("Release");
            if (response.data.result !== null) {
              this.mainDataRelease = response.data.result;
              this.mainDataRelease.forEach((element, index) => {
                try {
                  if (
                    require("@/assets/images/logos/bank_logo/" +
                      this.mainDataRelease[index].bankCode +
                      "_logo.png")
                  ) {
                    this.mainDataRelease[index].logoImage =
                      this.mainDataRelease[index].bankCode;
                  }
                  // do something
                } catch (e) {
                  this.mainDataRelease[index].logoImage = "NONE";
                  // do something else
                }
              });
            } else {
              this.mainDataRelease = [];
            }
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", e.response.data.meta.message);
          if (e.response.status == 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    refreshInvoiceList() {
      console.log(this.filterCreateForm);
      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const partnerId =
        this.filterCreateForm.partnerId == ""
          ? -99
          : parseInt(this.filterCreateForm.partnerId);
      const ouBranchId =
        this.filterCreateForm.ouBranchId == ""
          ? -99
          : parseInt(this.filterCreateForm.ouBranchId);

      axios
        .post(
          `${themeConfig.app.api_cb}/disbursement/list-invoice-ap-balance-for-disbursement`,
          {
            partnerId: partnerId,
            ouBranchId: ouBranchId,
            ouSubBranchId: this.filterCreateForm.ouSubBranchId,
            productIdentifier: this.filterCreateForm.productIdentifier,
          },
          config
        )
        .then(async (response) => {
          if (this.currentTab == 0) {
            if (response.data.result !== null) {
              this.mainInvoiceData = response.data.result;
              this.mainInvoiceData.forEach((item) => {
                item.checked = false;
                item.itemAmount = 0;
              });

              // this.items = await this.sortData(
              //   this.mainInvoiceData,
              //   "paymentMethodCode"
              // );
              // this.filteredItems = this.items;

              // Object.keys(this.filteredItems).forEach((key) => {
              //   this.filteredItems[key].sort((a, b) => {
              //     const dateA = parseInt(a.docDate);
              //     const dateB = parseInt(b.docDate);
              //     if (dateA < dateB) return -1;
              //     if (dateA > dateB) return 1;
              //     return 0;
              //   });
              // });

              // this.payMethodList = Object.keys(this.items);
            } else {
              this.mainInvoiceData = [];
              // this.openLookup = false;
              // this.notif("error", "Gagal", "Data Not Found");
            }
            this.isDialogVisible = false;
          }
        })
        .catch((e) => {
          this.isDialogVisible = false;
          this.notif("error", "Gagal", e.response.data.meta.message);
          if (e.response.status == 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    amountSum() {
      this.amountTotal = 0;
      for (let i = 0; i < this.mainInvoiceData.length; i++) {
        if (this.mainInvoiceData[i].checked) {
          this.amountTotal += this.mainInvoiceData[i].itemAmount;
        }
      }
    },
  },
};
</script>
