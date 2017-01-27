/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(function() {
  function createTweetElement(tweet) {
    var $tweet = $('<article>').addClass('tweet');
    var $header = $('<header>');
    var $body = $('<div>').addClass('tweet-body').text(tweet.content.text);
    var $footer = $('<footer>').text(calculateTime(tweet));
    var $avatar = $('<img />', {src: tweet.user.avatars.small}).addClass('avatar');
    var $fullname = $('<span>').addClass('fullname').text(tweet.user.name);
    var $username = $('<span>').addClass('username').text(tweet.user.handle);
    var $social = $('<div>').addClass('social');
    var $like = $('<i>').addClass('fa fa-heart');
    var $retweet = $('<i>').addClass('fa fa-retweet');
    var $flag = $('<i>').addClass('fa fa-flag');

    $tweet.append($header, $body, $footer);
    $header.append($avatar, $fullname, $username);
    $footer.append($social);
    $social.append($like, $retweet, $flag);

    return $tweet;
  }

  function calculateTime(tweet) {
    var timeNow = (new Date()).getTime();
    var tweetCreatedTime = tweet.created_at;
    var timeDiff = Math.round((timeNow - tweetCreatedTime) / 1000);

    if (timeDiff < 60){
      return "just now";
    }

    var brackets = [
      {unit: 'minute', maxValue: 3600, divisor: 60},
      {unit: 'hour', maxValue: 86400, divisor: 3600},
      {unit: 'day', maxValue: 86400 * 7, divisor: 86400},
      {unit: 'week', maxValue: 86400 * 30, divisor: 86400 * 7},
      {unit: 'month', maxValue: 86400 * 365, divisor: 86400 * 30}
    ];

    for (var i=0; i < brackets.length; i++) {
      var bracket = brackets[i];
      if (timeDiff < bracket.maxValue) {
        var quantity = Math.round(timeDiff / bracket.divisor);
        if(quantity !== 1) {
          return quantity + ' ' + bracket.unit + 's ago';
        } else {
          return quantity + ' ' + bracket.unit + ' ago';
        }
      }
    }
    return "Over a year ago";
  }

  function renderTweets(tweets) {
    $('#tweets-container').html('');
    for(var tweet of tweets) {
      var singleTweet = createTweetElement(tweet);
      $('#tweets-container').prepend(singleTweet);
    }
  }

  function loadTweets() {
    $.ajax({
      url: '/tweets',
      method: 'get'
    }).then(function(tweets) {
      renderTweets(tweets);
    });
  }

// Form validation and tweets loading
  $('.new-tweet').find('[action="/tweets"]').on('submit', function(event) {
    var textarea = $(this).find('.editor');
    var tweetContent = textarea.val().trim();
    var $error = $(this).closest('.new-tweet').find('.error');
    var counter = $(this).find('.counter');

    if(tweetContent.length === 0) {
      $error.text('Please enter your text');
      $error.show();
      return false;
    } else if (tweetContent.length > 140) {
      $error.text('Sorry you exceeded the 140 character limit');
      $error.show();
      return false;
    } else {
      $error.hide();
    }

    event.preventDefault();
    $.ajax({
      url: '/tweets',
      method: 'post',
      data: $(this).serialize()
    }).then(function() {
      loadTweets();
    });

    textarea.val('');
    counter.text('140');
  });

  loadTweets();

  $('.new-tweet').hide();
  $('.new-tweet .error').hide();

  // Compose button implementation
  $('.nav-bar').find('.compose-btn').on('click', function(event) {
    event.preventDefault();
    $('#compose-tweet').slideToggle('slow', function() {
      $('#compose-tweet textarea').focus();
    });
  });

});

