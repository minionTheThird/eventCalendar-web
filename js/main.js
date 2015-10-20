$(document).ready(
    function()
    {
        getEvents('CodeForces');
        getEvents('HackerEarth');
        getEvents('CodeChef');
    }
);


Date.prototype.format = function() {

    var d = this.toString().split(' ');
    var t = this.toLocaleTimeString().split(' ');
    var time = t[0].split(':');

    this.DAY = d[0];
    this.MMM = d[1];
    this.DD = d[2];
    this.YYYY = d[3];
    this.timeZone = d[6].slice(1,-1);
    this.HH = time[0];
    this.MIN = time[1];
    this.TIME = this.HH+":"+this.MIN+" "+t[1];
    this.dateTime = this.toLocaleDateString() +" "+ this.toLocaleTimeString();
    this.DATE = this.DAY+", "+this.MMM+" "+this.DD+" "+this.YYYY+", "+this.TIME+" "+this.timeZone;

}
        //usage limit to http://minionthethird.github.io/*
        //working = AIzaSyCAkVQVwMzmPHxbaLUAqvb6dYUwjKU5qnM
        //other key = AIzaSyBQal2rNhP5SRkU5hZytY7Yb8nYc5Q1nrc

function getEvents(calendarName){
  var URL = prepareURLfor(calendarName);
  makeAjaxRequest(calendarName, URL);
}

function prepareURLfor(calendarName){
  var URL;
  if(calendarName == 'CodeForces')
    URL = 'http://codeforces.com/api/contest.list';
  else{
    var calendarId;
    var key = 'AIzaSyCAkVQVwMzmPHxbaLUAqvb6dYUwjKU5qnM';
    var lookAhead;
    if (calendarName == 'HackerEarth'){
      calendarId = 'hackerearth.com_73f0o8kl62rb5v1htv19p607e4@group.calendar.google.com';
      lookAhead = 7; // 7 days look ahead
    }
    else{
      calendarId = 'codechef.com_3ilksfmv45aqr3at9ckm95td5g%40group.calendar.google.com'
      lookAhead = 14; // 14 days look ahead
    }
    var startTime = new Date();
    var endTime = new Date();
    endTime.setDate(endTime.getDate()+lookAhead);
    URL = 'https://www.googleapis.com/calendar/v3/calendars/'+calendarId+'/events?key='+key+'&timeMax='+endTime.toISOString()+'&timeMin='+startTime.toISOString();
  }
  return URL;
}

function makeAjaxRequest(calendarName, URL){
  $.ajax({
      url: URL,
      dataType: 'JSONP',
      data : {
          jsonp:"callback",
      },
      jsonpCallback: 'callback',
      type: 'GET',
      success: function(data){
          processEvents(data, calendarName);
      },
      error: function (xhr, ajaxOptions, thrownError) {
          console.log("error for : " + this.handle)
      }
  });
};

function processEvents(calendarEvents, calendarName){
    var events;
    var table = document.getElementById(calendarName);
    if(calendarName == 'CodeForces'){
        events = calendarEvents.result;
        for(var id in events){
          if(events[id].phase != "FINISHED"){
            var row = table.insertRow(1);
            var eventDetail = formatEventDetail(events[id], calendarName);
            row.innerHTML = applyCalendarTemplate(eventDetail);
          }
        }
    } else {
      events = calendarEvents.items;
      events.sort(function(a, b) {
          return b.start.dateTime.localeCompare(a.start.dateTime);
      });
      for(var id in events){
        if(events[id].status == "confirmed"){
          var row = table.insertRow(1);
          var eventDetail = formatEventDetail(events[id], calendarName);
          row.innerHTML = applyCalendarTemplate(eventDetail);
        }
      }
    }
};

function formatEventDetail(eventData, calendarName){
  var eventName;
  var eventStartTime;
  var eventEndTime;
  if(calendarName == 'CodeForces'){
    eventName = eventData.name;
    eventStartTime = new Date(eventData.startTimeSeconds*1000);
    eventEndTime = new Date((eventData.startTimeSeconds + eventData.durationSeconds)*1000);
  }
  else{
    eventName = eventData.summary;
    eventStartTime = new Date(eventData.start.dateTime);
    eventEndTime = new Date(eventData.end.dateTime);
  }
  eventStartTime.format();
  eventEndTime.format();
  var eventDetail = {
    name : eventName,
    startDate : eventStartTime,
    endDate : eventEndTime
  }
  return eventDetail;
};

function applyCalendarTemplate(eventDetail){
  var template = $('#calendar-template').html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(
                    template,
                    {
                      name : eventDetail.name,
                      startDate : eventDetail.startDate.DATE,
                      endDate : eventDetail.endDate.DATE,
                      startDateTime : eventDetail.startDate.dateTime,
                      endDateTime : eventDetail.endDate.dateTime
                    });
  return rendered;
};
