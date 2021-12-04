import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { IError } from '../../../../shared/models/error.model';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { IMeasures, InventoryManagementService } from '../../inventory-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { convertMoney } from '../../../../shared/helpers/functions';
import { DataResponse } from '../../../../shared/models/data-response.model';
import { FileService } from '../../../../shared/services/file.service';

@Component({
  selector: 'app-modal-report-measure-tank',
  templateUrl: './modal-report-measure-tank.component.html',
  styleUrls: ['./modal-report-measure-tank.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class ModalReportMeasureTankComponent implements OnInit {
  @Input() data: IDataTransfer;

  measureTankForm: FormGroup;
  stationEmployee;
  listGasField;
  listInfoHeightGas;
  isChip: boolean;

  constructor(
    public modal: NgbActiveModal,
    private destroy$: DestroyService,
    private inventoryManagementService: InventoryManagementService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private fileService: FileService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getStationToken();
    this.buildForm();
    this.handleGasStation();
    this.handleGasField();
    this.changeValueHeight();
    this.handleeExportQuantityValue();
  }

  buildForm() {
    this.measureTankForm = this.fb.group({
      name: ['', Validators.required],
      capacity: [''],
      heightGasFieldInfo: [''],
      stationId: ['', Validators.required],
      height: ['', Validators.required],
      gasFieldId: ['', Validators.required],
      length: [''],
      gasFieldCode: [''],
      productName: [''],

      headInventory: [''],
      importQuantity: [''],
      exportQuantity: ['', !this.isChip ? Validators.required : Validators.nullValidator],
      finalInventory: [''],
      actualFinal: [''],
      difference: [''],
      note: [''],
      productId: [''],
      gasFieldName: ['']
    })

    this.isChip = true;
  }

  getStationToken() {
    this.inventoryManagementService
      .getStationToken('ACTIVE', 'false')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.stationEmployee = res.data;
        this.cdr.detectChanges();
      });
  }

  handleGasStation() {
    this.measureTankForm.get('stationId').valueChanges
      .subscribe((x) => {
        if (x) {
          this.inventoryManagementService.getGasFields(x)
            .subscribe((res) => {
              this.listGasField = res.data;
              this.cdr.detectChanges();
            })
        } else {
          this.listGasField = [];
        }

        this.measureTankForm.get('gasFieldId').patchValue('');
      })
  }

  handleGasField() {
    this.measureTankForm.get('gasFieldId').valueChanges
      .subscribe((x) => {
        const gasFieldId = this.measureTankForm.get('gasFieldId').value;
        const stationId = this.measureTankForm.get('stationId').value;

        if (x) {
          this.inventoryManagementService.getInfoMeasures(stationId, gasFieldId)
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
    this.isChip = value ? value.chip : true;
    this.sumFinalInventoryValue();

    this.listInfoHeightGas = value ? value.scales : [];

    this.measureTankForm.get('gasFieldCode').patchValue(value ? value.gasFieldCode : '');
    this.measureTankForm.get('capacity').patchValue(value ? value.capacity : '');
    this.measureTankForm.get('heightGasFieldInfo').patchValue(value ? value.heightGasFieldInfo : '');
    this.measureTankForm.get('length').patchValue(value ? value.length : '');
    this.measureTankForm.get('productName').patchValue(value ? value?.productName : '');

    this.measureTankForm.get('headInventory').patchValue(value ? value?.headInventory : '');
    this.measureTankForm.get('importQuantity').patchValue(value ? value?.importQuantity : '');
    this.measureTankForm.get('exportQuantity').patchValue(value ? value?.exportQuantity.toLocaleString('en-US') : '');
    this.measureTankForm.get('actualFinal').patchValue(value ? value?.actualFinal : 0);
    this.measureTankForm.get('difference').patchValue(value ? value?.difference : '');
    this.measureTankForm.get('productId').patchValue(value ? value?.productId : '');
    this.measureTankForm.get('gasFieldName').patchValue(value ? value?.gasFieldName : '');

    this.measureTankForm.get('height').patchValue('');

  }

  sumFinalInventoryValue() {
    const headInventoryValue = Number(this.measureTankForm.get('headInventory').value);
    const importQuantityValue = Number(this.measureTankForm.get('importQuantity').value);
    const actualFinalValue = Number(this.measureTankForm.get('actualFinal').value) || 0;
    const exportQuantityValue = convertMoney(this.measureTankForm.get('exportQuantity').value.toString());
    const finalInventoryValue = headInventoryValue + importQuantityValue - exportQuantityValue;

    this.measureTankForm.get('finalInventory').patchValue(finalInventoryValue);

    const differenceValue = actualFinalValue - finalInventoryValue;

    this.measureTankForm.get('difference').patchValue(differenceValue);
  }

  handleeExportQuantityValue() {
    this.measureTankForm.get('exportQuantity').valueChanges
      .subscribe(() => {
        this.sumFinalInventoryValue();
        this.cdr.detectChanges();
      })
  }

  changeValueHeight() {
    this.measureTankForm.get('height').valueChanges
      .subscribe((value) => {
        if (this.measureTankForm.get('gasFieldId').value) {
          const infoHeightGas = this.listInfoHeightGas.find((x) => {
            return x.height === convertMoney(value.toString());
          });
          if (!infoHeightGas && value) {
            this.measureTankForm.get('actualFinal').patchValue(0);
            this.measureTankForm.get('height').setErrors({heightNull: true});
            return;
          }
          this.measureTankForm.get('actualFinal').patchValue(infoHeightGas?.numberOfLit);

          const finalInventoryValue = Number(this.measureTankForm.get('finalInventory').value);
          const differenceValue = infoHeightGas?.numberOfLit - finalInventoryValue;

          this.measureTankForm.get('difference').patchValue(differenceValue);
          this.cdr.detectChanges();
        } else {
          this.measureTankForm.get('height').setErrors({gasFieldNull: true})
        }
      })
  }

  onClose() {
    this.modal.close();
  }

  onSubmit() {
    this.measureTankForm.markAllAsTouched();
    if (this.measureTankForm.invalid) {
      return;
    }

    const valueForm = this.measureTankForm.value;
    const dataReq = {
      name: valueForm.name,
      productName: valueForm.productName,
      productId: Number(valueForm.productId),
      gasFieldName: valueForm.gasFieldName,
      gasFieldCode: valueForm.gasFieldCode,
      gasFieldId: Number(valueForm.gasFieldId),
      stationId: Number(valueForm.stationId),
      length: valueForm.length,
      capacity: valueForm.capacity,
      note: valueForm.note,
      importQuantity: valueForm.importQuantity,
      exportQuantity: convertMoney(valueForm.exportQuantity.toString()),
      height: valueForm.height,
      actualFinal: valueForm.actualFinal,
      heightGasField: valueForm.heightGasFieldInfo
    }
    this.inventoryManagementService.createmMasures(dataReq)
      .subscribe((res) => {
        if (res) {
          this.modal.close(true);
        }
      }, (error: IError) => {
        this.checkError(error);
      })
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4964') {
      this.measureTankForm.get('name').setErrors({ nameExisted: true });
    }
  }

  downloadFile() {
    this.inventoryManagementService.exportFileWorldMeasure(this.data?.dataDetail?.station.id, this.data?.dataDetail.gasField.id)
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
  dataDetail?: IMeasures;
}
