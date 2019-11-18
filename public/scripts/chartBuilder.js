// The structure of the code in this file was inspired by the following:
// https://stackoverflow.com/questions/44415130/how-can-i-send-information-from-nodejs-server-to-client-side

$(document).ready(function(){

    // Help setting up click event listeners obtained from:
    // https://stackoverflow.com/questions/1070760/javascript-function-in-href-vs-onclick
    // Help with clearing the canvas element so hover would work obtained from:
    // https://stackoverflow.com/questions/24815851/how-to-clear-a-chart-from-a-canvas-so-that-hover-events-cannot-be-triggered

    $('#noChart').click(function(){
        $('#myChart').remove();     // Clear out old chart if present
        $('#chartContainer').append('<canvas id="myChart"></canvas>');  // Put a new canvas on the page
        return false;
    });
    
    $('#chartOption1').click(function(){
        $('#myChart').remove();     // Clear out old chart if present
        $('#chartContainer').append('<canvas id="myChart"></canvas>');  // Put a new canvas on the page
        generateAwardCount(); 
        return false;
    });

    $('#chartOption2').click(function(){
        $('#myChart').remove();     // Clear out old chart if present
        $('#chartContainer').append('<canvas id="myChart"></canvas>');  // Put a new canvas on the page
        generateAmountofEachType(); 
        return false;
    });

    $('#chartOption3').click(function(){
        $('#myChart').remove();     // Clear out old chart if present
        $('#chartContainer').append('<canvas id="myChart"></canvas>');  // Put a new canvas on the page
        generateAwardsByMonth();
        return false;
    });
    
    // Close the drop down menu after user clicks a choice. Help obtained from:
    // https://stackoverflow.com/questions/18855132/close-bootstrap-dropdown-after-link-click
    
    $(".dropdown-menu a").click(function() {
        $(this).closest(".dropdown-menu").prev().dropdown("toggle");
    });

});


function LoadChart(chartToLoad) {

    var req = new XMLHttpRequest();
    var url = 'businessIntelligence/' + chartToLoad;

    req.open('GET',url,true);
    req.addEventListener('load',onLoad);
    req.addEventListener('error',onError);

    req.send(null);
}


function onLoad() {
    
    var response = this.responseText;
    var parsedResponse = JSON.parse(response);


    var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: parsedResponse['xAxis'], //['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], //parsedResponse['xAxis'],
            datasets: [{
                label: parsedResponse['label'], //'# of Votes',
                data: parsedResponse['yAxis'], //[12, 19, 3, 5, 2, 3],
                backgroundColor: parsedResponse['backgroundColor'], /*[
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],*/
                borderColor: parsedResponse['borderColor'], /*[
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],*/
                borderWidth: 1
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

}

function onError() {
    console.log('error receiving async AJAX call');
}


function generateAwardCount() {

    LoadChart("awardCount");

}


function generateAmountofEachType() {
    LoadChart("amountOfEachType");
}

function generateAwardsByMonth() {
    LoadChart("awardsByMonth");
}