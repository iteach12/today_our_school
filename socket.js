const SocketIO = require('socket.io');
const axios = require('axios').default;
const dotenv = require('dotenv');
dotenv.config();

let today = new Date();
let year = today.getFullYear();
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let day = ('0' + today.getDate()).slice(-2);

let today_date = year + month + day;

//기온 실황 정보 url

let weather_url =
  'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';

let queryParams =
  '?' +
  encodeURIComponent('serviceKey') +
  '=' +
  `${process.env.DECODING_KEY}`; /* Service Key*/

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
  encodeURIComponent('0600'); /* */
queryParams +=
  '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('75'); /* */
queryParams +=
  '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('125'); /* */

//날씨 url에 쿼리 붙여주기
weather_url += queryParams;
let weather_result;
axios
  .get(weather_url)
  .then(async (response) => {
    const result = await console.log(response);

    // response.data.response.body.items.forEach((item, index, array) => {
    //   if (item.stationName == '지정면') {
    //     dust_result = item;
    //   }
    // });
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
    // const result = await console.log(response);

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

//오늘날짜를 넣는 것은 실제로 배포할 때! today_date 활용하면 됨.
//지금은 더미 날짜를 넣어두었음.
//let url = `${basic_request_url}&Key=${process.env.NEIS_KEY}&Type=json&pIndex=1&pSize=1&ATPT_OFCDC_SC_CODE=${gangwondo}&SD_SCHUL_CODE=${mySchool}&MLSV_YMD=${today_date}`;

//테스트용 급식 파싱 url
//오늘 날짜가 빠져있음.
let url = `${basic_request_url}&Key=${process.env.NEIS_KEY}&Type=json&pIndex=1&pSize=1&ATPT_OFCDC_SC_CODE=${gangwondo}&SD_SCHUL_CODE=${mySchool}&MLSV_YMD=20211224`;

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
  axios.get(url).then(async (res) => {
    neis_meal_info = parsing_json(res).toString();
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
