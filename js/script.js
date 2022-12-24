function searchDaft(form) {
  form = $(form);

  var input = form.find('input');
  var val = input.val().trim();

  if (val.length) {
    var suggestHistory = JSON.parse(localStorage.getItem('sgts')) || [];

    for (var i = 0; i < suggestHistory.length; i++) {
      var k = suggestHistory[i];

      if (k == val) {
        suggestHistory.splice(i, 1);
        break;
      }
    }

    suggestHistory.unshift(val);

    if (suggestHistory.length > 5) {
      suggestHistory.splice(-1, 1);
    }

    form.find('#search').addClass('loading');

    localStorage.setItem('sgts', JSON.stringify(suggestHistory));

    setTimeout(function() {
      location.href = 'https://dsex.to/video/' + val.replace(/\s+/, '%20');
    }, 50);
  } else {
    input.focus();
  }

  return false;
}

var suggestionTimer, suggestions = [];

$(function() {
  $('#search input').on('blur', function() {
    setTimeout(function() {
      $('.suggestions').empty();
    }, 250);
  }).on('focus', function() {
    input = $(this);
    suggestions = [];

    var find = (input.val().trim()).replace(/\s+/i, ' '), suggestHistory = JSON.parse(localStorage.getItem('sgts')) || [];

    if (find.length) {
      for (var i in pornstars) {
        var name = pornstars[i];

        if (m = name.match(new RegExp("\\b" + find, 'i'))) {
          suggestions.push($('<div/>').text(name).data('name', name).on('click', function() {
            var div = $(this);

            for (var j = 0; j < suggestHistory.length; j++) {
              var k = suggestHistory[j];

              if (k == div.data('name')) {
                suggestHistory.splice(j, 1);
                break;
              }
            }

            suggestHistory.unshift(div.data('name'));

            if (suggestHistory.length > 5) {
              suggestHistory.splice(-1, 1);
            }

            localStorage.setItem('sgts', JSON.stringify(suggestHistory));

            setTimeout(function() {
              location.href = 'https://dsex.to/video/' + (div.data('name')).replace(/\s+/, '%20');
            }, 50);
          }));
        }

        if (suggestions.length > 4) {
          break;
        }
      }

      $('.suggestions').html(suggestions);
    } else if (suggestHistory.length > 0) {
      for (var i in suggestHistory) {
        var searchVal = suggestHistory[i];

        suggestions.push($('<div/>').text(searchVal).data('name', searchVal).on('click', function() {
          var div = $(this);

          for (var j = 0; j < suggestHistory.length; j++) {
            var k = suggestHistory[j];

            if (k == div.data('name')) {
              suggestHistory.splice(j, 1);
              break;
            }
          }

          suggestHistory.unshift(div.data('name'));

          if (suggestHistory.length > 5) {
            suggestHistory.splice(-1, 1);
          }

          localStorage.setItem('sgts', JSON.stringify(suggestHistory));

          setTimeout(function() {
            location.href = 'https://dsex.to/video/' + (div.data('name')).replace(/\s+/, '%20');
          }, 50);
        }));
      }

      $('.suggestions').html(suggestions);
    }
  });

  $(window).on('keydown', function(event) {
    if ($('#input:focus').length) {
      if (event.keyCode == 38) {
        var lIndex = $('.suggestions > div.hovered').index();

        $('.suggestions > div.hovered').removeClass('hovered');

        if (lIndex > -1) {
          $('.suggestions > div').eq(lIndex - 1).addClass('hovered');
        } else {
          $('.suggestions > div').last().addClass('hovered');
        }

        event.stopPropagation();
        event.preventDefault();

        return false;
      } else if (event.keyCode == 40) {
        var lIndex = $('.suggestions > div.hovered').index();

        $('.suggestions > div.hovered').removeClass('hovered');

        if (lIndex < $('.suggestions > div').length - 1) {
          $('.suggestions > div').eq(lIndex + 1).addClass('hovered');
        } else {
          $('.suggestions > div').first().addClass('hovered');
        }

        event.stopPropagation();
        event.preventDefault();

        return false;
      } else if (event.keyCode == 13) {
        var lIndex = $('.suggestions > div.hovered').index();

        if (lIndex > -1) {
          event.stopPropagation();
          event.preventDefault();

          var suggestHistory = JSON.parse(localStorage.getItem('sgts')) || [];
          var div = $('.suggestions > div').eq(lIndex);

          for (var i = 0; i < suggestHistory.length; i++) {
            var k = suggestHistory[i];

            if (k == div.data('name')) {
              suggestHistory.splice(i, 1);
              break;
            }
          }

          suggestHistory.unshift(div.data('name'));

          if (suggestHistory.length > 5) {
            suggestHistory.splice(-1, 1);
          }

          localStorage.setItem('sgts', JSON.stringify(suggestHistory));

          setTimeout(function() {
            location.href = 'https://dsex.to/video/' + (div.data('name')).replace(/\s+/, '%20');
          }, 50);

          return false;
        }
      } else {
        input = $('#input:focus');

        suggestionTimer && clearTimeout(suggestionTimer);

        suggestionTimer = setTimeout(function() {
          suggestions = [];

          var find = input.val().trim();

          if (find.length) {
            for (var i in pornstars) {
              var name = pornstars[i];

              if (m = name.match(new RegExp("\\b" + find, 'i'))) {
                suggestions.push($('<div/>').text(name).data('name', name).on('click', function() {
                  var div = $(this), suggestHistory = JSON.parse(localStorage.getItem('sgts')) || [];

                  for (var j = 0; j < suggestHistory.length; j++) {
                    var k = suggestHistory[j];

                    if (k == div.data('name')) {
                      suggestHistory.splice(j, 1);
                      break;
                    }
                  }

                  suggestHistory.unshift(div.data('name'));

                  if (suggestHistory.length > 5) {
                    suggestHistory.splice(-1, 1);
                  }

                  localStorage.setItem('sgts', JSON.stringify(suggestHistory));

                  setTimeout(function() {
                    location.href = 'https://dsex.to/video/' + (div.data('name')).replace(/\s+/, '%20');
                  }, 50);
                }));
              }

              if (suggestions.length > 4) {
                break;
              }
            }

            $('.suggestions').html(suggestions);
          } else {
            var suggestHistory = JSON.parse(localStorage.getItem('sgts')) || [];

            if (suggestHistory.length > 0) {
              for (var i in suggestHistory) {
                var searchVal = suggestHistory[i];

                suggestions.push($('<div/>').text(searchVal).data('name', searchVal).on('click', function() {
                  var div = $(this);

                  for (var j = 0; j < suggestHistory.length; j++) {
                    var k = suggestHistory[j];

                    if (k == div.data('name')) {
                      suggestHistory.splice(j, 1);
                      break;
                    }
                  }

                  suggestHistory.unshift(div.data('name'));

                  if (suggestHistory.length > 5) {
                    suggestHistory.splice(-1, 1);
                  }

                  localStorage.setItem('sgts', JSON.stringify(suggestHistory));

                  setTimeout(function() {
                    location.href = 'https://dsex.to/video/' + (div.data('name')).replace(/\s+/, '%20');
                  }, 50);
                }));
              }

              $('.suggestions').html(suggestions);
            } else {
              $('.suggestions').empty();
            }
          }
        }, 10);
      }
    }
  });
});