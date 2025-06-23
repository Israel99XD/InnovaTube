import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    register(data: {
        sNombre: string;
        sApellidoPaterno: string;
        sApellidoMaterno: string;
        sCorreo: string;
        sUsername: string;
        sPasword: string;
    }): Observable<any> {
        return this.http.post(`${API_URL}/register`, data);
    }

}
