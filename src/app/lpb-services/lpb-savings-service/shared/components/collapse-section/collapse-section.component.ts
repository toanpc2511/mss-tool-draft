import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-collapse-section',
  templateUrl: './collapse-section.component.html',
  styleUrls: ['./collapse-section.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out')),
    ]),
  ],
})
export class CollapseSectionComponent implements OnInit, OnChanges {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  @Input() openAllCollapse = 0;
  @Input() showSectionBreak = true;

  @Input() showArrow = true;
  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.openAllCollapse && !changes.openAllCollapse.firstChange) {
      this.openCollapse();
    }
  }

  onClickCollapseButton() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  openCollapse() {
    this.collapsed = false;
    this.collapsedChange.emit(false);
  }
}
