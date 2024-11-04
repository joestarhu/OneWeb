<template>
<q-page padding>
    <!-- 组织列表 -->
    <dmManager title="msgPnlOrgList" :showDetail="infoPnl.show" @click="btnClick">
        <template #list>
            <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList" />
        </template>
        <template #detail>
            <q-tabs active-color="primary" class="text-grey" align="left" v-model="tabs.value">
                <q-tab v-for="obj in tabs.lists" :key="obj" :name="obj.name" :label="$t(obj.name)" no-caps />
            </q-tabs>

            <q-tab-panels v-model="tabs.value">
                <q-tab-panel name="msgPnlOrgBasicInfo">
                    <OrgDetailBasic :org_uuid="infoPnl.org_uuid"></OrgDetailBasic>
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

            <!-- <OrgDetail :org_uuid="infoPnl.org_uuid"></OrgDetail> -->
        </template>
    </dmManager>

    <!-- 新增 -->
    <q-dialog persistent v-model="actPnl.show">
        <dmDialog :title="actPnl.res.title">
            <dmForm @submit="btnClick(DMBTN.confirm.id)" :btnLoading="actPnl.res.loading">
                <dmInput v-for="obj of detailPnl" 
                        :key="obj" :qProps="obj.qProps" :dmType="obj.dmType" :dmAppend="obj.dmAppend" v-model="obj.value"
                        @filter="(val, update, abort) => filter(val, update, abort, obj.qProps)">
                        </dmInput>
            </dmForm>
        </dmDialog>
    </q-dialog>
</q-page>
</template>

<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ref,reactive } from "vue";
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelUser,modelOrg } from "src/base/model";
import dmTbl from "src/components/dmTbl.vue";
import dmDialog from "src/components/dmDialog.vue";
import dmForm from "src/components/dmForm.vue";
import dmInput from "src/components/dmInput.vue";
import dmManager from "src/components/dmManager.vue";
import OrgDetail from "./OrgDetail.vue";
import OrgDetailBasic from "./OrgDetailBasic.vue";

const dm = new DMOBJ(useQuasar(),useRouter());
const {t} = useI18n();

const tabs = ref({
    value:"msgPnlOrgBasicInfo",
    lists:[
        {name:"msgPnlOrgBasicInfo"},
        {name:"msgPnlOrgUserInfo"},
        {name:"msgPnlOrgAppInfo"},
        {name:"msgPnlOrgSecurity"},
    ]
})

const infoPnl = reactive({
    show:false,
    org_uuid:"",
})

const actRes = {
    create: { title: "msgPnlOrgCreate", url: "/org/create" },
}

// 操作资源(请求地址和操作弹窗Title)
const actPnl = reactive({
    show: false,
    loading: false,
    res: actRes.create,
    data: null,
})

const detailPnl = {
    org_name:DMINPUT.text_required({...modelOrg.org_name, rules:[val => val && val.toString().length > 0 || t("msgRequiredField")]}),
    user_uuid: DMINPUT.selectFilter({ ...modelOrg.owner_name, rules: [val => val && val.toString().length > 0 || t("msgRequiredField")] }),
    org_remark: DMINPUT.text({ ...modelOrg.org_remark, type: "textarea" }),
    org_status: DMINPUT.select(modelOrg.org_status),
}

const tbl = reactive({
    dmQueryInput:{
        org_name:DMINPUT.text_query(modelOrg.org_name),
        status:DMINPUT.select_query(modelOrg.org_status),
    },
    dmHeaderBtn:[DMBTN.create],
    dmRowBtn:[DMBTN.info],
    columns:[
        DMTBL.col("org_name",modelOrg.org_name.label),
        DMTBL.col("owner_name", modelOrg.owner_name.label),
        DMTBL.col("org_remark", modelOrg.org_remark.label),
        DMTBL.col("updated_at", modelBase.updated_at.label),
        DMTBL.col("created_at", modelBase.created_at.label),
        {
            ...DMTBL.col("org_status", modelOrg.org_status.label, modelOrg.org_status.options), style: row => {
                let sts = modelOrg.org_status
                for (let t in sts.options) {
                    if (sts.options[t].value == row.org_status) {
                        return sts.options[t].style
                    }
                }
                return ""
            }
        },
        DMTBL.btn("org_uuid")
    ],
    rows:[],
    pagination:null,
})

function detailInit(){
    detailPnl.org_name.value = ""
    detailPnl.user_uuid.value=""
    detailPnl.org_remark.value=""
    detailPnl.org_status.value = 1
}

function btnClick(btnID, props = null){
    switch(btnID){
        case DMBTN.create.id:
            detailInit();
            actPnl.show = true;
            actPnl.loading = false;
            actPnl.res = actRes.create;
            break;
        // case DMBTN.edit.id:
        //     actPnl.show = true;
        //     actPnl.loading = true;
        //     actPnl.res = actRes.edit;
        //     actPnl.data = props.row;
        //     getDetail(props.row.org_uuid);
        //     break;
        // case DMBTN.delete.id:
        //     actPnl.show = true;
        //     actPnl.loading = false;
        //     actPnl.res = actRes.delete;
        //     actPnl.data = props.row;
        //     break;
        case DMBTN.info.id:
            infoPnl.show =true;
            infoPnl.org_uuid = props.row.org_uuid;
            tabs.value.value = "msgPnlOrgBasicInfo";
            break;
        case DMBTN.confirm.id:
            let requestData = {
                org_name:detailPnl.org_name.value,
                owner_uuid:detailPnl.user_uuid.value,
                org_remark:detailPnl.org_remark.value,
                org_status:detailPnl.org_status.value
            }

            dm.post(actPnl.res.url, requestData, actPnl,
                (rsp)=>{
                    dm.msgOK({ message: t('msgSuccess') })
                    getList(tbl.pagination)
                    actPnl.show = false
                },
                null
            );
            break;
        case DMBTN.back.id:
            infoPnl.show=false;
            getList(tbl.pagination)
        default:break;
    }
}


function getList(pagination){
    let data = {
        org_name:tbl.dmQueryInput.org_name.value,
        org_status:tbl.dmQueryInput.status.value,
    };

    dm.dmTblGetList(pagination,tbl,"/org/list",data);
}

// function getDetail(org_uuid){
//     dm.get("/org/detail",{org_uuid:org_uuid}, actPnl , (rsp)=>{
//         getOwnerOptionsByUUID(rsp.data["user_uuid"])
//         for(let kw in detailPnl){
//             detailPnl[kw].value = rsp.data[kw]
//         }  
//     })
// }


function filter(val,update,abort,tag){
    update(()=>{
        getOwnerOptions(val)
    })
}

function getOwnerOptions(val){
    let data = {
        nick_name:val,
        org_status:1,
    }

    let uuidSelectProps = detailPnl.user_uuid.qProps
    dm.get("/account/list",data,uuidSelectProps,(rsp)=>{
        uuidSelectProps.options = []
        for (let x of rsp.data.records) {
            let caption = t("msgPhone") + ':' + x.phone + " | " + t("msgNickName") + ':' + x.nick_name
            uuidSelectProps.options.push({ label: x.nick_name, value: x.user_uuid, caption: caption })
        }        
    })
}

function getOwnerOptionsByUUID(user_uuid){
    let uuidSelectProps = detailPnl.user_uuid.qProps
    dm.get("/account/detail",{user_uuid:user_uuid},uuidSelectProps,(rsp)=>{
        uuidSelectProps.options = []
        let x = rsp.data
        let caption = t("msgPhone") + ':' + x.phone + " | " + t("msgNickName") + ':' + x.nick_name
        uuidSelectProps.options.push({ label: x.nick_name, value: user_uuid, caption: caption })
    })
}
</script>