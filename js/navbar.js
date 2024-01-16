 //homedaki id lere ulaşmak için 
 $(document).ready(function(){
    $('body').on('click', 'a[href^="#"]', function(event) {
        event.preventDefault();
        var target = this.hash;
        var $target = $(target);
        $('html, body').animate({
            scrollTop: $target.offset().top
        }, 1, 'swing', function() {
            window.location.hash = target;
        });
    });

    var sessionKey = localStorage.getItem('sessionKey');
    var userName = localStorage.getItem('userName');
    var userRole = localStorage.getItem('userRole');

    // Kullanıcı giriş yapmışsa özel linkler ekle
    if (sessionKey) {
        var additionalLinks = '';
        if (userRole === 'CUSTOMER') {
            additionalLinks += '<li class="nav-item"><a class="nav-link pt-3" href="randevu-al.html">Randevu Al</a></li>';
            additionalLinks += '<li class="nav-item"><a class="nav-link pt-3" href="customer-appointments.html">Mevcut Randevularım</a></li>';
        } else if (userRole === 'HAIRDRESSER') {
            additionalLinks += '<li class="nav-item"><a class="nav-link pt-3" href="hairdresser-appointments.html">Randevularım</a></li>';
        } else if (userRole === 'ADMIN') {
            additionalLinks += '<li class="nav-item"><a class="nav-link pt-3" href="admin-home.html">Admin Panel</a></li>';
        }
        $('#navbarLinks').append(additionalLinks);
        if (userRole !== 'ADMIN') {
            $('#navbarLinks').append('<li class="nav-item"><a class="nav-link pt-3" href="account-settings.html">Hesap Ayarları</a></li>');
        }        
        $('#navbarLinks').append('<li class="nav-item"><a href="#" class="nav-link pt-3" id="logoutLink">Çıkış Yap</a></li>');
        $('#loginLink').hide();
    } else {
        $('#loginLink').show();
    }

    $('#logoutLink').click(function() {
        localStorage.removeItem('sessionKey');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        window.location.href = 'login.html';
    });
});

