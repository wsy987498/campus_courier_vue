<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="8" class="search">
          <el-input
            placeholder="请输入学生姓名"
            class="input-with-select"
            v-model="queryInfo.student_name"
            clearable
            @clear="getStudentList"
            @keyup.enter.native="getStudentList"
          >
            <el-button class="addbtn" slot="append" icon="el-icon-search" @click="getStudentList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="3">
          <el-button type="primary" @click="addDiglogVisable = true">添加学生</el-button>
        </el-col>
      </el-row>

      <!-- 学生列表区域 -->
      <el-table
        v-loading="loading"
        :data="studentList"
        stripe
        border
        :default-sort="{prop: 'student_birthday', order: 'ascending'}"
      >
        <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
        <el-table-column prop="class_id" label="班级" align="center" width="120"></el-table-column>
        <el-table-column prop="student_number" label="学号" align="center"></el-table-column>
        <el-table-column prop="student_name" label="姓名" align="center">
          <template slot-scope="scope">
            <el-tag type="success">{{scope.row.student_name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="student_birthday" sortable label="出生日期" align="center"></el-table-column>
        <el-table-column prop="student_gender" label="性别" align="center" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.student_gender=='男'?'' : 'danger'">{{scope.row.student_gender}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="province_name" label="籍贯" align="center" width="100"></el-table-column>
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
                @click="deleteUserById(scope.row.student_id)"
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
        :page-sizes="[2, 5]"
        :page-size="queryInfo.pagesize"
        layout="total,sizes, prev, pager, next"
        :total="total"
      ></el-pagination>

      <!-- 添加学生对话框 -->
      <el-dialog
        v-loading="loading"
        title="添加学生"
        :visible.sync="addDiglogVisable"
        width="35%"
        @close="diglogClose('add')"
      >
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
          <el-form-item label="班级" prop="class_id">
            <el-input v-model="addForm.class_id"></el-input>
          </el-form-item>
          <el-form-item label="学号" prop="student_number">
            <el-input v-model="addForm.student_number"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="student_name">
            <el-input v-model="addForm.student_name"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="student_birthday">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="addForm.student_birthday"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="性别" prop="student_gender">
            <el-select v-model="addForm.student_gender" placeholder="请选择"  style="width: 100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="籍贯" prop="province_name">
            <el-select v-model="addForm.province_name" placeholder="请选择" @change="getProval"  style="width: 100%;">
              <el-option
                v-for="item in provinceList"
                :key="item.province_id"
                :label="item.province_name"
                :value="item.province_name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="pro_id" prop="province_id">
            <el-input v-model="addForm.province_id" disabled></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetaddForm">取 消</el-button>
          <el-button type="primary" @click="addStudent">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑学生对话框 -->
      <el-dialog
        v-loading="loading"
        title="修改学生信息"
        :visible.sync="editDiglogVisable"
        width="35%"
        @close="diglogClose('edit')"
      >
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
          <el-form-item label="班级" prop="class_id">
            <el-input v-model="editForm.class_id"></el-input>
          </el-form-item>
          <el-form-item label="学号" prop="student_number">
            <el-input v-model="editForm.student_number"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="student_name">
            <el-input v-model="editForm.student_name"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="student_birthday">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="editForm.student_birthday"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="性别" prop="student_gender" >
            <el-select v-model="editForm.student_gender" placeholder="请选择"  style="width: 100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="籍贯" prop="province_name">
            <el-select v-model="editForm.province_name" placeholder="请选择" @change="editgetProval"  style="width: 100%;">
              <el-option
                v-for="item in provinceList"
                :key="item.province_id"
                :label="item.province_name"
                :value="item.province_name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="pro_id" prop="province_id">
            <el-input v-model="editForm.province_id" disabled></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="reseteditForm">取 消</el-button>
          <el-button type="primary" @click="editStudentInfo">确 定</el-button>
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
      //性别
      options: [
        {
          value: '男',
          label: '男'
        },
        {
          value: '女',
          label: '女'
        }
      ],
      queryInfo: {
        student_name: '',
        pagenum: 1,
        pagesize: 5
      },
      studentList: [],
      total: 0,
      addDiglogVisable: false,
      fullscreenLoading: false,
      addForm: {
        student_number: '',
        student_name: '',
        student_birthday: '',
        student_gender: '',
        class_id: '',
        province_name: '',
        province_id: ''
      },
      provinceList: [],

      editForm: {},
      editDiglogVisable: false,
      formRules: {
        class_id: [
          { required: true, message: '请输入学生班级', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        student_number: [
          { required: true, message: '请输入学生学号', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        student_name: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        student_birthday: [
          { required: true, message: '日期不能为空', trigger: 'blur' },
          { validator: this.validateDate, trigger: ['blur', 'change'] }
        ],
        student_gender: [
          { required: true, message: '请输入学生性别', trigger: 'blur' },
          { min: 1, max: 2, message: '长度在 1 到 2 个字符', trigger: 'blur' }
        ],
        province_name: [{ required: true ,message: '请选择学生籍贯', trigger: 'blur'}],
        province_id: [{ required: true ,message: '请选择', trigger: 'blur'}]
      }
    }
  },

  created() {
    this.getStudentList()
    this.getProvince()
  },

  methods: {
    //日期自定义校验规则
    validateDate(rule, value, callback) {
      if (value) {
        let timestamp = new Date(value).getTime()
        let start = new Date(this.shiftStartTime).getTime()
        let end = new Date(this.shiftEndTime).getTime()
        if (end < timestamp || timestamp < start) {
          callback(new Error(`请在时间内选择  ${this.shiftStartTime} 至 ${this.shiftEndTime}`))
        } else {
          callback()
        }
      } else {
        callback()
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

    //获取籍贯
    async getProvince() {
      const { data: res } = await this.$axios.get('showProvince')
      if (res.code !== 'success') return
      this.provinceList = res.data
    },

    //getProval
    async getProval(province_name) {
      const { data: res } = await this.$axios.post('getProvinceid', { province_name })
      // console.log(res)
      if (res.code !== 'success') return
      this.addForm.province_id = res.data.province_id
    },

    //editgetProval
    async editgetProval(province_name) {
      const { data: res } = await this.$axios.post('getProvinceid', { province_name })
      // console.log(res)
      if (res.code !== 'success') return
      this.editForm.province_id = res.data.province_id
    },

    //获取学生列表
    async getStudentList() {
      this.loading = true
      const { data: res } = await this.$axios.post('showStudentlist', this.queryInfo)
      // console.log(res)
      if (res.code !== 'success') {
        this.loading = false
        return this.$message.error(res.message)
      } else {
        this.loading = false
        this.$message.success(res.message)
        this.studentList = res.data
        this.total = Number(res.total)
      }
    },

    // 添加学生
    addStudent() {
      this.loading = true
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('addStudent', this.addForm)
        // console.log(res)
        if (res.code !== 'success') {
          this.loading = false
          return this.$message.error(res.message)
        } else {
          this.loading = false
          this.$refs.addFormRef.resetFields()
          this.addDiglogVisable = false
          this.$message.success(res.message)
          this.getStudentList()
        }
      })
    },

    //删除学生信息
    async deleteUserById(student_id) {
      const confirmResult = await this.$confirm('你确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }
      this.loading = true
      const { data: res } = await this.$axios.post('delStudent', { student_id })
      if (res.code !== 'success') {
        this.loading = false
        return this.$message.error(res.message)
      } else {
        this.$message.success(res.message)
        this.loading = false
        this.getStudentList()
      }
    },

    editDiglogInit(studentInfo) {
      this.editForm = JSON.parse(JSON.stringify(studentInfo))
      this.editDiglogVisable = true
    },

    //编辑学生信息
    editStudentInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('upDateStudent', this.editForm)
        this.loading = true
        if (res.code !== 'success') {
          return this.$message.error(res.message)
          this.loading = false
        } else {
          this.loading = false
          this.$refs.editFormRef.resetFields()
          this.editDiglogVisable = false
          this.$message.success(res.message)
          this.getStudentList()
        }
      })
    },

    // 监听pageSize改变事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getStudentList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getStudentList()
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