<template>
<q-page padding>
    <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList"></dmTbl>

    <q-dialog persistent v-model="actPnl.show">
        <dmDialog :title="actPnl.res.title">
            <dmForm @submit="btnClick(DMBTN.confirm.id)" :btnLoading="actPnl.res.loading">
                <div v-if="actPnl.res.title == actRes.delete.title">
                    {{t("msgOrg")}}:<span class="text-negative text-bold">{{  actPnl.data.org_name }}</span> {{ t("msgDeleteWarning") }}
                </div>
                <div v-else>
                    <div v-if="actPnl.loading">
                        <q-skeleton v-for="obj of detailPnl" :key="obj" class="q-mb-md" type="QInput"></q-skeleton>
                    </div>
                    <div v-else>
                        <dmInput v-for="obj of detailPnl" 
                        :key="obj" :qProps="obj.qProps" :dmType="obj.dmType" :dmAppend="obj.dmAppend" v-model="obj.value"
                        @filter="(val, update, abort) => filter(val, update, abort, obj.qProps)"
                        >
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

<script setup>
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelUser,modelOrg } from "src/base/model";
import dmTbl from "src/components/dmTbl.vue";
import DmDialog from "src/components/dmDialog.vue";
import dmForm from "src/components/dmForm.vue";
import dmInput from "src/components/dmInput.vue";

const dm = new DMOBJ(useQuasar(), useRouter())
const { t } = useI18n()

const tbl = reactive({
    dmQueryInput:{
        org_name:DMINPUT.text_query(modelOrg.org_name),
        status:DMINPUT.select_query(modelOrg.status),
    },
    dmHeaderBtn:[DMBTN.create],
    dmRowBtn:[DMBTN.edit, DMBTN.delete],
    rows: [],
    pagination: null,
    columns:[
        DMTBL.col("org_name",modelOrg.org_name.label),
        DMTBL.col("owner_name", modelOrg.owner_name.label),
        DMTBL.col("remark", modelOrg.remark.label),
        DMTBL.col("updated_at", modelBase.updated_at.label),
        DMTBL.col("created_at", modelBase.created_at.label),
        {
            ...DMTBL.col("status", modelUser.status.label, modelUser.status.options), style: row => {
                let sts = modelUser.status
                for (let t in sts.options) {
                    if (sts.options[t].value == row.status) {
                        return sts.options[t].style
                    }
                }
                return ""
            }
        },
        DMTBL.btn("org_uuid")
    ]


})

const actRes = {
    create: { title: "msgPnlOrgCreate", url: "/org/create" },
    edit: { title: "msgPnlOrgEdit", url: "/org/update" },
    delete: { title: "msgPnlOrgDelete", url: "/org/delete" },
}

// 操作资源(请求地址和操作弹窗Title)
const actPnl = reactive({
    show: false,
    loading: false,
    res: actRes.create,
    data: null,
})

const detailPnl = {
    org_name:DMINPUT.text_required({...modelOrg.org_name, rules:[val => val && val.toString().length > 0 || t("msgRequiredField")]}),
    user_uuid: DMINPUT.selectFilter({ ...modelOrg.owner_name, rules: [val => val && val.toString().length > 0 || t("msgRequiredField")] }),
    remark: DMINPUT.text({ ...modelOrg.remark, type: "textarea" }),
    status: DMINPUT.select(modelOrg.status),
}

function detailInit(){
    detailPnl.org_name.value = ""
    detailPnl.user_uuid.value=""
    detailPnl.remark.value=""
    detailPnl.status.value = 1
}


function btnClick(btnID,props=null){
    switch(btnID){
        case DMBTN.create.id:
            actPnl.show = true
            actPnl.res = actRes.create
            detailInit()
            break;
        case DMBTN.edit.id:
            actPnl.show = true
            actPnl.res = actRes.edit
            actPnl.data = props.row
            getDetail(props.row.org_uuid)
            break;
        case DMBTN.delete.id:
            actPnl.show = true
            actPnl.res = actRes.delete
            actPnl.data = props.row
            break;
        case DMBTN.confirm.id:
        let data = null
            switch(actPnl.res.title){
                case actRes.create.title:
                    data = {
                        org_name:detailPnl.org_name.value,
                        owner_uuid:detailPnl.user_uuid.value,
                        remark:detailPnl.remark.value,
                        status:detailPnl.status.value
                    }
                    break;
                case actRes.edit.title:
                    data = {
                        org_uuid:actPnl.data.org_uuid,
                        org_name:detailPnl.org_name.value,
                        owner_uuid:detailPnl.user_uuid.value,
                        remark:detailPnl.remark.value,
                        status:detailPnl.status.value
                    }
                    break;
                case actRes.delete.title:
                    data = {
                        org_uuid:actPnl.data.user_uuid,
                    }
                    break;
                default:
                    // should not be here...
                    break;
            }


            dm.post(actPnl.res.url, data, actPnl.res, (rsp) => {
                dm.msgOK({ message: t('msgSuccess') })
                getList(tbl.pagination)
                actPnl.show = false
            })


            break;
        default:
            // should not be here
            break;
    }
}

function getList(pagination){
    let data = {
        page_idx:pagination.page,
        page_size:pagination.rowsPerPage,
        org_name:tbl.dmQueryInput.org_name.value,
        status:tbl.dmQueryInput.status.value,
    }

    if (!tbl.pagination){
        tbl.pagination = pagination
    }

    dm.get("/org/list",data,tbl,(rsp)=>{
        let responseData = rsp.data
        tbl.rows = responseData.records
        pagination.rowsNumber = responseData.pagination.total
    })
}

function getDetail(org_uuid){
    dm.get("/org/detail",{org_uuid:org_uuid}, actPnl , (rsp)=>{
        getOwnerOptionsByUUID(rsp.data["user_uuid"])
        for(let kw in detailPnl){
            detailPnl[kw].value = rsp.data[kw]
        }
        
    })

}

function filter(val,update,abort,tag){
    update(()=>{
        getOwnerOptions(val)
    })
}

function getOwnerOptions(val){
    let data = {
        nick_name:val,
        status:1,
    }

    let uuidSelectProps = detailPnl.user_uuid.qProps
    dm.get("/account/list",data,uuidSelectProps,(rsp)=>{
        uuidSelectProps.options = []
        for (let x of rsp.data.records) {
            let caption = t("msgPhone") + ':' + x.phone + " | " + t("msgNickName") + ':' + x.nick_name
            uuidSelectProps.options.push({ label: x.nick_name, value: x.user_uuid, caption: caption })
        }        
    })
}

function getOwnerOptionsByUUID(user_uuid){
    let uuidSelectProps = detailPnl.user_uuid.qProps
    dm.get("/account/detail",{user_uuid:user_uuid},uuidSelectProps,(rsp)=>{
        uuidSelectProps.options = []
        let x = rsp.data
        let caption = t("msgPhone") + ':' + x.phone + " | " + t("msgNickName") + ':' + x.nick_name
        uuidSelectProps.options.push({ label: x.nick_name, value: user_uuid, caption: caption })
    })
}









</script>