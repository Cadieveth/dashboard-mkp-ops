export const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

export const checkHumanTask = (taskType) => {
  return (
    sessionStorage.getItem("accessHumanTask").indexOf(taskType) > -1 ||
    JSON.parse(sessionStorage.getItem("userData")).username == "superadmin"
  );
};
