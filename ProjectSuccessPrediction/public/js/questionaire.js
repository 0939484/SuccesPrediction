(function () {
    $(document).ready(function () {
        const memberId = sessionStorage.getItem("currentMemberId");
        const projectId = sessionStorage.getItem("projectIdToAnswer");
        const setNumber = sessionStorage.getItem("setNumberToAnswer");
        // fetch questions
        $.get(`http://localhost:3000/project/${projectId}/member/${memberId}/question/${setNumber}`, function (data) {
            data.forEach(function (question) {
                $('#questionsContainer').append(
                    $('<div class="form-group">').append(getLabel(question)).append(getQuestionView(question))
                );
            });

            $('#questionaireForm').submit(function (event) {
                event.preventDefault();
                for (let i = 0; i < data.length; i++) {
                    $.ajax({
                        type: 'PUT',
                        url: `http://localhost:3000/answer/${data[i].answersId}`,
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify({
                            "answer": `${$('#q' + data[i].id).val()}`,
                            "questionId": `${data[i].id}`,
                        }),
                        success: function (res) {
                            if (i === data.length - 1) {
                                showAlert("Thank you", function() {
                                    window.open("answerQuestions", "_self");
                                });
                            }
                        }
                    });
                }
            });
        });
    });
})();

function transformToLongQuestion(short) {
    switch (short) {
        case "Impact":
            return "Do you think that the impact of changes and renewals has been assessed enough?";
        case "Complexity":
            return "Do you think that the complexity of changes and renewals has been assessed enough?";
        case "Improvement":
            return "Do changes and / or renewals in reality lead to improvement of your working situation?";
        default:
            return short;
    }
}

function getLabel(question) {
    return $('<label>')
        .attr('for', 'q' + +question.id).text(transformToLongQuestion(question.question));
}

function getQuestionView(question) {
    return $('<select class="form-control" required>' +
        '<option value="1">1</option>' +
        '<option value="4">4</option>' +
        '<option value="7">7</option>' +
        '<option value="10">10</option>' +
        '</select>')
        .attr('id', 'q' + +question.id).attr('name', 'q' + +question.id);
}