<template>
    <q-item-label header class="text-weight-bold text-uppercase" v-if="title">
        {{ $t(title) }}
    </q-item-label>
    <q-expansion-item hide-expand-icon class="overflow-hidden dm_memu" active-class="dm_menu_active"
        v-for="info in children" :icon="info.icon ? info.icon : 'widgets'" :key="info" :label=$t(info.title)
        :to="info.to" :href="info.link">
    </q-expansion-item>
</template>


<script>
import { defineComponent } from "vue"

export default defineComponent({
    name: "dmMenu",
    props: {
        // 标题
        title: { type: String, required: true },
        // 副标题:未实现
        caption: { type: String, default: "" },
        // 图标
        icon: { type: String, default: "" },
        // 跳转路由链接:未实现
        to: { type: String, default: "#" },
        // 子菜单
        children: { type: Object, default: null },
    }
})
</script>

<style scss>
.dm_memu {
    border-radius: 5px;
}

.dm_memu:hover {
    /* color: var(--q-color-primary); */
    color: #666dff;
}

.dm_menu_active {
    background-color: #666dff;
    /* background-color: var(--q-color-primary); */
    border-radius: 1px;
    color: #FFF;
    font-weight: 800;
}
</style>