import * as moment from "moment";

export class AccountAuthor {
  accountId: string;

  constructor(accountAuthor: any = null) {
    if (!accountAuthor) return;
    this.accountId = accountAuthor.id;

  }

}
