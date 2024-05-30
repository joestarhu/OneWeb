import { boot } from 'quasar/wrappers'
import { Dark } from "quasar"
import { DMSETTINGS } from "src/base/dm"

export default boot(({ app }) => {
    // 主题色的导入
    const mode = localStorage.getItem(DMSETTINGS.appearance) || "false"

    switch (mode) {
        case "auto":
            Dark.set(mode)
            break;
        case "true":
            Dark.set(true)
            break;
        case "false":
            Dark.set(false)
            break
        default:
            break;
    }
})




