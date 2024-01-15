$(document).ready(function() {
    $('#loginForm').submit(function(event) {
        event.preventDefault();

        var email = $('#email').val();
        var password = $('#password').val();

        var data = {
            email: email,
            password: password
        };

        fetch('http://localhost:8082/api/users/login-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Giriş başarısız.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Başarılı:', data);
            localStorage.setItem('sessionKey', data.sessionKey);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('userName', data.firstName); 
            localStorage.setItem('userRole', data.role);
            
            window.location.href = 'homePage.html';
            alert('Hoşgeldin '+data.firstName );
        })
        .catch((error) => {
            console.error('Hata:', error);
            document.getElementById('dangerContainer').style.display = 'block';
            setTimeout(function() {
                document.getElementById('dangerContainer').style.display = 'none';
            }, 3000); 
        });
    });
});
