
function logOut() {
    $.ajax({
        type: 'GET',
        url: `http://localhost:3000/logout`,
        success: function (data) {
            sessionStorage.setItem('currentMemberId', null);
            window.open("login", "_self");
        }, error: function (request, textStatus, error) {
            showAlert("Incorrect username or password. Try to login again.")
        }
    });
}

$('#log_out').click(function () {
    logOut();
});