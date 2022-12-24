function setCookie(a,b,c){c=c||{};var d=c.expires;if("number"==typeof d&&d){var e=new Date;e.setTime(e.getTime()+1e3*d),d=c.expires=e}d&&d.toUTCString&&(c.expires=d.toUTCString()),b=encodeURIComponent(b);var f=a+"="+b;for(var g in c){f+="; "+g;var h=c[g];h!==!0&&(f+="="+h)}document.cookie=f};
function getCookie(a){var b=document.cookie.match(new RegExp("(?:^|; )"+a.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1')+"=([^;]*)"));return b?decodeURIComponent(b[1]):void 0};
function isMobile(){return /iphone|ipod|ipad|opera mini|opera mobi|iemobile|android/i.test(navigator.userAgent.toLowerCase());};

var extEnabled = getCookie("ext_on") ? 1 : 0;

if (extEnabled && window.daxabExt !== 3 && !!window.chrome && !!window.CSS && !isMobile()) {
  var ext_ad = parseInt(getCookie("ext_ad")) || 0;

  if (!ext_ad) {
    var link  = document.createElement("link");
    link.rel  = "stylesheet";
    link.type = "text/css";
    link.href = "https://daxab.com/css/ext.css?" + 3;
    link.media = "all";

    window.jQuery("head").append(link);

    window.jQuery(link).on("load", function(event) {
      var ext = window.jQuery("<a>").addClass("extension").attr({
        href: "https://chrome.google.com/webstore/detail/daxab-ultimate/enakmcmeealkdoeindgoeogldodhdeda?hl=en-US",
        target: "_blank"
      }).css({
        position: "fixed",
        right: 0,
        bottom: 14
      }).hide(),
      extClose = window.jQuery("<div>").addClass("extension-close").html("&times;"), extImg = window.jQuery("<div>").addClass("extension-img"),
      extText = window.jQuery("<div>").addClass("extension-text").html("<span style=\"color: #fdd42a;\">Free Chrome Extension </span><br>To increase speed and watch videos in <span style=\'color: #fdd42a;\'>1080p</span>");

      ext.append(extClose).append(extImg).append(extText);

      extClose.on("click", function(event) {
        setCookie("ext_ad", "1", {expires: 86400 * 21});
        ext.fadeOut(300, function(argument) {
          ext.remove();
        });
        event.preventDefault();
        return false;
      });

      window.jQuery("body").prepend(ext);

      ext.fadeIn(500);
    }).on("error", function(event) {
      console.error("Can not load ext.css");
    });
  }
}