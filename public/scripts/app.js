/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(function() {
  function createTweetElement(tweet) {
    var now = (new Date()).getTime();
    var tweetCreatedTime = tweet.created_at;
    var tweetTime = Math.floor((now - tweetCreatedTime) / (1000 * 60 * 60 * 24));

    var $tweet = $('<article>').addClass('tweet');
    var $header = $('<header>');
    var $body = $('<div>').addClass('tweet-body').text(tweet.content.text);
    var $footer = $('<footer>').text(tweetTime + ' days ago');
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

  function renderTweets(tweets) {
    for(var tweet of tweets) {
      var singleTweet = createTweetElement(tweet);
      $('#tweets-container').append(singleTweet);
    }
  }

  // function loadTweets() {
  //   $('.new-tweet').find('[action="/tweets"]').on('submit', function(event) {
  //     event.preventDefault();
  //     $.ajax({
  //       url: '/tweets',
  //       method: 'post',
  //       data: $(this).serialize()
  //     }).then(function(data) {
  //       renderTweets(data);
  //     })
  //   });
  // }

  function loadTweets() {
    $('.new-tweet').find('[action="/tweets"]').on('submit', function(event) {

      var textarea = $(this).find('.editor').val();

      var $error = $(this).closest('.new-tweet').find('.error');

      if(textarea.length === 0) {
        $error.text('Please enter your text');
        $error.show();
        return false;
      } else if (textarea.length > 140) {
        $error.text('Sorry you exceeded the 140 character limit');
        $error.show();
        return false;
      } else {
        $error.hide();
        event.preventDefault();
      }
      $.ajax({
        url: '/tweets',
        method: 'get',
        success: function (data) {
          console.log('Success: ', data);
          renderTweets(data);
        }
      });
    });
  }

  loadTweets();

  $('.new-tweet .error').hide();
});

