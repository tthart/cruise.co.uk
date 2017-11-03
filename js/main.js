$(document).ready(function() {
    var page = "1";
    var html = '';
    //load();
    var load = function() {

        $.ajax({
            url: '/sheet1?_limit=30&_page=' + page + '&callback=?',
            async: true,
            callback: 'callback',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            dataType: 'jsonp',
            timeout: 5000,
            success: function(data, status, xhr) {
                $.each(data, function(i, item) {

                    // make itinerary bulleted
                    var array = item["Itinerary"].split(',');
                    var itin = '';
                    var array = array.map(function(s) {
                        return s.trim()
                    });
                    array = uniq(array);
                    array.clean(undefined);
                    if (array.length > 1) {
                        itin += '<p>Calling at the following destinations:</p>';
                    }

                    itin += '<ul class="itinerary">';
                    for (var i; i < array.length; i++) {

                        itin += "<li>" + array[i] + "</li>"
                        console.log(array);

                    }
                    itin += "</ul>";


                    /* if ((i % 1) == 0) html += ''; use for side by side cols*/

                    html += '<div class="row row--json"><div class="col-md-12">';

                    html += '<div class="row">';
                    html += '<div class="col-md-3  d-flex align-items-center"><img class="img-fluid" src="img/cruise-line-logos/' + item["Cruise Line Logo"] + '" alt="' + item["Cruise Line Name"] + '" />';


                    html += '</div>';
                    html += '<div class="col-md-9">';
                    html += "<h2 class='date'>" + item["Departure Date"] + "</h2>";
                    html += '<p class="lead">' + item["Offer Name"] + '</p>';
                    html += '<p><strong>Cruise Line Name:</strong> ' + item["Cruise Line Name"] + ' <strong>Cruise Ship Name:</strong> ' + item["Cruise Ship Name"] + '</p>';
                    html += '<p><strong>Visiting:</strong> ' + item["Itinerary"] + '</p>';
                    html += '<p><a class="btn btn-primary" href="' + item["OfferId"] + '">Book now</a></p>';
                    html += '</div>'

                    html += '</div></div></div>'


                    /* if ((i % 1) == 0) html += '</div>';*/



                });

                if (data.length < 30) {
                    $("#btn").remove();
                }
                $(html).hide().appendTo("#data").fadeIn(500);
                page++;

            },
            error: function() {
                output.html('<h2 class="error">There was an error loading the data.</h2>');
            }
        });


        html = "";
    };


    //add click handler
    $('#btn').click(function() {
        load();

    });
    load();
    Array.prototype.clean = function(deleteValue) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };

    function uniq(a) {
        var seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
});