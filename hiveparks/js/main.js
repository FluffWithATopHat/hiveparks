/* js/main.js — Hive Parks jQuery-powered scripts */
$(function () {

  /* ─────────────────────────────────────────────
     0. LOCATION PICKER (mini top bar)
  ───────────────────────────────────────────── */
  var $locBtn    = $('.location-change-btn');
  var $locPicker = $('.location-picker');

  $locBtn.on('click', function (e) {
    e.stopPropagation();
    $locPicker.toggleClass('open');
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.location-dropdown-wrap').length) {
      $locPicker.removeClass('open');
    }
  });

  /* ─────────────────────────────────────────────
     1. HAMBURGER MENU TOGGLE
  ───────────────────────────────────────────── */
  var $hamburger = $('#hamburger');
  var $navLinks  = $('#nav-links');

  $hamburger.on('click', function () {
    $(this).toggleClass('open');
    $navLinks.slideToggle(250);
    $navLinks.toggleClass('open');
  });

  /* ─────────────────────────────────────────────
     2. "MORE ▾" DROPDOWN
  ───────────────────────────────────────────── */
  var $dropdown     = $('.dropdown');
  var $dropMenu     = $('#dropdown-menu');
  var dropOpenClass = 'dropdown-open';

  function openDrop () {
    $dropMenu.stop(true, true).slideDown(200);
    $dropdown.addClass(dropOpenClass);
  }

  function closeDrop () {
    $dropMenu.stop(true, true).slideUp(180);
    $dropdown.removeClass(dropOpenClass);
  }

  /* Desktop: hover */
  if (window.innerWidth > 768) {
    $dropdown.on('mouseenter', openDrop).on('mouseleave', closeDrop);
  }

  /* Always: click toggle (covers mobile) */
  $dropdown.find('.dropdown-toggle').on('click', function (e) {
    e.stopPropagation();
    if ($dropdown.hasClass(dropOpenClass)) {
      closeDrop();
    } else {
      openDrop();
    }
  });

  /* Close when clicking outside */
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.dropdown').length) {
      closeDrop();
    }
  });

  /* ─────────────────────────────────────────────
     3. ACTIVE NAV LINK
  ───────────────────────────────────────────── */
  var currentFile = window.location.pathname.split('/').pop() || 'index.html';
  if (currentFile === '') currentFile = 'index.html';

  $('.nav-link[href]').each(function () {
    var linkFile = $(this).attr('href').split('/').pop();
    if (linkFile === currentFile) {
      $(this).addClass('active');
    }
  });

  /* ─────────────────────────────────────────────
     4. DISCOUNT CARD SLIDE-TOGGLE
  ───────────────────────────────────────────── */
  $('.discount-card').on('click', function () {
    var $card    = $(this);
    var $details = $card.find('.discount-details');
    var isActive = $card.hasClass('active');

    /* close all others */
    $('.discount-card').not($card).removeClass('active').find('.discount-details').slideUp(220);

    if (isActive) {
      $card.removeClass('active');
      $details.slideUp(220);
    } else {
      $card.addClass('active');
      $details.slideDown(260);
    }
  });

  /* ─────────────────────────────────────────────
     5. STAT COUNTER ANIMATION (IntersectionObserver)
  ───────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var $el     = $(entry.target);
          var target  = parseInt($el.data('target'), 10) || 0;
          var suffix  = $el.data('suffix') || '';
          var prefix  = $el.data('prefix') || '';
          var counter = { val: 0 };

          $({ Counter: 0 }).animate({ Counter: target }, {
            duration: 1800,
            easing: 'swing',
            step: function () {
              var val = Math.ceil(this.Counter);
              $el.text(prefix + val.toLocaleString() + suffix);
            },
            complete: function () {
              $el.text(prefix + target.toLocaleString() + suffix);
            }
          });

          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    $('.stat-number[data-target]').each(function () {
      statsObserver.observe(this);
    });
  } else {
    /* Fallback: just show value immediately */
    $('.stat-number[data-target]').each(function () {
      var $el    = $(this);
      var target = parseInt($el.data('target'), 10) || 0;
      $el.text(target.toLocaleString());
    });
  }

  /* ─────────────────────────────────────────────
     6. BUTTON RIPPLE EFFECT
  ───────────────────────────────────────────── */
  $(document).on('click', '.btn', function (e) {
    var $btn   = $(this);
    var offset = $btn.offset();
    var x      = e.pageX - offset.left;
    var y      = e.pageY - offset.top;
    var size   = Math.max($btn.outerWidth(), $btn.outerHeight());

    var $ripple = $('<span class="ripple"></span>').css({
      width:       size,
      height:      size,
      left:        x - size / 2,
      top:         y - size / 2,
    });

    $btn.append($ripple);
    setTimeout(function () { $ripple.remove(); }, 650);
  });

  /* ─────────────────────────────────────────────
     7. SMOOTH SCROLL FOR ANCHOR LINKS
  ───────────────────────────────────────────── */
  $(document).on('click', 'a[href^="#"]', function (e) {
    var target = $(this).attr('href');
    if (target === '#') return;
    var $target = $(target);
    if ($target.length) {
      e.preventDefault();
      var navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 72;
      $('html, body').animate({
        scrollTop: $target.offset().top - navH - 16
      }, 480);
    }
  });

  /* ─────────────────────────────────────────────
     8. PRICING CARD HOVER SCALE (via class)
  ───────────────────────────────────────────── */
  $('.pricing-card, .membership-card').on('mouseenter', function () {
    $(this).addClass('hovered');
  }).on('mouseleave', function () {
    $(this).removeClass('hovered');
  });

  /* ─────────────────────────────────────────────
     9. REBUILD DROPDOWN BINDING ON RESIZE
  ───────────────────────────────────────────── */
  $(window).on('resize', function () {
    if (window.innerWidth > 768) {
      $dropdown.off('mouseenter mouseleave')
        .on('mouseenter', openDrop)
        .on('mouseleave', closeDrop);
      /* Restore nav links visibility if hamburger was open */
      $navLinks.css('display', '');
      $navLinks.removeClass('open');
      $hamburger.removeClass('open');
    } else {
      $dropdown.off('mouseenter mouseleave');
      if (!$navLinks.hasClass('open')) {
        $navLinks.css('display', 'none');
      }
    }
  });

});
