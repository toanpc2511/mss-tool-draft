import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { FileService } from 'src/app/shared/services/file.service';
import {BaseComponent} from "../../../shared/components/base/base.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ContractService, EContractStatus} from "../contract.service";
import { IContractLiquidation } from './contract-liquidation.interface';
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import { DataResponse } from 'src/app/shared/models/data-response.model';
import {CreateContractLiquidationComponent} from "./create-contract-liquidation/create-contract-liquidation.component";

export interface IDataTransfer {
  title: string;
  type: string;
}

@Component({
  selector: 'app-contract-liquidation',
  templateUrl: './contract-liquidation.component.html',
  styleUrls: ['./contract-liquidation.component.scss']
})
export class ContractLiquidationComponent extends BaseComponent implements OnInit {
  contractLiquidation: IContractLiquidation;
  eContractStatus = EContractStatus;
  @Input() contractId: string;

  constructor(private fileService: FileService,
              private modalService: NgbModal,
              private contractService: ContractService,
              private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.getLiquidationContract();
  }

  getLiquidationContract(): void {
    this.contractService.getLiquidationContract(this.contractId)
      .subscribe((res: DataResponse<IContractLiquidation>): void => {
        this.contractLiquidation = res.data;
        this.cdr.detectChanges();
      })
  }

  openConfirmDialog(type?:string): void {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {
      backdrop: 'static',
      size: '500px'
    });

    modalRef.componentInstance.data = {
      type: type,
      contractId: this.contractId
    };
  }

  openCreateLiquidation(status: string): void {
    const modalRef = this.modalService.open(CreateContractLiquidationComponent, {
      backdrop: 'static',
      size: 'xl',
    });

    modalRef.componentInstance.data = {
      contractId: this.contractId,
      status: status
    };

    modalRef.result.then((result) => {
      if (result) {
        this.getLiquidationContract();
      }
    })
  }

  downloadFile(fileId: number, fileName: string) {
    return this.fileService.downloadFile(fileId.toString(), fileName);
  }

}
