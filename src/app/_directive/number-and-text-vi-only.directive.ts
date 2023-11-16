import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: 'input[NumberAndTextViOnly]'
})
export class NumberAndTextViOnlyDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    let str = this._el.nativeElement.value;
    str = str.replace(/[^·A-Za-z0-9&/aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ ]+/g, '');
    this._el.nativeElement.value = str.toUpperCase();
    // if ( str !== this._el.nativeElement.value) {
    //   event.stopPropagation();
    // }
  }

}
