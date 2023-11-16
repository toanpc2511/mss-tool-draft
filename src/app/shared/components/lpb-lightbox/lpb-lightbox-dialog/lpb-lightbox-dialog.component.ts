import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lpb-lightbox-dialog',
  templateUrl: './lpb-lightbox-dialog.component.html',
  styleUrls: ['./lpb-lightbox-dialog.component.scss'],
})
export class LpbLightboxDialogComponent implements OnInit {
  @ViewChild('lightboxDialogContent') lightboxDialogContent: ElementRef;
  @ViewChild('lightboxDialog') lightboxDialog: ElementRef;
  @ViewChild('lightboxDialogClose') lightboxDialogClose: ElementRef;
  src = '';
  alt = '';
  currentScale: number;
  minScale: number = 0.5;
  isDragging: boolean;

  timeout: any;

  startMousePos: { x: number; y: number };
  startImagePos: { x: number; y: number };
  lastImagePos: { x: number; y: number };

  target: HTMLDivElement;
  transform: string;

  newImageX: number;
  newImageY: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { src: string; alt: string },
    private dialogRef: MatDialogRef<LpbLightboxDialogComponent>
  ) {
    this.currentScale = 1;
    this.timeout = null;

    this.startMousePos = { x: 0, y: 0 };
    this.startImagePos = { x: 0, y: 0 };
    this.lastImagePos = { x: 0, y: 0 };
    if (data) {
      this.src = data.src || this.src;
      this.alt = data.alt || this.alt;
    }
  }
  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe((e) => {
      this.lightboxDialogClose.nativeElement.style.opacity = '1';
    });

    this.dialogRef.beforeClosed().subscribe((e) => {
      this.lightboxDialogClose.nativeElement.remove();
      this.lightboxDialog.nativeElement.remove();
      this.lightboxDialogContent.nativeElement.remove();
    });
  }
  close(): void {
    this.dialogRef.close();
  }
  @HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.zoomImage(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.zoomImage(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.zoomImage(event);
  }
  zoomImage(wheelEvent: WheelEvent & { target: HTMLImageElement }): void {
    let delta = wheelEvent.deltaY || wheelEvent.detail;
    if (delta) {
      this.currentScale = Math.max(
        this.minScale,
        this.currentScale + (delta < 0 ? 0.1 : -0.1)
      );

      let className: string = '';
      if (this.currentScale === this.minScale) {
        className = '_not-allowed';
      } else if (delta < 0) {
        className = '_zoom-in';
      } else {
        className = '_zoom-out';
      }

      this.changeClass(wheelEvent.target, className);
    }

    this.setVendor(
      this.lightboxDialog.nativeElement,
      'Transform',
      `scale(${this.currentScale})`
    );
  }

  @HostListener('window:mousemove', ['$event'])
  moveImage(mouseEvent: MouseEvent & { target: HTMLImageElement }): void {
    if (this.isDragging) {
      let deltaX = mouseEvent.clientX - this.startMousePos.x;
      let deltaY = mouseEvent.clientY - this.startMousePos.y;

      this.newImageX = deltaX + this.lastImagePos.x;
      this.newImageY = deltaY + this.lastImagePos.y;

      this.setVendor(
        this.lightboxDialogContent.nativeElement,
        'Transform',
        `translate(${this.newImageX}px, ${this.newImageY}px)`
      );
    }
  }

  startMoveImage(mouseEvent: MouseEvent & { target: HTMLImageElement }): void {
    mouseEvent.preventDefault();
    this.startMousePos.x = mouseEvent.clientX;
    this.startMousePos.y = mouseEvent.clientY;
    this.startImagePos.x = this.lastImagePos.x;
    this.startImagePos.y = this.lastImagePos.y;
    this.isDragging = true;
    this.changeClass(mouseEvent.target, '_grabbing', false);
  }
  @HostListener('window:mouseup', ['$event'])
  endMoveImage(mouseEvent: MouseEvent & { target: HTMLImageElement }): void {
    this.lastImagePos.x = this.newImageX || 0;
    this.lastImagePos.y = this.newImageY || 0;
    this.isDragging = false;
    mouseEvent.target.classList.remove('_grabbing');
  }

  debounce(callback: Function, delay: number): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(callback, delay);
  }

  changeClass(
    element: HTMLElement,
    className: string,
    time: number | boolean = 200
  ): void {
    element.classList.remove(
      '_zoom-in',
      '_zoom-out',
      '_not-allowed',
      '_grabbing'
    );

    element.classList.add(className);

    if (typeof time === 'number') {
      this.debounce(() => {
        element.classList.remove(className);
      }, time);
    }
  }

  setVendor(element, property, value) {
    element.style['webkit' + property] = value;
    element.style['moz' + property] = value;
    element.style['ms' + property] = value;
    element.style['o' + property] = value;
    element.style[property] = value;
  }
}
