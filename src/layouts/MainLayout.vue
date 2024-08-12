<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title >
          {{ $t("msgSysUC") }}
        </q-toolbar-title>
        <div><q-btn icon="apps" dense flat to="/applist"></q-btn></div>
        <div><dmLanguage></dmLanguage></div>
        <div><dmAppearance></dmAppearance></div>
        <div class="q-px-sm"><dmUserAvatar></dmUserAvatar></div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above bordered>
      <q-list class="q-ma-md q-gutter-xs">
        <dmMenu v-for="link in menuList" :key="link.title" v-bind="link"></dmMenu>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"
import { ref,reactive,onMounted } from "vue";
import { DMOBJ, DMSETTINGS } from "src/base/dm";
import dmLanguage from "src/components/dmLanguage.vue";
import dmAppearance from "src/components/dmAppearance.vue";
import dmUserAvatar from "src/components/dmUserAvatar.vue";
import dmMenu from "src/components/dmMenu.vue";


const dm = new DMOBJ(useQuasar(),useRouter())

const menuList = reactive({
  one:{
    title:"",
    children:[
      {title:"msgMenuAccount",to:"/one/account",icon:"o_person"},
      {title:"msgMenuOrg",to:"/one/org",icon:"o_corporate_fare"},
      {title:"msgMenuRole",to:"/one/role",icon:"o_contact_emergency"},
      {title:"msgMenuApp",to:"/one/app",icon:"o_widgets"},
    ]
  },
})
</script>