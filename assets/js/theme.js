$(document).ready(function () {
  var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    loop: true
  })

  $(window).on('popstate', function (e) {
    if (e.target.location.href === window.location.origin + '/themes') {
      window.location = '/themes'
    }
  })

  if (window.location.origin === document.baseURI) {
    window.location = '/themes'
  }
})
