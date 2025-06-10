<template>
  <div class="container">
    <el-card style="margin-top: 16px">
      <div>
        <el-button @click="goList()">返回</el-button>
        <!-- <el-button @click="handleExport()" type="primary">导出</el-button> -->
      </div>
      <el-descriptions style="margin-top: 12px" class="margin-top" :column="1" border label-width="200">
        <el-descriptions-item label="公司名称">{{ tableData?.companyName }}</el-descriptions-item>
        <el-descriptions-item label="证书">
          <el-tag v-for="item in tableData?.certificates?.split(',')" :key="item">
            {{ bokeDict.find((boke) => boke.id == item)?.codeItemName }}</el-tag
          >
        </el-descriptions-item>
        <el-descriptions-item label="净资产总额">{{ tableData?.netAssetsTotal }}</el-descriptions-item>
        <el-descriptions-item label="资产总额">{{ tableData?.assetsTotal }}</el-descriptions-item>
        <el-descriptions-item label="净利润">{{ tableData?.netProfit }}</el-descriptions-item>
        <el-descriptions-item label="营业收入">{{ tableData?.revenue }}</el-descriptions-item>
        <el-descriptions-item label="所属年份">{{ tableData?.year }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>
<script setup>
// import DownloadExcel from 'vue-json-excel';
import * as XLSX from "xlsx";
import { ElMessage } from "element-plus";
import { ref, reactive, watch, onMounted } from "vue";
import { getCompanyDetailApi, getTcdeeopyListApi, getIcdeemotListApi } from "./api";
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
const bokeDict = ref([]);
const getTcdeeopyList = async () => {
  const res = await getTcdeeopyListApi();
  const findItem = res.data.find((item) => item.codeTypeName === "证书");
  const result = await getIcdeemotListApi({
    codeTypeId: findItem.id,
  });
  if (result.status === 0) {
    bokeDict.value = result.data;
  } else {
    bokeDict.value = [];
  }
};
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
    path: "/company",
  });
};
const getBidList = async (companyName) => {
  try {
    loading.value = true;
    const res = await getCompanyDetailApi({
      companyName,
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
  getTcdeeopyList();
  if (route.query?.companyName) {
    getBidList(route.query.companyName);
  }
});
</script>
<style lang="scss">
.container {
  padding: 16px;
}
</style>
