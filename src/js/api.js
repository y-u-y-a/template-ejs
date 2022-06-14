/*******************************************
API: GET Test
********************************************/
const getTest = () => {
  console.log('call')
  $.ajax({ url: 'http://api.plos.org/search?q=title:DNA' })
    .done((data) => {
      console.log('done', data)
    })
    .fail((data) => {
      console.log('fail', data)
    })
}
/*******************************************
Set Events
api-[get or post]-[エンドポイント名]というルールで記述する
********************************************/
$('#api-get-test').on('click', () => getTest())
