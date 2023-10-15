import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grid-template',
  templateUrl: './grid-template.component.html',
  styleUrls: ['./grid-template.component.scss'],
})
export class GridTemplateComponent implements OnInit {
  title = 'template';
  selectOnClick = true;
  selectOnDrag = true;
  selectMode = false;
  disable = false;
  disableRangeSelection = false;
  isDesktop = false;
  selectWithShortcut = false;
  dragOverItems = true;
  disableEvenItems = true;
  elements: IElement[] = [];
  elementsSelected: IElement[] = [];
  @Output() elementSelected: EventEmitter<any[]> = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.generateLayout();
  }

  // generate grid layout
  generateLayout(): void {
    const numberCol = 12;
    const numberRow = 10;
    let index = 1;
    for (let y = 1; y <= numberRow; y++) {
      for (let x = 1; x <= numberCol; x++) {
        this.elements.push({
          id: index++,
          x: x,
          y: y,
          name: `${x}-${y}`,
          disabled: false,
          cols: 1,
          rows: 1,
          img: '',
        });
      }
    }
  }

  //
  onLoadLayout(): void {
    const elFirst = this.elementsSelected[0];
    const elLast = this.elementsSelected.slice(-1)[0];

    const elNew: IElement = {
      id: elFirst.id,
      name: `${elFirst.name}/${elLast.name}`,
      x: elFirst.x,
      y: elFirst.y,
      cols: elLast.x - elFirst.x + 1,
      rows: elLast.y - elFirst.y + 1,
      disabled: true,
      img: 'assets/bg.jpeg',
    };
    this.elements.splice(this.elements.indexOf(elFirst), 0, elNew);
    this.elements = this.elements.filter(
      (el) => !this.elementsSelected.includes(el)
    );
  }

  deleteLayout(value: IElement): void {
    const indexKey = value.name.indexOf('/');
    const elFirst = this.handleCoordinates(value.name.slice(0, indexKey));
    const elLast = this.handleCoordinates(value.name.slice(indexKey + 1));
    this.elements.splice(this.elements.indexOf(value), 1);
    const newArr: IElement[] = [];
    for (let y = elFirst.y; y <= elLast.y; y++) {
      for (let x = elFirst.x; x <= elLast.x; x++) {
        newArr.push({
          id: (y - 1) * 12 + x,
          name: `${x}-${y}`,
          x: x,
          y: y,
          disabled: false,
          cols: 1,
          rows: 1,
          img: '',
        });
      }
    }
    this.elements = this.sortData(this.elements.concat(newArr));
  }

  // event selected
  onSelectedEnd($event: any[]): void {
    this.elementSelected.emit(this.sortData($event));
  }

  sortData(data: IElement[]): IElement[] {
    return data.sort((a, b) => a.id - b.id);
  }

  // Xử lý toạ độ element
  handleCoordinates(data: string): { x: number; y: number } {
    const indexKey = data.indexOf('-');
    return {
      x: Number(data.slice(0, indexKey)),
      y: Number(data.slice(indexKey + 1)),
    };
  }
}

export interface IElement {
  id: number;
  name: string;
  cols: number;
  rows: number;
  img: string;
  disabled: boolean;
  x: number;
  y: number;
}
