import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AUTHORIZED_PERSON,
  CO_OWNER,
  LEGAL_REPRESENTATIVE,
  UDF,
} from '../../shared/models/saving-basic';

@Injectable({
  providedIn: 'root',
})
export class ExtendInfoService {
  private authorizedPersonsSubject = new BehaviorSubject<AUTHORIZED_PERSON[]>(
    []
  );
  private legalRepresentativeSubject = new BehaviorSubject<
    LEGAL_REPRESENTATIVE[]
  >([]);
  private coOwnersSubject = new BehaviorSubject<CO_OWNER[]>([]);
  private udfSubject = new BehaviorSubject<UDF>(undefined);
  constructor() {}

  // #region coOwners
  get coOwners(): Observable<CO_OWNER[]> {
    return this.coOwnersSubject.asObservable();
  }
  setCoOwners(items: CO_OWNER[]): void {
    this.set<CO_OWNER>(items, this.coOwnersSubject);
  }
  addCoOwner(item: CO_OWNER): void {
    this.add<CO_OWNER>(item, this.coOwnersSubject);
  }
  editCoOwner(item: CO_OWNER): void {
    this.edit<CO_OWNER>(item, this.coOwnersSubject);
  }
  deleteCoOwner(item: CO_OWNER): void {
    this.delete<CO_OWNER>(item, this.coOwnersSubject);
  }
  // #endregion coOwners

  // #region legalRepresentativeSubject
  get legalRepresentative(): Observable<LEGAL_REPRESENTATIVE[]> {
    return this.legalRepresentativeSubject.asObservable();
  }
  setLegalRepresentative(items: LEGAL_REPRESENTATIVE[]): void {
    this.set<LEGAL_REPRESENTATIVE>(items, this.legalRepresentativeSubject);
  }
  editLegalRepresentative(item: LEGAL_REPRESENTATIVE): void {
    this.edit<LEGAL_REPRESENTATIVE>(item, this.legalRepresentativeSubject);
  }
  deleteLegalRepresentative(item: LEGAL_REPRESENTATIVE): void {
    this.delete<LEGAL_REPRESENTATIVE>(item, this.legalRepresentativeSubject);
  }
  // #endregion legalRepresentativeSubject

  // #region authorizedPersons
  get authorizedPersons(): Observable<AUTHORIZED_PERSON[]> {
    return this.authorizedPersonsSubject.asObservable();
  }
  setAuthorizedPersons(items: AUTHORIZED_PERSON[]): void {
    this.set<AUTHORIZED_PERSON>(items, this.authorizedPersonsSubject);
  }
  addAuthorizedPersons(item: AUTHORIZED_PERSON): void {
    this.add<AUTHORIZED_PERSON>(item, this.authorizedPersonsSubject);
  }
  editAuthorizedPersons(item: AUTHORIZED_PERSON): void {
    this.edit<AUTHORIZED_PERSON>(item, this.authorizedPersonsSubject);
  }
  deleteAuthorizedPersons(item: AUTHORIZED_PERSON): void {
    this.delete<AUTHORIZED_PERSON>(item, this.authorizedPersonsSubject);
  }
  // #endregion authorizedPersons

  // #region udf
  get udf(): Observable<UDF> {
    return this.udfSubject.asObservable();
  }
  setUdf(item: UDF): void {
    this.udfSubject.next(item);
  }
  addUDF(item: UDF): void {
    this.udfSubject.next({ ...this.udfSubject.value, ...item });
  }
  // #endregion udf

  get savingExtendInfo(): Observable<{
    coOwners: CO_OWNER[];
    authorizedPersons: AUTHORIZED_PERSON[];
    udf: UDF;
    legalRepresentative: LEGAL_REPRESENTATIVE[];
  }> {
    return combineLatest([
      this.coOwners,
      this.authorizedPersons,
      this.udf,
      this.legalRepresentative,
    ]).pipe(
      map(([coOwners, authorizedPersons, udf, legalRepresentative]) => ({
        coOwners: this.removeIndex<CO_OWNER>(coOwners),
        authorizedPersons:
          this.removeIndex<AUTHORIZED_PERSON>(authorizedPersons),
        legalRepresentative:
          this.removeIndex<LEGAL_REPRESENTATIVE>(legalRepresentative),
        udf,
      }))
    );
  }

  clearAll() {
    this.coOwnersSubject.next([]);
    this.authorizedPersonsSubject.next([]);
    this.legalRepresentativeSubject.next([]);
    this.udfSubject.next(undefined);
  }

  private set<T extends { index?: number }>(
    items: T[],
    subject: BehaviorSubject<T[]>
  ): void {
    console.log('set', items);

    if (items?.length) {
      subject.next(items.map((e, i) => ({ ...e, index: i + 1 })));
    } else {
      subject.next([]);
    }
  }
  private add<T extends { index?: number }>(
    item: T,
    subject: BehaviorSubject<T[]>
  ): void {
    if (!item) {
      return;
    }
    const lastIndex = Math.max(
      ...(subject.getValue()?.length
        ? subject.getValue().map((e) => e.index || 0)
        : [0])
    );
    subject.next([
      ...subject.getValue(),
      { ...item, index: (lastIndex || 0) + 1 },
    ]);
  }
  private edit<T extends { index?: number }>(
    item: T,
    subject: BehaviorSubject<T[]>
  ): void {
    const newItems = subject.getValue()?.map((e: any) => {
      if (e.index === item.index) {
        return item;
      }
      return e;
    });
    subject.next([...newItems]);
  }
  private delete<T extends { index?: number }>(
    item: T,
    subject: BehaviorSubject<T[]>
  ): void {
    if (!item) {
      return;
    }
    const filtered = subject.getValue()?.filter((e) => e.index !== item.index);
    subject.next([...filtered]);
  }

  private removeIndex<T extends { index?: any }>(items: T[]): T[] {
    return items.map((item) => {
      const { index, ...newItem } = item;
      return newItem as T;
    });
  }
}
