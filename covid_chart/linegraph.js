var globalStateData;
var globalDates;
var globalAbbrList;



function createStateDateObject(data){
    var StateList = new Object();
    var abbrArray = new Array();
    //Initialize Abbr library
    for (var i = 0; i<56; i++){
        
        
        var localArray = new Array();

        for (j = 0; j < 14; j++){

            var localObject = new Object();
            localObject['abbr'] = "";
            localObject['date'] = "";
            localObject['cases'] = "";
            localArray.push(localObject);
        }

        StateList[data[i].state] = localArray;

    }

    var dateArrayIndex = 0;
    var localCount = 0;
    for (var i = 0; i<data.length; i++){

        if (dateArrayIndex > 13){
            return StateList;
        }
        StateList[data[i].state][dateArrayIndex].abbr = data[i].state;
        StateList[data[i].state][dateArrayIndex].date = data[i].date;
        StateList[data[i].state][dateArrayIndex].cases = data[i].positive;
        ++localCount
        if (localCount > 56){
            localCount = 0;
            dateArrayIndex++;
        }



        
    }


    return StateList;




}



function getLast2Weeks(data){
    var temp = "";
    var dates = new Array();
    var count = 0;
    for (var i = 0; i<data.length; i++){
        if (data[i].date != temp){
            temp = data[i].date;
            dates.push(data[i].date);
            i = i + 54;
            count++;
        }
        if (count >= 14){
            return dates;
        }
    }
}


function updateLineGraph(abbr){

    var dataArray = new Array();
    for (var i = 0; i < 14; i++){
        dataArray.push(globalStateData[abbr][i].cases);
    }
    dataArray.reverse();
    chart2.data.datasets[0].data = dataArray;

    
    chart2.update();



}


function initializeLineGraph(){
    chart2.data.labels = globalDates.reverse();
    var dataArray = new Array();
    for (var i = 0; i < 14; i++){
        dataArray.push(globalStateData.AL[i].cases);
    }
    dataArray.reverse();
    chart2.data.datasets[0].data = dataArray;

    
    chart2.update();

}


function getAbbrFromName(name){
    return globalAbbrList[name];

}


function ajaxAbbr(callback, name){
    $.ajax({
        url: 'name-abbr.json',
        dataType: 'json',
        success: function(data) {
            globalAbbrList = data;
            console.log(globalAbbrList);
        }
      })
}

function processAjaxData(data){
    var dates = getLast2Weeks(data);
    for (var i = 0; i < dates.length; i++){
        dates[i] = dates[i].toString();
        dates[i] = dates[i].replace("2020", "");
        console.log(dates[i]);
    }
    var states = createStateDateObject(data);
    globalStateData = states;
    globalDates = dates;
    initializeLineGraph();

}

function ajaxHistoricData(callback){
    $.ajax({
        url: 'https://cors-anywhere.herokuapp.com/https://covidtracking.com/api/v1/states/daily.json',
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
      })
}


function generateDate(){
    var d = new Date();
    var date = new Object();

    var year = d.getFullYear();
    year = year.toString();

    var month = d.getMonth()

    month++;
    month = month.toString();
    if (month.length == 1){
        month = "0" + month;
    }

    var day = d.getDate();
    day = day.toString();
    if (day.length == 1){
        day = "0" + day;
    }

    date['year'] = year;
    date['month'] = month;
    date['day'] = day;
    console.log(date);
    return date;
}


var ctx = document.getElementById('chart2').getContext('2d');
var chart2 = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [0],
        datasets: [{
            label: "",
            data: [0],
            borderColor: 'red',
            borderWidth: 2
        }]
    },
    options: {
        title: {
          display: true,
          text: 'Alabama'
        }
      }
});

function dropDown(input){
    
    var abbr = getAbbrFromName(input);
    console.log("okay")
    chart2.options.title.text = input;
    updateLineGraph(abbr);
    console.log("oka2y")

}

var e = document.getElementById("stateList");
var result = e.options[e.selectedIndex].value;
generateDate();
ajaxAbbr();
ajaxHistoricData(processAjaxData);
