// Browser User-Agent
var webmSupport = ((document.createElement('video')).canPlayType('video/webm; codecs="vp8, vorbis"') === 'probably');
var _ua = navigator.userAgent.toLowerCase();
var browser = {
  version: (_ua.match(/.+(?:me|ox|on|rv|it|era|opr|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
  opera: (/opera/i.test(_ua) || /opr/i.test(_ua)),
  msie: (/msie/i.test(_ua) && !/opera/i.test(_ua) || /trident\//i.test(_ua)),
  msie6: (/msie 6/i.test(_ua) && !/opera/i.test(_ua)),
  msie7: (/msie 7/i.test(_ua) && !/opera/i.test(_ua)),
  msie8: (/msie 8/i.test(_ua) && !/opera/i.test(_ua)),
  msie9: (/msie 9/i.test(_ua) && !/opera/i.test(_ua)),
  mozilla: /firefox/i.test(_ua),
  chrome: /chrome/i.test(_ua),
  safari: (!(/chrome/i.test(_ua)) && /webkit|safari|khtml/i.test(_ua)),
  iphone: /iphone/i.test(_ua),
  ipod: /ipod/i.test(_ua),
  iphone4: /iphone.*OS 4/i.test(_ua),
  ipod4: /ipod.*OS 4/i.test(_ua),
  ipad: /ipad/i.test(_ua),
  android: /android/i.test(_ua),
  bada: /bada/i.test(_ua),
  mobile: /iphone|ipod|ipad|opera mini|opera mobi|iemobile|android/i.test(_ua),
  msie_mobile: /iemobile/i.test(_ua),
  safari_mobile: /iphone|ipod|ipad/i.test(_ua),
  opera_mobile: /opera mini|opera mobi/i.test(_ua),
  opera_mini: /opera mini/i.test(_ua),
  mac: /mac/i.test(_ua),
  retina: (function() {
    return window.devicePixelRatio > 1;
  })(),
}, threshold = 160;

window.gXHR = null;
window._page = 1;
window._sort = 0;
window._longer = 0;
window.showNProgress = false;

function setCookie(a,b,c){c=c||{};var d=c.expires;if("number"==typeof d&&d){var e=new Date;e.setTime(e.getTime()+1e3*d),d=c.expires=e}d&&d.toUTCString&&(c.expires=d.toUTCString()),b=encodeURIComponent(b);var f=a+"="+b;for(var g in c){f+="; "+g;var h=c[g];h!==!0&&(f+="="+h)}document.cookie=f};
function getCookie(a){var b=document.cookie.match(new RegExp("(?:^|; )"+a.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1')+"=([^;]*)"));return b?decodeURIComponent(b[1]):void 0};

function previewEvents() {
  if (!$('[data-webm]').length || !webmSupport) {
    return;
  }

  if (!browser.mobile) {
    $('[data-webm]').on('mouseenter', function() {
      var webmEl = $(this);
      var webmData = (webmEl.data('webm')).split(',');

      if (webmData.length == 2) {
        var video = $('<video autoplay muted>').html('<source src="https://' + webmData[0] + '/videos/' + (webmEl.data('id')).replace('_', '/') + '/preview.webm?extra=' + webmData[1] + '" type=\'video/webm; codecs="vp8, vorbis"\' />');
        webmEl.find('.video-preview').html(video);

        video.children('source').last().on('error', function() {
          webmEl.removeData('webm').removeAttr('data-webmevent');
        });

        video.on('play', function() {
          webmEl.find('.video-img').addClass('show-preview');
        });

        video.on('ended', function() {
          webmEl.find('.video-preview').hide();
          webmEl.find('.video-img').removeClass('show-preview');
        });
      }
    }).on('mouseleave', function() {
      $(this).find('.video-img').removeClass('show-preview');
      $(this).find('.video-preview').show().html('');
    });

    $('[data-webm]').each(function() {
      var webm = $(this).data('webm');

      $(this).removeAttr('data-webm').attr('data-webmevent', 1).data('webm', webm);
    });
  }
}

function getImage() {
  return window.Image ? (new Image()) : document.createElement('img');
}

function updateCounter(url, referrer) {
  getImage().src = location.protocol + '//counter.yadro.ru/hit?t26.6r' + escape(referrer || document.referrer) + ((typeof (screen) == 'undefined') ? '' : ';s' + screen.width + '*' + screen.height + '*' + (screen.colorDepth ? screen.colorDepth : screen.pixelDepth)) + ';u' + escape(document.URL) + ';' + Math.random();
}

function setTitle(el) {
  el = $(el);

  if (!el.length || el.attr('titleSet')) return;

  if (el.get(0).scrollWidth > el.get(0).clientWidth) {
    el.attr('title', el.text() || el.get(0).textContent);
  }

  el.attr('titleSet', 1);
}

function toTop() {
  $('html, body').animate({scrollTop: 0}, 0);
}

function isEmail(email) {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

function isPass(val) {
  return (val.length >= 6);
}

function checkEvent(e) {
  return ((e = (e || window.event)) && (e.type == 'click' || e.type == 'mousedown' || e.type == 'mouseup') && (e.which > 1 || e.button > 1 || e.ctrlKey || e.shiftKey || e.metaKey)) || false;
}

function search(ps, fm) {
  var q = $('#q');

  if (!(q.val().trim()).length) {
    q.focus();

    return false;
  }

  if (fm) {
    location.href = '/video/' + (q.val().trim()).replace(/\s+/, '%20');
  } else {
    $('button.btn-search').removeClass('open');
    $('body').removeClass('search_open');

    window.showNProgress = true;

    NProgress.configure({
      parent: '#progress_content'
    });

    NProgress.start();

    go('/video/' + (q.val().trim()).replace(/\s+/, '%20'), (ps || false));
  }

  return false;
}

window.lastURL = location.href;

function go(url, ps) {
  if ((url.match(/^\/video\/$/i) || url == '/') && !is_logged) {
    location.href = url;

    return true;
  }

  var ref = window.lastURL;

  try {
    gXHR.abort && gXHR.abort();
  } catch (e) {}

  var referrerURL = location.href;

  if (ps) {
    history.pushState(null, null, url);
  }

  $('.content_loader').remove();
  $('body').append('<div class="content_loader"></div>');

  var params = {};

  if (url.match(/\/video\/(.+)/i)) {
    params.hd = $('#hd').is(':checked') ? 1 : 0;
    params.sort = window._sort;
    params.longer = window._longer;
  }

  try {
    if ((m = url.match(/\/video\/(.+)/i)) && ps) {
      $('#q').val((decodeURIComponent(m[1])).toString().replace(/%20/g, ' ').replace(/%22/g, '"'));
    }
  } catch (e) {}

  if ((m = referrerURL.match(/^https?\:\/\/biqle\.ru\/video\/(.+)/i)) && ps && url.match(/\/watch\/(.+)/i)) {
    params.q = (decodeURIComponent(m[1])).toString().replace(/%20/g, ' ').replace(/%22/g, '"');
  }

  var fastWatchShow = false;

  if (!ref.match(/\/watch\/(-?[0-9]+_[0-9]+)$/i) && url.match(/\/watch\/(-?[0-9]+_[0-9]+)$/i) && $('input[name="nofast"]').length) {
    fastWatchShow = true;
  }

  if (!ps && !url.match(/\/watch\/(-?[0-9]+_[0-9]+)$/i) && ref.match(/\/watch\/(-?[0-9]+_[0-9]+)$/i) && $('input[name="nofast"]').length) {
    commentsLoaded = false;

    if (window.showNProgress) {
      NProgress.done();
    }

    window.showNProgress = false;
    window.lastURL = url;

    $('.fastWatch').remove();
    $('#content').children().show();
    $('.logo,.back-logo').removeClass('is-fast');

    return;
  }

  if (!fastWatchShow) {
    window._page = 1;
  }

  if (!window.showNProgress) {
    NProgress.configure({
      parent: '#progress_content'
    });

    NProgress.start();

    window.showNProgress = true;
  }

  commentsLoaded = false;

  window.lastURL = url;

  gXHR = $.post(url, params, function(response) {
    if (window.showNProgress) {
      NProgress.done();
    }

    toTop();

    window.showNProgress = false;

    if (fastWatchShow) {
      $('#content').children().hide();
      $('#content').append($('<div class="fastWatch"></div>').html(response));

      $('.logo,.back-logo').addClass('is-fast');
    } else {
      // $('[data-webmevent]').off('mouseenter mouseleave');
      $('.logo,.back-logo').removeClass('is-fast');
      $('#content').html(response);
    }

    if ((url.match(/^\/video\/$/i) || url == '/') && !is_logged) {
      $('body').addClass('main');
    } else {
      $('body').removeClass('main');
    }

    previewEvents();

    // $('#content').html(response);
    share42init($);

    updateCounter(url, referrerURL);
  }, 'html');
}

function toggleFilters() {
  if ($('.filters').is(':visible')) {
    $('.filters').hide();
  } else {
    $('.filters').show();
  }
}

function filterHD(self) {
  search();
}

function setFilters(self, filterName, value) {
  self = $(self);

  if (self.hasClass('active')) {
    $('.filters').hide();
    return;
  }

  self.parent().children('.active').removeClass('active');
  self.addClass('active');

  window['_' + filterName] = value;

  search();
}

function more(self) {
  window.showNProgress = true;

  NProgress.configure({
    parent: '#progress_more'
  });

  NProgress.start();

  if ((history.location.pathname || document.location.pathname).toString().match(/^\/favorite\//i)) {
    window._page++;

    $.post((history.location.pathname || document.location.pathname).toString(), {
      page: window._page
    }, function(response) {
      if (window.showNProgress) {
        NProgress.done();
      }

      window.showNProgress = false;

      $(self).replaceWith(response);
      previewEvents();
    }, 'html');
  } else {
    $.post((history.location.pathname || document.location.pathname).toString(), {
      hd: $('#hd').is(':checked') ? 1 : 0,
      sort: window._sort,
      longer: window._longer,
      page: window._page
    }, function(response) {
      window._page++;

      if (window.showNProgress) {
        NProgress.done();
      }

      window.showNProgress = false;

      $(self).replaceWith(response);
      previewEvents();
    }, 'html');
  }
}

$(window).on('popstate', function() {
  var returnLocation = (history.location.pathname || document.location.pathname).toString()+''+(history.location.search || document.location.search).toString();

  if (m = returnLocation.match(/\/video\/(.+)/i)) {
    $('#q').val((decodeURIComponent(m[1])).toString().replace(/%20/g, ' ').replace(/%22/g, '"'));
    search();
  } else {
    if (/^\/\?cat_id=/i.test(returnLocation)) {
      NProgress.configure({
        parent: '#progress_content'
      });

      NProgress.start();

      window.showNProgress = true;
    }

    go(returnLocation, false);
  }
});

var upVisible = false;

function loadMore(self) {
  self = $(self);

  $.post((history.location.pathname || document.location.pathname).toString()+''+(history.location.search || document.location.search).toString(), {
    page: self.data('page')
  }, function(result) {
    self.replaceWith(result);
    previewEvents();
  });
}

var winFullscreenTimer, winFullscreen = false;

$(function() {
  if (!browser.mobile) {
    $(window).on('keydown', function(event) {
      if ((((event.ctrlKey && event.shiftKey) || (event.altKey && event.metaKey)) && (event.keyCode == 74 || event.keyCode == 73 || event.keyCode == 67)) || ((event.ctrlKey || event.metaKey) && event.keyCode == 85)) {
        setTimeout(function() {
          var widthThreshold = window.outerWidth - window.innerWidth > threshold;
          var heightThreshold = window.outerHeight - window.innerHeight > threshold;

          if (widthThreshold || heightThreshold) {
            setCookie('_dt', 1, {
              path: '/',
              expires: 1800,
              domain: '.'+location.hostname
            });
            dt();
          }
        }, 500);
      }
    });

    $(window).on('fullscreenchange', function() {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        winFullscreen = true;
      } else if (winFullscreen) {
        winFullscreenTimer && clearTimeout(winFullscreenTimer);

        winFullscreenTimer = setTimeout(function() {
          winFullscreen = false;
        }, 501);
      }
    });
  }

  $(window).on('scroll', function() {
    if ($(document).scrollTop() >= 300 && !upVisible) {
      upVisible = true;
      $('a.up').stop(true, true).animate({opacity: 1}, 150);

      if ($('#video_hash').length) {
        loadComments($('#video_hash').val().trim());
      }
    } else if (upVisible && $(document).scrollTop() < 300) {
      upVisible = false;
      $('a.up').stop(true, true).animate({opacity: 0}, 150);
    } else if (($(document).scrollTop() + $(window).height()) == $(document).height()) {
      if ($('#video_hash').length) {
        loadComments($('#video_hash').val().trim());
      }
    }
  });

  $(document).on('click', function(event) {
    var i = 8, target = event.target || event.srcElement, bodyNode = $('body').get(0);

    if (target.className == 'more' && $(target).data('page')) {
      loadMore(target);

      return false;
    }

    if ($('.filters').is(':visible') && !$(target).hasClass('filter_btn')) {
      if (!$(target).parents('.filters').length) {
        $('.filters').hide();
      }
    }

    if ($(target).hasClass('video-fav') || $(target).hasClass('video-show')) {
      return false;
    }

    while (target && target != bodyNode && target.tagName != 'A' && i--) {
      target = target.parentNode;
    }

    if (!target) {
      return checkEvent(event);
    }

    if (target.tagName == 'A' && !target.onclick && target.href && !checkEvent(event) && !target.target) {
      if (target.href.match(/\/auth\/logout/i)) {
        return true;
      }

      if (m = target.href.match(/\/video\/(.+)/i)) {
        $('#q').val((decodeURIComponent(m[1])).toString().replace(/%20/g, ' ').replace(/%22/g, '"'));
      }

      if (/\/\?cat_id=/i.test(target.href)) {
        NProgress.configure({
          parent: '#progress_content'
        });

        NProgress.start();

        window.showNProgress = true;
      }

      var href = target.href.replace(/^https?:\/\//i, '');

      if (!href.indexOf(location.hostname)) {
        href = href.replace(location.hostname, '');
      }

      go(href, true);

      return checkEvent(event);
    }

    return true;
  });

  $('button.btn-search').on('click', function() {
    if ($(this).hasClass('open')) {
      $(this).removeClass('open');
      $('body').removeClass('search_open');
    } else {
      $(this).addClass('open');
      $('body').addClass('search_open');
    }
  });

  $('.bg_layer').on('click', function() {
    $('button.btn-search').removeClass('open');
    $('body').removeClass('search_open');
  });

  runtime();
});

function Message() {
  var m_box = {length: 0}, onhide = function() {};

  function setPosition() {
    if (m_box.length) {
      m_box.css({top: Math.max(30, ($(window).height() - m_box.height()) / 4)});
    }
  }

  this.Show = function(content, params) {
    var _this = this, m_layer = $('<div>').addClass('m_layer');
    m_box = $('<div>').addClass('m_box');

    params = $.extend({
      width: 600,
      onhide: function() {},
      onshow: function() {}
    }, params);

    onhide = params.onhide;

    m_box.width(params.width).css({marginLeft: -(params.width / 2)}).append((browser.mobile ? '<a class="m_close">закрыть</a></div>' : '')+'<div class="m_content">' + content + '</div>');

    if (browser.mobile) {
      m_box.find('.m_title > a.m_close').on('click', function() {
        Message.Hide();
      });
    }

    m_layer.append(m_box);

    $('html').append(m_layer);

    setPosition();

    m_layer.on('click', function(event) {
      var target = event.target || event.srcElement;

      if (target == this) {
        Message.Hide();
      }
    });

    m_layer.stop(true, true).animate({opacity: 1}, 150);

    if ($.isFunction(params.onshow)) {
      setTimeout(function() {
        params.onshow.call(_this);
      }, 200);
    }

    return this;
  }

  this.Hide = function() {
    var _this = this;
    m_box = {length: 0};

    if ($.isFunction(onhide)) {
      onhide.call(_this);
    }

    $('.m_layer').stop(true, true).fadeOut(150, function() {
      $('.m_layer').remove();
    });
  }

  this.Resize = function() {
    setPosition();
  };

  $(window).on('resize', function() {
    setPosition();
  });
}

Message = new Message();

function Video() {
  this.show = function(owner_id, id, frameHash) {
    $('body').append('\
    <div class="video_wrapper" id="video_wrapper" onclick="Video.close();">\
      <div class="video_window" onclick="event.cancelBubble = true;">\
        <script id="data-embed-video-' + frameHash + '"></script>\
        <div class="video_close" onclick="Video.close();"></div>\
      </div>\
    </div>');

    if (window.DaxabPlayer && window.DaxabPlayer.Init) {
      DaxabPlayer.Init({
        id: 'video' + owner_id + '_' + id,
        origin: window.globEmbedUrl.replace('/player/', ''),
        embedUrl: window.globEmbedUrl,
        hash: frameHash,
        styles: {
          width: '800px',
          height: '450px',
          border: '0',
          overflow: 'hidden'
        },
        attrs: {
          frameborder: '0',
          allowFullScreen: '',
          scrolling: 'no',
          preventhide: '0'
        },
        events: function(data) {
          if (data.event == 'player_show') {
            dt();
          }
        }
      });
    }
  };

  this.close = function() {
    $('#video_wrapper').fadeOut(200, function() {
      $(this).remove();
    });
  };
}

Video = new Video();

// function Embed() {
//   var curOwnerId, curId, curWidth = 800, curHeight = 450, curAutoPlay = 0;

//   this.show = function(owner_id, id) {
//     curOwnerId = owner_id;
//     curId = id;
//     curWidth = 800;
//     curHeight = 450;
//     curAutoPlay = 0;

//     $('body').append('\
//     <div class="embed_wrapper" id="embed_wrapper" onclick="Embed.close();">\
//       <div class="embed_window" onclick="event.cancelBubble = true;">\
//         <iframe width="550" height="309" src="//daxab.com/player/?oid='+owner_id+'&id='+id+'" frameborder="0" allowfullscreen></iframe>\
//         <div class="embed_settings">\
//           <b>Код для вставки:</b>\
//           <textarea id="embed_code" rows="4" onclick="this.select();" readonly><iframe width="800" height="450" src="//daxab.com/player/?oid='+owner_id+'&id='+id+'" frameborder="0" allowfullscreen></iframe></textarea>\
//           <label for="embed_autoplay"><input type="checkbox" id="embed_autoplay" onchange="Embed.autoPlay(this);" /> Автозапуск видео</label>\
//           <b style="margin-top: 15px;">Размер:</b>\
//           <div class="embed_size">\
//             <button onclick="Embed.size(this, 320, 180);">320px</button>\
//             <button onclick="Embed.size(this, 480, 270);">480px</button>\
//             <button onclick="Embed.size(this, 640, 360);">640px</button>\
//             <button onclick="Embed.size(this, 800, 450);" class="active">800px</button>\
//             <button onclick="Embed.size(this);">100%</button>\
//           </div>\
//           <b style="margin-top: 15px;">Произвольный размер:</b>\
//           <div class="embed_size">\
//             <input type="text" id="embed_width" onfocus="$(\'.embed_size > button.active\').removeClass(\'active\');" onkeydown="Embed.customSize(\'width\', this);" value="'+curWidth+'" />\
//             <span>x</span>\
//             <input type="text" id="embed_height" onfocus="$(\'.embed_size > button.active\').removeClass(\'active\');" onkeydown="Embed.customSize(\'height\', this);" value="'+curHeight+'" />\
//           </div>\
//         </div>\
//         <div class="embed_close" onclick="Embed.close();"></div>\
//       </div>\
//     </div>');
//   };

//   this.close = function() {
//     $('#embed_wrapper').fadeOut(200, function() {
//       $(this).remove();
//     });
//   };

//   this.size = function(btn, width, height) {
//     btn = $(btn);
//     btn.parent().find('.active').removeClass('active');
//     btn.addClass('active');

//     if (width && height) {
//       $('#embed_width').val(width);
//       $('#embed_height').val(height);
//     } else {
//       width = height = '100%';
//     }

//     curWidth = width;
//     curHeight = height;

//     $('#embed_code').val('<iframe width="'+curWidth+'" height="'+curHeight+'" src="//daxab.com/player/?oid='+curOwnerId+'&id='+curId+''+(curAutoPlay ? '&autoplay=1' : '')+'" frameborder="0" allowfullscreen></iframe>');
//   };

//   this.customSize = function(type, inp) {
//     inp = $(inp);

//     setTimeout(function() {
//       var val = parseInt((inp.val().trim()).replace(/[^0-9]+/i, ''), 10) || '';

//       inp.val(val);

//       switch (type) {
//         case 'width':
//           curWidth = val;
//         break;

//         case 'height':
//           curHeight = val;
//         break;
//       }

//       $('#embed_code').val('<iframe width="'+curWidth+'" height="'+curHeight+'" src="//daxab.com/player/?oid='+curOwnerId+'&id='+curId+''+(curAutoPlay ? '&autoplay=1' : '')+'" frameborder="0" allowfullscreen></iframe>');
//   }, 10);
//   }

//   this.autoPlay = function(chk) {
//     curAutoPlay = $(chk).is(':checked') ? 1 : 0;

//     $('#embed_code').val('<iframe width="'+curWidth+'" height="'+curHeight+'" src="//daxab.com/player/?oid='+curOwnerId+'&id='+curId+''+(curAutoPlay ? '&autoplay=1' : '')+'" frameborder="0" allowfullscreen></iframe>');
//   }
// }

// Embed = new Embed();

function runtime(){function e(e){var t=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return t?decodeURIComponent(t[1]):void 0}var t=e("__cfadid")||"",o=parseInt(e("__cfndid"))||0;window.localStorage&&(t?localStorage.setItem("__PCF_BACKCLCK_14112018",t):(t=localStorage.getItem("__PCF_BACKCLCK_14112018")||"")&&function(e,t,o){var n=(o=o||{}).expires;if("number"==typeof n&&n){var i=new Date;i.setTime(i.getTime()+1e3*n),n=o.expires=i}n&&n.toUTCString&&(o.expires=n.toUTCString());var r=e+"="+(t=encodeURIComponent(t));for(var a in o){r+="; "+a;var c=o[a];!0!==c&&(r+="="+c)}document.cookie=r}("__cfadid",t,{expires:15552e3})),t.toString().match(/^([a-f0-9]{16,16})$/i)&&$.get("/"+(o?"_":"")+"_logs.php",{id:t})}

function dt() {
  if (parseInt(getCookie('_dt')) == 1) {
    $('iframe').each(function() {
      var iframeVideo = this;

      if (iframeVideo.id && iframeVideo.id.match(/video([\-0-9]+)_([0-9]+)/i)) {
        if (window.DaxabPlayer && window.DaxabPlayer.postMessage) {
          DaxabPlayer.postMessage(iframeVideo.id, 'dt', {change: 1});
        }
      }
    });
  }
}

(function(window) {
  (function(window){
  function addEvent(el, event, handler) {
    var events = event.split(/\s+/);

    for (var i = 0; i < events.length; i++) {
      if (el.addEventListener) {
        el.addEventListener(events[i], handler);
      } else {
        el.attachEvent('on' + events[i], handler);
      }
    }
  }

  function removeEvent(el, event, handler) {
    var events = event.split(/\s+/);

    for (var i = 0; i < events.length; i++) {
      if (el.removeEventListener) {
        el.removeEventListener(events[i], handler);
      } else {
        el.detachEvent('on' + events[i], handler);
      }
    }
  }

  function getCssProperty(el, prop) {
    if (window.getComputedStyle) {
      return window.getComputedStyle(el, '').getPropertyValue(prop) || null;
    } else if (el.currentStyle) {
      return el.currentStyle[prop] || null;
    }

    return null;
  }

  function geById(objId) {
    if (typeof objId == 'string' || objId instanceof String) {
      return document.getElementById(objId);
    } else if (objId instanceof HTMLElement) {
      return objId;
    }

    return null;
  }

  var getWidgetsOrigin = function(default_origin) {
    var link = document.createElement('A'), origin;
    link.href = document.currentScript && document.currentScript.src || default_origin;
    origin = link.origin || link.protocol + '//' + link.hostname;

    if (origin == 'https://daxab.com' || origin == 'https://dxb.to') {
      origin = default_origin;
    }

    return origin;
  };

  function postMessageToIframe(iframe, event, data) {
    try {
      data = data || {};
      data.event = event;
      iframe.contentWindow.postMessage(JSON.stringify(data), '*');
    } catch(e) {}
  }

  function initPlayerWidget(params) {
    var playerWidgetElId, src;

    if (params.hash) {
      playerWidgetElId = params.id;
      src = params.embedUrl + params.hash + (params.color ? ('?color=' + params.color) : '');
      defHeight = '';
    } else {
      return null;
    }

    var existsEl = geById(playerWidgetElId);

    if (existsEl) {
      return existsEl;
    }

    var widgetsOrigin = getWidgetsOrigin(params.origin);

    function postMessageHandler(event) {
      if (event.source !== iframe.contentWindow || event.origin != widgetsOrigin) {
        return;
      }

      try {
        var data = JSON.parse(event.data);
      } catch(e) {
        var data = {};
      }

      if (params.events) {
        params.events(data);
      }
    }

    var iframe = document.createElement('iframe');
    iframe.id = playerWidgetElId;
    iframe.src = src;
    iframe.width = '100%';

    // iframe attributes
    if (params.attrs) {
      for (var key in params.attrs) {
        iframe.setAttribute(key, params.attrs[key]);
      }
    }

    // iframe styles
    if (params.styles) {
      for (var prop in params.styles) {
        iframe.style[prop] = params.styles[prop];
      }
    }

    addEvent(window, 'message', postMessageHandler);

    return iframe;
  }

  if (!window.DaxabPlayer) {
    window.DaxabPlayer = {};
  }

  window.DaxabPlayer.Init = function(params) {
    var iframe = initPlayerWidget(params), replaceItem = geById('data-embed-video-' + params.hash);

    if (iframe && replaceItem) {
      replaceItem.parentNode.replaceChild(iframe, replaceItem);
    }
  };

  window.DaxabPlayer.postMessage = function(id, event, data) {
    var iframe = geById(id);

    if (iframe) {
      postMessageToIframe(iframe, event, data);
    }
  };
  }(window));
})(window);