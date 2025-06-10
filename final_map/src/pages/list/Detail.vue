<template>
  <div class="container">

    <el-card style="margin-top: 16px;">
      <div><el-button @click="goList()">返回</el-button></div>
      <el-descriptions style="margin-top: 12px;" class="margin-top" :column="1" border label-width="200">
        <el-descriptions-item label="标的金额">{{ tableData?.bidAmount }}</el-descriptions-item>
        <el-descriptions-item label="分值">{{ tableData?.standardScore }}</el-descriptions-item>
        <el-descriptions-item label="按分类">{{ tableData?.category == 1 ? '平均值' : '最低值' }}</el-descriptions-item>
        <el-descriptions-item label=" " v-if="tableData?.category == 1"><el-space><span>超过1% </span><span
                  style="text-decoration: underline;">{{
                    tableData?.high }}</span>， <span>低于1%
            </span><span style="text-decoration: underline;">{{ tableData?.low }}</span>
          </el-space></el-descriptions-item>
      </el-descriptions>
      <el-table :data="tableData?.companyQuoteInfoDTOS" border style="width: 100%;margin-top: 16px;">
        <el-table-column v-for="item in columns" :key="item.value" :prop="item.value" :label="item.label">
          <template #default="{ row }" v-if="['standardScore', 'bidAmount'].includes(item.value)">

            <template v-if="item.value === 'bidAmount'">
              {{ tableData?.bidAmount }}
            </template>
            <template v-if="item.value === 'standardScore'">
              {{ tableData?.standardScore }}
            </template>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { getInfoBidListApi, } from './api'
import { useRoute, useRouter } from 'vue-router'
const columns = [
  {
    label: '公司名称',
    value: "companyName"
  },
  {
    label: '标的金额',
    value: "bidAmount"
  },
  {
    label: '预计基准价',
    value: "createTime"
  },
  {
    label: '标准分值',
    value: "standardScore"
  },
  {
    label: '折扣',
    value: "discount"
  },
  {
    label: '报价（万元）',
    value: "quotation"
  },
  {
    label: '价格得分',
    value: "priceScore"
  },


]
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const tableData = ref()
const goList = () => {
  router.push({
    path: '/list'
  })
}
const getBidList = async (bidNumber) => {
  try {
    loading.value = true
    const res = await getInfoBidListApi({
      bidNumber
    })

    if (res.status === 0) {
      console.log(res);
      tableData.value = res.data
    } else {
      tableData.value = []
    }
  } catch (error) {
    console.log(error);

  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query?.bidNumber) {
    getBidList(route.query.bidNumber)
  }
})
</script>
<style lang="scss">
.container {
  padding: 16px;
}
</style>