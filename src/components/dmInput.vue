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
</template>

<script>
import { defineComponent,ref,watch,watchEffect} from 'vue';
import { DMSETTINGS } from 'src/base/dm'

export default defineComponent({
    name:"dmInput",
    emits:["update:modelValue","filter"],
    props:{
        qProps:{
            type:Object
        },
        modelValue:{
            required:true
        },
        dmType:{
            type:String,
            default:"text",
        },
        dmAppend:{
            type:Number,
            default:null,
        },
    },
    setup(props,ctx){
        const innerValue = ref(props.modelValue);

        // 监听内部值的改变，更新父组件的值
        watch(
            innerValue, newValue=>{
                ctx.emit("update:modelValue", newValue);
            }
        );

        // 父组件的值改变,子组件也变动
        watchEffect(()=>{
            innerValue.value = props.modelValue;
        });

        return{
            DMSETTINGS,
            innerValue,
            filterFn(val, update, abort){
                ctx.emit("filter", val, update, abort);
            }
        }
    }
})
</script>