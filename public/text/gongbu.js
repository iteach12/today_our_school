//명언 18개
let quote_array = new Array();
quote_array[0] = '내일이란 오늘의 다른 이름일 뿐이다.*윌리엄 해리슨(소설가)';
quote_array[1] = '산은 올라가는 자만이 정복하는 것이다.*알랭(철학자)';
quote_array[2] = '절망이 없다면 희망도 없다.*알베르 카뮈(소설가)';
quote_array[3] = '좋은 책은 친구와 같다.*아베 드 생피에르';
quote_array[4] = '펜은 칼보다 강하다.*에드워드 조지 불위 리턴';
quote_array[5] = '말은 마음의 초상이다.*레이(소설가)';
quote_array[5] = '용기있는 한 사람이 다수의 힘을 갖는다.*앤드루 잭슨';
quote_array[6] = '꿈 꾸는 자만이 이룰 수 있다.*월트 디즈니';
quote_array[7] = '웃음이 없는 하루는 버린 하루다.*찰리 채플린';
quote_array[8] =
  '우리는 한 번도 존재하지 않았던 것을 꿈꿀 수 있는 사람들이 필요하다.*존 F 케네디';
quote_array[9] =
  '조금도 도전하지 않으려고 하는 것이 인생에서 가장 위험한 일이다.*오프라 윈프리';
quote_array[10] = '행동은 모든 성공의 가장 기초적인 핵심이다.*파블로 피카소';
quote_array[11] = '승리는 가장 끈기 있는 사람에게 돌아간다.*나폴레옹';
quote_array[12] = '노력하는 사람에게 불가능이란 없다.*알렉산더 대왕';
quote_array[13] =
  '오늘 나무 그늘에서 쉴 수 있는 이유는 예전에 나무를 심었기 때문이다.*워렌 버핏';
quote_array[14] =
  '네가 누구인지, 무엇인지 말해 줄 사람은 필요 없다. 너는 그냥 너 자신일 뿐이다.*존 레논';
quote_array[15] = '나약한 태도는 그 사람 자체를 나약하게 만든다.*아인슈타인';
quote_array[16] =
  '태도는 사소한 것이지만 그것이 만드는 차이는 엄청나다.*윈스턴 처칠';
quote_array[17] =
  '작은 일에 헌신하라. 그 안에 당신이 가진 힘이 있다.*마더 테레사';

let english_word_array = new Array();
english_word_array[0] = '';
// 'afternoon*오후'
// 'animal*동물'
// 'always*언제나, 항상'
// 'book*책'
// 'boat*보트, 작은 배'
// 'balloon*풍선'
// 'believe*믿다'
// 'calender*달력'
// 'cap*모자'
// 'change*바꾸다'
// 'circle*원,동그라미'
// 'cry*울다'
// 'cut*자르다'
// 'date*날짜'
// 'danger*위험한'
// 'dark*어두운'
// 'doctor*의사'
// 'dream*꿈'
// 'duck*오리'
// 'ear*귀'
// 'early*일찍'
// 'excellent*뛰어난,훌륭한'
// 'every*모든,모두의'
// 'face*얼굴'
// 'family*가족'
// 'famous*유명한'
// 'father*아버지'
// 'fast*빠른'
// 'fresh*신선한'
// 'front*앞,정면'
// 'full*가득찬'
// 'glove*장갑'
// 'grandmother*할머니'
// 'green*초록'
// 'grow*성장하다'
// 'hair*머리카락'
// 'half*절반'
// 'hand*손'
// 'heavy*무거운'
// 'hide*숨기다'
// 'hold*잡다'
// 'holiday*휴일'
// 'hope*희망'
// 'interest*흥미,재미'
// 'introduce*소개하다'
// 'idea*생각'
// 'island*섬'
// 'job*직업'
// 'join*가입하다'
// 'jump*뛰어오르다'
// 'key*열쇠'
// 'lake*호수'
// 'large*큰,넓은'
// 'late*늦은'
// 'laugh*웃다'
// 'learn*배우다'
// 'left*왼쪽'
// 'library*도서관'
// 'light*빛'
// 'lunch*점심식사'
// 'make*만들다'
// 'many*많은'
// 'matter*문제,물체'
// 'meat*고기'
// 'money*돈'
// 'morning*아침'
// 'move*움직이다'
// 'music*음악'
// 'near*가까이'
// 'neck*목'
// 'number*숫자'
// 'nurse*간호사'
// 'often*흔히,종종'
// 'old*늙은'
// 'parent*부모님'
// 'park*공원'
// 'peace*평화'
// 'pencil*연필'
// 'people*사람'
// 'picture*그림'
// 'practice*연습,습관'
// 'problem*문제'
// 'push*밀다'
// 'question*질문'
// 'quick*빠른'
// quiet*조용한
// radio*라디오
// rain*비
// rich*부유한
// send*보내다
// shoe*신발
// short*짧은
// shout*소리치다
// show*보이다
// some*약간의
// stay*머물다
// stop*멈추다
// straight*곧은
// supermarket*슈퍼마켓
// suprise*놀라운
// table*탁자,식탁
// talk*말하다
// taste*맛보다
// thick*두꺼운
// think*생각하다
// thousand*1000,천
// travel*여행
// umbrella*우산
// understand*이해하다
// use*사용하다
// vacation*휴가
// wand*원하다
// warm*따뜻한
// weather*날씨
// woman*여자
// word*단어,낱말
// write*쓰다
// worng*틀린,나쁜
// year*해,1년
// yesterday*어제
// young*젊은
// zoo*동물원

function randomNum(min, max) {
  let randNum = Math.floor(Math.random() * (max - min)) + min;
  return randNum;
}
function make_today_quote() {
  console.log('오늘의 quote생성됨.');
  const result = quote_array[randomNum(1, 18)];
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
