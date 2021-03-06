$(function(){
  function buildHTML(message) {
  var image = (message.image) ? `<img class = "lower-message__image" src= ${message.image}>` : "";
  var html =
`<div class="messages__message" data-message-id="${message.id}">
  <div class="messages__upper-info">
    <p class="messages__upper-info__user-name">
      ${message.user_name}
    </p>
    <p class="messages__upper-info__date">${message.created_at}
    </p>
  </div>
  <div class="messages__lower-info__text">
  </div>
  <p class="lower-message__content">
    ${message.content}
  </p>
  </div>
    ${image}
  </div>`
  return html;
  }
  

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,  //同期通信でいう『パス』
      type: "POST",  //同期通信でいう『HTTPメソッド』
      data: formData,  
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
      $('.form__message').val('');
      $('.hidden').val('');
      $(".form__submit").prop('disabled', false);    
    })
    .fail(function() {
      alert('message error');
    })
  });
    var reloadMessages = function () {
      if (window.location.href.match(/\/groups\/\d+\/messages/)){
        var href = 'api/messages#index {:format=>"json"}'  
        var last_message_id = $(".messages__message:last").data("message-id");
   
    $.ajax({
      url: "api/messages",
      type: "get",
      dataType: 'json',
      data: {id: last_message_id}
      
    })
    .done(function(message){
    var html = '';
    message.forEach(function(message){
    html = buildHTML(message);
    $('.messages').append(html);
    $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
    });//最新のメッセージが一番下に表示されようにスクロールする。
    })
      .fail(function(date){
        alert('自動更新に失敗しました');
      });
    }
  };
  setInterval(reloadMessages, 7000);
  });