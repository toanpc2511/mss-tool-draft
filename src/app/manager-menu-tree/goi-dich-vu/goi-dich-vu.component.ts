import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-goi-dich-vu',
  templateUrl: './goi-dich-vu.component.html',
  styleUrls: ['./goi-dich-vu.component.css']
})
export class GoiDichVuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('.childName').html('Gói dịch vụ');
  }

}
