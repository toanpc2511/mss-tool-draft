import { Note } from './note';


export class RegistrableService {
  id: string;
  processId: string;
  typeCode: string;
  typeName: string;
  statusCode: string;
  statusName: string;
  title: string;
  priority: string;
  dwItemId: string;
  msgId: string;
  msgBody: string;
  sendDate: string;
  receiveDate: string;
  createdDate: string;
  modifiedDate: string;
  note: Note[];

  constructor(service) {
    this.id = service.id;
    this.processId = service.processId;
    this.typeCode = service.typeCode;
    this.typeName = service.typeName;
    this.statusCode = service.statusCode;
    this.statusName = service.statusName;
    this.title = service.title;
    this.priority = service.priority;
    this.dwItemId = service.dwItemId;
    this.msgId = service.msgId;
    this.msgBody = service.msgBody;
    this.sendDate = service.sendDate;
    this.receiveDate = service.receiveDate;
    this.createdDate = service.createdDate;
    this.modifiedDate = service.modifiedDate;
    this.note = service.note;
  }

}
