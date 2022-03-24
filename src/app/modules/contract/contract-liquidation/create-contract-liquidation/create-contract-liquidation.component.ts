import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {IContractLiquidation, ILiquidationDetail} from "../contract-liquidation.interface";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {convertMoney, renameUniqueFileName} from "../../../../shared/helpers/functions";
import {EFileType, FileService, IFile} from "../../../../shared/services/file.service";
import {ToastrService} from "ngx-toastr";
import {takeUntil} from "rxjs/operators";
import {HttpEventType} from "@angular/common/http";
import {DestroyService} from "../../../../shared/services/destroy.service";
import { ContractService } from '../../contract.service';
import {DataResponse} from "../../../../shared/models/data-response.model";
import {ITransferData} from "../../details-contract/details-contract.component";

@Component({
  selector: 'app-create-contract-liquidation',
  templateUrl: './create-contract-liquidation.component.html',
  styleUrls: ['./create-contract-liquidation.component.scss'],
  providers: [DestroyService]
})
export class CreateContractLiquidationComponent implements OnInit {

  createForm: FormGroup;
  filesUploaded: Array<IFile> = [];
  filesUploadProgress: Array<number> = [];
  @Input() data: ITransferData;

  constructor(private fb: FormBuilder,
              private modal: NgbActiveModal,
              private toastr: ToastrService,
              private destroy$: DestroyService,
              private fileService: FileService,
              private cdr: ChangeDetectorRef,
              private contractService: ContractService
  ) {
    this.buildForm();
  }

  buildForm(): void {
    this.createForm = this.fb.group({
      contractId: [null],
      totalLiquidationOfFuel: [null],
      storageFee: [null],
      otherFees: [null],
      totalMoney: [null],
      note: [null, Validators.maxLength(500)],
      file: [null, Validators.required],
      liquidation: new FormArray([])
    });
  }

  ngOnInit(): void {
    this.getDetailLiquidationContract();
  }

  getDetailLiquidationContract(): void {
    this.contractService.getDetailLiquidationContract(this.data.contractId)
      .subscribe((res: DataResponse<IContractLiquidation>): void => {
        this.initForm(res.data);
      });
  }

  initForm(data: IContractLiquidation): void {
    if (this.data.status === 'REFUSED') {
      const {liquidation, storageFee, otherFees, ...liquidationInfo} = {...data};
      this.createForm.patchValue({...liquidationInfo, storageFee: storageFee?.toLocaleString('en-US'), otherFees: otherFees?.toLocaleString('en-US')});
      this.filesUploaded = liquidationInfo.file;
    }

    data.liquidation.forEach((d: ILiquidationDetail) => {
      const product: FormGroup = this.fb.group({
        id: [d.id],
        discount: [d.discount],
        name: [d.name],
        totalMoney: [d.totalMoney],
        price: [d.price],
        unit: [d.unit],
        theRemainingAmount: [d.theRemainingAmount],
        cashLimitOil: [d.cashLimitOil],
        liquidationAmount: [Math.min(d.amount, d.liquidationAmount)],
        amount: [d.amount],
        liquidationUnitPrice: [d.liquidationUnitPrice?.toLocaleString('en-US'), Validators.required],
        intoLiquidationMoney: [d.intoLiquidationMoney]
      });

      (this.createForm.get('liquidation') as FormArray).push(product);
    });
  }

  get liquidation(): FormArray {
    return this.createForm.get('liquidation') as FormArray;
  }

  onClose(): void {
    this.modal.close();
  }

  calculateLiquidationMoney(index: number): void {
    const liquidationPrice: number = convertMoney((this.createForm.controls['liquidation'] as FormArray).at(index)?.get('liquidationUnitPrice').value);
    const liquidationAmount: number = +(this.createForm.controls['liquidation'] as FormArray).at(index)?.get('liquidationAmount').value;
    const totalMoney: number = liquidationPrice * liquidationAmount;

    (this.createForm.controls['liquidation'] as FormArray).at(index)?.get('intoLiquidationMoney').patchValue(totalMoney);
    this.calculateLiquidationTotal();
    this.calculateTotalMoney();
  }

  calculateLiquidationTotal(): void {
    const liquidation: ILiquidationDetail[] = (this.createForm.controls['liquidation'] as FormArray).getRawValue();
    const total = liquidation.reduce((acc, cur) => {
      return acc + cur.intoLiquidationMoney;
    }, 0);
    this.createForm.get('totalLiquidationOfFuel').patchValue(total);
  }

  calculateTotalMoney(): void {
    const liquidationTotal: number = this.createForm.controls['totalLiquidationOfFuel'].value;
    const otherFees: number = convertMoney(this.createForm.controls['otherFees'].value);
    const storageFee: number = convertMoney(this.createForm.controls['storageFee'].value);
    const totalMoney: number = liquidationTotal - otherFees - storageFee;

    this.createForm.get('totalMoney').patchValue(Number(totalMoney));
  }

  addFiles($event: Event): void {
    const inputElement = $event.target as HTMLInputElement;
    const files = Array.from(inputElement.files);
    if (files.length > 0 && files.length <= 10 - this.filesUploaded.length) {
      let filePush: Array<File> = [];

      for (const file of files) {
        if (file.size <= 5000000) {
          const newFile = renameUniqueFileName(file, `${file.name}`);
          filePush = [...filePush, newFile];
        } else {
          this.toastr.error('File tải lên có dung lượng lớn hơn 5Mb');
          filePush = [];
          break;
        }
      }
      this.filesUploaded = [...this.filesUploaded].concat(
        filePush.map((file) => ({ name: file.name }))
      );
      const startIndex = this.filesUploaded.length - filePush.length;
      for (let i = startIndex; i < filePush.length + startIndex; i++) {
        this.uploadFile(i, filePush[i - startIndex]);
      }
    } else {
      this.toastr.error('Không được tải lên quá 10 file');
    }
    inputElement.value = null;
  }

  uploadFile(index: number, file: File) {
    this.filesUploadProgress[index] = 0;
    const formData = new FormData();
    formData.append('files', file);
    this.fileService
      .uploadFile(formData, EFileType.OTHER)
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (event?.type === HttpEventType.UploadProgress) {
          this.filesUploadProgress[index] = Math.round((100 * event.loaded) / event.total);
        }
        if (event?.data) {
          this.filesUploaded[index].id = event.data[0].id;
          this.filesUploaded[index].url = event.data[0].url;
          this.filesUploaded[index].name = event.data[0].name;
        }
        this.cdr.detectChanges();
      });
  }

  removeFile(type: 'ALL' | 'ONE', id?: number) {
    if (type === 'ALL') {
      this.filesUploaded = [];
    } else {
      this.filesUploaded = [...this.filesUploaded].filter(
        (_, index) => this.filesUploaded.findIndex((f: IFile) => f.id === id) !== index
      );
    }
  }

  onSubmit(): void {
    this.createForm.patchValue({file: this.filesUploaded.map((f: IFile) => f.id)})
    this.createForm.markAllAsTouched();
    if (this.createForm.invalid) {
      return;
    }

    this.formatData();

    if (this.data.status === 'REFUSED') {
      this.contractService.updateLiquidationContract(this.createForm.getRawValue())
        .subscribe((res: DataResponse<boolean>): void => {
          this.modal.close(true);
        });
    } else {
      this.contractService.createLiquidationContract(this.createForm.getRawValue())
        .subscribe((res: DataResponse<boolean>): void => {
          if (res.data) {
            this.modal.close(1);
          }
        });
    }
  }

  formatData(): void {
    (this.createForm.get('liquidation') as FormArray).controls.forEach(d => {
      d.get('liquidationUnitPrice').patchValue(convertMoney(d.get('liquidationUnitPrice').value));
    })

    this.createForm.get('otherFees').patchValue(convertMoney(this.createForm.get('otherFees').value));
    this.createForm.get('storageFee').patchValue(convertMoney(this.createForm.get('storageFee').value));
    this.createForm.get('contractId').patchValue(this.data.contractId);
  }
}
