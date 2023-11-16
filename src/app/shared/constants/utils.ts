import * as moment from 'moment';
import { RG_EMAIL } from './regex.utils';

export function convertToLatinUpperCase(content: any): any {
    if (content === '') {
        return '';
    }
    let str = content;
    str = str.replace(/á|à|ạ|ả|ã|â|ấ|ầ|ậ|ẩ|ẫ|ă|ắ|ằ|ặ|ẳ|ẵ/g, 'A');
    str = str.replace(/Á|À|Ạ|Ả|Ã|Â|Ấ|Ầ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/é|è|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ể|ễ/g, 'E');
    str = str.replace(/É|È|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/í|ì|ị|ỉ|ĩ/g, 'I');
    str = str.replace(/Í|Ì|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/ó|ò|ọ|ỏ|õ|ô|ố|ồ|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'O');
    str = str.replace(/Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/ú|ù|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'U');
    str = str.replace(/Ú|Ù|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/y|ỳ|ỵ|ỷ|ỹ/g, 'Y');
    str = str.replace(/Ý|Ỳ|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/-|=|/g, '');
    str = str.replace(/~|`|!|@|#|%|&|(|)|_/g, '');
    str = str.replace(/,|<|>|"|;|'|:|/g, '');
    return str;
}

export function convertToLatinLowerCase(content: any): any {
  if (content === '') {
      return '';
  }
  let str = content;
  str = str.replace(/á|à|ạ|ả|ã|â|ấ|ầ|ậ|ẩ|ẫ|ă|ắ|ằ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/Á|À|Ạ|Ả|Ã|Â|Ấ|Ầ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ/g, 'a');
  str = str.replace(/é|è|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ể|ễ/g, 'e');
  str = str.replace(/É|È|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ/g, 'e');
  str = str.replace(/í|ì|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/Í|Ì|Ị|Ỉ|Ĩ/g, 'i');
  str = str.replace(/ó|ò|ọ|ỏ|õ|ô|ố|ồ|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'o');
  str = str.replace(/ú|ù|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/Ú|Ù|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'u');
  str = str.replace(/y|ỳ|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/Ý|Ỳ|Ỵ|Ỷ|Ỹ/g, 'y');
  str = str.replace(/Đ/g, 'd');
  str = str.replace(/-|=|/g, '');
  str = str.replace(/~|`|!|@|#|%|&|(|)|_/g, '');
  str = str.replace(/,|<|>|"|;|'|:|/g, '');
  return str;
}

/**
 * Handle validate email
 * @param email : string email
 */
export function fnValidateEmail(email): boolean{
    const regex = RG_EMAIL;
    if (email.match(regex)) {
      return true;
    } else {
      return false;
    }
}

/**
 * Fn so sánh date
 */
// tslint:disable-next-line:variable-name
export function compareDate(f_date: any, t_date: any): number {
  const from = moment(f_date, 'DD/MM/YYYY');
  const to = moment(t_date, 'DD/MM/YYYY');
  if (from > to) { return 1; }
  else if (from < to) { return -1; }
  else { return 0; }
}


// tslint:disable-next-line:variable-name
export function getDecimals(number: any): string {
  if (String(number).indexOf('.') > 0) {
    return (String(number).substr(String(number).indexOf('.') + 0));
  } else {
    return '';
  }
}

// tslint:disable-next-line:typedef
export function formatPoint(content: string) {
  return content.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// tslint:disable-next-line:typedef
export function removeComma(value: any) {
  return value.toString().replace(/\,/gi, '').trim();
}

export const CUSTOM_MAT_DATE_FORMATS = {
  parse: {
    dateInput: 'inputDate',
  },
  display: {
    // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    dateInput: 'input',
    // monthYearLabel: { month: 'short', year: 'numeric', day: 'numeric' },
    monthYearLabel: 'inputMonth',
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

