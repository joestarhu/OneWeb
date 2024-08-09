<template>
    <!-- 普通输入框:text -->
    <q-input v-if="dmType == 'text'" v-bind="qProps" v-model.trim="innerValue" :label="$t(qProps.label)">
        <template #append v-if="dmAppend==DMSETTINGS.dmInputAppendRequired">
                <q-icon size="0.5em" name="tag" />
                <span style="font-size: 0.5em">{{$t('msgRequired')}}</span>
        </template>
        <template #append v-else-if="dmAppend==DMSETTINGS.dmInputAppendQuery">
            <q-icon size="0.5em" name="search" />
        </template>
        <template #append v-else>
            <!-- nothings -->
        </template>
    </q-input>

    <!-- 普通选择框:select -->
    <q-select v-if="dmType == 'select'" v-bind="qProps" v-model.trim="innerValue" :label="$t(qProps.label)" emit-value map-options>
        <template #no-option>
            <q-item>
                <q-item-section class="text-grey">
                    {{ $t('msgNoData') }}
                </q-item-section>
            </q-item>
        </template>
        <template #option="scope">
            <q-item v-bind="scope.itemProps">
                <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.caption }}</q-item-label>
                </q-item-section>
            </q-item>
        </template>
    </q-select>

    <!-- 带查询能力的选择框:selectFilter -->
    <q-select v-if="dmType == 'selectFilter'" v-bind="qProps" v-model.trim="innerValue" :label="$t(qProps.label)" @filter="filterFn" emit-value map-options use-input>
        <template #no-option>
            <q-item>
                <q-item-section class="text-grey">
                    {{ $t('msgNoData') }}
                </q-item-section>
            </q-item>
        </template>
        <template #option="scope">
            <q-item v-bind="scope.itemProps">
                <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.caption }}</q-item-label>
                </q-item-section>
            </q-item>
        </template>
    </q-select>


</template>

<script setup>
import { ref,watch,watchEffect} from 'vue';
import { DMSETTINGS } from 'src/base/dm'

const emit = defineEmits(["update:modelValue","filter"])
const props = defineProps({
    qProps:{type:Object},
    modelValue:{required:true},
    dmType:{type:String,default:"text"},
    dmAppend:{type:Number,default:null},
})

const innerValue = ref(props.modelValue);

function filterFn(val, update, abort){
    emit("filter", val, update, abort);
}


// 监听内部值的改变，更新父组件的值
watch(innerValue,newValue=>{
    emit("update:modelValue", newValue)
});

// 父组件的值改变,子组件也变动
watchEffect(()=>{
    innerValue.value = props.modelValue;
});
</script>