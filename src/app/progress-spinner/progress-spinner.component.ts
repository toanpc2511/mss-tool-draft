import { Component, Input, OnInit, ViewChild, TemplateRef, ViewContainerRef, DoCheck } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
declare var $: any;

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent {
  @Input() color?: ThemePalette;
  @Input() diameter?: number = 100;
  @Input() mode?: ProgressSpinnerMode;
  @Input() strokeWidth?: number;
  @Input() value?: number;
  ngAfterViewInit(){
    let totalHeight = document.documentElement.scrollTop + document.documentElement.scrollHeight
    // let totalHeight = window.innerHeight;
    let cssHeight = totalHeight +"px"
    $( ".sq-global-backdrop" ).attr("style", "height:"+cssHeight);
    $( ".mat-progress-spinner" ).attr("style", `top: ${window.innerHeight/2}px`);
  }
}
