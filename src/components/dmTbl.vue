<template>
    <q-table v-bind="qProps" :rows-per-page-options="rows_per_page_options" :pagination="pagination"
        v-model:pagination="pagination" @request="onRequest" flat style="border-radius: 10px;" :rows-per-page-label="$t('msgRecordPerPage')">
        <template v-if="tblHeaderFlag" v-slot:top>
            <div class="col row q-col-gutter-xs">
                <dmInput v-for="obj in dmQueryInput" :key="obj" :qProps="obj.qProps" :dmType="obj.dmType" :dmAppend="obj.dmAppend"
                    v-model="obj.value" @update:model-value="onRequest(null)" />
            </div>
            <div class="col-inline reverse q-gutter-xs">
                <q-btn v-for="obj in dmHeaderBtn" :key="obj.id" :color="obj.color" :icon="obj.icon"
                    @click="btnClick(obj.id, props)" dense>
                    <q-tooltip>
                        {{$t(obj.label)}}
                    </q-tooltip>
                </q-btn>
            </div>
        </template>

        <!-- header的中英文处理 -->
        <template #header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props">
            {{ $t(col.label) }}
          </q-th>
        </q-tr>
      </template>

        <!-- 读取状态 -->
        <template v-slot:loading>
            <q-inner-loading showing color="primary">
            </q-inner-loading>
        </template>

        <!-- 无数据 -->
        <template v-slot:no-data>
        <div class="full-width row flex-center q-gutter-sm text-bold">
          <q-icon size="2em" name="o_warning" />
          <span>
             {{ $t("msgNoData") }}
          </span>
        </div>
      </template>

        <!-- 特殊行操作栏:btns -->
        <template #body-cell-btns="props">
            <q-td :props="props" class="q-gutter-xs">
                <q-btn v-for="obj in dmRowBtn" :key="obj.id" :color="obj.color" :icon="obj.icon"
                    @click="btnClick(obj.id, props)" dense>
                    <q-tooltip>
                        {{$t(obj.label)}}
                    </q-tooltip>
                </q-btn>
            </q-td>
        </template>

        <!-- q-table自身的slot -->
        <template #body-cell="props">
            <slot :name="`body-cell-${props.col.name}`" v-bind="props">
                <q-td :props="props">
                    <span >{{ props.value }}</span>
                </q-td>
            </slot>
        </template>

    </q-table>
</template>

<script setup>
import { reactive,onMounted,computed} from "vue"
import { DMSETTINGS} from "src/base/dm"
import dmInput from "src/components/dmInput.vue"

const emit = defineEmits(["btnClick","query"])
const props = defineProps({
        // quasar原始属性
        qProps:{type:Object},
        // 每行的操作按钮
        dmRowBtn:{default:[]},
        // 查询输入
        dmQueryInput:{ default:[]},
        // 头部操作按钮
        dmHeaderBtn:{default:[]},
})

const tblHeaderFlag = computed(()=>{
    // 没有搜索输入框和头部按钮则无需显示头部
    return Object.keys(props.dmHeaderBtn).length + Object.keys(props.dmQueryInput).length
    
})

const rows_per_page_options = [10, 20, 30, 100]
const pageSize = localStorage.getItem(DMSETTINGS.pageSize)
const pagination = reactive({page:1,rowsNumber:0, rowsPerPage:10})


function onRequest(data){
    if(data != null){
        pagination.page = data.pagination.page
        
        if(pagination.rowsPerPage != data.pagination.rowsPerPage){
            localStorage.setItem(DMSETTINGS.pageSize, data.pagination.rowsPerPage)
            pagination.rowsPerPage = data.pagination.rowsPerPage
        }
    }
    emit("query", pagination)
}

function btnClick(id,data){
    emit("btnClick", id, data)
}

onMounted(()=>{
    // 读取通用的数据
    if (pageSize) {
        pagination.rowsPerPage = pageSize
    }
    emit("query", pagination)
})
</script>