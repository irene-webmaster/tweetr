$(document).ready(function() {
  const max = 140;
  $('.new-tweet textarea').on('keyup', function(e) {
    let text = $( this ).val();
    let numOfEl = text.length;
    let remainingEl = max - numOfEl;

    $(this).closest('.new-tweet').find('.counter').empty().text(remainingEl);

    if(remainingEl < 0) {
      $('.counter').addClass('negative-num');
    } else {
      $('.counter').removeClass('negative-num');
    }
  });
});

// 'textarea[name="text"]'