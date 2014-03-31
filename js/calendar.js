$(document).ready(function () {
	
	var calendar = $('#calendar');
	var doc = $(document);

    //checks if a certain element is a descendent of another element
    (function ($) {
        $.fn.extend({
            isChildOf: function (filter) {
                return $(filter).find(this).length > 0;
            }
        });
    })(jQuery);



    //loads the datepicker
    calendar.datepicker({
        inline: true,
        firstDay: 0,
        showOtherMonths: true,
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    });



    //setting global date variables
    var date = calendar.datepicker("getDate");
    var month = date.getMonth() + 1;
    var year = date.getFullYear();



    //initial call to add dates and links
    formatCalendar(date, month, year);



    //previous and next month functions
    doc.on('click', '.ui-datepicker-next', function () {
        month = month + 1;
        formatCalendar(date, month, year);
    });
    doc.on('click', '.ui-datepicker-prev', function () {
        month = month - 1;
        formatCalendar(date, month, year);
    });



    //function to add date IDs and links
    function formatCalendar(date, month, year) {
        var XMLnames = [];
        var XMLtext = [];



        //adds unique date ID for each table cell
        $('.ui-datepicker-calendar td').each(function () {
			var thisTd = $(this);
            var day = thisTd.text();
            var dateID = month + "_" + day + "_" + year;

            //hides dates and doesn't add IDs to tds not in current month
            if (thisTd.isChildOf('table tr:first-child') && day > 20) {
                thisTd.html("");
            } else if (thisTd.isChildOf('table tr:last-child') && day < 10) {
                thisTd.html("");
            } else {
                thisTd.attr("id", dateID);
            }

            //disables built in clickability of td
            thisTd.attr("onclick", "");
        });

            

        //gets data from xml
        $.ajax({
            type: "GET",
            url: "xml/eventDates.xml",
            dataType: "xml",
            success: function (xml) {
                $(xml).find("textblock").each(function () {
                    XMLnames.push({
                        value: $(this).attr("Name")
                    });
                    XMLtext.push({
                        value: $(this).text()
                    });
                });
                parseEventXml(XMLnames, XMLtext);
            }
        });



        //parses XML, compares table ID's with XML textblock names and writes links when the two match
        function parseEventXml(XMLnames, XMLtext) {
                
            $(XMLnames).each(function (i) {
                var value1 = XMLnames[i].value;
                $('.ui-datepicker-calendar td').each(function (t) {
                    var value2 = ($(this).attr("id"));
                    if (value1 == value2) {
                        $('.ui-datepicker-calendar td#' + value1).append(XMLtext[i].value);
                    }
                });
            });
            $('table tr td div:nth-child(2)').css("border", "none")
        }



        //css for borders on the table
        $(".ui-datepicker-calendar tbody tr:first-child td").css("border-top", "1px solid gray");
        $(".ui-datepicker-calendar tbody tr td:last-child").css("border-right", "1px solid gray");
        //end format calendar function
    }
});
