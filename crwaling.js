const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');

const url = `https://www.weatheri.co.kr/forecast/forecast01.php?rid=0301050102&k=2&a_name=${encodeURIComponent(
  '횡성'
)}`;
let $href = [];
axios.get(url).then((dataa) => {
  const $ = cheerio.load(dataa.data);
  console.log(dataa.data);
  $(
    'body>table:nth-child(2)>tbody>tr:nth-child(3)>td>table>tbody>tr>td>table>tbody>tr:nth-child(3)>td>span>b '
  ).each((index, item) => {
    $href.push(item.attribs.href);
    console.log($href);
  });
});
