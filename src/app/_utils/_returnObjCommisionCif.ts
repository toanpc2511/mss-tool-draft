import { CommissionCif } from '../_models/commision';

export class ObjCommisionCif {
    static objCommisionCif: CommissionCif;
    static returnObjCommisionCif(controlForm: any): CommissionCif {
        this.objCommisionCif = new CommissionCif();
        this.objCommisionCif.id = controlForm.id.value;
        this.objCommisionCif.numberIdentification = controlForm.numberIdentification.value;
        this.objCommisionCif.description = controlForm.description.value;
        this.objCommisionCif.status = controlForm.status.value;
        this.objCommisionCif.assetValue = controlForm.assetValue.value;
        this.objCommisionCif.dateOfAgreement = controlForm.dateOfAgreement.value;
        this.objCommisionCif.nationality = controlForm.nationality.value;
        this.objCommisionCif.fullName = controlForm.fullName.value;
        this.objCommisionCif.dateOfBirth = controlForm.dateOfBirth.value;
        this.objCommisionCif.phone = controlForm.phone.value;
        this.objCommisionCif.numberGTXM = controlForm.numberGTXM.value;
        this.objCommisionCif.issuedBy = controlForm.issuedBy.value;
        this.objCommisionCif.issueDate = controlForm.issueDate.value;
        this.objCommisionCif.obj = controlForm.obj.value;
        this.objCommisionCif.nationality2 = controlForm.nationality2.value;
        this.objCommisionCif.currentProvince = controlForm.currentProvince.value;
        this.objCommisionCif.currentDistrict = controlForm.currentDistrict.value;
        this.objCommisionCif.currentWards = controlForm.currentWards.value;
        this.objCommisionCif.numberHome = controlForm.numberHome.value;
        this.objCommisionCif.idTTPL = controlForm.idTTPL.value;
        this.objCommisionCif.inEffect = controlForm.inEffect.value;
        this.objCommisionCif.PersonInEffect = controlForm.PersonInEffect.value;
        this.objCommisionCif.PersonStatus = controlForm.PersonStatus.value;
        return this.objCommisionCif;
    }
}
