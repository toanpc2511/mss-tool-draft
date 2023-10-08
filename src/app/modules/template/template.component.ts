import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
})
export class TemplateComponent implements OnInit {
  documents: any[] = [];
  selected: any[] = [];
  @ViewChild('gridTempalte') selectContainer: any;

  constructor() {}

  ngOnInit(): void {
    for (let x = 1; x <= 17; x++) {
      for (let y = 1; y <= 12; y++) {
        this.documents.push({
          id: `coordinates-${x}-${y}`,
          name: `x:${x} y:${y}`,
        });
      }
    }
    setTimeout(() => {
      this.selectContainer.selectItems(
        (item: any) => item.id === 'coordinates-1-2'
      );

      this.selectContainer.toggleItems((item: any) =>
        ['coordinates-4-4', 'coordinates-4-5'].includes(item.id)
      );
    });
  }

  onSelected($event: any): void {
    console.log('onSelected', $event);
  }
  onSelectedEnd($event: any[]): void {
    console.log('onSelectedEnd', $event);
  }

  onDeleteSelected($event: any): void {
    console.log($event);
  }

  disableItemSelected($event: any): boolean {
    return $event.id === 'coordinates-1-2 ';
  }
}
