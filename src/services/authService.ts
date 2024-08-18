import { jwtDecode } from 'jwt-decode';
import LoginRequest from "../models/requests/auth/loginRequest";
import { AxiosResponse } from "axios";
import LoginResponse from "../models/responses/auth/loginResponse";
import tokenService from "../core/services/tokenService";
import RegisterRequest from "../models/requests/auth/registerRequests";
import axiosInstance from "../core/interceptors/axiosInterceptor";
import RegisterResponse from "../models/responses/auth/registerResponse";


interface TokenDetails {
    ID: string;
    Email: string;
    Name: string;
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}


class AuthService {
    async login(request: LoginRequest): Promise<boolean> {
        try {
            const response = await axiosInstance.post<LoginResponse>("Auth/login", request);
            console.log(response);  // Yanıtı konsolda inceleyin
            if (response.data && response.data.token) {
                tokenService.setToken(response.data);  // Token'ı sakla
                return true;  // Giriş başarılı
            }
            return false;  // Giriş başarısız
        } catch (error) {
            console.error('Login failed', error);
            return false;  // Hata durumunda da başarısız olarak dön
        }
    }
    
    

    register(request: RegisterRequest): Promise<AxiosResponse<RegisterResponse, any>> {
        return axiosInstance.post<RegisterResponse>("Auth/register", request);
    }

    getUserInfo(): any {
        const token = tokenService.getToken();
    
        if (!token) {
            return null;
        }
    
        try {
            const tokenDetails: TokenDetails = jwtDecode(token);
            const {
                ID: userId,
                Email: email,
                Name: name,
            } = tokenDetails;
    
            if (!userId || !email) {
                console.error('User ID or email is missing in the token');
                return null;
            }
    
            let userName = name ? name.split(' ')[0] : 'Unknown';
    
            const user: any = {
                id: userId,
                usernName: userName,
                email: email,
            };
    
            return user;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
    
}

export default new AuthService();
