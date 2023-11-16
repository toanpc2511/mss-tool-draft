import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { NgControl } from '@angular/forms';


@Directive({
  selector: '[appNoSpaceString]'
})
export class NoSpaceStringDirective {

  constructor(private el: ElementRef) {
    console.log('test');
  }
  @HostListener('input', ['$event']) onInputChangeNotUpperCase(event) {
    let str = this.el.nativeElement.value;
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/[^a-zA-Z0-9]+/g, '');
    this.el.nativeElement.value = str.toUpperCase();
  }

  @HostListener('blur')
  onBlur(): void {
    const value = this.el.nativeElement.value;
    if (value) {
      this.el.nativeElement.value = value.replace(/\s/g, '');
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {

    console.log(event?.keyCode, event?.key);
    switch (event.key) {
      case ' ':
        event.preventDefault();
        break;
      case 'ArrowRight':
      // trigger something from the right arrow
    }
  }

  // @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
  //   this.key = event.keyCode;
  //   // console.log(this.key);
  //   if ((this.key >= 15 && this.key <= 64) || (this.key >= 123) || (this.key >= 96 && this.key <= 111)) {
  //     event.preventDefault();
  //   }
  // }
}