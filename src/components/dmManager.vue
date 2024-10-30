<template>
<div v-if="!show">
    <slot name="list"></slot>
</div>
<div v-if="show">
    <q-btn no-caps dense flat :icon="DMBTN.back.icon" @click="btnClick(DMBTN.back.id)">{{ $t(props.title) }}</q-btn>
    <q-card flat class="q-mt-sm">
        <q-card-section>
            <slot name="detail"></slot>
        </q-card-section>
    </q-card>

</div>
</template>

<script setup lang="js">
import { DMBTN } from "src/base/dm";
import { computed } from "vue";

const emit = defineEmits(["click"])
const props = defineProps({
    title:{type:String,required:true,default:"msgPnlOrgList"},
    showDetail:{type:Boolean, required:true,default:false},
})

let show = computed(()=>{
    return props.showDetail
})


function btnClick(btnID){
    emit("click",btnID)
}


</script>