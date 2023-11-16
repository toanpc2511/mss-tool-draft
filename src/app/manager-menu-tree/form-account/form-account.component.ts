import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from 'src/app/_services/document.service';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { Location } from '@angular/common';
import { AccountModel } from 'src/app/_models/account';
import { Process } from 'src/app/_models/process/Process';
import { Legal } from 'src/app/_models/process/legal/Legal';
import { MissionService } from 'src/app/services/mission.service';
import { AccountService } from 'src/app/_services/account.service';
declare var $: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-account',
  templateUrl: './form-account.component.html',
  styleUrls: ['./form-account.component.css']
})
export class FormAccountComponent implements OnInit {
  process: Process = new Process();
  processId = '';
  accountId = '';
  downloadURL: any;
  data: any;
  safeUrl: any;
  linkURL: any;
  hiddenAccount = false;
  reportType = 'IBANKING';
  hideProcess = false;
  hideLoad = false;
  hideOpenAccount = false;
  hideOpenAccountCoowner = false;
  hideProcessUpdate = false;
  hideProcessCreate = false;
  hideUpdateToCard = false;
  lstAccount = [];
  lstAccountCore = [];
  lstAccountUni = [];
  lstAccountAuthor = [];
  lstAccountAuthorFinal = [];
  coOwnerList = [];
  coOwnerListFinal = [];
  legal: Legal[] = [];
  legalFinal = [];
  lstAccountCoowner = [];
  profession = '';
  professionOwner = '';
  sourceData = '';
  listDDPL = false;
  listTTPL = false;
  listSHHL = false;
  listDSH = false;
  customerCode = '';
  cards = [];
  cardsAll = [];
  subCard = [];
  subCardAll = [];
  viewFormCreate = false;
  coOwner = [];
  coOwnerNew = [];
  constructor(
    private router: Router,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private missionService: MissionService,
    private accountService: AccountService,
    private sanitizer: DomSanitizer,
    private _LOCATION: Location
  ) {
  }

  ngOnInit(): void {
    $('.childName').html('Biểu mẫu');
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.getProcessInformation(this.processId);
    this.hideProcess = false;
    this.missionService.setProcessId(this.processId);
    this.getListCard(this.processId);
  }
  getListCard(processId: string): void {
    this.documentService.getListCard({ processId: this.processId }).subscribe(rs => {
      if (rs.items !== undefined && rs.items.length > 0) {
        this.cardsAll = rs.items;
        for (let i = 0; i < rs.items.length; i++) {
          this.documentService.getListSupCard(this.cardsAll[i].id).subscribe(data => {
            if (data.items !== undefined && data.items.length > 0) {
              this.subCard = data.items;
              this.subCardAll = this.subCardAll || [];
              for (let i = 0; i < data.items.length; i++) {
                this.subCardAll.push(this.subCard[i]);
                this.hideUpdateToCard = true;
              }
            } else {
              this.subCardAll = null;
            }
          });
        }
      } else {
        this.cards = null;
      }
    });
  }
  getProcessInformation(processId): void {
    this.documentService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.sourceData = data.item.customer.sourceData
        this.profession = data.item.customer.person.profession;
        this.process.item = data.item;
        this.legal = data.item.customer.legalList;
        for (let i = 0; i < this.legal.length; i++) {
          if (this.legal[i].inEffect != false) {
            this.legalFinal.push(this.legal[i]);
          }
        }

        this.customerCode = data.item.customerCode;
        for (let i = 0; i < data.item.customer.guardianList.length; i++) {
          if (data.item.customer.guardianList[i].inEffect != false) {
            this.listDDPL = true;
          }
        }
        // if (data.item.customer.guardianList.length !== 0) { this.listDDPL = true; }
        for (let i = 0; i < data.item.customer.legalList.length; i++) {
          if (data.item.customer.legalList[i].inEffect != false) {
            this.listTTPL = true;
          }
        }
        // if (data.item.customer.legalList.length !== 0) { this.listTTPL = true; }
        for (let i = 0; i < data.item.customer.customerOwnerBenefit.length; i++) {
          if (data.item.customer.customerOwnerBenefit[i].inEffect != false) {
            this.listSHHL = true;
          }
        }
        // if (data.item.customer.customerOwnerBenefit.length !== 0) { this.listSHHL = true; }

        if (data.item.statusCode == "V") {
          this.viewFormCreate = true;
        }
        if (this.sourceData == "CORE" && this.viewFormCreate == false) {
          this.hideProcessUpdate = true;
        }
        this.documentService.getAccountList({ processId: this.processId }).subscribe(rs => {
          if (rs.items !== undefined && rs.items.length > 0) {
            this.hideOpenAccount = true;
            this.lstAccount = rs.items;
            for (let i = 0; i < rs.items.length; i++) {
              if (this.lstAccount[i].currentStatusCode == "ACTIVE" && this.viewFormCreate == false) {
                this.lstAccountCore.push(this.lstAccount[i]);
                this.documentService.getCardByAccount(this.lstAccount[i].id).subscribe(rs => {
                  if (rs.items !== undefined && rs.items.length > 0) {
                    for (let j = 0; j < rs.items.length; j++) {
                      if (rs.items[j].cardStatusCode == null) {
                        this.lstAccountUni.push(this.lstAccount[i]);
                        break;
                      }
                    }
                  }
                });
              }

              else {
                this.lstAccountUni.push(this.lstAccount[i])
              }

              this.documentService.getAccountAuthors(this.lstAccount[i].id).subscribe(rs => {
                if (rs.items !== undefined && rs.items.length > 0) {
                  this.lstAccountAuthor = rs.items;
                  for (let j = 0; j < rs.items.length; j++) {
                    if (this.lstAccountAuthor[j].authorStatusCode != "INEFFECT" || this.lstAccountAuthor[j].authorStatusCode == null) {
                      this.lstAccountAuthorFinal.push(this.lstAccountAuthor[j]);
                    }
                  }

                } else {
                  this.lstAccountAuthor = null;

                }
              });
              this.documentService.list(this.lstAccount[i].id, this.processId).subscribe(
                data => {

                  if (data.items !== undefined && data.items.length > 0) {
                    this.coOwner = data.items
                    for (let j = 0; j < data.items.length; j++) {
                      if (this.coOwner[j].coowner.coownerStatusCode != "INEFFECT" || this.coOwner[j].coowner.coownerStatusCode == null) {
                        this.coOwnerListFinal.push(this.lstAccount[i]);
                        break;
                      }
                    }
                    for (let i = 0; i < data.items.length; i++) {
                      if (this.coOwner[i].customerCode == null) {
                        this.coOwnerNew.push(this.coOwner[i]);
                      }
                    }
                  }
                }
              );
            }
          } else {
            this.lstAccount = null;
          }
        });
      }
    });
  }


  backPage(): void {
    this._LOCATION.back();
  }
  openPDF(data): void {
    const blob = new Blob([data], { type: 'application/pdf' });
    const downloadURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    this.linkURL = this.sanitizer.bypassSecurityTrustResourceUrl(downloadURL);
  }
  openProcess(): void {
    this.hideProcess = true;
    this.hiddenAccount = true;
    if (this.profession === 'STUDENT') {
      this.documentService.getFileReportViewAccountSV(this.processId, null).subscribe(data => {
        this.openPDF(data);
        this.hideProcess = false;
      }, () => {
        this.hideProcess = true;
      });
    }
    else {
      this.documentService.getFileReportViewProcess(this.processId).subscribe(data => {
        this.openPDF(data);
        this.hideProcess = false;
      }, () => {
        this.hideProcess = true;
      });
    }
  }
  openCoOwner(item: any, professionOwner: any): void {
    this.hideProcess = true;
    this.hiddenAccount = true;
    if (professionOwner === 'STUDENT') {
      this.documentService.getFileReportViewCoOwnerSV(item).subscribe(data => {
        this.openPDF(data);
        this.hideProcess = false;
      }, () => {
        this.hideProcess = true;
      });
    }
    else {
      this.documentService.getFileReportViewCoOwner(item).subscribe(data => {
        this.openPDF(data);
        this.hideProcess = false;
      }, () => {
        this.hideProcess = true;
      });
    }
  }
  openCoOwnerDoc(item: any, professionOwner: any): void {
    this.hideLoad = true;
    if (professionOwner === 'STUDENT') {
      this.documentService.getFileReportViewCoOwnerSVDoc(item).subscribe(data => {
        this.openPDF2(data, "Đăng ký thông tin Khách hàng gửi tiết kiệm cho đồng sở hữu");
        this.hideLoad = false;
      }, () => {
        this.hideLoad = true;
      });
    }
    else {
      this.documentService.getFileReportViewCoOwnerDoc(item).subscribe(data => {
        this.openPDF2(data, "Đăng ký thông tin Khách hàng gửi tiết kiệm cho đồng sở hữu");
        this.hideLoad = false;
      }, () => {
        this.hideLoad = true;
      });
    }
  }

  openAccount(item: any): void {
    this.hideProcess = true;
    this.hiddenAccount = true;
    if (this.profession === 'STUDENT') {
      this.documentService.getFileReportViewAccountSV(this.processId, item).subscribe(data => {
        this.openPDF(data);
        this.hideProcess = false;
      }, () => {
        this.hideProcess = true;
      });
    }
    else {
      this.documentService.getFileReportViewAccount(this.processId, item).subscribe(data => {
        this.openPDF(data);
        this.hideProcess = false;
      }, () => {
        this.hideProcess = true;
      });
    }
  }
  openAccountDoc(item: any): void {
    this.hideLoad = true;
    if (this.profession === 'STUDENT') {
      this.documentService.getFileReportViewAccountSVDoc(this.processId, item).subscribe(data => {
        this.openPDF2(data, "Đề nghị kiêm thỏa thuận mở tài khoản");
        this.hideLoad = false;
      }, () => {
        this.hideLoad = true;
      });
    }
    else {
      this.documentService.getFileReportViewAccountDoc(this.processId, item).subscribe(data => {
        this.openPDF2(data, "Đề nghị kiêm thỏa thuận mở tài khoản");
      });
    }
  }
  openPaymentAccount(): void {
    this.hiddenAccount = true;
    this.hideProcess = true;
    this.documentService.getFileOpenPaymentAccount().subscribe(data => {
      this.openPDF(data);
      this.hideProcess = false;
    }, () => {
      this.hideProcess = true;
    });
  }
  openAccountDSH(item: any): void {
    this.hiddenAccount = true;
    this.hideProcess = true;
    this.documentService.getFileReportViewDSH(this.processId, item).subscribe(data => {
      this.openPDF(data);
      this.hideProcess = false;
    }, () => {
      this.hideProcess = true;
    });
  }
  openAccountDSHDoc(item: any): void {
    this.hideLoad = true;
    this.documentService.getFileReportViewDSHDoc(this.processId, item).subscribe(data => {
      this.openPDF2(data, "Thỏa thuận quản lý và sử dụng tài khoản Đồng sở hữu tài khoản");
        this.hideLoad = false;
      }, () => {
        this.hideLoad = true;
    });
  }
  openDebitAccount(): void {
    this.hiddenAccount = true;
    this.hideProcess = true;
    this.documentService.getFileOpenDebitAccount().subscribe(data => {
      this.openPDF(data);
      this.hideProcess = false;
    }, () => {
      this.hideProcess = true;
    });
  }
  openLV(): void {
    this.hiddenAccount = true;
    this.hideProcess = true;
    this.documentService.getFileOpenLV().subscribe(data => {
      this.openPDF(data);
      this.hideProcess = false;
    }, () => {
      this.hideProcess = true;
    });
  }
  openIBank(): void {
    this.hiddenAccount = true;
    this.hideProcess = true;
    this.documentService.getFileOpenIBank(this.processId, this.reportType).subscribe(data => {
      this.openPDF(data);
      this.hideProcess = false;
    }, () => {
      this.hideProcess = true;
    });
  }
  openAccountAuthor(item: any): void {
    this.hiddenAccount = true;
    this.hideProcess = true;
    this.documentService.getFileReportViewAuthor(this.processId, this.accountId, item).subscribe(data => {
      this.openPDF(data);
      this.hideProcess = false;
    }, () => {
      this.hideProcess = true;
    });
  }
  openAccountAuthorDoc(item: any): void {
    this.hideLoad = true;
    this.documentService.getFileReportViewAuthorDoc(this.processId, this.accountId, item).subscribe(data => {
      this.openPDF2(data, "Giấy ủy quyền tài khoản");
      this.hideLoad = false;
    }, () => {
      this.hideLoad = true;
    });
  }
  openAccountCSH(): void {
    this.hiddenAccount = true;
    this.hideProcess = true;
    this.documentService.getFileReportViewAccountCSH(this.processId).subscribe(data => {
      this.openPDF(data);
      this.hideProcess = false;
    }, () => {
      this.hideProcess = true;
    });
  }
  openAccountCSHDoc(): void {
    this.hideLoad = true;
    this.documentService.getFileReportViewAccountCSHDoc(this.processId).subscribe(data => {
      this.openPDF2(data, "Phụ lục thông tin chủ sở hữu hưởng lợi");
      this.hideLoad = false;
    }, () => {
      this.hideLoad = true;
    });
  }
  openAccountTTPL(item: any): void {
    this.hiddenAccount = true;
    this.hideProcess = true;
    this.documentService.getFileReportViewAccountTTPL(this.processId, item).subscribe(data => {
      this.openPDF(data);
      this.hideProcess = false;
    }, () => {
      this.hideProcess = true;
    });
  }
  openAccountTTPLDoc(item: any): void {
    this.hideLoad = true;
    this.documentService.getFileReportViewAccountTTPLDoc(this.processId, item).subscribe(data => {
      this.openPDF2(data, "Phụ lục thông tin thỏa thuận pháp lý");
      this.hideLoad = false;
    }, () => {
      this.hideLoad = true;
    });
  }
  openAccountGuardian(): void {
    this.hiddenAccount = true;
    this.hideProcess = true;
    this.documentService.getFileReportViewAccountGuardian(this.processId).subscribe(data => {
      this.openPDF(data);
      this.hideProcess = false;
    }, () => {
      this.hideProcess = true;
    });
  }
  openAccountGuardianDoc(): void {
    this.hideLoad = true;
    this.documentService.getFileReportViewAccountGuardianDoc(this.processId).subscribe(data => {
      this.openPDF2(data, "Đăng ký người đại diện pháp luật");
      this.hideLoad = false;
    }, () => {
      this.hideLoad = true;
    });
  }
  openUpdate(item: any, data: any, accountIdTemp: any): void {
    this.hideProcess = true;
    this.hiddenAccount = true;
    this.documentService.getFileReportAccountUpdate(this.processId, item, this.customerCode, data, accountIdTemp).subscribe(data => {
      this.openPDF(data);
      this.hideProcess = false;
    }, () => {
      this.hideProcess = true;
    });
  }
  openUpdateThe(item: any, data: any, accountIdTemp: any): void {
    this.hideProcess = true;
    this.hiddenAccount = true;
    this.documentService.getFileReportAccountUpdateThe(this.processId, item, this.customerCode, data, accountIdTemp).subscribe(data => {
      this.openPDF(data);
      this.hideProcess = false;
    }, () => {
      this.hideProcess = true;
    });
  }
  openUpdateDocThe(item: any, data: any, accountIdTemp: any): void {
    this.hideLoad = true;
    this.documentService.getFileReportAccountUpdateDocThe(this.processId, item, this.customerCode, data, accountIdTemp).subscribe(data => {
      this.openPDF2(data, "Yêu cầu trợ giúp KHCN");
      this.hideLoad = false;
    }, () => {
      this.hideLoad = true;
    });
  }
  openUpdateDocTK(item: any, data: any, accountIdTemp: any): void {
    this.hideLoad = true;
    this.documentService.getFileReportAccountUpdateDocTK(this.processId, item, this.customerCode, data, accountIdTemp).subscribe(data => {
      this.openPDF2(data, "Yêu cầu trợ giúp KHCN");
      this.hideLoad = false;
    }, () => {
      this.hideLoad = true;
    });
  }
  openUpdateDoc(item: any, data: any, accountIdTemp: any): void {
    this.hideLoad = true;
    this.documentService.getFileReportAccountUpdateDoc(this.processId, item, this.customerCode, data, accountIdTemp).subscribe(data => {
      this.openPDF2(data, "Yêu cầu trợ giúp KHCN");
      this.hideLoad = false;
    }, () => {
      this.hideLoad = true;
    });
  }

  openPDF2(data, nameDoc): void {
    var file = new Blob([data], { type: 'application/pdf' })
    var fileURL = URL.createObjectURL(file);
    // window.open(fileURL); 
    var a = document.createElement('a');
    a.href = fileURL;
    a.download = nameDoc + '.doc';
    document.body.appendChild(a);
    a.click();
  }
  openProcessDoc(): void {
    this.hideLoad = true;
    if (this.profession === 'STUDENT') {
      this.documentService.getFileReportViewAccountSVDoc(this.processId, null).subscribe(data => {
        this.openPDF2(data, "Đăng ký thông tin Khách hàng");
        this.hideLoad = false;
      }, () => {
        this.hideLoad = true;
      });
    }
    else {
      this.documentService.getFileViewDoc(this.processId).subscribe(data => {
        this.openPDF2(data, "Đăng ký thông tin Khách hàng gửi tiết kiệm");
        this.hideLoad = false;
      }, () => {
        this.hideLoad = true;
      });
    }
  }
}
