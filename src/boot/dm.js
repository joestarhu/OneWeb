import { ref } from 'vue';
import { api } from './axios'


// 
const DMSETTINGS = {
    locale: "user-locale",
}



// 信息弹窗样式
const MSG_BASE_OPTS = { timeout: 2000, position: "top", progress: true, classes: "glossy" };
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
        localStorage.removeItem('jwt');
        this.router.push('/login');
    }

    msgOK(opts) {
        // quasar正常系的通知提醒
        this.obj.notify({ ...MSG_OK_OPTS, ...opts })
    }

    msgNG(opts) {
        // quasar正常系的通知提醒
        this.obj.notify({ ...MSG_NG_OPTS, ...opts })
    }
}

const DMINPUT = {
    // 普通输入
    text: (qProps, value = null) => {
        let params = { filled: true, "lazy-rules": true, hint: '', dense: false, ...qProps }
        return ref({ dmType: 'text', qProps: params, value: value })
    },
    // 查询输入
    query: (qProps, value = null) => {
        let params = { filled: false, debounce: 500, dense: true, clearable: true, style: 'width:265px;', outlined: true, ...qProps }
        return ref({ dmType: 'query', qProps: params, value: value })
    }
}

export { DMOBJ, DMINPUT, DMSETTINGS }
