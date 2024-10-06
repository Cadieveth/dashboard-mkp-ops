import moment from "moment";

export function dateFormat(value) {
  return value ? moment(value).format("YYYYMMDD") : "";
}

export function dateFormatRequired(value) {
  return moment(value).format("YYYYMMDD");
}

export function dateDisplay(date) {
  return moment(date).format("DD MMM YYYY");
}

export function dateForComponent(date) {
  return date ? moment(date).format("YYYY-MM-DD") : "";
}

export function dateTimeFormat(date) {
  return date
    ? moment(date, "YYYYMMDDHHmmss").format("DD MMM YYYY, HH:mm:ss")
    : "";
}
