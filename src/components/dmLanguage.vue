<template>
    <q-btn icon="language" flat dense>
        <q-popup-proxy>
            <q-list dense>
                <q-item clickable v-close-popup v-for="obj in langOptions" :key="obj"  @click="langChange(obj.value)" :disable="locale==obj.value" :active="locale==obj.value">
                    <q-item-section>
                        <span>{{ obj.label }}</span>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-popup-proxy>
    </q-btn>
</template>

<script>
import { useI18n } from "vue-i18n";
import { defineComponent,ref} from "vue";
import { DMSETTINGS} from "src/boot/dm";

export default defineComponent({
    name:"dmLanguage",
    setup(){
        const { locale } = useI18n({ useScope: "global" });

        const langOptions = [
            {label:"中文(简体)",value:"zh-CN"},
            {label:"English",value:"en-US"},
        ]

        function langChange(lang){
            // 切换语言
            locale.value = lang
            // 客户端持久化语言
            localStorage.setItem(DMSETTINGS.locale,lang);
        }

        return{
            locale,
            langOptions,
            langChange,
        }
    }
})


</script>