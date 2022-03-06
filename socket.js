const SocketIO = require('socket.io');
const axios = require('axios').default;
const dotenv = require('dotenv');
dotenv.config();

//오늘 날짜 가져오기
let today = new Date();
let year = today.getFullYear();
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let day = ('0' + today.getDate()).slice(-2);
let hours = ('0' + today.getHours()).slice(-2) + '00';

//날짜 20220304 방식으로 제작.
let today_date = year + month + day;

//기온 실황 정보 url

let weather_url =
  'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';

let queryParams =
  '?' +
  encodeURIComponent('serviceKey') +
  '=' +
  process.env.OPEN_KEY; /* Service Key*/

queryParams +=
  '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams +=
  '&' +
  encodeURIComponent('numOfRows') +
  '=' +
  encodeURIComponent('1000'); /* */
queryParams +=
  '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
queryParams +=
  '&' +
  encodeURIComponent('base_date') +
  '=' +
  encodeURIComponent(`${today_date}`); /* */
queryParams +=
  '&' +
  encodeURIComponent('base_time') +
  '=' +
  encodeURIComponent('2100'); /* `${hours}`*/
queryParams +=
  '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('75'); /* */
queryParams +=
  '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('125'); /* */

//날씨 url에 쿼리 붙여주기
weather_url += queryParams;
let T1H_result = new Array(); //기온
let RN1_result; //강수량(1시간)
let SKY_result; //하늘상태
let PTY_result; //강수형태
let WSD_result; //풍속
let VEC_result; //풍향

axios
  .get(weather_url)
  .then(async (response) => {
    //초단기예보일때
    const result = await response.data.response.body.items.item;
    for (let i in result) {
      //기온
      if (result[i].category == 'T1H') {
        const t1h_data_obj = new Object();
        console.log(
          `관측시간 : ${result[i].baseTime} 관측값 : ${result[i].obsrValue}`
        );
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });

//미세먼지 정보 url
const dust_url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${
  process.env.OPEN_KEY
}&numOfRows=100&returnType=json&ver=1.3&sidoName=${encodeURIComponent('강원')}`;
let dust_result;
//미세먼지 정보 가져오기
axios
  .get(dust_url)
  .then(async (response) => {
    response.data.response.body.items.forEach((item, index, array) => {
      if (item.stationName == '지정면') {
        dust_result = item;
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });

//여기까지 미세먼지 가져오기.

//여기부터는 나이스 급식 가져오기

const gangwondo = 'K10';
const mySchool = '7891019';

//기본 호출 url 작성하기
const basic_request_url = 'https://open.neis.go.kr/hub/mealServiceDietInfo?';

//테스트용 급식 파싱 url
let url = `${basic_request_url}&Key=${process.env.NEIS_KEY}&Type=json&pIndex=1&pSize=1&ATPT_OFCDC_SC_CODE=${gangwondo}&SD_SCHUL_CODE=${mySchool}&MLSV_YMD=${today_date}`;

//neis 급식 데이터 가져오기
function parsing_json(obj) {
  let meal_data_str = obj.data.mealServiceDietInfo[1].row[0].DDISH_NM;
  //숫자 제거 정규식
  meal_data_str = meal_data_str.replace(/[0-9]/g, '');

  //마침표 제거 정규식
  //마침표가 특수문자라 \역슬래시를 넣어줘야 했음.
  meal_data_str = meal_data_str.replace(/\./g, '');
  return meal_data_str;
}

let neis_meal_info;

const get_meal_info = () => {
  axios
    .get(url)
    .then(async (res) => {
      neis_meal_info = parsing_json(res).toString();
    })
    .catch((err) => {
      console.error(err);
      neis_meal_info = '오늘은 급식 없는 날!!';
    });
};

module.exports = (server) => {
  const io = SocketIO(server, { path: '/socket.io' });

  io.on('connection', (socket) => {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);

    get_meal_info();

    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });
    socket.on('error', (error) => {
      console.error(error);
    });
    socket.on('reply', (data) => {
      console.log(data);
    });

    socket.emit('dust', JSON.stringify(dust_result));
    socket.emit('meal', neis_meal_info);
  });
};
