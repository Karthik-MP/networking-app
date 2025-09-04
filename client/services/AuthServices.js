import axios from 'axios';

const BASE_URL = 'http://149.125.55.181:3001/api/'; // Replace with your actual base URL
// const BASE_URL = 'http://localhost:3001/api/'; // Replace with your actual base URL

export const postRequest = async (endpoint, data) => {
    //     // const jwtToken = await AsyncStorage.getItem('jwtToken');
    //     // const headers = jwtToken
    //     //     ? { Authorization: `Bearer ${jwtToken}` }
    //     //     : {};
    console.log(`POST Request to ${BASE_URL}${endpoint} with data:`, data);
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json', // Set the custom header here
            },
        });
        return response;
    } catch (error) {
        console.error('Error in postRequest:', error);
        throw error;
    }
};
