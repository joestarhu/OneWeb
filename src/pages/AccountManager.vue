<template>
<q-page padding>
    <!-- 列表界面 -->
    <dmManager title="msgPnlAccountList" :showDetail="infoPnl.show" @click="btnClick">
        <template #list>
            <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList"></dmTbl>
        </template>
        <template #detail>
            <q-tabs active-color="primary" class="text-grey" align="left" v-model="tabs.value">
                <q-tab v-for="obj in tabs.lists" :key="obj" :name="obj.name" :label="$t(obj.name)" no-caps />
            </q-tabs>

            <q-tab-panels v-model="tabs.value">
                <!-- 基础信息 -->
                <q-tab-panel name="msgPnlAccountBasicInfo">
                    <AccountDetailBasic :user_uuid="infoPnl.user_uuid" @close="btnClick(DMBTN.back.id)"></AccountDetailBasic>
                </q-tab-panel>

                <!-- 组织信息 -->
                <q-tab-panel name="msgPnlAccountOrg">
                    T.B.D
                </q-tab-panel>
            </q-tab-panels>

        </template>
    </dmManager>

    <!-- 弹窗界面(新增) -->
    <q-dialog persistent v-model="actPnl.show">
        <dmDialog :title="actPnl.res.title">
            <dmForm @submit="btnClick(DMBTN.confirm.id)" :btnLoading="actPnl.loading">
                <dmInput v-for="obj of actComponent" :key="obj" :qProps="obj.qProps" :dmType="obj.dmType" :dmAppend="obj.dmAppend" v-model="obj.value" />
            </dmForm>
        </dmDialog>
    </q-dialog>
</q-page>
</template>

<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { onMounted, reactive,ref } from "vue";
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelUser } from "src/base/model";
import dmManager from "src/components/dmManager.vue";
import dmTbl from "src/components/dmTbl.vue";
import dmDialog from "src/components/dmDialog.vue";
import dmForm from "src/components/dmForm.vue";
import dmInput from "src/components/dmInput.vue";
import AccountDetail from "./AccountDetail.vue";
import AccountDetailBasic from "./AccountDetailBasic.vue";

const dm = new DMOBJ(useQuasar(),useRouter());
const {t} = useI18n();

const tbl = reactive({
    dmQueryInput:{
        account:DMINPUT.text_query(modelUser.account),
        nick_name:DMINPUT.text_query(modelUser.nick_name),
        phone:DMINPUT.text_query({...modelUser.phone}),
        status:DMINPUT.select_query(modelUser.status),
    },
    dmHeaderBtn:[DMBTN.create],
    dmRowBtn:[DMBTN.info],
    columns:[
            DMTBL.col("account",modelUser.account.label),
            DMTBL.col("nick_name",modelUser.nick_name.label),
            DMTBL.col("phone",modelUser.phone.label),
            DMTBL.col("updated_at",modelBase.updated_at.label),
            DMTBL.col("created_at",modelBase.created_at.label),
            {
                ...DMTBL.col("user_status",modelUser.status.label,modelUser.status.options),style:row=>{
                    let sts = modelUser.status
                    for(let t in sts.options){
                        if(sts.options[t].value == row.user_status){
                            return sts.options[t].style
                        }
                    }
                    return ""
                },
            },
            DMTBL.btn("user_uuid"),
    ],
    rows:[],
    pagination:null,
})

const tabs = ref({
    value:"msgPnlAccountBasicInfo",
    lists:[
        {name:"msgPnlAccountBasicInfo"},
        {name:"msgPnlAccountOrg"},
    ]
})


const actRes = {
    create: {title:"msgPnlAccountCreate", url:"/account/create"},
}

const actPnl = reactive({
    show:false,
    loading:false,
    res:actRes.create,
    data:null
})

const actComponent ={
    account:DMINPUT.text_required({...modelUser.account,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}),
    nick_name:DMINPUT.text_required({...modelUser.nick_name,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}),
    phone:DMINPUT.text({...modelUser.phone}),
    user_status:DMINPUT.select(modelUser.status),
}

const infoPnl = reactive({
    show:false,
    user_uuid:""
})


function accountCreateInit(){
    actComponent.account.value ="";
    actComponent.nick_name.value ="";
    actComponent.phone.value ="";
    actComponent.user_status.value =1;
}

function getList(pagination){
    let inputValue = tbl.dmQueryInput
    let data = {
            account:inputValue.account.value,
            phone: inputValue.phone.value,
            nick_name: inputValue.nick_name.value,
            status: inputValue.status.value,
    }
    dm.dmTblGetList(pagination,tbl,"/account/list",data)
}

function accountShowDetail(user_uuid){
    infoPnl.show=true
    infoPnl.user_uuid=user_uuid
    tabs.value.value = "msgPnlAccountBasicInfo"
}

function btnClick(btnID, props=null){
    switch(btnID){
        case DMBTN.create.id:
            accountCreateInit()
            actPnl.show=true;
            actPnl.loading = false;
            actPnl.res = actRes.create;
            break;
        case DMBTN.info.id:
            accountShowDetail(props.row.user_uuid)
            break;
        case DMBTN.confirm.id:
            let requestData = null;
            switch(actPnl.res.title){
                case actRes.create.title:
                    requestData = {
                        account:actComponent.account.value,
                        phone:actComponent.phone.value,
                        nick_name:actComponent.nick_name.value,
                        user_status:actComponent.user_status.value
                    }
                    break;
                default:break;
            }

            dm.post(actPnl.res.url, requestData, actPnl,
                (rsp)=>{
                    dm.msgOK({ message: t('msgSuccess') })
                    getList(tbl.pagination)
                    actPnl.show = false
                },
                null
            );
            break;
        case DMBTN.back.id:
            infoPnl.show=false;
            getList(tbl.pagination)
            break;
        default:
            break;
    }
}

onMounted(()=>{
    // 支持query参数看详情
    if(dm.router.currentRoute.value.query["uuid"]){
        accountShowDetail(dm.router.currentRoute.value.query["uuid"])
    }
})

</script>