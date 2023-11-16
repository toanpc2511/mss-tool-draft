import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
export enum EnumInputType {
  input = 'input',
  select = 'select',
  date = 'date',
  text = 'text',
  currency = 'currency',
  link = 'link',
  inputNumber = 'inputNumber',
}

interface IBuild {
  controlName?: string;
  label: string;
  requiredNote?: boolean;
  inputType?: EnumInputType;
  maxlength?: number;
  alowDotIfNumber?: boolean;
  selectList?: {
    list: any[];
    labelName: string;
    bindValue: string;
  };
  maxDate?: Date;
  validatesMsg?: {
    controlName?: string;
    type: string;
    message: string;
  }[];
  onChanges?: (value: any) => void;
  class?: {
    headerClass?: string;
    cellClass?: string;
  };
  render?: (value: any) => string;
  onClick?: ({ index, item }: { index: number; item: any }) => void;
}

export interface IBuilder {
  [name: string]: IBuild;
}

@Component({
  selector: 'app-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['../../styles/common.scss', './form-array.component.scss'],
})
export class FormArrayComponent
  implements OnInit, OnChanges, AfterViewInit, AfterContentChecked
{
  EnumInputType = EnumInputType;

  @Input() data: FormArray | any[];
  formArray: FormArray;
  listItems: any[];
  form: FormGroup = this.fb.group([]);

  @Input() builder: IBuilder;
  builders: any;
  isDetail: boolean;

  @Input() config: {
    hasSTT?: boolean;
    actionLabel?: string;
    contentClass?: string;
    headerClass?: string;
    cellClass?: string;
    sttClass?: string;
    isDetail?: boolean;
    leaveNumberOfItem?: number;
  } = {};

  @Input() buttons?: [
    {
      label: string;
      icon: string;
      class?: string;
      onClick: () => void;
    }
  ];
  @Input() actions?: [
    {
      icon: string;
      class?: string;
      onClick: ({ index, item }: { index: number; item: any }) => void;
    }
  ];

  constructor(private fb: FormBuilder, private cdref: ChangeDetectorRef) {
    this.isDetail = this.config?.isDetail;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.builder) {
      this.builders = Object.entries(this.builder).map((e, i) => ({
        ...e[1],
        controlName: e[0],
      }));
    }
    if (changes.data) {
      if (Array.isArray(this.data)) {
        const newData = this.data.map((e) => {
          Object.entries(e).forEach(([key, value]) => {
            const build = this.builders.find((b) => b.controlName === key);
            if (build?.render) {
              e[key] = build.render(e[key]);
            }
          });
          return e;
        });
        this.listItems = newData;
      } else {
        setTimeout(() => {
          if (!Array.isArray(this.data)) {
            this.formArray = this.data;
            this.form = this.fb.group({
              formArrayName: this.data,
            });
          }
        }, 1000);
      }
    }
  }
  ngAfterViewInit(): void {
    this.cdref.detectChanges();
  }
  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }
}
