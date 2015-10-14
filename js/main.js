$(document).ready(
    function()
    {
        getCodeforcesEvents();
        getHackerEarthEvents();
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

function getCodeforcesEvents()
{
        var inputHTML = "";
        $.ajax({
            url: 'http://codeforces.com/api/contest.list',
            dataType: 'JSONP',
            data : {
                jsonp:"callback",
            },
            jsonpCallback: 'callback',
            type: 'GET',
            success: function (dataCF) {
                var events = dataCF.result;
                var table = document.getElementById("codeforces");

                for(var id in events){
                  if(events[id].phase != "FINISHED"){

                    var durationMinutes = (events[id].durationSeconds%3600)/60;
                    var durationHours = (events[id].durationSeconds-durationMinutes*60)/3600;

                    var start_date = new Date(events[id].startTimeSeconds*1000);
                    var end_date = new Date((events[id].startTimeSeconds + events[id].durationSeconds)*1000);
                    start_date.format();
                    end_date.format();

                    var row = table.insertRow(1);
                    var l_name = row.insertCell(0);
                    var l_date = row.insertCell(1);
                    var l_duration = row.insertCell(2);
                    var l_calendar = row.insertCell(3);

                    l_name.innerHTML = events[id].name;
                    l_date.innerHTML = start_date.DATE;//start_date.toLocaleString();
                    l_duration.innerHTML = durationHours +"h "+durationMinutes+"m";

                    var template = $('#calendar-template').html();
                    Mustache.parse(template);   // optional, speeds up future uses
                    var rendered = Mustache.render(
                                      template,
                                      {
                                        name : events[id].name,
                                        startDateTime : start_date.dateTime ,
                                        endDateTime : end_date.dateTime
                                      });
                    l_calendar.innerHTML = rendered;

                  }
                 };
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("error for : " + this.handle)
            }

        });
}

function getHackerEarthEvents()
{
        console.log("inside HE");
        var inputHTML = "";
        var calendarId = 'hackerearth.com_73f0o8kl62rb5v1htv19p607e4@group.calendar.google.com'
        var startTime = new Date();
        var endTime = new Date();
        var key = 'AIzaSyCAkVQVwMzmPHxbaLUAqvb6dYUwjKU5qnM';
        //usage limit to http://minionthethird.github.io/*
        //working = AIzaSyCAkVQVwMzmPHxbaLUAqvb6dYUwjKU5qnM
        //other key = AIzaSyBQal2rNhP5SRkU5hZytY7Yb8nYc5Q1nrc
        endTime.setDate(endTime.getDate()+7);
        var URL = 'https://www.googleapis.com/calendar/v3/calendars/'+calendarId+'/events?key='+key+'&timeMax='+endTime.toISOString()+'&timeMin='+startTime.toISOString();
        $.ajax({
            url: URL,
            dataType: 'JSONP',
            type: 'GET',
            success: function (dataHE) {
              console.log("inside he success")
                var events = dataHE.items;
                events.sort(function(a, b) {
                    return b.start.dateTime.localeCompare(a.start.dateTime);
                });

                var table = document.getElementById("hackerEarth");

                for(var id in events){
                  if(events[id].status == "confirmed"){

                    var durationMinutes = 0;
                    var durationHours = 0;

                    var start_date = new Date(events[id].start.dateTime);
                    var end_date = new Date(events[id].end.dateTime);
                    start_date.format();
                    end_date.format();

                    var row = table.insertRow(1);
                    var l_name = row.insertCell(0);
                    var l_sdate = row.insertCell(1);
                    var l_edate = row.insertCell(2);
                    var l_calendar = row.insertCell(3);

                    l_name.innerHTML = events[id].summary;
                    l_sdate.innerHTML = start_date.DATE;//start_date.toLocaleString();
                    l_edate.innerHTML = end_date.DATE;
                    //l_duration.innerHTML = durationHours +"h "+durationMinutes+"m";

                    var template = $('#calendar-template').html();
                    Mustache.parse(template);   // optional, speeds up future uses
                    var rendered = Mustache.render(
                                      template,
                                      {
                                        name : events[id].summary,
                                        startDateTime : start_date.dateTime ,
                                        endDateTime : end_date.dateTime
                                      });
                    l_calendar.innerHTML = rendered;

                  }
                 };
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("error for : " + this.handle)
            }

        });
}
