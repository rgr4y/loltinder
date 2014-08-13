/**
  * Requirements: node.js
  * 1. Install node.js
  * 2. Open Terminal or Command Prompt
  * 3. cd to directory where app.js is
  * 4. Run 'npm install'
  * 5. GET FACEBOOK NUMERIC ID FROM: http://findmyfacebookid.com/
  * 6. GET ACCESS TOKEN FROM THE FOLLOWING URL. IT REDIRECTS TO ANOTHER PAGE QUICKLY, SO GRAB THE URL UP TOP BEFORE IT CHANGES QUICKLY.
  *
  * https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token 
  *
  * 7. To run, type 'node app.js FACEBOOK_ID THE_URL_YOU_COPIED_AND_PASTED'
  *
  * Example: node app.js 305102211 "https://www.facebook.com/connect/login_success.html#access_token=CAAGm0PX4ZCpsc3npjYuZASBBIwGz8rS1aQcnjn2cThwpwVVJ9QNqlejhICzkharwvX56IIw5hEsebHIaxSXAs4RvoSBLhsCaKTgQAZBGny1EICA7orRtiuhHVjspFXZBs2GT6JpHUKtlAZD&expires_in=6902"
  */

var tinderbot = require('tinderbot');
var bot = new tinderbot();
var _ = require('underscore')

// Process URL and grab token
var url = process.argv[3];
url = url.split('access_token=');
url = url[1].split('&');


bot.access_token = url[0];
bot.facebook_id = process.argv[2];

console.log('###########################');
console.log('Token: ' + bot.access_token);
console.log('FB ID: ' + bot.facebook_id);
console.log('CURL: curl -X POST --data "facebook_token='+bot.access_token+'&facebook_id='+bot.facebook_id+'" https://api.gotinder.com/auth');
console.log('###########################');

var count = 0;
var interval;

bot.client.authorize(bot.access_token, bot.facebook_id, function(){
  interval = setInterval(function() {
    if (!bot.client.isAuthorized) {
      console.log('Token is invalid. Please get another.');
      clearInterval(interval);
    }

    bot.client.getRecommendations(10, function(error, data){
      if (data && data.message === "recs timeout") {
        console.log('Recommendations timeout');
        return;
      }

      _.chain(data.results)
      .each(function(v,k) {
        console.log(v.name);
        bot.client.like(v._id, function(error, data) {
          count++;
          console.log('Count: ' + count);
          if (data && data.matched) {
            console.log('MATCHED!');
            console.log(user);
          }
        //   if (data.matched) {
        //     bot.client.sendMessage(
        //       id,
        //       "You're gorgeous. Let's adventure"
        //     );
        //   }
        });
      });
    });
  }, 5000);
}); 

