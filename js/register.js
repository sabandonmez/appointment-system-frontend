$(document).ready(function() {
    $('#registerForm').on('submit', function(event) {
        event.preventDefault(); 

        var formData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            phoneNumber: $('#phoneNumber').val(),
            password: $('#password').val(),
            role: "CUSTOMER" 
        };

        $.ajax({
            url: 'http://localhost:8082/api/users/register', 
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(data) {
                console.log('Success:', data);
                $('#successContainer').show();
                $('#registerForm').get(0).reset();
                window.location.href = 'login.html';
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                $('#dangerContainer').show();
            }
        });
    });
});
