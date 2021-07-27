import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { TValidators } from 'src/app/shared/validators';
import { GasStationService, ProductsResponse } from '../../../gas-station.service';

@Component({
  selector: 'app-create-gas-bin',
  templateUrl: './create-gas-bin.component.html',
  styleUrls: ['./create-gas-bin.component.scss']
})
export class CreateGasBinComponent implements OnInit {
  @Input() data: any;
  gasBinForm: FormGroup;
  listStatus = LIST_STATUS;
  listProduct: ProductsResponse[];

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private gasStationService: GasStationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.gasBinForm = this.initForm();

    this.gasStationService
      .getListProduct()
      .subscribe((res) => (this.listProduct = res.data.filter((data) => data.status === 'ACTIVE')));
  }

  initForm() {
    return this.fb.group({
      code: ['SB', [Validators.required, TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)]],
      name: [null, [Validators.required]],
      capacity: [null, [Validators.required]],
      height: [null, [Validators.required]],
      length: [null, [Validators.required]],
      description: [''],
      productId: [null, [Validators.required]],
      status: [this.listStatus.ACTIVE],
      gasStationId: [this.gasStationService.gasStationId]
    });
  }

  onSubmit() {
    this.gasBinForm.markAllAsTouched();

    if (this.gasBinForm.invalid) {
      return;
    }

    this.gasStationService.createGasBin(this.gasBinForm.value).subscribe(
      (res) => {
        this.modal.close(res);
      },
      (err: IError) => {
        if (err.code === 'SUN-OIL-4511') {
          this.gasBinForm.get('code').setErrors({ codeExisted: true });
        }
        if (err.code === 'SUN-OIL-4512') {
          this.gasBinForm.get('name').setErrors({ nameExisted: true });
        }
        this.cdr.detectChanges();
      }
    );
  }
}
