
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

const checkInvalid = (formGroup, arrayControl) => {
    for (const control of arrayControl) {
        if (formGroup.get(control)?.invalid) {
         return true;
        }        
    }
    return false;
}

export const utils = { order, formatDay, isRoleGDV, dateToString, dateToStringDate, checkInvalid }