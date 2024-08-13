<template>
<q-page padding>
    <div>
    <q-splitter v-model="splitterModel">

      <template v-slot:before>
        <q-list separator> 
            <q-item clickable>
                <q-item-section avatar @click="itemClick">
                    <q-icon color="primary" name="hub" />
                </q-item-section>

                <q-item-section @click="itemClick">
                  <q-item-label class="text-bold">One Manager</q-item-label>
                  <q-item-label caption class="ellipsis">用于维护账号,组织,角色,应用等信息</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-btn icon="more_vert" dense flat>
                        <q-popup-proxy>
                            <q-btn flat v-close-popup>Edit</q-btn>
                        </q-popup-proxy>
                    </q-btn>
                </q-item-section>
            </q-item>


            <q-item clickable>
                <q-item-section avatar @click="itemClick">
                    <q-icon color="primary" name="person" />
                </q-item-section>

                <q-item-section @click="itemClick">
                  <q-item-label class="text-bold">One</q-item-label>
                  <q-item-label caption class="ellipsis">统一用户中心;管理用户,角色,部门和权限</q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-btn icon="more_vert" dense flat>
                        <q-popup-proxy>
                            <q-btn flat v-close-popup>Edit</q-btn>
                        </q-popup-proxy>
                    </q-btn>
                </q-item-section>
            </q-item>
        </q-list>
      </template>

      <template v-slot:after>

      </template>
    </q-splitter>
  </div>





</q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { ref,reactive } from 'vue';
import { DMOBJ,DMTBL,DMINPUT,DMBTN } from "src/base/dm";
import dmTbl from 'src/components/dmTbl.vue';
import dmInput from "src/components/dmInput.vue";

const dm = new DMOBJ(useQuasar(),useRouter());
let splitterModel=ref(30)

function btnClick(){
    dm.msgOK({message:"btnClick"})
}

function itemClick(){
    dm.msgNG({message:"itemClick"})
}


</script>