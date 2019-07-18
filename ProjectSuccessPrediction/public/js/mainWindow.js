(function () {
    $(document).ready(function () {
        let memberId = sessionStorage.getItem('currentMemberId');
    });

    $('#projects').click(function () {
        projectsClick()
    });

    $('#questions').click(function () {
        questionsClick()
    });


    $('#members').click(function () {
        membersClick()
    });
})();

function projectsClick() {
    window.open("projects", "_self");
}

function questionsClick() {
    window.open("questions", "_self");
}

function membersClick() {
    window.open("members", "_self");
}
    

