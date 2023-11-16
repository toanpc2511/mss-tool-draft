import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/_services/document.service';
import { Location } from "@angular/common";
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-printout-account',
  templateUrl: './printout-account.component.html',
  styleUrls: ['./printout-account.component.css']
})
export class PrintoutAccountComponent implements OnInit {
  processId:string='';
  accountId:string='';
  linkURL: any;
  hideProcess = false;
  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private _LOCATION: Location
  ) { }

  ngOnInit(): void {
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.openAccount()
  }
  backPage() {
    this._LOCATION.back();
    
  }
  openPDF(data){ 
    let blob = new Blob([data], { type: 'application/pdf' });
    var downloadURL = URL.createObjectURL(blob);
    var link = document.createElement('a');
    this.linkURL = this.sanitizer.bypassSecurityTrustResourceUrl(downloadURL); 
  }
  openAccount(){
    this.documentService.getFileReportViewAccount(this.processId, this.accountId).subscribe(data => {
      this.openPDF(data);
      this.hideProcess = true;
    },() => {
      this.hideProcess = false;
  });
  }

}
