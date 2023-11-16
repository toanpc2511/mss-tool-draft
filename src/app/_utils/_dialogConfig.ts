// import { CompilerConfig } from '@angular/compiler';
import {MatDialogConfig} from '@angular/material/dialog';
import {ObjConfigPopup} from './_objConfigPopup';

const dialogConfig = new MatDialogConfig();

export class DialogConfig {

  static configSearchInfoCustom(): MatDialogConfig {
    dialogConfig.width = '800px';
    dialogConfig.position = {};
    dialogConfig.height = '35%';
    return dialogConfig;
  }

  static configAddOrDetailUser(data): MatDialogConfig {
    dialogConfig.width = '900px';
    dialogConfig.position = {};
    dialogConfig.data = {data};
    dialogConfig.height = 'unset';
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  static configDialog(data): MatDialogConfig {
    dialogConfig.width = '750px';
    dialogConfig.height = 'unset';
    dialogConfig.position = {
      top: '70px'
    };
    dialogConfig.data = {data};
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  static configDialogSearch(data): MatDialogConfig {
    dialogConfig.width = '800px';
    dialogConfig.height = 'unset';
    dialogConfig.position = {
      top: '70px'
    };
    dialogConfig.data = {data};
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  static configDialogDataCard(): MatDialogConfig {
    dialogConfig.width = '1000px';
    dialogConfig.height = 'unset';
    dialogConfig.position = {
      top: '70px'
    };
    dialogConfig.data = {};
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  static configDialogConfirm(data): MatDialogConfig {
    dialogConfig.width = '650px';
    dialogConfig.height = 'unset';
    dialogConfig.position = {
      top: '70px'
    };
    dialogConfig.data = {data};
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  static configDialogConfirmDeleteAccount(data): MatDialogConfig {
    dialogConfig.width = '630px';
    dialogConfig.height = 'unset';
    dialogConfig.position = {
      top: '70px'
    };
    dialogConfig.data = {data};
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  static configDialogHistory(data): MatDialogConfig {
    dialogConfig.width = '600px';
    dialogConfig.height = 'unset';
    dialogConfig.position = {
      top: '150px'
    };
    dialogConfig.data = {data};
    dialogConfig.disableClose = false;
    return dialogConfig;
  }

  static configDiaCardDelete(data): MatDialogConfig {
    dialogConfig.width = '515px';
    dialogConfig.height = '210px';
    dialogConfig.position = {
      top: '150px'
    };
    dialogConfig.data = {data};
    dialogConfig.disableClose = false;
    return dialogConfig;
  }
  static configDiaSupCardDelete(data): MatDialogConfig {
    dialogConfig.width = '500px';
    dialogConfig.height = '195px';
    dialogConfig.position = {
      top: '150px'
    };
    dialogConfig.data = {data};
    dialogConfig.disableClose = false;
    return dialogConfig;
  }
  static configDiaEbankDelete(data): MatDialogConfig {
    dialogConfig.width = '776px';
    dialogConfig.height = '195px';
    dialogConfig.position = {
      top: '150px'
    };
    dialogConfig.data = {data};
    dialogConfig.disableClose = false;
    return dialogConfig;
  }
  static configDiaEbankDeadTroy(data): MatDialogConfig {
    dialogConfig.width = '776px';
    dialogConfig.height = '195px';
    dialogConfig.position = {
      top: '150px'
    };
    dialogConfig.data = {data};
    dialogConfig.disableClose = false;
    return dialogConfig;
  }
  // static configInfomationPopupCIF(data) {
  //     dialogConfig.width = '1000px'
  //     dialogConfig.position = {top: '50px'}
  //     dialogConfig.data = { data }
  //     dialogConfig.disableClose = true
  //     return dialogConfig
  // }
  static configPopupCif(dataConfig: ObjConfigPopup): MatDialogConfig {
    const data = dataConfig.data !== undefined && dataConfig.data !== '' ? dataConfig.data : null;
    dialogConfig.width = dataConfig.px;
    dialogConfig.position = {
      top: dataConfig.position_top !== undefined && dataConfig.position_top !== '' ? dataConfig.position_top : undefined
    };
    dialogConfig.data = {
      data,
      isViewMode: dataConfig.isViewMode
    };
    dialogConfig.height = 'unset';
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
}
