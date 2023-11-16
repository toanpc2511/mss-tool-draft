export class ReferenceCif {

  constructor(
    public id: number,
    public customerNo: string,
    public fullName: string,
    public dateOfBirth: string,
    public identifyType: string,
    public identifyCode: string,
    public identifyAddress: string,
    public identifyDate: string,
    public gender: number,
    public phoneNumber: string,
    public nationality: number,
    public relationshipType: number,
    public status: string,
    public editable: number,
    public inEffect: any,
  ) {  }


}
