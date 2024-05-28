<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-white text-grey-9" bordered> 
      <q-toolbar>
        <img src="/icons/favicon-32x32.png" />
        <q-toolbar-title>ONE</q-toolbar-title>
        <q-space />
          <div class="q-gutter-sm row-inline">
          <dmLanguage />
          <q-avatar class="dm-avatar">
            <img :src=userInfo.avatar />
            <q-popup-proxy>
              <q-list dense>
                <q-item clickable>
                  <q-item-section>
                    <span>{{ userInfo.nick_name }}</span>
                  </q-item-section>
                </q-item>
                <q-separator />

                <q-item clickable v-close-popup @click="logout">
                  <q-item-section>
                    <q-item-label>{{ $t("msgLogout") }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-popup-proxy>
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered>
      <q-list class="q-ma-md">
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
import {ref,onMounted} from "vue"
import { DMOBJ } from "src/boot/dm"
import dmMenu from "components/dmMenu.vue"
import dmLanguage from "components/dmLanguage.vue"

const dm = new DMOBJ(useQuasar(),useRouter())


const leftDrawerOpen = ref(false)
const userInfo = ref({
  nick_name: "Nick Name",
  avatar: "https://demos.pixinvent.com/materialize-vuejs-admin-template/demo-2/images/avatars/avatar-1.png",
  user_orgs: {},
  login_org_name: "",
  owner_flag:false,
  admin_org:false,
})



const menuList = ref({
  cbam:{title:"",children:[
    {title:"Reporting Data",to:"/cbamdata"},
    // {title:"msgLogin",to:"/123"},
    // {title:"msgLogin",to:"/x"},
  ]},
})


function logout(){
  dm.logout()
}


onMounted(()=>{

})


</script>

<style>
.dm-avatar {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
