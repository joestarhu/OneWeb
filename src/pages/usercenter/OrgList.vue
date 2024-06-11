<template>
<q-page padding>
    <dmTbl v-bind="tbl" :dmQueryInput="dmQueryInput" :dmRowBtn="dmRowBtn" :dmHeaderBtn="dmHeaderBtn" @btnClick="btnClick" @query="getList"></dmTbl>

    <q-dialog persistent v-model="actPnl.show" >
        <dmDialog :title="actPnl.res.title" >
            <dmForm @submit="btnClick(DMBTN.confirm.id)" :btnLoading="actPnl.res.loading">
                <div v-if="actPnl.res.title != actRes.delete.title">
                    <div v-if="actPnl.loading">
                        <q-skeleton v-for=" obj of viewDetail" :key="obj" class="q-mb-md" type="QInput"></q-skeleton>
                    </div>
                    <div v-else>
                        <dmInput v-for=" obj of viewDetail" :key="obj" :qProps="obj.qProps" :dmType="obj.dmType" :dmAppend="obj.dmAppend" v-model="obj.value" @filter="(val, update, abort) => filter(val, update, abort, obj.qProps)"  />
                    </div>
                </div>
                <div v-else>
                    {{t("msgOrg")}}:<span class="text-negative text-bold">{{  actPnl.data.name }}</span> {{ t("msgDeleteWarning") }}
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
import { useQuasar } from "quasar"
import { useRouter } from 'vue-router'
import { useI18n } from "vue-i18n"
import {ref} from "vue"
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm"
import { modelBase,modelUser,modelOrg } from "src/base/model"
import dmTbl from "src/components/dmTbl.vue"
import dmDialog from "src/components/dmDialog.vue"
import dmForm from "src/components/dmForm.vue"
import dmInput from "src/components/dmInput.vue"

const dm = new DMOBJ(useQuasar(),useRouter())
const {t} = useI18n()

const viewDetail = {
    name:DMINPUT.text_required({...modelOrg.name,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}).value,
    owner_id:DMINPUT.selectFilter({...modelOrg.owner_name,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}).value,
    remark:DMINPUT.text({...modelOrg.remark, type:"textarea"}).value,
    status:DMINPUT.select(modelOrg.status).value,
}

const actRes = {
    create:{title:"msgPnlOrgCreate",url:"/org/create"},
    edit:{title:"msgPnlOrgEdit",url:"/org/update"},
    delete:{title:"msgPnlOrgDelete",url:"/org/delete"},
}

// 操作资源(请求地址和操作弹窗Title)
const actPnl = ref({
    show: false,
    loading: false,
    res: actRes.create,
    data: null,
})

const dmQueryInput = {
    name:DMINPUT.test_query(modelOrg.name).value,
    status:DMINPUT.select_query(modelUser.status).value,
}
const dmHeaderBtn = [
    DMBTN.create
]
const dmRowBtn = [
    DMBTN.edit,DMBTN.delete
]
const tbl = ref({
    columns:[
        DMTBL.col("name",modelOrg.name.label),
        DMTBL.col("owner_name",modelOrg.owner_name.label),
        DMTBL.col("remark",modelOrg.remark.label),
        DMTBL.col("update_dt",modelBase.update_dt.label),
        DMTBL.col("create_dt",modelBase.create_dt.label),
        {
            ...DMTBL.col("status",modelUser.status.label,modelUser.status.options),style:row=>{
                let sts = modelUser.status
                for(let t in sts.options){
                    if(sts.options[t].value == row.status){
                        return sts.options[t].style
                    }
                }
                return ""
            }
        },
        DMTBL.btn()
    ],
    rows:[],
    pagination:null,
})

function btnClick(btnID, props = null){
    let pnl = actPnl.value

    switch(btnID){
            case DMBTN.create.id:
            pnl.show = true
            pnl.res = actRes.create

            viewDetail.name.value = ""
            viewDetail.owner_id.value=""
            viewDetail.remark.value=""
            viewDetail.status.value=1
            break;
        case DMBTN.edit.id:
            pnl.show = true
            pnl.res = actRes.edit
            pnl.data = props.row
            getDetail(props.row.id)
            break;
        case DMBTN.delete.id:
            pnl.show = true
            pnl.res = actRes.delete
            pnl.data = props.row
            break;
        case DMBTN.confirm.id:
            let data = null
            switch(pnl.res.title){
                case actRes.create.title:
                    data = {
                        name:viewDetail.name.value,
                        owner_id:viewDetail.owner_id.value,
                        remark:viewDetail.remark.value,
                        status:viewDetail.status.value
                    }
                    break
                case actRes.edit.title:
                    data = {
                        org_id:pnl.data.id,
                        name:viewDetail.name.value,
                        owner_id:viewDetail.owner_id.value,
                        remark:viewDetail.remark.value,
                        status:viewDetail.status.value
                    }
                    break
                case actRes.delete.title:
                    data = {
                        org_id:pnl.data.id
                    }
                    break
                default:
                    break
            }

            dm.post(pnl.res.url, data, pnl.res, (rsp) => {
                dm.msgOK({ message: t("msgSuccess") })
                getList(tbl.value.pagination)
                pnl.show = false
            })


            break;
        default:break
    }
}


function getList(pagination){
    let data = {
        page_idx: pagination.page,
        page_size: pagination.rowsPerPage,
        name:dmQueryInput.name.value,
        status: dmQueryInput.status.value,
    }

    if (!tbl.value.pagination) {
        tbl.value.pagination = pagination
    }

    dm.get("/org/list", data, tbl.value,
        (rsp) => {
            let val = rsp.data.records
            tbl.value.rows = val
            pagination.rowsNumber = rsp.data.pagination.total
        })    
}

function getDetail(org_id){
    dm.get('/org/detail', { org_id: org_id }, actPnl.value, (rsp) => {
        for (let kw in viewDetail) {
            viewDetail[kw].value = rsp.data[kw]
        }
        getOwnerOptionsByID(rsp.data['owner_id'])
    })

}


function filter(val,update,abort,tag){
    update(() => {
        getOwnerOptions(val)
    })
}

function getOwnerOptions(val){
    let data = {
        nick_name: val,
        status: 1,
        page_idx: 1,
        page_size: 5,
    }

    let input = viewDetail.owner_id.qProps
    dm.get('/account/list', data, input, (rsp) => {
        input.options = []
        for (let x of rsp.data.records) {
            input.options.push({ label: x.nick_name, value: x.id, caption: t("msgPhone")+':' + x.phone })
        }
    })
}


function getOwnerOptionsByID(user_id){
    let input = viewDetail.owner_id.qProps
    dm.get('/account/detail',{ user_id: user_id },input, (rsp)=>{
        input.options = []
        let x = rsp.data
        input.options.push({ label: x.nick_name, value: x.id, caption: t("msgPhone")+':' + x.phone })
    })
}







</script>