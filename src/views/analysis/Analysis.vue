<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页面板</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- header卡片视图区域 -->
    <el-card class="box-card firstbox">
      <!-- 用户信息 -->
      <div class="msghead">
        <div class="avatar"></div>
        <div class="title">
          {{ aname }}, {{ timeFix }},
          {{ welcome }}
        </div>
      </div>
    </el-card>

    <!-- main 专业占比和男女生人数比例图-->
    <el-container>
      <el-card class="main_box-card">
        <div id="myChart2" :style="{ width: '100%', height: '400px' }"></div>
      </el-card>
      <el-card class="main_box-card2">
        <div id="myChart" :style="{ width: '100%', height: '400px' }"></div>
      </el-card>
    </el-container>
    <!-- main卡片视图区域 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeFix: this.formatTime(),
      avatar: '',
      aname: window.sessionStorage.getItem('aname'),
      welcome: this.welcomeMsg(),
      all: '',
      boy: '',
      girl: '',
      majorArr: [],
      majorlist: []
    }
  },
  created() {},
  mounted() {
    // this.drawgender()
    // this.majordraw()
  },

  methods: {
    //timefix()
    formatTime() {
      const time = new Date()
      const hour = time.getHours()
      return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
    },
    //welcome
    welcomeMsg() {
      const arr = ['工作那么久，休息一会儿吧!', '今天又是充满希望的一天!']
      const index = Math.floor(Math.random() * arr.length)
      return arr[index]
    },

    //人数获取
    async getStudentCount() {
      const { data: res } = await this.$axios.get('countStudent')
      if (res.code !== 'success') return
      this.all = Number(res.data.all)
      this.boy = Number(res.data.boy)
      this.girl = Number(res.data.girl)
    },

    //男女占比
    async drawgender() {
      // 初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))

      myChart.showLoading()
      await this.$axios.get('countStudent').then(result => {
        const { data: res } = result
        this.all = Number(res.data.all)
        this.boy = Number(res.data.boy)
        this.girl = Number(res.data.girl)
        myChart.hideLoading()
        // console.log('data:', this.all)
      })

      var symbols = [
        'path://M18.2629891,11.7131596 L6.8091608,11.7131596 C1.6685112,11.7131596 0,13.032145 0,18.6237673 L0,34.9928467 C0,38.1719847 4.28388932,38.1719847 4.28388932,34.9928467 L4.65591984,20.0216948 L5.74941883,20.0216948 L5.74941883,61.000787 C5.74941883,65.2508314 11.5891201,65.1268798 11.5891201,61.000787 L11.9611506,37.2137775 L13.1110872,37.2137775 L13.4831177,61.000787 C13.4831177,65.1268798 19.3114787,65.2508314 19.3114787,61.000787 L19.3114787,20.0216948 L20.4162301,20.0216948 L20.7882606,34.9928467 C20.7882606,38.1719847 25.0721499,38.1719847 25.0721499,34.9928467 L25.0721499,18.6237673 C25.0721499,13.032145 23.4038145,11.7131596 18.2629891,11.7131596 M12.5361629,1.11022302e-13 C15.4784742,1.11022302e-13 17.8684539,2.38997966 17.8684539,5.33237894 C17.8684539,8.27469031 15.4784742,10.66467 12.5361629,10.66467 C9.59376358,10.66467 7.20378392,8.27469031 7.20378392,5.33237894 C7.20378392,2.38997966 9.59376358,1.11022302e-13 12.5361629,1.11022302e-13',
        'path://M28.9624207,31.5315864 L24.4142575,16.4793596 C23.5227152,13.8063773 20.8817445,11.7111088 17.0107398,11.7111088 L12.112691,11.7111088 C8.24168636,11.7111088 5.60080331,13.8064652 4.70917331,16.4793596 L0.149791395,31.5315864 C-0.786976655,34.7595013 2.9373074,35.9147532 3.9192135,32.890727 L8.72689855,19.1296485 L9.2799493,19.1296485 C9.2799493,19.1296485 2.95992025,43.7750224 2.70031069,44.6924335 C2.56498417,45.1567684 2.74553639,45.4852068 3.24205501,45.4852068 L8.704461,45.4852068 L8.704461,61.6700801 C8.704461,64.9659872 13.625035,64.9659872 13.625035,61.6700801 L13.625035,45.360657 L15.5097899,45.360657 L15.4984835,61.6700801 C15.4984835,64.9659872 20.4191451,64.9659872 20.4191451,61.6700801 L20.4191451,45.4852068 L25.8814635,45.4852068 C26.3667633,45.4852068 26.5586219,45.1567684 26.4345142,44.6924335 C26.1636859,43.7750224 19.8436568,19.1296485 19.8436568,19.1296485 L20.3966199,19.1296485 L25.2043926,32.890727 C26.1862111,35.9147532 29.9105828,34.7595013 28.9625083,31.5315864 L28.9624207,31.5315864 Z M14.5617154,0 C17.4960397,0 19.8773132,2.3898427 19.8773132,5.33453001 C19.8773132,8.27930527 17.4960397,10.66906 14.5617154,10.66906 C11.6274788,10.66906 9.24611767,8.27930527 9.24611767,5.33453001 C9.24611767,2.3898427 11.6274788,0 14.5617154,0 L14.5617154,0 Z',
        'path://M512 292.205897c80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 65.503248 592.855572 0 512 0 431.144428 0 365.641179 65.503248 365.641179 146.358821 365.641179 227.214393 431.144428 292.205897 512 292.205897zM512 731.282359c-80.855572 0-146.358821 65.503248-146.358821 146.358821 0 80.855572 65.503248 146.358821 146.358821 146.358821 80.855572 0 146.358821-65.503248 146.358821-146.358821C658.358821 796.273863 592.855572 731.282359 512 731.282359z'
      ]

      var bodyMax = this.all //指定图形界限的值 总人数值
      var labelSetting = {
        normal: {
          show: true,
          position: 'bottom',
          offset: [0, 30],
          //计算百分比值
          formatter: function(param) {
            return ((param.value / bodyMax) * 100).toFixed(0) + '%'
          },
          textStyle: {
            fontSize: 18,
            fontFamily: 'Arial',
            color: '#686868'
          }
        }
      }

      myChart.setOption({
        title: {
          text: '学生男女比例',
          subtext: '',
          x: 'center',
          y: '',
          textStyle: {
            // color: '#fff',
            fontSize: 24,
            fontWeight: 'bold',
            align: 'center'
          },
          subtextStyle: {
            // color: '#fff',
            fontSize: 20,
            fontWeight: 'normal',
            align: 'center'
          }
        },
        tooltip: {
          show: true, //鼠标放上去显示悬浮数据
          formatter(params) {
            return `
                ${params.name}：${params.value}人.<br>
                总人数：${bodyMax}人.
               `
          }
        },
        color: ['rgba(105,204,230)', 'rgba(255,130,130)'],
        legend: {
          data: ['男生', '女生'],
          selectedMode: 'single',
          itemWidth: 30, //图例的宽度
          itemHeight: 15, //图例的高度
          itemGap: 40,
          orient: 'horizontal',
          left: 'center',
          top: '30px',
          icon: 'rect',
          selectedMode: false //取消图例上的点击事件
        },
        // 网格布局
        grid: {
          // left: '20%',
          // right: '20%',
          top: '20%',
          bottom: '20%',
          containLabel: true
        },
        //X 轴
        xAxis: {
          data: ['男生', '', '女生'],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        //Y 轴
        yAxis: {
          max: bodyMax,
          splitLine: {
            show: false
          },
          axisTick: {
            // 刻度线
            show: false
          },
          axisLine: {
            // 轴线
            show: false
          },
          axisLabel: {
            // 轴坐标文字
            show: false
          }
        },
        series: [
          {
            name: '男生',
            type: 'pictorialBar',
            symbolClip: true,
            symbolBoundingData: bodyMax,
            label: labelSetting,
            data: [
              {
                value: this.boy, //男生人数
                symbol: symbols[0],
                itemStyle: {
                  normal: {
                    color: 'rgba(105,204,230)' //单独控制颜色
                  }
                }
              },
              {},
              {}
            ],
            z: 10
          },
          {
            name: '女生',
            type: 'pictorialBar',
            symbolClip: true,
            symbolBoundingData: bodyMax,
            label: labelSetting,
            data: [
              {},
              {},
              {
                value: this.girl, //女生人数
                symbol: symbols[1],
                itemStyle: {
                  normal: {
                    color: 'rgba(255,130,130)' //单独控制颜色
                  }
                }
              }
            ],
            z: 10
          },
          {
            // 设置背景底色，不同的情况用这个
            name: '人数',
            type: 'pictorialBar', //异型柱状图 图片、SVG PathData
            symbolBoundingData: bodyMax,
            animationDuration: 0,
            itemStyle: {
              normal: {
                color: '#ccc' //设置全部颜色，统一设置
              }
            },
            z: 10,
            data: [
              {
                itemStyle: {
                  normal: {
                    color: 'rgba(105,204,230,0.40)' //单独控制颜色
                  }
                },
                value: this.boy, //男生人数
                symbol: symbols[0]
              },
              {
                // 设置中间冒号
                itemStyle: {
                  normal: {
                    color: '#1DA1F2' //单独控制颜色
                  }
                },
                symbol: symbols[2],
                symbolSize: [8, '18%'],
                symbolOffset: [0, '-200%']
              },
              {
                itemStyle: {
                  normal: {
                    color: 'rgba(255,130,130,0.40)' //单独控制颜色
                  }
                },
                value: this.girl, //女孩人数
                symbol: symbols[1]
              }
            ]
          }
        ]
      })

      window.addEventListener('resize', function() {
        myChart.resize() //页面大小变化后Echarts也更改大小
      })
    },

    //专业占比图
    async majordraw() {
      // 初始化echarts实例
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      myChart2.showLoading()
      await this.$axios.post('showMajorList').then(result => {
        const { data: res } = result
        this.majorlist = res.data
        // console.log(this.majorlist)
        myChart2.hideLoading()
        let majorlist = this.majorlist.map(item => {
          let newData = {
            name: item.major_name,
            value: item.class.length
          }
          this.majorArr.push(newData)
        })
      })

      myChart2.setOption({
        animation: true,
        title: {
          text: '各专业比例',
          subtext: '',
          x: 'center',
          y: '',
          textStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            align: 'center'
          },
          subtextStyle: {
            fontSize: 20,
            fontWeight: 'normal',
            align: 'center'
          }
        },
        //长方形
        legend: {
          width: '100%',
          left: 'center',
          textStyle: {
            fontSize: 14
          },
          icon: 'rect',
          right: '0',
          bottom: '0',
          padding: [5, 10],
          itemGap: 20,
          data: this.majorArr
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['40%', '53%'],
            color: ['#FEE449', '#00FFFF', '#00FFA8', '#9F17FF', '#FFE400', '#F76F01', '#01A4F7', '#FE2C8A'],
            startAngle: 135,
            labelLine: {
              normal: {
                length: 10
              }
            },
            label: {
              normal: {
                formatter: '{b|{b}:}  {per|{d}%} ',
                backgroundColor: 'rgba(255, 147, 38, 0)',
                borderColor: 'transparent',
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 1,
                    height: 0
                  },
                  b: {
                    color: '#58bc58',
                    fontSize: 12,
                    lineHeight: 33
                  },
                  c: {
                    fontSize: 14,
                    color: '#eee'
                  },

                  per: {
                    color: '#000',
                    fontSize: 14,
                    padding: [5, 8],
                    borderRadius: 2
                  }
                },
                textStyle: {
                  // color: '#fff',
                  fontSize: 16
                }
              }
            },
            emphasis: {
              label: {
                show: true,
                formatter: '{b|{b}:}  {per|{d}%}  ',
                backgroundColor: 'rgba(255, 147, 38, 0)',
                borderColor: 'transparent',
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 1,
                    height: 0
                  },
                  b: {
                    fontSize: 15,
                    lineHeight: 33
                  },
                  c: {
                    fontSize: 5,
                    color: '#eee'
                  },
                  per: {
                    color: '#FDF44E',
                    fontSize: 20,
                    padding: [1, 1],
                    borderRadius: 1
                  }
                }
              }
            },
            //数据
            data: this.majorArr
          },
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['35%', '36%'],
            label: {
              show: false
            },
            data: [
              {
                value: 100,
                name: '实例1',
                itemStyle: {
                  normal: {
                    color: {
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 0,
                      type: 'linear',
                      global: false,
                      colorStops: [
                        {
                          offset: 0,
                          color: '#9F17FF'
                        },
                        {
                          offset: 0.2,
                          color: '#01A4F7'
                        },
                        {
                          offset: 0.5,
                          color: '#FE2C8A'
                        },
                        {
                          offset: 0.8,
                          color: '#FEE449'
                        },
                        {
                          offset: 1,
                          color: '#00FFA8'
                        }
                      ]
                    }
                  }
                }
              }
            ]
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
.username {
  font-size: 25px;
  margin-left: 15px;
}
.msghead {
  // margin: 10px 0;
  display: flex;
  align-items: center;
  > .avatar {
    width: 80px;
    height: 80px;
  }
  .title {
    margin-left: 20px;
    align-self: flex-end;
    font-size: 21px;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: cover;
  }
}
/deep/.el-card__body {
  padding: 8px !important;
}
.main_box-card {
  margin-top: 20px;
  width: 65%;
}
.main_box-card2 {
  margin-left: 20px;
  margin-top: 20px;
  width: 35%;
}
</style>
