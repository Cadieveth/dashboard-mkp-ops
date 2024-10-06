import { mdiReceipt } from "@mdi/js";

export default [
  {
    subheader: "Finance",
    resource: "Public",
    action: "read",
    accessPage: ["viewProduct"],
  },
  {
    title: "Invoice",
    icon: mdiReceipt,
    children: [
      {
        title: "Create Account Receivable",
        to: "create-invoice-ar",
        resource: "Public",
        action: "read",
        accessPage: "all",
      },
      {
        title: "Inquiry A/R",
        children: [
          {
            title: "Generate Outstanding",
            to: "invoice-ar",
            resource: "Public",
            action: "read",
            accessPage: "all",
          },
          {
            title: "Summary Inquiry",
            to: "invoice-ar-inquiry-summary",
            resource: "Public",
            action: "read",
            accessPage: "all",
          },
        ],
        accessPage: ["all"],
      },
      {
        title: "Inquiry A/P",
        children: [
          {
            title: "Bank",
            to: "invoice-ap-bank",
            resource: "Public",
            action: "read",
            accessPage: "all",
          },
          {
            title: "Mitra",
            to: "invoice-ap-partner",
            resource: "Public",
            action: "read",
            accessPage: "all",
          },
        ],
        accessPage: ["all"],
      },
    ],
    accessPage: ["all"],
  },
];
