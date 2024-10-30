<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :style="Dark.isActive?'background-color: #182334;':'background-color: #FFF; color:#34373c'" bordered>
      <!-- <q-header> -->
      <q-toolbar>
        <q-btn dense flat icon="o_menu" @click="leftDrawerOpen=!leftDrawerOpen"></q-btn>
        <q-space></q-space>
        <div class="gt-md"><dmLanguage></dmLanguage></div>
        <div class="gt-md"><dmAppearance></dmAppearance></div>
        <div class="q-px-sm"><dmUserAvatar></dmUserAvatar></div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" :style="Dark.isActive?'background-color: #182334;':'background-color: #FFF;'" bordered>
      <div class="q-py-sm q-ma-sm text-bold text-h5 row items-center">
        <span class="menu-title">{{ $t("msgSysUC") }}</span>
      </div>

      <q-list class="q-my-sm q-mr-sm q-gutter-xs">
        <dmMenu v-for="link in menuList" :key="link.title" v-bind="link"></dmMenu>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <!-- <q-ajax-bar color="primary" size="0.5rem" position="bottom"></q-ajax-bar> -->
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
import { Dark } from "quasar";


const dm = new DMOBJ(useQuasar(),useRouter())
const leftDrawerOpen = ref(false)

const menuList = reactive({
  oneManager:{
    title:"",
    children:[
      {title:"msgMenuAccount",to:"/account",icon:"o_person"},
      {title:"msgMenuRole",to:"/role",icon:"o_contact_emergency"},
      {title:"msgMenuApp",to:"/app",icon:"o_widgets"},
      {title:"msgMenuOrg",to:"/org",icon:"o_corporate_fare"},
    ]
  },
  // one:{
  //   title:"",
  //   children:[
  //     {title:"msgAccount",to:"/role",icon:"o_contact_emergency"},      
  //   ]
  // }

})
</script>

<style>
.menu-title{
  /* background: linear-gradient(45deg,#5f72bd 0%, #9b23ea 100%); */
  /* background:linear-gradient(120deg,#84fab0 0%, #8fd3f4 100%); */
  /* background:linear-gradient(120deg,#a6c0fe 0%, #f68084 100%); */
  /* background:linear-gradient(-225deg,#AC32E4 0%, #7918F2 48%, #4801FF 100%); */
  background:linear-gradient(225deg,#65379B 0%, #886AEA 53%, #6457C6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}


.body--light{
  background-color: #f9f9f9;
}
</style>