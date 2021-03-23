<template>
  <!-- 登录注册按钮 -->
  <span class="login_button">
    <input type="button" value="" />
    <label @click="login">登 录</label>
    <label @click="register">注 册</label>
  </span>
</template>
<script>
export default {
  props: {
    loginFormData: Object
  },
  data() {
    return {
      loginForm: this.loginFormData
    }
  },
  methods: {
    isNull() {
      if (this.loginForm.username === '' || this.loginForm.password === '') {
        this.$message.error('用户名和密码请填写完整！')
        return true
      } else {
        return false
      }
    },
    async login() {
      const isnull = this.isNull()
      if (isnull) return
      const { data: res } = await this.$axios.post('login', this.loginForm)
      console.log(res)
      if (res.code == 200) {
        this.$message.success(res.msg)
        window.sessionStorage.setItem('token', res.token)
        window.sessionStorage.setItem('aname', res.username)
        this.$router.push('/home')
      } else {
        this.$message.error(res.msg)
        this.loginForm.username = ''
        this.loginForm.password = ''
      }
    },
    async register() {
      const isnull = this.isNull()
      if (isnull) return
      const { data: res } = await this.$axios.post('register', this.loginForm)
      console.log(res)
      if (res.code == 200) {
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
        this.loginForm.username = ''
        this.loginForm.password = ''
      }
    }
  }
}
</script>

<style scoped>
.login_button {
  position: relative;
  display: flex;
  flex: 1;
  overflow: hidden;
}
.login_button input {
  display: block;
  flex: 1;
  width: 0;
  height: 40px;
  border: none;
  border-radius: 2px;
  outline: none;
  background: #0066d0;
}
.login_button label {
  cursor: pointer;
  position: absolute;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  transition: all 0.6s ease;
}
</style>
