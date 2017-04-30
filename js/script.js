$(document).ready(function(){
  var streamers = ["syndicate", "riotgames", "ESL_SC2", "ESL_CSGO", "OgamingSC2",
                   "cretetion", "freecodecamp", "RobotCaleb", "brunofin", "comster404", "noobs2ninjas"],

      allUsersData = [], streamerStatus = [];

  // sort user data alphabetically by users display name //
  function streamerDataSort(data) {
    data.sort(function(a, b) {
      var displayNameA = a.display_name.toUpperCase();
      var displayNameB = b.display_name.toUpperCase();

      if (displayNameA < displayNameB) {
        return -1;
      }
      if (displayNameA > displayNameB) {
        return 1;
      }
      return 0;
    });
  }

  // sort stream data alphabetically by user //
  function streamUserSort(stream) {
    stream.sort(function(a, b) {
      var userA = a._links.self.substr(37);
      var userB = b._links.self.substr(37);

      if (userA < userB) {
        return -1;
      }
      if (userA > userB) {
        return 1;
      }
      return 0;
    });
  }

  // assign variables correctly accounting for json dump undefined variables //
  function variableAssignment() {
    if (streamerStatus.length == streamers.length) {
      for (var k = 0; k < streamerStatus.length; k++) {
        var name = allUsersData[k].name;
        if (allUsersData[k].name == null) {
          name = streamers[k];
        }

        displayName = streamers[k];
        var bio = allUsersData[k].status;
        var streaming = streamerStatus[k].stream;
        var logo = allUsersData[k].profile_banner;
        var streamPage = "https://www.twitch.tv/" + name;
        var userPage = "https://www.twitch.tv/" + name + "/profile";

        if (displayName != null) {
          displayName = allUsersData[k].display_name;
        }

        if (streaming == null) {
          streamPage = "#";
        }

        if (logo == null) {
          logo = allUsersData[k].logo;
        }

        if (bio == null) {
          bio = '';
        }

        if (allUsersData[k].status == "Account Closed") {
          streamPage = "#";
          userPage = "#";
        }

        var onlineTemplate = '<div class="demo-card-wide mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title ' + name + '">' +
            '<h2 class="mdl-card__title-text">' + displayName + '</h2>' +
          '</div>' +
          '<div class="mdl-card__supporting-text">' +
             bio +
          '</div>' +
          '<div class="mdl-card__actions mdl-card--border">' +
            '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href='+ userPage +' target="_blank">' +
              displayName + "'s Profile" +
            '</a>' +
          '</div>' +
          '<div class="mdl-card__menu">' +
            '<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
            '<a class="mdl-list__item-secondary-action" href=' + streamPage + ' target="_blank">' +
            '<i class="material-icons mdl-color-text--green-400">videocam</i></a>' +
            '</button>' +
          '</div>' +
        '</div><br>';

        var offlineTemplate = '<div class="demo-card-wide mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title mdl-color--grey-600 ' + name + '">' +
            '<h2 class="mdl-card__title-text">' + displayName + '</h2>' +
          '</div>' +
          '<div class="mdl-card__supporting-text">' +
             "Stream Offline" +
          '</div>' +
          '<div class="mdl-card__actions mdl-card--border">' +
            '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href='+ userPage +' target="_blank">' +
              displayName + "'s Profile" +
            '</a>' +
          '</div>' +
          '<div class="mdl-card__menu">' +
            '<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
            '<a class="mdl-list__item-secondary-action" href="#">' +
            '<i class="material-icons md-light md-inactive">highlight_off</i></a>' +
            '</button>' +
          '</div>' +
        '</div><br>';

        var noUserTemplate = '<div class="demo-card-wide mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title style="background-color: #00ff00">' +
            '<h2 class="mdl-card__title-text">' + displayName + '</h2>' +
          '</div>' +
          '<div class="mdl-card__supporting-text">' +
             bio +
          '</div>' +
          '<div class="mdl-card__actions mdl-card--border">' +
            '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="#">' +
              displayName + "'s Profile" +
            '</a>' +
          '</div>' +
          '<div class="mdl-card__menu">' +
            '<button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">' +
            '<a class="mdl-list__item-secondary-action" href="#">' +
            '<i class="material-icons md-light md-inactive">do_not_disturb_on</i></a>' +
            '</button>' +
          '</div>' +
        '</div><br>';

        if (allUsersData[k].status == "Account Closed") {
          $(".all").append(noUserTemplate);
        }  else if (streaming == null) {
          $(".all").append(offlineTemplate);
          $(".offline").append(offlineTemplate);
          $('.' + name + '').css('background-image', 'url(' + logo + ')');
        } else {
          $(".all").append(onlineTemplate);
          $(".online").append(onlineTemplate);
          $('.' + name + '').css('background-image', 'url(' + logo + ')');
        }
      }
    }
  }

  // Loop through users in initial array, pull API data, and push to new array //
  function pullData() {
    for (var i = 0; i < streamers.length; i++) {
      $.ajax({
       url: "https://api.twitch.tv/kraken/channels/" + streamers[i],
       dataType:'json',
       cache: false,
       contentType: false,
       processData: false,
       type: 'GET',
       headers: {
         'Client-ID': '4h6thwsgzit56nlzuaspnbxq35nu5ga'
       },
     })
     .done(function(infoData) {
         allUsersData.push(infoData);
     })
     .fail(function(jqXHR, exception) {
       var msg = '';
       var response = $.parseJSON(jqXHR.responseText).message;
       var closedAccount = response.match(/'([^']+)'/)[1];
       if (jqXHR.status === 0) {
           msg = 'Not connect.\n Verify Network.';
       } else if (jqXHR.status == 404) {
         // build JSON objects for users that do not exist //
           allUsersData.push({"display_name": closedAccount, "status": "Account Closed", "profile_banner": "#"});
           streamerStatus.push({"_links": { "channel": "https://api.twitch.tv/kraken/channels/" + closedAccount,
                                            "self": "https://api.twitch.tv/kraken/streams/" + closedAccount},
                                "stream": null});
       } else if (jqXHR.status == 500) {
           msg = 'Internal Server Error [500].';
       } else if (exception === 'parsererror') {
           msg = 'Requested JSON parse failed.';
       } else if (exception === 'timeout') {
           msg = 'Time out error.';
       } else if (exception === 'abort') {
           msg = 'Ajax request aborted.';
       } else if (jqXHR.status == 422){
           msg = 'Uncaught Error.\n' + jqXHR.status;
       }
         else {
           msg = 'Uncaught Error.\n' + jqXHR.responseText;
       }
     })
     .always(function() {
       streamerDataSort(allUsersData);
       if (allUsersData.length == streamers.length) {
         for (var j = 0; j < allUsersData.length; j++) {
           $.ajax({
            url: "https://api.twitch.tv/kraken/streams/" + allUsersData[j].name,
            dataType:'json',
            cache: false,
            contentType: false,
            processData: false,
            type: 'GET',
            headers: {
              'Client-ID': '4h6thwsgzit56nlzuaspnbxq35nu5ga'
            },
          })
          .done(function(streamData) {
            streamerStatus.push(streamData);
          })
          .always(function() {
            streamUserSort(streamerStatus);
             
            // remove stream status of undefined users //
            streamerStatus = streamerStatus.filter(function(item) {
              return item._links.self.substr(37) !== "undefined";
            });
            if (streamerStatus.length == streamers.length) {
              variableAssignment();
            }
          });
        }
      }
     });
    }
  }
  pullData();
});
