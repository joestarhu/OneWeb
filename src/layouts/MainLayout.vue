<template>
  <q-layout view="hHh Lpr lFf">
      <q-header :class="Dark.isActive?'bg-dark text-white':'bg-white text-grey-9'" bordered> 
      <q-toolbar class="q-pa-md">
        <img src="/icons/favicon-32x32.png" />
        <q-toolbar-title>ONE</q-toolbar-title>
        <q-space />
          <div class="q-gutter-sm row-inline">
            <dmAppearance/>
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
                    <q-item-label>{{ $t("msgLogout")}}</q-item-label>
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
import { useQuasar,Dark } from "quasar"
import { useRouter } from "vue-router"
import {ref,onMounted} from "vue"
import { getLoginInfo } from "src/base/security"
import { DMOBJ, DMSETTINGS } from "src/base/dm"
import dmMenu from "components/dmMenu.vue"
import dmLanguage from "components/dmLanguage.vue"
import dmAppearance from "components/dmAppearance.vue"

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
  one:{
    title:"msgSysUC",children:[
      {title:"msgMenuAccount",to:"/account",icon:"o_person"},
      {title:"msgMenuOrg",to:"/org",icon:"o_corporate_fare"},
      {title:"msgMenuApp",to:"/app",icon:"o_widgets"},
    ]
  },
})

function logout(){
  dm.logout()
}

function initData(){
  // 用户信息加载
  let loginInfo = getLoginInfo()
  if(loginInfo != null){
    let userInfoValue = userInfo.value
    userInfoValue.nick_name = loginInfo["user"]["nick_name"]
  }
}


onMounted(()=>{
  initData()
})


</script>

<style>
.dm-avatar {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
