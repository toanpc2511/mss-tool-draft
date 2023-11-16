import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

type TextPatternDirectiveOption = {
  blockRegex?: string;
  allowRegex?: string;
  allowVi?: boolean;
};

@Directive({
  selector: 'input[textPattern],textarea[textPattern]',
})
export class TextPatternDirective {
  @Input('textPattern') textPatternOpt: TextPatternDirectiveOption;

  constructor(private elRef: ElementRef, private control: NgControl) {}

  @HostListener('keypress', ['$event']) onKeyPress(event): boolean {
    return this.validateValue(String.fromCharCode(event.charCode));
  }

  @HostListener('blur', ['$event']) onBlur(
    event: Event & { target: HTMLInputElement | HTMLTextAreaElement }
  ): void {
    const value = event.target.value?.trim();
    let transformedText = value;

    if (this.textPatternOpt.allowRegex && value !== null) {
      let allowRegStr = this.textPatternOpt.allowRegex;
      if (this.textPatternOpt.allowVi){
        allowRegStr += `|[${this.viRegStr.split('|').join('')}]`;
      }
      const allowReg = new RegExp(allowRegStr, 'g');
      transformedText = (value.match(allowReg) || []).join('');
    }

    if (this.textPatternOpt.blockRegex && value !== null) {
      const blockReg = new RegExp(this.textPatternOpt.blockRegex, 'g');
      transformedText = transformedText.replace(blockReg, '');
    }

    if (transformedText !== null) {
      this.elRef.nativeElement.value = transformedText;
      if (this.control?.control) {
        this.control.control.setValue(transformedText);
      }
    }
  }

  validateValue(value: string): boolean {
    const viReg = new RegExp(this.viRegStr, 'g');
    const containViChar = value.match(viReg)?.length > 0;

    let passAllowRegex = true;
    let passBlockRegex = true;

    if (this.textPatternOpt.allowRegex) {
      const allowReg = new RegExp(this.textPatternOpt.allowRegex, 'g');
      if (!allowReg.test(value)) {
        passAllowRegex =  Boolean(this.textPatternOpt.allowVi && containViChar);
      } else {
        passAllowRegex = true;
      }
    }

    if (this.textPatternOpt.blockRegex) {
      const blockReg = new RegExp(this.textPatternOpt.blockRegex, 'g');
      passBlockRegex = !blockReg.test(value);
    }

    return passAllowRegex && passBlockRegex;
  }

  get viRegStr(): string {
    const reg1 =
      'á|à|ạ|ả|ã|â|ấ|ầ|ậ|ẩ|ẫ|ă|ắ|ằ|ặ|ẳ|ẵ|Á|À|Ạ|Ả|Ã|Â|Ấ|Ầ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ';
    const reg2 = 'é|è|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ể|ễ|É|È|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ';
    const reg3 = 'í|ì|ị|ỉ|ĩ|Í|Ì|Ị|Ỉ|Ĩ';
    const reg4 =
      'ó|ò|ọ|ỏ|õ|ô|ố|ồ|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ';
    const reg5 = 'ú|ù|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|Ú|Ù|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ';
    const reg6 = 'ỳ|ý|ỵ|ỷ|ỹ|Ý|Ỳ|Ỵ|Ỷ|Ỹ';
    const reg7 = 'Đ|đ';

    const regLst = [reg1, reg2, reg3, reg4, reg5, reg6, reg7];
    const viRegexStr = regLst.reduce((acc, crr, index) => {
      if (index === regLst.length - 1) {
        return acc + crr;
      }

      return acc + crr + '|';
    }, '');
    return viRegexStr;
  }
}
