function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/*准换星 */
function convertToStarsArray(stars) {
  var array = [];
  // WHOLE 1 HALF 2  EMPTY3
  var whole = 0;
  var helf = 0;
  var eppty = 0;
  var helfStars = stars / 10;
 
  if (helfStars.toString().split('.').length > 1) {
    whole = helfStars.toString().split('.')[0];
    helf = 1;
  } else {
    whole = helfStars.toString();
    helf = 0;
  }
  eppty = 5 - whole - helf;
  var temp = { WHOLE: whole, HALF: helf, EMPTY: eppty };
  var tempArray=[];
  for (var i = 0; i < temp.WHOLE;i++){
    tempArray.push(1);
  }
  for (var i = 0; i < temp.HALF; i++) {
    tempArray.push(2);
  }
  for (var i = 0; i < temp.EMPTY; i++) {
    tempArray.push(3);
  }
  return tempArray
}

function http(url,callback) {
  var that = this;
  wx.request({
    url: url,
    header: {
      'content-type': 'application/xml'
    },
    success: function (res) {
      callback(res.data);
    },
    fail :function(error){
      console.log(error);
    }
  })
}

function convertToCastString(casts){
  var castsjoin = "";
  casts.map(x=>{
    castsjoin += x.name+"/";
  })
  console.log('castsjoin', castsjoin);
  return castsjoin.substring(0, castsjoin.length-1);
}

function convertToCastInfos(casts){
   var castsArray=[];
   casts.map(x=>{
     var temp ={
       img:x.avatars?x.avatars.large:"",
       name:x.name
     }
     castsArray.push(temp);
   })
   return castsArray;
}
module.exports = {
  formatTime: formatTime,
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}