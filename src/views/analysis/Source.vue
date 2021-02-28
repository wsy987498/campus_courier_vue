<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生来源分布</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- main -->
    <el-container>
      <el-card class="main_box-card">
        <div id="myChart" :style="{width: '100%', height: '600px'}"></div>
      </el-card>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      provincelist: [],
      newProvincelist: []
    }
  },
  created() {},
  mounted() {
    this.drawmap()
  },

  methods: {
    async drawmap() {
      let myChart = this.$echarts.init(document.getElementById('myChart'))

      myChart.showLoading()
      await this.$axios.get('countProvince').then(result => {
        const { data: res } = result
        this.provincelist = res.data

        myChart.hideLoading()
        let provincelist = this.provincelist.map(item => {
          if (item.student.length != 0) {
            let newData = [
              {
                name: item.province_name,
                value: item.student.length,
                北海: '1111'
              }
            ]
            this.newProvincelist.push(newData)
          }
        })
        console.log(this.newProvincelist)
      })

      var geoCoordMap = {
        广州: [113.5107, 23.2196],
        北京: [116.4551, 40.2539],
        天津: [117.4219, 39.4189],
        上海: [121.4648, 31.2891],
        重庆: [106.557165, 29.563206],
        河北: [114.508958, 38.066606],
        河南: [113.673367, 34.748062],
        云南: [102.721896, 25.047632],
        辽宁: [123.445621, 41.806698],
        黑龙江: [126.655705, 45.759581],
        湖南: [112.950888, 28.229114],
        安徽: [117.300842, 31.887672],
        山东: [117.029895, 36.677424],
        新疆: [87.616327, 43.800508],
        江苏: [118.814345, 32.061445],
        浙江: [120.16991, 30.272236],
        江西: [115.904962, 28.674132],
        湖北: [114.290138, 30.595623],
        广西: [108.381781, 22.815042],
        北海: [109.1191711, 21.47979736],
        甘肃: [103.851217, 36.061978],
        山西: [112.57197, 37.879532],
        内蒙古: [111.65, 40.82],
        陕西: [108.960062, 34.285251],
        吉林: [126.572746, 43.86785],
        福建: [119.319713, 26.072564],
        贵州: [106.557165, 29.563206],
        广东: [113.238778, 23.161621],
        青海: [101.787147, 36.621234],
        西藏: [91.154492, 29.665953],
        四川: [104.082256, 30.652565],
        宁夏: [106.234805, 38.487468],
        海南: [109.910757, 19.108187],
        台湾: [121.098613, 23.778734],
        香港: [114.168545, 22.36641],
        澳门: [113.549978, 22.1943]
      }

      var GZData = this.newProvincelist

      var convertData = function(data) {
        var res = []
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i]
          var fromCoord = geoCoordMap[dataItem[0].name]
          var toCoord = [109.1191711, 21.47979736] //被攻击坐标
          if (fromCoord && toCoord) {
            res.push([
              {
                name: dataItem[0].name,
                coord: fromCoord,
                value: dataItem[0].value //来源或流向修改
              },
              {
                coord: toCoord
              }
            ])
          }
        }
        return res
      }

      var series = []
      ;[['北海', GZData]].forEach(function(item, i) {
        series.push(
          {
            //线
            type: 'lines',
            zlevel: 2,
            symbol: ['none', 'arrow'], //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'线两端的标记类型
            symbolSize: 10, //箭头大小
            lineStyle: {
              normal: {
                width: 1, //尾迹线条宽度
                opacity: 0.2, //尾迹线条透明度
                curveness: 0.3 //尾迹线条曲直度
              }
            },
            effect: {
              show: true, //是否显示特效
              period: 2, //特效动画的时间，单位为 s
              symbol: 'pin', //特效图形的类型
              constantSpeed: 100, //固定速度，大于0的值后会忽略 period 配置项
              symbolSize: 5,
              color: '#fff',
              shadowBlur: 8
            },
            data: convertData(item[1])
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              //涟漪特效相关配置
              period: '4', //动画的时间
              scale: '20', //动画中波纹的最大缩放比例
              brushType: 'stroke'
            },
            label: {
              //图形上的城市文本标签
              normal: {
                show: true,
                position: 'left',

                formatter: function(params) {
                  //圆环显示文字
                  return params.data.name
                },
                textStyle: {
                  fontSize: 14
                }
              }
            },
            symbolSize: 1, //点大小
            data: item[1].map(function(dataItem) {
              return {
                name: dataItem[0].name, //来源或流向修改
                value: geoCoordMap[dataItem[0].name].concat([dataItem[0].value]) //来源或流向修改
              }
            })
          }
        )
      })

      myChart.setOption({
        title: {
          top: 20,
          text: '学生来源分布',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 26
          }
        },
        backgroundColor: '#013954', //#013954
        tooltip: {
          //提示组件
          trigger: 'item'
        },
        visualMap: {
          //图例控制
          min: 0,
          max: 100,
          //seriesIndex:['0','1'],//选择应用那几条数据
          calculable: true,
          show: false,
          color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'china',
          tooltip: {
            show: true,
            backgroundColor: 'rgba(0,0,0,0)',
            formatter: function(params) {
              // console.log(params)
              if (params.data.value != null) {
                var tipHtml1 = ''
                tipHtml1 =
                  '<div style="background:#fff;border-radius:10px;padding-top:10px;box-shadow:0 0 10px #666">' +
                  '<div style="color:#fff;height:20px;border-radius:6px;font-size:12px;line-height:20px;background-color:#5861a2;text-align:center;margin:0 2px;">' +
                  params.data.name +
                  '</div>' +
                  '<div style="text-align:center;color:#494949;padding:8px 6px">' +
                  '<span style="font-size:18px;font-weight:bold;">' +
                  '人数：' +
                  params.data.value +
                  ' ' +
                  '</span>' +
                  '</div>' +
                  '</div>'
                return tipHtml1
              } else {
                // return params.data.name
              }
            }
          },
          label: {
            emphasis: {
              show: true
            }
          },
          roam: false, //开启缩放或者平移
          zoom: 1.1, //缩放比例
          layoutCenter: ['center', 'center'],
          // layoutSize: 700,
          aspectScale: 0.9, //长宽比
          itemStyle: {
            normal: {
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(147, 235, 248, 0)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              },
              borderColor: 'rgba(147, 235, 248, 1)',
              borderWidth: 1,
              shadowColor: 'rgba(128, 217, 248, 1)',
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 10
            },
            emphasis: {
              itemStyle: {
                areaColor: '#FFD181',
                borderColor: '#404a59',
                borderWidth: 1
              }
            }
          }
        },
        series: series
      })
      window.addEventListener('resize', function() {
        myChart.resize() //页面大小变化后Echarts也更改大小
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-card__body {
  padding: 0;
}
.main_box-card {
  margin-top: 20px;
  width: 100%;
}
</style>