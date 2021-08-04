export type SortDirection = 'asc' | 'desc' | '' | 'ASC' | 'DESC';

export interface ISortState {
  column: string;
  direction: SortDirection;
}

export class SortState implements ISortState {
  column = '';
  direction: SortDirection = 'asc'; // asc by default;
}
