function get_obstime()
{
var ndays = 3;
var timeEnd = Math.round(Date.now()/1000)
var timeStart = timeEnd - ndays*24*60*60
 jQuery.ajax({
          
          url: "https://swd.weatherflow.com/swd/rest/observations/device/4939?time_start=" + timeStart + "&time_end=" + timeEnd + "&api_key=a8f5dbda-af0a-4b57-99b9-f10baa88f27b",
		    type: "GET",

            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                //here is your json.
                  // process it
				  
		    var temp = data['obs'];
		   var our_custom_data = [];
           for (var i=0;i<temp.length;i++)
		   {
		   var ds = temp[i][0];
		   var date = new Date(ds*1000);
		   var hh = date.getHours();
		   //need two digit variable
		   if (hh < 10)
		   {
		   	hh ="0" + hh
		   }
		   var mm = date.getMinutes();
		    if (mm < 10)
		   {
		   	mm ="0" + mm
		   }
		   //secondsalways = 0
		   var ss = date.getSeconds();
		   var yy = date.getFullYear();
		   var mon = date.getMonth();
		   //returns range 0-11, need 1-12
		   mon += 1
		     if (mon < 10)
		   {
		   	mon ="0" + mon
		   }
		   var dd = date.getDate();
		    if (dd < 10)
		   {
		   	dd ="0" + dd
		   }
		   
		   var tt = yy+"-"+mon+"-"+ dd + "-" + hh +"-"+mm;
		   if (temp[i][3] < 70) {
		   			var key = 0
		   	}
		   	else {
					key = 1
			}
		   	our_custom_data.push(
			
			{
			        "date": tt,
			        "temperature": temp[i][2],
			        "humidity": temp[i][3],
				    //using simple wax reccomendation: key = 4
					"wax" : waxRecommender(temp[i][2], 4)
			    }
			);
		   }


//new stuff right here...the logic goes as follows...since the data is time-ordered, the last
//item in the array will be the closest in time to right now...therefore the last item can be used for a 
//right-now wax recommendation...and we can write that value to the wax_now span in the html.
		   var last_item = our_custom_data[our_custom_data.length - 1] //-1 because of zero-based indexing(normal)
		   var key = 1; //essentially the default value...
		   if (last_item['humidity'] < 70)
                   {
		   	key = 0
                   }
		    //using simple wax reccomendation: key = 4
            var swix_wax_now = waxRecommender(last_item['temperature'], 4)
//at this point, we have the last wax recommendation...now write it to the "wax_now" span
             document.getElementById("swix_wax_now").innerHTML = swix_wax_now;
             
			//simple rhode waxes: key = 5
		     var rode_wax_now = waxRecommender(last_item['temperature'] , 5)
			 document.getElementById("rode_wax_now").innerHTML = rode_wax_now;
				   
			if (last_item['temperature'] >= 0)
			{
			document.getElementById("rode_wax_now").style.color = "#b87b76" ;
			document.getElementById("swix_wax_now").style.color = "#b87b76" ;
			}

		gochart(our_custom_data);
			
            },
            error : function(jqXHR, textStatus, errorThrown) {
            },

            timeout: 120000,
        });

}

function waxRecommender(temp, key){
	//temp: New snow & below 70%, New snow & above 70%, Old snow & below 70%, Old snow &above 70%, simple wax just using temp, Rode wax
	var lookUpTable = {
						"6": ["KX35 Violet Special Klister and KX75 Red Extra Wet Klister", "KX35 Violet Special Klister and KX75 Red Extra Wet Klister", "KX35 Violet Special Klister and KX75 Red Extra Wet Klister", "KX35 Violet Special Klister and KX75 Red Extra Wet Klister", "Universal or Red Klister", "Multigrade Klister"],
						"5": ["Silver Universal Klister", "Silver Universal Klister", "KX35 Violet Special Klister and KX75 Red Klister", "KX35 Violet Special Klister and KX75 Red Klister", "Universal Klister", "Multigrade Klister"],
						"4" : ["Silver Universal Klister", "Silver Universal Klister", "KX35 Violet Special Klister and KX65 Red Klister", "KX35 Violet Special Klister and KX65 Red Klister", "Universal Klister", "Yellow"] ,
						"3" : ["VR75", "VR75", "KX35 Violet Special Klister and KX65 Red Klister", "KX35 Violet Special Klister and KX65 Red Klister", "Universal Klister", "Rossa or Yellow"] ,
						"2": ["VR70", "VR75", "VR70", "VR70", "V60", "Rossa or Yellow"],
						"1": ["VR62", "VR62 and VX53", "VR70 or KX40S Silver Klister", "VR70 or KX40S Silver Klister", "V60", "Violet Extra or Rossa"],
						"0":["VR50", "VR55 and VX53", "VR62 and VX53", "VR65 and VX53", "V55", "Violet Multigrade \u2192 Violet Extra"],
						"-1":["VR50", "VR50 and VX53", "VR50 and VX53", "VR55", "V50", "Super Weiss \u2192 Violet Multigrade"],
						"-2":["VR45", "VR50 and VX43", "VR50", "VR55 and VX53", "V45", "Blue \u2192 Blue Super"],
						"-3":["VR45", "VR45", "VR50", "VR50 and VX43", "V45", "Blue Multigrade \u2192 Blue Super"],
						"-4":["VR40", "VR45", "VR45", "VR45 and VX43", "V40", "Green \u2192 Super Weiss"],
						"-5":["VR40", "VR45", "VR45", "VR45 and VX43", "V40", "Green \u2192 Blue"],
						"-6":["VR40", "VR40", "VR45", "VR45 and VX43", "V40", "Green \u2192 Blue"],
						"-7":["VR40", "VR40", "VR40", "VR45 and VX43", "V40", "Green or Blue Multigrade"],
						"-8":["VR30", "VR40", "VR40", "VR45 and VX43", "V30", "Green or Blue Multigrade"],
						"-9":["VR30", "VR30", "VR30", "VR40", "V30", "Green"],
						"-10":["VR30", "VR30", "VR30", "VR30", "V30", "Green Special or Green"],
						"-11":["VR30", "VR30", "VR30", "VR30", "V30", "Green Special"]
					};
					
					//the lookUpTable uses whole numbers
					temp = Math.round(temp);
					 //for very cold and warm temperatures the wax is the same
			 		if(temp <= -11){
			 		temp = -11
					 }
					if(temp >= 6){
				 	temp = 6
					}
					
					var waxRecommendation = lookUpTable[temp][key];
					return waxRecommendation;
}


// Chart code
function gochart(our_custom_data)
{
var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "light",
    "marginTop":0,
    "marginRight": 80,
    "dataProvider": our_custom_data,
    "valueAxes": [{
        "axisAlpha": 0,
        "position": "left" ,
		"title": "temperature (\xB0C)"
    },	{
		"axisAlpha": 0,
        "position": "right" ,
		"title": "date"
	}],
    "graphs": [{
        "id":"g1",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]&degC</span></b><br>" + "Wax Recommendation: [[wax]]",
        "bullet": "none",
        "bulletSize": 0,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "type": "smoothedLine",
        "valueField": "temperature" 
    }],
    "chartScrollbar": {
        "graph":"g1",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1

    },
    "chartCursor": {
        "categoryBalloonDateFormat": "H:NN MMM DD",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
    },
    "dataDateFormat": "YYYY-MM-DD-HH-NN",
    "categoryField": "date",
    "categoryAxis": {
        "minPeriod": "mm",
        "parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
    },
    "export": {
        "enabled": true
    }
});
}   
