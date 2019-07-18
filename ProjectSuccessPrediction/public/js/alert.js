
let mCallback;

let code = 
    `<div class="modal fade" id="wrong-credentials-modal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
       <div class="modal-content">
           <div class="modal-body">
               <p id="modal-text">Wrong email or password</p>
           </div>
           <div class="modal-footer">
               <button click="callback" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
           </div>
       </div>
    </div>
    </div>`;

function showAlert(text, callback) {
    $("body").append(code);
    $("#modal-text").html(text);
    $('#wrong-credentials-modal').modal("show");
    mCallback = callback;
    $('#wrong-credentials-modal').on("hide.bs.modal", function() {
        if(mCallback) mCallback();
    })
}