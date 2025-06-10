<template>
  <el-button type="primary" @click="handleOpen()" v-if="!row?.bidNumber">
    <slot></slot>
  </el-button>
  <el-text v-else type="primary" style="cursor: pointer;" @click="handleOpen()">
    <slot></slot>
  </el-text>

  <el-dialog v-model="visible" destroy-on-close :title="row?.bidNumber ? '编辑' : '添加'" width="800px" append-to-body>
    <el-form v-model="formData" label-width="100px">
      <el-form-item label="标的金额">
        <el-input v-model="formData.bidAmount" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="分值">
        <el-input v-model="formData.standardScore" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="按分类">
        <el-radio-group v-model="formData.category" class="ml-4">
          <el-radio :label="1">平均值</el-radio>
          <el-radio :label="2">最低值</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="formData.category === 1">
        <el-form-item label=" ">
          <el-space><span>超过1%</span><el-input-number size="small" style="width: 100px;" v-model="formData.high"
                             placeholder="请输入"></el-input-number><span>低于1% </span><el-input-number size="small"
                             v-model="formData.low" placeholder="请输入" style="width: 100px;"></el-input-number>
          </el-space>
        </el-form-item>
      </template>
      <el-form-item label=" ">
        <el-row>
          <el-button type="primary" @click="handleAdd()">添加</el-button>
        </el-row>
      </el-form-item>
      <div v-for="(item, index) in formData.companyQuoteInfoDTOS" :key="index" class="add-item">

        <el-form-item label="公司名称">
          <el-input v-model="item.companyName" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="报价">
          <el-input v-model="item.discount" placeholder="请输入" clearable></el-input>
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
import { reactive, ref } from 'vue'
import { AddBidListApi, editBidListApi, getInfoBidListApi } from '../api/index'
import { ElMessage } from "element-plus"
const props = defineProps({
  row: {
    type: Object,
    default: () => { }
  }
})
const emits = defineEmits(['submitOk'])
const defaultItem = () => {
  return {
    companyName: "",
    discount: 0,
    priceScore: 0,
    quotation: 0
  }
}
const loading = ref(false)
const visible = ref(false)
const formData = ref({
  bidAmount: '',
  standardScore: '',
  category: 1,
  high: 0.5,
  low: 0.3,
  companyQuoteInfoDTOS: [
    { ...defaultItem() }
  ]
})
const getInfoBidList = async () => {
  try {
    const res = await getInfoBidListApi({
      bidNumber: props.row.bidNumber
    })
    console.log(res);

    if (res.status === 0) {
      formData.value = res.data
    }
  } catch (error) {

  }
}
const handleOpen = () => {
  visible.value = true
  if (props.row?.bidNumber) {
    getInfoBidList()
  }
}
const handleSubmit = async () => {
  try {
    loading.value = true
    const params = {
      ...formData.value,
    }
    let Api = AddBidListApi
    if (props.row?.bidNumber) {
      params.bidNumber = props.row.bidNumber
      Api = editBidListApi
    }

    const res = await Api(params)
    if (res.status === 0) {
      visible.value = false
      ElMessage.success('操作成功')
      emits('submitOk')
    }
  } catch (error) {

  } finally {
    loading.value = false
  }

}
const handleAdd = () => {
  formData.value.companyQuoteInfoDTOS.push({ ...defaultItem() })
}
const handleDelete = (index, item) => {
  formData.value.companyQuoteInfoDTOS.splice(index, 1)
}
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