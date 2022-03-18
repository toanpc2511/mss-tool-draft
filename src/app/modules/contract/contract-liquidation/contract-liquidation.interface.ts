import {IFile} from "../../../shared/services/file.service";

export interface IContractLiquidation {
  liquidation: ILiquidationDetail[];
  totalLiquidationOfFuel: number;
  storageFee: number;
  otherFees: number;
  totalMoney: number;
  file: IFile[];
  note: string;
  contractId: number;
  creator: string;
  employeeApprove: string;
  dateCreated: string;
  submitDate: string;
  rejectReason: string;
  liquidationStatus: string;
}

export interface ILiquidationDetail {
  id: number;
  name: string;
  totalMoney: number;
  price: number;
  discount: number;
  unit: string;
  theRemainingAmount: number;
  cashLimitOil: number;
  liquidationAmount: number;
  amount: number;
  liquidationUnitPrice: number;
  intoLiquidationMoney: number;
}
