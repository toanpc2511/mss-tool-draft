// import * as moment from 'moment';
//
// export class UniValidator {
//   valid: boolean;
//   message: string;
//   constructor(valid: boolean, message: string) {
//     this.valid = valid;
//     this.message = message;
//   }
// }
//
// export class DateCondition {
//   inputDateMin?: string;
//   inputDateMax?: string;
//   constructor( inputDateFrom: string,
//                inputDateTo: string)
//   { this.inputDateMin = inputDateFrom;
//     this.inputDateMax = inputDateTo; }
//
//   dateCreatedValidator(): UniValidator {
//     // @ts-ignore
//     const start = moment(new Date(this.inputDateMin));
//     // @ts-ignore
//     const end = moment(new Date(this.inputDateMax));
//     const now = moment(new Date(moment().format('yyyy-MM-DD')));
//     const condStart = start.diff(now, 'day');
//     const condEnd = end.diff(now, 'day');
//     const cond = end.diff(start, 'day');
//
//     if (!start.isValid() && !end.isValid()) {
//       return new UniValidator(false, 'Ngày bắt đầu và ngày kết thúc không hợp lệ');
//     }
//     else if (!start.isValid()) {
//       return new UniValidator(false, 'Ngày bắt đầu không hợp lệ');
//     }
//     else if (!end.isValid()) {
//       return new UniValidator(false, 'Ngày kết thúc không hợp lệ');
//     }
//     else {
//       if (cond >= 0) {
//         if (condStart > 0 && condEnd > 0) {
//           return new UniValidator(false, 'Ngày bắt đầu và ngày kết thúc không được là ngày tương lai');
//         } else if (condStart > 0) {
//           return new UniValidator(false, 'Ngày bắt đầu không được là ngày tương lai');
//         }
//         else if (condEnd > 0) {
//           return new UniValidator(false, 'Ngày kết thúc không được là ngày tương lai');
//         }
//         else {
//           // ngay bat dau va ngay ket thuc la ngay hien tai
//           if (this.inputDateMax != null && this.inputDateMax !== '' && this.inputDateMin != null && this.inputDateMin !== '') {
//             if (cond > (366 * 10)) {
//               return new UniValidator(false, 'Vượt quá giới hạn tìm kiếm');
//             } else { return new UniValidator(true, ''); }
//           } else { return new UniValidator(true, ''); }
//         }
//       } else {
//         if (condStart > 0 && condEnd > 0) {
//           return new UniValidator(false, 'Ngày bắt đầu và ngày kết thúc không được là ngày tương lai');
//         } else if (condStart > 0) {
//           return new UniValidator(false, 'Ngày bắt đầu không được là ngày tương lai');
//         } else if (condEnd > 0) {
//           return new UniValidator(false, 'Ngày kết thúc không được là ngày tương lai');
//         } else {
//           if (this.inputDateMax != null && this.inputDateMax !== '' && this.inputDateMin != null && this.inputDateMin !== '') {
//             return new UniValidator(false, 'Ngày bắt đầu đang lớn hơn ngày kết thúc');
//           } else { return new UniValidator(true, ''); }
//         }
//       }
//     }
//   }
//   getToday(): string {
//     return moment().format('yyyy-MM-DD');
//   }
// }
