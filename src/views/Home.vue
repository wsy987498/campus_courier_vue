<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>校园快递代取管理平台</span>
      </div>
      <div>
        <div class="user">您好,{{ aname }}</div>
        <el-button type="danger" @click="logout">退出</el-button>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_button">
          <el-button size="mini" class="toggle-button" type="info" :icon="this.isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'" @click="toggleCollapse"></el-button>
        </div>
        <!-- 左边侧边菜单栏 -->
        <el-menu background-color="#000" text-color="#fff" active-text-color="#fff" unique-opened :collapse="isCollapse" :collapse-transition="isTransition" router :default-active="$route.path">
          <!-- 一级菜单 -->
          <el-submenu :index="item.menu_id" v-for="item in menuList" :key="item.menu_id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.first_icon"></i>
              <!-- 文本 -->
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.pathname" v-for="subItem in item.menuchildren" :key="subItem.id" @click="saveNavState(subItem.pathname)">
              <template slot="title">
                <!-- 图标 -->
                <i :class="subItem.icon"></i>
                <!-- 文本 -->
                <span>{{ subItem.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
        <el-footer>By Wu siyu. 2021.3</el-footer>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      aname: window.sessionStorage.getItem('aname'),
      menuList: [
        { first_icon: 'el-icon-data-analysis', name: '统计分析', menu_id: '1', menuchildren: [{ icon: '', name: '统计分析', pathname: '/analysis' }] },
        { first_icon: 'el-icon-user-solid', name: '用户管理', menu_id: '2', menuchildren: [{ icon: 'el-icon-tickets', name: '用户列表', pathname: '/userlist' }] },
        { first_icon: 'el-icon-s-tools', name: '系统设置', menu_id: '3', menuchildren: [{ icon: 'el-icon-edit-outline', name: '修改密码', pathname: '/updatepwd' }] }
      ],
      isCollapse: false,
      isTransition: false,
      currentPath: ''
    }
  },

  created() {
    this.currentPath = window.sessionStorage.getItem('currentPath')
  },

  methods: {
    // 退出登录
    async logout() {
      //退出成功
      this.$message.success('退出成功')
      setTimeout(() => {
        //清空sessionStorage
        window.sessionStorage.clear()
        //跳转到登录页面
        this.$router.push('/login')
      }, 800)
    },

    // 点击按钮折叠左侧菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },

    //保存菜单
    saveNavState(currentPath) {
      window.sessionStorage.setItem('currentPath', currentPath)
      this.currentPath = currentPath
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;
  border-bottom: 1px solid #ccc;
  // font-weight: bold;
  .toggle-button {
    cursor: pointer;
  }
  img {
    height: 50px;
  }
  > div {
    display: flex;
    align-items: center;
  }
}

.el-aside {
  background-color: #000;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #ffffff;
}

.iconfont {
  margin-right: 8px;
}
.toggle_button {
  background-color: #000;
  font-size: 10px;
  height: 30px;
  line-height: 35px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-footer {
  margin-top: 20px;
  // color: #fff;
  // background-color: #000;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  opacity: 0.9;
}
.is-active {
  background: #1890ff !important;
}

.user {
  margin-right: 30px;
}

.toggle-button {
  background-color: #000;
  // border-color: #000;
}
.el-main {
  background-color: #f0f2f5;
  height: 690px;
}
</style>
