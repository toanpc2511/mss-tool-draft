export class LpbDatatableColumn {
  headerName?: string;
  headerProperty?: string;
  headerIndex?: number;
  width?: string;
  type?: string;
  className?: string;
  customStyleTick?: ICustomStyleTick;
  tooltipProperty?: string;
  hidden?: boolean;
  bgColor?: (row, columnName) => string;
  innerHtml?: boolean;
}

export interface ICustomStyleTick {
  property: string;
  valueProperty: IValueProperty[];
}

export interface IValueProperty {
  value: string;
  class: string;
}
