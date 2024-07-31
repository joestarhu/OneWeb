import { ref } from 'vue';
import { api } from '../boot/axios'


// 全局的宏定义
const DMSETTINGS = {
    // 语言
    locale: "user-locale",
    // jwt
    jwt: "jwt",
    // 分页大小
    pageSize: "pageSize",
    // 外观颜色
    appearance: "appearance",

    // dmInput
    dmInputAppendRequired: 0,
    dmInputAppendQuery: 1,
}

// 信息弹窗样式
const MSG_BASE_OPTS = { timeout: 3000, position: "top", progress: true, classes: "glossy" };
const MSG_OK_OPTS = { ...MSG_BASE_OPTS, type: "positive" };
const MSG_NG_OPTS = { ...MSG_BASE_OPTS, type: "negative" };

class DMOBJ {
    constructor(quasarObj, routerObj) {
        // 构造函数
        this.obj = quasarObj;
        this.router = routerObj;
    }

    logout() {
        // 通用退出操作
        localStorage.removeItem(DMSETTINGS.jwt);
        this.router.push("/login");
    }

    msgOK(opts) {
        // quasar正常系的通知提醒
        this.obj.notify({ ...MSG_OK_OPTS, ...opts })
    }

    msgNG(opts) {
        // quasar正常系的通知提醒
        this.obj.notify({ ...MSG_NG_OPTS, ...opts })
    }

    apiOK(rsp, cbFn = null, errFn = null) {
        // 请求API成功,返回200
        let data = rsp.data

        if (data.code == 0) {
            cbFn ? cbFn(data) : 0
        } else {
            errFn ? errFn(data) : this.msgNG({ message: data.message })
        }

    }

    apiNG(err) {

        // 请求未返回的错误
        if (!err.response) {
            this.msgNG({ message: err.message })
            return
        }

        switch (err.response.status) {
            case 401:
                this.msgNG({ message: "用户未授权认证或授权已过期,请重新登录" })
                this.logout()
                break;
            case 403:
                this.msgNG({ message: "无操作权限", caption: err.message })
                break;
            default:
                this.msgNG({ message: "请求服务失败,请稍后重试", caption: err.message })
                break;
        }
    }

    async httpReq(url, data, actLoading = null, callbackFn = null, errCallbackFn = null, method = "get") {
        /* 异步HTTP请求

        Args:
            url:请求URL
            data:请求数据
            actLoading:请求控件(带loading属性)
            callbackFn:请求成功的回调函数
            errCallbackFn:请求失败的回调函数 (业务异常,200状态码)
            method:请求方式get或post
        */

        if (actLoading != null) {
            actLoading.loading = true
        }

        try {
            let rsp = null
            if (method == "get") {
                rsp = await api.get(url, { params: data })
            } else {
                rsp = await api.post(url, data)
            }
            // 回调函数实现
            this.apiOK(rsp, callbackFn, errCallbackFn)
        } catch (err) {
            this.apiNG(err)
        }

        if (actLoading != null) {
            actLoading.loading = false
        }

    }

    async post(url, data, actLoading = null, callbackFn = null, errCallbackFn = null) {
        // post请求
        await this.httpReq(url, data, actLoading, callbackFn, errCallbackFn, "post")
    }

    async get(url, data, actLoading = null, callbackFn = null, errCallbackFn = null) {
        // get请求
        await this.httpReq(url, data, actLoading, callbackFn, errCallbackFn)
    }
}

const DMINPUT = {
    // 普通输入
    text: (qProps, value = null) => {
        let params = { outlined: true, "lazy-rules": true, hint: "", dense: true, ...qProps }
        return ref({ dmType: "text", qProps: params, value: value })
    },
    // 必填普通输入
    text_required: (qProps, value = null) => {
        let params = { outlined: true, "lazy-rules": true, hint: "", dense: true, ...qProps }
        return ref({ dmType: "text", dmAppend: DMSETTINGS.dmInputAppendRequired, qProps: params, value: value })
    },
    // 查询输入
    test_query: (qProps, value = null) => {
        let params = { debounce: 500, dense: true, clearable: true, style: "width:265px;", outlined: true, ...qProps }
        // let params = { standout: "bg-secondary text-white", debounce: 500, dense: true, clearable: true, style: "width:265px;", ...qProps }
        return ref({ dmType: "text", dmAppend: DMSETTINGS.dmInputAppendQuery, qProps: params, value: value })
    },

    // 选择输入
    select: (qProps, value = null) => {
        let params = { outlined: true, "lazy-rules": true, hint: '', dense: true, ...qProps }
        return ref({ dmType: "select", qProps: params, value: value })
    },
    // 选择查询
    select_query: (qProps, value = null) => {
        let params = { debounce: 500, dense: true, clearable: true, style: "width:265px;", outlined: true, ...qProps }
        return ref({ dmType: "select", qProps: params, value: value })
    },

    // 带筛选的选择输入
    selectFilter: (qProps, value = null) => {
        let params = { outlined: true, "lazy-rules": true, hint: '', dense: true, ...qProps }
        return ref({ dmType: "selectFilter", qProps: params, value: value })
    }
}


const DMBTN = {
    delete: { id: 0, label: "msgDelete", color: "primary", icon: "o_delete" },
    create: { id: 1, label: "msgCreate", color: "primary" },
    edit: { id: 2, label: "msgEdit", color: "primary", icon: "o_edit" },
    confirm: { id: 3, label: "msgConfirm", color: "primary" },
}


function showOptLabel(value, opts) {
    for (let obj of opts) {
        if (obj.value === value) {
            return obj.label
        }
    }
    return ""
}

function setTblCol(field, label, options = null, name = "", align = "left") {
    let format = val => { return val }
    if (!name) {
        name = field
    }

    if (options) {
        format = val => {
            return showOptLabel(val, options)
        }
    }
    return { field: field, name: name, label: label, align: align, format: format }
}

const DMTBL = {
    col: setTblCol,
    btn: (field = "id", label = "msgAction", align = "right") => {
        return setTblCol(field, label, null, "btns", align)
    },
}


export { DMOBJ, DMINPUT, DMBTN, DMTBL, DMSETTINGS }
