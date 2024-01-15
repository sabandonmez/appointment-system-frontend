$(document).ready(function () {
    var workerId = localStorage.getItem("userId");
  
    $.ajax({
      url: "http://localhost:8082/api/appointments/get-by-worker-appointments",
      type: "GET",
      data: {
        workerId: workerId,
      },
      dataType: "json",
      success: function (appointments) {
        // Randevuları tarih ve saat bilgisine göre sırala
        appointments.sort(function (a, b) {
          return new Date(a.appointmentDate) - new Date(b.appointmentDate);
        });
  
        var tableBody = $("#appointment-workers-table-body");
        tableBody.empty();
  
        var fetchPromises = []; // Asenkron işlemleri takip etmek için bir Promise dizisi oluştur
  
        appointments.forEach(function (appointment) {
          // fetchWorkerName ve calculateAndDisplayTotal asenkron işlemlerini bir Promise ile sar
          var promise = new Promise(function (resolve, reject) {
            fetchCustomerName(appointment.customerId, function (firstName, lastName) {
              calculateAndDisplayTotal(
                appointment,
                function (totalDuration, totalPrice) {
                  var appointmentDate = new Date(appointment.appointmentDate);
                  var now = new Date();
                  var rowClass = appointmentDate < now ? "table-danger" : ""; // Geçmiş randevular için sınıfı ayarla
  
                  resolve({
                    // Çözülen Promise objesinde gerekli bilgileri sakla
                    firstName: firstName,
                    lastName: lastName,
                    date: appointmentDate.toISOString().split("T")[0],
                    time: appointmentDate
                      .toISOString()
                      .split("T")[1]
                      .substring(0, 5),
                    duration: totalDuration,
                    price: totalPrice,
                    rowClass: rowClass,
                    services:appointment.services
                  });
                }
              );
            });
          });
          fetchPromises.push(promise);
        });
        Promise.all(fetchPromises)
  .then(function (results) {
    // Tüm asenkron işlemler tamamlandıktan sonra sonuçları kullanarak tabloyu oluştur
    results.forEach(function (result) {
      // Services dizisini bir string'e dönüştür
      var serviceNames = result.services.map(function(service) {
        return service.serviceName;
      }).join(", "); // Service isimlerini virgülle ayırarak birleştir

      var row = '<tr class="' + result.rowClass +'">' +
      "<td>" + result.firstName + " " + result.lastName + "</td>" +
      "<td>" + result.date + "</td>" +
      "<td>" + result.time + "</td>" +
      "<td>" + result.duration + " dakika</td>" +
      "<td>" + result.price + " TL</td>" +
      "<td>" + serviceNames + "</td>" + 
      "</tr>";
      tableBody.append(row);
            });
          })
          .catch(function (error) {
            console.error("Error with fetching data for appointments", error);
          });
      },
      error: function (error) {
        console.error("Error fetching appointments", error);
      },
    });
  
    function fetchCustomerName(customerId, callback) {
      $.ajax({
        url: "http://localhost:8082/api/users/getByIdCustomer/" + customerId,
        type: "GET",
        dataType: "json",
        success: function (workerData) {
          callback(workerData.firstName, workerData.lastName);
        },
        error: function (error) {
          console.error("Error fetching worker name", error);
          callback("Unknown", "Worker"); // Hata durumunda varsayılan isimler
        },
      });
    }
  
    function calculateAndDisplayTotal(appointment, callback) {
      var serviceIds = appointment.services.map(function (service) {
        return service.id;
      });
  
      $.ajax({
        url: "http://localhost:8082/api/appointments/calculate-total",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(serviceIds),
        dataType: "json",
        success: function (response) {
          // Callback fonksiyonunu iki parametre ile çağır
          callback(response.duration, response.price);
        },
        error: function (error) {
          console.error("Error calculating total", error);
          callback("Error", "Error");
        },
      });
    }
  });
  