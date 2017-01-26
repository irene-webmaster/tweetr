$(document).ready(function() {
  const max = 140;
  const textAreaSelector = '.new-tweet textarea';
  const negativeNumClass = 'negative-num';

  function updateCounter($counter, tweetContent) {
    let numOfEl = tweetContent.trim().length;
    let remainingEl = max - numOfEl;
    $counter.text(remainingEl);

    if(remainingEl < 0) {
      $counter.addClass(negativeNumClass);
    } else {
      $counter.removeClass(negativeNumClass);
    }
  }

  function hideError() {
    $('.new-tweet .error').hide();
  }

  $(textAreaSelector).on('input', function(e) {
    updateCounter($(this).siblings('.counter'), $(this).val());
    if($(this).val().length > 0 && $(this).val().length <= 140) {
      hideError();
    }
  });

  updateCounter($('.counter'), $(textAreaSelector).val());
});