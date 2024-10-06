import {
  mdiBallotRecountOutline,
  mdiCashCheck,
  mdiCashMultiple,
  mdiCashRegister,
  mdiFileDocumentMultipleOutline,
  mdiHomeOutline,
  mdiMenu,
  mdiReceipt,
  mdiTicket,
} from "@mdi/js";

export default [
  // {
  //   title: "Menu Levels",
  //   // icon: mdiMenu,
  //   children: [
  //     {
  //       title: "Menu Level 2.1",
  //       accessPage: "all",
  //     },
  //     {
  //       title: "Menu Level 2.2",
  //       children: [
  //         {
  //           title: "Menu Level 3.1",
  //           accessPage: "all",
  //         },
  //         {
  //           title: "Menu Level 3.2",
  //           accessPage: "all",
  //         },
  //       ],
  //       accessPage: "all",
  //     },
  //   ],
  //   accessPage: ["all"],
  // },
  {
    title: "Dashboards",
    icon: mdiHomeOutline,
    children: [
      {
        title: "Analitik",
        to: "dashboard-analytics",
        resource: "Public",
        action: "read",
        accessPage: "all",
      },
      {
        title: "My Document",
        to: "my-document",
        resource: "Public",
        action: "read",
        accessPage: "all",
      },
    ],
    accessPage: ["all"],
  },
  {
    title: "Point Of Sales",
    icon: mdiCashRegister,
    children: [
      {
        title: "Menu Level 2.1",
        resource: "Public",
        action: "read",
        accessPage: "no",
      },
      {
        title: "Pembayaran",
        children: [
          {
            title: "Riwayat Transaksi",
            to: "payment",
            resource: "Public",
            action: "read",
            accessPage: "viewPaymentTransaction",
          },
        ],
        accessPage: ["viewPaymentTransaction"],
      },
      {
        title: "E-Ticketing",
        children: [
          {
            title: "Riwayat Transaksi",
            to: "pos",
            resource: "Public",
            action: "read",
            accessPage: "viewETicketingTransaction",
          },
        ],
        accessPage: ["viewETicketingTransaction"],
      },
    ],
    accessPage: ["viewPaymentTransaction", "viewETicketingTransaction"],
  },
  {
    title: "Reconciliation",
    icon: mdiBallotRecountOutline,
    children: [
      // {
      //   title: "Menu Level 2.1",
      //   resource: "Public",
      //   action: "read",
      //   accessPage: "no",
      // },
      // {
      //   title: "Reconciliation",
      //   children: [
      {
        title: "Penutupan Transaksi",
        to: "summary-daily-collector",
        resource: "Public",
        action: "read",
        accessPage: "viewClosingMerchantTransaction",
      },
      {
        title: "Detail Bank Settlement",
        to: "detail-bank-settlement",
        resource: "Public",
        action: "read",
        accessPage: "viewBankMerchantTransaction",
      },
      {
        title: "Bank Reconciliation",
        to: "bank-recociliation",
        resource: "Public",
        action: "read",
        accessPage: "viewBankMerchantTransaction",
      },
      // {
      //   title: "Bank Settle",
      //   to: "advance-settle",
      //   resource: "Public",
      //   action: "read",
      //   accessPage: "viewAdvanceSettlement",
      // },
      {
        title: "Summary Bank Reconcile",
        to: "summary-bank-recociliation",
        resource: "Public",
        action: "read",
        accessPage: "viewDataTransactionSettlement",
      },
    ],
    //   accessPage: [
    //     "viewClosingMerchantTransaction",
    //     "viewBankMerchantTransaction",
    //     "viewAdvanceSettlement",
    //     "viewDataTransactionSettlement",
    //   ],
    // },
    // ],
    accessPage: [
      "viewClosingMerchantTransaction",
      "viewBankMerchantTransaction",
      "viewAdvanceSettlement",
      "viewDataTransactionSettlement",
    ],
  },
  {
    title: "Cash Flow & Transaction",
    icon: mdiCashMultiple,
    children: [
      {
        title: "Menu Level 2.1",
        resource: "Public",
        action: "read",
        accessPage: "no",
      },
      {
        title: "Document",
        children: [
          {
            title: "Transfer",
            to: "cash-bank-transfer",
            resource: "Public",
            action: "read",
            accessPage: "viewCashbankTransfer",
          },
          {
            title: "For Disburs",
            to: "cash-bank-for-disbursement",
            resource: "Public",
            action: "read",
            accessPage: "viewDisbursement",
          },
          {
            title: "Manual Disbursement",
            to: "cash-bank-manual-disbursement",
            resource: "Public",
            action: "read",
            accessPage: "viewManualDisbursement",
          },
          {
            title: "Mutasi Bank",
            to: "mutasi-bank",
            resource: "Public",
            action: "read",
            accessPage: "viewBankStatement",
          },
          {
            title: "Cash/Bank In Partner Receive",
            to: "cash-bank-in-partner-receive",
            resource: "Public",
            action: "read",
            accessPage: "viewCashBankInPartner",
          },
          {
            title: "Conversion Cash/Bank",
            to: "cash-bank-partner-receive",
            resource: "Public",
            action: "read",
            accessPage: "viewConversionCashBankInPartnerReceive",
          },
          {
            title: "Transfer Cash/Bank",
            to: "transfer-cash-bank",
            resource: "Public",
            action: "read",
            accessPage: "viewTransferCashbank",
          },
        ],
        accessPage: [
          "viewDisbursement",
          "viewCashbankTransfer",
          "viewBankStatement",
          "viewCashBankInPartner",
          "viewConversionCashBankInPartnerReceive",
          "viewTransferCashbank",
          "viewManualDisbursement",
        ],
      },
      {
        title: "Inquiry",
        children: [
          {
            title: "Trx Daily",
            to: "cash-bank-daily-disbursement",
            resource: "Public",
            action: "read",
            accessPage: "viewReportDailyCashbank",
          },
          {
            title: "Inquiry Mutasi Bank",
            to: "inquiry-mutasi-bank",
            resource: "Public",
            action: "read",
            accessPage: "viewInquiryProgressBank",
          },
        ],
        accessPage: ["viewReportDailyCashbank", "viewInquiryProgressBank"],
      },
      {
        title: "Report",
        children: [
          {
            title: "Cash/Bank Payment Order Internal",
            to: "sales-report",
            resource: "Public",
            action: "read",
            accessPage: "viewReportPaymentOrderInternal",
          },
          {
            title: "Disbursement Mutation for Merchant",
            to: "disbursement-mutation",
            resource: "Public",
            action: "read",
            accessPage: "downloadReportInvoiceSettlementXlsx",
          },
          {
            title: "Disbursement",
            to: "disbursement-report",
            resource: "Public",
            action: "read",
            accessPage: "downloadReportInvoiceSettlementXlsx",
          },
          {
            title: "Disbursement Summary",
            to: "disbursement-summary-report",
            resource: "Public",
            action: "read",
            accessPage: "downloadReportInvoiceSettlementXlsx",
          },
        ],
        accessPage: [
          "viewReportPaymentOrderInternal",
          "downloadReportInvoiceSettlementXlsx",
        ],
      },
    ],
    accessPage: [
      "viewDisbursement",
      "viewCashbankTransfer",
      "viewBankStatement",
      "viewCashBankInPartner",
      "viewConversionCashBankInPartner",
      "viewReportDailyCashbank",
      "viewInquiryProgressBank",
      "viewReportPaymentOrderInternal",
      "viewTransferCashbank",
    ],
  },

  {
    title: "Business & Financial",
    icon: mdiReceipt,
    children: [
      {
        title: "Create Account Receivable",
        to: "create-invoice-ar",
        resource: "Public",
        action: "read",
        accessPage: "no",
      },
      {
        title: "Document",
        children: [
          {
            title: "Invoicing Transactional",
            to: "create-invoice-ar",
            resource: "Public",
            action: "read",
            accessPage: "viewInvoicingTransactional",
          },
        ],
        accessPage: ["viewInvoicingTransactional"],
      },
      {
        title: "Billing Forecasting",
        children: [
          {
            title: "Generate Outstanding",
            to: "invoice-ar",
            resource: "Public",
            action: "read",
            accessPage: "viewGenerateInvoicingForecasting",
          },
        ],
        accessPage: ["viewGenerateInvoicingForecasting"],
      },
      {
        // History Progress Invoice
        title: "Inquiry A/P",
        children: [
          {
            title: "Invoice A/P Settlement",
            to: "invoice-ap-bank",
            resource: "Public",
            action: "read",
            accessPage: "viewProgressAPforBank",
          },
          // {
          //   title: "Mitra",
          //   to: "invoice-ap-partner",
          //   resource: "Public",
          //   action: "read",
          //   accessPage: "viewProgressAPforMerchant",
          // },

          // {
          //   title: "New Menu",
          //   resource: "Public",
          //   children: [
          //     {
          //       title: "new menu lv 2",
          //       accessPage: "all",
          //     },
          //   ],
          //   accessPage: "all",
          // },
        ],
        // accessPage: "all",
        accessPage: ["viewProgressAPforBank"],
      },
      {
        title: "Report",
        children: [
          {
            title: "Monitoring Invoice Settlement",
            to: "inquiry-report",
            resource: "Public",
            action: "read",
            accessPage: "viewReportInvoiceSettlement",
          },
        ],
        accessPage: ["viewReportInvoiceSettlement"],
      },
    ],
    accessPage: [
      "viewInvoicingTransactional",
      "viewGenerateInvoicingForecasting",
      "viewProgressAPforBank",
      "viewProgressAPforMerchant",
      "viewReportInvoiceSettlement",
    ],
  },
  {
    title: "Sales",
    icon: mdiFileDocumentMultipleOutline,
    children: [
      {
        title: "Sales",
        to: "",
        resource: "Public",
        action: "read",
        accessPage: "no",
      },
      {
        title: "Document",
        children: [
          {
            title: "Sales Invoice",
            to: "sales-invoice",
            resource: "Public",
            action: "read",
            accessPage: "viewSalesInvoice",
          },
          {
            title: "Sales Invoice Net Off",
            to: "sales-invoice-netoff-transactional",
            resource: "Public",
            action: "read",
            accessPage: "viewSalesInvoice",
          },
        ],
        accessPage: ["viewSalesInvoice"],
      },

      // {
      //   title: "Sales Order",
      //   children: [
      //     {
      //       title: "Sales Order",
      //       to: "sales-order",
      //       resource: "Public",
      //       action: "read",
      //       accessPage: "all",
      //     },
      //   ],
      //   accessPage: ["all"],
      // },
      {
        title: "Report",
        children: [
          {
            title: "Sales Order Revenue by Partner",
            to: "order-report",
            resource: "Public",
            action: "read",
            accessPage: "viewOrderRevenueByPartner",
          },
        ],
        accessPage: ["viewOrderRevenueByPartner"],
      },
    ],
    accessPage: ["viewSalesInvoice", "viewOrderRevenueByPartner"],
  },
];
