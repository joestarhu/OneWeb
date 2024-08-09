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
import dmMenu from "src/components/dmMenu.vue";

const dm = new DMOBJ(useQuasar(),useRouter())
let userInfo = reactive({
  nick_name:"NickName",
  avatar: "https://demos.pixinvent.com/materialize-vuejs-admin-template/demo-2/images/avatars/avatar-1.png",
})


const menuList = reactive({
  one:{
    title:"",
    children:[
      {title:"msgMenuAccount",to:"/account",icon:"o_person"},
      {title:"msgMenuOrg",to:"/org",icon:"o_corporate_fare"},
      {title:"msgMenuApp",to:"/app",icon:"o_widgets"},
    ]
  },
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



<!-- <script>
import { defineComponent, ref } from 'vue'
import dmLanguage from 'src/components/dmLanguage.vue'
import dmAppearance from 'src/components/dmAppearance.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    dmAppearance,
    dmLanguage
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script> -->


<style>
.dm-avatar {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>