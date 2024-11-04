<template>
<div v-if="pageError"> 
    账号不存在或已被删除
</div>
<div v-else>
    <div class="q-mx-md items-center">
        <span class="text-h6">{{ $t("msgBasicInfo") }}</span>
        <q-btn color="primary" icon="edit" flat dense size="0.8rem" @click="btnClick(DMBTN.edit.id)" v-if="!basicInfo.loading"></q-btn>

        <q-list bordered> 
            <q-item v-for="obj of basicInfo.fields" :key="obj">
                <q-item-section>
                    <q-item-label class="text-grey">
                        {{ $t(obj.label) }}:
                    </q-item-label>
                    <q-item-label>
                        <q-skeleton type="rect" v-if="basicInfo.loading" />
                        <span :style="obj.style" v-else>{{ obj.value_label || obj.value }}</span>
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </div>

    <div class="q-mx-md q-mt-lg">
        <span class="text-h6">{{$t("msgPnlAccountSecurity")}}</span>
        <q-list bordered separator>
            <q-item v-for="obj of securityInfo" :key="obj">
                <q-item-section>
                    <q-item-label class="text-negative text-bold">{{$t(obj.title)}}</q-item-label>
                    <q-item-label caption class="text-negative">
                        {{ $t(obj.caption) }}
                    </q-item-label>
                </q-item-section>

                <q-item-section side right>
                    <q-btn no-caps color="negative" :label="$t(obj.btn_label)" @click="btnClick(obj.btn_id)" v-if="!basicInfo.loading"/>
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</div>

<q-dialog persistent v-model="actPnl.show">
    <dmDialog :title="actPnl.res.title">
        <dmForm @submit="btnClick(DMBTN.confirm.id)" :btnLoading="actPnl.loading">
            <div v-if="actPnl.res.title === 'msgPnlAccountEdit'">
                <dmInput v-for="obj of actComponent" :key="obj" :qProps="obj.qProps" :dmType="obj.dmType" :dmAppend="obj.dmAppend" v-model="obj.value" />
            </div>
            <div v-if="actPnl.res.title === 'msgPnlAccountDelete'">
                <q-input dense flat :hint="$t('msgDrangerDeleteMsg')" :rules="[val => val && val.toString() ==='delete' || $t('msgDrangerDeleteMsg')]" v-model="actPnl.data"></q-input>
            </div>
        </dmForm>
    </dmDialog>
</q-dialog>
</template>

<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { onMounted, reactive, ref } from "vue";
import { DMOBJ,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelUser } from "src/base/model";
import dmDialog from "src/components/dmDialog.vue";
import dmForm from "src/components/dmForm.vue";
import dmInput from "src/components/dmInput.vue";

const dm = new DMOBJ(useQuasar(),useRouter());
const {t} = useI18n();

const props = defineProps({
    user_uuid:{required:true, type:String}
})
const emit = defineEmits(["close"]);


let pageError = ref(false)

const actRes = {
    edit:{title:"msgPnlAccountEdit",url:"/account/update"},
    delete:{title:"msgPnlAccountDelete",url:"/account/delete"},
}

const actPnl = reactive({
    show:false,
    res:actRes.edit,
    loading:false,
    data:null,
})

const actComponent = {
    nick_name:DMINPUT.text_required({...modelUser.nick_name,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}),
    user_status:DMINPUT.select(modelUser.status),
}


const basicInfo = reactive({
    loading:true,
    fields:{
        account:{label:modelUser.account.label,value:""},
        nick_name:{label:modelUser.nick_name.label,value:""},
        phone:{label:modelUser.phone.label,value:""},
        user_status:{label:modelUser.status.label,value:""},
        updated_at:{label:modelBase.updated_at.label,value:""},
        created_at:{label:modelBase.created_at.label,value:""},
    }
})


const securityInfo = ref({
    // reset_password:{title:"msgResetPassword",caption:"",btn_label:"msgResetPassword",btn_id:DMBTN.delete.id,},
    delete:{title:"msgPnlAccountDelete",caption:"msgPnlAccountDeleteCaption",btn_label:"msgDelete",btn_id:DMBTN.delete.id,}})


function btnClick(btnID){
    switch(btnID){
        case DMBTN.edit.id:
            actComponent.nick_name.value = basicInfo.fields.nick_name.value;
            actComponent.user_status.value = basicInfo.fields.user_status.value;
            actPnl.show=true;
            actPnl.res = actRes.edit;
            break;
        case DMBTN.delete.id:
            actPnl.show=true;
            actPnl.res = actRes.delete;
            break;
        case DMBTN.confirm.id:
            let requestData = null

            switch(actPnl.res.title){
                case actRes.edit.title:
                    requestData = {
                        user_uuid:props.user_uuid,
                        nick_name:actComponent.nick_name.value, 
                        user_status:actComponent.user_status.value
                    }
                    break;
                case actRes.delete.title:
                    requestData = {user_uuid:props.user_uuid}
                    break;
                default:
                    break;
            }

            dm.post(actPnl.res.url, requestData, actPnl,
                (rsp)=>{
                    dm.msgOK({ message: t('msgSuccess') })
                    actPnl.show=false

                    if(actPnl.res.title === actRes.delete.title){
                        emit("close")
                    }else{
                        getDetail(props.user_uuid)
                    }
                },
                null
            );

            break;
        default:
            break;
    }
}




function getDetail(user_uuid){
    dm.get("/account/detail",{user_uuid:user_uuid},basicInfo,
        (rsp)=>{
            if(rsp.data == null){
                pageError.value=true
                return
            }

            for (let kw in basicInfo.fields) {
                basicInfo.fields[kw].value = rsp.data[kw];

                switch(kw){
                    case "phone":
                        // 无手机号信息的处理
                        basicInfo.fields[kw].value = basicInfo.fields[kw].value || "-";
                        break;
                    case "user_status":
                        // 样式处理
                        let sts = modelUser.status;
                        for(let t in sts.options){
                            if(sts.options[t].value == basicInfo.fields[kw].value){
                                basicInfo.fields[kw].style = sts.options[t].style
                                basicInfo.fields[kw].value_label = sts.options[t].label
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    )
}


onMounted(()=>{
    getDetail(props.user_uuid)
})
</script>