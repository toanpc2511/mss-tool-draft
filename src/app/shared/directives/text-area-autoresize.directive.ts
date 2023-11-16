import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: 'textarea[autoResize]',
})
export class TextAreaAutoResizeDirective implements OnInit, OnDestroy {
  @Input('autoResize') option: {
    height?: number;
    maxHeight?: number;
    minHeight?: number;
  } = {};
  height: number;
  mouseMoveListener: Function;
  isResized = false;
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {
    const nativeElement = this.elRef.nativeElement as HTMLTextAreaElement;
    this.height = nativeElement.clientHeight;
    const { height, minHeight } = this.option;
    if (height) {
      nativeElement.style.height = height + 'px';
    }
    if (minHeight) {
      nativeElement.style.minHeight = minHeight + 'px';
    }
    this.adjust();
  }
  @HostListener('input', ['$event.target'])
  oninput(textarea: HTMLTextAreaElement): void {
    this.adjust();
  }
  @HostListener('mousedown', ['$event.target'])
  onMouseDown(el): void {
    const offsetHeight = el.offsetHeight;
    this.mouseMoveListener = this.renderer.listen(
      'document',
      'mousemove',
      () => {
        if (offsetHeight !== el.offsetHeight) {
          this.option.maxHeight = el.offsetHeight;
          this.isResized = true;
        }
      }
    );
  }
  @HostListener('document:mouseup')
  onMouseUp() {
    this.ngOnDestroy();
  }
  private adjust(): void {
    const nativeElement = this.elRef.nativeElement as HTMLTextAreaElement;
    nativeElement.style.height = 'auto';
    if (
      this.option.maxHeight &&
      nativeElement.scrollHeight <= this.option.maxHeight &&
      !this.isResized
    ) {
      nativeElement.style.overflow = 'hidden';
      nativeElement.style.height = nativeElement.scrollHeight + 'px';
    } else {
      nativeElement.style.height = this.option.maxHeight + 'px';
      nativeElement.style.overflow = 'auto';
    }
  }
  ngOnDestroy() {
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
    }
  }
}
