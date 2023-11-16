import * as moment from "moment";

const convertCharacters = (value: string): string => {
  const key = toNoSign(value).toUpperCase().replace(/ /g, "")
  return key
}
const toNoSign = (value: string): string => {
  if (value === '' || !value) {
    return '';
  }
  let str = value;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Í|Ì|Ị|Ỉ|Ỉ/g, 'I');
  str = str.replace(/Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ú|Ù|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  //console.log('after ', str);
  return str;
}

const handleValueFilter = (conditions): string => {
  const arr = [];
  const arrKeyOl = [];
  let valueKeyOl = '';
  const arrKeyOeq = [];
  let valueKeyOeq = '';
  let keyIn = '';
  const valueKeyIn = [];
  let keyNin = '';
  const valueKeyNin = [];
  conditions.forEach((item) => {
    if (item.value) {
      switch (item.operator) {
        case 'ol':
          arrKeyOl.push(item.property);
          valueKeyOl = item.value;
          break;
        case 'oeq':
          arrKeyOeq.push(item.property);
          valueKeyOeq = item.value;
          break;
        // case 'in':
        //   keyIn = item.property;
        //   valueKeyIn.push(item.value);
        //   arr.push(`${keyIn}|in|${item.value}`);
        //   break;
        case 'nin':
          keyNin = item.property;
          valueKeyNin.push(item.value);
          break;
        default:
          arr.push(`${item.property}|${item.operator}|${item.value}`);
          break;
      }
    }
  });
  if (arrKeyOl.length > 0) {
    arr.push(`${arrKeyOl.join(',')}|ol|${valueKeyOl}`);
  }
  if (arrKeyOeq.length > 0) {
    arr.push(`${arrKeyOeq.join(',')}|oeq|${valueKeyOeq}`);
  }
  // if (keyIn && valueKeyIn.length > 0) {
  //   arr.push(`${keyIn}|in|${valueKeyIn.join(',')}`);
  // }
  if (keyNin && valueKeyNin.length > 0) {
    arr.push(`${keyNin}|nin|${valueKeyNin.join(',')}`);
  };
  return arr.join('&');
};

//
const formatDay = (day) => {
  return +day < 10 ? ("0" + day) : day
}
//
const order = (dt, orderBy) => {
  let sortBy: any[] = getArrOrderFromString(orderBy);
  dt.sort(function (a, b) {
    let i = 0,
      result = 0;
    while (i < sortBy.length && result === 0) {
      result =
        sortBy[i].direction *
        (a[sortBy[i].prop] < b[sortBy[i].prop]
          ? -1
          : a[sortBy[i].prop] > b[sortBy[i].prop]
            ? 1
            : 0);
      i++;
    }
    return result;
  });
};

const getArrOrderFromString = (orderBy: string) => {
  let arrSortBy = orderBy.split(',');
  let sortBy: any[] = [];
  for (const row of arrSortBy) {
    let arrProp = row.trim().split(' ');
    let rowSortby = {};
    rowSortby['prop'] = arrProp[0];
    if (arrProp.length == 1) {
      rowSortby['direction'] = 1;
    } else {
      rowSortby['direction'] = -1;
    }
    sortBy.push(rowSortby);
  }
  return sortBy;
};
//
const isRoleGDV = () => {
  const role = localStorage.getItem("userRole")
  if (role) {
    if (JSON.parse(role).code === "UNIFORM.BANK.GDV") {
      return true;
    }
  }
  return false;
}

const dateToString = (date: Date) => {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return formatDay(day) + "/" + formatDay(month) + "/" + year;
}

const dateToStringDate = (date: Date, typeFormat: string) => {
  const [day, month, year] = [date.getDate(), date.getMonth() + 1, date.getFullYear()];
  if (typeFormat.toLowerCase() === "dd/mm/yyyy") {
    return `${formatDay(day)}/${formatDay(month)}/${year}`;
  }
  if (typeFormat.toLowerCase() === "yyyy-mm-dd") {
    return `${year}-${formatDay(month)}-${formatDay(day)}`;
  }
  const [hour, minute, second] = [date.getHours(), date.getMinutes(), date.getSeconds()];
  if (typeFormat.toLowerCase() === "dd/mm/yyyy hh:mm:ss") {
    return `${formatDay(day)}/${formatDay(month)}/${year} ${formatDay(hour)}:${formatDay(minute)}:${formatDay(second)}`;
  }
  return `${year}-${formatDay(month)}-${formatDay(day)} ${formatDay(hour)}:${formatDay(minute)}:${formatDay(second)}`;
}

const checkInvalid = (formGroup, arrayControl) => {
  for (const control of arrayControl) {
    if (formGroup.get(control)?.invalid) {
      return true;
    }
  }
  return false;
}

const getValueFromArray = (arr: any[], fromField: string, filterField: string, value) => {
  if (!arr) {
    return null;
  }
  const row = arr.find(x => x[fromField] === value);
  if (row) {
    return row[filterField];
  }
  return null;
}

const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
}

const formatDate = (date): string => {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
};

const calcRecurringPaymentDate = () => {
  const result = [];
  for (let index = 0; index < 28; index++) {
    result.push({ label: `Ngày ${index + 1} hàng tháng`, value: index + 1 })
  }
  return result;
};

const validateDate = (formDate: string, toDate: string): boolean => {
  const start = moment(formDate, "YYYY-MM-DD");
  const end = moment(toDate, "YYYY-MM-DD");
  return moment.duration(start.diff(end)).asDays() <= 0 ? false : true;
}

const handleContentBill = (data: any): string => {
  if (!data) {
    return '';
  }
  const contents: string[] = [];
  Object.keys(data).map((key) => {
    if (typeof data[key] === 'string') {
      contents.push(`${key}:${data[key] || ''}`);
    }
    if (typeof data[key] === 'object' && data[key].length > 0) {
      data[key].map((item) => {
        contents.push(convertObjectToString(item));
      });
    }
  });
  return contents.join('+');
};

const convertObjectToString = (data): string => {
  const contents: string[] = [];
  Object.keys(data).map((key) => {
    contents.push(`${key}:${data[key] || ''}`);
  });
  return `(${contents.join('+')})`;
};

const stringToNumber = (strNum: string) => {
  let num = strNum.split(".").join("");
  return isNaN(+num) ? 0 : +num;
}

export const ultis = {
  calcRecurringPaymentDate,
  convertCharacters,
  toNoSign,
  handleValueFilter,
  order,
  formatDay,
  isRoleGDV,
  dateToString,
  dateToStringDate,
  checkInvalid,
  getValueFromArray,
  formatDate,
  validateDate,
  handleContentBill,
  stringToNumber
};
