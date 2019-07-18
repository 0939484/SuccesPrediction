(function () {
    $(document).ready(function () {
        $("select").on("click" , function() {

            $(this).parent(".select-box").toggleClass("open");

        });

        $(document).mouseup(function (e)
        {
            var container = $(".select-box");

            if (container.has(e.target).length === 0)
            {
                container.removeClass("open");
            }
        });


        $("select").on("change" , function() {

            var selection = $(this).find("option:selected").text(),
                labelFor = $(this).attr("id"),
                label = $("[for='" + labelFor + "']");

            label.find(".label-desc").html(selection);

        });


        $("#form-wrapper").submit(function (event) {
            event.preventDefault();
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/member',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "firstName": `${$("#firstName").val()}`,
                    "middleName": `${$("#middleName").val()}`,
                    "lastName": `${$("#lastName").val()}`,
                    "emailAddress": `${$("#emailAddress").val()}`,
                    "role":`${$("#select-box1").val()}`,
                }),
                success: function (data) {
                    window.open("./logIn.html", "_self");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    showAlert("The user with this username or email already exists");
                }
            });
        });
    });
})();