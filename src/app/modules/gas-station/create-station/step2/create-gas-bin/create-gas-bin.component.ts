import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { GasBinResponse, GasStationService, ProductsResponse } from '../../../gas-station.service';

@Component({
  selector: 'app-create-gas-bin',
  templateUrl: './create-gas-bin.component.html',
  styleUrls: ['./create-gas-bin.component.scss'],
  providers: [DestroyService]
})
export class CreateGasBinComponent implements OnInit {
  @Input() data: GasBinResponse;
  gasBinForm: FormGroup;
  listStatus = LIST_STATUS;
  listProduct: ProductsResponse[];
  isUpdate = false;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private gasStationService: GasStationService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      this.gasBinForm = this.fb.group({
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
    } else {
      this.isUpdate = true;
      this.gasBinForm = this.fb.group({
        code: [
          this.data.code,
          [Validators.required, TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)]
        ],
        name: [this.data.name, [Validators.required]],
        capacity: [this.data.capacity, [Validators.required]],
        height: [this.data.height, [Validators.required]],
        length: [this.data.length, [Validators.required]],
        description: [this.data.description],
        productId: [this.data.product.id, [Validators.required]],
        status: [this.data.status],
        gasStationId: [this.gasStationService.gasStationId]
      });
    }

    this.gasStationService
      .getListProduct()
      .subscribe((res) => (this.listProduct = res.data.filter((data) => data.status === 'ACTIVE')));
  }

  onSubmit() {
    this.gasBinForm.markAllAsTouched();

    if (this.gasBinForm.invalid) {
      return;
    }

    if (!this.isUpdate) {
      this.gasStationService
        .createGasBin(this.gasBinForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            if (res.data) {
              this.modal.close(true);
            }
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
    } else {
      this.gasStationService
        .updateGasBin(this.data.id, this.gasBinForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            if (res.data) {
              this.modal.close(true);
            }
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
    }
  }

  checkError(err: IError) {
    if (err.code === 'SUN-OIL-4111') {
      this.gasBinForm.get('code').setErrors({ codeExisted: true });
    }
    if (err.code === 'SUN-OIL-4112') {
      this.gasBinForm.get('name').setErrors({ nameExisted: true });
    }
    this.cdr.detectChanges();
  }
}
