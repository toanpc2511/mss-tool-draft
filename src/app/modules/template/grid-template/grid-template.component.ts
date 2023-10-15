import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
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

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    iconRegistry.addSvgIcon(
      'apple',
      sanitizer.bypassSecurityTrustResourceUrl('assets/apple-icon.svg')
    );
    iconRegistry.addSvgIcon(
      'windows',
      sanitizer.bypassSecurityTrustResourceUrl('assets/windows-icon.svg')
    );
  }

  ngOnInit() {
    this.generateLayout();
  }

  // generate grid layout
  generateLayout(): void {
    const numberCol = 12;
    const numberRow = 10;
    for (let y = 1; y <= numberRow; y++) {
      for (let x = 1; x <= numberCol; x++) {
        this.elements.push({
          id: `${x}-${y}`,
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
    const elFirst = this.handleCoordinates(this.elementsSelected[0]);
    const elLast = this.handleCoordinates(this.elementsSelected.slice(-1)[0]);
    const el = {
      id: this.elementsSelected[0].id,
      name: `${this.elementsSelected[0].name}/${
        this.elementsSelected.slice(-1)[0].name
      }`,
      disabled: true,
      cols: elLast.x - elFirst.x + 1,
      rows: elLast.y - elFirst.y + 1,
      img: 'assets/bg.jpeg',
    };
    this.elements.splice(
      this.elements.indexOf(this.elementsSelected[0]),
      0,
      el
    );
    this.elements = this.elements.filter(
      (el) => !this.elementsSelected.includes(el)
    );
    // console.log(this.elements);

    this.cdr.detectChanges();
  }

  deleteLayout(value: IElement): void {
    console.log(value);
    const indexKey = value.name.indexOf('/');
    const elFirst = this.handleCoordinates(value.name.slice(0, indexKey));
    const elLast = this.handleCoordinates(value.name.slice(indexKey + 1));
    this.elements.splice(this.elements.indexOf(value), 1);
    const newArr: IElement[] = [];
    for (let y = elFirst.y; y <= elLast.y; y++) {
      for (let x = elFirst.x; x <= elLast.x; x++) {
        newArr.push({
          id: `${x}-${y}`,
          name: `${x}-${y}`,
          disabled: false,
          cols: 1,
          rows: 1,
          img: '',
        });
      }
    }
    // this.elements = this.elements.concat(newArr)
    this.elements = this.sortData(this.elements.concat(newArr));

    // this.elements = this.elements.filter((el) => el.name !== value.name);
    this.cdr.detectChanges();
  }

  // event selected
  onSelectedEnd($event: any[]): void {
    this.elementSelected.emit(this.sortData($event));
  }

  sortData(data: IElement[]): IElement[] {
    const result = data.sort(
      (a, b) =>
        this.handleCoordinates(a).x - this.handleCoordinates(b).x ||
        this.handleCoordinates(a).y - this.handleCoordinates(b).y
    );
    return result;
  }

  // Xử lý toạ độ element
  handleCoordinates(data: IElement | string): { x: number; y: number } {
    const indexKey =
      typeof data === 'string' ? data.indexOf('-') : data.id.indexOf('-');
    if (typeof data !== 'string') {
      return {
        x: Number(data.id.slice(0, indexKey)),
        y: Number(data.id.slice(indexKey + 1)),
      };
    }
    return {
      x: Number(data.slice(0, indexKey)),
      y: Number(data.slice(indexKey + 1)),
    };
  }
}

export interface IElement {
  id: string;
  name: string;
  cols: number;
  rows: number;
  img: string;
  disabled: boolean;
}
