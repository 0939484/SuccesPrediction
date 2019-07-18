(function () {
    $(document).ready(function () {
        let memberId = sessionStorage.getItem('currentMemberId');
        memberId = memberId === null ? 1 : memberId;
        getProjects(memberId);

    });
})();

function getProjects(memberId) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:3000/project/needAnswer/${memberId}`,
        success: function (data) {
            createTable(data);
        }, error: function (request, textStatus, error) {
            showAlert(request.responseJSON.message);
        }
    });
}

function createTable(data) {
    const tableBody = $("#projectTableBody");
    for (let i = 0; i < data.length; i++) {
        tableBody.append(` <tr data-projectId ="${data[i].id}">
                        <td class="column1">${data[i].name}</td>
                        <td class="column2">
                            <a href="#" onclick="answerClickListener(${data[i].id}, ${data[i].setNumber})" class="button">Answer</a>
                        </td>
                    </tr>`);
    }
}

function answerClickListener(projectId, setNumber) {
    sessionStorage.setItem("projectIdToAnswer", projectId);
    sessionStorage.setItem("setNumberToAnswer", setNumber);
    window.open("questionaire", "_self")
}
