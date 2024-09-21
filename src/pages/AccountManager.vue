<template>
<q-page padding>
    <!-- 数据展示table -->
    <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList"></dmTbl>

    <!-- 弹窗界面 -->
    <q-dialog persistent v-model="actPnl.show">
        <dmDialog :title="actPnl.res.title">
            <dmForm @submit="btnClick(DMBTN.confirm.id)" :btnLoading="actPnl.res.loading">
                <div v-if="actPnl.res.title == actRes.delete.title">
                    {{t("msgAccount")}}:<span class="text-warning text-bold">{{  actPnl.data.account }}</span> {{ t("msgDeleteWarning") }}
                </div>
                <div v-else>
                    <div v-if="actPnl.loading">
                            <q-skeleton v-for="obj of detailPnl" :key="obj" class="q-mb-md" type="QInput"></q-skeleton>
                    </div>
                    <div v-else>
                        <dmInput v-for="obj of detailPnl" 
                            :key="obj" :qProps="obj.qProps" :dmType="obj.dmType" :dmAppend="obj.dmAppend" v-model="obj.value">
                        </dmInput>
                    </div>
                </div>

                <template #right_btn v-if="actPnl.loading">
                    <q-skeleton type="QBtn"></q-skeleton>
                </template>
            </dmForm>
        </dmDialog>
    </q-dialog>
</q-page>
</template>

<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelUser } from "src/base/model";
import dmTbl from "src/components/dmTbl.vue";
import dmDialog from "src/components/dmDialog.vue";
import dmForm from "src/components/dmForm.vue";
import dmInput from "src/components/dmInput.vue";

const dm = new DMOBJ(useQuasar(),useRouter());
const {t} = useI18n();


const actRes = {
    create:{title:"msgPnlAccountCreate",url:"/account/create"},
    edit:{title:"msgPnlAccountEdit",url:"/account/update"},
    delete:{title:"msgPnlAccountDelete",url:"/account/delete"},
}

const actPnl = reactive({
    show:false,
    loading:false,
    res:actRes.create,
    data:null
})

const detailPnl = {
    account:DMINPUT.text_required({...modelUser.account,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}),
    phone:DMINPUT.text_required({...modelUser.phone,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}),
    nick_name:DMINPUT.text_required({...modelUser.nick_name,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}),
    user_status:DMINPUT.select(modelUser.status),
}


const tbl = reactive({
    dmQueryInput:{
            phone:DMINPUT.text_query({...modelUser.phone,placeholder:"至少输入3位号码"}),
            nick_name:DMINPUT.text_query(modelUser.nick_name),
            status:DMINPUT.select_query(modelUser.status),
    },
    dmHeaderBtn:[DMBTN.create],
    dmRowBtn:[DMBTN.edit,DMBTN.delete],
    columns:[
            DMTBL.col("account",modelUser.account.label),
            DMTBL.col("phone",modelUser.phone.label),
            DMTBL.col("nick_name",modelUser.nick_name.label),
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


function detailInit(){
    detailPnl.account.value = ""
    detailPnl.phone.value = ""
    detailPnl.nick_name.value = ""
    detailPnl.user_status.value = 1    
}


function detailReadonly(flag){
    detailPnl.account.qProps.readonly = flag
    detailPnl.phone.qProps.readonly = flag
}


function btnClick(btnID, props = null){
    switch(btnID){
        case DMBTN.create.id:
            actPnl.show = true;
            actPnl.loading = false;
            actPnl.res = actRes.create;
            actPnl.data = props.row;
            detailInit();
            detailReadonly(false);
            break;
        case DMBTN.edit.id:
            actPnl.show = true;
            actPnl.loading = true;
            actPnl.res = actRes.edit;
            actPnl.data = props.row;
            detailReadonly(true);
            getDetail(props.row.user_uuid);
            break;
        case DMBTN.delete.id:
            actPnl.show = true;
            actPnl.loading = false;
            actPnl.res = actRes.delete;
            actPnl.data = props.row;
            break;
        case DMBTN.confirm.id:
            let data = null;
            switch(actPnl.res.title){
                case actRes.create.title:
                    data = {
                        account:detailPnl.account.value,
                        phone:detailPnl.phone.value,
                        nick_name:detailPnl.nick_name.value,
                        user_status:detailPnl.user_status.value
                    };
                    break;
                case actRes.edit.title:
                    data = {
                        user_uuid:actPnl.data.user_uuid,
                        nick_name:detailPnl.nick_name.value,
                        user_status:detailPnl.user_status.value
                    };
                    break;
                case actRes.delete.title:
                    data = {
                        user_uuid:actPnl.data.user_uuid,
                    }
                    break;
                default:
                    break;
            }

            dm.post(actPnl.res.url, data, actPnl.res, (rsp) => {
                    dm.msgOK({ message: t('msgSuccess') })
                    getList(tbl.pagination)
                    actPnl.show = false
            })
            break;
        default:
            break;
    }
}


function getList(pagination){
    let data = {
            page_idx:pagination.page,
            page_size:pagination.rowsPerPage,
            phone: tbl.dmQueryInput.phone.value,
            nick_name: tbl.dmQueryInput.nick_name.value,
            status: tbl.dmQueryInput.status.value,
    }
    dm.dmTblGetList(pagination,tbl,"/account/list",data)
}


function getDetail(user_uuid){
    dm.get("/account/detail",{user_uuid:user_uuid},actPnl,
        (rsp)=>{
            for (let kw in detailPnl) {
                detailPnl[kw].value = rsp.data[kw]
            }            
        }
    )
}

</script>