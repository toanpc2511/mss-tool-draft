import { IListBillInfo, IRuleResponses, ISupplierFormGroups } from "../models/water.interface";

const handlePaymentMethod = (row: IListBillInfo, supplierFormGroups: ISupplierFormGroups[], dataSource: IListBillInfo[]) => {
    //UNI-RULE1: Gần nhất - xa nhất
    //UNI-RULE2: Xa nhất - gần nhất    
    let error = true;
    let message = "Không cho phép tạo thanh toán vì vi phạm quy tắc thanh toán";
    let periodType = supplierFormGroups.find(x => x["code"] === "UNI-FORMGROUP1");
    if (!periodType) {
        message = "Không có rule quy tắc thanh toán";
        return { error: error, message: message };
    }
    let periodTypeDetail = periodType["ruleResponses"].find(x => x.selected);
    if (!periodTypeDetail) {
        message = "Không có quy tắc thanh toán";
        return { error: error, message: message };
    }
    if (periodTypeDetail["code"] === "UNI-RULE1") {
        let rowError: any
        if (row["checked"]) {
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` < `${row.billCode}${formatDay(row.billId)}` && !x.checked && x !== row)
        } else {
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` > `${row.billCode}${formatDay(row.billId)}` && x.checked && x !== row)
        }

        if (rowError) {
            return { error: error, message: message };
        }
    }
    if (periodTypeDetail["code"] === "UNI-RULE2") {
        let rowError: any
        if (row["checked"]) {
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` > `${row.billCode}${formatDay(row.billId)}` && !x.checked && x !== row)
        } else {
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` < `${row.billCode}${formatDay(row.billId)}` && x.checked && x !== row)
        }

        if (rowError) {
            return { error: error, message: message };
        }
    }
    error = false;
    return { error: error, message: message };
}

const handlePeriodPaymentType = (row: IListBillInfo, periodPaymentType: IRuleResponses, dataSource: IListBillInfo[]) => {
    //UNI-RULE1: Gần nhất - xa nhất
    //UNI-RULE2: Xa nhất - gần nhất    
    let error = true;
    let message = "Không cho phép tạo thanh toán vì vi phạm quy tắc thanh toán";
    if (periodPaymentType["code"] === "UNI-RULE1") {
        let rowError: any
        if (row["checked"]) {
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` < `${row.billCode}${formatDay(row.billId)}` && !x.checked && x !== row)
        } else {
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` > `${row.billCode}${formatDay(row.billId)}` && x.checked && x !== row)
        }

        if (rowError) {
            return { error: error, message: message };
        }
    }
    if (periodPaymentType["code"] === "UNI-RULE2") {
        let rowError: any
        if (row["checked"]) {
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` > `${row.billCode}${formatDay(row.billId)}` && !x.checked && x !== row)
        } else {
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` < `${row.billCode}${formatDay(row.billId)}` && x.checked && x !== row)
        }

        if (rowError) {
            return { error: error, message: message };
        }
    }
    error = false;
    return { error: error, message: message };
}

const handleCheckedAllPeriodType = (periodPaymentType: IRuleResponses, dataSource: IListBillInfo[], startRowOfPage: number, endRowOfPage: number, isChecked: boolean) => {
    //UNI-RULE1: Gần nhất - xa nhất
    //UNI-RULE2: Xa nhất - gần nhất    
    let error = true;
    let message = "Không cho phép tạo thanh toán vì vi phạm quy tắc thanh toán";
    if (periodPaymentType["code"] === "UNI-RULE1") {
        let rowError: any
        if (isChecked) {
            let row = dataSource[startRowOfPage - 1]
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` < `${row.billCode}${formatDay(row.billId)}` && !x.checked && x !== row)
        } else {
            let row = dataSource[endRowOfPage - 1]
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` > `${row.billCode}${formatDay(row.billId)}` && x.checked && x !== row)
        }

        if (rowError) {
            return { error: error, message: message };
        }
    }
    if (periodPaymentType["code"] === "UNI-RULE2") {
        let rowError: any
        if (isChecked) {
            let row = dataSource[endRowOfPage - 1]
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` > `${row.billCode}${formatDay(row.billId)}` && !x.checked && x !== row)
        } else {
            let row = dataSource[startRowOfPage - 1]
            rowError = dataSource.find(x => `${x.billCode}${formatDay(x.billId)}` < `${row.billCode}${formatDay(row.billId)}` && x.checked && x !== row)
        }

        if (rowError) {
            return { error: error, message: message };
        }
    }
    error = false;
    return { error: error, message: message };
}
//
const formatDay = (day) => {
    return +day < 10 ? ("0" + day) : day
}
//
const order = (dt, orderBy) => {
    let sortBy: any[] = getArrOrderFromString(orderBy);
    dt.sort(function (a, b) {
        let i = 0,
            result = 0;
        while (i < sortBy.length && result === 0) {
            result =
                sortBy[i].direction *
                (a[sortBy[i].prop] < b[sortBy[i].prop]
                    ? -1
                    : a[sortBy[i].prop] > b[sortBy[i].prop]
                        ? 1
                        : 0);
            i++;
        }
        return result;
    });
};

const getArrOrderFromString = (orderBy: string) => {
    let arrSortBy = orderBy.split(',');
    let sortBy: any[] = [];
    for (const row of arrSortBy) {
        let arrProp = row.trim().split(' ');
        let rowSortby = {};
        rowSortby['prop'] = arrProp[0];
        if (arrProp.length == 1) {
            rowSortby['direction'] = 1;
        } else {
            rowSortby['direction'] = -1;
        }
        sortBy.push(rowSortby);
    }
    return sortBy;
};
//  
const isRoleGDV = () => {
    const role = localStorage.getItem("userRole")
    if (role) {
        if (JSON.parse(role).code === "UNIFORM.BANK.GDV") {
            return true;
        }
    }
    return false;
}

const dateToString = (date: Date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return formatDay(day) + "/" + formatDay(month) + "/" + year;
}

const dateToStringDate = (date: Date, typeFormat: string) => {
    const [day, month, year] = [date.getDate(), date.getMonth() + 1, date.getFullYear()];
    if (typeFormat.toLowerCase() === "dd/mm/yyyy") {
        return `${formatDay(day)}/${formatDay(month)}/${year}`;
    }
    if (typeFormat.toLowerCase() === "yyyy-mm-dd") {
        return `${year}-${formatDay(month)}-${formatDay(day)}`;
    }
    const [hour, minute, second] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    if (typeFormat.toLowerCase() === "dd/mm/yyyy hh:mm:ss") {
        return `${formatDay(day)}/${formatDay(month)}/${year} ${formatDay(hour)}:${formatDay(minute)}:${formatDay(second)}`;
    }
    return `${year}-${formatDay(month)}-${formatDay(day)} ${formatDay(hour)}:${formatDay(minute)}:${formatDay(second)}`;
}

export const ultils = { order, formatDay, isRoleGDV, dateToString, dateToStringDate }