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
    $.get('http://localhost:3000/member', function (data) {
        let managers = $("#managersTableBody");
        let members = $("#membersTableBody")
        for (let i = 0; i < data.length; i++) {
            let row = generateTableRow(data[i], editingEnable);
            if (data[i].role == "Project manager")
                managers.append(row);
            else
                members.append(row);
        }
    });
}

function generateTableRow(member, editingEnable) {
    let projectInfo = $(`<tr data-questionId ="${member.id}">`)
        .append(`<td class="column1">${member.firstName}</td>`)
        .append(`<td class="column1">${member.middleName}</td>`)
        .append(`<td class="column1">${member.lastName}</td>`)
        .append(`<td class="column1">${member.emailAddress}</td>`);
    return projectInfo;
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
        url: `http://localhost:3000/member`,
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