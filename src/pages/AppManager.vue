<template>
<q-page padding>
    <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList"></dmTbl>
</q-page>
</template>

<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { reactive } from 'vue';
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelApp } from "src/base/model";
import dmTbl from 'src/components/dmTbl.vue';
import dmInput from "src/components/dmInput.vue";

const dm = new DMOBJ(useQuasar(),useRouter());
const { t } = useI18n()


const tbl = reactive({
    dmQueryInput:{
        app_name:DMINPUT.text_query(modelApp.app_name),
        app_status:DMINPUT.select_query(modelApp.status),
    },
    dmHeaderBtn:[DMBTN.create],
    dmRowBtn:[DMBTN.info],
    rows: [],
    pagination: null,
    columns:[
        DMTBL.col("app_name", modelApp.app_name.label),
        DMTBL.col("app_remark", modelApp.app_remark.label),
        DMTBL.col("updated_at", modelBase.updated_at.label),
        DMTBL.col("created_at", modelBase.created_at.label),
        {
            ...DMTBL.col("app_status", modelApp.status.label, modelApp.status.options), style: row => {
                let sts = modelApp.status
                for (let t in sts.options) {
                    if (sts.options[t].value == row.app_status) {
                        return sts.options[t].style
                    }
                }
                return ""
            }
        },
        DMTBL.btn()
    ]    
})


function btnClick(btnID,props=null){
    
}

function getList(pagination){
    let data = {
        page_idx:pagination.page,
        page_size:pagination.rowsPerPage,
        app_name:tbl.dmQueryInput.app_name.value,
        app_status:tbl.dmQueryInput.app_status.value
    }
    dm.dmTblGetList(pagination,tbl,"/app/list",data);
}
</script>