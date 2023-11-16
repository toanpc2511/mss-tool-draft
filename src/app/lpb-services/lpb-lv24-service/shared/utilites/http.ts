import { ERROR_CODES_DIALOG } from '../constants/common';

export const errorNeedShowByDialog = (errorCode: string): boolean => {
  return Object.values(ERROR_CODES_DIALOG).some(
    (e) => `uni01-00-${e}` === errorCode
  );
};
