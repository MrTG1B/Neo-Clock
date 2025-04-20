document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded');
    const loginState = localStorage.getItem('loginState');
    if (loginState === 'true') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('clockPage').style.display = 'flex';
    }

    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', () => {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const dob = document.getElementById('dob').value;
        const eAgeofDeath = document.getElementById('eAgeofDeath').value;
        if (!firstName || !lastName || !dob || !eAgeofDeath) {
            alert('Please fill in all fields');
            return;
        }
        else if (isNaN(eAgeofDeath)) {
            alert('Expected Age of Death must be a number');
            return;
        }
        // else if (isNaN(dob)) {
        //     alert('Date of Birth must be a date');
        //     return;
        // }
        const data = { firstName, lastName, dob, eAgeofDeath };
        localStorage.setItem('loginState', 'true');
        localStorage.setItem('userData', JSON.stringify(data));
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('clockPage').style.display = 'flex';

        window.location.reload();

        // setInterval(() => {
        //     localStorage.setItem('loginState', 'false');
        //     localStorage.removeItem('userData');
        //     document.getElementById('loginPage').style.display = 'flex';
        //     document.getElementById('clockPage').style.display = 'none';
        // }, 10000);
    });

    const userData = JSON.parse(localStorage.getItem('userData'));
    let endDate,startDate;
    if (userData) {    
        const dobDate = new Date(userData.dob);
        const expectedAge = parseInt(userData.eAgeofDeath, 10);
    
        if (!isNaN(dobDate.getTime()) && !isNaN(expectedAge)) {
            startDate=new Date(dobDate.setFullYear(dobDate.getFullYear()));
            endDate = new Date(dobDate.setFullYear(dobDate.getFullYear() + expectedAge));
            
            console.log(startDate);
            console.log(endDate);
        } else {
            console.error("Invalid DOB or expected age of death");
        }
    }

    const userInitials = document.getElementById('userInitials');
    if (userData) {
        userInitials.textContent = `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`;
    }
    
    const circle = document.getElementById('circle');

    const days     = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const months   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const dates    = Array.from({length:31},(_,i)=>i+1);
    const hours    = Array.from({length:24},(_,i)=>String(i).padStart(2,'0'));
    const minutes  = Array.from({length:60},(_,i)=>String(i).padStart(2,'0'));
    const seconds  = Array.from({length:60},(_,i)=>String(i).padStart(2,'0'));
    const years    = Array.from({length:36},(_,i)=>2025+i);

    const ringsData = [
      { items: days,    radius: 50 },
      { items: months,  radius: 100 },
      { items: dates,   radius: 140 },
      { items: hours,   radius: 180 },
      { items: minutes, radius: 220 },
      { items: seconds, radius: 260 },
      { items: years,   radius: 300 }
    ];

    // Create all rings
    const ringRefs = ringsData.map(({items,radius}) => {
      const ring = document.createElement('div');
      ring.className = 'ring';
      items.forEach((val,i) => {
        const angle = (360/items.length)*i - 90;
        const x = Math.cos(angle*Math.PI/180)*radius;
        const y = Math.sin(angle*Math.PI/180)*radius;
        const el = document.createElement('div');
        el.className = 'item';
        el.style.left = `${300+x}px`;
        el.style.top  = `${300+y}px`;
        el.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
        el.textContent = val;
        ring.appendChild(el);
      });
      circle.appendChild(ring);
      return { ring, items };
    });

    const countdown = document.getElementById('timeLeft');
    const target = endDate;

    let lastValues = Array(ringRefs.length).fill(null);

    function update() {
      const now = new Date();
      // Current values for each ring
      const curr = [
        days[now.getDay()?now.getDay()-1:6],
        months[now.getMonth()],
        now.getDate(),
        String(now.getHours()).padStart(2,'0'),
        String(now.getMinutes()).padStart(2,'0'),
        String(now.getSeconds()).padStart(2,'0'),
        now.getFullYear()
      ];

      // Rotate only rings with changed value
      curr.forEach((val, i) => {
        if (val === lastValues[i]) return;
      
        const { ring, items } = ringRefs[i];
        const idx = items.indexOf(val);
        const angle = -(360 / items.length) * idx + 90;
        ring.style.transform = `rotate(${angle}deg)`;
        ring.style.transition = 'transform 0.5s ease-in-out';
        lastValues[i] = val;
      
        // Remove 'active' class from all items in this ring
        ring.querySelectorAll('.item').forEach(el => el.classList.remove('active'));
      
        // Add 'active' class to the current item
        const currentItem = ring.children[idx];
        if (currentItem) currentItem.classList.add('active');
      });
      

      // Update countdown and timestamp
      const diff = target - now.getTime();
      const y = Math.floor(diff/(1000*60*60*24*365));
      const d = Math.floor((diff%(1000*60*60*24*365))/(1000*60*60*24));
      const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
      const m = Math.floor((diff%(1000*60*60))/(1000*60));
      const s = Math.floor((diff%(1000*60))/1000);
      countdown.textContent = `Time left: ${y}y ${d}d ${h}h ${m}m ${s}s`;


      const timeUsed=document.getElementById('timeUsed');

        const unow = new Date();
        const udiff = unow.getTime() - startDate.getTime();

        const uy = Math.floor(udiff/(1000*60*60*24*365));
        const ud = Math.floor((udiff%(1000*60*60*24*365))/(1000*60*60*24));
        const uh = Math.floor((udiff%(1000*60*60*24))/(1000*60*60));
        const um = Math.floor((udiff%(1000*60*60))/(1000*60));
        const us = Math.floor((udiff%(1000*60))/1000);
        timeUsed.textContent = `Time used: ${uy}y ${ud}d ${uh}h ${um}m ${us}s`;
    }

    

    setInterval(update,1000);
    update();

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        localStorage.setItem('loginState', 'false');
        localStorage.removeItem('userData');
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('clockPage').style.display = 'none';
        window.location.reload();
    });
    
});     