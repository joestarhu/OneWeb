<template>
    <q-btn :icon="icon" flat dense>
        <q-popup-proxy>
            <q-list dense>
                <q-item clickable v-close-popup v-for="obj in Options" :key="obj" @click="appearanceChange(obj)"
                    :active="Dark.mode == obj.value">
                    <q-item-section avatar>
                        <q-icon :name="obj.icon" />
                    </q-item-section>
                    <q-item-section>
                        <span>{{ $t(obj.label) }}</span>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-popup-proxy>
    </q-btn>
</template>

<script>
import { Dark } from "quasar"
import { defineComponent, ref } from "vue"
import { DMSETTINGS } from "src/base/dm"

export default defineComponent({
    name: "dmAppearance",
    setup(props, ctx) {
        const Options = [
            { label: "msgModeLight", value: false, icon: "o_light_mode" },
            { label: "msgModeDark", value: true, icon: "o_dark_mode" },
            { label: "msgModeAuto", value: "auto", icon: "o_devices" },
        ]
        const icon = ref(get_icon())

        function appearanceChange(obj) {
            // 客户端持久化模式
            localStorage.setItem(DMSETTINGS.appearance, obj.value);

            // 切换模式.切换icon
            Dark.set(obj.value)
            icon.value = obj.icon
        }

        function get_icon() {
            // 默认值
            let result = Options[0].icon

            for (let one of Options) {
                if (one.value === Dark.mode) {
                    result = one.icon
                    break
                }
            }
            return result
        }


        return {
            icon,
            Dark,
            Options,
            appearanceChange,
        }
    }
})
</script>