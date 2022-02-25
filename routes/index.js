const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('main');
});

module.exports = router;

// const axios = require('axios').default;
// const dotenv = require('dotenv');
// dotenv.config();
// const dustInfo = document.querySelector('#dust_info');

// const dust_url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${
//   process.env.OPEN_KEY
// }&numOfRows=100&returnType=json&sidoName=${encodeURIComponent('강원')}`;

// axios
//   .get(dust_url)
//   .then(async (response) => {
//     const result = await console.log(response);
//     let mySchoolDust = new Object();

//     response.data.response.body.items.forEach((item, index, array) => {
//       if (item.stationName == '지정면') {
//         mySchoolDust = item;
//         dustInfo.textContent = mySchoolDust.pm10Value;
//       }
//     });
//     console.log(`${mySchoolDust}`);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
