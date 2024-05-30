<template>
<q-page padding>
    <dmTbl v-bind="tbl" :dmQueryInput="dmQueryInput" :dmRowBtn="dmRowBtn" :dmHeaderBtn="dmHeaderBtn" @btnClick="btnClick" @query="getList"></dmTbl>
</q-page>
</template>

<script setup>
import { useQuasar } from "quasar"
import { useRouter } from 'vue-router'
import {ref,onMounted} from "vue"
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm"
import { modelBase,modelUser } from "src/base/model"
import dmTbl from "src/components/dmTbl.vue"
import dmInput from "src/components/dmInput.vue"

const dm = new DMOBJ(useQuasar(),useRouter())



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


const tbl = ref({
    columns:[
        DMTBL.col("account",modelUser.account.label),
        DMTBL.col("nick_name",modelUser.nick_name.label),
        DMTBL.col("phone",modelUser.phone.label),
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


function btnClick(){

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

    dm.get('/account/list', data, tbl.value,
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