<template>
  <el-button type="primary" @click="handleOpen()" v-if="!row?.bidNumber">
    <slot></slot>
  </el-button>
  <el-text v-else type="primary" style="cursor: pointer" @click="handleOpen()">
    <slot></slot>
  </el-text>

  <el-dialog v-model="visible" destroy-on-close :title="row?.bidNumber ? '编辑' : '添加'" width="800px" append-to-body>
    <el-form v-model="formData" label-width="100px">
      <el-form-item label="公司名称">
        <el-input v-model="formData.companyName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="证书">
        <el-select v-model="formData.certificates" multiple collapse-tags placeholder="请选择">
          <el-option v-for="item in bokeDict" :key="item.id" :label="item.codeItemName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="净资产总额">
        <el-input v-model="formData.netAssetsTotal" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="资产总额">
        <el-input v-model="formData.assetsTotal" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="净利润">
        <el-input v-model="formData.netProfit" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="营业收入">
        <el-input v-model="formData.revenue" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属年份">
        <el-input v-model="formData.year" placeholder="请输入" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit()">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from "vue";
import { AddCompanyApi, editCompanyApi, getCompanyDetailApi } from "../api/index";
import { ElMessage } from "element-plus";
const props = defineProps({
  row: {
    type: Object,
    default: () => {},
  },
  bokeDict: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(["submitOk"]);
const loading = ref(false);
const visible = ref(false);
const formData = ref({
  companyName: "",
  certificates: "",
  assetsTotal: "",
  liabilitiesTotal: "",
  netAssetsTotal: "",
  netProfit: "",
  revenue: "",
  year: "",
});
const getInfoBidList = async () => {
  try {
    const res = await getCompanyDetailApi({
      id: props.row.id,
    });
    console.log(res);

    if (res.status === 0) {
      formData.value = res.data;
    }
  } catch (error) {}
};
const handleOpen = () => {
  visible.value = true;
  if (props.row?.bidNumber) {
    getInfoBidList();
  }
};
const handleSubmit = async () => {
  try {
    loading.value = true;
    const params = {
      ...formData.value,
      certificates: formData.value.certificates.join(","),
    };
    let Api = AddCompanyApi;
    if (props.row?.bidNumber) {
      params.bidNumber = props.row.bidNumber;
      Api = editCompanyApi;
    }

    const res = await Api(params);
    if (res.status === 0) {
      visible.value = false;
      ElMessage.success("操作成功");
      emits("submitOk");
    }
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
const handleAdd = () => {
  formData.value.companyQuoteInfoDTOS.push({ ...defaultItem() });
};
const handleDelete = (index, item) => {
  formData.value.companyQuoteInfoDTOS.splice(index, 1);
};
</script>
<style lang="scss" scoped>
.add-item {
  background-color: #efefef;
  padding: 10px 100px 1px 0px;
  position: relative;
  margin-top: 8px;

  .del-btn {
    position: absolute;
    right: 10px;
    top: 35px;
  }
}
</style>
