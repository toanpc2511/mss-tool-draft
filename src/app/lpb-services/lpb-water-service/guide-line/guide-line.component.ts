import {Component, OnInit} from '@angular/core';
import {LpbDatatableConfig} from '../../../shared/models/LpbDatatableConfig';
import {LpbDatatableColumn} from '../../../shared/models/LpbDatatableColumn';
import {FileService} from '../../../shared/services/file.service';

@Component({
  selector: 'app-guide-line',
  templateUrl: './guide-line.component.html',
  styleUrls: ['./guide-line.component.scss']
})
export class GuideLineComponent implements OnInit {
  datatableConfig: LpbDatatableConfig = {
    hasNoIndex: true,
    hasPaging: true,
    hasSelection: false,
    filterDefault: '',
    defaultSort: '',
    hasAddtionButton: false,
    hiddenActionColumn: true
  };

  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[] = [{
    property: 'serviceName',
    operator: 'eq',
    value: 'water-service'
  }];
  columns: LpbDatatableColumn[] = [
    {
      headerName: 'Tên tài liệu',
      headerProperty: 'fileName',
      headerIndex: 0,
      className: 'w-200-px',
    },
    {
      headerName: 'Mô tả',
      headerProperty: 'description',
      headerIndex: 1,
      className: 'w-100-px',
    }
  ];

  constructor(private fileService: FileService) {
  }

  ngOnInit(): void {
  }

  view(rowData): void {
    const params = {
      id: rowData.id
    };
    this.fileService.downloadFileMethodGet('lpb-common-service/file/download/api/public', params);
  }
}
