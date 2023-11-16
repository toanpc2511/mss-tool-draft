export class TextHelper{
  static latinNormalize(value: string): string{
    if (!value) {
      return '';
    }
    let str = value;
    str = str.replace(/á|à|ạ|ả|ã|â|ấ|ầ|ậ|ẩ|ẫ|ă|ắ|ằ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/Á|À|Ạ|Ả|Ã|Â|Ấ|Ầ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/é|è|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ể|ễ/g, 'e');
    str = str.replace(/É|È|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/í|ì|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/Í|Ì|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/ó|ò|ọ|ỏ|õ|ô|ố|ồ|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/ú|ù|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/Ú|Ù|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/y|ỳ|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/Ý|Ỳ|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/đ/g, 'd');
    return str;
  }

  static objectLatinNormalize<Type>(object: Type): Type{
    if(!object || typeof object !== 'object'){
      return null;
    }

    Object.keys(object).forEach((key) => {
      if(typeof object[key] === 'string'){
        object[key] = this.latinNormalize(object[key]);
      }
    })

    return object;
  }
}
