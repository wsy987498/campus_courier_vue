<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card updatecard">
      <div class="update_box">
        <el-form :model="updateForm" :rules="loginRules" ref="updateFormRef" label-width="100px" class="update_form">
          <!-- 用户名 -->
          <el-form-item prop="aname" label="用户名：">
            <el-input v-model="updateForm.aname" prefix-icon="iconfont icon-user" disabled></el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="apwd" label="密码：">
            <el-input v-model="updateForm.apwd" prefix-icon="iconfont icon-3702mima" :type="pwdType" @keyup.enter.native="loginEnter">
              <i slot="suffix" class="iconfont icon-showpassword" @click="showPwd"></i>
            </el-input>
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="updateForm.checkPass" auto-complete="off"></el-input>
          </el-form-item>

          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button type="success" @click="updatepassword">修改</el-button>
            <el-button type="primary" @click="resetUpdateForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.updateForm.apwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      updateForm: {
        aname: window.sessionStorage.getItem('aname'),
        apwd: '',
        checkPass: '',
        id: window.sessionStorage.getItem('id')
      },

      //表单验证规则
      loginRules: {
        apwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        checkPass: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      },

      //password init状态
      pwdType: 'password'
    }
  },

  created() {},

  methods: {
    //密码框的显示隐藏
    showPwd() {
      this.pwdType === 'password' ? (this.pwdType = '') : (this.pwdType = 'password')
    },
    //重置登录表单
    resetUpdateForm() {
      this.$refs.updateFormRef.resetFields()
    },

    //修改密码
    updatepassword() {
      //进行表单与验证
      this.$refs.updateFormRef.validate(async valid => {
        //验证通过 发起ajax请求 否则return
        if (!valid) return

        const { data: res } = await this.$axios.post('/updatePassword', this.updateForm)
        if (res.code == 200) {
          this.$message.success(res.msg)
          setTimeout(() => {
            this.$message.error('请重新登录！')
            window.sessionStorage.clear()
          }, 1500)
          setTimeout(() => {
            this.$router.push('/login')
          }, 3000)
        } else {
          this.resetUpdateForm()
        }
      })
    }
  }
}
</script>
<style scoped>
.updatecard {
  height: 530px;
}

.update_box {
  width: 450px;
  height: 300px;
}

.update_form {
  width: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
}
</style>
