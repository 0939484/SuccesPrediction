(function () {
    $(document).ready(function () {
        let memberId = sessionStorage.getItem('currentMemberId');
        memberId = memberId === null ? 1 : memberId;
        getAllProjects(memberId);
    });

    $('#add-button').click(function () {
        window.open("new", "_self");
    });
})();

function getAllProjects(memberId) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:3000/project/member/${memberId}`,
        success: function (data) {
            const tableBody = $("#projectTableBody");
            for (let i = 0; i < data.length; i++) {
                tableBody.append(generateTableRow(data[i]));
            }
        }, error: function (request, textStatus, error) {
            console.log("No projects or connection lost");
        }
    });
}

function generateTableRow(project) {
    $projectInfo = $(`<tr onclick="projectLabelClickListener(${project.id})" data-projectId ="${project.id}"></tr>`).append(`<td>
                        <p>${project.name}</p>
                        </td>
                        <td>
                            <p>${project.startDate}</p>
                        </td>
                        <td>
                            <p>${project.country}</p>
                        </td>
                        <td>
                            <p>${project.sector}</p>
                        </td>
                        <td>
                            <p>${project.typeProject}</p>
                        </td>
                        <td>
                            <p>${project.typeInovation}</p>
                        </td>
                        <td>
                            <p>${project.peopleNumber}</p>
                        </td>
                        <td>
                            <p>Running</p>
                        </td>`);
    return $projectInfo;
}

function addClickListener(projectId) {
    const email = $(`#Email${projectId}`).val();
    addMember(email, projectId);
}

function addMember(email, projectId) {
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
            $(`#Email${projectId}`).val("");
        }, error: function (request, textStatus, error) {
            alert(request.responseJSON.message);
        }
    });
}

function sendQuestionsListener(projectId) {
    $.ajax({
        type: 'POST',
        url: `http://localhost:3000/project/${projectId}/sendQuestion`,
        success: function (data) {
            alert("Success");
        }, error: function (request, textStatus, error) {
            alert(request.responseJSON.message);
        }
    });
}


function projectLabelClickListener(projectId) {
    sessionStorage.setItem('currentProjectId', projectId);
    window.open("update", "_self");
}

