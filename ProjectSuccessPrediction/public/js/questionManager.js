(function () {
    $(document).ready(function () {
        let memberId = sessionStorage.getItem("currentMemberId");
        createWindowForRole(memberId)
    });

    $('#add-button').click(function () {
        addButtonListener();
    });


    $('#question_prompt').fadeOut("fast", function () {

    });

    $('#question_prompt button').click(function () {
        var message = $('#question_prompt textarea').val().trim();

        if (!(message === null || message === '')) {

            addQuestion(message);
            $('#question_prompt').fadeOut("fast", function () {
                $('#question_prompt').addClass("hidden");
            });
        }
    });
})();

function createWindowForRole(memberId) {
    getMemberRole(memberId).then(role => {
        if (memberId === null) {
            alert("Something went wrong!");
            return;
        }
        getQuestions(role === "Backend operator");
    })
}

function getMemberRole(memberId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `http://localhost:3000/member/${memberId}`,
            success: function (member) {
                resolve(member.role)
            }, error: function (request, textStatus, error) {
                reject(request.responseJSON.message);
            }
        });
    });
}

function getQuestions(editingEnable) {
    $.get('http://localhost:3000/question', function (data) {
        const tableBody = $("#projectTableBody");
        for (let i = 0; i < data.length; i++) {
            tableBody.append(generateTableRow(data[i], editingEnable));
        }
    });
}

function generateTableRow(question, editingEnable) {
    $projectInfo = null;
    if (editingEnable) {
        $projectInfo = $(`<tr data-questionId ="${question.id}">`).append(`<td class="column1">
                        ${question.question}</td>
                        <td class="column2">
                           <a href="#" onclick="removeQuestion(${question.id})" class="button">Remove</a>
                        </td>`);
    }
    else {
        $projectInfo = $(`<tr data-questionId ="${question.id}">`).append(`<td class="column1">
                        ${question.question}</td>`);
    }
    return $projectInfo;
}

function removeQuestion(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:3000/question/${id}`,
        success: function (data) {
            location.reload();
        }, error: function (request, textStatus, error) {
            alert(request.responseJSON.message);
        }
    });
}

function addButtonListener() {

    $('#question_prompt').removeClass("hidden");
    $('#question_prompt textarea').val("");
    $('#question_prompt').fadeIn("slow", function () {

    });

}

function addQuestion(questionsText) {

    $.ajax({
        type: 'POST',
        url: `http://localhost:3000/question`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "question": questionsText,
        }),
        success: function (data) {
            location.reload();
        }, error: function (request, textStatus, error) {
            alert(request.responseJSON.message);
        }
    });
}