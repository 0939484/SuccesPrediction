(function () {
    $(document).ready(function () {
         $("#form-wrapper").submit(function (event) {
             event.preventDefault();
             $.post('http://localhost:3000/login', {
                 username: $("#emailAddress").val(),
                 password: $("#firstName").val(),
             }, function (data, status) {
                 if (data.user) {
                     sessionStorage.setItem("currentMemberId", data.user.id);
                     sessionStorage.setItem("token", data.token);
                     openNeededWindow(data.user.role);
                 } else {
                     showAlert("Incorrect username or email");
                 }
             });
         });
    });
})();

function openNeededWindow(role) {
    switch (role) {
        case 'Project manager':
            window.open("/views/dashboard", "_self");
            break;
        case 'Project member':
            window.open("answerQuestions", "_self");
            break;
        case 'Backend operator':
            window.open("./questionManager.html", "_self");
            break;
    }
}

