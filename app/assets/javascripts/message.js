$(function(){
  function buildHTML(message) {
    var image = ( message.image ) ? `<img class= "lower-message__content" src=${message.image} >` : "";
    var html =`<div class="messages_message" data-id="${message.id }>           
                <div class="messages__upper-info">
                  <p class="messages__upper-info__user-name">
                    ${message.name}
                  </p>
                  <p class="messages__upper-info__date">
                    ${message.created_at}
                  </p>
                </div>    
                <div class="messages__lower-info__text">
                  <p class="lower-message__content"> 
                    ${message.content}
                  </p>
                    ${image}
                </div>
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
      if (Object.keys(data).length !== 0){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('#new_message').get(0).reset();
      $('.messages').animate({scrollTop:$(".messages")[0].scrollHeight});
      }else{
        flashField = $('.flash-box');
        flashField.empty();
        var html = `<div class="alert">メッセージを入力してくだい</div>`
        $('.messages').append(html);
      }
      return false;
    })
    .fail(function() {
      alert('message error');
    })
    .always(function(){
      $(".form__submit").removeAttr("disabled");
    });
  });
    var reloadMessages = function () {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
    var href = 'api/messages#index {:format=>"json"}'  
    var last_message_id = $('.message:last').data('message-id');
    $.ajax({
      url: href,
      data: { id: last_message_id },
      type: "GET",
      dataType: 'json'
    })
      .done(function(message){
      console.log(message)
      var insertHTML = '';
      message.forEach(function(message){
      insertHTML = buildHTML(message);
      $('.messages').append(insertHTML);
      })
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');//最新のメッセージが一番下に表示されようにスクロールする。
    })
      .fail(function(date){
        alert('自動更新に失敗しました');
      });
      } 
    };
    setInterval(reloadMessages, 7000);
  });
    