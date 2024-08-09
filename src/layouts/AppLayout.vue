<template>
    <q-layout view="hHh Lpr lFf">
      <q-header>
        <q-toolbar>
          <q-toolbar-title >
            {{ $t("msgSysUC") }}
          </q-toolbar-title>
          <div><dmLanguage></dmLanguage></div>
          <div><dmAppearance></dmAppearance></div>
          <div><dmUserAvatar></dmUserAvatar></div>
        </q-toolbar>
      </q-header>  
      <q-page-container>
        <q-page padding>
            冬奥冬奥
        </q-page>
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>
  import { useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import { reactive,onMounted } from "vue";
  import { DMOBJ } from "src/base/dm";
  import dmLanguage from "src/components/dmLanguage.vue";
  import dmAppearance from "src/components/dmAppearance.vue";
  import dmUserAvatar from "src/components/dmUserAvatar.vue";
  
  const dm = new DMOBJ(useQuasar(),useRouter())

</script>