<template>
  <form class="login_form">
    <div class="login_form_r2">
      <!-- <login-textfield label="账号" icon="user" :value="loginForm.username" /> -->
      <div class="name">账号：</div>
      <el-input v-model="loginForm.username" placeholder="请输入账号"></el-input>
    </div>
    <div class="login_form_r3">
      <!-- <login-textfield label="密码" icon="lock" :value="loginForm.password" /> -->
      <div class="name">密码：</div>
      <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
    </div>
    <div class="login_form_r1"></div>
    <div>
      <login-submit :loginFormData="loginForm" />
    </div>
  </form>
</template>
<script>
// import LoginTextfield from './LoginTextfield'
// import LoginCheckbox from './LoginCheckbox'
import LoginSubmit from './LoginSubmit'

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  components: {
    // LoginTextfield,
    // LoginCheckbox,
    LoginSubmit
  },
  methods: {}
}
</script>
<style>
.name {
  width: 50px;
  display: flex;
  align-items: center;
}
.login_form {
  padding: 20px;
}
.login_form > div {
  padding-bottom: 10px;
  display: flex;
  min-height: 40px;
  justify-content: space-between;
  transition: all 0.6s ease;
}
.login_text {
  display: flex;
  flex: 1;
}
.login_text .login_textfield {
  border-radius: 0;
}
.login_text .login_textfield:first-child {
  border-radius: 2px 0 0 2px;
}
.login_text .login_textfield:last-child {
  border-radius: 0 2px 2px 0;
}
.login__signup .login_form_r5 {
  opacity: 0;
  transform: translateY(100%);
  transition-duration: 0.4s;
}
.login__signup .login_button label:nth-child(2) {
  transform: translateY(-100%);
  opacity: 0;
}
.login__signin .login_form_r1,
.login__signin .login_form_r4 {
  opacity: 0;
  transform: translateY(30%) scale(0.8);
}
/* .login__signin .login_form_r2,
.login__signin .login_form_r3 {
  transform: translateY(-100%);
} */
.login__signin .login_form_r5 {
  transform: translateY(-200%);
}
.login__signin .login_button label:nth-child(3) {
  transform: translateY(100%);
  opacity: 0;
}
.login_textfield label {
  margin-right: 10px;
  color: #007dff;
}
.login_textfield label i {
  width: 20px;
}
</style>
