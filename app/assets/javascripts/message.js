$(function(){
  function buildHTML(message) {
    image = ( message.image ) ? `<img class= "lower-message__content" src=${message.image} >` : "";

    var html =`<div class="message" data-id="${ message.id }" data-user_id="${message.user_id}">           
                <div class="message__upper-info">
                  <p class="message__upper-info__user-name">
                    ${message.name}
                  </p>
                  <p class="message__upper-info__date">
                    ${message.created_at}
                  </p>
                </div>    
                <div class="message__lower-info__text">
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

});