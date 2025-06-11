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
          <el-space>
            <el-tag v-for="item in tableData?.certificates?.split(',')" :key="item">
              {{bokeDict.find((boke) => boke.id == item)?.codeItemName}}</el-tag>
          </el-space>
        </el-descriptions-item>
      </el-descriptions>
      <el-table :data="tableData?.financialInfos" border style="width: 100%; margin-top: 16px">
        <el-table-column v-for="item in columns" :key="item.value" :prop="item.value"
                         :label="item.label"></el-table-column>
      </el-table>
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
    label: "所属年份",
    value: "year",
  },
  {
    label: "净资产总额",
    value: "netAssetsTotal",
  },
  {
    label: "资产总额",
    value: "assetsTotal",
  },
  {
    label: "净利润",
    value: "netProfit",
  },
  {
    label: "资产负债率",
    value: "debtAssetRatio",
  },
  {
    label: "营业收入",
    value: "revenue",
  },
  {
    label: "负债总计",
    value: "liabilitiesTotal",
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
const getBidList = async (companyCode) => {
  try {
    loading.value = true;
    const res = await getCompanyDetailApi({
      companyCode,
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
  console.log(route);

  if (route.query?.companyCode) {
    getBidList(route.query.companyCode);
  }
});
</script>
<style lang="scss">
.container {
  padding: 16px;
}
</style>
