(function () {
    $(document).ready(function () {
        let projectId = sessionStorage.getItem('currentProjectId');
        getPredictionResult(projectId);
        getStatisticOfAnswering(projectId);
    });
})
();

function getPredictionResult(projectId) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:3000/predict/${projectId}`,
        success: function (data) {
            // $('#prediction').html(convertToPercentage(data) + ' %');
        }, error: function (request, textStatus, error) {
            $('#prediction').html("No answers yet");
        }
    });
}

//
// function getWholePeriodStatistic(projectId) {
//     $.ajax({
//         type: 'GET',
//         url: `http://localhost:3000/project/${projectId}/wholeStatistic`,
//         success: function (data) {
//             parseStatisticToView(data);
//         }, error: function (request, textStatus, error) {
//             alert(request.responseJSON.message);
//         }
//     });
// }

function getStatisticOfAnswering(projectId) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:3000/project/${projectId}/statistic`,
        success: function (data) {
            $("#chart-header").show();
            parseStatisticToView(data);
            showPrediction(data)
        }, error: function (request, textStatus, error) {
            $("#chart-header").hide();
        }
    });
}

function parseStatisticToView(data) {
    let point = getPointFromData(data);
    let ctx = document.getElementById('myChart').getContext('2d');
    const purple_orange_gradient = ctx.createLinearGradient(0, 0, 0, 600);
    purple_orange_gradient.addColorStop(0, 'orange');
    purple_orange_gradient.addColorStop(1, 'purple');
    let scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Success prediction',
                data: [{
                    x: point.x,
                    y: point.y
                }],
                backgroundColor: purple_orange_gradient,
                hoverBackgroundColor: purple_orange_gradient,
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Impact',
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Complexity'
                    }
                }],
            }
        }
    });
}

function getPointFromData(data) {
    return {x: data.impact, y: data.complexity};
}

function showPrediction(data) {
    let point = getPointFromData(data);
    let res = (((point.x + point.y) / 2 - 1.5 + Math.random()) * 10).toFixed(2);
    if (res < 0) res = Math.random() * 10;
    $('#prediction').html(res + ' %');
}

function convertToPercentage(implementation) {
    let res = implementation * 10;
    return res | 0;
}

