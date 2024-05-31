<template>
<q-page padding>
    <dmTbl v-bind="tbl" :dmQueryInput="dmQueryInput" :dmRowBtn="dmRowBtn" :dmHeaderBtn="dmHeaderBtn" @btnClick="btnClick" @query="getList"></dmTbl>

    <q-dialog persistent v-model="actPnl.show">
        <dmDialog :title="actPnl.res.title">
                <dmForm @submit="btnClick(DMBTN.confirm.id)" :btnLoading="actPnl.res.loading">
                    <div v-if="actPnl.res.title != actRes.delete.title">
                        <div v-if="actPnl.loading">
                            <q-skeleton v-for=" obj of viewDetail" :key="obj" class="q-mb-md" type="QInput"></q-skeleton>
                        </div>
                        <div v-else>
                            <dmInput v-for=" obj of viewDetail" :key="obj" :qProps="obj.qProps" :dmType="obj.dmType" :dmAppend="obj.dmAppend" v-model="obj.value"  />
                        </div>
                    </div>
                    <div v-else>
                         {{t("msgAccount")}}:<span class="text-negative">{{  actPnl.data.account }}</span> {{ t("msgDeleteWarning") }}
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
import { modelBase,modelUser } from "src/base/model"
import dmTbl from "src/components/dmTbl.vue"
import dmDialog from "src/components/dmDialog.vue"
import dmForm from "src/components/dmForm.vue"
import dmInput from "src/components/dmInput.vue"

const dm = new DMOBJ(useQuasar(),useRouter())
const {t} = useI18n()

// 数据模型
const viewDetail = {
    account:DMINPUT.text_required({...modelUser.account,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}).value,
    phone:DMINPUT.text_required({...modelUser.phone,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}).value,
    nick_name:DMINPUT.text_required({...modelUser.nick_name,rules: [val => val && val.toString().length > 0 || t("msgRequiredField")]}).value,
    status:DMINPUT.select(modelUser.status).value,
}


const dmQueryInput = {
    phone:DMINPUT.test_query(modelUser.phone).value,
    nick_name:DMINPUT.test_query(modelUser.nick_name).value,
    status:DMINPUT.select_query(modelUser.status).value,
}
const dmHeaderBtn = [
    DMBTN.create
]
const dmRowBtn = [
    DMBTN.edit,DMBTN.delete
]

const actRes = {
    create:{title:"msgPnlAccountCreate",url:"/account/create"},
    edit:{title:"msgPnlAccountEdit",url:"/account/update"},
    delete:{title:"msgPnlAccountDelete",url:"/account/delete"},
}

// 操作资源(请求地址和操作弹窗Title)
const actPnl = ref({
    show: false,
    loading: false,
    res: actRes.create,
    data: null,
})

const tbl = ref({
    columns:[
        DMTBL.col("account",modelUser.account.label),
        DMTBL.col("phone",modelUser.phone.label),
        DMTBL.col("nick_name",modelUser.nick_name.label),
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

            // 新增初始化
            viewDetail.account.qProps.readonly = false
            viewDetail.phone.qProps.readonly = false
            viewDetail.account.value=""
            viewDetail.phone.value=""
            viewDetail.nick_name.value=""
            viewDetail.status.value=1
            break
        case DMBTN.edit.id:
            pnl.show = true
            pnl.res = actRes.edit
            pnl.data = props.row
            viewDetail.account.qProps.readonly = true
            viewDetail.phone.qProps.readonly = true
            getDetail(pnl.data.id)
            break
        case DMBTN.delete.id:
            pnl.show = true
            pnl.res = actRes.delete
            pnl.data = props.row

            break
        case DMBTN.confirm.id:
            let data = null
            switch(pnl.res.title){
                case actRes.create.title:
                    data = {
                        account:viewDetail.account.value,
                        phone:viewDetail.phone.value,
                        nick_name:viewDetail.nick_name.value,
                        status:viewDetail.status.value
                    }
                    break
                case actRes.edit.title:
                    data = {
                        user_id: pnl.data.id,
                        nick_name:viewDetail.nick_name.value,
                        status:viewDetail.status.value
                    }
                    break
                case actRes.delete.title:
                    data = {
                        user_id:pnl.data.id
                    }
                    break
                default:
                    break
            }

            dm.post(pnl.res.url, data, pnl.res, (rsp) => {
                dm.msgOK({ message: t('msgSuccess') })
                getList(tbl.value.pagination)
                pnl.show = false
            })

            break
        default:break
    }
}

function getDetail(user_id){
    dm.get('/account/detail', { user_id: user_id }, actPnl.value, (rsp) => {
        for (let kw in viewDetail) {
            viewDetail[kw].value = rsp.data[kw]
        }
    })
}


function getList(pagination){
    let data = {
        page_idx: pagination.page,
        page_size: pagination.rowsPerPage,
        phone: dmQueryInput.phone.value,
        nick_name: dmQueryInput.nick_name.value,
        status: dmQueryInput.status.value,
    }

    if (!tbl.value.pagination) {
        tbl.value.pagination = pagination
    }

    dm.get("/account/list", data, tbl.value,
        (rsp) => {
            let val = rsp.data.records
            // val = val.map(item => ({
            //     // ...item, u_name: item['u_nick_name'] + '(' + item['u_real_name'] + ')'
            //     ...item, u_name: item['upd_nick_name']
            // }))
            tbl.value.rows = val
            pagination.rowsNumber = rsp.data.pagination.total
        })    
}

</script>