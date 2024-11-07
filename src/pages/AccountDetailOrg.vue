<template>
<dmTbl v-bind="tbl" @query="getList">
    <template #body-cell-org_name="props">
        <q-td :props="props">
            <span class="text-bold">{{ props.row.org_name }}</span>
            <br>
            <q-badge v-if="props.row.owner_flag">{{$t("msgOrgOwnerName")}}</q-badge>
        </q-td>
    </template>

</dmTbl>
</template>

<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { onMounted, reactive,ref } from "vue";
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelUser,modelOrg } from "src/base/model";
import dmTbl from "src/components/dmTbl.vue";

const dm = new DMOBJ(useQuasar(),useRouter());
const {t} = useI18n();

const props = defineProps({
    user_uuid:{type:String,required:true}
})

const tbl = reactive({
    dmQueryInput:{
        // 组织名称和组织状态
        // org_name:DMINPUT.text_query(modelOrg.org_name),
        // org_status:DMINPUT.select_query(modelOrg.org_status),
    },
    dmHeaderBtn:[],
    dmRowBtn:[],
    columns:[
        {
            ...DMTBL.col("org_name",modelOrg.org_name.label),
            format:(val,row)=>{
                // 表示出owner

                if(row.owner_uuid === props.user_uuid){
                    return `${val} | info`
                }else{
                    return val
                }
            },
            style:row=>{
                if(row.owner_uuid === props.user_uuid){
                    return "color:#6666DF"
                }else{
                    return ""
                }
            }
        },


        {
            ...DMTBL.col("org_status",modelOrg.org_status.label,modelOrg.org_status.options),style:row=>{
                let sts = modelOrg.org_status
                for(let t in sts.options){
                    if(sts.options[t].value === row.org_status){
                        return sts.options[t].style
                    }
                }
                return ""
            },
        },
    ],
    rows:[],
    pagination:null,
})


function getList(pagination){
    let data = {
            user_uuid:props.user_uuid,
    }
    dm.dmTblGetList(pagination,tbl,"/account/orgs",data)
}









</script>