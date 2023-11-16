import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { ValidatorHelper } from 'src/app/shared/utilites/validators.helper';
import {
  AUTHORIZED_PERSON,
  CO_OWNER,
  LEGAL_REPRESENTATIVE,
  UDF,
} from '../../../../../shared/models/saving-basic';
import { NO_EMIT, USER_INFO } from '../../../../constants/common';
import { ExtendInfoService } from '../../../../services/extend-info.service';
import {
  EnumInputType,
  IBuilder,
} from '../../../form-array/form-array.component';
import { ListDialogComponent } from '../../../list-dialog/list-dialog.component';
import { DialogFormAuthorizedPersonComponent } from '../dialog-form-authorized-person/dialog-form-authorized-person.component';
import { DialogFormCoOwnerComponent } from '../dialog-form-co-owner/dialog-form-co-owner.component';
import { DialogFormLegalRepresentativeComponent } from '../dialog-form-legal-representative/dialog-form-legal-representative.component';
import { DialogUDFComponent } from '../dialog-udf/dialog-udf.component';

@Component({
  selector: 'app-list-button-open-dialog',
  templateUrl: './list-button-open-dialog.component.html',
  styleUrls: ['./list-button-open-dialog.component.scss'],
})
export class ListButtonOpenDialogComponent implements OnInit {
  @Input() isDetail = false;
  dialogCoOwners: MatDialogRef<any>;
  dialogAuthorizedPersons: MatDialogRef<any>;
  dialogLegalRepresentative: MatDialogRef<any>;

  coOwners: CO_OWNER[];
  authorizedPersons: AUTHORIZED_PERSON[];
  udf: UDF;
  legalRepresentatives: LEGAL_REPRESENTATIVE[];
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogService: LpbDialogService,
    private matDialog: MatDialog,
    private extendInfoService: ExtendInfoService
  ) {}

  ngOnInit(): void {
    this.dialogService.setDialog(this.matDialog);
    this.extendInfoService.coOwners.subscribe((coOwners) => {
      this.coOwners = [...coOwners];
      if (this.dialogCoOwners?.componentInstance?.data) {
        let sumOwnershipRate = coOwners.reduce((acc, cur) => {
          let rate = Number(cur.ownershipRate);
          if (isNaN(rate)) {
            return acc;
          } else {
            return acc + rate;
          }
        }, 0);

        const description = `Tỷ lệ sở hữu của CSH 1: ${
          100 - sumOwnershipRate
        }%`;

        this.dialogCoOwners.componentInstance.data = {
          ...this.dialogCoOwners.componentInstance.data,
          data: [...coOwners],
          description,
        };
      }
    });

    this.extendInfoService.legalRepresentative.subscribe(
      (legalRepresentative) => {
        this.legalRepresentatives = [...legalRepresentative];
        if (this.dialogLegalRepresentative?.componentInstance?.data) {
          this.dialogLegalRepresentative.componentInstance.data = {
            ...this.dialogLegalRepresentative.componentInstance.data,
            data: [...legalRepresentative],
          };
        }
      }
    );

    this.extendInfoService.authorizedPersons.subscribe((authorizedPersons) => {
      this.authorizedPersons = [...authorizedPersons];
      if (this.dialogAuthorizedPersons?.componentInstance?.data) {
        this.dialogAuthorizedPersons.componentInstance.data = {
          ...this.dialogAuthorizedPersons.componentInstance.data,
          data: [...authorizedPersons],
        };
      }
    });

    this.extendInfoService.udf.subscribe((udf) => {
      this.udf = udf;
    });
  }

  openUDF() {
    const formUDF = this.fb.group({
      savingsBook: [''], // Sổ tiết kiệm
      maxCost: [''], // Chi phí HD tối da
      employeeCode: ['', ValidatorHelper.required], // Mã nhân viên (*)
      totalAccount: [''], // TK TONG
      unitName: [''], // Tên đơn vị
      mechanism: [''], // Cơ chế
      depositContractNumber: [''], // Số hợp đồng tiền gửi
      vipCustomer: [''], // Khách hàng VIP
      cbnvHdv: [''], // CBNV HDV
      lotteryTicketNumber: [''], // Số phiếu dự thưởng
      maxDueDate: [''], // Ngày đến hạn tối đa
      pgdbd: [''], // PGDBĐ
      depositAmounts: [''], // Các khoản ký quỹ
      unitTaxCode: [''], // MST đơn vị
      socialInsuranceType: [''], // Phân loại BHXH
      onlineChannel: [''], // Kênh online
      cctg: [''], // CCTG
      transferInfo: [''], // Thông tin chuyển nhượng
      fourC_PTTT: [''], // 4C_PTTT
      program: [''], // Chương trình
      oddTermType: [''], // Loại kỳ hạn lẻ ngày
      unitAddress: [''], // Địa chỉ đơn vị
      socialInsuranceProvinceCode: [''], // Mã tỉnh BHXH
      gift: [''], // Qùa tặng
      khoiHo: [''], // KHOI HO
      normalInterestRate: [''], // Lãi suất thường
      postOfficeCode: [''], // Mã bứu cục
      salaryAccount: [''], // TK Lương
      tkbd: [''], // TKBD
      depositMoney: [''], // Tiền gửi ký quỹ
      customerType: [''], // Đối tượng khách hàng
      referralOfficer: [''], // Cán bộ giới thiệu
      accountInterestRateDiscount: [''], //Ưu đãi lãi xuất tài khoản
    });
    if (this.udf) {
      formUDF.patchValue(this.udf);
    } else {
      formUDF.get('employeeCode').patchValue(USER_INFO()?.employeeId);
    }

    if (this.isDetail) {
      formUDF.disable(NO_EMIT);
    }
    const dialog = this.dialog.open(DialogUDFComponent, {
      data: {
        form: formUDF,
        isDetail: this.isDetail,
      },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result?.type === 'submit') {
        this.extendInfoService.setUdf(result?.data);
      }
    });
  }
  openAuthorizedPerson() {
    const builderAuthorizedPerson: IBuilder = {
      fullName: {
        label: 'Họ và tên',
        inputType: EnumInputType.link,
        class: { cellClass: 'text-blue-child' },
        onClick: ({ item: authorizedPerson }) => {
          this.dialog.open(DialogFormAuthorizedPersonComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '1300px',
            data: {
              authorizedPerson,
              isView: true,
            },
          });
        },
      },
      docNum: {
        label: 'GTXM',
        inputType: EnumInputType.text,
      },
      authorizationStartDate: {
        label: 'Ngày hiệu lực',
        inputType: EnumInputType.text,
        render: (value) => {
          return value;
        },
      },
      authorizationEndDate: {
        label: 'Ngày hết hạn',
        inputType: EnumInputType.text,
        render: (value) => {
          return value;
        },
      },
    };

    const data = {
      title: 'Thông tin người ủy quyền',
      data: this.authorizedPersons,
      builder: builderAuthorizedPerson,
      isDetail: this.isDetail,
      onAddItem: () => {
        const dialogRef = this.dialog.open(
          DialogFormAuthorizedPersonComponent,
          {
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '1300px',
          }
        );
        dialogRef.afterClosed().subscribe((result) => {
          if (result?.type === 'submit') {
            this.extendInfoService.addAuthorizedPersons(result.data);
          }
        });
      },
      onEditItem: ({ item: authorizedPerson }) => {
        const dialogRef = this.dialog.open(
          DialogFormAuthorizedPersonComponent,
          {
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '1300px',
            data: {
              authorizedPerson,
            },
          }
        );
        dialogRef.afterClosed().subscribe((result) => {
          if (result?.type === 'submit') {
            this.extendInfoService.editAuthorizedPersons({
              ...authorizedPerson,
              ...result.data,
            });
          }
        });
      },
      onDeleteItem: ({ item }) => {
        this.dialogService.openDialog(
          {
            title: 'Xác nhận xóa',
            messages: ['Bạn có chắc chắn muốn xóa thông tin?'],
          },
          () => {
            this.extendInfoService.deleteAuthorizedPersons(item);
          }
        );
      },
    };

    this.dialogAuthorizedPersons = this.dialog.open(ListDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '830px',
      data,
    });
  }

  openCoOwner() {
    // Khởi tạo form array
    const builderCoOwner = {
      cifNo: {
        label: 'Mã CIF',
        inputType: EnumInputType.link,
        onClick: ({ item: coOwner }) => {
          this.dialog.open(DialogFormCoOwnerComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '1300px',
            data: {
              coOwner,
              isView: true,
            },
          });
        },
      },
      fullName: {
        label: 'Họ và tên',
        inputType: EnumInputType.text,
      },
      docNum: {
        label: 'GTXM',
        inputType: EnumInputType.text,
      },
      expirationDate: {
        label: 'Ngày hết hiệu lực',
        inputType: EnumInputType.text,
      },
      ownershipRate: {
        label: 'Tỉ lệ sở hữu',
        inputType: EnumInputType.text,
      },
    };

    this.dialogCoOwners = this.dialog.open(ListDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '950px',
      data: {
        title: 'Thông tin người đồng sở hữu',
        data: this.coOwners,
        builder: builderCoOwner,
        isDetail: this.isDetail,
        description: 'Tỷ lệ sở hữu của CSH 1: 100%',
        onAddItem: () => {
          const dialogRef = this.dialog.open(DialogFormCoOwnerComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '1300px',
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result?.type === 'submit') {
              this.extendInfoService.addCoOwner(result.data);
            }
          });
        },
        onEditItem: ({ item: coOwner }) => {
          const dialogRef = this.dialog.open(DialogFormCoOwnerComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '1300px',
            data: {
              coOwner,
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result?.type === 'submit') {
              this.extendInfoService.editCoOwner({
                ...coOwner,
                ...result.data,
              });
            }
          });
        },

        onDeleteItem: ({ item }) => {
          this.dialogService.openDialog(
            {
              title: 'Xác nhận xóa',
              messages: ['Bạn có chắc chắn muốn xóa thông tin?'],
            },
            () => {
              this.extendInfoService.deleteCoOwner(item);
            }
          );
        },
      },
    });
  }

  openLegalRepresentative() {
    // Khởi tạo list
    const builderLegalRepresentative: IBuilder = {
      fullName: {
        label: 'Họ và tên',
        inputType: EnumInputType.link,
        class: { cellClass: 'text-blue-child' },
        onClick: ({ item: legalRepresentative }) => {
          this.dialog.open(DialogFormLegalRepresentativeComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '1300px',
            data: {
              legalRepresentative,
              isView: true,
            },
          });
        },
      },
      cifNo: {
        label: 'Mã CIF',
        inputType: EnumInputType.text,
      },
      docNum: {
        label: 'GTXM',
        inputType: EnumInputType.text,
      },
      guardianType: {
        label: 'Loại giám hộ',
        inputType: EnumInputType.text,
      },
    };
    const data = {
      title: 'Thông tin người đại diện pháp luật',
      data: this.legalRepresentatives,
      builder: builderLegalRepresentative,
      onEditItem: ({ item: legalRepresentative }) => {
        const dialogRef = this.dialog.open(
          DialogFormLegalRepresentativeComponent,
          {
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '1300px',
            data: {
              legalRepresentative,
            },
          }
        );
        dialogRef.afterClosed().subscribe((result) => {
          if (result?.type === 'submit') {
            console.log(result.data);

            this.extendInfoService.editLegalRepresentative({
              ...legalRepresentative,
              ...result.data,
            });
          }
        });
      },
      onDeleteItem: ({ item: legalRepresentative }) => {
        this.dialogService.openDialog(
          {
            title: 'Xác nhận xóa',
            messages: ['Bạn có chắc chắn muốn xóa thông tin?'],
          },
          () => {
            this.extendInfoService.deleteLegalRepresentative(
              legalRepresentative
            );
          }
        );
      },
    };

    this.dialogLegalRepresentative = this.dialog.open(ListDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '830px',
      data,
    });
  }
  openBeneficiary() {
    const builderBeneficiary: IBuilder = {
      fullName: {
        label: 'Họ và tên',
        inputType: EnumInputType.link,
        class: { cellClass: 'text-blue-child' },
        onClick: ({ item: beneficiary }) => {
          this.dialog.open(DialogFormAuthorizedPersonComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '1300px',
            data: {
              beneficiary,
            },
          });
        },
      },
      birthDay: {
        label: 'Ngày sinh',
        inputType: EnumInputType.text,
        render: (value) => {
          return value;
        },
      },
      docNum: {
        label: 'GTXM',
        inputType: EnumInputType.text,
      },
      relationship: {
        label: 'Quan hệ với CSH',
        inputType: EnumInputType.text,
      },
    };

    const data = {
      title: 'Thông tin người thụ hưởng',
      data: this.authorizedPersons,
      builder: builderBeneficiary,
      isDetail: this.isDetail,
      onAddItem: () => {
        const dialogRef = this.dialog.open(
          DialogFormAuthorizedPersonComponent,
          {
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '1300px',
          }
        );
        dialogRef.afterClosed().subscribe((result) => {
          if (result?.type === 'submit') {
            this.extendInfoService.addAuthorizedPersons(result.data);
          }
        });
      },
      onDeleteItem: ({ item }) => {
        this.dialogService.openDialog(
          {
            title: 'Xác nhận xóa',
            messages: ['Bạn có chắc chắn muốn xóa thông tin?'],
          },
          () => {
            this.extendInfoService.deleteAuthorizedPersons(item);
          }
        );
      },
    };

    this.dialogAuthorizedPersons = this.dialog.open(ListDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '830px',
      data,
    });
  }
}
