<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头部区域 -->
      <div class="admin_title">学生管理系统</div>
      <!-- 表单区域 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="aname">
          <el-input v-model="loginForm.aname" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="apwd">
          <el-input v-model="loginForm.apwd" prefix-icon="iconfont icon-3702mima" :type="pwdType" @keyup.enter.native="loginEnter">
            <i slot="suffix" class="iconfont icon-showpassword" @click="showPwd"></i>
          </el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <span class="userspan">用户名:admin, 密码:123456</span>
          <el-button type="success" @click="login">登录</el-button>
          <el-button type="primary" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //登录表单数据
      loginForm: {
        aname: '',
        apwd: ''
      },

      //表单验证规则
      loginRules: {
        aname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        apwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      },

      //password init状态
      pwdType: 'password'
    }
  },

  methods: {
    //密码框的显示隐藏
    showPwd() {
      this.pwdType === 'password' ? (this.pwdType = '') : (this.pwdType = 'password')
    },

    //重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },

    //登录
    login() {
      //进行表单与验证
      this.$refs.loginFormRef.validate(async valid => {
        //验证通过 发起ajax请求 否则return
        if (!valid) return

        const { data: res } = await this.$axios.post('login', this.loginForm)
        // console.log(res);
        if (res.code !== 'success') {
          this.$message.error(res.message)
          this.resetLoginForm()
        } else {
          // 1.登录成功将token保存到客户端的sessionStorage中
          //项目中除了登录之外的API接口，必须在登录之后才能访问
          //token 只应当在当前网站打开期间生效，所以将token保存在sessionStorage中
          this.$message.success(res.message)
          window.sessionStorage.setItem('token', res.token)
          window.sessionStorage.setItem('aname', res.aname)
          // 2. 通过编程式导航跳转到后台主页/home
          this.$router.push('/home')
        }
      })
    },

    //enterlogin
    loginEnter() {
      this.login()
    }
  }
}
</script>
<style lang="less" scoped>
.userspan {
  padding-right: 50px;
}
.admin_title {
  text-align: center;
  line-height: 130px;
  font-weight: bold;
  font-size: 28px;
}
.login_container {
  // background-color: #fffae8;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  box-shadow: 30px 0 30px 30px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .icon-showpassword {
    margin-right: 8px;
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>