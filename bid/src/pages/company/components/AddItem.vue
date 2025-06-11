<template>
  <el-button type="primary" @click="handleOpen()" v-if="!row?.companyCode">
    <slot></slot>
  </el-button>
  <el-text v-else type="primary" style="cursor: pointer" @click="handleOpen()">
    <slot></slot>
  </el-text>

  <el-dialog v-model="visible" destroy-on-close :title="row?.companyCode ? '编辑' : '添加'" width="800px" append-to-body>
    <el-form v-model="formData" label-width="100px">
      <el-form-item label="公司名称">
        <el-input v-model="formData.companyName" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="证书">
        <el-select v-model="formData.certificates" multiple collapse-tags placeholder="请选择">
          <el-option v-for="item in bokeDict" :key="item.codeTypeId" :label="item.codeItemName"
                     :value="item.codeTypeId" />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-row>
          <el-button type="primary" @click="handleAdd()">添加</el-button>
        </el-row>
      </el-form-item>
      <div v-for="(item, index) in formData.financialInfos" :key="index" class="add-item">
        <el-form-item label="净资产总额">
          <el-input v-model="item.netAssetsTotal" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="资产总额">
          <el-input v-model="item.assetsTotal" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="净利润">
          <el-input v-model="item.netProfit" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="营业收入">
          <el-input v-model="item.revenue" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属年份">
          <el-input v-model="item.year" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-button type="danger" class="del-btn" @click="handleDelete(index, item)">删除</el-button>
      </div>
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
    default: () => { },
  },
  bokeDict: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(["submitOk"]);
const defaultItem = () => {
  return {
    netAssetsTotal: "",
    assetsTotal: "",
    netProfit: 0,
    revenue: 0,
    year: 0
  }
}
const loading = ref(false);
const visible = ref(false);
const formData = ref({
  companyName: "",
  companyCode: "",
  liabilitiesTotal: "",
  financialInfos: [{ ...defaultItem() }],
});
const getInfoBidList = async () => {
  try {
    const res = await getCompanyDetailApi({
      companyCode: props.row.companyCode,
    });
    console.log(res);

    if (res.status === 0) {
      formData.value = res.data;
      formData.value.certificates = res.data.certificates ? res.data.certificates.split(",")?.map(item => Number(item)) : [];
    }
  } catch (error) { }
};
const handleOpen = () => {
  visible.value = true;
  if (props.row?.companyCode) {
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
    if (props.row?.companyCode) {
      params.companyCode = props.row.companyCode;
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
  formData.value.financialInfos.push({ ...defaultItem() });
};
const handleDelete = (index, item) => {
  formData.value.financialInfos.splice(index, 1);
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
