<template>
    <q-btn icon="o_translate" flat dense>
        <q-popup-proxy>
            <q-list dense>
                <q-item clickable v-close-popup v-for="obj in langOptions" :key="obj"  @click="langChange(obj.value)" :active="locale==obj.value">
                    <q-item-section>
                        <span>{{ obj.label }}</span>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-popup-proxy>
    </q-btn>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { DMSETTINGS} from "src/base/dm";

const {locale} = useI18n({ useScope: "global" });
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


</script>