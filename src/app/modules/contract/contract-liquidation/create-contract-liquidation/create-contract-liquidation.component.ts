import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ILiquidationDetail} from "../contract-liquidation.interface";
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
  @Input() data: string;
  liquidationDetails: ILiquidationDetail[];
  dataSource: FormArray;

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
      file: [null],
      liquidation: new FormArray([])
    });
  }

  ngOnInit(): void {
    this.getDetailLiquidationContract();
  }

  initForm(data: ILiquidationDetail[]): void {
    data.forEach((d: ILiquidationDetail) => {
      const test: FormGroup = this.fb.group({
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
        liquidationUnitPrice: [d.liquidationUnitPrice, Validators.required],
        intoLiquidationMoney: [0]
      });

      (this.createForm.get('liquidation') as FormArray).push(test);
    });
  }

  getDetailLiquidationContract(): void {
    this.contractService.getDetailLiquidationContract(this.data)
      .subscribe((res: DataResponse<ILiquidationDetail[]>): void => {
        this.initForm(res.data);
      })
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
    this.createForm.markAllAsTouched();
    if (this.createForm.invalid) {
      return;
    }

    (this.createForm.get('liquidation') as FormArray).controls.forEach(d => {
      d.get('liquidationUnitPrice').patchValue(convertMoney(d.get('liquidationUnitPrice').value));
    })

    const data = {
      ...this.createForm.getRawValue(),
      contractId: this.data,
      otherFees: convertMoney(this.createForm.get('otherFees').value),
      storageFee: convertMoney(this.createForm.get('storageFee').value),
      file: this.filesUploaded.map((f: IFile) => f.id),
    }

    this.contractService.createLiquidationContract(data)
      .subscribe((res: DataResponse<boolean>): void => {
        if (res.data) {
          this.modal.close(1);
        }
      })
  }

}
