//Kuaförleri getiriyorum :
$.get('http://localhost:8082/api/users/getAllWorkers', function(workers) {
    workers.forEach(function(worker) {
        var fullName = worker.firstName + ' ' + worker.lastName;
        $('#workerSelect').append(new Option(fullName, worker.workerId)); 
    });
});

// Hizmetleri çekelim :
$.get('http://localhost:8082/api/services/get-all-services', function(services) {
    services.forEach(function(service) {
        var checkboxHtml = `<input type="checkbox" name="service" value="${service.serviceId}"> ${service.serviceName}<br>`;
        $('#serviceCheckboxes').append(checkboxHtml);
    });
});

//Günelri ayarlıyoruz
document.addEventListener("DOMContentLoaded", function() {
    var dateInput = document.getElementById('dateSelect');

    var today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    dateInput.addEventListener('input', function(e) {
        var chosenDate = new Date(this.value);
        if (chosenDate.getDay() === 0) { 
            alert('Pazar günleri seçilemez. Lütfen başka bir gün seçin.');
            this.value = ''; 
        }
    });
});


$('#workerSelect, #dateSelect').change(function() {
    var workerId = $('#workerSelect').val(); 
    var selectedDate = $('#dateSelect').val(); 
    var serviceIds = $('#serviceCheckboxes input:checked').map(function() {
        return this.value; 
    }).get();

    if(workerId && selectedDate) {
        var data = {
            workerId: workerId,
            appointmentDate: selectedDate, 
            serviceIds: serviceIds.join(',') 
        };

        $.get('http://localhost:8082/api/appointments/available-slots', data, function(availableSlots) {
            $('#timeSelect').empty(); 
            availableSlots.forEach(function(slot) {
                $('#timeSelect').append(new Option(slot, slot)); 
            });
        }).fail(function() {
            console.log("Müsait zaman dilimleri yüklenirken bir hata oluştu.");
        });
    }
});



$('#appointmentForm').submit(function(event) {
    event.preventDefault();
    
    var customerId = localStorage.getItem('userId'); 
    var selectedWorkerId = $('#workerSelect').val();
    var selectedServices = $('#serviceCheckboxes input:checked').map(function() {
        return $(this).val();
    }).get();

    if (selectedServices.length === 0) {
        event.preventDefault();
        alert('Lütfen en az bir hizmet seçin.'); 
        return false; 
    }
    var selectedDate = $('#dateSelect').val();
    var selectedTime = $('#timeSelect').val();
    var appointmentNote = $('#noteTextarea').val();
    
    
    var apiUrl = 'http://localhost:8082/api/appointments/addAppointment';
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customerId: parseInt(customerId),
            workerId: parseInt(selectedWorkerId),
            appointmentDate: `${selectedDate}T${selectedTime}`,
            serviceIds: selectedServices,
            note: appointmentNote
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Randevu oluşturma başarısız.');
        }
        if(response.status === 204){ 
            console.log('Randevu başarılı ama içerik yok.');
            return {}; 
        }
    })
    .then(data => {
        console.log('Randevu başarılı:', data);
        $('#successMessage').text('Randevunuz başarı ile oluşturulmuştur.').show();
    })
    .catch(error => {
        console.error('Randevu oluşturma hatası:', error);
        $('#warningMessage').text('Randevunuz oluşturulamamıştır.').show();
    });
});

