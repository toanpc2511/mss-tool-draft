import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ModalActionsService {

  constructor() { }

  // tslint:disable-next-line:typedef
  modalAction(modalData: any) {
    switch (modalData.name) {
      case 'logout':
        this.logout();
        break;

      case 'delete-e-banking-account':
        this.deleteEbankingAccount(modalData);
        break;

      default:
        break;
    }
  }

  // tslint:disable-next-line:typedef
  private logout() {
    // Call an authentication service method to logout the user
    // console.log('logged out');
  }

  // tslint:disable-next-line:typedef
  private deleteEbankingAccount(modalData: any) {
    // Call a service that makes a DELETE HTTP Request to the server for the given e-banking id
    // console.log('ebanking account deleted with id: ' + modalData.eBankingId);
  }
}
