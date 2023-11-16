import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LpbLightboxDialogComponent } from './lpb-lightbox-dialog/lpb-lightbox-dialog.component';
@Component({
  selector: 'lpb-lightbox',
  templateUrl: './lpb-lightbox.component.html',
  styleUrls: ['./lpb-lightbox.component.scss'],
})
export class LpbLightboxComponent implements OnInit {
  @Input('src') src = '';
  @Input('alt') alt = '';
  @Input('height') height = 'auto';
  error = false;
  @Input('errorMessage') errorMessage = 'ERROR IMAGE OR NO IMAGE AVAILABLE';

  // Khai báo một property để lưu giá trị scale hiện tại
  currentScale: number;

  constructor(private dialog: MatDialog) {}
  ngOnInit(): void {}
  dialogConfig(): MatDialogConfig {
    const config: MatDialogConfig = {};
    config.data = {
      src: this.src,
      alt: this.alt,
    };
    config.maxWidth = '1px';
    config.maxHeight = '1px';
    return config;
  }
  openLightBoxDialog(): void {
    this.dialog.open(LpbLightboxDialogComponent, this.dialogConfig());
  }
  onError() {
    this.error = true;
  }
}
