let quote_array = new Array();
quote_array[0] = '1';
quote_array[1] = '2';
quote_array[2] = '3';
quote_array[3] = '4';
quote_array[4] = '5';
quote_array[5] = '6';

function randomNum(min, max) {
  let randNum = Math.floor(Math.random() * (max - min)) + min;
  return randNum;
}
function make_today_quote() {
  console.log('오늘의 quote생성됨.');
  const result = quote_array[randomNum(1, 6)];
  return result;
}

const today_qoute = make_today_quote();
const today_english = `earth*지구`;
const today_phrase = `대기만성*크게 될 사람은 오랫동안 공적을 쌓아 늦게 이루어짐.`;

module.exports = {
  today_qoute,
  today_english,
  today_phrase,
};
