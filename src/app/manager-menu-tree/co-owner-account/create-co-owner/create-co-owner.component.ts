import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailProcess } from '../../../_models/process';
import { ProcessService } from '../../../_services/process.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { MissionService } from '../../../services/mission.service';
import { CategoryList } from '../../../_models/category/categoryList';
import { Response, ResponseStatus } from '../../../_models/response';
import { ConstantUtils } from '../../../_utils/_constant';
import { ProcessItem } from '../../../_models/process/ProcessItem';
import { GlobalConstant } from 'src/app/_utils/GlobalConstant';
import { CifCondition } from 'src/app/_models/cif';
import { PopupSearchComponent } from 'src/app/_popup-search/popup.search.component';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { MatDialog } from '@angular/material/dialog';
import { CoOwnerAccountService } from 'src/app/_services/co-owner-account.service';
import { Location } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-create-co-owner',
  templateUrl: './create-co-owner.component.html',
  styleUrls: ['./create-co-owner.component.scss']
})
export class CreateCoOwnerComponent implements OnInit {
  @Input() isCoOwner = false;
  @Input() processId = '';
  @Input() accountId = '';
  @Input() isSearchCif = false;
  // processId: string;
  // accountId: string;
  coOwnerId = '';
  processItem = new ProcessItem();
  customerId: string;
  userInfo: any;
  constantUtils: ConstantUtils = new ConstantUtils();
  response: Response;
  responseStatus: ResponseStatus;
  detailProcess: DetailProcess = new DetailProcess(null);
  categories: CategoryList = new CategoryList();
  submitted: boolean;
  showCIF: boolean;
  isUpdate: boolean;
  showVisa: boolean;
  hiddenCoOwnerForm: boolean;
  CUSTOMER_TYPE = GlobalConstant.CUSTOMER_TYPE;
  filterSelected = this.CUSTOMER_TYPE.CMND;
  valueSearchValid: boolean;
  valueSearch: string;
  condition: CifCondition = new CifCondition();
  // tslint:disable-next-line:no-inferrable-types
  hiddenForm: boolean = true;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private cifService: ProcessService,
    private errorHandler: ErrorHandlerService,
    private missionService: MissionService,
    private _LOCATION: Location,
    private indivCifService: ProcessService,
    private coOwnerAccountService: CoOwnerAccountService
  ) { }

  ngOnInit(): void {
    $('.childName').html('Thêm tài khoản đồng sở hữu');
    $('.click-link').addClass('active');
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    this.coOwnerId = this.route.snapshot.paramMap.get('coOwnerId');

    // console.log(this.route.snapshot.paramMap);
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')));
  }

  getProcessInformation(processId: string): void {
    if (processId) {
      this.missionService.setProcessId(processId);
      this.processId = processId;
      // this.missionService.setLoading(true);
      this.cifService.detailProcess(processId).subscribe(data => {
        this.processItem = data.item;
        // this.checkLoading()
        if (!this.processItem) {
          this.errorHandler.showError('Không lấy được thông tin hồ sơ');
        }
      },
        error => {
          this.errorHandler.showError(error);
          // this.missionService.setLoading(false);
        }
      );
    }
  }

  onValueSearchChange(): boolean {
    return this.valueSearchValid = this.valueSearch ? !(this.valueSearch.length > 0) : true;
  }

  onFilterChange(selection: string): void {
    if (selection === '1') {
      this.condition.code = this.valueSearch;
    } else if (selection === '2') {
      this.condition.code = this.valueSearch;
    }
  }

  search(): void {
    const data = {
      px: '',
      position_top: '',
      data: {
        customerCode: this.valueSearch,
        type: this.filterSelected,
        isSearchCif: this.isSearchCif,
        isSearchCoOwner: this.isCoOwner,
        processId: this.processId,
        accountId: this.accountId,
      },
      index: 0
    };
    const dialogRef = this.dialog.open(PopupSearchComponent, DialogConfig.configDialogSearch(data));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        if (this.isCoOwner) {
          this.router.navigate(['./smart-form/manager/co-owner/create', {
            processId: this.processId,
            accountId: this.accountId,
          }]);
        }
      }
      this.hiddenForm = false;
    });
  }
}
