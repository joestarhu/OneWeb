<template>
<q-page padding>
    <!-- 数据展示table -->
     <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList"></dmTbl>

    <!-- 弹窗 -->
    <q-dialog persistent v-model="actPnl.show">
        <dmDialog :title="actPnl.res.title">
            <dmForm @submit="btnClick(DMBTN.confirm.id)" :btnLoading="actPnl.res.loading">
                <div v-if="actPnl.res.title == actRes.delete.title">
                    {{t("msgOrg")}}:<span class="text-warning text-bold">{{  actPnl.data.org_name }}</span> {{ t("msgDeleteWarning") }}
                </div>
                <div v-else>
                    <div v-if="actPnl.loading">
                        <q-skeleton v-for="obj of detailPnl" :key="obj" class="q-mb-md" type="QInput"></q-skeleton>
                    </div>
                    <div v-else>
                        <dmInput v-for="obj of detailPnl" 
                        :key="obj" :qProps="obj.qProps" :dmType="obj.dmType" :dmAppend="obj.dmAppend" v-model="obj.value"
                        @filter="(val, update, abort) => filter(val, update, abort, obj.qProps)">
                        </dmInput>
                    </div>
                </div>

                <template #right_btn v-if="actPnl.loading">
                    <q-skeleton type="QBtn"></q-skeleton>
                </template>
            </dmForm>
        </dmDialog>
    </q-dialog>

    <!-- 详情弹窗 -->
    <q-dialog v-model="infoPnl.show">
        <dmDialog :title="infoPnl.res.title">
            <q-splitter v-model="splitterModel" separator-class="transparent">
                <template #before>
                    <q-tabs vertical v-model="tab" active-color="primary">
                        <q-tab name="mails"  label="基础信息" />
                        <q-tab name="alarms" label="应用信息" />
                        <q-tab name="movies" label="安全" />
                    </q-tabs>
                </template>

                <template #after>
                    <q-tab-panels v-model="tab" vertical>
                        <q-tab-panel name="mails">
                            <dmTbl v-bind="tbl" @btnClick="btnClick" @query="getList"></dmTbl>
                        </q-tab-panel>
                        <q-tab-panel name="alarms">
                            <q-card flat bordered class="text-center">
                                <p>组织名称:ASDASDADAS</p>
                            </q-card>
                        </q-tab-panel>
                        <q-tab-panel name="movies">
                            ...
                        </q-tab-panel>
                    </q-tab-panels>
                </template>
            </q-splitter>
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

const dm = new DMOBJ(useQuasar(),useRouter());
const {t} = useI18n();


let tab = ref("mails");
const splitterModel = 10;

const actRes = {
    create: { title: "msgPnlOrgCreate", url: "/org/create" },
    edit: { title: "msgPnlOrgEdit", url: "/org/update" },
    delete: { title: "msgPnlOrgDelete", url: "/org/delete" },
    info:{title:"msgPnlOrgInfo",url:""},
}

// 操作资源(请求地址和操作弹窗Title)
const actPnl = reactive({
    show: false,
    loading: false,
    res: actRes.create,
    data: null,
})

// info弹窗
const infoPnl = reactive({
    show:false,
    res: actRes.info,
})

const detailPnl = {
    org_name:DMINPUT.text_required({...modelOrg.org_name, rules:[val => val && val.toString().length > 0 || t("msgRequiredField")]}),
    user_uuid: DMINPUT.selectFilter({ ...modelOrg.owner_name, rules: [val => val && val.toString().length > 0 || t("msgRequiredField")] }),
    org_remark: DMINPUT.text({ ...modelOrg.remark, type: "textarea" }),
    org_status: DMINPUT.select(modelOrg.status),
}


const tbl = reactive({
    dmQueryInput:{
        org_name:DMINPUT.text_query(modelOrg.org_name),
        status:DMINPUT.select_query(modelOrg.status),
    },
    dmHeaderBtn:[DMBTN.create],
    dmRowBtn:[DMBTN.info],
    columns:[
        DMTBL.col("org_name",modelOrg.org_name.label),
        DMTBL.col("owner_name", modelOrg.owner_name.label),
        DMTBL.col("org_remark", modelOrg.remark.label),
        DMTBL.col("updated_at", modelBase.updated_at.label),
        DMTBL.col("created_at", modelBase.created_at.label),
        {
            ...DMTBL.col("org_status", modelUser.status.label, modelUser.status.options), style: row => {
                let sts = modelUser.status
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
            actPnl.show = true;
            actPnl.loading = false;
            actPnl.res = actRes.create;
            actPnl.data = props.row;
            detailInit();
            break;
        case DMBTN.edit.id:
            actPnl.show = true;
            actPnl.loading = true;
            actPnl.res = actRes.edit;
            actPnl.data = props.row;
            getDetail(props.row.org_uuid);
            break;
        case DMBTN.delete.id:
            actPnl.show = true;
            actPnl.loading = false;
            actPnl.res = actRes.delete;
            actPnl.data = props.row;
            break;
        case DMBTN.info.id:
            infoPnl.show =true;
            break;
        case DMBTN.confirm.id:
            break;
        default:break;
    }
}


function getList(pagination){
    let data = {
        page_idx:pagination.page,
        page_size:pagination.rowsPerPage,
        org_name:tbl.dmQueryInput.org_name.value,
        org_status:tbl.dmQueryInput.status.value,
    };

    dm.dmTblGetList(pagination,tbl,"/org/list",data);
}

function getDetail(org_uuid){
    dm.get("/org/detail",{org_uuid:org_uuid}, actPnl , (rsp)=>{
        getOwnerOptionsByUUID(rsp.data["user_uuid"])
        for(let kw in detailPnl){
            detailPnl[kw].value = rsp.data[kw]
        }  
    })
}


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