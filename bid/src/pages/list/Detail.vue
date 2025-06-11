<template>
  <div class="container">
    <el-card style="margin-top: 16px">
      <div>
        <el-button @click="goList()">返回</el-button><el-button @click="handleExport()" type="primary">导出</el-button>
      </div>
      <el-descriptions style="margin-top: 12px" class="margin-top" :column="1" border label-width="200">
        <el-descriptions-item label="项目名称">{{ tableData?.projectName }}</el-descriptions-item>
        <el-descriptions-item label="标的金额（万元）">{{
          tableData?.companyQuoteInfoDTOS[0].bidAmount
        }}</el-descriptions-item>
        <el-descriptions-item label="分值">{{ tableData?.companyQuoteInfoDTOS[0].standardScore }}</el-descriptions-item>
        <el-descriptions-item label="按分类">{{ tableData?.category == 1 ? "平均值" : "最低值" }}</el-descriptions-item>
        <el-descriptions-item label=" " v-if="tableData?.category == 1"
          ><el-space
            ><span>超过1% </span><span style="text-decoration: underline">{{ tableData?.high }}</span
            >， <span>低于1% </span><span style="text-decoration: underline">{{ tableData?.low }}</span>
          </el-space></el-descriptions-item
        >
      </el-descriptions>
      <el-table :data="tableData?.companyQuoteInfoDTOS" border style="width: 100%; margin-top: 16px">
        <el-table-column v-for="item in columns" :key="item.value" :prop="item.value" :label="item.label">
          <template #default="{ row }">
            <template v-if="item.value === 'companyName'">
              <el-text type="primary" style="cursor: pointer" @click="goCompanyDetail(row.companyName)">{{
                row.companyName
              }}</el-text>
            </template>
          </template>
          <!-- <template #default="{ row }" v-if="['standardScore', 'bidAmount','estimatedBasePrice'].includes(item.value)">

            <template v-if="item.value === 'bidAmount'">
              {{ tableData?.bidAmount }}
            </template>
            <template v-if="item.value === 'estimatedBasePrice'">
              {{ tableData?.estimatedBasePrice }}
            </template>
            <template v-if="item.value === 'standardScore'">
              {{ tableData?.standardScore }}
            </template>
          </template> -->
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
// import DownloadExcel from 'vue-json-excel';
import * as XLSX from "xlsx";
import { ElMessage } from "element-plus";
import { ref, reactive, watch, onMounted } from "vue";
import { getInfoBidListApi } from "./api";
import { useRoute, useRouter } from "vue-router";
const columns = [
  {
    label: "公司名称",
    value: "companyName",
  },
  {
    label: "标的金额（万元）",
    value: "bidAmount",
  },
  {
    label: "预计基准价（万元）",
    value: "estimatedBasePrice",
  },
  {
    label: "分值",
    value: "standardScore",
  },
  {
    label: "折扣",
    value: "discount",
  },
  {
    label: "报价（万元）",
    value: "quotation",
  },
  {
    label: "价格得分",
    value: "priceScore",
  },
];
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const tableData = ref();

const handleExport = () => {
  try {
    // 转换数据格式
    const ws_data = tableData.value.companyQuoteInfoDTOS.map((item) => ({
      公司名称: item.companyName,
      "标的金额（万元）": item.bidAmount,
      "预计基准价（万元）": item.estimatedBasePrice,
      标准分值: item.standardScore,
      折扣: item.discount,
      "报价（万元）": item.quotation,
      价格得分: item.priceScore,
    }));

    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(ws_data);

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "导出数据");

    // 设置列宽
    const wscols = [{ wch: 40 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    ws["!cols"] = wscols;

    // 导出文件
    XLSX.writeFile(wb, "导出数据.xlsx");

    ElMessage.success("导出成功！");
  } catch (error) {
    console.error("导出 Excel 失败:", error);
    ElMessage.error("导出失败，请重试！");
  }
};

const goList = () => {
  router.push({
    path: "/list",
  });
};
const goCompanyDetail = (companyName) => {
  router.push({
    path: `/company/detail`,
    query: {
      companyName: companyName,
    },
  });
};
const getBidList = async (bidNumber) => {
  try {
    loading.value = true;
    const res = await getInfoBidListApi({
      bidNumber,
    });

    if (res.status === 0) {
      console.log(res);
      tableData.value = res.data;
    } else {
      tableData.value = [];
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (route.query?.bidNumber) {
    getBidList(route.query.bidNumber);
  }
});
</script>
<style lang="scss">
.container {
  padding: 16px;
}
</style>
