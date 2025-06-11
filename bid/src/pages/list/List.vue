<template>
  <div class="container">
    <el-space>
      <AddItem @submitOk="getBidList()">新增</AddItem>
      <!-- <download-excel :data="tableData" :fields="jsonFields" name="导出数据.xlsx" class="btn btn-default">
                导出 Excel
            </download-excel> -->
      <el-button @click="handleExport()">导出</el-button>
      <!-- <el-button type="primary" @click="getBidList()">查询</el-button> -->
      <el-button  @click="getCompany()">公司信息</el-button>
    </el-space>
    <el-card style="margin-top: 16px">
      <el-table :data="tableData" :load="loading" border style="width: 100%">
        <el-table-column v-for="item in columns" :key="item.value" :prop="item.value" :label="item.label">
          <template #default="{ row }" v-if="['handle'].includes(item.value)">
            <template v-if="item.value === 'handle'">
              <el-space>
                <el-text type="primary" style="cursor: pointer" @click="goDetail(row)">查看</el-text>
                <AddItem @submitOk="getBidList()" :row="row">编辑</AddItem>
                <el-popconfirm title="确定删除吗?" @confirm="handleDelete(row)">
                  <template #reference>
                    <el-text type="danger" style="cursor: pointer">删除</el-text>
                  </template>
                </el-popconfirm>
              </el-space>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
// import DownloadExcel from 'vue-json-excel';
import * as XLSX from "xlsx";
import { ref, reactive, watch, onMounted } from "vue";
import { getBidListApi, deleteBidListApi } from "./api";
import AddItem from "./components/AddItem.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const jsonFields = {
  ID: "bidNumber",
  标的金额: "bidAmount",
  日期: "createTime",
};
const columns = [
  {
    label: "ID",
    value: "bidNumber",
  },
  {
    label: "项目名称",
    value: "projectName",
  },
  {
    label: "标的金额(万元)",
    value: "bidAmount",
  },
  {
    label: "日期",
    value: "createTime",
  },
  {
    label: "操作",
    value: "handle",
  },
];
const router = useRouter();
const loading = ref(false);
const tableData = ref([]);

const handleExport = () => {
  try {
    // 转换数据格式
    const ws_data = tableData.value.map((item) => ({
      ID: item.bidNumber,
      项目名称: item.projectName,
      标的金额: item.bidAmount,
      日期: item.createTime,
    }));

    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(ws_data);

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "导出数据");

    // 设置列宽
    const wscols = [{ wch: 20 }, { wch: 20 }, { wch: 20 }];
    ws["!cols"] = wscols;

    // 导出文件
    XLSX.writeFile(wb, "导出数据.xlsx");

    ElMessage.success("导出成功！");
  } catch (error) {
    console.error("导出 Excel 失败:", error);
    ElMessage.error("导出失败，请重试！");
  }
};

const getCompany = (item) => {
  console.log(item);
  router.push({
    path: `/company`,
  });
};
const getBidList = async () => {
  try {
    loading.value = true;
    const res = await getBidListApi();
    console.log(res);

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
const handleDelete = async (item) => {
  try {
    loading.value = true;
    const res = await deleteBidListApi({
      bidNumber: item.bidNumber,
    });
    if (res.status === 0) {
      ElMessage.success("删除成功");
      getBidList();
    }
  } catch (error) {}
};
const goDetail = (item) => {
  console.log(item);
  router.push({
    path: `/detail`,
    query: {
      bidNumber: item.bidNumber,
    },
  });
};

onMounted(() => {
  getBidList();
});
</script>
<style lang="scss">
.container {
  padding: 16px;
}
</style>
