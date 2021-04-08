<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>快递管理</el-breadcrumb-item>
      <el-breadcrumb-item>派送中列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="8" class="search">
          <el-input placeholder="收件人" class="input-with-select" v-model="queryInfo.express_recipients" clearable @clear="searchexpresslist">
            <el-button class="addbtn" slot="append" icon="el-icon-search" @click="searchexpresslist"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="expresslist" stripe border>
        <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="istake_express_id" label="id" align="center" width="80"></el-table-column>
        <el-table-column prop="istake_express_name" label="快递公司" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.istake_express_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="istake_express_recipients" label="收件人" align="center"></el-table-column>
        <el-table-column prop="istake_phone" label="电话" align="center"></el-table-column>
        <el-table-column prop="istake_express_type" label="快递类型" align="center"></el-table-column>
        <el-table-column prop="istake_delivery_address" label="配送地址" align="center"></el-table-column>

        <el-table-column prop="istake_create_time" label="完成配送时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.istake_create_time | stepDateFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.istake_express_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5]"
        :page-size="queryInfo.pagesize"
        layout="total,sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,

      queryInfo: {
        express_recipients: '',
        pagenum: 1,
        pagesize: 5
      },
      expresslist: [],
      total: 0,
      addDiglogVisable: false,
      fullscreenLoading: false,
      addForm: {
        username: '',
        password: ''
      },
      provinceList: [],

      editForm: {},
      editDiglogVisable: false,
      formRules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
    stepDateFilter(time) {
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      let day = date.getDate()
      day = day < 10 ? '0' + day : day
      let hour = date.getHours()
      hour = hour < 10 ? '0' + hour : hour
      let minutes = date.getMinutes()
      minutes = minutes < 10 ? '0' + minutes : minutes
      return `${year}-${month}-${day}  ${hour}:${minutes}`
    }
  },

  created() {
    this.getfinishexpress()
  },

  methods: {
    // search
    async searchexpresslist() {
      this.loading = true
      try {
        const { data: res } = await this.$axios.post('/searchgethavetotakeexpress_list', this.queryInfo)
        console.log(res)
        if (res.code == 200) {
          this.loading = false
          this.$message.success(res.msg)
          this.expresslist = res.data
          this.total = res.total
        } else {
          this.loading = false
          return
        }
      } catch (error) {
        if (error) return this.$message.error('Network Error')
      }
    },

    //获取列表
    async getfinishexpress() {
      this.loading = true
      try {
        const { data: res } = await this.$axios.post('/gethavetotakeexpress_list', this.queryInfo)
        console.log(res)
        if (res.code == 200) {
          this.loading = false
          this.$message.success(res.msg)
          this.expresslist = res.data
          this.total = res.total
          // console.log(this.total)
        } else {
          this.loading = false
          return
        }
      } catch (error) {
        if (error) return this.$message.error('Network Error')
      }
    },

    //取消重置表单
    resetaddForm() {
      this.addDiglogVisable = false
      this.$refs.addFormRef.resetFields()
    },
    reseteditForm() {
      this.editDiglogVisable = false
      this.$refs.editFormRef.resetFields()
    },

    //监听对话框关闭事件
    diglogClose(operation) {
      if (operation === 'add') {
        this.$refs.addFormRef.resetFields()
      } else if (operation === 'edit') {
        this.$refs.editFormRef.resetFields()
      }
    },

    //删除信息
    async deleteUserById(id) {
      // console.log(id)
      const confirmResult = await this.$confirm('你确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      this.loading = true
      try {
        const { data: res } = await this.$axios.post('/delgethavetotakeexpress_list', { id })
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.loading = false
          this.getfinishexpress()
        } else {
          this.loading = false
        }
      } catch (error) {
        if (error) return this.$message.error('Network Error')
      }
    },

    editDiglogInit(studentInfo) {
      // console.log(studentInfo)
      this.editForm = JSON.parse(JSON.stringify(studentInfo))
      this.editDiglogVisable = true
    },

    // 监听pageSize改变事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getfinishexpress()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getfinishexpress()
    }
  }
}
</script>
<style scoped>
.el-table {
  height: 345px;
  font-weight: bold;
}
.el-row {
  display: flex;
}
.addbtn {
  color: #fff !important;
  background-color: #409eff !important;
  border-color: #409eff !important;
  border: none;
}
</style>
