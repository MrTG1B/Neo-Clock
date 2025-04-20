document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded');
    const loginState = localStorage.getItem('loginState');
    if (loginState === 'true') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('clockPage').style.display = 'flex';
    }

    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const dob = document.getElementById('dob').value;
        const eAgeofDeath = document.getElementById('eAgeofDeath').value;
        const data = { username, dob, eAgeofDeath };
        localStorage.setItem('loginState', 'true');
        localStorage.setItem('userData', JSON.stringify(data));
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('clockPage').style.display = 'flex';

        setInterval(() => {
            localStorage.setItem('loginState', 'false');
            localStorage.removeItem('userData');
            document.getElementById('loginPage').style.display = 'flex';
            document.getElementById('clockPage').style.display = 'none';
        }, 10000);
    });

    
});     