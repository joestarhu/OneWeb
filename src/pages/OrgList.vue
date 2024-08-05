<template>
<q-page padding>
    <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList"></dmTbl>
</q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ref,reactive } from "vue";
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelUser,modelOrg } from "src/base/model";
import dmTbl from "src/components/dmTbl.vue";

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
        DMTBL.col("update_dt", modelBase.update_dt.label),
        DMTBL.col("create_dt", modelBase.create_dt.label),
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


function btnClick(btnID,props=null){

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



</script>