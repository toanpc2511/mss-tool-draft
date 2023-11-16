import { Router } from "@angular/router";

const handleValueFormSearch = (router: Router, key, formSearch) => {
    let currentUrl = router.url;
    let previewUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl.toString();
    if (previewUrl && previewUrl.includes(currentUrl)) {
        const valueFormSearch = JSON.parse(sessionStorage.getItem(key));
        if (valueFormSearch) {
            formSearch.setValue(valueFormSearch);
            return true;
        }
    } else {
        sessionStorage.removeItem(key);
    }

    return false;
}

const setItemStorageForm = (key, formGroup) => {
    sessionStorage.setItem(key, JSON.stringify(formGroup.getRawValue()));
}

const setItemStorageForm2 = (key, formGroup, fromDate, toDate) => {
    const form = formGroup.getRawValue();
    const value = { form, fromDate, toDate };
    sessionStorage.setItem(key, JSON.stringify(value));
}

const isBackRouter = (router: Router, key) => {
    let currentUrl = router.url;
    let previewUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl.toString();    // Chỉ chạy ở constructor
    if (previewUrl && previewUrl.includes(currentUrl)) {
        return true;
    }
    sessionStorage.removeItem(key);
    return false;
}

export const handleBackRouter = {
    handleValueFormSearch,
    setItemStorageForm,
    setItemStorageForm2,
    isBackRouter,
}