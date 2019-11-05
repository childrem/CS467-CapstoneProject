// The structure of the code in this file was inspired by the following:
// https://stackoverflow.com/questions/44415130/how-can-i-send-information-from-nodejs-server-to-client-side

$(document).ready(function(){

    console.log("You're in the client side javascript");

    LoadChart();

    //var req = new XMLHttpRequest();
    //var url = '/businessIntelligence/chartSample';

    //req.open('GET',url,true);
    //req.addEventListener('load',onLoad);
    //req.addEventListener('error',onError);

    //req.send();

    //function onError() {
        //console.log('error receiving async AJAX call');
    //}

});


function LoadChart() {

    console.log("You're in load chart");

    var req = new XMLHttpRequest();
    var url = 'businessIntelligence/chartSample';

    req.open('GET',url,true);
    req.addEventListener('load',onLoad);
    req.addEventListener('error',onError);

    req.send(null);
}


function onLoad() {

    console.log("You're in onLoad");
    
    var response = this.responseText;
    console.log(response);
    var parsedResponse = JSON.parse(response);

    var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: parsedResponse['xAxis'], //['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], //parsedResponse['xAxis'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
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