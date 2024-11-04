<template>
<div class="q-mx-md">
    <span class="text-h6">{{$t("msgBasicInfo")}}</span>
    <q-btn color="primary" icon="edit" flat dense size="0.8rem" @click="btnClick(DMBTN.edit.id)"></q-btn>
    <q-list bordered>
        <q-item v-for="obj of basicInfo.fields" :key="obj">
            <q-item-section>
                <q-item-label class="text-grey">
                    {{ $t(obj.label) }}:
                </q-item-label>
                <q-item-label>
                    <q-skeleton type="rect" v-if="basicInfo.loading"/>
                    <span :style="obj.style" v-else>{{ obj.value_label || obj.value }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>
    </q-list>
</div>


<q-dialog persistent v-model="actPnl.show">
    <dmDialog :title="actPnl.res.title">
        <dmForm @submit="btnClick(DMBTN.confirm.id)" :btnLoading="actPnl.loading">
            <dmInput v-for="obj of actComponent" :key="obj" :qProps="obj.qProps" :dmType="obj.dmType" :dmAppend="obj.dmAppend" v-model="obj.value" />
        </dmForm>
    </dmDialog>
</q-dialog>
</template>

<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ref,reactive, onMounted } from 'vue';
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelOrg } from "src/base/model";
import dmDialog from "src/components/dmDialog.vue";
import dmForm from "src/components/dmForm.vue";
import dmInput from "src/components/dmInput.vue";

const dm = new DMOBJ(useQuasar(),useRouter())
const {t} = useI18n()

const props = defineProps({
    org_uuid:{required:true,type:String}
})

const basicInfo = reactive({
    loading:true,
    fields:{
        org_name:{label:modelOrg.org_name.label,value:""},
        org_remark:{label:modelOrg.org_remark.label,value:""},
        owner_name:{label:modelOrg.owner_name.label, value:""},
        org_status:{label:modelOrg.org_status.label,value:""},
        updated_at:{label:modelBase.updated_at.label,value:""},
        created_at:{label:modelBase.created_at.label,value:""},
    }
})


const actRes = {
    edit:{title:"msgPnlOrgEdit",url:"/org/update"},
    delete:{title:"msgPnlAccountDelete",url:"/account/delete"},
}

const actPnl = reactive({
    show:false,
    res:actRes.edit,
    loading:false,
    data:null,
})

const actComponent = {
    org_name:DMINPUT.text_required({...modelOrg.org_name,rules:[val => val && val.toString().length > 0 || t("msgRequiredField")]}),
    org_remark: DMINPUT.text({ ...modelOrg.org_remark, type: "textarea" }),
    org_status: DMINPUT.select(modelOrg.org_status),
}


function btnClick(btnID){
    switch(btnID){
        case DMBTN.edit.id:
            actPnl.show=true;
            actComponent.org_name.value = basicInfo.fields.org_name.value
            actComponent.org_remark.value = basicInfo.fields.org_remark.value
            actComponent.org_status.value = basicInfo.fields.org_status.value
            break;
        case DMBTN.confirm.id:
            let requestData = null

            switch(actPnl.res.title){
                case actRes.edit.title:
                    requestData = {
                        org_uuid:props.org_uuid,
                        org_name:actComponent.org_name.value,
                        org_remark:actComponent.org_remark.value,
                        org_status:actComponent.org_status.value
                    }
                    break;
                default:break;
            }

            dm.post(actPnl.res.url, requestData, actPnl,
                (rsp)=>{
                    dm.msgOK({ message: t('msgSuccess') })
                    actPnl.show=false
                    getDetailInfo()

                    // if(actPnl.res.title === actRes.delete.title){
                    //     emit("close")
                    // }else{
                    //     getDetail()
                    // }
                },
                null
            );


            break;
        default:break;
    }
}

function getDetailInfo(){
    dm.get("/org/detail",{org_uuid:props.org_uuid},basicInfo,
        (rsp)=>{
            if(rsp.data == null){
                pageError.value=true
                return
            }

            for (let kw in basicInfo.fields) {
                basicInfo.fields[kw].value = rsp.data[kw];

                if(kw === "org_status"){
                    let sts = modelOrg.org_status;
                    for(let t in sts.options){
                        if(sts.options[t].value == basicInfo.fields[kw].value){
                            basicInfo.fields[kw].style = sts.options[t].style
                            basicInfo.fields[kw].value_label = sts.options[t].label
                        }
                    }
                }
            }
        },
        null,
    )
}

onMounted(()=>{
    getDetailInfo()
})


</script>