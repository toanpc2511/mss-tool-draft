import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PopupSearchComponent } from '../../_popup-search/popup.search.component';
import { DialogConfig } from '../../_utils/_dialogConfig';
import { GlobalConstant } from '../../_utils/GlobalConstant';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProcessService } from '../../_services/process.service';
import { CifCondition } from '../../_models/cif';
import { CreateAuthorityComponent } from 'src/app/manager-menu-tree/create-authority/create-authority.component';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { MissionService } from 'src/app/services/mission.service';

@Component({
  selector: 'app-search-info',
  templateUrl: './search-info.component.html',
  styleUrls: ['./search-info.component.css']
})
export class SearchInfoComponent implements OnInit {
  @Input() isCoOwner = false;
  @Input() processId = '';
  @Input() accountId = '';
  @Input() isSearchCif = false;
  @Input() isSearchAuthor = false;
  CUSTOMER_TYPE = GlobalConstant.CUSTOMER_TYPE;
  valueSearchValid: boolean;
  valueSearch: string;
  filterSelected = this.CUSTOMER_TYPE.CMND;
  processItem: any = [];
  condition: CifCondition = new CifCondition();
  @Output() hiddenForm = new EventEmitter<boolean>();
  @Output() DetailCifData = new EventEmitter<any>();
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private cifService: ProcessService,
    private errorHandler: ErrorHandlerService,
    private missionService: MissionService) {
  }

  ngOnInit(): void {
  }

  onValueSearchChange(): boolean {
    // console.log();
    return this.valueSearchValid = this.valueSearch ? !(this.valueSearch.length > 0) : true;
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
        } else if (this.isSearchAuthor) {
          this.hiddenForm.emit(true);
          this.DetailCifData.emit(this.processId);
          // console.log('aaaa', this.DetailCifData.emit(this.processId));

        }

        else {
          this.router.navigate(['./smart-form/registerService']);
        }

      }
    });
  }

  onFilterChange(selection: string): void {
    if (selection === '1') {
      this.condition.code = this.valueSearch;
    } else if (selection === '2') {
      this.condition.code = this.valueSearch;
    }
  }
  getProcessInformation(processId): void {
    if (processId) {
      this.missionService.setProcessId(processId);
      this.processId = processId;
      this.cifService.detailProcess(processId).subscribe(data => {
        this.processItem = data.item;
        // console.log(data.item);
        if (!this.processItem) {
          this.errorHandler.showError('Không lấy được thông tin hồ sơ');
        }
      },
        error => {
          this.errorHandler.showError(error);
        }
      );
    }
  }
}
