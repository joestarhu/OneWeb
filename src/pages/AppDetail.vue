<template>
    <!-- 应用服务信息 -->
    <dmTbl v-bind="appSericesTbl" @query="getAppServicesList"></dmTbl>


    <!-- 应用角色信息 -->

    <!-- <q-table dense flat v-bind="tbl"> 
        <template #header-cell-service_name="props">
            <q-th :props="props">
                {{ $t(props.col.label) }}
            </q-th>
        </template>

        <template #body-cell-service_name="props">
            <q-td :props="props">
                <span>{{ props.row.service_name }}</span><br/>
                <span class="text-caption">{{ props.row.service_tag }}</span>
            </q-td>
        </template>
    </q-table> -->
</template>

<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelApp } from "src/base/model";
import dmTbl from "src/components/dmTbl.vue";
import dmDialog from "src/components/dmDialog.vue";
import dmForm from "src/components/dmForm.vue";
import dmInput from "src/components/dmInput.vue";

const {t} =useI18n();

const dm = new DMOBJ(useQuasar(),useRouter())
const props = defineProps({
    app_id:{type:Number,required:true},
})

const appSericesTbl = reactive({
    columns:[
        DMTBL.col("service_name",modelApp.service_name.label),
        DMTBL.col("service_tag",modelApp.service_tag.label),
    ],
    rows:[],
    pagination:null,
})

const dummyData = [
    {service_name:"获取账号列表信息",service_tag:"acct:list",role_id:1,role_name:"管理员",dept:99,region:98,},
    {service_name:"获取账号详细信息",service_tag:"acct:detail",role_id:1,role_name:"管理员",dept:97,region:96,},
    {service_name:"创建账号",service_tag:"acct:create",role_id:1,role_name:"管理员",dept:95,region:94,},
    {service_name:"修改账号",service_tag:"acct:update",role_id:1,role_name:"管理员",dept:93,region:92,},
    {service_name:"删除账号",service_tag:"acct:delete",role_id:1,role_name:"管理员",dept:91,region:90,},
    {service_name:"获取组织列表信息",service_tag:"org:list",},
    {service_name:"获取组织详情信息",service_tag:"org:detail",},
]

const tbl =reactive({
    columns:[
        DMTBL.col("service_name",modelApp.service_name.label),
        {...DMTBL.col("dept","dept"),format:(val,row)=>{
            if(val){
                return val;
            }else{
                return "无权限";
            }
        }},
        {...DMTBL.col("region","region"),format:(val,row)=>{
            if(val){
                return val;
            }else{
                return "无权限";
            }
        }},
    ],
    rows:dummyData,
    pagination:null,
    "rows-per-page-options":[0],
})



async function getAppServicesList(pagination){
    let data = {app_id:props.app_id}
    dm.dmTblGetList(pagination,appSericesTbl,"/app/service_list",data)
}






</script>