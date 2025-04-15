<script lang="ts" setup>
import { useUserStore } from "@/pinia/stores/user"
import Admin from "./components/Admin.vue"
import Editor from "./components/Editor.vue"
import TencentMap from "./components/TencentMap.vue"
import TencentMap2 from "./components/TencentMap2.vue"
import TencentMap3 from "./components/TencentMap3.vue"
const userStore = useUserStore()
const isAdmin = userStore.roles.includes("admin")

</script>

<template>
  <!-- <component :is="isAdmin ? Admin : Editor" /> -->
  <!-- <TencentMap></TencentMap> -->
  <!-- <TencentMap2></TencentMap2> -->
  <TencentMap3></TencentMap3>
</template>
