import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { takeUntil, tap } from 'rxjs/operators';
import {
  IGasFieldByStation,
  InventoryManagementService,
  IShallow,
  IStationActiveByToken
} from '../../inventory-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { convertMoney } from '../../../../shared/helpers/functions';
import { IError } from '../../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { DataResponse } from '../../../../shared/models/data-response.model';
import { FileService } from '../../../../shared/services/file.service';

@Component({
  selector: 'app-modal-report-min-tank',
  templateUrl: './modal-report-min-tank.component.html',
  styleUrls: ['./modal-report-min-tank.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class ModalReportMinTankComponent implements OnInit {
  @Input() data: IDataTransfer;

  minTankForm: FormGroup;
  stationByToken: IStationActiveByToken[] = [];
  listGasField: IGasFieldByStation[] = [];

  constructor(
    public modal: NgbActiveModal,
    private destroy$: DestroyService,
    private inventoryManagementService: InventoryManagementService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.getStationToken();
    this.buildForm();
    this.handleGasStation();
    this.handleGasField();
    this.changeValueFinalMeter();
  }

  buildForm() {
    this.minTankForm = this.fb.group({
      name: ['', Validators.required],
      importQuantity: [''],
      headMeter: [''],
      finalMeter: ['', Validators.required],
      height: [''],
      length: [''],
      capacity: [''],
      productName: [''],
      productId: [''],
      gasFieldName: [''],
      gasFieldCode: [''],
      gasFieldId: ['', Validators.required],
      stationId: ['', Validators.required],
      note: [''],
      withMeter: [''],
      difference: ['']
    })
  }

  onClose() {
    this.modal.close();
  }

  onSubmit() {
    this.minTankForm.markAllAsTouched();
    if (this.minTankForm.invalid) {
      return;
    }
    const valueForm = this.minTankForm.value;

    const dataReq = {
      name: valueForm.name,
      importQuantity: valueForm.importQuantity,
      headMeter: valueForm.headMeter,
      finalMeter: convertMoney(valueForm.finalMeter),
      height: valueForm.height,
      length: valueForm.length,
      capacity: valueForm.capacity,
      productName: valueForm.productName,
      productId: Number(valueForm.productId),
      gasFieldName: valueForm.gasFieldName,
      gasFieldCode: valueForm.gasFieldCode,
      gasFieldId: Number(valueForm.gasFieldId),
      stationId: Number(valueForm.stationId),
      note: valueForm.note
    }

    this.inventoryManagementService.createShallow(dataReq)
      .subscribe((res) => {
        if (res) {
          this.modal.close(true);
        }
      }, (error: IError) => {
        this.checkError(error);
      })
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4963') {
      this.toastr.error('Số công tơ cuối phải lớn hơn số công tơ đầu')
    }
    if (error.code === 'SUN-OIL-4962') {
      this.minTankForm.get('name').setErrors({ nameExisted: true });
    }
  }

  getStationToken() {
    this.inventoryManagementService
      .getStationByToken('ACTIVE', 'false')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.stationByToken = res.data;
        this.cdr.detectChanges();
      });
  }

  handleGasStation() {
    this.minTankForm.get('stationId').valueChanges
      .subscribe((x) => {
        this.inventoryManagementService.getGasFields(x, 'ACTIVE')
          .subscribe((res) => {
            this.listGasField = res.data;
            this.cdr.detectChanges();
          })

        this.minTankForm.get('gasFieldId').patchValue('');
      })
  }

  handleGasField() {
    this.minTankForm.get('gasFieldId').valueChanges
      .subscribe((x) => {
        const gasFieldId = this.minTankForm.get('gasFieldId').value;
        const stationId = this.minTankForm.get('stationId').value;
        if (x) {
          this.inventoryManagementService.getInfoShallows(stationId, gasFieldId)
            .subscribe((res) => {
              this.pathValueForm(res.data);
              this.cdr.detectChanges();
            })
        } else {
          this.pathValueForm();
        }
      })
  }

  pathValueForm(value?) {
    this.minTankForm.get('gasFieldCode').patchValue(value ? value.gasFieldCode : '');
    this.minTankForm.get('capacity').patchValue(value ? value.capacity : '');
    this.minTankForm.get('height').patchValue(value ? value.height : '');
    this.minTankForm.get('length').patchValue(value ? value.length : '');
    this.minTankForm.get('productName').patchValue(value ? value?.productName : '');
    this.minTankForm.get('importQuantity').patchValue(value ? value?.importQuantity : '');
    this.minTankForm.get('headMeter').patchValue(value ? value?.headMeter : '');
    this.minTankForm.get('productId').patchValue(value ? value?.productId : '');
    this.minTankForm.get('gasFieldName').patchValue(value ? value?.gasFieldName : '');
    this.minTankForm.get('finalMeter').patchValue('');
  }

  changeValueFinalMeter() {
    this.minTankForm.get('finalMeter').valueChanges
      .subscribe((x) => {
        if (this.minTankForm.get('gasFieldId').value) {
          const headMeterValue = convertMoney(this.minTankForm.get('headMeter').value.toString());
          const importQuantityValue = convertMoney(this.minTankForm.get('importQuantity').value.toString());
          const withMeterValue = convertMoney(this.minTankForm.get('withMeter').value.toString());

          this.minTankForm.get('withMeter').patchValue(convertMoney(x.toString()) - headMeterValue);
          this.minTankForm.get('difference').patchValue(withMeterValue - importQuantityValue);
          this.cdr.detectChanges();
        } else {
          this.minTankForm.get('finalMeter').setErrors({gasFieldNull: true})
        }
      })
  }

  downloadFile() {
    this.inventoryManagementService.exportFileWorldShallowsExport(this.data.dataDetail.id)
      .pipe(
        tap((res: DataResponse<string>) => {
          if (res) {
            this.fileService.downloadFromUrl(res.data);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

}

export interface IDataTransfer {
  title: string;
  dataDetail?: IShallow;
}

export interface IInfoGasField {
  capacity: string;
  gasFieldCode: string;
  gasFieldId: number;
  gasFieldName: string;
  headMeter: number;
  height: string;
  importQuantity: number;
  length: string;
  productId: number;
  productName: string;
  stationId: number;
}
