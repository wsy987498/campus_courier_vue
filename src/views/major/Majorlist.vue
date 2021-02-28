<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>院系专业</el-breadcrumb-item>
      <el-breadcrumb-item>专业列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="8" class="search">
          <el-input
            placeholder="请输入专业名"
            class="input-with-select"
            v-model="queryInfo.major_name"
            clearable
            @clear="getMajorlist"
            @keyup.enter.native="getMajorlist"
          >
            <el-button class="addbtn" slot="append" icon="el-icon-search" @click="getMajorlist"></el-button>
          </el-input>
        </el-col>

        <el-col :span="3">
          <el-button type="primary" @click="addDiglogVisable = true">添加专业</el-button>
        </el-col>
      </el-row>

      <!-- 专业列表区域 -->
      <el-table v-loading="loading" :data="newTableDate" :span-method="arraySpanMethod" border>
        <el-table-column prop="major_id" label="专业id" align="center" width="100"></el-table-column>
        <el-table-column prop="major_name" label="专业" align="center"></el-table-column>
        <el-table-column prop="class_name" label="班级" align="center">
          <template slot-scope="scope">
            <el-tag>{{scope.row.class_name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editDiglogInit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUserById(scope.row.class_id)"
              ></el-button>
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
        :page-sizes="[2]"
        :page-size="queryInfo.pagesize"
        layout="total,sizes, prev, pager, next"
        :total="total"
      ></el-pagination>

      <!-- 添加专业对话框 -->
      <el-dialog
        v-loading="loading"
        title="添加专业及班级"
        :visible.sync="addDiglogVisable"
        width="35%"
        @close="diglogClose('add')"
      >
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
          <el-form-item label="major_id" prop="major_id">
            <el-input v-model.number="addForm.major_id"></el-input>
          </el-form-item>
          <el-form-item label="专业名称" prop="major_name">
            <el-input v-model="addForm.major_name"></el-input>
          </el-form-item>
          <el-form-item label="class_id" prop="class_id">
            <el-input v-model.number="addForm.class_id"></el-input>
          </el-form-item>
          <el-form-item label="班级名称" prop="class_name">
            <el-input v-model="addForm.class_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetaddForm">取 消</el-button>
          <el-button type="primary" @click="addMajor">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑班级对话框 -->
      <el-dialog
        v-loading="loading"
        title="修改班级信息"
        :visible.sync="editDiglogVisable"
        width="35%"
        @close="diglogClose('edit')"
      >
        <!-- 内容主体区域 -->
        <el-form :model="editForm"  ref="editFormRef" label-width="100px">
          <el-form-item label="班级id" prop="class_id">
            <el-input v-model.number="editForm.class_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="专业名称" prop="major_name">
            <el-input v-model="editForm.major_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="班级名称" prop="class_name">
            <el-input v-model="editForm.class_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="reseteditForm">取 消</el-button>
          <el-button type="primary" @click="editClassInfo">确 定</el-button>
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
        major_name: '',
        pagenum: 1,
        pagesize: 2
      },

      total: 0,
      addDiglogVisable: false,
      fullscreenLoading: false,
      addForm: {
        major_id: '',
        major_name: '',
        class_id: '',
        class_name: ''
      },

      editForm: {},
      editDiglogVisable: false,
      formRules: {
        major_id: [
          { required: true, message: '请输入专业id', trigger: 'blur' },
          { type: 'number', message: '专业id必须为数字值', trigger: 'blur' }
        ],
        major_name: [
          { required: true, message: '请输入专业名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        class_id: [
          { required: true, message: '请输入班级id', trigger: 'blur' },
          { type: 'number', message: '班级id必须为数字值', trigger: 'blur' }
        ],

        class_name: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },

      //专业
      majorlist: [],
      newTableDate: [],
      spanArray: [],
      tableIndex: 0
    }
  },

  created() {
    this.getMajorlist()
  },

  methods: {
    //获取专业列表
    async getMajorlist() {
      this.newTableDate = []
      this.spanArray = []
      this.tableIndex = 0
      this.loading = true
      const { data: res } = await this.$axios.post('showMajorList', this.queryInfo)
      if (res.code !== 'success') {
        this.loading = false
        return this.$message.error(res.message)
        this.newTableDate = []
        this.queryInfo.major_name = ''
      } else {
        this.loading = false
        this.$message.success(res.message)
        this.majorlist = res.data
        this.total = Number(res.total)
        this.queryInfo.major_name = ''
        this.majorlist.forEach((item, index) => {
          // console.log(item)
          for (let i = 0; i < item.class.length; i++) {
            let current = {
              major_name: item.major_name,
              major_id: item.major_id,
              class_id: item.class[i].class_id,
              class_name: item.class[i].class_name
            }
            this.newTableDate.push(current)
          }
        })

        this.newTableDate.forEach((item, index) => {
          if (index == 0) {
            this.spanArray.push(1)
            this.tableIndex = 0
          } else {
            if (this.newTableDate[index].major_id === this.newTableDate[index - 1].major_id) {
              this.spanArray[this.tableIndex] = this.spanArray[this.tableIndex] + 1
              this.spanArray.push(0)
            } else {
              this.spanArray.push(1)
              this.tableIndex = index
            }
          }
        })
      }
      // console.log(this.newTableDate)
    },

    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        let _row = this.spanArray[rowIndex]
        let _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },

    // 添加专业
    addMajor() {
      this.loading = true
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('addMajor', this.addForm)
        // console.log(res)
        if (res.code !== 'success') {
          this.loading = false
          return this.$message.error(res.message)
        } else {
          this.loading = false
          this.$refs.addFormRef.resetFields()
          this.addDiglogVisable = false
          this.$message.success(res.message)
          this.getMajorlist()
        }
      })
    },

    //删除学生信息
    async deleteUserById(class_id) {
      const confirmResult = await this.$confirm('你确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      this.loading = true
      const { data: res } = await this.$axios.post('delClassinfo', { class_id })
      if (res.code !== 'success') {
        this.loading = false
        return this.$message.error(res.message)
      } else {
        this.$message.success(res.message)
        this.loading = false
        this.getMajorlist()
      }
    },

    editDiglogInit(classInfo) {
      this.editForm = JSON.parse(JSON.stringify(classInfo))
      this.editDiglogVisable = true
    },

    //编辑学生信息
    editClassInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('upDateClassinfo', this.editForm)
        this.loading = true
        if (res.code !== 'success') {
          return this.$message.error(res.message)
          this.loading = false
        } else {
          this.loading = false
          this.$refs.editFormRef.resetFields()
          this.editDiglogVisable = false
          this.$message.success(res.message)
          this.getMajorlist()
        }
      })
    },

    //监听pageSize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getMajorlist()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getMajorlist()
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
    }
  }
}
</script>
<style scoped>
.el-table {
  /* height: 345px; */
  font-weight: bold;

  overflow: auto;
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