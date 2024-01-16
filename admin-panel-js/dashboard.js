$(document).ready(function() {
    $('#registerForm').on('submit', function(event) {
        event.preventDefault(); 

        var formData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            phoneNumber: $('#phoneNumber').val(),
            password: $('#password').val(),
            role: "HAIRDRESSER" 
        };

        $.ajax({
            url: 'http://localhost:8082/api/users/addWorker', 
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(data) {
                console.log('Success:', data);
                alert('Kuaför başarıyla eklendi.');

            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('Kuaför eklenirken bir hata oluştu: ' + error);
            }
        });
    });
});



function getAllWorkers() {
    fetch('http://localhost:8082/api/users/getAllWorkers')
    .then(response => response.json())
    .then(data => {
        const workersList = document.getElementById('workersList');
        workersList.innerHTML = ''; 

        data.forEach(worker => {
            const fullName = `${worker.firstName} ${worker.lastName}`;
            const listItem = document.createElement('li');
            listItem.textContent = fullName;
            workersList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Kuaförler yüklenirken bir hata oluştu:', error);
    });
}

document.addEventListener('DOMContentLoaded', getAllWorkers);
