declare var $: any;
export class PermissionName {

    static returnPermissionName(index: any) {
        let permissionName: string
        if (index == 0) {
            permissionName = 'SYS_MANAGEMENT_USER'
        } else
            if (index == 1) {
                permissionName = 'SYS_MANAGEMENT_TITLE'
            } else
                if (index == 2) {
                    permissionName = 'SYS_MANAGEMENT_ROLE'
                } else
                    if (index == 3) {
                        permissionName = 'SYS_MANAGEMENT_FUNCTION'
                    } else
                        if (index == 4) {
                            permissionName = 'SYS_MANAGEMENT_ACTION'
                        } else
                            if (index == 5) {
                                permissionName = 'SYS_MANAGEMENT_ROLE_MAPPING'
                            }
        return permissionName
    }
    static returnIndex() {
        let i: any
        let element = $('.checkPermission')
        element.each(function (index) {
            let p = $(this).attr('permission-data')
            if (i === undefined || i === null) {
                if (p === "SYS_MANAGEMENT_USER") {
                    i = 0
                    return
                } else if (p === "SYS_MANAGEMENT_TITLE") {
                    i = 1
                    return
                } else if (p === "SYS_MANAGEMENT_ROLE") {
                    i = 2
                    return
                } else if (p === "SYS_MANAGEMENT_FUNCTION") {
                    i = 3
                    return
                } else if (p === "SYS_MANAGEMENT_ACTION") {
                    i = 4
                    return
                } else if (p === "SYS_MANAGEMENT_ROLE_MAPPING") {
                    this.i = 5
                    return
                }
            }
        })
        return i
    }
    static checkPermissionAdmin(permissions: any) {
        let e = $('.view-inform')
        e.each(function (index) {
            let p = $(this).attr('permission-data')
            if (!permissions.includes(p)) {
                $(this).hide()
            }
        })
    }
}