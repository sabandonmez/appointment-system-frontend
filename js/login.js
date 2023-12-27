
        document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        var data = {
            email: email,
            password: password
        };

        fetch('http://localhost:8082/api/users/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
})
.then(response => {
    if (response.ok) {
        return response.text();
    } else {
        throw new Error('Giriş başarısız.');
    }
})
.then(data => {
    console.log('Başarılı:', data);
    document.getElementById('successContainer').style.display = 'block';
    setTimeout(function() {
        window.location.href = 'http://127.0.0.1:5500/randevu-alma.html';
    }, 3000); 
})
.catch((error) => {
    console.error('Hata:', error);
    document.getElementById('dangerContainer').style.display = 'block';
    setTimeout(function() {
        document.getElementById('dangerContainer').style.display = 'none';
    }, 3000); 
});

    });
