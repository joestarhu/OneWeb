<template>
    <!-- 普通输入框:text -->
    <q-input v-if="dmType == 'text'" v-bind="qProps" v-model.trim="innerValue">
        <!-- <template #label>
            {{ t("qProps.label") }}
        </template> -->
    </q-input>

    <!-- 查询输入框:query -->
    <q-input v-if="dmType == 'query'" :clearable="true" v-bind="qProps" v-model.trim="innerValue" >
        <template #append>
            <q-icon size="0.5em" name="search" />
        </template>
    </q-input>




</template>

<script>
import { defineComponent,ref,watch,watchEffect} from 'vue';

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
            innerValue,
            filterFn(val, update, abort){
                ctx.emit("filter", val, update, abort);
            }
        }
    }
})
</script>