<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页面板</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- main 专业占比和男女生人数比例图-->
    <el-container>
      <el-card class="main_box-card">
        <div id="myChart1" :style="{ width: '100%', height: '500px' }"></div>
      </el-card>
      <el-card class="main_box-card2">
        <div id="myChart2" :style="{ width: '100%', height: '500px' }"></div>
      </el-card>
    </el-container>
    <!-- main卡片视图区域 -->

    <!-- <el-card class="box-card firstbox">
      <div class="msghead">111</div>
    </el-card> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      aname: window.sessionStorage.getItem('aname'),
      user_id: {
        user_id: window.sessionStorage.getItem('id')
      },
      waitOrderNum: 0,
      paisongNum: 0,
      jiedanFinishedNum: 0,
      ReceivingNum: 0,
      FinishedNum: 0
    }
  },
  created() {},
  mounted() {
    this.drawfadan()
    this.drawjiedan()
  },

  methods: {
    //我的发单 待接单 num
    // async getWaitOrderNum() {
    //   const { data: res } = await this.$axios.post('/getWaitOrderNum', this.user_id)
    //   this.waitOrderNum = res.total
    //   // console.log(res.total)
    // },
    // 我的发单 派送中 num
    // async gethavetoTakeNum() {
    //   const { data: res } = await this.$axios.post('/gethavetoTakeNum', this.user_id)
    //   this.paisongNum = res.total
    //   // console.log(this.paisongNum)
    // },
    // 我的发单 已完成 num
    // async getfadanFinishedNum() {
    //   const { data: res } = await this.$axios.post('/getfadanFinishedNum', this.user_id)
    //   this.jiedanFinishedNum = res.total
    //   // console.log(this.jiedanFinishedNum)
    // },

    // // 我的接单 已接单 num
    // async getReceivingNum() {
    //   const { data: res } = await this.$axios.post('/getReceivingNum', this.user_id)
    //   this.ReceivingNum = res.total
    //   // console.log(this.ReceivingNum)
    // },
    // // 我的接单 已完成 num
    // async getFinishedNum() {
    //   const { data: res } = await this.$axios.post('/getFinishedNum', this.user_id)
    //   this.FinishedNum = res.total
    //   // console.log(this.FinishedNum)
    // },

    // 发单
    async drawfadan() {
      // 初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart1'))
      //我的发单 待接单 num
      const { data: res } = await this.$axios.post('/getWaitOrderNum', this.user_id)
      this.waitOrderNum = res.total
      // 我的发单 派送中 num
      const { data: res1 } = await this.$axios.post('/gethavetoTakeNum', this.user_id)
      this.paisongNum = res1.total
      // 我的发单 已完成 num
      const { data: res2 } = await this.$axios.post('/getfadanFinishedNum', this.user_id)
      this.jiedanFinishedNum = res2.total

      var scale = 1
      var echartData = [
        {
          value: this.waitOrderNum,
          name: '待接单'
        },
        {
          value: this.paisongNum,
          name: '派送中'
        },
        {
          value: this.jiedanFinishedNum,
          name: '已完成'
        }
      ]
      var rich = {
        yellow: {
          color: '#ffc72b',
          fontSize: 30 * scale,
          padding: [5, 4],
          align: 'center'
        },
        total: {
          color: '#ffc72b',
          fontSize: 40 * scale,
          align: 'center'
        },
        white: {
          // color: '#ccc',
          align: 'center',
          fontSize: 14 * scale,
          padding: [21, 0]
        },
        blue: {
          color: '#49dff0',
          fontSize: 16 * scale,
          align: 'center'
        },
        hr: {
          borderColor: '#0b5263',
          width: '100%',
          borderWidth: 1,
          height: 0
        }
      }
      myChart.setOption({
        // backgroundColor: '#031f2d',
        title: {
          text: '发单总量',
          left: 'center',
          top: '53%',
          padding: [24, 0],
          textStyle: {
            // color: '#fff',
            fontSize: 18 * scale,
            align: 'center'
          }
        },
        legend: {
          selectedMode: false,
          formatter: function(name) {
            var total = 0
            var averagePercent
            echartData.forEach(function(value, index, array) {
              total += value.value
            })
            return '{total|' + total + '}'
          },
          data: [echartData[0].name],

          left: 'center',
          top: 'center',
          icon: 'none',
          align: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16 * scale,
            rich: rich
          }
        },
        series: [
          {
            name: '发单总量',
            type: 'pie',
            radius: ['42%', '50%'],
            hoverAnimation: false,
            color: ['#c487ee', '#deb140', '#49dff0', '#6f81da', '#00ffb4'],
            label: {
              normal: {
                formatter: function(params, ticket, callback) {
                  var total = 0 //考生总数量
                  var percent = 0 //考生占比
                  echartData.forEach(function(value, index, array) {
                    total += value.value
                  })
                  percent = ((params.value / total) * 100).toFixed(1)

                  // return '{white|' + params.name + '}\n{hr|}\n{yellow|' + params.value + '}\n{blue|' + percent + '%}'
                  return '{white|' + params.name + '}\n{hr|}\n{yellow|' + params.value + '}\n'
                },
                rich: rich
              }
            },
            labelLine: {
              normal: {
                length: 55 * scale,
                length2: 0,
                lineStyle: {
                  color: '#0b5263'
                }
              }
            },
            data: echartData
          }
        ]
      })

      window.addEventListener('resize', function() {
        myChart.resize() //页面大小变化后Echarts也更改大小
      })
    },

    async drawjiedan() {
      // console.log(this.FinishedNum)
      // 初始化echarts实例
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      // 我的接单 已接单 num

      const { data: res3 } = await this.$axios.post('/getReceivingNum', this.user_id)
      this.ReceivingNum = res3.total
      // console.log(this.ReceivingNum)

      // 我的接单 已完成 num

      const { data: res4 } = await this.$axios.post('/getFinishedNum', this.user_id)
      this.FinishedNum = res4.total
      // console.log(this.FinishedNum)

      var scale = 1
      var echartData = [
        {
          value: this.ReceivingNum,
          // value: 0,
          name: '已接单'
        },

        {
          value: this.FinishedNum,
          // value: 0,
          name: '已完成'
        }
      ]
      var rich = {
        yellow: {
          color: '#ffc72b',
          fontSize: 30 * scale,
          padding: [5, 4],
          align: 'center'
        },
        total: {
          color: '#ffc72b',
          fontSize: 40 * scale,
          align: 'center'
        },
        white: {
          // color: '#ccc',
          align: 'center',
          fontSize: 14 * scale,
          padding: [21, 0]
        },
        blue: {
          color: '#49dff0',
          fontSize: 16 * scale,
          align: 'center'
        },
        hr: {
          borderColor: '#0b5263',
          width: '100%',
          borderWidth: 1,
          height: 0
        }
      }
      myChart2.setOption({
        // backgroundColor: '#031f2d',
        title: {
          text: '接单总量',
          left: 'center',
          top: '53%',
          padding: [24, 0],
          textStyle: {
            // color: '#fff',
            fontSize: 18 * scale,
            align: 'center'
          }
        },
        legend: {
          selectedMode: false,
          formatter: function(name) {
            var total = 0 //各科正确率总和
            var averagePercent //综合正确率
            echartData.forEach(function(value, index, array) {
              total += value.value
            })
            return '{total|' + total + '}'
          },
          data: [echartData[0].name],
          // data: ['高等教育学'],
          // itemGap: 50,
          left: 'center',
          top: 'center',
          icon: 'none',
          align: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 16 * scale,
            rich: rich
          }
        },
        series: [
          {
            name: '总考生数量',
            type: 'pie',
            radius: ['42%', '50%'],
            hoverAnimation: false,
            color: ['#c487ee', '#deb140', '#49dff0', '#6f81da', '#00ffb4'],
            label: {
              normal: {
                formatter: function(params, ticket, callback) {
                  var total = 0 //考生总数量
                  var percent = 0 //考生占比
                  echartData.forEach(function(value, index, array) {
                    total += value.value
                  })
                  percent = ((params.value / total) * 100).toFixed(1)
                  // return '{white|' + params.name + '}\n{hr|}\n{yellow|' + params.value + '}\n{blue|' + percent + '%}'
                  return '{white|' + params.name + '}\n{hr|}\n{yellow|' + params.value + '}\n'
                },
                rich: rich
              }
            },
            labelLine: {
              normal: {
                length: 55 * scale,
                length2: 0,
                lineStyle: {
                  color: '#0b5263'
                }
              }
            },
            data: echartData
          }
        ]
      })

      window.addEventListener('resize', function() {
        myChart2.resize() //页面大小变化后Echarts也更改大小
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-card__body {
  padding: 8px !important;
}
.main_box-card {
  // margin-top: 20px;
  width: 50%;
  // height: 400px;
}
.main_box-card2 {
  margin-left: 20px;
  // margin-top: 20px;
  width: 50%;
  // height: 400px;
}
.firstbox {
  margin-top: 10px;
  // height: 400px;
}
</style>
