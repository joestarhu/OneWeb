<template>
<q-tabs active-color="primary" class="text-grey" align="left" v-model="tabs.value">
    <q-tab v-for="obj in tabs.lists" :key="obj" :name="obj.name" :label="$t(obj.name)" no-caps />
</q-tabs>

<q-tab-panels v-model="tabs.value">
    <q-tab-panel name="msgPnlOrgBasicInfo">
        <OrgDetailBasic :org_uuid="props.org_uuid"></OrgDetailBasic>
    </q-tab-panel>

    <q-tab-panel name="msgPnlOrgUserInfo">
        组织用户信息
    </q-tab-panel>

    <q-tab-panel name="msgPnlOrgAppInfo">
        组织应用信息
    </q-tab-panel>

    <q-tab-panel name="msgPnlOrgSecurity">
        组织安全
    </q-tab-panel>

</q-tab-panels>

</template>


<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { ref,reactive, onMounted } from 'vue';
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelOrg } from "src/base/model";
import OrgDetailBasic from "./OrgDetailBasic.vue";


const dm = new DMOBJ(useQuasar(),null)




const props = defineProps({
    org_uuid:{required:true, type:String},
})

let pageError=ref(false)

const tabs = reactive({
    value:"msgPnlOrgBasicInfo",
    lists:[
        {name:"msgPnlOrgBasicInfo"},
        {name:"msgPnlOrgUserInfo"},
        {name:"msgPnlOrgAppInfo"},
        {name:"msgPnlOrgSecurity"},
    ]
})

const basicInfo = reactive({
    loading:false,
    fields:{
        org_name:{label:modelOrg.org_name.label,value:""},
        org_remark:{label:modelOrg.remark.label,value:""},
        owner_name:{label:modelOrg.owner_name.label, value:""},
        org_status:{label:modelOrg.status.label,value:""},
        updated_at:{label:modelBase.updated_at.label,value:""},
        created_at:{label:modelBase.created_at.label,value:""},
    }
})



function btnClick(btnID){

}




function getDetailInfo(){
    dm.get("/org/detail",{org_uuid:props.org_uuid},basicInfo,
        (rsp)=>{
            if(rsp.data == null){
                pageError.value=true
                return
            }

            for (let kw in basicInfo.fields) {
                basicInfo.fields[kw].value = rsp.data[kw];

                if(kw === "org_status"){
                    let sts = modelOrg.status;
                    for(let t in sts.options){
                        if(sts.options[t].value == basicInfo.fields[kw].value){
                            basicInfo.fields[kw].style = sts.options[t].style
                            basicInfo.fields[kw].value_label = sts.options[t].label
                        }
                    }
                }
            }
        },
        null,
    )
}

</script>