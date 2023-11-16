import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-for-approval.component',
  templateUrl: './send-for-approval.component.html',
  styleUrls: ['./send-for-approval.component.css']
})
export class SendForApprovalComponent implements OnInit {
    constructor(private router: Router) { 
      }
    ngOnInit() {
    }
    send(){
      this.router.navigate(['./smart-form/processRequest']);
    }
}