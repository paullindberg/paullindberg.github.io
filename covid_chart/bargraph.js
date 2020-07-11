var stateArray = [];
var positiveCases = [];
var deaths = [];
var recoveries = [];
var colors = [];
var ventilator = [];
var fullStates = false;

function packData(data){
    let totalPositive = 0;
    console.log(data);

          for(var i = 0; i < 50; i++){
          stateArray.push(data[i].state);
          positiveCases.push(data[i].positive);
          deaths.push(data[i].death);
          recoveries.push(data[i].recovered);
          ventilator.push(data[i].onVentilatorCurrently)
      }

    document.getElementById("dateFound").innerHTML = "Last Automatic Update: " 
    + data[0].checkTimeEt + " | Data Provided by <a href ='https://covidtracking.com/'><i>The Covid Tracking Project</i></a>";
}



function displayHeaders(data){
    console.log(data);
    let printData = "US Total Positive Cases: " + formatNumber(data[0].positive) + "<br>" + "US Total Deaths: " + formatNumber(data[0].death);
    document.getElementById("countryHeader").innerHTML = printData;

}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }


function traverseStates(data, i){
    for (var c in data){
        if (data[c] == myChart.data.labels[i]){
            myChart.data.labels[i] = c;
            return;
        }
    }


}





function ajaxStateNames(callback){
    $.ajax({
        url: 'name-abbr.json',
        dataType: 'json',
        success: function(data) {
        //This is a dumb inefficent algorith that does a ton of unnecessary work. But it's quick and it works.
            for (var i = 0; i < myChart.data.labels.length; i++){
                traverseStates(data, i);
            }
            callback();

    
        }
      })
}



function ajaxUSData(callback){
    $.ajax({
        url: 'https://covidtracking.com/api/v1/us/current.json',
        dataType: 'json',
        success: function(data) {
            callback(data);
    
        }
      })
}


function ajaxStateData(callback, func1){
$.ajax({
    url: 'https://covidtracking.com/api/v1/states/current.json',
    dataType: 'json',
    success: function(data) {
        callback(data);
        func1();


    }
  })
 }



var choice = 0;
for(var i = 0; i < 50; i++){
    if (choice == 0){
        colors.push('rgba(255, 99, 132, 0.2)');
        choice = 1;
    }
    if (choice == 1){
        colors.push('rgba(54, 162, 235, 0.2)');
        choice = 2;
    }
    if (choice == 2){
        colors.push('rgba(255, 206, 86, 0.2)');
        choice = 3;
    }
    if (choice == 3){
        colors.push('rgba(75, 192, 192, 0.2)');
        choice = 4;
    }
    if (choice == 4){
        colors.push('rgba(153, 102, 255, 0.2)');
        choice = 5;
    }
    if (choice == 5){
        colors.push('rgba(255, 159, 64, 0.2)');
        choice = 0;
    }
}


function updateChart(title, importData, chart){
    chart.data.labels = stateArray;
    chart.data.datasets[0].label = title;
    chart.data.datasets[0].data = importData;
    chart.update();

}

function emptyUpdate(){

    myChart.update();


}

function createPairObj(){
    var arrayPairs = new Array();
    var len = myChart.data.datasets[0].data.length;
    for (var i = 0; i < len; i++){
        var pairing = new Object();
        pairing["id"] = myChart.data.labels[i];
        pairing["value"] = myChart.data.datasets[0].data[i];
        
        arrayPairs.push(pairing);
    }
    return arrayPairs;
}


function toggleStateNames(){

    ajaxStateNames(emptyUpdate);

}

function selectionSort(arrayPairs){
    let len = arrayPairs.length;
    //Selection Sort
    for (let i = 0; i < len; i++) {
        let min = i;
        for (let j = i + 1; j < len; j++) {
            if (arrayPairs[min].value > arrayPairs[j].value) {
                min = j;
            }
        }
        if (min !== i) {
            let tmp = arrayPairs[i];
            arrayPairs[i] = arrayPairs[min];
            arrayPairs[min] = tmp;
        }
    }
    return arrayPairs;


}

function sortAscending(){

    arrayPairs = createPairObj();
    arrayPairs = selectionSort(arrayPairs);


    console.log("Sorted Dataset: ")
    console.log(arrayPairs);

    var ids = new Array();
    var values = new Array();
    for (let i = 0; i < arrayPairs.length; i++){
        ids.push(arrayPairs[i].id);
        values.push(arrayPairs[i].value);
    }

    myChart.data.labels = ids;
    myChart.data.datasets[0].data = values;
    myChart.update();
}

function sortDescending(){

    arrayPairs = createPairObj();
    arrayPairs = selectionSort(arrayPairs);
    arrayPairs.reverse();


    var ids = new Array();
    var values = new Array();
    for (let i = 0; i < arrayPairs.length; i++){
        ids.push(arrayPairs[i].id);
        values.push(arrayPairs[i].value);
    }
    
    myChart.data.labels = ids;
    myChart.data.datasets[0].data = values;
    myChart.update();


    


}

function displayCases(){
    updateChart("Confirmed Cases", positiveCases, myChart);

}


function displayDeaths(){
    updateChart("Deaths", deaths, myChart);

}


function displayRecoveries(){
    updateChart("Recoveries", recoveries, myChart);

}

function displayVent(){
    updateChart("On Ventilator", ventilator, myChart);
}




var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
        labels: stateArray,
        datasets: [{
            label: "Confirmed Cases",
            data: positiveCases,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});


ajaxStateData(packData, displayCases);
ajaxUSData(displayHeaders);
