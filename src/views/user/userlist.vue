<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="8" class="search">
          <el-input placeholder="请输入用户名" class="input-with-select" v-model="queryInfo.username" clearable @clear="searchuserlist" @keyup.enter.native="searchuserlist">
            <el-button class="addbtn" slot="append" icon="el-icon-search" @click="searchuserlist"></el-button>
          </el-input>
        </el-col>

        <el-col :span="3">
          <el-button type="primary" @click="addDiglogVisable = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="userlist" stripe border :default-sort="{ prop: 'student_birthday', order: 'ascending' }">
        <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="id" label="id" align="center" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.username }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="password" label="密码" align="center"></el-table-column> -->
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDiglogInit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.id)"></el-button>
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

      <!-- 添加学生对话框 -->
      <el-dialog v-loading="loading" title="添加用户" :visible.sync="addDiglogVisable" width="35%" @close="diglogClose('add')">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" show-password></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetaddForm">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑框 -->
      <el-dialog v-loading="loading" title="修改用户信息" :visible.sync="editDiglogVisable" width="35%" @close="diglogClose('edit')">
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
          <el-form-item label="id" prop="id">
            <el-input v-model="editForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password" show-password></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="reseteditForm">取 消</el-button>
          <el-button type="primary" @click="edituserlist">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,

      queryInfo: {
        username: '',
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
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

  created() {
    this.getuserlist()
  },

  methods: {
    // search
    async searchuserlist() {
      this.loading = true
      try {
        const { data: res } = await this.$axios.post('/searchuserlist', this.queryInfo)
        // console.log(res)
        if (res.code == 200) {
          this.loading = false
          this.$message.success(res.msg)
          this.userlist = res.data
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

    //获取用户列表
    async getuserlist() {
      this.loading = true
      try {
        const { data: res } = await this.$axios.post('/userlist', this.queryInfo)
        // console.log(res)
        if (res.code == 200) {
          this.loading = false
          this.$message.success(res.msg)
          this.userlist = res.data
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

    //编辑学生信息
    edituserlist() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // console.log('edit', this.editForm)
        try {
          const { data: res } = await this.$axios.post('/updateuserinfo', this.editForm)
          this.loading = true
          if (res.code == 200) {
            this.loading = false
            this.$refs.editFormRef.resetFields()
            this.editDiglogVisable = false
            this.$message.success(res.msg)
            setTimeout(() => {
              this.getuserlist()
            }, 500)
          } else {
            this.loading = false
          }
        } catch (error) {
          if (error) return this.$message.error('Network Error')
        }
      })
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

    // 添加用户
    adduser() {
      // console.log(this.addForm)
      this.loading = true
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        try {
          const { data: res } = await this.$axios.post('/adduser', this.addForm)
          // console.log(res)
          if (res.code == 200) {
            this.loading = false
            this.$refs.addFormRef.resetFields()
            this.addDiglogVisable = false
            this.$message.success(res.msg)
            setTimeout(() => {
              this.getuserlist()
            }, 500)
          } else if (res.code == 203) {
            this.$message.error(res.msg)
            this.loading = false
            this.$refs.addFormRef.resetFields()
          } else {
            this.loading = false
          }
        } catch (error) {
          if (error) return this.$message.error('Network Error')
        }
      })
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
        const { data: res } = await this.$axios.post('/deluserinfo', { id })
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.loading = false
          this.getuserlist()
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
      this.getuserlist()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getuserlist()
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
