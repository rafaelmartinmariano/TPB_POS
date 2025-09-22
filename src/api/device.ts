import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://101.0.0.50/api'; // Change this to your Laravel API base URL

// Types
interface RegisterResponse {
    status: 'success' | 'error';
    message: string;
    device_id?: number;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
}

interface ProductsResponse {
    status: 'success' | 'error';
    products: Product[];
}

/**
 * Register a device using IMEI and token
 */
export const registerDeviceApi = async (imei: string, token: string): Promise<number> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await axios.post(`${API_URL}/devices/register`, {
            imei,
            token,
        });

        

        if (response.data.status === 'success' && response.data.device_id) {
            return response.data.device_id;
        } else {
            throw new Error(response.data.message || 'Failed to register device');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

/**
 * Fetch products assigned to a device
 */
export const syncProductsApi = async (deviceId: number): Promise<Product[]> => {
    try {
        const response: AxiosResponse<ProductsResponse> = await axios.get(`${API_URL}/devices/${deviceId}/products`);

        if (response.data.status === 'success') {
            return response.data.products;
        } else {
            throw new Error('Failed to fetch products');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};


export const validateTokenApi = async (imei: string,token: string): Promise<boolean> => {
  try {
    console.log("IMEI: "+imei,"token: "+token);
    const response = await axios.post(`${API_URL}/devices/validate`, { imei,token });
    return response.data.valid; // true or false from Laravel
  } catch (error) {
    console.error("❌ Token validation failed:", error);
    return false;
  }
};