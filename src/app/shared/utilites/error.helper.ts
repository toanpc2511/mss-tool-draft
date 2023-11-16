export const ErrorCodes = {
  TIME_OUT: '5019',
  VERSION: '4000',
  REVERSE: '5006',
  NOT_FOUND: '4002'
};

export class ErrorHelper {
  static isTimeoutError(errorCode: string) {
    return errorCode && errorCode.match(new RegExp(ErrorCodes.TIME_OUT, 'g'));
  }

  static isVersionError(errorCode) {
    return errorCode && errorCode.match(new RegExp(ErrorCodes.VERSION, 'g'));
  }

  static isReverseError(errorCode) {
    return errorCode && errorCode.match(new RegExp(ErrorCodes.REVERSE, 'g'));
  }

  static isNotFoundError(errorCode) {
    return errorCode && errorCode.match(new RegExp(ErrorCodes.NOT_FOUND, 'g'));
  }
}
