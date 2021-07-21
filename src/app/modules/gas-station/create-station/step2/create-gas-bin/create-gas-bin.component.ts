import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
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

    this.gasStationService.getListProduct().subscribe((res) => (this.listProduct = res.data));
  }

  initForm() {
    const CODE_REGEX = '^[A-Za-z0-9]*$';
    return this.fb.group({
      code: ['SB', [Validators.required, Validators.pattern(CODE_REGEX)]],
      name: [null, [Validators.required]],
      capacity: [null, [Validators.required]],
      height: [null, [Validators.required]],
      length: [null, [Validators.required]],
      description: [null, [Validators.required]],
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
      (err) => {
        if (err.meta.code === 'SUN-OIL-4244') {
          this.gasBinForm.get('code').setErrors({ codeExisted: true });
        }
        if (err.meta.code === 'SUN-OIL-4245') {
          this.gasBinForm.get('name').setErrors({ nameExisted: true });
        }
        this.cdr.detectChanges();
      }
    );
  }
}
