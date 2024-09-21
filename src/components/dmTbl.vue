<template>
    <q-table v-bind="qProps" :rows-per-page-options="rows_per_page_options" :pagination="pagination"
        v-model:pagination="pagination" @request="onRequest" class="q-pa-md" bordered flat>
        <template v-slot:top>
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

        <!-- 行操作栏 -->
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
    </q-table>
</template>

<script setup>
import { reactive,onMounted} from "vue"
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