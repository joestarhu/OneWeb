<template>
    <q-table v-bind="qProps" :rows-per-page-options="rows_per_page_options" :pagination="pagination"
        v-model:pagination="pagination" @request="onRequest" class="q-pa-md" >
        <template v-slot:top>
            <div class="col row q-col-gutter-xs">
                <dmInput v-for="obj in dmQueryInput" :key="obj" :qProps="obj.qProps" :dmType="obj.dmType"
                    v-model="obj.value" @update:model-value="onRequest(null)" />
            </div>
            <div class="col-inline reverse q-gutter-xs">
                <q-btn v-for="obj in dmHeaderBtn" :key="obj.id" :label="$t(obj.label)" :color="obj.color" :icon="obj.icon"
                    @click="btnClick(obj.id, props)" />
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
                    @click="btnClick(obj.id, props)" dense outline rounded>
                    <q-tooltip>
                        {{$t(obj.label)}}
                    </q-tooltip>
                </q-btn>
            </q-td>
        </template>
    </q-table>
</template>

<script>
import { defineComponent,ref,onMounted} from "vue"
import { DMSETTINGS} from "src/base/dm"
import dmInput from "src/components/dmInput.vue"

export default defineComponent({
    name:"dmTbl",
    emits:["btnClick","query"],
    components:{dmInput},
    props:{
        // quasar原始属性
        qProps:{type:Object},
        // 每行的操作按钮
        dmRowBtn:{default:[]},
        // 查询输入
        dmQueryInput:{ default:[]},
        // 头部操作按钮
        dmHeaderBtn:{default:[]},
    },

    setup(props,ctx){
        const rows_per_page_options = [10, 20, 30, 100]
        const pageSize = localStorage.getItem(DMSETTINGS.pageSize)
        const pagination = ref({page:1,rowsNumber:0, rowsPerPage:10})

        function onRequest(data){
            if(data != null){
                pagination.value.page = data.pagination.page
                if(pagination.value.rowsPerPage != data.pagination.rowsPerPage){
                    localStorage.setItem(DMSETTINGS.pageSize, data.pagination.rowsPerPage)
                    pagination.value.rowsPerPage = data.pagination.rowsPerPage
                }
            }
            ctx.emit("query", pagination.value)
        }

        function btnClick(id,data){
            ctx.emit("btnClick", id, data)
        }


        onMounted(()=>{
            // 读取通用的数据
            if (pageSize) {
                pagination.value.rowsPerPage = pageSize
            }
            ctx.emit("query", pagination.value)
        })

        return {
            pagination,
            rows_per_page_options,
            btnClick,
            onRequest,
        }
    }
})
</script>