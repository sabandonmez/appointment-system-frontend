document.addEventListener('DOMContentLoaded', function () {
    fetchAppointments();

    function fetchAppointments() {
        fetch('http://localhost:8082/api/appointments/get-all-appointment')
            .then(response => response.json())
            .then(appointments => {
                processAppointments(appointments);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
    }

    function processAppointments(appointments) {
        var tableBody = document.getElementById('appointment-workers-table-body');
        tableBody.innerHTML = ''; // Tabloyu temizle

        appointments.forEach(appointment => {
            fetchTotalDetails(appointment).then(totalDetails => {
                var row = createTableRow(appointment, totalDetails);
                tableBody.appendChild(row);
            }).catch(error => {
                console.error('Error processing appointment:', error);
            });
        });
    }

    function fetchTotalDetails(appointment) {
        return fetch('http://localhost:8082/api/appointments/calculate-total', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointment.serviceIds)
        })
        .then(response => response.json())
        .then(totalDetails => {
            return totalDetails; // Toplam süre ve fiyat bilgisini döndür
        });
    }

    function createTableRow(appointment, totalDetails) {
        var row = document.createElement('tr');

        // Müşteri Adı, Randevu Tarihi, Saat, İşlem Süresi, İşlem Ücreti, Verilecek Hizmetler
        var customerNameCell = row.insertCell(0);
        customerNameCell.textContent = appointment.customerName; 

        var dateCell = row.insertCell(1);
        var appointmentDate = new Date(appointment.appointmentDate);
        dateCell.textContent = appointmentDate.toISOString().split('T')[0];

        var timeCell = row.insertCell(2);
        timeCell.textContent = appointmentDate.toTimeString().split(' ')[0];

        var durationCell = row.insertCell(3);
        durationCell.textContent = totalDetails.duration + ' dakika';

        var priceCell = row.insertCell(4);
        priceCell.textContent = totalDetails.price + ' TL';

        var servicesCell = row.insertCell(5);
        servicesCell.textContent = appointment.services.join(', '); // Hiz
        return row;
    }
});