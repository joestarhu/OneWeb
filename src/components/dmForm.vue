<template>
    <q-card class="card-pnl" flat>
        <q-card-section class="row q-pt-none q-pb-none" v-if="title != ''">
            <div class="col ellipsis">
                <span class="text-bold">
                    {{ $t(title) }}
                </span>
            </div>
        </q-card-section>

        <q-form @submit.prevent="submit">
            <q-card-section>
                <slot></slot>
            </q-card-section>

            <q-card-section class="row q-pt-none">
                <div class="col">
                    <slot name="left_btn"></slot>
                </div>
                <div class="col row reverse q-gutter-sm">
                    <slot name="right_btn">
                        <q-btn color="primary" type="submit" :loading="btnLoading">{{ $t(btnMsg) }}</q-btn>
                        <q-btn v-close-popup>{{ $t('msgNo') }}</q-btn>
                    </slot>
                </div>
            </q-card-section>
        </q-form>
    </q-card>
</template>

<script setup>
const emit = defineEmits(["submit"])
const props = defineProps({
    title: {type: String, default: ""},
    btnMsg: {type: String,default: "msgYes"},
    btnLoading: {type: Boolean,default: false},
})

function submit(){
    emit("submit")
}
</script>

<style scoped>
.card-pnl {
    max-width: 88vw;
    max-height: 88vh;
}
</style>
