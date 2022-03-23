import { BaseComponent } from './../../../shared/components/base/base.component';
import {ChangeDetectorRef, Component, OnInit, AfterViewInit, ViewChild, TemplateRef, ContentChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ContractService, EContractStatus, EContractType} from '../contract.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { filter, pluck, switchMap, takeUntil } from 'rxjs/operators';
import {
  IDataTransfer,
  RejectContractModalComponent
} from './reject-contract-modal/reject-contract-modal.component';
import { FileService } from 'src/app/shared/services/file.service';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { CreateContractLiquidationComponent } from '../contract-liquidation/create-contract-liquidation/create-contract-liquidation.component';
import {UpdatePlanContractComponent} from "./update-plan-contract/update-plan-contract.component";
import {IAttachment} from "../../exchange-point-management/models/exchange-point.interface";
import {MatTabGroup} from "@angular/material/tabs";

export interface ITransferData {
  contractId: string;
  status: string;
}

@Component({
  selector: 'app-details-contract',
  templateUrl: './details-contract.component.html',
  styleUrls: ['./details-contract.component.scss'],
  providers: [DestroyService]
})
export class DetailsContractComponent extends BaseComponent implements OnInit, AfterViewInit {
  eContractStatus = EContractStatus;
  data;
  dataDetail;
  customerId;
  contractId;
  condition: false;
  detailImage: IAttachment;
  selectedIndex: number;
  eContractType = EContractType;
  @ViewChild(MatTabGroup, {static: false}) tabGroup: MatTabGroup;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private contractService: ContractService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private fileService: FileService,
    private activeRoute: ActivatedRoute,
    private subheader: SubheaderService,
  ) {
    super();
  }

  setBreadcumb() {
		setTimeout(() => {
			this.subheader.setBreadcrumbs([
				{
					title: 'Quản lý hợp đồng',
					linkText: 'Quản lý hợp đồng',
					linkPath: '/hop-dong/danh-sach'
				},
				{
					title: 'Chi tiết hợp đồng',
					linkText: 'Chi tiết hợp đồng',
					linkPath: null
				}
			]);
		}, 1);
	}

  ngOnInit(): void {
    this.getContractById();

  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

  getContractById() {
    this.activeRoute.params.subscribe((res) => {
      this.customerId = res.customerId;
      this.contractId = res.contractId;
    });

    this.activeRoute.params
      .pipe(
        pluck('contractId'),
        filter((contractId: number) => !!contractId),
        switchMap((contractId: number) => {
          return this.contractService.getContractById(contractId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.data = res.data;
        this.cdr.detectChanges();
      });
  }

  async goToListContract() {
    if (this.customerId) {
      await this.router.navigate([`/khach-hang/danh-sach/chi-tiet/${this.customerId}`]);
    } else {
      await this.router.navigate(['/hop-dong/danh-sach']);
    }
  }

  async refuseContract($event?: Event, data?: IDataTransfer) {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(RejectContractModalComponent, {
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.data = {
      title: 'Từ chối hợp đồng',
      contract: data,
      type: 'REJECT',
      customerId: this.customerId
    };
  }

  async acceptContract($event?: Event, data?: IDataTransfer) {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(RejectContractModalComponent, {
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.data = {
      title: 'Xác nhận hợp đồng',
      contract: data,
      type: 'ACCEPTED',
      customerId: this.customerId
    };
  }

  openCreateLiquidation(idContract: string, status?: string): void {
    const modalRef = this.modalService.open(CreateContractLiquidationComponent, {
      backdrop: 'static',
      size: 'xl',
    });

    modalRef.componentInstance.data = {
      contractId: idContract,
      status
    };

    modalRef.result.then((result) => {
      if (result) {
        this.getContractById();
        this.selectedIndex = result;
      }
    })
  }

  openUpdatePlanContractDialog(data): void {
    const modalRef = this.modalService.open(UpdatePlanContractComponent, {
      backdrop: 'static',
      size: 'xl'
    });

    modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        this.getContractById();
      }
    })
  }

  viewImages(content, item): void {
    this.modalService.open(content, { size: 'lg' });
    this.detailImage = item.file !== null ? item.file[0] : null;
  }

  downloadFile(fileId: string, fileName: string) {
    return this.fileService.downloadFile(fileId, fileName);
  }
}
