<template>
    <q-card class="card-pnl">
        <q-card-section class="row items-center ">
            <div class="col ellipsis">
                <span class="text-h6">
                    {{ $t(title) }}
                </span>
            </div>
            <div class="col row reverse">
                <q-btn icon="close" round flat dense v-close-popup />
            </div>
        </q-card-section>

        <q-form @submit="submit">
            <q-card-section>
                <slot></slot>
            </q-card-section>

            <q-card-section class="row" v-if="showAct == true">
                <div class="col">
                </div>
                <div class="col row reverse q-gutter-sm">
                    <q-btn color="primary" type="submit">{{ $t('msgYes') }}</q-btn>
                    <q-btn v-close-popup>{{ $t('msgNo') }}</q-btn>
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
    max-width: 88vw;
    max-height: 88vh;
    border-radius: 10px;
}
</style>