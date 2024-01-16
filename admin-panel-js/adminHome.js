var userRole = localStorage.getItem('userRole');
 console.log(localStorage.getItem('userRole'));
    if(window.location.href.indexOf('warning.html') === -1) {
        if(userRole !== 'ADMIN') {
            window.location.href = 'warning.html';
        }
    }


