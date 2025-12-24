const axios = require('axios');

async function testRegister() {
    try {
        console.log("Attempting to register user...");
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'DebugUser',
            email: `debug_${Date.now()}@test.com`,
            password: 'password123'
        });
        console.log("Success:", res.data);
    } catch (error) {
        if (error.response) {
            console.error("Server Error (Response):", JSON.stringify(error.response.data, null, 2));
            console.error("Status:", error.response.status);
        } else if (error.request) {
            console.error("No response received. Server might be down or not reachable.");
        } else {
            console.error("Error setting up request:", error.message);
        }
    }
}

testRegister();
