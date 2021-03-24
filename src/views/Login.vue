<template>
  <div class="login" :class="{ login__signin: isSignIn, login__signup: isSignUp }">
    <div class="title">校园快递代取管理平台</div>
    <login-tabs @click.native="switchState" />
    <login-form />
  </div>
</template>
<script>
import LoginTabs from '../components/loginfrom/LoginTabs'
import LoginForm from '../components/loginfrom/LoginForm'

export default {
  components: {
    LoginTabs,
    LoginForm
  },
  data() {
    return {
      state: 1
    }
  },

  computed: {
    isSignIn() {
      return this.state === 1
    },
    isSignUp() {
      return this.state === 2
    }
  },
  methods: {
    switchState() {
      this.state = this.state === 1 ? 2 : 1
      // console.log(this.state)
    }
  }
}
</script>
<style>
.login {
  width: 30%;
  color: white;
  font-size: 14px;
}
.title {
  width: 100%;
  text-align: center;
  font-size: 23px;
}
</style>
