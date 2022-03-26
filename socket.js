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
let minutes = today.getMinutes();

//초단기실황에 알맞게 시간 세팅 (1200 / 00기준임.)
//초단기예보는 (1230 / 30분 기준임.)
function getWeatherTime(url) {
  //초단기 실황 세팅 시간.
  const today = new Date();
  if (url == now_weather_base_url) {
    const hours = ('0' + today.getHours()).slice(-2) + '00';
    const hours_minus_1 = ('0' + (today.getHours() - 1)).slice(-2) + '00';
    if (today.getMinutes() < 45) {
      return hours_minus_1;
    } else {
      return hours;
    }
  }
  if (url == forcast_weather_base_url) {
    const hours = ('0' + today.getHours()).slice(-2) + '30';
    const hours_minus_1 = ('0' + (today.getHours() - 1)).slice(-2) + '30';
    if (today.getMinutes() < 45) {
      return hours_minus_1;
    } else {
      return hours;
    }
  }
}

//날짜 20220304 방식으로 합치기
let today_date = year + month + day;

//url 초기화하기
function initApiUrl(url, firstParams, firstValue) {
  return (
    url +
    '?' +
    encodeURIComponent(firstParams) +
    '=' +
    encodeURIComponent(firstValue)
  );
}

//파라미터 추가하기
function makeParams(str, value) {
  let result = '&' + encodeURIComponent(str) + '=' + encodeURIComponent(value);
  return result;
}

//국경일 특일 정보 url
let holiday_base_url =
  'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo';

//특일정보 담기
let holiday;

//특일 정보는 DECODING_KEY가 사용됨.
let holiday_url = initApiUrl(
  holiday_base_url,
  'ServiceKey',
  process.env.DECODING_KEY
);
holiday_url += makeParams('solYear', year);
holiday_url += makeParams('_type', 'json');
function getHoliday() {
  axios
    .get(holiday_url)
    .then(async (response) => {
      const result = await response;

      console.log(result.data.response.body.items);
      holiday = result.data.response.body.items;
    })
    .catch((err) => {
      console.log(err);
    });
}

//초단기 실황 정보 url
let now_weather_base_url =
  'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';

let weather_url = initApiUrl(
  now_weather_base_url,
  'serviceKey',
  process.env.DECODING_KEY
);
weather_url += makeParams('pageNo', '1');
weather_url += makeParams('numOfRows', '1000');
weather_url += makeParams('dataType', 'JSON');
weather_url += makeParams('base_date', `${today_date}`);
weather_url += makeParams(
  'base_time',
  `${getWeatherTime(now_weather_base_url)}`
);
weather_url += makeParams('nx', '75');
weather_url += makeParams('ny', '125');

let T1H_result; //기온
let RN1_result; //강수량(1시간)
let SKY_result; //하늘상태
let PTY_result; //강수형태
let WSD_result; //풍속
let VEC_result; //풍향
let REH_result; //습도

//초단기실황 가져오기
function getNowWeather() {
  axios
    .get(weather_url)
    .then(async (response) => {
      //console.log('초단기실황', response);
      const result = await response.data.response.body.items.item;
      console.log(result);
      for (let i in result) {
        //기온
        if (result[i].category == 'T1H') {
          console.log(
            `관측시간 : ${result[i].baseTime} 기온(T1H) : ${result[i].obsrValue}`
          );
          T1H_result = result[i].obsrValue;
        }
        if (result[i].category == 'PTY') {
          console.log(
            `관측시간 : ${result[i].baseTime} 강수형태(PTY) : ${result[i].obsrValue}`
          );
          PTY_result = result[i].obsrValue;
        }
        if (result[i].category == 'REH') {
          console.log(
            `관측시간 : ${result[i].baseTime} 습도(REH) : ${result[i].obsrValue}`
          );
          REH_result = result[i].obsrValue;
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

//초단기예보
let forcast_weather_base_url =
  'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';

let forcast_url = initApiUrl(
  forcast_weather_base_url,
  'serviceKey',
  process.env.DECODING_KEY
);
forcast_url += makeParams('pageNo', '1');
forcast_url += makeParams('numOfRows', '1000');
forcast_url += makeParams('dataType', 'JSON');
forcast_url += makeParams('base_date', `${today_date}`);
forcast_url += makeParams(
  'base_time',
  `${getWeatherTime(forcast_weather_base_url)}`
);
forcast_url += makeParams('pageNo', '1');
forcast_url += makeParams('nx', '75');
forcast_url += makeParams('ny', '125');

//초단기예보 가져오기
function getForcastWeather() {
  axios
    .get(forcast_url)
    .then(async (response) => {
      //console.log('초단기예보', response);
      const result = await response.data.response.body.items.item;

      for (let i in result) {
        //기온
        if (result[i].category == 'SKY') {
          console.log(
            `관측시간 : ${result[i].baseTime} 하늘상태(SKY) : ${result[i].fcstValue}`
          );
          SKY_result = result[i].fcstValue;
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

//미세먼지 정보 url
const dust_url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${
  process.env.OPEN_KEY
}&numOfRows=100&returnType=json&ver=1.3&sidoName=${encodeURIComponent('강원')}`;

let dust_result;
//미세먼지 정보 가져오기
function getNowDust() {
  axios
    .get(dust_url)
    .then(async (response) => {
      response.data.response.body.items.forEach((item, index, array) => {
        if (item.stationName == '지정면' && item.pm10Value != null) {
          dust_result = item;
          console.log(item);
        }

        // if (item.stationName == '횡성읍' && item.pm10Value != null) {
        //   dust_result = item;
        //   console.log(item);
        // }
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

//여기까지 미세먼지 가져오기.

//여기부터는 나이스 급식 가져오기

const gangwondo = 'K10';
const mySchool = '7891019';

//기본 호출 url 작성하기
const basic_request_url = 'https://open.neis.go.kr/hub/mealServiceDietInfo?';

//급식 파싱 url
let url = `${basic_request_url}&Key=${process.env.NEIS_KEY}&Type=json&pIndex=1&pSize=1&ATPT_OFCDC_SC_CODE=${gangwondo}&SD_SCHUL_CODE=${mySchool}&MLSV_YMD=${today_date}`;
//${today_date}

let school_schedule_url = 'https://open.neis.go.kr/hub/SchoolSchedule?';

//학사일정 파싱 url
let schedule_url = `${school_schedule_url}&Key=${process.env.NEIS_KEY}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${gangwondo}&SD_SCHUL_CODE=${mySchool}&AA_YMD=2022`;

let today_schedule;
let dateOfPresentation;
let dateOfSportsDay;
let dateOfSwim;
let dateOfProjectPresentation;

const get_schedule_info = () => {
  axios
    .get(schedule_url)
    .then(async (res) => {
      const result = res.data.SchoolSchedule[1].row;

      for (let i in result) {
        if (result[i].AA_YMD == today_date) {
          console.log('오늘의 행사: ', result[i].EVENT_NM);
          today_schedule = result[i].EVENT_NM;
        }

        if (result[i].EVENT_NM == '1차 교육과정 설명회 및 학부모 총회') {
          dateOfPresentation = result[i].AA_YMD;
        }
        if (result[i].EVENT_NM == '운동회') {
          dateOfSportsDay = result[i].AA_YMD;
        }
        if (result[i].EVENT_NM == '생존수영') {
          if (dateOfSwim == undefined) {
            dateOfSwim = result[i].AA_YMD;
          }
        }
        if (result[i].EVENT_NM == '프로젝트 발표회') {
          dateOfProjectPresentation = result[i].AA_YMD;
        }
      }
      console.log(`1차 교육과정 설명회 및 학부모 총회 : ${dateOfPresentation}`);
      console.log(`운동회 : ${dateOfSportsDay}`);
      console.log(`생존수영 : ${dateOfSwim}`);
      console.log(`프로젝트 발표회 : ${dateOfProjectPresentation}`);
    })
    .catch((err) => {
      console.error(err);
    });
};

//neis 급식 데이터 가져오기
function parsing_json(obj) {
  if (obj.data.mealServiceDietInfo[1] == null) {
    return null;
  } else {
    let meal_data_str = obj.data.mealServiceDietInfo[1].row[0].DDISH_NM;
    //숫자 제거 정규식
    meal_data_str = meal_data_str.replace(/[0-9]/g, '');

    //마침표 제거 정규식
    //마침표가 특수문자라 \역슬래시를 넣어줘야 했음.
    meal_data_str = meal_data_str.replace(/\./g, '');
    return meal_data_str;
  }
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

get_schedule_info();
get_meal_info();
getNowWeather();
getForcastWeather();
getNowDust();
getHoliday();

module.exports = (server) => {
  const io = SocketIO(server, { path: '/socket.io' });

  io.on('connection', (socket) => {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);

    socket.emit('meal', neis_meal_info);
    socket.emit('dust', dust_result);
    socket.emit('holiday', holiday);
    socket.emit('T1H', T1H_result);
    socket.emit('PTY', PTY_result);
    socket.emit('REH', REH_result);
    socket.emit('SKY', SKY_result);
    socket.emit(
      'schedule',
      today_schedule,
      dateOfSportsDay,
      dateOfSwim,
      dateOfProjectPresentation
    );

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

    //인터벌 생성
    //현재는 15분단위 반복
    socket.interval = setInterval(() => {
      //초단기실황 가져오기
      getNowWeather();

      //초단기예보 가져오기
      getForcastWeather();

      //미세먼지 정보 가져오기
      getNowDust();

      get_meal_info();

      getNowDust();
      //소켓 전송하기
      socket.emit('dust', dust_result);
      socket.emit('T1H', T1H_result);
      socket.emit('PTY', PTY_result);
      socket.emit('REH', REH_result);
      socket.emit('SKY', SKY_result);
    }, 1000 * 60 * 10); //15분 단위 반복
  });
};
