$(document).ready(function() {
  const max = 140;
  const textAreaSelector = '.new-tweet textarea';
  const negativeNumClass = 'negative-num';

  function updateCounter($counter, tweetContent) {
    let numOfEl = tweetContent.length;
    let remainingEl = max - numOfEl;
    $counter.text(remainingEl);

    if(remainingEl < 0) {
      $counter.addClass(negativeNumClass);
    } else {
      $counter.removeClass(negativeNumClass);
    }
  }

  $(textAreaSelector).on('input', function(e) {
    updateCounter($(this).siblings('.counter'), $(this).val());
  });

  updateCounter($('.counter'), $(textAreaSelector).val());
});

// 'textarea[name="text"]'