$(document).ready(function() {
    var userId = localStorage.getItem('userId');
    var userRole = localStorage.getItem('userRole');
    var currentUserInfo = {}; // Kullanıcının mevcut bilgilerini saklamak için bir obje

    // Kullanıcının mevcut bilgilerini getiren AJAX isteği
    function fetchCurrentUserInfo() {
        var url = 'http://localhost:8082/api/users/getByUserId/' + userId 

        $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                currentUserInfo = data; // Kullanıcının mevcut bilgilerini sakla
                // Form alanlarını mevcut bilgilerle doldur
                $('#firstName').val(data.firstName);
                $('#lastName').val(data.lastName);
                // Şifre ve telefon numarası gibi bilgiler genellikle dolu gelmez
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Kullanıcı bilgileri alınamadı: ' + textStatus);
            }
        });
    }

    fetchCurrentUserInfo(); // Sayfa y
    $('#updateUserForm').submit(function(e) {
        e.preventDefault();
    
        // Formdan alınan yeni bilgileri sakla
        var updatedInfo = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            password: $('#password').val(),
            phoneNumber: $('#phoneNumber').val()
        };
    
        // Eğer yeni bilgiler boşsa, mevcut kullanıcı bilgilerini kullan
        updatedInfo.firstName = updatedInfo.firstName || currentUserInfo.firstName;
        updatedInfo.lastName = updatedInfo.lastName || currentUserInfo.lastName;
        updatedInfo.password = updatedInfo.password || currentUserInfo.password;
        updatedInfo.phoneNumber = updatedInfo.phoneNumber || currentUserInfo.phoneNumber;
    
        var updateUrl = userRole === 'CUSTOMER' 
            ? 'http://localhost:8082/api/users/updateCustomer' 
            : 'http://localhost:8082/api/users/updateWorker';
    
        // Kullanıcı ID'sini requestBody'e ekle
        var requestBody = userRole === 'CUSTOMER' 
            ? { customerId: parseInt(userId), ...updatedInfo }
            : { workerId: parseInt(userId), ...updatedInfo };
    
        // AJAX isteği ile kullanıcı bilgilerini güncelle
        $.ajax({
            url: updateUrl,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(requestBody),
            success: function(response) {
                alert('Bilgileriniz başarıyla güncellendi.');
                fetchCurrentUserInfo(); 
                $('#updateUserForm').get(0).reset();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert('Bilgileriniz güncellenirken bir hata oluştu: ' + textStatus);
            }
        });
    });
});