<template>
    <q-layout view="hHh Lpr lFf">
      <q-header>
        <q-toolbar>
          <q-toolbar-title >
            {{ $t("msgSysUC") }}
          </q-toolbar-title>
          <div><dmLanguage></dmLanguage></div>
          <div><dmAppearance></dmAppearance></div>
          <div><dmUserAvatar></dmUserAvatar></div>
          <div class="q-ma-sm">
            <q-avatar class="dm-avatar" >
              <img :src="userInfo.avatar">
              <q-popup-proxy>
                <q-list dense>
                  <q-item clickable>
                    <q-item-section>
                      <span class="ellipsis">{{userInfo.nick_name}}</span>
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
      <q-page-container>
        <q-page padding>
            冬奥冬奥
        </q-page>
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>
  import { useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import { reactive,onMounted } from "vue";
  import { DMOBJ } from "src/base/dm";
  import dmLanguage from "src/components/dmLanguage.vue";
  import dmAppearance from "src/components/dmAppearance.vue";
  import dmUserAvatar from "src/components/dmUserAvatar.vue";
  
  const dm = new DMOBJ(useQuasar(),useRouter())
  let userInfo = reactive({
    nick_name:"NickName",
    avatar: "https://demos.pixinvent.com/materialize-vuejs-admin-template/demo-2/images/avatars/avatar-1.png",
  })

  function logout(){
    dm.logout()
  }
  
  function getUserProfile(){
    dm.get("/auth/org_user",null,null,(rsp)=>{
      userInfo.nick_name =  rsp.data.user_name
      if (rsp.data.avatar){
        userInfo.avatar = rsp.data.avatar
      }
    })
  }
  
  
  onMounted(()=>{
    getUserProfile()
  })
  
  
  </script>  
  <style>
  .dm-avatar {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  </style>