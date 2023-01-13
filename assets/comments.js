function SendComment(self) {
  self = $(self);

  var tarea = $('#comment_value');

  if (!(tarea.val().trim()).length) {
    tarea.focus();
    return;
  }

  if ((tarea.val().trim()).match(/((https?):\/\/)?([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i)) {
    alert('Links in comments are forbidden!');
    return;
  }

  if (($('#comment_owner').val().trim()).length) {
    if (!(($('#comment_owner').val().trim()).replace(/\s+/, ' ')).match(/^[a-zA-Zа-яА-ЯёЁ0-9\-_\.\s]{3,50}$/i)) {
      return $('#comment_owner').focus();
    }
  }

  Message.Show('\
    <div class="m_close"></div>\
    <div class="m_content_layer"></div>\
    <div class="m_over_layer"><div id="recaptcha" style="width: 304px; height: 78px; margin: 25px auto;"></div></div>\
    <div class="clear"></div></div>', {
    width: 340,
    onshow: function() {
      $('.m_close').on('click', function() {
        Message.Hide();
      });

      window.reCaptchaShow = function() {
        try {
          grecaptcha.reset();
        } catch (e) {}

        grecaptcha.render('recaptcha', {
          sitekey: '6LfGyDkUAAAAADeW-UUoMQlqDTVmT6tutP0E3HZF',
          callback: function() {
            self.prop('disabled', true);

            $.post('/application/ajax/comments.php', {
              act: 'add',
              name: $('#comment_owner').val().trim(),
              text: tarea.val().trim(),
              id: $('#video_hash').val().trim(),
              reply: $('#comment_reply').val(),
              "g-recaptcha-response": $('textarea[name="g-recaptcha-response"]').val()
            }, function(response) {
              self.prop('disabled', false);

              if (response.result) {
                Message.Hide();
                tarea.val('');
                // var c = parseInt($('#comments_count_bar').attr('data-count'), 10) + 1;

                $('#comment_owner').val('');
                // $('#comments_count_bar').html(c == 0 ? 'Comments' : declOfNum(c, ['%n comment', '%n comments', '%n comments'])).attr('data-count', c);

                if ($('#comments_wrapper > .comment').length == 50) {
                  $('#comments_wrapper > .comment').last().remove();
                  $('#comments_more').show();
                }

                $('#comments_wrapper').prepend('\
                  <div class="comment" id="comment'+response.result.id+'" style="background: rgba(199, 201, 169, 0.5);">\
                    <div class="comment_owner">'+response.result.name+'</div>\
                    <div class="comment_text">'+response.result.text+'</div>\
                    <div class="comment_date">'+response.result.date+' | <a onclick="deleteComment(\''+response.result.id+'\')">удалить</a></div>\
                  </div>');

                $('#comments_wrapper > .comment:eq(0)').animate({backgroundColor: '#222326'}, 2000);
              } else {
                Message.Hide();

                if (response.error.recaptcha) {
                  alert(response.error.message);
                } else if (!response.error.hide) {
                  alert(response.error.message);
                }
              }
            }, 'json');
          }
        });
      }

      if (!window.grecaptcha) {
        var js = document.createElement('script');
        js.src = '//www.google.com/recaptcha/api.js?onload=reCaptchaShow&render=explicit&hl=ru';
        js.async = true;

        $('head').append(js);
      } else {
        reCaptchaShow();
      }
    }
  });
}

var commentsLoaded = false;

function loadComments(id) {
  if (commentsLoaded) {
    return;
  }

  $.post('/application/ajax/comments.php', {
    act: 'load',
    id: id
  }, function(response) {
    if (response.result) {
      $.each(response.result.comments, function() {
        $('#comments_wrapper').append('\
          <div class="comment" id="comment'+this.id+'">\
            <div class="comment_owner">'+this.name+'</div>\
            <div class="comment_text">'+this.text+'</div>\
            <div class="comment_date">'+this.date+(this.is_owner ? ' | <a onclick="deleteComment(\''+this.id+'\')">remove</a>' : ' | <a onclick="answerComment(\''+this.name+'\', \''+this.id+'\');">replay</a>')+'</div>\
          </div>');
      });
    }
  }, 'json');
}

function moreComments(self) {
  self = $(self);

  if (self.hasClass('active')) {
    return;
  }

  self.addClass('active');

  var page = parseInt(self.attr('data-page'), 10);

  $.post('/application/ajax/comments.php', {
    act: 'more',
    page: page,
    id: $('#video_hash').val().trim()
  }, function(response) {
    page++;
    self.removeClass('active');

    if (response.result) {
      if (response.result.comments.length < 20) {
        self.hide();
      }

      self.attr('data-page', page);

      $.each(response.result.comments, function() {
        $('#comments_wrapper').append('\
          <div class="comment" id="comment'+this.id+'">\
            <div class="comment_owner">'+this.name+'</div>\
            <div class="comment_text">'+this.text+'</div>\
            <div class="comment_date">'+this.date+(this.is_owner ? ' | <a onclick="deleteComment(\''+this.id+'\')">удалить</a>' : ' | <a onclick="answerComment(\''+this.name+'\', \''+this.id+'\');">ответить</a>')+'</div>\
          </div>');
      });
    } else {
      self.hide();
    }
  }, 'json');
}

function commentLine(event) {
  event = event || window.event;
  var keyCode = event.charCode || event.keyCode;

  if (keyCode == 13) {
    SendComment($('#comment_send'));

    return false;
  }

  return true;
}

function answerComment(name, comment_id) {
  var comment_value = $('#comment_value');
  $('#comment_reply').val(comment_id);

  comment_value.val(name+', '+comment_value.val().trim()).focus();
}

function deleteComment(id) {
  $.post('/application/ajax/comments.php', {
    act: 'delete',
    id: id
  }, function(response) {
    if (response.result) {
      // var c = parseInt($('#comments_count_bar').attr('data-count'), 10) - 1;
      // $('#comments_count_bar').html(c == 0 ? 'Comments' : declOfNum(c, ['%n comment', '%n comments', '%n comments'])).attr('data-count', c);
      $('#comment'+id).remove();
    }
  }, 'json');
}
