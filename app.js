
const API_URL = "http://127.0.0.1:7000/users";

async function register() {
    event.preventDefault();

    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const pass = document.getElementById('pass').value;

        if (!name || !email || !pass) {
            alert('Please fill all the fields before submitting');
            return;
        }

        await axios.post(`${API_URL}/register`, {
            name: name,
            email: email,
            password: pass
        });
        window.location.href = "users.html";

        alert("✅ Registration Successful!");
    } catch (error) {
        console.error("❌ Error Response:", error.response || error.message);
        alert("❌ Registration Failed! " + (error.response?.data?.error || error.message));
    }
}


async function login() {
    event.preventDefault();
    console.log('coming to login')
    try {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('pass').value;

        if (!email || !pass) {
            alert('❌ Please fill in all fields!');
            return;
        }

        const response = await axios.post(`${API_URL}/login`, { email: email, password: pass });

        console.log(response.data);
        alert("✅ Login Successful!");

        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect to dashboard
        window.location.href = "users.html";
    } catch (error) {
        console.error("❌ Login failed:", error.response?.data?.error || error.message);
        
        if (error.response) {
            alert(`❌ ${error.response.data.error}`);
        } else {
            alert("❌ Login failed. Please try again.");
        }
    }
}

function getUsers() {
    console.log("📡 Fetching users...");
    const usersList = document.getElementById('usersList');

    if (!usersList) {
        console.error("❌ Element with id 'usersList' not found in HTML");
        return;
    }

    axios.get(`${API_URL}/users`)
        .then(response => {
            const users = response.data.users;
            console.log("✅ Users:", users);

            usersList.innerHTML = ""; // Clear list before adding users

            users.forEach(user => {
                // ✅ Create list item with delete button
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="user-info">👤 ${user.name} - 📧 ${user.email}</span>
                    <button class="delete-btn" onclick="deleteUser(${user.id})">❌</button>
                `;
                usersList.appendChild(li);
            });

            alert("✅ Users fetched successfully!");
        })
        .catch(error => {
            console.error("❌ Error fetching users:", error);
            alert("❌ Failed to fetch users!");
        });
}

// ✅ Only run getUsers() on users.html
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("users.html")) {
        console.log("📡 Dashboard detected, calling getUsers()...");
        getUsers();
    }
});


function logout() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("⚠️ You are already logged out!");
        return; // Stop execution since there's no user logged in
    }

    // Remove user from localStorage
    localStorage.removeItem("user");

    alert("✅ Successfully logged out!");
    window.location.href = "login.html"; // Redirect to login page
}


document.addEventListener("DOMContentLoaded", function() {
    const user = JSON.parse(localStorage.getItem("user"));
    const logoutBtn = document.getElementById("logoutBtn");

    if (user) {
        logoutBtn.textContent = "🚪 Logout"; // Show Logout when user is logged in
    } else {
        logoutBtn.textContent = "🔑 Login";
        logoutBtn.onclick = function() {
            window.location.href = "login.html"; // Redirect to login page if not logged in
        };
    }
});


function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("user"));
    const currentPage = window.location.pathname.split("/").pop(); // Get the current file name

    if (!user && currentPage === "users.html") {
        alert("❌ You are not logged in! Redirecting to login page...");
        window.location.href = "login.html";
    }
}

// Run on page load
window.onload = function () {
    checkLoginStatus(); // Ensures only logged-in users stay on protected pages
    if (window.location.pathname.includes("users.html")) {
        getUsers(); // Fetch users only on dashboard
    }
};


function deleteUser(userId) {
    const confirmDelete = confirm("⚠️ Are you sure you want to delete this account?");
    if (!confirmDelete) return;

    axios.delete(`${API_URL}/users/delete/${userId}`)
        .then(response => {
            alert("✅ User deleted successfully!");
            getUsers(); // Refresh user list
        })
        .catch(error => {
            console.error("❌ Error deleting user:", error);
            alert("❌ Failed to delete user!");
        });
}
