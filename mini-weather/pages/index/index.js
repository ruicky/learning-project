//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    latitude: 0,
    longitude: 0,
    address: '',
    weatherData: {}
  },
  onLoad: function () {
    if (app.globalData.latitude!=0 && app.globalData.longitude!= 0) {
      this.getWeather(res.latitude, res.longitude);
      this.getAddress(res.latitude, res.longitude);
    } else {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: (res) => {
          var address = "";
          app.globalData.latitude = res.latitude;
          app.globalData.longitude = res.longitude;
          this.getWeather(res.latitude, res.longitude);
          this.getAddress(res.latitude, res.longitude);
        }
      })
    }

  },
  getWeather: function (latitude, longitude) {
    var url = `https://api.caiyunapp.com/v2/TAkhjf8d1nlSlspN/${longitude},${latitude}/forecast.json`
    wx.request({
      url: url,
      success: (res) => {
        var weatherData = this.processWeatherData(res.data);
        this.setData({ weatherData: weatherData })
      }
    })
  },
  processWeatherData: function (data) {
    var weatherData = {};
    //头部数据
    var headerData = {
      temperature: data.result.hourly.temperature[0].value,
      windDesc: `${this.processWeatherName(data.result.hourly.skycon[0].value)}/东南风 微风拂面`,
      aqiDesc: `${data.result.hourly.aqi[0].value} ${this.processAqiLevel(data.result.hourly.aqi[0].value).aqi_level}`
    };
    weatherData.headerData = headerData;
    //分钟数据
    var minutely = {
      description: data.result.minutely.description,
      precipitation_2h: data.result.minutely.precipitation_2h,
      precipitation: data.result.minutely.precipitation
    }
    weatherData.minutely = minutely;
    //小时数据
    var hourly = {
      description: data.result.hourly.description,
      list: []
    }
    var tempHourly = data.result.hourly;
    for (var i = 0; i < tempHourly.temperature.length; i++) {
      hourly.list.push({
        datetime: tempHourly.temperature[i].datetime.substr(11),
        weatherName: tempHourly.skycon[i].value,
        aqi: tempHourly.aqi[i].value,
        aqiLevel: this.processAqiLevel(tempHourly.aqi[i].value).aqi_level,
        aqi_color: this.processAqiLevel(tempHourly.aqi[i].value).aqi_color,
        temperature: tempHourly.temperature[i].value
      })
    }
    weatherData.hourly = hourly;
    //天数据
    var daily = {
      list: []
    }
    var tempDaily = data.result.daily;
    for (var j = 0; j < tempDaily.temperature.length; j++) {
      daily.list.push({
        week: this.processWeek(tempDaily.temperature[j].date),
        date: tempDaily.temperature[j].date.substr(5, tempDaily.temperature[j].date.length),
        weatherName: tempDaily.skycon[j].value,
        maxTemperature: tempDaily.temperature[j].max,
        minTemperature: tempDaily.temperature[j].min,
        aqi: tempDaily.aqi[j].avg,
        aqiLevel: this.processAqiLevel(tempDaily.aqi[j].avg).aqi_level,
        aqi_color: this.processAqiLevel(tempDaily.aqi[j].avg).aqi_color,
        windDirection: this.processWindDirection(tempDaily.wind[j].avg.direction),
        windSpeed: this.processWindSpeed(tempDaily.wind[j].avg.speed),
      });
    }
    weatherData.daily = daily;
    //提示数据
    var reminder = {};
    reminder.coldRisk = tempDaily.coldRisk[0].desc;
    reminder.dressing = tempDaily.dressing[0].desc;
    reminder.ultraviolet = tempDaily.ultraviolet[0].desc;
    reminder.carWashing = tempDaily.carWashing[0].desc;
    weatherData.reminder = reminder;
    return weatherData;
  },
  processAqiLevel: function (aqi) {
    var aqi_level = "";
    var aqi_color = "";
    if (aqi >= 0 && aqi <= 50) {
      aqi_level = "优"
      aqi_color = "#46e2bb";
    } else if (aqi >= 51 && aqi <= 100) {
      aqi_level = "良"
      aqi_color = "#58ba91"
    } else if (aqi >= 101 && aqi <= 150) {
      aqi_level = "轻度污染"
      aqi_color = "#8dba23";
    } else if (aqi >= 121 && aqi <= 200) {
      aqi_level = "中度污染"
      aqi_color = "#fd0000"
    } else if (aqi >= 201 && aqi <= 300) {
      aqi_level = "重度污染"
      aqi_color = "#a0004f";
    } else {
      aqi_level = "严重污染"
      aqi_color = "#79001a";
    }
    return { aqi_level, aqi_color };
  },
  processWeek: function (date) {
    var num = new Date(date).getDay();
    var week = "";
    switch (num) {
      case 0:
        week = "周日";
        break;
      case 1:
        week = "周一";
        break;
      case 2:
        week = "周二";
        break;
      case 3:
        week = "周三";
        break;
      case 4:
        week = "周四";
        break;
      case 5:
        week = "周五";
        break;
      case 6:
        week = "周六";
        break;
    }
    return week;
  },
  processWindDirection: function (data) {
    var windDirection = "";
    if ((data >= 0 && data < 22.5) || (data >= 337.5 && data <= 360)) {
      windDirection = "北风";
    } else if (data >= 22.5 && data < 67.5) {
      windDirection = "东北风";
    } else if (data >= 67.5 && data < 112.5) {
      windDirection = "东风";
    } else if (data >= 112.5 && data < 157.5) {
      windDirection = "东南风";
    } else if (data >= 157.5 && data < 202.5) {
      windDirection = "南风";
    } else if (data >= 202.5 && data < 247.5) {
      windDirection = "西南风";
    } else if (data >= 247.5 && data < 292.5) {
      windDirection = "西风";
    } else if (data >= 292.5 && data < 337.5) {
      windDirection = "西北风";
    } else {
      windDirection = "未知";
    }
  },
  processWindSpeed: function (data) {
    var windSpeed = "";
    if (data < 1) {
      windSpeed = "0";
    } else if (data >= 1 && data < 5) {
      windSpeed = "1";
    } else if (data >= 5 && data < 11) {
      windSpeed = "2";
    } else if (data >= 11 && data < 19) {
      windSpeed = "3";
    } else if (data >= 19 && data < 28) {
      windSpeed = "4";
    } else if (data >= 28 && data < 38) {
      windSpeed = "5";
    } else if (data >= 38 && data < 49) {
      windSpeed = "6";
    } else if (data >= 49 && data < 61) {
      windSpeed = "7";
    } else if (data >= 61 && data < 74) {
      windSpeed = "8";
    } else if (data >= 74 && data < 88) {
      windSpeed = "9";
    } else if (data >= 88 && data < 102) {
      windSpeed = "10";
    } else if (data >= 102 && data < 117) {
      windSpeed = "11";
    } else if (data >= 117 && data < 134) {
      windSpeed = "12";
    } else if (data >= 134 && data < 149) {
      windSpeed = "13";
    } else if (data >= 149 && data < 166) {
      windSpeed = "14";
    } else if (data >= 166 && data < 183) {
      windSpeed = "15";
    } else if (data >= 183 && data < 201) {
      windSpeed = "16";
    } else if (data >= 201 && data < 220) {
      windSpeed = "17";
    } else if (data >= 220) {
      windSpeed = "18";
    } else {
      windSpeed = "飓风";
    }
    return windSpeed;
  },
  processWeatherName: function (weatherCode) {
    var weatherName = '';
    switch (weatherCode) {
      case 'CLEAR_DAY':
        weatherName = "晴"
        break;
      case 'CLEAR_NIGHT':
        weatherName = "晴"
        break;
      case 'PARTLY_CLOUDY_DAY':
        weatherName = "多云"
        break;
      case 'PARTLY_CLOUDY_NIGHT':
        weatherName = "多云"
        break;
      case 'CLOUDY':
        weatherName = "阴"
        break;
      case 'RAIN':
        weatherName = " 雨"
        break;
      case 'SNOW':
        weatherName = "雪"
        break;
      case 'WIND':
        weatherName = "风"
        break;
      case 'FOG':
        weatherName = "雾"
        break;
    }
    return weatherName;
  },
  onChooseLocation: function (event) {
    wx.chooseLocation({
      success: (res) => {
        app.globalData.address = res.name;
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
        this.getWeather(res.latitude, res.longitude);
        // this.getAddress(res.latitude, res.longitude);
        this.setData({ address: app.globalData.address })
        
      },
    })
  },
  getAddress: function (latitude, longitude) {
    var url = `http://api.map.baidu.com/geocoder/v2/?location=${latitude},${longitude}&output=json&pois=1&ak=0onBu757ywx7LXtWR47MmDSnHlczUyMA`
    wx.request({
      url: url,
      success: (res) => {
        var data = res.data;
        app.globalData.address = data.result.formatted_address
        this.setData({ address: data.result.formatted_address })
      }
    })
  }
})
