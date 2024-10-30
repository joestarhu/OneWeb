<template>
    <dmTbl v-bind="appSericesTbl" @query="getAppServicesList"></dmTbl>
</template>

<script setup lang="js">
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import { modelBase,modelUser } from "src/base/model";
import dmTbl from "src/components/dmTbl.vue";
import dmDialog from "src/components/dmDialog.vue";
import dmForm from "src/components/dmForm.vue";
import dmInput from "src/components/dmInput.vue";

const dm = new DMOBJ(useQuasar(),useRouter())
const props = defineProps({
    app_id:{type:Number,required:true},
})

const appSericesTbl = reactive({
    columns:[
        DMTBL.col("service_name","msgAccount"),
        DMTBL.col("service_tag","msgAccount"),
    ],
    rows:[],
    pagination:null,
})


function getAppServicesList(pagination){
    let data = {
            page_idx:pagination.page,
            page_size:pagination.rowsPerPage,
            app_id:props.app_id,
    }
    dm.dmTblGetList(pagination,appSericesTbl,"/app/service_list",data)
}






</script>