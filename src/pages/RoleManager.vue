<template>
<q-page padding>
    <dmManager @click="btnClick" :showDetail="infoPnl.show" title="msgPnlRoleList">
        <template #list>
            <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList" />
        </template>
        <template #detail>
            <RoleDetail :role_id="infoPnl.role_id"></RoleDetail>
        </template>
    </dmManager>
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
import dmManager from "src/components/dmManager.vue";
import RoleDetail from "./RoleDetail.vue";

const dm = new DMOBJ(useQuasar(), useRouter())
const { t } = useI18n()

const infoPnl = reactive({
    show:false,
    role_id:null,
})

const tbl = reactive({
    dmQueryInput:{
        role_name:DMINPUT.text_query(modelRole.role_name),
        role_status:DMINPUT.select_query(modelRole.role_status),
    },
    dmHeaderBtn:[DMBTN.create],
    dmRowBtn:[DMBTN.info,DMBTN.edit, DMBTN.delete],
    rows: [],
    pagination: null,
    columns:[
        DMTBL.col("role_name", modelRole.role_name.label),
        DMTBL.col("role_remark", modelRole.role_remark.label),
        DMTBL.col("updated_at", modelBase.updated_at.label),
        DMTBL.col("created_at", modelBase.created_at.label),
        {
            ...DMTBL.col("role_status", modelRole.role_status.label, modelRole.role_status.options), style: row => {
                let sts = modelRole.role_status
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
    switch(btnID){
        case DMBTN.info.id:
            infoPnl.show = true;
            infoPnl.role_id = props.row.id
            break;
        case DMBTN.back.id:
            infoPnl.show=false
            break;
        default:
            break;
    }
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