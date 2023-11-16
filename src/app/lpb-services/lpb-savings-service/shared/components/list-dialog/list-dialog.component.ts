import { Component, Inject, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IBuilder } from '../form-array/form-array.component';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';

@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: [
    '../../styles/common.scss',
    '../../styles/dialog.scss',
    './list-dialog.component.scss',
  ],
})
export class ListDialogComponent implements OnInit {
  formArray: FormArray;
  listItems: any[];

  title: string;
  dialogData: FormArray;
  builder: IBuilder;
  isDetail: boolean;
  buttons: any[] = [];
  actions: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ListDialogComponent>
  ) {
    this.title = this.data?.title;
    this.dialogData = this.data?.data;
    this.builder = this.data?.builder;
    this.isDetail = this.data?.isDetail;
  }

  ngOnInit(): void {
    if (Array.isArray(this.data?.data)) {
      this.listItems = this.data?.data;
    } else {
      this.formArray = this.data?.data;
    }

    if (this.data?.onAddItem) {
      this.buttons = [
        ...this.buttons,
        {
          label: 'Thêm mới',
          icon: 'add',
          class:
            'mat-button-primary p-2 mb-2 rounded mat-button-primary h-36px',
          onClick: () => this.data.onAddItem(this.dialogRef),
        },
      ];
    }
    if (this.data?.onEditItem) {
      this.actions = [
        ...this.actions,
        {
          icon: 'fa-pencil',
          class: 'hover-primary',
          onClick: (data) => this.data.onEditItem(data),
        },
      ];
    }
    if (this.data?.onDeleteItem) {
      this.actions = [
        ...this.actions,
        {
          icon: 'fa-trash-o',
          class: 'hover-error',
          onClick: (data) => this.data.onDeleteItem(data),
        },
      ];
    }
    if (this.data?.onViewItem) {
      this.actions = [
        ...this.actions,
        {
          icon: 'fa-eye',
          class: 'hover-primary',
          onClick: (data) => this.data.onViewItem(data),
        },
      ];
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ type: 'dismiss' });
  }

  onSubmit() {
    this.formArray.markAllAsTouched();

    if (this.formArray.invalid) {
      return;
    }

    const frmValues = FormHelpers.trimValues(this.formArray.getRawValue());

    this.data?.onSubmit && this.data?.onSubmit(frmValues);
  }
}
export class IDataConfirmDialog {
  constructor(
    public title: string,
    public data: FormArray | any[],
    public builder: IBuilder,
    public isDetail: boolean,
    public description: string,
    public setDialogData: (data: any) => void,
    public onAddItem: () => void,
    public onDeleteItem: (item: any) => void,
    public onView: (item: any) => void,
    public onEditItem: (item: any) => void,
    public onSubmit: (frmValues: any) => void
  ) {}
}
