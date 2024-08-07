<template>
    <q-layout view="lHh lpr lFf">
        <q-page-container>
            <q-page class="flex flex-center">
                  <q-card class="row-inline one-login-form">
                    <q-form @submit="login" v-if="!needSelectOrg">
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
                    <q-card-actions vertical>
                        <q-btn v-bind="PassowrdLogin.login">{{ $t("msgLogin") }}</q-btn>
                    </q-card-actions>
                    </q-form>
                    <q-card-section v-if="needSelectOrg">
                        <q-scroll-area>
                            <q-list>
                                
                            </q-list>
                        </q-scroll-area>
                    </q-card-section>
                    <q-card-section>
                        <dmLanguage></dmLanguage>
                        <dmAppearance></dmAppearance>
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

let PassowrdLogin = reactive({
    account: { label: "msgAccount", rules: [val => val && val.length > 0 || t("msgRequiredField")], value: "" },
    passwd: { label: "msgPassword", type: "password", rules: [val => val && val.length > 0 || t("msgRequiredField")], value: "" },
    login: { color: "primary", type: "submit", glossy:true,   },
})

function loginSuccess(rsp){
    let data = rsp.data.jwt
    localStorage.setItem(DMSETTINGS.jwt, data)
    let payload = getLoginInfo(data)
    let org_uuid = payload["org_uuid"]
    if (org_uuid == null){
        needSelectOrg.value=true
    }else{
        dm.router.push("/")
    }    
}


function loginFailed(rsp){
    dm.msgNG({message:"太难过了",caption:rsp.code})
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

onMounted(()=>{
    
})


</script>



<style>

.one-login-form {
    border-radius: 15px;
    width: 330px;
    height: 350px;
}
</style>