$(document).ready(
    function()
    {
        getCodeforcesEvents();
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
            success: function (data1) {
                var events = data1.result;
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

                    var template = $('#codeforces-template').html();
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
