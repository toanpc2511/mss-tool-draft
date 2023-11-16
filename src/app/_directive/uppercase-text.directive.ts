import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: 'input[uppercase]'
})
export class UpperCaseTextDirective {

  constructor(private _el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event) {
    this._el.nativeElement.value = this._el.nativeElement.value.replace(/[^·A-Za-z0-9&/aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ ]+/g, '').toUpperCase();
  }
}
