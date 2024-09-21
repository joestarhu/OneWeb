<template>
    <q-layout view="lHh lpr lFf">
        <q-page-container>
            <q-page class="flex flex-center">
                <q-card class="absolute-top-right q-ma-md q-pa-sm">
                    <dmLanguage class="q-ml-sm"></dmLanguage>
                    <dmAppearance class="q-mx-sm"></dmAppearance>
                </q-card>
                

                  <q-card class="row-inline one-login-form">
                    <q-form @submit.prevent="login" v-if="!needSelectOrg">
                    <q-card-section class="q-pa-md q-gutter-sm">
                        <p class="text-center text-h6 text-bold">{{ $t("msgLogin") }}</p>
                        <q-input v-bind="PassowrdLogin.account" v-model="PassowrdLogin.account.value">
                            <template #label>{{ $t(PassowrdLogin.account.label) }}</template>
                            <template #prepend>
                                <q-icon name="o_person"></q-icon>
                            </template>
                        </q-input>
                        <q-input type="password" v-bind="PassowrdLogin.passwd" v-model="PassowrdLogin.passwd.value">
                            <template #label>{{ $t(PassowrdLogin.passwd.label) }}</template>
                            <template #prepend>
                                <q-icon name="o_password"></q-icon>
                            </template>
                        </q-input>
                    </q-card-section>
                    <q-card-actions>
                        <q-btn v-bind="PassowrdLogin.login" class="full-width">{{ $t("msgLogin") }}</q-btn>
                    </q-card-actions>
                    </q-form>
                    <q-card-section v-if="needSelectOrg">
                        <p class="text-center text-h6 text-bold">{{ $t("msgOrgChoose") }}</p>
                        <q-scroll-area style="height: 210px;" visible>
                            <q-list bordered separator v-if="userOrgs.length != 0" dense>
                                    <q-item clickable v-ripple @click="orgChoice(org.org_uuid)" v-for="org in userOrgs"
                                        :key="org" class="text-left">
                                        <q-item-section avatar><q-avatar icon="o_corporate_fare"></q-avatar></q-item-section>
                                        <q-item-section>{{ org.org_name }}</q-item-section>
                                    </q-item>
                            </q-list>
                            <p class="absolute-center text-bold" v-if="userOrgs.length == 0">{{ $t("msgNoData") }}</p>
                        </q-scroll-area>
                    </q-card-section>
                    <q-card-section class="row">
                        <div class="col">
                            <q-btn flat dense color="primary">{{ $t("msgAccountCreate")}}</q-btn>
                        </div>
                        <div class="col row reverse">
                            <q-btn icon="qr_code" flat  v-if="!needSelectOrg" dense></q-btn>
                            <q-btn icon="logout" flat @click="logout" v-if="needSelectOrg" dense></q-btn>
                        </div>
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>


<script setup>
import { useI18n } from 'vue-i18n';
import { ref,reactive,onMounted } from 'vue';
import { useQuasar} from 'quasar';
import { useRouter } from 'vue-router';
import { DMOBJ, DMSETTINGS } from 'src/base/dm';
import { encryptString, getLoginInfo } from 'src/base/security';
import dmLanguage from 'src/components/dmLanguage.vue';
import dmAppearance from 'src/components/dmAppearance.vue';

const { t } = useI18n()
const dm = new DMOBJ(useQuasar(),useRouter())
let needSelectOrg = ref(false)
const userOrgs = ref([])

let PassowrdLogin = reactive({
    account: { label: "msgAccount", rules: [val => val && val.length > 0 || t("msgRequiredField")], value: "" },
    passwd: { label: "msgPassword", type: "password", rules: [val => val && val.length > 0 || t("msgRequiredField")], value: "" },
    login: { color: "primary", type: "submit"},
})

function loginSuccess(rsp){
    let data = rsp.data.jwt
    localStorage.setItem(DMSETTINGS.jwt, data)
    let payload = getLoginInfo(data)
    let org_uuid = payload["org_uuid"]
    if (org_uuid == null){
        needSelectOrg.value=true
        getUserOrgs()
    }else{
        dm.router.push("/")
    }    
}


function loginFailed(rsp){
    dm.msgNG({message:rsp.message,caption:rsp.code})
}

function login(){
    // 密码登录
    let passwd_enc = encryptString(PassowrdLogin.passwd.value);
    let url = "/auth/password";
    let postData = {
        account: PassowrdLogin.account.value,
        password_enc: passwd_enc
    }

    dm.post(url, postData, PassowrdLogin.login,loginSuccess,loginFailed)
}

function logout(){
    needSelectOrg.value=false
    dm.logout()
}

function getUserOrgs() {
    // 获取用户的组织信息
    dm.get("/auth/org", null, null, (rsp) => {
        userOrgs.value = rsp.data
    })
}

function orgChoice(org_uuid){
    dm.post("/auth/org",{org_uuid:org_uuid},null,loginSuccess,loginFailed)
}


onMounted(()=>{
    let payload =getLoginInfo()
    if(payload !=null && payload["org_uuid"] == null){
        needSelectOrg.value=true
        getUserOrgs()
    }
})


</script>



<style>

.one-login-form {
    border-radius: 15px;
    width: 330px;
    height: 350px;
}
</style>