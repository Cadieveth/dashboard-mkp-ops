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

    <v-dialog v-model="formServiceFee" persistent width="800">
      <v-card>
        <v-card-title class="font-weight-bold">
          Service Fee Update
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Doc No"
                v-model="serviceFeeForm.docNo"
                readonly
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mt-1">
              <vuetify-money
                v-model="serviceFeeForm.productFee"
                label="Service Fee"
              >
              </vuetify-money>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions v-show="showUpdateButton" class="mt-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" small dark @click="serviceFeeUpdate()">
            <v-icon dark left>
              {{ icons.mdiCheckAll }}
            </v-icon>
            Service Fee Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    modal dialog pos item list-->
    <v-dialog v-model="itemListForm" persistent width="1100">
      <v-card>
        <v-card-title class="font-weight-bold">
          Item List
          <v-spacer></v-spacer>
          <v-btn color="secondary" icon small @click="closeForm()">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mb-n2">
          <v-row>
            <v-col cols="12" md="4">
              <!-- <div>
                <span
                  class="
                    d-block
                    text--primary
                    font-weight-semibold
                    text-truncate
                  "
                  >item.ouName
                </span>
                <span class="text-xs"> item.ouCode </span>
              </div> -->
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchItem"
                :append-icon="icons.mdiMagnify"
                label="Search"
                single-line
                hide-details
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-data-table
            :headers="headersItem"
            :items="mainDataItem"
            :search="searchItem"
            hide-default-footer
            disable-pagination
            fixed-header
            dense
          >
            <!-- format uang-->
            <template #[`item.price`]="{ item }">
              Rp.{{ number_format(item.price) }}
            </template>
            <template #[`item.qty`]="{ item }">
              {{ number_format(item.qty) }}
            </template>
            <template #[`item.totalAmount`]="{ item }">
              Rp.{{ number_format(item.totalAmount) }}
            </template>
            <!-- <template #[`item.productFee`]="{ item }">
              Rp.{{ number_format(item.productFee) }}
            </template> -->
            <template #[`item.productFee`]="{ item }">
              <vuetify-money
                v-model="item.productFee"
                :currency="'Rp.'"
                thousand-separator="."
                decimal-separator=","
              />
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="mt-4">
          <v-spacer></v-spacer>
          <v-btn
            v-show="flgRecon == 'N'"
            color="primary"
            small
            dark
            @click="serviceFeeUpdate()"
          >
            <v-icon dark left>
              {{ icons.mdiCheckAll }}
            </v-icon>
            Service Fee Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class=""
            ><span>History Transaction E-Ticketing</span></v-card-title
          >
          <v-card-text>
            <v-tabs grow v-model="currentTab" @change="refreshDataFilter()">
              <v-tab>History Transaction</v-tab>
              <v-tab>History Transaction Without Service Fee</v-tab>
            </v-tabs>
            <v-tabs-items v-model="currentTab">
              <v-tab-item>
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <v-card flat>
                      <!-- <v-card-title>
                      <span>History Transaction E-Ticketing</span>
                    </v-card-title> -->
                      <v-card-text class="mt-2">
                        <v-row>
                          <v-col cols="12" md="4" sm="6" class="pb-0 mt-2">
                            <!-- <app-autocomplite-ou-non-company
                  :form-value.sync="filterForm.ouId"
                ></app-autocomplite-ou-non-company> -->
                            <app-autocomplite-ou-branch
                              :form-value.sync="filterForm.ouBranchId"
                              ou-branch-type="ticketingHistory"
                            >
                            </app-autocomplite-ou-branch>
                          </v-col>
                          <v-col cols="12" md="4" sm="6" class="pb-0 mt-2">
                            <app-autocomplite-ou-subbranch
                              :form-value.sync="filterForm.ouSubBranchId"
                              ou-sub-branch-type="ticketingHistory"
                            >
                            </app-autocomplite-ou-subbranch>
                          </v-col>

                          <v-col cols="12" md="4" sm="6" class="pb-0 mt-2">
                            <v-select
                              :items="productList"
                              v-model="filterForm.productId"
                              item-text="productName"
                              item-value="id"
                              label="Product"
                              hide-details="auto"
                              persistent-placeholder
                              :placeholder="phProduct"
                              class="mb-0"
                              dense
                              clearable
                            ></v-select>
                          </v-col>
                          <v-col cols="12" md="2" sm="6" class="pb-0 mt-2">
                            <app-input-field-date
                              :value-date.sync="filterForm.dateFrom"
                              :label-title="startDate"
                            ></app-input-field-date>
                          </v-col>
                          <v-col cols="12" md="2" sm="6" class="pb-0 mt-2">
                            <app-input-field-date
                              :value-date.sync="filterForm.dateTo"
                              :label-title="endDate"
                            ></app-input-field-date>
                          </v-col>

                          <v-col cols="12" md="4" class="mt-2">
                            <app-autocomplite-payment-method
                              :form-value.sync="filterForm.paymentMethod"
                              :label-title="paymentMethod"
                              :multiple="true"
                            >
                            </app-autocomplite-payment-method>
                          </v-col>
                          <v-col cols="12" md="4" class="mt-2">
                            <v-text-field
                              v-model="filterForm.keyword"
                              label="Document No/Reference Ext Doc No"
                              dense
                              persistent-placeholder
                              :placeholder="phDocNoRefExt"
                              hide-details="auto"
                              class="mb-0"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col cols="12" md="4">
                            <span class="font-weight-bold"
                              >Reconciliation Status</span
                            >
                            <v-radio-group
                              v-model="filterForm.flgReconcile"
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
                                  label="Yes"
                                  color="primary"
                                  value="Y"
                                  class="mb-0"
                                ></v-radio>
                                <v-radio
                                  label="No"
                                  color="primary"
                                  value="N"
                                  class="mb-0"
                                ></v-radio>
                              </div>
                            </v-radio-group>
                          </v-col>
                          <!-- <v-col cols="12" md="6" class="pb-0 pt-5">
                <v-select
                  :items="flgReconList"
                  v-model="filterForm.flgReconcile"
                  item-text="text"
                  item-value="value"
                  label="Reconciliation"
                  hide-details="auto"
                  class="mb-0"
                  dense
                ></v-select>
              </v-col> -->
                        </v-row>
                      </v-card-text>
                      <v-card-actions class="mt-6">
                        <v-btn
                          color="primary"
                          small
                          dark
                          @click="confirmFilter()"
                        >
                          <v-icon dark left>
                            {{ icons.mdiMagnify }}
                          </v-icon>
                          Filter
                        </v-btn>
                      </v-card-actions>
                      <v-card-text outlined class="mt-4">
                        <v-row>
                          <v-col cols="12" md="3">
                            <statistics-card-summary
                              :change="omset.change"
                              :color="omset.color"
                              :icon="omset.icon"
                              :statistics="omset.value"
                              :stat-title="omset.statTitle"
                              :subtitle="omset.subtitle"
                              :loading="isLoading"
                            ></statistics-card-summary>
                          </v-col>
                          <v-col cols="12" md="3">
                            <statistics-card-summary
                              :change="mdr.change"
                              :color="mdr.color"
                              :icon="mdr.icon"
                              :statistics="mdr.value"
                              :stat-title="mdr.statTitle"
                              :subtitle="mdr.subtitle"
                              :loading="isLoading"
                            ></statistics-card-summary>
                          </v-col>
                          <v-col cols="12" md="3">
                            <statistics-card-summary
                              :change="serviceFee.change"
                              :color="serviceFee.color"
                              :icon="serviceFee.icon"
                              :statistics="serviceFee.value"
                              :stat-title="serviceFee.statTitle"
                              :subtitle="serviceFee.subtitle"
                              :loading="isLoading"
                            ></statistics-card-summary>
                          </v-col>
                          <v-col cols="12" md="3">
                            <statistics-card-summary
                              :change="revenue.change"
                              :color="revenue.color"
                              :icon="revenue.icon"
                              :statistics="revenue.value"
                              :stat-title="revenue.statTitle"
                              :subtitle="revenue.subtitle"
                              :loading="isLoading"
                            ></statistics-card-summary>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-title id="target-table" class="mb-n4">
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
                        <v-spacer></v-spacer>
                        <v-btn
                          v-show="showDelete"
                          dark
                          small
                          color="error"
                          @click="confirmDialog()"
                        >
                          <v-icon dark left>
                            {{ icons.mdiDelete }}
                          </v-icon>
                          Delete
                        </v-btn>
                      </v-card-title>
                      <!-- <v-card-text>
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
          </v-card-text> -->
                      <v-card-text>
                        <v-data-table
                          :headers="headers"
                          :items="mainData"
                          hide-default-footer
                          disable-pagination
                          fixed-header
                          dense
                          v-model="selected"
                          item-key="id"
                          show-select
                          @toggle-select-all="selectAllToggle"
                        >
                          <template #[`header.docNo`]>
                            {{ docNo }}
                          </template>
                          <template #[`header.docDate`]>
                            {{ docDate }}
                          </template>
                          <template #[`header.ou`]>
                            {{ ouTbl }}
                          </template>
                          <template #[`header.txnAmount`]>
                            {{ trxAmount }}
                          </template>
                          <template #[`item.paymentMethod`]="{ item }">
                            <div class="d-flex align-center">
                              <v-tooltip bottom colors="primary">
                                <template #activator="{ on, attrs }">
                                  <v-avatar
                                    color="#e6e6e6"
                                    v-bind="attrs"
                                    v-on="on"
                                    size="30"
                                  >
                                    <v-img
                                      :src="
                                        require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                                      "
                                    >
                                    </v-img>
                                  </v-avatar>
                                </template>
                              </v-tooltip>
                              <div class="d-flex flex-column ms-3">
                                <span
                                  class="
                                    d-block
                                    text--primary
                                    font-weight-semibold
                                    text-truncate
                                  "
                                  >{{ item.paymentMethod }}</span
                                >
                                <span class="text-xs">{{
                                  item.merchantIdentityName
                                }}</span>
                              </div>
                            </div>
                          </template>

                          <template #[`item.docNo`]="{ item }">
                            <div class="d-flex flex-column py-2">
                              <span
                                class="
                                  d-block
                                  text--primary
                                  font-weight-semibold
                                  text-truncate
                                "
                                >{{ item.docNo }}</span
                              >
                              <div class="d-flex">
                                <span
                                  class="
                                    d-block
                                    text--primary
                                    font-weight-semibold
                                    text-xs
                                  "
                                >
                                  Merchant Ref No:
                                </span>
                                <span
                                  v-show="item.referenceExtDocNo != ''"
                                  class="ml-2 text-xs"
                                >
                                  {{ item.referenceExtDocNo }}</span
                                >
                                <span
                                  v-show="item.referenceExtDocNo == ''"
                                  class="ml-2 text-xs"
                                >
                                  {{ item.referenceExtDocNo }}</span
                                >
                              </div>
                              <!-- <span class="text-xs">{{ item.referenceExtDocNo }}</span> -->
                              <!-- <span v-show="item.referenceExtDocNo != ''" class="text-xs">{{
                    item.referenceExtDocNo
                  }}</span>
                  <span v-show="item.referenceExtDocNo == ''" class="text-xs"
                    >NONE</span
                  > -->
                            </div>
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
                              :readonly="item.flgReconcile != 'N'"
                              :disabled="item.flgReconcile != 'N'"
                              @input="select($event)"
                            ></v-simple-checkbox>
                          </template>

                          <!-- format tanggal-->
                          <template #[`item.docDate`]="{ item }">
                            {{ dateFormat(item.docDate) }}
                          </template>

                          <!-- format tanggal-->
                          <template #[`item.settledAt`]="{ item }">
                            {{ dateTimeFormat(item.settledAt) }}
                          </template>

                          <!-- format uang-->
                          <template #[`item.txnAmount`]="{ item }">
                            Rp.{{ number_format(item.txnAmount) }}
                          </template>
                          <template #[`item.grandTotal`]="{ item }">
                            Rp.{{
                              number_format(
                                item.txnAmount - item.mdr - item.grossServiceFee
                              )
                            }}
                          </template>
                          <template #[`item.mdr`]="{ item }">
                            Rp.{{ number_format(item.mdr) }}
                          </template>
                          <template #[`item.nettServiceFee`]="{ item }">
                            Rp.{{ number_format(item.nettServiceFee) }}
                          </template>
                          <template #[`item.grossServiceFee`]="{ item }">
                            Rp.{{ number_format(item.grossServiceFee) }}
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

                          <!-- Produk -->
                          <template #[`item.product`]="{ item }">
                            <div>
                              <span
                                class="
                                  d-block
                                  text--primary
                                  font-weight-semibold
                                  text-truncate
                                "
                                >{{ item.productName }}</span
                              >
                              <span class="text-xs">{{
                                item.productCode
                              }}</span>
                            </div>
                          </template>

                          <!-- Status Flag reconcile-->
                          <template #[`item.flgReconcile`]="{ item }">
                            <v-chip
                              small
                              :class="`${
                                item.flgReconcile == 'Y' ? 'success' : 'error'
                              }--text`"
                              class="
                                v-chip-light-bg
                                font-weight-semibold
                                text-capitalize
                              "
                              :color="
                                item.flgReconcile == 'Y' ? 'success' : 'error'
                              "
                            >
                              {{ item.flgReconcile == "Y" ? "IYA" : "TIDAK" }}
                            </v-chip>
                          </template>

                          <template #[`item.tax`]="{ item }">
                            <div class="d-flex align-center">
                              <v-avatar color="#e6e6e6" size="30">
                                <span class="font-weight-medium">{{
                                  item.taxPercentage + "%"
                                }}</span>
                              </v-avatar>

                              <div class="d-flex flex-column ms-3">
                                <span
                                  class="
                                    d-block
                                    text--primary
                                    font-weight-semibold
                                    text-truncate
                                  "
                                  >{{ item.taxPrice }}</span
                                >
                                <span class="text-xs">
                                  <v-chip
                                    small
                                    :class="`${
                                      item.flgIncTax == 'Y'
                                        ? 'success'
                                        : 'warning'
                                    }--text`"
                                    class="
                                      v-chip-light-bg
                                      font-weight-semibold
                                      text-capitalize
                                    "
                                    :color="
                                      item.flgIncTax == 'Y'
                                        ? 'success'
                                        : 'warning'
                                    "
                                  >
                                    {{
                                      item.flgIncTax == "Y"
                                        ? "INCLUDE"
                                        : "EXCLUDE"
                                    }}
                                  </v-chip>
                                </span>
                              </div>
                            </div>
                          </template>

                          <!-- action -->
                          <template #[`item.actions`]="{ item }">
                            <v-tooltip bottom color="secondary">
                              <template #activator="{ on, attrs }">
                                <v-btn
                                  x-small
                                  icon
                                  color="secondary"
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="posItemList(item)"
                                >
                                  <v-icon>
                                    {{ icons.mdiTextBoxCheck }}
                                  </v-icon>
                                </v-btn>
                              </template>
                              <span>List Item</span>
                            </v-tooltip>
                          </template>
                        </v-data-table>
                        <v-pagination
                          v-model="currentPage"
                          :length="totalPages"
                          @input="handlePageChange"
                          total-visible="8"
                        ></v-pagination>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-row>
                  <v-col id="target-table-nonsf" cols="12" class="pb-0 mt-4">
                    <pos-filter-non-service-fee></pos-filter-non-service-fee>
                  </v-col>
                  <v-col cols="12">
                    <v-card flat>
                      <v-card-text>
                        <v-data-table
                          :headers="headersNonSF"
                          :items="mainDataNonSF"
                          hide-default-footer
                          disable-pagination
                          fixed-header
                          dense
                          item-key="id"
                        >
                          <template #[`header.docNo`]>
                            {{ docNo }}
                          </template>
                          <template #[`header.docDate`]>
                            {{ docDate }}
                          </template>
                          <template #[`header.ou`]>
                            {{ ouTbl }}
                          </template>
                          <template #[`header.txnAmount`]>
                            {{ trxAmount }}
                          </template>
                          <template #[`item.paymentMethod`]="{ item }">
                            <div class="d-flex align-center">
                              <v-tooltip bottom colors="primary">
                                <template #activator="{ on, attrs }">
                                  <v-avatar
                                    color="#e6e6e6"
                                    v-bind="attrs"
                                    v-on="on"
                                    size="30"
                                  >
                                    <v-img
                                      :src="
                                        require(`@/assets/images/logos/bank_logo/${item.logoImage}_logo.png`)
                                      "
                                    >
                                    </v-img>
                                  </v-avatar>
                                </template>
                              </v-tooltip>
                              <div class="d-flex flex-column ms-3">
                                <span
                                  class="
                                    d-block
                                    text--primary
                                    font-weight-semibold
                                    text-truncate
                                  "
                                  >{{ item.paymentMethod }}</span
                                >
                                <span class="text-xs">{{
                                  item.merchantIdentityName
                                }}</span>
                              </div>
                            </div>
                          </template>

                          <template #[`item.docNo`]="{ item }">
                            <div class="d-flex flex-column py-2">
                              <span
                                class="
                                  d-block
                                  text--primary
                                  font-weight-semibold
                                  text-truncate
                                "
                                >{{ item.docNo }}</span
                              >
                              <div class="d-flex">
                                <span
                                  class="
                                    d-block
                                    text--primary
                                    font-weight-semibold
                                    text-xs
                                  "
                                >
                                  Merchant Ref No:
                                </span>
                                <span
                                  v-show="item.referenceExtDocNo != ''"
                                  class="ml-2 text-xs"
                                >
                                  {{ item.referenceExtDocNo }}</span
                                >
                                <span
                                  v-show="item.referenceExtDocNo == ''"
                                  class="ml-2 text-xs"
                                >
                                  {{ item.referenceExtDocNo }}</span
                                >
                              </div>
                            </div>
                          </template>

                          <!-- format tanggal-->
                          <template #[`item.docDate`]="{ item }">
                            {{ dateFormat(item.docDate) }}
                          </template>

                          <!-- format tanggal-->
                          <template #[`item.settledAt`]="{ item }">
                            {{ dateTimeFormat(item.settledAt) }}
                          </template>

                          <!-- format uang-->
                          <template #[`item.txnAmount`]="{ item }">
                            Rp.{{ number_format(item.totalAmount) }}
                          </template>

                          <template #[`item.productFee`]="{ item }">
                            Rp.{{ number_format(item.productFee) }}
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

                          <!-- Produk -->
                          <template #[`item.product`]="{ item }">
                            <div>
                              <span
                                class="
                                  d-block
                                  text--primary
                                  font-weight-semibold
                                  text-truncate
                                "
                                >{{ item.productName }}</span
                              >
                              <span class="text-xs">{{
                                item.productCode
                              }}</span>
                            </div>
                          </template>

                          <!-- action -->
                          <template #[`item.actions`]="{ item }">
                            <v-tooltip bottom color="secondary">
                              <template #activator="{ on, attrs }">
                                <v-btn
                                  x-small
                                  icon
                                  color="secondary"
                                  v-bind="attrs"
                                  :disabled="item.flgReconcile == 'Y'"
                                  v-on="on"
                                  @click="serviceFeeDialog(item)"
                                >
                                  <v-icon>
                                    {{ icons.mdiTextBoxCheck }}
                                  </v-icon>
                                </v-btn>
                              </template>
                              <span>Service Fee Update</span>
                            </v-tooltip>
                          </template>
                        </v-data-table>
                        <v-pagination
                          v-model="currentPageNonSF"
                          :length="totalPagesNonSF"
                          @input="handlePageChangeNonSF"
                          total-visible="8"
                        ></v-pagination>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AppCardLoader from "@core/components/app-card-loader/AppCardLoader";
import AppAutocompliteOu from "@core/components/app-autocomplite-ou/AppAutocompliteOu";
import AppAutocompliteOuNonCompany from "@core/components/app-autocomplite-ou/AppAutocompliteOuNonCompany";
import AppAutocompliteOuBranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuBranch.vue";
import AppAutocompliteOuSubbranch from "@/@core/components/app-autocomplite-ou/AppAutocompliteOuSubbranch.vue";
import AppInputFieldDate from "@core/components/app-input-field/AppInputFieldDate";
import StatisticsCardSummary from "@core/components/statistics-card/StatisticsCardSummary";
import AppAutocomplitePaymentMethod from "@/@core/components/app-autocomplite-ou/AppAutocomplitePaymentMethod.vue";
import PosFilterNonServiceFee from "@/views/collector/pos/PosFilterNonServiceFee.vue";
import Form from "vform";
import moment from "moment";
import {
  mdiCashCheck,
  mdiCashMultiple,
  mdiClose,
  mdiCurrencyUsd,
  mdiDelete,
  mdiMagnify,
  mdiTextBoxCheck,
  mdiTrendingUp,
  mdiCheckAll,
} from "@mdi/js";
import axios from "@axios";
import themeConfig from "@themeConfig";
import router from "@/router";
import {
  dateFormat,
  dateTimeFormat,
  number_format,
  isInArray,
} from "../../../../constan";
import Vue from "vue";
import VueScrollTo from "vue-scrollto";
import vuetify from "@/plugins/vuetify";

Vue.use(VueScrollTo);

export default {
  name: "ChildList",
  components: {
    AppAutocompliteOu,
    AppAutocompliteOuNonCompany,
    AppInputFieldDate,
    StatisticsCardSummary,
    AppAutocomplitePaymentMethod,
    AppAutocompliteOuBranch,
    AppAutocompliteOuSubbranch,
    PosFilterNonServiceFee,
    vuetify,
    AppCardLoader,
  },
  data() {
    return {
      docNo: themeConfig.labeling.docNo,
      docDate: themeConfig.labeling.docDate,
      ouTbl: themeConfig.labeling.ouTbl,
      startDate: themeConfig.labeling.startDate,
      endDate: themeConfig.labeling.endDate,
      trxAmount: themeConfig.labeling.trxAmount,
      paymentMethod: themeConfig.labeling.paymentMethod,
      phProduct: themeConfig.placeholder.product,
      phDocNoRefExt: themeConfig.placeholder.docNoRefExt,

      itemId: 0,
      flgRecon: "N",

      currentTab: 0,

      // role name
      showDelete:
        isInArray(
          "deleteETicketingTransaction",
          this.$session.get("accessHumanTask")
        ) || JSON.parse(this.$session.get("userData")).username == "superadmin",

      snackbar: false,
      text: "",
      timeout: 2000,
      color: "",
      isLoading: false,
      showUpdateButton: false,

      isDialogVisible: false,
      itemListForm: false,
      formServiceFee: false,
      disabledCount: 0,
      currentPage: 1,
      // jumlah data di bagi jumlah item perpage
      totalPages: 1,

      currentPageNonSF: 1,
      totalPagesNonSF: 1,
      ofset: 0,
      ofsetNonSF: 0,
      itemPerPage: 25,
      itemPerPageNonSF: 25,
      searchItem: "",
      itemRow: [25, 50, 100],
      productList: [],
      mainData: [],
      mainDataItem: [],

      serviceFeeItem: [],

      mainDataNonSF: [],

      selected: [],
      serviceFeeForm: new Form({
        docNo: "",
        productFee: 0,
      }),
      filterForm: new Form({
        ouBranchId: -99,
        ouSubBranchId: -99,
        ouId: -99,
        productId: -99,
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
        flgReconcile: "All",
        paymentMethod: [],
        keyword: "",
      }),
      filterFormNonSF: new Form({
        ouBranchId: -99,
        ouSubBranchId: -99,
        dateFrom: moment().format("YYYY-MM-") + "01",
        dateTo: moment().format("YYYY-MM-DD"),
      }),
      icons: {
        mdiMagnify,
        mdiClose,
        mdiTextBoxCheck,
        mdiDelete,
        mdiCheckAll,
      },
      flgReconList: [
        {
          text: "All",
          value: "",
        },
        {
          text: "Yes",
          value: "Y",
        },
        {
          text: "No",
          value: "N",
        },
      ],
      headers: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
        },
        {
          text: "No. Dok.",
          value: "docNo",
          width: "350px",
        },
        {
          text: "Tanggal Dok.",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Unit Bisnis",
          value: "ou",
          width: "200px",
        },
        {
          text: "Product",
          value: "product",
          width: "200px",
        },
        // {
        //   text: "Aquiring",
        //   value: "merchantIdentityName",
        //   width: "150px",
        // },
        {
          text: "Payment Method",
          value: "paymentMethod",
          width: "175px",
        },
        {
          text: "Trx Amount",
          align: "right",
          value: "txnAmount",
          width: "170px",
        },
        {
          text: "MDR",
          align: "right",
          value: "mdr",
          width: "150px",
        },
        {
          text: "Total Service Fee",
          align: "right",
          value: "grossServiceFee",
          width: "175px",
        },
        // {
        //   text: 'TAX', value: 'tax', width: '150px',
        // },
        // {
        //   text: 'Nett Service Fee', align: 'right', value: 'nettServiceFee', width: '175px',
        // },
        {
          text: "Grand Total",
          align: "right",
          value: "grandTotal",
          width: "150px",
        },
        // {
        //   text: 'Rekon', value: 'flgReconcile', width: '100px', align: 'center',
        // },
        {
          text: "MID",
          value: "mid",
          width: "150px",
        },
        {
          text: "TID",
          value: "tid",
          width: "150px",
        },
        {
          text: "Issuer",
          value: "issuerIdentifier",
          width: "200px",
        },
        {
          text: "Settlement Datetime GMT +7",
          value: "settledAt",
          width: "250px",
        },
        // {
        //   text: 'No Ref Bank', value: 'bankReferenceNo', width: '200px',
        // },
        // {
        //   text: 'Bank Recieved', value: 'bankServedAt', width: '200px',
        // },
      ],

      headersNonSF: [
        {
          text: "Action",
          align: "center",
          value: "actions",
          sortable: false,
        },
        {
          text: "No. Dok.",
          value: "docNo",
          width: "350px",
        },
        {
          text: "Tanggal Dok.",
          value: "docDate",
          width: "150px",
        },
        {
          text: "Unit Bisnis",
          value: "ou",
          width: "200px",
        },
        {
          text: "Product",
          value: "product",
          width: "200px",
        },
        // {
        //   text: "Aquiring",
        //   value: "merchantIdentityName",
        //   width: "150px",
        // },
        {
          text: "Payment Method",
          value: "paymentMethod",
          width: "175px",
        },

        {
          text: "No Item",
          value: "itemIdentifierId",
          width: "170px",
        },
        {
          text: "Name",
          value: "itemIdentifierName",
          width: "170px",
        },
        {
          text: "Qty",
          value: "qty",
          width: "70px",
        },
        {
          text: "Service Fee",
          value: "productFee",
          align: "right",
          width: "170px",
        },
        {
          text: "Amount",
          align: "right",
          value: "txnAmount",
          width: "170px",
        },
      ],

      headersItem: [
        {
          text: "No Item",
          value: "itemIdentifierId",
          width: "200px",
        },
        {
          text: "Name",
          value: "itemIdentifierName",
          width: "200px",
        },
        {
          text: "Qty",
          align: "right",
          value: "qty",
          width: "150px",
        },
        {
          text: "Amount",
          align: "right",
          value: "price",
          width: "150px",
        },
        {
          text: "Service Fee",
          align: "right",
          value: "productFee",
          width: "150px",
        },
        {
          text: "Total",
          align: "right",
          value: "totalAmount",
          width: "150px",
        },
      ],
      revenue: {
        statTitle: "Grand Total",
        icon: mdiCurrencyUsd,
        color: "primary",
        subtitle: "Grand Total of Revenue",
        value: "Rp.0",
        loading: this.isLoading,
      },
      omset: {
        statTitle: "Amount",
        icon: mdiCashCheck,
        color: "info",
        subtitle: "Number of Trx",
        value: "Rp.0",
        loading: this.isLoading,
      },
      serviceFee: {
        statTitle: "Service Fee",
        icon: mdiCashMultiple,
        color: "success",
        subtitle: "Service Fee Amount",
        value: "Rp.0",
        loading: this.isLoading,
      },
      mdr: {
        statTitle: "MDR",
        icon: mdiCashMultiple,
        color: "warning",
        subtitle: "MDR Amount",
        value: "Rp.0",
        loading: this.isLoading,
      },
    };
  },
  mounted() {
    // this.isLoading = true;
    // this.isDialogVisible = true;
    // this.getProductList();
    // this.refreshData();
    this.$root.$on("appAutocompliteOuBranchTicketingHistory", (msg) => {
      this.filterForm.ouSubBranchId = -99;
    });
    this.promiseAll();

    this.$root.$on("posFilterNonServiceFee", (msg) => {
      this.filterFormNonSF = msg;
      if (
        this.filterFormNonSF.ouBranchId == -99 ||
        this.filterFormNonSF.ouBranchId == null
      ) {
        this.currentPageNonSF = 1;
        this.ofsetNonSF = 0;
        this.currentPageNonSF = 1;
        this.totalPagesNonSF = 1;
        this.mainDataNonSF = [];
        this.notif("error", "Failed", "Please Pick Group Merchant!");
      } else {
        this.currentPageNonSF = 1;
        this.ofsetNonSF = 0;
        this.refreshDataNonSF();
      }
    });
    // this.posItemList(2023)
  },
  methods: {
    confirmFilter() {
      this.ofset = 0;
      this.currentPage = 1;
      this.promiseAll();
      // this.refreshData();
    },
    notif(Type, Title, Text) {
      this.snackbar = true;
      this.text = Text;
      this.color = Type;
    },
    dateFormat(value) {
      if (value != "") {
        return dateFormat(value.substring(0, 8));
      } else {
        return "";
      }
    },
    dateTimeFormat(value) {
      if (value != "") {
        return dateTimeFormat(value);
      } else {
        return "";
      }
    },
    number_format(value) {
      // eslint-disable-line camelcase
      return number_format(value, 2, ",", ".");
    },
    async getItemPerPage(val) {
      this.itemPerPage = val;
      this.ofset = 0;
      this.currentPage = 1;
      await this.refreshData();
      this.isDialogVisible = false;
    },
    serviceFeeDialog(item) {
      if (item.flgReconcile == "N") {
        this.showUpdateButton = true;
      } else {
        this.showUpdateButton = false;
      }
      this.serviceFeeItem = item;
      this.serviceFeeForm.docNo = item.docNo;
      this.serviceFeeForm.productFee = item.productFee;
      this.formServiceFee = true;
      console.log(this.serviceFeeItem);
    },
    scrollTo() {
      VueScrollTo.scrollTo("#target-table");
    },
    scrollToNonSF() {
      VueScrollTo.scrollTo("#target-table-nonsf");
    },
    async handlePageChange(value) {
      this.currentPage = value;
      if (this.currentPage == 1) {
        this.ofset = 0;
      } else {
        this.ofset = (this.currentPage - 1) * this.itemPerPage;
      }
      await this.refreshData();
      this.scrollTo();
      this.isDialogVisible = false;
    },
    async handlePageChangeNonSF(value) {
      this.currentPageNonSF = value;
      if (this.currentPageNonSF == 1) {
        this.ofsetNonSF = 0;
      } else {
        this.ofsetNonSF = (this.currentPageNonSF - 1) * this.itemPerPageNonSF;
      }
      await this.refreshDataNonSF();
      this.scrollToNonSF();
    },
    selectAllToggle(props) {
      if (this.selected.length != this.mainData.length - this.disabledCount) {
        this.selected = [];
        props.items.forEach((item) => {
          if (item.flgReconcile == "N") {
            this.selected.push(item);
          }
        });
      } else {
        this.selected = [];
      }
    },
    closeForm() {
      this.itemListForm = false;
      this.isDialogVisible = false;
      this.formServiceFee = false;
    },
    refreshDataFilter() {
      if (this.currentTab == 0) {
        this.promiseAll();
      } else {
        // this.refreshData();
      }
    },
    serviceFeeUpdate() {
      const filteredArray = this.mainDataItem
        .filter(
          (obj) => obj.hasOwnProperty("id") && obj.hasOwnProperty("productFee")
        )
        .map(({ id, productFee }) => ({ id, productFee }));

      const filteredArrayItem = [
        {
          id: this.serviceFeeItem.id,
          productFee: this.serviceFeeForm.productFee,
        },
      ];

      const posItem = this.currentTab == 0 ? filteredArray : filteredArrayItem;
      const txnposId =
        this.currentTab == 0 ? this.itemId : this.serviceFeeItem.txnPosId;

      this.isDialogVisible = true;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_pc}/pos/edit`,
          {
            txnposId: txnposId,
            posItem: posItem,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.notif("success", "Success", response.data.meta.message);
            if (this.currentTab == 0) {
              this.posItemList();
              this.itemListForm = true;
            } else {
              this.currentPageNonSF = 1;
              this.ofsetNonSF = 0;
              this.refreshDataNonSF();
              this.formServiceFee = false;
            }
            this.isDialogVisible = false;
          } else {
            this.isDialogVisible = false;
          }
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
    confirmDialog() {
      const dataCount = this.selected.length;
      if (dataCount > 0) {
        this.$dialog
          .confirm("Are you sure you want to delete " + dataCount + " item?.", {
            loader: true,
          })
          .then((dialog) => {
            this.removeData();
            setTimeout(() => {
              this.promiseAll();
              dialog.close();
            }, 500);
          })
          .catch(() => {
            // this.refreshData();
          });
      } else {
        this.notif("error", "Failed", "Please select data first!.");
      }
    },
    removeData() {
      this.isDialogVisible = true;
      const posIdList = [];
      this.selected.forEach((item) => {
        posIdList.push(item.id);
      });
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(
          `${themeConfig.app.api_pc}/pos/remove`,
          {
            txnPosId: posIdList,
          },
          config
        )
        .then((response) => {
          this.notif("success", "Success", response.data.meta.message);
          posIdList = [];
        })
        .catch((e) => {
          this.notif("error", "Failed", e.response.data.message);
          posIdList = [];
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
        });
    },
    getProductList() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      return axios
        .post(
          `${themeConfig.app.api_master}/product/list`,
          {
            brandCode: ["M.23.001"],
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
    posItemList(item) {
      this.isDialogVisible = true;
      this.itemId = item.id;
      this.flgRecon = item.flgReconcile;
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .get(
          `${themeConfig.app.api_pc}/pos/pos-item-list?posId=${this.itemId}`,
          config
        )
        .then((response) => {
          this.itemListForm = true;
          if (response.data.result !== null)
            return (this.mainDataItem = response.data.result);
          this.mainDataItem = [];
        })
        .catch((e) => {
          if (e.response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            router.push({ name: "auth-login" });
          }
          this.notif("error", "Failed", e.response.data.meta.message);
        });
      this.isDialogVisible = false;
    },
    getCountData() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" || this.filterForm.ouId == null
          ? -99
          : parseInt(this.filterForm.ouId);
      const ouBranchId =
        this.filterForm.ouBranchId == "" || this.filterForm.ouBranchId == null
          ? -99
          : parseInt(this.filterForm.ouBranchId);

      const ouSubBranchId =
        this.filterForm.ouSubBranchId == "" ||
        this.filterForm.ouSubBranchId == null
          ? -99
          : parseInt(this.filterForm.ouSubBranchId);
      const productId =
        this.filterForm.productId == "" || this.filterForm.productId == null
          ? -99
          : parseInt(this.filterForm.productId);
      const dateFrom =
        moment(this.filterForm.dateFrom).format("YYYYMMDD") + "000000";
      const dateTo =
        moment(this.filterForm.dateTo).format("YYYYMMDD") + "235959";
      const flgRecon =
        this.filterForm.flgReconcile == "All"
          ? ""
          : this.filterForm.flgReconcile;
      const paymentMethod =
        this.filterForm.paymentMethod == null
          ? []
          : this.filterForm.paymentMethod;
      return axios
        .post(
          `${themeConfig.app.api_pc}/pos/count`,
          {
            ouBranchId: ouBranchId,
            ouSubBranchId: ouSubBranchId,
            productId: productId,
            settledFrom: dateFrom,
            settledTo: dateTo,
            flgReconcile: flgRecon,
            limit: this.itemPerPage,
            offset: this.ofset,
            keyword: this.filterForm.keyword,
            paymentMethod: paymentMethod,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            const revenue =
              response.data.result[0].txnAmount -
              response.data.result[0].mdr -
              response.data.result[0].serviceFee;
            this.revenue.value = "Rp." + number_format(revenue, 2, ",", ".");
            this.mdr.value =
              "Rp." + number_format(response.data.result[0].mdr, 2, ",", ".");
            this.serviceFee.value =
              "Rp." +
              number_format(response.data.result[0].serviceFee, 2, ",", ".");
            this.omset.value =
              "Rp." +
              number_format(response.data.result[0].txnAmount, 2, ",", ".");
            this.omset.subtitle =
              "Number of Txn " +
              number_format(response.data.result[0].txnCount);
            this.totalPages = 1;
            if (response.data.result[0].txnCount > this.itemPerPage) {
              this.totalPages = Math.ceil(
                response.data.result[0].txnCount / this.itemPerPage
              );
            }
          } else {
            this.trxCount.value = "0";
            this.revenue.value = "Rp.0";
            this.mdr.value = "Rp.0";
            this.omset.subtitle = "Number of Txn 0";
            this.omset.value = "Rp.0";
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
    getCountDataNonSF() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouBranchId =
        this.filterFormNonSF.ouBranchId == "" ||
        this.filterFormNonSF.ouBranchId == null
          ? -99
          : parseInt(this.filterFormNonSF.ouBranchId);
      const ouSubBranchId =
        this.filterFormNonSF.ouSubBranchId == "" ||
        this.filterFormNonSF.ouSubBranchId == null
          ? -99
          : parseInt(this.filterFormNonSF.ouSubBranchId);
      const dateFrom = moment(this.filterFormNonSF.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterFormNonSF.dateTo).format("YYYYMMDD");
      axios
        .get(
          `${themeConfig.app.api_pc}/pos/count-pos-item-non-service-fee-list?ouBranchId=${ouBranchId}&ouSubBranchId=${ouSubBranchId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
          config
        )
        .then((response) => {
          if (response.data.result != null) {
            this.totalPagesNonSF = Math.ceil(
              response.data.result / this.itemPerPageNonSF
            );
          } else {
            this.totalPagesNonSF = 1;
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
      this.isDialogVisible = false;
    },
    refreshData() {
      this.isDialogVisible = true;
      this.disabledCount = 0;
      this.selected = [];
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouId =
        this.filterForm.ouId == "" || this.filterForm.ouId == null
          ? -99
          : parseInt(this.filterForm.ouId);
      const ouBranchId =
        this.filterForm.ouBranchId == "" || this.filterForm.ouBranchId == null
          ? -99
          : parseInt(this.filterForm.ouBranchId);

      const ouSubBranchId =
        this.filterForm.ouSubBranchId == "" ||
        this.filterForm.ouSubBranchId == null
          ? -99
          : parseInt(this.filterForm.ouSubBranchId);
      const productId =
        this.filterForm.productId == "" || this.filterForm.productId == null
          ? -99
          : parseInt(this.filterForm.productId);
      const dateFrom =
        moment(this.filterForm.dateFrom).format("YYYYMMDD") + "000000";
      const dateTo =
        moment(this.filterForm.dateTo).format("YYYYMMDD") + "235959";
      const flgRecon =
        this.filterForm.flgReconcile == "All"
          ? ""
          : this.filterForm.flgReconcile;
      const paymentMethod =
        this.filterForm.paymentMethod == null
          ? []
          : this.filterForm.paymentMethod;
      return axios
        .post(
          `${themeConfig.app.api_pc}/pos/list`,
          {
            ouBranchId: ouBranchId,
            ouSubBranchId: ouSubBranchId,
            productId: productId,
            settledFrom: dateFrom,
            settledTo: dateTo,
            flgReconcile: flgRecon,
            limit: this.itemPerPage,
            offset: this.ofset,
            keyword: this.filterForm.keyword,
            paymentMethod: paymentMethod,
          },
          config
        )
        .then((response) => {
          if (response.data.result !== null) {
            this.mainData = response.data.result;
            this.mainData.map((item) => {
              if (item.flgReconcile != "N") this.disabledCount += 1;
            });
            this.mainData.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainData[index].merchantIdentityName +
                    "_logo.png")
                ) {
                  this.mainData[index].logoImage =
                    this.mainData[index].merchantIdentityName;
                }
              } catch (e) {
                this.mainData[index].logoImage = "NONE";
              }
            });
          } else {
            this.mainData = [];
            this.disabledCount = 0;
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
    refreshDataNonSF() {
      this.isDialogVisible = true;
      this.disabledCount = 0;
      this.selected = [];
      const config = {
        headers: {
          Authorization: `Bearer ${this.$session.get("accessToken")}`,
          "Access-Control-Allow-Origin": "*",
        },
      };
      const ouBranchId =
        this.filterFormNonSF.ouBranchId == "" ||
        this.filterFormNonSF.ouBranchId == null
          ? -99
          : parseInt(this.filterFormNonSF.ouBranchId);
      const ouSubBranchId =
        this.filterFormNonSF.ouSubBranchId == "" ||
        this.filterFormNonSF.ouSubBranchId == null
          ? -99
          : parseInt(this.filterFormNonSF.ouSubBranchId);
      const dateFrom = moment(this.filterFormNonSF.dateFrom).format("YYYYMMDD");
      const dateTo = moment(this.filterFormNonSF.dateTo).format("YYYYMMDD");
      return axios
        .get(
          `${themeConfig.app.api_pc}/pos/pos-item-non-service-fee-list?ouBranchId=${ouBranchId}&ouSubBranchId=${ouSubBranchId}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${this.itemPerPageNonSF}&offset=${this.ofsetNonSF}`,
          config
        )
        .then((response) => {
          if (response.data.result != null) {
            this.mainDataNonSF = response.data.result;
            this.getCountDataNonSF();
            this.mainDataNonSF.forEach((element, index) => {
              try {
                if (
                  require("@/assets/images/logos/bank_logo/" +
                    this.mainDataNonSF[index].merchantIdentityName +
                    "_logo.png")
                ) {
                  this.mainDataNonSF[index].logoImage =
                    this.mainDataNonSF[index].merchantIdentityName;
                }
              } catch (e) {
                this.mainDataNonSF[index].logoImage = "NONE";
              }
            });
          } else {
            this.currentPageNonSF = 1;
            this.ofsetNonSF = 0;
            this.currentPageNonSF = 1;
            this.totalPagesNonSF = 1;
            this.mainDataNonSF = [];
            this.isDialogVisible = false;
          }
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
    promiseAll() {
      this.isLoading = true;
      this.isDialogVisible = true;

      const promises = [
        this.getProductList(),
        this.refreshData(),
        this.getCountData(),
      ];

      Promise.all(promises)
        .then((res) => {
          this.isLoading = false;
          this.isDialogVisible = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.isDialogVisible = false;
        });
    },
  },
};
</script>
