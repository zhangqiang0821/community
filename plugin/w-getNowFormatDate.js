//当前日期 格式：201706270913
const getDateStr = t => {
  if (t >= 1 && t <= 9) {
    t = "0" + t;
  }
  return t
}
const getNowFormatDate = () => {
  var date = new Date();
  var year = date.getFullYear();
  var month = getDateStr(date.getMonth() + 1);
  var strDate = getDateStr(date.getDate());
  var hours = getDateStr(date.getHours());
  var Minutes = getDateStr(date.getMinutes());
  return year + month + strDate + hours + Minutes
}

module.exports = getNowFormatDate;