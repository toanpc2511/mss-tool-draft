import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SystemUsers } from 'src/app/_models/systemUsers';
import { TitleService } from 'src/app/_services/title.service';
import {UserService} from "../../_services/user.service";
@Component({
  selector: 'app-popup-detail-user',
  templateUrl: './popup-detail-user.component.html',
  styleUrls: ['./popup-detail-user.component.scss']
})
export class PopupDetailUserComponent implements OnInit {
  objUser: SystemUsers = new SystemUsers()
  validFrom:any
  validTo:any
  lstTitle:[]
  titles:any
  rolesName:any
  constructor(@Inject(MAT_DIALOG_DATA)public data:any,
              private dialogRef:MatDialogRef<PopupDetailUserComponent>,
              private userService: UserService,private datepipe: DatePipe,
              private titleServie:TitleService
  ) { }
  ngOnInit() {
    this.rolesName = this.data.data.roles
    this.getDetailId()
  }
  getDetailId(){
    this.userService.detail(this.data.data.id).subscribe(rs => {
      this.objUser = rs.item
      this.objUser.userAd = rs.item.userAd
      let a = this.objUser.titleIds
      this.validFrom = this.objUser.validFrom != null ? this.datepipe.transform(this.objUser.validFrom, 'dd/MM/yyyy') : null
      this.validTo = this.objUser.validTo != null ? this.datepipe.transform(this.objUser.validTo, 'dd/MM/yyyy') : null
      this.titleServie.getAllTitle().subscribe(rsTitle =>{
        this.lstTitle = rsTitle.items
        for (let i = 0; i < this.lstTitle.length; i++) {
          if( a!== null && a.length > 0){
            for (let index = 0; index < a.length; index++) {
              if(this.lstTitle[i]['id'] === a[index]){
                if(this.titles === undefined){
                  this.titles = this.lstTitle[i]['name']
                }else{
                  this.titles = this.titles +','+ this.lstTitle[i]['name']
                }
                
              }
            }
          }
        }
      })
    })
  }

  closeDialog(index: any){
    this.dialogRef.close(0)
    
  }
}
