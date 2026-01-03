/* Bundle: elementor-snippets.js
   Gabungan:
   - VH
   - EFEK MASUK DULU (legacy)
   - EFEK MASUK BARU (IntersectionObserver)
   - VID
*/
(function () {
  if (window.__NIKU_ELEMENTOR_SNIPPETS_BUNDLE__) return;
  window.__NIKU_ELEMENTOR_SNIPPETS_BUNDLE__ = true;

  // ===== VH =====
  (function () {
    function setDynamicVH(){
      var vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    setDynamicVH();
    window.addEventListener('resize', setDynamicVH);
  })();

  // ===== EFEK MASUK DULU (legacy) =====
  (function () {
    function revealElements(className){
      var reveals = document.querySelectorAll("." + className);
      for (var i = 0; i < reveals.length; i++){
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible){
          reveals[i].classList.add("active");
        } else {
          reveals[i].classList.remove("active");
        }
      }
    }
    function initReveal(){
      revealElements("reveal");
      revealElements("revealin");
      revealElements("revealkanan");
      revealElements("revealkiri");
      revealElements("revealatas");
      revealElements("revealr");
    }
    window.addEventListener("scroll", initReveal, { passive: true });
    document.addEventListener("DOMContentLoaded", initReveal);
  })();

  // ===== EFEK MASUK BARU (IntersectionObserver) =====
  (function () {
    const SELECTOR = ".reveal, .revealin, .revealkanan, .revealkiri, .revealatas, .revealr";

    function init() {
      const els = document.querySelectorAll(SELECTOR);
      if (!els.length) return;

      if (!("IntersectionObserver" in window)) {
        els.forEach(el => el.classList.add("active"));
        return;
      }

      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("active");
            obs.unobserve(e.target);
          }
        });
      }, { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

      els.forEach(el => io.observe(el));
    }

    document.addEventListener("DOMContentLoaded", init);
    window.addEventListener("load", init);
  })();

  // ===== VID =====
  (function () {
    document.addEventListener("DOMContentLoaded", function () {
      const toggleButton = document.getElementById("open");
      const videoElement = document.querySelector(".elementor-background-video-container video");
      const elHostedVideo = document.querySelector(".slideAwal .elementor-background-video-container video");

      let iframeOrVideoLoaded = false;

      if (toggleButton && videoElement) {
        toggleButton.addEventListener("click", function () {
          try {
            if (videoElement.paused) {
              const p = videoElement.play();
              if (p && typeof p.catch === "function") p.catch(function(){});
            }
          } catch (e) {}
        });
      }

      if (!toggleButton) return;

      function isYoutubeVideoLink(url) {
        if (!url || typeof url !== "string") return false;
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[7] && match[7].length == 11) return match[7];
        return false;
      }

      function getVideoSrc(v) {
        if (!v) return "";
        var src = v.getAttribute("src") || "";
        if (!src) {
          var source = v.querySelector("source");
          if (source) src = source.getAttribute("src") || "";
        }
        return src;
      }

      const src = getVideoSrc(elHostedVideo || videoElement);
      const isYoutube = isYoutubeVideoLink(src);

      setTimeout(function () {
        if (!iframeOrVideoLoaded) {
          toggleButton.classList.add("btnVisibleAfterLoad");
          console.log("Slow Network!!! Video Buffered, Force Button Visible After 15 Second");
        }
      }, 15000);

      if (!isYoutube) {
        const v = elHostedVideo || videoElement;
        if (v) {
          try { v.removeAttribute("autoplay"); } catch(e) {}

          setTimeout(function () {
            toggleButton.classList.add("btnVisibleAfterLoad");
            iframeOrVideoLoaded = true;
            console.log("Video Loaded");
          }, 200);

          v.addEventListener("canplay", function () {
            iframeOrVideoLoaded = true;
          }, { once: true });
        }
      }
    });
  })();

})();
