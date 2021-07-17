export class FilterField<T> {
  field: T;
  constructor(field: T) {
    this.field = field;
  }

  setFilterFieldValue(fieldValue: any) {
    for (const key in this.field) {
      this.field[key] = fieldValue;
    }
  }
}
