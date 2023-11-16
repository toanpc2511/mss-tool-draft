export class TimeHelper{
  static getPrettyDateString(date: Date){
    let normalizedDateStr = date.toLocaleString("en-GB");
    normalizedDateStr = normalizedDateStr.replace(",", "");
    return normalizedDateStr;
  }
}
