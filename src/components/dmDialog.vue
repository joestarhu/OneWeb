<template>
    <q-card class="card-pnl">
        <q-card-section class="row items-center q-px-md q-pt-md q-pb-none">
            <div class="col ellipsis">
                <span class="text-h6">{{ $t(title) }}</span>
            </div>
            <div class="col row reverse">
                <q-btn icon="close" round flat dense v-close-popup />
            </div>
        </q-card-section>

        <q-form @submit.prevent="submit">
            <q-card-section class="q-pa-none">
                <slot></slot>
            </q-card-section>

            <q-card-section class="row q-pa-none" v-if="showAct == true">
                <div class="col">
                </div>
                <div class="col row reverse q-gutter-sm">
                    <q-btn no-caps color="primary" type="submit">{{ $t('msgYes') }}</q-btn>
                    <q-btn no-caps flat v-close-popup>{{ $t('msgNo') }}</q-btn>
                </div>
            </q-card-section>
        </q-form>
    </q-card>
</template>


<script setup>

const props = defineProps({
    title:{type:String, default:"Title"},
    showAct:{type:Boolean,default:false},
})
const emit = defineEmits(['submit']);

function submit(){
    emit("submit")
}
</script>

<style scoped>
.card-pnl {
    min-width: 500px;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 10px;
}
</style>