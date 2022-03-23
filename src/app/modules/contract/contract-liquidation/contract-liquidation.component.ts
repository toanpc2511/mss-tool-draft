import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DataResponse } from '../../../shared/models/data-response.model';
import { IContractLiquidation } from './contract-liquidation.interface';
import { ContractService, EContractStatus } from '../contract.service';
import { FileService } from '../../../shared/services/file.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contract-liquidation',
  templateUrl: './contract-liquidation.component.html',
  styleUrls: ['./contract-liquidation.component.scss']
})
export class ContractLiquidationComponent implements OnInit {
  contractLiquidation: IContractLiquidation;
  eContractStatus = EContractStatus;
  @Input() contractId: string;

  constructor(private fileService: FileService,
              private modalService: NgbModal,
              private contractService: ContractService,
              private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    console.log(this.contractId);
    this.getLiquidationContract();
  }

  getLiquidationContract(): void {
    this.contractService.getLiquidationContract(this.contractId)
      .subscribe((res: DataResponse<IContractLiquidation>): void => {
        this.contractLiquidation = res.data;
        this.cdr.detectChanges();
      })
  }

  downloadFile(fileId: number, fileName: string) {
    return this.fileService.downloadFile(fileId.toString(), fileName);
  }

}
