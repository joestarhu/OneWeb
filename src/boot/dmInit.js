import { boot } from "quasar/wrappers"
import { Dark } from "quasar"
import { DMSETTINGS } from "src/base/dm"


export default boot(({ app }) => {
    const appearance = localStorage.getItem(
        DMSETTINGS.appearance
    ) || "auto";

    switch (appearance) {
        case "auto":
            Dark.set(appearance);
            break;
        case "true":
            Dark.set(true);
            break;
        case "false":
            Dark.set(false);
            break;
        default:
            // should not be here
            Dark.set("auto");
            break;

    }

})