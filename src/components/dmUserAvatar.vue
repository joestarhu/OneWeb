<template>
    <q-avatar class="dm-avatar">
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
</template>

<script setup>
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"
import { reactive,onMounted } from "vue";
import { DMOBJ } from "src/base/dm";

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
