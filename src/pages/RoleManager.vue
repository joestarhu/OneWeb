<template>
<q-page padding>
    <!-- 数据显示 -->
    <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList"></dmTbl>

</q-page>
</template>

<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelUser,modelRole } from "src/base/model";
import dmTbl from "src/components/dmTbl.vue";
import DmDialog from "src/components/dmDialog.vue";
import dmForm from "src/components/dmForm.vue";
import dmInput from "src/components/dmInput.vue";

const dm = new DMOBJ(useQuasar(), useRouter())
const { t } = useI18n()

const tbl = reactive({
    dmQueryInput:{
        role_name:DMINPUT.text_query(modelRole.role_name),
        role_status:DMINPUT.select_query(modelRole.status),
    },
    dmHeaderBtn:[DMBTN.create],
    dmRowBtn:[DMBTN.edit, DMBTN.delete],
    rows: [],
    pagination: null,
    columns:[
        DMTBL.col("role_name", modelRole.role_name.label),
        DMTBL.col("role_remark", modelRole.role_remark.label),
        DMTBL.col("updated_at", modelBase.updated_at.label),
        DMTBL.col("created_at", modelBase.created_at.label),
        {
            ...DMTBL.col("role_status", modelUser.status.label, modelUser.status.options), style: row => {
                let sts = modelUser.status
                for (let t in sts.options) {
                    if (sts.options[t].value == row.role_status) {
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
        role_name:tbl.dmQueryInput.role_name.value,
        role_status:tbl.dmQueryInput.role_status.value,
    }
    dm.dmTblGetList(pagination,tbl,"/role/list",data)
}

</script>