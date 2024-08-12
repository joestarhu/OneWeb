<template>
    <q-layout view="hHh Lpr lFf">
      <q-header>
        <q-toolbar>
          <q-toolbar-title >
            <q-icon name="corporate_fare"></q-icon>
            {{ orgName }}
          </q-toolbar-title>
          <div><dmLanguage></dmLanguage></div>
          <div><dmAppearance></dmAppearance></div>
          <div class="q-px-sm"><dmUserAvatar></dmUserAvatar></div>
        </q-toolbar>
      </q-header>  

      <q-page-container>
        <q-page padding>
          <div class="q-pa-md row q-gutter-md">
            <q-card class="my-card"  bordered v-for="app in appList" :key="app">
                <q-list class="my-card">
                  <q-item clickable v-bind="app" class="my-card">
                    <q-item-section avatar>
                      <q-icon color="primary" :name="app.icon" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-bold">{{app.name}}</q-item-label>
                      <q-item-label caption>{{ app.caption }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
            </q-card>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
</template>

  
<script setup>
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"
import { ref,reactive,onMounted} from "vue";
import { DMOBJ } from "src/base/dm";
import dmLanguage from "src/components/dmLanguage.vue";
import dmAppearance from "src/components/dmAppearance.vue";
import dmUserAvatar from "src/components/dmUserAvatar.vue";


const dm = new DMOBJ(useQuasar(),useRouter());
const orgName = ref("")

const appList = [
  {icon:"hub", name:"One Manager", caption:"用于维护账号,组织,角色,应用等信息",to:"/one"},
  {icon:"public", name:"One", caption:"统一用户中心;管理用户,角色,部门和权限",to:"/one"},
  {icon:"storage", name:"Data Nexus", caption:"数据治理平台",to:"/one"},
  {icon:"message", name:"Message Center", caption:"消息中心",href:"https://www.baidu.com/"},
]

function getOrgName(){
  dm.get("/auth/org_name",null,null, (rsp)=>{
    orgName.value = rsp.data["org_name"]
  })
}

onMounted(()=>{
  getOrgName()
})


</script>


<style scoped>
.my-card{
  width: 100%;
  max-width: 300px;
  height:65px;
  
}
</style>