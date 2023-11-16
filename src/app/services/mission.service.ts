import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MissionService {

  // Observable string sources
  private mission = new Subject<string>();
  private processId = new Subject<string>();
  private showLoading = new Subject<boolean>();

  // Observable string streams
  missionAnnounced$ = this.mission.asObservable();
  processId$ = this.processId.asObservable();
  showLoading$ = this.showLoading.asObservable();


  // Service message commands
  setMission(mission: string): void {
    this.mission.next(mission);
  }

  setProcessId(processId: string): void {
    this.processId.next(processId);
  }

  setLoading(loading: boolean): void {
    this.showLoading.next(loading);
  }

}
