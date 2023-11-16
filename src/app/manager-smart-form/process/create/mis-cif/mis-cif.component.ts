import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LstMisCif } from 'src/app/_models/mis-cif';
import { Mis } from 'src/app/_models/register.cif';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { MisCifService } from 'src/app/_services/mis-cif.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { ObjConfigPopup } from 'src/app/_utils/_objConfigPopup';
import { ObjCif } from 'src/app/_utils/_returnObjCif';
import { TextMessage } from 'src/app/_utils/_textMessage';

@Component({
  selector: 'app-mis-cif',
  templateUrl: './mis-cif.component.html',
  styleUrls: ['./mis-cif.component.scss']
})
export class MisCifComponent implements OnInit {
  textMessage: TextMessage = new TextMessage();
  misForm: FormGroup;
  submitted: boolean;
  objConfigPopup: ObjConfigPopup = new ObjConfigPopup();
  lstMenuCif: LstMisCif = new LstMisCif();
  objMis: Mis = new Mis();


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private dialogRef: MatDialogRef<MisCifComponent>,
    private misCifService: MisCifService) {
  }

  ngOnInit(): void {
    this.objMis = this.data.data;

    this.misForm = new FormGroup({
      CIF_LOAI: new FormControl(null, ),
      CIF_LHKT: new FormControl(null, ),
      CIF_TPKT: new FormControl(null, Validators.required),
      CIF_KBHTG: new FormControl(null, ),
      LHNNNTVAY: new FormControl(null, ),
      TD_MANKT: new FormControl(null, ),
      CIF_NGANH: new FormControl(null, ),
      CIF_PNKH: new FormControl(null, ),
      COM_TSCT: new FormControl(null, ),
      DC_GH: new FormControl(null, ),
      CIF_MANKT: new FormControl(null, ),
      CIF_KH78: new FormControl(null, Validators.required),
    });
    this.getData();
    if (Object.keys(this.objMis).length > 0) {
      console.log(this.objMis);
      this.filterObj();
    }
    if (this.data.isViewMode) {
      this.misForm.disable();
    }
  }

  getData(): void {
    this.misCifService.getAllMisCifLoai({}).subscribe(rs => this.lstMenuCif.lstMisCifType = rs.items);
    this.misCifService.getAllMisCifLHKT().subscribe(rs => this.lstMenuCif.lstMisCifLHKT = rs.items);
    this.misCifService.getAllMisCifTPKT().subscribe(rs => this.lstMenuCif.lstMisCifTPKT = rs.items);
    this.misCifService.getAllMisCifKBHTG().subscribe(rs => this.lstMenuCif.lstMisCifKBHTG = rs.items);
    this.misCifService.getAllMisCifLHNNNTVAY().subscribe(rs => this.lstMenuCif.lstMisCifLHNNNTVAY = rs.items);
    this.misCifService.getAllMisCifTDMANKT().subscribe(rs => this.lstMenuCif.lstMisCifTDMANKT = rs.items);
    this.misCifService.getAlMisCifNGANH().subscribe(rs => this.lstMenuCif.lstMisCifNGANH = rs.items);
    this.misCifService.getAllMisCifKH78().subscribe(rs => {
      this.lstMenuCif.lstMisCifKH78 = rs.items;
      let codeShow: string;
      this.lstMenuCif.lstMisCifKH78.forEach((e, index) => {
        this.lstMenuCif.lstMisCifKH78[index].codeName = e.code + ' - ' + e.name;
        if (e.code === '0000') {
          codeShow = e.code;
        }
      });
      if (!this.misForm.get('CIF_KH78').value) {
        this.misForm.get('CIF_KH78').setValue(codeShow);
      }
    });
    this.misCifService.getAllMisCifPNKH().subscribe(rs => this.lstMenuCif.lstMisCifPNKH = rs.items);
    this.misCifService.getAllMisCifComTSCT().subscribe(rs => this.lstMenuCif.lstMisCifComTSCT = rs.items);
    this.misCifService.getAllMisCifDCGH().subscribe(rs => this.lstMenuCif.lstMisCifDCGH = rs.items);
    this.misCifService.getAllMisCifMANKT().subscribe(rs => this.lstMenuCif.lstMisCifMANKT = rs.items);

  }

  get f(): any {
    return this.misForm.controls;
  }

  filterObj(): void {
    this.misForm.get('CIF_LOAI').setValue(this.objMis.cifLoaiCode);
    this.misForm.get('CIF_LHKT').setValue(this.objMis.cifLhktCode);
    this.misForm.get('CIF_TPKT').setValue(this.objMis.cifTpktCode);
    this.misForm.get('CIF_KBHTG').setValue(this.objMis.cifKbhtgCode);
    this.misForm.get('LHNNNTVAY').setValue(this.objMis.lhnnntvayCode);
    this.misForm.get('TD_MANKT').setValue(this.objMis.tdManktCode);
    this.misForm.get('CIF_NGANH').setValue(this.objMis.cifNganhCode);
    this.misForm.get('CIF_PNKH').setValue(this.objMis.cifPnkhCode);
    this.misForm.get('COM_TSCT').setValue(this.objMis.comTsctCode);
    this.misForm.get('DC_GH').setValue(this.objMis.dcGhCode);
    this.misForm.get('CIF_MANKT').setValue(this.objMis.cifManktCode);
    this.misForm.get('CIF_KH78').setValue(this.objMis.cifKh78Code);
  }

  save(index: any): void {
    this.submitted = true;
    if (this.misForm.valid) {
      const obj = ObjCif.returnObjMis(this.misForm.controls);
      this.objConfigPopup.index = index;
      this.objConfigPopup.data = obj;
      console.log(this.objConfigPopup);
      this.dialogRef.close(this.objConfigPopup);
    }

  }
  closeDialog(index: any): void {
    const item = {};
    // tslint:disable-next-line:no-string-literal
    item['number'] = 17;
    const dialogRefConfirm = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRefConfirm.afterClosed().subscribe(rs => {
      if (rs === 1) {

        this.dialogRef.close(index);
        const obj = ObjCif.returnObjMis(this.misForm.controls);
        this.objConfigPopup.index = index;
        this.objConfigPopup.data = obj;
        this.dialogRef.close(this.objConfigPopup);
        // this.save(1);
      }
    });
  }
}
