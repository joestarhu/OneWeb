<template>
<q-layout>
    <q-page-container>
        <q-page class="one-bg flex flex-center">
            <div class="one-language">
                <dmLanguage></dmLanguage>
                <dmAppearance></dmAppearance>
            </div>
            <q-card :class="Dark.isActive?'one-login-form-dark text-white text-center q-pa-md':'one-login-form text-grey-9 text-center q-pa-md'" >
                <div v-if="!selectedOrg">
                    <q-card-section>
                        <div class="text-h6 text-bold">WELCOME</div>
                    </q-card-section>

                    <q-form class="q-pb-md" @submit="passwordLogin">
                    <q-card-section class="row-inline col">
                        <q-input v-bind="viewLogin.account" v-model="viewLogin.account.value">
                            <template #label>{{ t(viewLogin.account.label) }}</template>
                                <template #prepend>
                                    <q-icon name="o_person"></q-icon>
                                </template>
                            </q-input>
                            <q-input v-bind="viewLogin.passwd" v-model="viewLogin.passwd.value">
                                <template #label>
                                    {{ t(viewLogin.passwd.label) }}
                                </template>
                                <template #prepend>
                                    <q-icon name="o_password"></q-icon>
                                </template>
                            </q-input>
                    </q-card-section>
                    <q-card-actions vertical>
                        <q-btn v-bind="viewLogin.login">{{ t("msgLogin") }}</q-btn>
                    </q-card-actions>
                    </q-form>
            </div>
            <div v-else>
                <q-card-section>
                    <div class="text-h6 text-bold">
                        <q-btn icon="logout" flat @click="logout"></q-btn>
                        WELCOME
                    </div>
                    <q-list bordered separator>
                        <q-item>
                        </q-item>
                        <q-item>B</q-item>
                    </q-list>
                </q-card-section>
            </div>
            </q-card>
        </q-page>
    </q-page-container>
</q-layout>
</template>


<script setup>
import { useI18n } from "vue-i18n"
import { useQuasar,Dark } from "quasar"
import { useRouter } from "vue-router"
import { ref, onMounted} from "vue"
import { DMOBJ, DMSETTINGS } from "src/base/dm"
import { encryptString,getLoginInfo } from "src/base/security"
import dmLanguage from "src/components/dmLanguage.vue"
import dmAppearance from "src/components/dmAppearance.vue"

const { t } = useI18n()
const dm = new DMOBJ(useQuasar(),useRouter())
// 是否需要选择组织信息
const selectedOrg = ref(false)

const viewLogin = ref({
    account:{label:"msgAccount",rules: [val => val && val.length > 0 || t("msgRequiredField")],value:""},
    passwd:{label:"msgPassword",type:"password",rules: [val => val && val.length > 0 || t("msgRequiredField")],value:""},
    login:{color:"primary", type:"submit"},
})


function loginSuccess(rsp){
    let data = rsp.data
    localStorage.setItem(DMSETTINGS.jwt,data)
    let payload = getLoginInfo(data)
    let org = payload["org"]
    // 判断用户组织状态是否已经确定
    if(org.org_id == null){
        // 未选定组织信息 需要选取组织
        selectedOrg.value=true
    }else{
        // 已选定组织信息
        dm.router.push("/")
    }    
}

function logout(){
    selectedOrg.value=false
    dm.logout()
}



function passwordLogin(){
    // 密码登录
    let viewLoginRef = viewLogin.value;
    let passwd_enc = encryptString(viewLoginRef.passwd.value);
    let url = "/auth/password";
    let postData = {
        account:viewLoginRef.account.value,
        password_enc:passwd_enc
    }

    dm.post(url,postData,viewLoginRef.login,loginSuccess)
}


onMounted(()=>{
    // 获取登录用户信息
    let payload = getLoginInfo()
    if(payload !=null){
        selectedOrg.value=true
    }    
})
</script>

<style>
.one-bg{
    background-image:linear-gradient(135deg,#a8edea 0%, #fed6e3 100%);
}

.one-language{
    position:absolute;
    top:1rem;
    right:5rem;
}

.one-login-form{
    /* background-color: rgba(255, 255, 255, 0.2); */
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    width: 330px;
    height: 420px;
}

.one-login-form-dark{
    /* background-color: rgba(255, 255, 255, 0.2); */
    background-color: rgba(48, 51, 78, 1);
    border-radius: 10px;
    width: 330px;
    height: 420px;
}

.one-lang-icon{
    position: absolute;
    top:30;
    right:20;
}

</style>