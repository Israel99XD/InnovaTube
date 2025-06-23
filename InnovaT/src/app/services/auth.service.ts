import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }
    private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
    public isLoggedIn$ = this.loggedIn.asObservable();

    login(sIdentificador: string, sPasword: string): Observable<any> {
        return this.http.post(`${API_URL}/login`, { sIdentificador, sPasword });
    }

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

    saveToken(token: string) {
        this.loggedIn.next(true);
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logout() {
        localStorage.removeItem('token');
        this.loggedIn.next(false);
    }
}
