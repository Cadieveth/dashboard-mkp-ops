export function sumTotalAmount(amountType, arr) {
  return arr.reduce((total, obj) => total + obj[amountType], 0);
}
