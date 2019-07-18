
let picker;

(function () {
    $(document).ready(function () {

        const memberId = sessionStorage.getItem("currentMemberId");
        const projectId = sessionStorage.getItem("currentProjectId");
        getAllMembersForDataList();
        getAndParseProject(projectId);
        getAllQuestions();
        getAllProjectMembers(projectId);

        $("#members-controls").hide();

        $("#updateProjectForm").submit(function (event) {
            event.preventDefault();
            submit(projectId)
        });

        $("#cancelButton").click(function () {
            cancelRequest()
        });

        let selectedRows = null;
        $("#modifyMembers").click(function() {
            selectedRows = [];
            $("#members-controls").show();
            $("#modifyMembers").hide();
        });

        $(document).on("click", "tr", function() {
            if(selectedRows) {
                let index = $(this).index();
                let row = $("#membersTableBody").find("tr").eq(index);
                row.toggleClass("table-row-selected");
                let selectedIndex = selectedRows.indexOf(index);
                if(selectedIndex != -1) {
                    selectedRows.splice(index, 1);
                } else {
                    selectedRows.push(index);
                }
            }
        });


        $("#members-cancel-button").click(function() {
            selectedRows = null;
            $("#membersTableBody > tr").each(function() {
                $(this).removeClass("table-row-selected");
            });
            $("#members-controls").hide();
            $("#modifyMembers").show();
        });

        $("#members-remove-button").click(function() {
            for(let row of selectedRows) {
                let id = $("#membersTableBody").find("tr").eq(row).data("member-id");
                $.ajax({
                    type: 'DELETE',
                    url: `http://localhost:3000/project/${projectId}/member/${id}`,
                    success: function (data) {
                        getAllProjectMembers(projectId);
                    }, error: function (request, textStatus, error) {
                        alert(request.responseJSON.message);
                    }
                });
            }
            if(selectedRows) {
                $("#members-controls").hide();
                $("#modifyMembers").show();
            }
            selectedRows = null;
        });

        $("#addMember").click(function () {
            addMember($("#addMemberField").val(), projectId)
        });

        $("#sendQuestions").click(function () {
            sendSelectedQuestions(projectId, getSelectedQuestionsId())
        });

        $("#calculateResult").click(function () {
            calculateSuccess()
        })

        picker = datepicker("#startDate", {
            formatter: (input, date, instance) => {
                input.value = $.format.date(date, 'yyyy-MM-dd')
            }
        });
    });
})
    ();

function getAndParseProject(projectId) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:3000/table/${projectId}`,
        success: function (data) {
            parseProject(data)
        }, error: function (request, textStatus, error) {
            alert(request.responseJSON.message);
        }
    });
}

function parseProject(project) {
    $("#name").val(project.name);
    $("#startDate").val(convertDbDate(project.startDate));
    $(`#location option[value=${project.location}]`).attr('selected', 'selected');
    $(`#sector option[value=${project.sector}]`).attr('selected', 'selected');
    $("#country").val(project.country);
    $(`#typeProject option[value=${project.typeProject}]`).attr('selected', 'selected');
    $(`#typeInnovation option[value=${project.typeInovation}]`).attr('selected', 'selected');
    $("#peopleNumber").val(project.peopleNumber);
}

function convertDbDate(date) {
    return date.slice(0, 10);
}

function submit(projectId) {
    let date = picker.dateSelected;
    let tmp = new Date(date.valueOf());
    tmp.setDate(tmp.getDate() + 1);
    date = $.format.date(tmp, "yyyy-MM-dd");
    $.ajax({
        type: 'PUT',
        url: `http://localhost:3000/table/${projectId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "name": `${$("#name").val()}`,
            "startDate": `${date}`,
            "location": `${$("#location").children("option:selected").val()}`,
            "sector": `${$("#sector").children("option:selected").val()}`,
            "country": `${$("#country").val()}`,
            "typeProject": `${$("#typeProject").children("option:selected").val()}`,
            "typeInovation": `${$("#typeInnovation").children("option:selected").val()}`,
            "peopleNumber": `${$("#peopleNumber").val()}`
        }),
        success: function (data) {
            window.open("./myProjects.html", "_self");
        }, error: function (request, textStatus, error) {
            showAlert(request.responseJSON.message);
        }
    })
}


function cancelRequest() {
    const cancel = confirm("Your progress won't be saved");
    if (cancel) {
        window.open("./myProjects.html", "_self");
    }
}

function getAllMembersForDataList() {
    $.ajax({
        type: 'GET',
        url: `http://localhost:3000/member`,
        success: function (data) {
            data.forEach(member => {
                $("#emailList").append(`<option>${member.emailAddress}</option>`)
            })
        }, error: function (request, textStatus, error) {
            showAlert(request.responseJSON.message);
        }
    });
}

function addMember(email, projectId) {
    if (email === undefined || email === "") {
        showAlert(`Wrong ${email}`);
        return
    }
    $.ajax({
        type: 'POST',
        url: `http://localhost:3000/project/member/email`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "emailAddress": email,
            "projectId": projectId,
        }),
        success: function (data) {
            showAlert(`Member with email: ${email} was successfully added`);
            $("#addMemberField").val("");
            getAllProjectMembers(projectId);
        }, error: function (request, textStatus, error) {
            showAlert(request.responseJSON.message);
        }
    });
}

function sendSelectedQuestions(projectId, questionsId) {
    $.ajax({
        type: 'POST',
        url: `http://localhost:3000/project/${projectId}/sendSelectedQuestion`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "questionsId": questionsId,
        }),
        success: function (data) {
            showAlert("Questions was sended to the members of the project");
        }, error: function (request, textStatus, error) {
            showAlert(request.responseJSON.message);
        }
    });
}

function getAllQuestions() {
    $.ajax({
        type: 'GET',
        url: `http://localhost:3000/question`,
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                if (i < 2) {
                    $("#questionTableBody").append(generateQuestionRow(data[i]));
                } else {
                    $("#questionTableBody").append(generateQuestionRow(data[i], true));
                }
            }
        }, error: function (request, textStatus, error) {
            showAlert(request.responseJSON.message);
        }
    });
}

function appendOneQuestion(question, enabled) {

    if (enabled) {
        $("#checkboxContainer").append(` <div class="checkbox">
                        <label style="color: white"><input data-id =${question.id} type="checkbox" value=${question.question}>${question.question}</label>
                    </div>`);
    } else {
        $("#checkboxContainer").append(` <div class="checkbox">
                        <label style="color: white"><input data-id =${question.id} type="checkbox" value=${question.question} disabled checked>${question.question}</label>
                    </div>`);
    }
}

function getSelectedQuestionsId() {
    let selected = [];
    $('#questionTableBody input:checked').each(function () {
        selected.push($(this).data('id'));
    });
    return selected;
}

function calculateSuccess() {
    window.open("result", "_self");
}

function getAllProjectMembers(projectId) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:3000/project/${projectId}/member`,
        success: function (data) {
            let tableBody = $("#membersTableBody");
            tableBody.empty();
            for(let member of data) {
                let row = generateTableRow(member);
                 tableBody.append(row);
            }
        }, error: function (request, textStatus, error) {
            showAlert("error");
        }
    });
}

function generateTableRow(member) {
    let projectInfo = $(`<tr data-member-id ="${member.id}">`)
        .append(`<td class="column1">${member.lastName} ${member.middleName} ${member.firstName}</td>`)
        .append(`<td class="column1">${member.emailAddress}</td>`);
    return projectInfo;
}

function generateQuestionRow(question, enabled) {
    if(enabled) {
        let projectInfo = $(`<tr>`)
        .append(`<td class="column1"> <input data-id ="${question.id}" type="checkbox" class="question-radio"> </td>`)
        .append(`<td class="column1">${question.question}</td>`);
        return projectInfo;
    } else {
        let projectInfo = $(`<tr>`)
        .append(`<td class="column1"> <input  data-id ="${question.id}" disabled checked type="checkbox" class="question-radio"> </td>`)
        .append(`<td class="column1">${question.question}</td>`);
        return projectInfo;
    }
}