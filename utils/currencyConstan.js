export function formatCurrency(value, decimalPlaces = 2) {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: decimalPlaces,
  });
  const formattedValue = formatter.format(value);
  if (value === "" || value === undefined) {
    return "";
  } else {
    return formattedValue.replace("Rp", "Rp.");
  }
}
