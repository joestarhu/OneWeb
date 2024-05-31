<template>
<q-layout>
    <q-page-container>
        <q-page class="one-bg flex flex-center">
            <dmLanguage class="one-language"></dmLanguage>
            <q-card class="one-login-form text-center q-pa-md">
                <q-card-section>
                    <div class="text-h6 text-bold">WELCOME</div>
                </q-card-section>


                <q-form class="q-pb-md" @submit="passwordLogin" >
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
                    <q-btn v-bind="viewLogin.login">
                            {{ t("msgLogin") }}
                    </q-btn>
                </q-card-actions>
                </q-form>
            </q-card>
        </q-page>
    </q-page-container>
</q-layout>
</template>


<script setup>
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"
import { useRouter } from "vue-router"
import { ref} from "vue"
import { DMOBJ, DMSETTINGS } from "src/base/dm"
import { encryptString } from "src/base/security"
import dmLanguage from "src/components/dmLanguage.vue"

const { t } = useI18n()
const dm = new DMOBJ(useQuasar(),useRouter())

const viewLogin = ref({
    account:{label:"msgAccount",rules: [val => val && val.length > 0 || t("msgRequiredField")],value:""},
    passwd:{label:"msgPassword",type:"password",rules: [val => val && val.length > 0 || t("msgRequiredField")],value:""},
    login:{color:"primary", type:"submit"},
})


function loginSuccess(rsp){
    localStorage.setItem(DMSETTINGS.jwt,rsp.data)
    dm.router.push("/")
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
    background-color: rgba(255, 255, 255, 0);
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