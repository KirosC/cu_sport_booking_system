const MON = 0, TUE = 1, WED = 2, THU = 3, FRI = 4, SAT = 5, SUN = 6;
let startDay = moment().set({hour: 0, minute: 0, second: 0, millisecond: 0});
let endDay = moment().set({hour: 23, minute: 59, second: 59, millisecond: 9});
if (startDay.isoWeekday() !== SUN - 1) {
    endDay = moment(endDay).day(SUN + 1);
}
console.log(startDay.format("YYYY-MM-DD, h:mm:ss a'"));
console.log(endDay.format("YYYY-MM-DD, h:mm:ss a'"));

function initializeRow(table) {
    $('td').remove();
    for (let i = 0; i <= 14; i++) {
        let lastRow = $('<tr/>').appendTo(table.find('tbody:last'));
        let startTime = (i + 8) % 12;
        let endTime = startTime + 1;
        if (startTime === 0) {
            startTime = 12;
        }
        let timeRange;

        if (i < 4) {
            startTime = startTime + ' a.m.';
            if (i === 3) {
                endTime = endTime + ' n.n.';
            } else {
                endTime = endTime + ' a.m.'
            }
        } else {
            endTime = endTime + ' p.m.';
            if (i === 4) {
                startTime = startTime + ' n.n.';
            } else {
                startTime = startTime + ' p.m.'
            }
        }

        timeRange = startTime + ' ~ ' + endTime;

        lastRow.append('<td class="time-range fit" data-slot-' + i + '>' + timeRange + '</td>');
        for (let j = MON; j <= SUN; j++) {
            lastRow.append('<td class="session text-center" id="slot-' + j + '-' + i + '">' + '</td>');
        }
    }
}

function highlightPastTime(table) {
    let date = moment();
    let day = date.isoWeekday();
    let hours = date.hours();
    let currentSession;

    if (day === SUN && hours === 22) {
        // Sunday and after 10 p.m.
        day = 0;
        hours = 1;
    }
    currentSession = hours - 8;

    for (let col = MON; col < day; col++) {
        for (let row = 0; row <= 14; row++) {
            // Before 8 a.m.
            if (col === day - 1 && currentSession < 0) {
                break;
            }
            let selectedSession = '#slot-' + col + '-' + row;
            $(selectedSession).addClass('bg-danger');
            // Reach current hour
            if (col === day - 1 && row === currentSession) {
                break;
            }
        }
    }
}

// Get the free time slot from rawJson based on given date and venueID
function getSessions(json, date, venueID) {
    return json.filter(item => {
        return item['venue_id'] == venueID && item['date'] == date;
    });
}

// Load all available session to the table
// SHOULD pass only one date only to the function
function loadDaySession(table, json) {
    if (json.length !== 1) {
        return;
    }
    let loadingDate = moment(json[0]['date']);
    json[0]['availableTimeSlot'].forEach(function (value) {
        let day = loadingDate.isoWeekday() - 1;
        let session = $('#slot-' + (day) + '-' + value + ':not(.bg-danger)');
        console.log('#slot-' + (day) + '-' + value + ':not(.bg-danger)');
        if (session.length === 0) {
            return;
        }
        let checkboxID = 'cb-' + (day) + '-' + value;
        session.append(
            $('<div class=\"custom-control custom-checkbox text-center\">')
                .append('<input type="checkbox" class="custom-control-input text-center" id="' + checkboxID + '">' +
                    '<label class="custom-control-label" for="' + checkboxID + '">'
                )
        );
    });
}

function loadWeekSession(table, json, venueID) {
    let loadingDay = startDay.clone();
    while (true) {
        console.log('loading: ' + loadingDay.format('YYYY-MM-DD'));
        let daySessions = getSessions(json, loadingDay.format('YYYY-MM-DD'), venueID);
        loadDaySession(table, daySessions);
        if (moment(loadingDay).isSame(endDay, 'date')) {
            break;
        }
        loadingDay.add(1, 'day');
    }
}

function getVenue(val) {
    var course = $("#college").val();
    var sport = $("#sport").val();

      $.ajax({
          type: "POST",
          url: "court_booking/search_venue_handler"
          if (course && sport) {
            data:{"course_id": course,"sport_id":sport}
          }else if (course) {
            data:{"course_id": course}
          }else if (sport) {
            data:{"sport_id":sport}
          }else{
            data:{}
          }
      }).done(result => {
        console.log('request success');
        console.log(result);
        $("#venue").val(result);
      }).fail((jqXHR, textStatus, errorThrown) => {
          console.log('request failed');
      });

}

// Perform AJAX request when venue is selected
function getJSON(venueDropdown, table) {
    let venue_id = venueDropdown;

    $.ajax({
        type: "POST",
        url: "admin/search_session_handler",
        data: {venue_id},
        dataType: 'json',
    })
        .done(result => {
            console.log('request success');
            console.log(result);
            initializeRow(table);
            highlightPastTime(table);
            loadWeekSession(table, result, venue_id);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            console.log('request failed');
        });
}


$(function () {
    let rawJSON;
    let table = $('#table');
    $('#bs_venue').change(async function () {
        console.log($(this).val());
        getJSON($(this).val(), table);
        console.log('rawJSON:' + typeof rawJSON);
    });
});
