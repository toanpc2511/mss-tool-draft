import * as moment from "moment";

export class DateHelper {
  static getDateFromString(dateStr: string): Date {
    if (!dateStr) {
      return null;
    }

    let datePatterns = [
      'DD/MM/YYYY',
      'DD/MMM/YY',
      'DD/MMM/YYYY',
      'DD/MMMM/YYYY',
    ];
    datePatterns = [
      ...datePatterns,
      ...datePatterns.map((pattern) => pattern.replace(/\//g, '-')),
    ];

    const pattern = datePatterns.find((pattern) => {
      return moment(dateStr, pattern, true).isValid();
    })

    if(pattern){
      return moment(dateStr, pattern).toDate();
    }

    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }

    return null;
  }
}
