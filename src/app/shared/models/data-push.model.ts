/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import snakecaseKeys from 'snakecase-keys';
export class DataPush {
  data?: any;
  constructor(body: any) {
    this.data = snakecaseKeys(body);
  }
}
