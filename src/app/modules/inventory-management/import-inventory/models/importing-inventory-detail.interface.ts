export interface IImportingInventoryDetail {
    id: number;
    code: string;
    representativeTakeName: string;
    importedWarehouseName: string;
    importedWarehouseAddress: string;
    representativeGiveName: string;
    exportedWarehouseName: string;
    exportedWarehouseAddress: string;
    driverName: string;
    licensePlates: string;
    importRequestId: string;
    status: string;
    orderForm: string;
    internalCar: boolean;
    wareHouseOrderProductResponses: IWareHouseOrderProduct[];
}

export interface IWareHouseOrderProduct {
  id: number;
  importProductId: number;
  gasFieldInId: number;
  gasFieldOutId: number;
  supplierId: number;
  productName: string;
  unit: string;
  amountActually: number;
  gasFieldOutName: string;
  compartment: string;
  gasFieldInName: string;
  price: number;
  supplierName: string;
  intoMoney: number;
  amountRecommended: number;
  treasurerRecommend: number;
  temperatureExport: number;
  quotaExport: number;
  quotaImport: number;
  capLead: number;
  capValve: number;
  temperatureImport: number;
  difference: string;
  recommend: number;
}
