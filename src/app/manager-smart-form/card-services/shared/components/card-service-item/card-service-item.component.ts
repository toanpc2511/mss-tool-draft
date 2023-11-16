import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card-service-item',
  templateUrl: './card-service-item.component.html',
  styleUrls: ['./card-service-item.component.scss']
})
export class CardServiceItemComponent implements OnInit {
  @Input() pathImage: string;
  @Input() textItem: string;
  @Input() urlRouter: string;
  constructor() { }

  ngOnInit(): void {
  }

}
