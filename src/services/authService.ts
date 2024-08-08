import LoginRequest from "../models/requests/auth/loginRequest";
import { AxiosResponse } from "axios";
import LoginResponse from "../models/responses/auth/loginResponse";
import tokenService from "../core/services/tokenService";
import RegisterRequest from "../models/requests/auth/registerRequests";
import axiosInstance from "../core/interceptors/axiosInterceptor";
import RegisterResponse from "../models/responses/auth/registerResponse";
import { jwtDecode } from "jwt-decode";

interface TokenDetails {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
    email: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}

class AuthService {
    login(request: LoginRequest): Promise<AxiosResponse<LoginResponse, any>> {
        return axiosInstance.post<LoginResponse>("Auth/Login", request);
    }

    register(request: RegisterRequest): Promise<AxiosResponse<RegisterResponse, any>> {
        return axiosInstance.post<RegisterResponse>("Auth/Register", request);
    }

    getUserInfo(): any {
        const token = tokenService.getToken();

        if (!token) {
            return null;
        }

        const tokenDetails: TokenDetails = jwtDecode(token);
        const {
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': userId,
            email,
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': name,
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': role
        } = tokenDetails;


        let nameParts = name.split(' ');
        let lastname = nameParts.pop() || '';
        let firstname = nameParts.join(' ');

        const user: any = {
            id: userId,
            firstName: firstname,
            lastName: lastname,
            email: email,
            role: role
        };

        return user;
    }
}

export default new AuthService() 