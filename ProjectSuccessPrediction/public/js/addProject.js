let picker;
(function () {
    $(document).ready(function () {
        const memberId = sessionStorage.getItem("currentMemberId");
        $("#createProjectForm").submit(function (event) {
            event.preventDefault();
            submit(memberId)
        });

        $("#cancelButton").click(function () {
            cancelRequest()
        });
    });

    picker = datepicker("#startDate", {
        formatter: (input, date, instance) => {
            input.value = $.format.date(date, 'yyyy-MM-dd')
        }
    });
})
();

function submit(memberId) {
    let date = picker.dateSelected;
    if(date == undefined) {
        showAlert("Incorrect date");
        return;
    }
    let tmp = new Date(date.valueOf());
    tmp.setDate(tmp.getDate() + 1);
    date = $.format.date(tmp, "yyyy-MM-dd");
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/table',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "name": `${$("#name").val()}`,
            "startDate": `${$("#startDate").val()}`,
            "location": `${$("#location").children("option:selected").val()}`,
            "sector": `${$("#sector").children("option:selected").val()}`,
            "country": `${$("#country").val()}`,
            "typeProject": `${$("#typeProject").children("option:selected").val()}`,
            "typeInovation": `${$("#typeInnovation").children("option:selected").val()}`,
            "memberId": `${memberId}`,
        }),
        success: function (data) {
            window.open("projects", "_self");
        }, error: function (request, textStatus, error) {
            showAlert("Incorrect data. Check date format");
        }
    })
}


function cancelRequest() {
    const cancel = confirm("Your progress won't be saved");
    if (cancel) {
        window.open("projects", "_self");
    }
}

