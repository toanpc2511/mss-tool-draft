import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: 'input[NumberAndTextLatin]'
})
export class NumberAndTextLatinDirective {

  constructor(private _el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChangeNotUpperCase(event) {
    let str = this._el.nativeElement.value;
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/[^·A-Za-z0-9_.]+/g, '');
    this._el.nativeElement.value = str
    // if ( str !== this._el.nativeElement.value) {
    //   event.stopPropagation();
    // }
  }
}
