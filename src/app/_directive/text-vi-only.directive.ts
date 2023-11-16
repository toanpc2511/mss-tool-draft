import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: 'input[TextViOnly]'
})
export class TextViOnlyDirective {
  key;
  constructor(private _el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    this.key = event.keyCode;
    // console.log('key', this.key)
    if ((this.key >= 48 && this.key <= 57) || (this.key >= 96 && this.key <= 105)) {
      // 0-9 only
      event.preventDefault();
      return;
    }
    let str = this._el.nativeElement.value;
    str = str.replace(/[^·A-Za-z&/aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ ]+/g, '');
    this._el.nativeElement.value = str.toUpperCase();
    // if ( str !== this._el.nativeElement.value) {
    //   event.stopPropagation();
    // }
  }

}
