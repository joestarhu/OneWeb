<template>
<!-- 详情无数据 -->
<div v-if="pageError">
    <span>No Data</span>
</div>

<!-- 正常系 -->
<div v-else>
    <q-tabs active-color="primary" class="text-grey" align="left" v-model="tabs.value">
        <q-tab v-for="obj in tabs.lists" :key="obj" :name="obj.name" :label="$t(obj.name)" no-caps />
    </q-tabs>
    <q-tab-panels v-model="tabs.value">

        <!-- 基础 -->
        <q-tab-panel name="msgPnlAccountBasicInfo">
            <div class="q-mx-md">
                <span class="text-h6">{{$t("msgBasicInfo")}}</span>
                <q-btn color="primary" icon="edit" flat dense size="0.7rem" @click="btnClick(DMBTN.edit.id)"></q-btn>
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
                <!-- <q-item>
                    <q-item-section>
                        <q-item-label class="text-negative text-bold">{{$t("msgResetPassword")}}</q-item-label>
                        <q-item-label caption class="text-negative">{{$t("msgResetPassword")}}</q-item-label>
                    </q-item-section>

                    <q-item-section side right>
                            <q-btn no-caps color="negative">{{t("msgAction")}}</q-btn>
                    </q-item-section>
                </q-item> -->
                <q-item>
                    <q-item-section>
                        <q-item-label class="text-negative text-bold">{{$t("msgPnlAccountDelete")}}</q-item-label>
                        <q-item-label caption class="text-negative">
                            <span class="text-warning text-bold">{{ basicInfo.fields.account.value }} </span> {{ t("msgDeleteWarning") }}
                        </q-item-label>
                    </q-item-section>

                    <q-item-section side right>
                        <q-btn no-caps color="negative" :label="t('msgDelete')" @click="btnClick(DMBTN.delete.id)"/>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>

        </q-tab-panel>

        <!-- 组织 -->
        <q-tab-panel name="msgPnlAccountOrg">
            <dmTbl v-bind="orgTbl" @query="getOrgsList"/>
        </q-tab-panel>


        <!-- 安全 -->
        <q-tab-panel name="msgPnlAccountSecurity">
            <q-list bordered separator>
                <!-- <q-item>
                    <q-item-section>
                        <q-item-label class="text-negative text-bold">{{$t("msgResetPassword")}}</q-item-label>
                        <q-item-label caption class="text-negative">{{$t("msgResetPassword")}}</q-item-label>
                    </q-item-section>

                    <q-item-section side right>
                            <q-btn no-caps color="negative">{{t("msgAction")}}</q-btn>
                    </q-item-section>
                </q-item> -->
                <q-item>
                    <q-item-section>
                        <q-item-label class="text-negative text-bold">{{$t("msgPnlAccountDelete")}}</q-item-label>
                        <q-item-label caption class="text-negative">
                            <span class="text-warning text-bold">{{ basicInfo.fields.account.value }} </span> {{ t("msgDeleteWarning") }}
                        </q-item-label>
                    </q-item-section>

                    <q-item-section side right>
                        <q-btn no-caps color="negative" :label="t('msgDelete')" @click="btnClick(DMBTN.delete.id)"/>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-tab-panel>

    </q-tab-panels>
</div>

<!-- 弹窗 -->
<q-dialog persistent v-model="actPnl.show">
    <dmDialog :title="actPnl.res.title">
        <dmForm @submit="btnClick(DMBTN.confirm.id)" :btnLoading="actPnl.loading">
            <div v-if="actPnl.res.title === 'msgPnlAccountEdit'">
                <dmInput v-for="obj of basicComponent" :key="obj" :qProps="obj.qProps" :dmType="obj.dmType" :dmAppend="obj.dmAppend" v-model="obj.value" />
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
import { computed, onMounted, reactive, ref } from "vue";
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelOrg,modelUser } from "src/base/model";
import dmTbl from "src/components/dmTbl.vue";
import dmDialog from "src/components/dmDialog.vue";
import dmForm from "src/components/dmForm.vue";
import dmInput from "src/components/dmInput.vue";

// 界面属性
const props = defineProps({
    user_uuid:{required:true,type:String},
})
const emit = defineEmits(['close']);

const dm = new DMOBJ(useQuasar(),useRouter());
const {t} = useI18n();
let pageError = ref(false)

const tabs = reactive({
    value:"msgPnlAccountBasicInfo",
    lists:[
        {name:"msgPnlAccountBasicInfo"},
        {name:"msgPnlAccountOrg"},
        {name:"msgPnlAccountSecurity"},
    ]
})

const basicInfo = reactive({
    loading:false,
    fields:{
        account:{label:modelUser.account.label,value:""},
        nick_name:{label:modelUser.nick_name.label,value:""},
        phone:{label:modelUser.phone.label,value:""},
        user_status:{label:modelUser.status.label,value:""},
        updated_at:{label:modelBase.updated_at.label,value:""},
        created_at:{label:modelBase.created_at.label,value:""},
    }
})


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

const basicComponent = {
    nick_name:DMINPUT.text_required({...modelUser.nick_name,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}),
    user_status:DMINPUT.select(modelUser.status),
}

const orgTbl = reactive({
    loading:false,
    columns:[
            DMTBL.col("org_name",modelOrg.org_name.label),
            {
                ...DMTBL.col("org_status",modelOrg.status.label,modelOrg.status.options),style:row=>{
                    let sts = modelOrg.status
                    for(let t in sts.options){
                        if(sts.options[t].value === row.org_status){
                            return sts.options[t].style
                        }
                    }
                    return ""
                },
            },
            // DMTBL.col("org_user_status",modelOrg.org_name.label),
    ],
    rows:[],
    pagination:null,
})


function btnClick(btnID){
    switch(btnID){
        case DMBTN.edit.id:
            actPnl.show = true;
            actPnl.res = actRes.edit;
            basicComponent.nick_name.value = basicInfo.fields.nick_name.value
            basicComponent.user_status.value = basicInfo.fields.user_status.value
            break;
        case DMBTN.delete.id:
            actPnl.show = true;
            actPnl.res = actRes.delete;
            actPnl.data = "";
            break;
        case DMBTN.confirm.id:
            let requestData = null
            switch(actPnl.res.title){
                case actRes.edit.title:
                    requestData = {user_uuid:props.user_uuid,nick_name:basicComponent.nick_name.value, user_status:basicComponent.user_status.value}
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

function getOrgsList(pagination){
    let data = {
            user_uuid:props.user_uuid,
    }
    dm.dmTblGetList(pagination,orgTbl,"/account/orgs",data)
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

<style>

</style>