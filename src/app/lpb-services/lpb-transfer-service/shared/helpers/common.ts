import { DateHelper } from "src/app/shared/utilites/date-helper";
import { DOC_TYPES } from "../constants/common";
import { TextHelper } from "src/app/shared/utilites/text";

export function getIssuePlace(issueDateStr: string, docType: string, userInfo: any) {
  if (!docType) {
    return '';
  }

  switch (docType) {
    case DOC_TYPES.CCCD: {
      const lowDate = DateHelper.getDateFromString('01/01/2016');
      const highDate = DateHelper.getDateFromString('10/10/2018');
      const issueDate = DateHelper.getDateFromString(issueDateStr);
      if (!issueDate) {
        return '';
      }

      if (issueDate >= lowDate && issueDate < highDate) {
        return 'CCS ĐKQL CT VA DLQG VE DC';
      } else if (issueDate >= highDate) {
        return 'CCS QLHC VE TTXH';
      } else {
        return '';
      }
    }

    case DOC_TYPES.CMND: {
      let txt = TextHelper.latinNormalize(`CONG AN ${userInfo?.cityName}`);
      return txt.toUpperCase();
    }

    case DOC_TYPES.PASSPORT: {
      return `CUC QUAN LY XNC`;
    }

    default: {
      return '';
    }
  }
}
