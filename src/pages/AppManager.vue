<template>
<q-page padding>
    <dmManager title="msgPnlAppList" :showDetail="infoPnl.show" @click="btnClick">
        <template #list>
            <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList" />
        </template>

        <template #detail>
            <AppDetail :app_id="infoPnl.app_id"></AppDetail>
        </template>
    </dmManager>



    <!-- <div v-if="!infoPnl.show">
        <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList" />
    </div>

     <div v-else>
        <q-btn no-caps dense flat :icon="DMBTN.back.icon" @click="btnClick(DMBTN.back.id)">{{ $t("msgPnlAppList") }}</q-btn>
        <q-card flat class="q-mt-sm">
            <q-card-section> 
                <AppDetail></AppDetail>
            </q-card-section>
        </q-card>
     </div> -->


    
    

    <!-- 应用详情界面 -->
    <!-- <q-dialog persistent v-model="infoPnl.show">
        <dmDialog :title="infoPnl.res.title" class="full-width full-height">
            <q-splitter v-model="splitter_value" class="q-pa-md">  
                <template #before>
                    <q-tabs vertical v-model="detail_tabs.value" dense activeColor="primary">
                        <q-tab v-for="obj in detail_tabs.tabs" :key="obj" :name="obj.name" :label="obj.label"></q-tab>
                    </q-tabs>
                </template>
                <template #after>
                        <q-tab-panels v-model="detail_tabs.value">
                            <q-tab-panel name="a">
                                <AppDetail></AppDetail>
                            </q-tab-panel>
                            <q-tab-panel name="b">
                                B
                            </q-tab-panel>
                        </q-tab-panels>
                </template>
            </q-splitter>
        </dmDialog>
    </q-dialog> -->


</q-page>
</template>

<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { reactive } from 'vue';
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelApp } from "src/base/model";
import dmDialog from "src/components/dmDialog.vue";
import dmTbl from 'src/components/dmTbl.vue';
import dmInput from "src/components/dmInput.vue";
import dmManager from "src/components/dmManager.vue";
import AppDetail from "./AppDetail.vue";


const dm = new DMOBJ(useQuasar(),useRouter());
const { t } = useI18n()




const infoPnl = reactive({
    show:false,
    app_id:0,
})



const actRes = {
    // create: { title: "msgPnlOrgCreate", url: "/org/create" },
    // edit: { title: "msgPnlOrgEdit", url: "/org/update" },
    // delete: { title: "msgPnlOrgDelete", url: "/org/delete" },
    info:{title:"msgPnlAppInfo",url:""},
}



const tbl = reactive({
    dmQueryInput:{
        app_name:DMINPUT.text_query(modelApp.app_name),
        app_status:DMINPUT.select_query(modelApp.app_status),
    },
    // dmHeaderBtn:[DMBTN.create],
    dmRowBtn:[DMBTN.info],
    rows: [],
    pagination: null,
    columns:[
        DMTBL.col("app_name", modelApp.app_name.label),
        DMTBL.col("app_remark", modelApp.app_remark.label),
        DMTBL.col("updated_at", modelBase.updated_at.label),
        DMTBL.col("created_at", modelBase.created_at.label),
        {
            ...DMTBL.col("app_status", modelApp.app_status.label, modelApp.app_status.options), style: row => {
                let sts = modelApp.app_status
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
    switch(btnID){
        case DMBTN.info.id:
            infoPnl.show=true
            infoPnl.app_id = props.row.id
            break;
        case DMBTN.back.id:
            infoPnl.show=false;
            break;
        default:
            break;
    }
    
}

function getList(pagination){
    let data = {
        app_name:tbl.dmQueryInput.app_name.value,
        app_status:tbl.dmQueryInput.app_status.value
    }
    dm.dmTblGetList(pagination,tbl,"/app/list",data);
}
</script>