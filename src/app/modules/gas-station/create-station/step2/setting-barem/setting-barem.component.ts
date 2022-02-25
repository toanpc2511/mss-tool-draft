import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GasStationService, IInfoBarem } from '../../../gas-station.service';
import { takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { IError } from '../../../../../shared/models/error.model';
import { FileService } from '../../../../../shared/services/file.service';

type FileContent = any[][];

@Component({
  selector: 'app-setting-barem',
  templateUrl: './setting-barem.component.html',
  styleUrls: ['./setting-barem.component.scss'],
  providers: [DestroyService]
})
export class SettingBaremComponent implements OnInit {
  @Input() data: IDataTransfer;
  dataSource: IInfoBarem;
  isDisabled: boolean;
  sampleFile: string;

  fileContent: FileContent = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

  constructor(
    public modal: NgbActiveModal,
    private gasStationService: GasStationService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private destroy$: DestroyService,
    private fileService: FileService
    ) {
    this.isDisabled = true;
    this.sampleFile = 'https://sunoil-management.firecloud.live/images/2021-11-22/Barem-bo%CC%82%CC%80n.xlsx';
  }

  ngOnInit(): void {
    this.gasStationService.getInfoBarem(this.data.gasBinId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.data) {
          this.dataSource = res.data;
          this.cdr.detectChanges();
        }
      });
  }

  onSubmit() {
    const dataBarem = [];
    this.fileContent.map((x) => {
      dataBarem.push(_.zipObject(['height', 'numberOfLit'], x))
    })

    const dataReq = {
      gasFieldId: this.data.gasBinId,
      scaleRequest: dataBarem
    }

    this.gasStationService.impostBarem(dataReq)
      .subscribe(() => {
        this.modal.close();
        this.toastr.success('Nhập Barem bồn thành công !');
      },(error: IError) => {
      this.checkError(error);
    });
  }

  checkError(error: IError) {
    this.toastr.error(error.code)
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* Đọc file */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });


      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.checkValidateReadFile(<FileContent>(XLSX.utils.sheet_to_json(ws, { header: 1 })), evt);
    }

    reader.readAsBinaryString(target.files[0]);
  }

  checkValidateReadFile(dataFile, event) {
    dataFile.shift();
    dataFile.length > 0 ? this.isDisabled = false : this.isDisabled = true;
    console.log(dataFile);
    if (dataFile.length === 0) {
      this.toastr.error('Vui lòng nhập file có dữ liệu barem!')
      return;
    }

    if (dataFile[0].length !== 2) {
      this.toastr.error('File không đúng định dạng. Vui lòng nhập lại!');
      this.isDisabled = true;
      return dataFile = [];
    }

    dataFile.map((x, index) => {
      if (
        index > 0 && (typeof(x[0]) === 'string' || typeof(x[1]) === 'string')
        || x[0] > 10000 || x[1] > 1000000
      ) {
        this.toastr.error('File không đúng định dạng. Vui lòng nhập lại!');
        this.isDisabled = true;
        return dataFile = [];
      }

      if (index > 0 && (!Number.isInteger(x[0]) || !Number.isInteger(x[1]) || x[0] < 0 || x[1] < 0 )) {
        this.toastr.error('File không đúng định dạng. Vui lòng nhập lại!')
        this.isDisabled = true;
        return dataFile = [];
      }
    })
    event.target.value = null;
    return this.fileContent = dataFile
  }

  downloadSampleFile() {
    this.fileService.downloadFromUrl(this.sampleFile);
  }
}

export interface IDataTransfer {
  title: string;
  gasBinId: number;
}
