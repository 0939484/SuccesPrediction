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
        url: `http://localhost:3000/project/${projectId}/numPeopleAnswered`,
        success: function (data) {
            $('#peopleAnswered').html(data);
        }, error: function (request, textStatus, error) {
            alert(request.responseJSON.message);
        }
    });
}

function getStatisticOfAnswering(projectId) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:3000/project/${projectId}/statistic`,
        success: function (data) {
            parseStatisticToView(data);
        }, error: function (request, textStatus, error) {
            alert(request.responseJSON.message);
        }
    });
}

function parseStatisticToView(data) {
    let complexityArray = Array(4).fill(0);
    for (let index = 0; index < data.Complexity.length; index++) {
        let answer = data.Complexity[index];
        complexityArray[getIndexOfAnswer(answer)]++;
    }
    labels = [1, 4, 7, 10];
    let ctx = document.getElementById("complexityChart").getContext('2d');
    let complexityBar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of responses',
                data: complexityArray,
                backgroundColor: 'rgba(67, 110, 190, 1)',
            }]
        },
    });
    ctx = document.getElementById("complexityPie").getContext('2d');
    let complexityPie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of responses',
                data: complexityArray,
                backgroundColor: ['rgba(67, 110, 190, 1)', 'rgba(0, 142, 212, 1)', 'rgba(0, 173, 221, 1)', 'rgba(0, 202, 220, 1)'],
            }]
        },
    });
    let impactArray = Array(4).fill(0);
    for (let index = 0; index < data.Impact.length; index++) {
        let answer = data.Impact[index];
        impactArray[getIndexOfAnswer(answer)]++;
    }
    ctx = document.getElementById("impactBar").getContext('2d');
    let impactBar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of responses',
                data: impactArray,
                backgroundColor: 'rgba(104, 64, 146, 1)',
            }]
        },
    });
    ctx = document.getElementById("impactPie").getContext('2d');
    let impactPie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of responses',
                data: impactArray,
                backgroundColor: ['rgba(104, 64, 146, 1)', 'rgba(159, 71, 146, 1)', 'rgba(203, 86, 139, 1)', 'rgba(235, 111, 126, 1)'],
            }]
        },
    });
}

function getIndexOfAnswer(answer) {
    switch (answer) {
        case 1:
            return 0;
        case 4:
            return 1;
        case 7:
            return 2;
        case 10:
            return 3;
    }
}