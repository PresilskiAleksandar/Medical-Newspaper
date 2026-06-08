const API_URL = process.env.REACT_APP_API_URL || 'https://medinfo-backend-o36l.onrender.com/api';
export const IMAGE_BASE = API_URL.replace('/api', '');
export default API_URL;
