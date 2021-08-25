export class FilterField<T> {
  field: T;
  constructor(field: T) {
    this.field = field;
  }

  setFilterFieldValue(fieldValue: any) {
    for (const key in this.field) {
      if (key === 'status') {
        continue;
      }
      this.field[key] = fieldValue;
    }
  }
}
