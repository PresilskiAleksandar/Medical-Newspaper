const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const IMAGE_BASE = API_URL.replace('/api', '');
export default API_URL;
