import { PaymentPeroidType, PaymentPriority, PaymentType } from "../enums/PaymentType";

import { Injectable } from '@angular/core';
import { FormMessageService } from "./form-message.service";

@Injectable()
export class LpbTableService {
    constructor(private formMessageService: FormMessageService) { }

    handleClickCheckRow = (
        event: any,
        row: any,
        selection: any,
        dataSource: any[],
        paymentRule: any,
    ) => {
        const curSelect = selection.isSelected(row);
        let rowError;
        let hasRowError = false;
        let message = ""
        const idxRow = dataSource.indexOf(row);
        if (paymentRule.paymentPriority === "PRIORITY_ELECTRIC") {
            if (curSelect) {
                if (paymentRule["priorityBillType"].includes(row["billType"])) {
                    // Bỏ tích nếu dòng tích thuộc loại được ưu tiên thì phải 
                    // kiểm tra xem có hóa đơn ko ưu tiên được check chưa
                    // Kiểm tra xem có dòng sau được check chưa                    
                    if (selection.isSelected(dataSource[idxRow + 1])) {
                        message = "Bạn phải thanh toán hóa đơn ưu tiên trước và thanh toán theo thứ tự !";
                        event.preventDefault();
                        this.formMessageService.openMessageWarning(message);
                        return;
                    }
                    rowError = dataSource.find(
                        (x) => !paymentRule["priorityBillType"].includes(x["billType"]) && selection.isSelected(x)
                    );
                }
            } else {
                if (paymentRule["priorityBillType"].includes(row["billType"])) {
                    // Tích nếu dòng tích thuộc loại được ưu tiên thì phải                 
                    // Kiểm tra xem có dòng trước chưa được check không                    
                    if (idxRow !== 0 && !selection.isSelected(dataSource[idxRow - 1])) {
                        message = "Bạn phải thanh toán hóa đơn ưu tiên trước và thanh toán theo thứ tự !";
                        event.preventDefault();
                        this.formMessageService.openMessageWarning(message);
                        return;
                    }
                } else {
                    // Tích nếu dòng tích thuộc loại không được ưu tiên thì phải                 
                    // Kiểm tra xem có dòng thuộc loại hóa đơn ưu tiên chưa được check không
                    rowError = dataSource.find(
                        (x) => paymentRule["priorityBillType"].includes(x["billType"]) && !selection.isSelected(x)
                    );
                }
            }
            if (rowError) {
                message = "Bạn phải thanh toán hóa đơn ưu tiên trước !";
                event.preventDefault();
                this.formMessageService.openMessageWarning(message);
                return;
            }
        }
        if (paymentRule.paymentPriority === "PRIORITY_EVN_ELECTRIC") {
            message = "Bạn phải thanh toán theo thứ tự sắp xếp của EVN !";
            if (curSelect) {
                if (selection.isSelected(dataSource[idxRow + 1])) {
                    hasRowError = true;
                }
            } else {
                if (idxRow !== 0 && !selection.isSelected(dataSource[idxRow - 1])) {
                    hasRowError = true;
                }
            }
            if (hasRowError) {
                event.preventDefault();
                this.formMessageService.openMessageWarning(message);
                return;
            }
        }
        //
    };

    handleCheckedRowChange = (
        totalAmount: number,
        paymentContent: string,
        checked: boolean,
        row: any,
        fieldAmount: string,
        fieldContent: string,
        paymentContentStart: string
    ) => {
        if (totalAmount === 0) {
            paymentContent = paymentContentStart;
        }
        if (checked) {
            totalAmount += +row[fieldAmount];
            paymentContent += ` ${row[fieldContent]}`;
        } else {
            totalAmount -= +row[fieldAmount];
            paymentContent = paymentContent.replace(
                ` ${row[fieldContent]}`,
                ''
            );
        }
        if (totalAmount === 0) {
            paymentContent = '';
        }
        return { totalAmount, paymentContent };
    };

    getTotalAmountAndPaymentContent = (
        selecteds: any[],
        paymentContentStart: string,
        fieldAmount: string,
        fieldContent: string
    ) => {
        let totalAmount = 0;
        let paymentContent = '';
        for (const row of selecteds) {
            totalAmount += +row[fieldAmount];
            paymentContent += ` ${row[fieldContent]}`;
        }
        if (paymentContent) {
            paymentContent = `${paymentContentStart}${paymentContent}`;
        }
        return { totalAmount, paymentContent };
    };

    handleClickCheckRow2 = (
        event: any,
        row: any,
        selection: any,
        dataSource: any[],
        paymentRule: any,
        fieldBillCycle: string,
    ) => {
        const curSelect = selection.isSelected(row);
        let rowError;
        let message = "";
        if (paymentRule.paymentType === PaymentType.PART) {
            if (!curSelect) {
                if (selection.selected.length > 0) {
                    message = "Bạn chỉ được chọn một hóa đơn !";
                    event.preventDefault();
                    this.formMessageService.openMessageWarning(message);
                    return;
                }
            }
        }
        if (paymentRule.paymentType === PaymentType.ALL_OR_PART) {
            message = "Bạn chỉ được chọn một hóa đơn hoặc toàn bộ hóa đơn !";
            if (!curSelect) {
                if (selection.selected.length > 0 && selection.selected.length !== dataSource.length - 1) {
                    event.preventDefault();
                    this.formMessageService.openMessageWarning(message);
                    return;
                }
            } else {
                if (selection.selected.length > 2) {
                    event.preventDefault();
                    this.formMessageService.openMessageWarning(message);
                    return;
                }
            }
        }
        //
        if (paymentRule.paymentPeroidType === PaymentPeroidType.NEAR_TO_FAR) {
            message = "Bạn phải chọn hóa đơn từ gần nhất đến xa nhất !"
            if (!curSelect) {
                rowError = dataSource.find(
                    (x) => x[fieldBillCycle] > row[fieldBillCycle] && !selection.isSelected(x)
                );
            } else {
                rowError = dataSource.find(
                    (x) => x[fieldBillCycle] < row[fieldBillCycle] && selection.isSelected(x)
                );
            }
        }
        if (paymentRule.paymentPeroidType === PaymentPeroidType.FAR_TO_NEAR) {
            message = "Bạn phải chọn hóa đơn từ xa nhất đến gần nhất !";
            if (!curSelect) {
                rowError = dataSource.find(
                    (x) => x[fieldBillCycle] < row[fieldBillCycle] && !selection.isSelected(x)
                );
            } else {
                rowError = dataSource.find(
                    (x) => x[fieldBillCycle] > row[fieldBillCycle] && selection.isSelected(x)
                );
            }
        }
        if (rowError) {
            event.preventDefault();
            this.formMessageService.openMessageWarning(message);
        }
    };
}