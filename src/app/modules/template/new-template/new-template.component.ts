import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatTabGroup } from '@angular/material/tabs';
import { GridTemplateComponent } from '../grid-template/grid-template.component';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.component.html',
  styleUrls: ['./new-template.component.scss'],
})
export class NewTemplateComponent implements OnInit {
  tabs: any[] = ['Page 1'];
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  @ViewChild(GridTemplateComponent)
  gridTemplate!: any;
  sources: string[] = ['Alert', 'Case', 'Ticket'];
  step: number = 1;
  isChart: boolean = true;
  elementSelected: any[] = [];
  optionTime: any[] = [
    { label: 'Last 7 days', value: '7' },
    { label: 'Last 15 days', value: '15' },
    { label: 'Last 1 month', value: '30' },
  ];
  dataVisualizations: any[] = [
    { label: 'Chart', value: 'chart' },
    { label: 'Table', value: 'table' },
  ];

  chartTypes: any[] = [
    { label: 'Bar chart', value: 'bar_chart', img: '' },
    { label: 'Line & area chart', value: 'line_area_chart', img: '' },
    { label: 'Pie chart', value: 'pie_chart', img: '' },
  ];

  tableType: any[] = [
    { label: 'Id', value: 'id' },
    { label: 'Tenant', value: 'tenant' },
    { label: 'Serverity', value: 'serverity' },
    { label: 'Sla', value: 'sla' },
    { label: 'Status', value: 'status' },
    { label: 'Created date', value: 'createdDate' },
    { label: 'Created by', value: 'createdBy' },
    { label: 'Name', value: 'name' },
    { label: 'Full name', value: 'fullName' },
  ];

  templateForm!: FormGroup;
  dataTemplateForm!: FormGroup;
  constructor(private fb: FormBuilder) {
    this.initTemplateForm();
    this.initDataTemplateForm();
  }

  initTemplateForm(): void {
    this.templateForm = this.fb.group({
      templateName: ['Template 1', [Validators.required]],
      sourceType: ['Alert'],
    });
  }
  initDataTemplateForm(): void {
    this.dataTemplateForm = this.fb.group({
      createTime: [null, [Validators.required]],
      dataVisualization: ['chart', [Validators.required]],
      chartType: [null, [Validators.required]],
      availaleField: [null, [Validators.required]],
      formula: [false],
      formulaValue: [],
    });
  }

  ngOnInit(): void {}

  addPage(): void {
    if (this.tabs.length < 4) {
      const name = `Page ${this.tabs.length + 1}`;
      this.tabs.push(name);
      this.tabGroup.selectedIndex = this.tabs.length;
    }
  }
  nextStep(): void {
    this.templateForm.markAllAsTouched();
    if (this.templateForm.invalid) {
      alert('error');
      return;
    }
    this.step += 1;
  }
  prevStep(): void {
    this.step -= 1;
  }
  onLoadLayout(): void {
    this.dataTemplateForm.markAllAsTouched();
    // if (this.dataTemplateForm.invalid) {
    //   alert('error step 2');
    //   return;
    // }
    if (this.elementSelected.length <= 0) {
      alert('Vui long chon');
    }
    this.gridTemplate.onLoadLayout();
  }

  changeVisualization($event: MatRadioChange): void {
    this.isChart = $event.value === 'chart';
  }

  // layout
  getElementSelect($event: any[]): void {
    this.elementSelected = $event;
  }
}
