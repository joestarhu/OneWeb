<template>
<span>{{ role_id }}</span>
<!-- 展示各个应用 -->

</template>

<script setup lang="js">
const props = defineProps({
    role_id:{type:Number, required:true},
})

</script>