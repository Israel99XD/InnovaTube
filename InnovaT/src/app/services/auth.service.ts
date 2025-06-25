import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const API_URL = 'https://innovatube-hq5c.onrender.com/api/auth';

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
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
        }
        if (localStorage.getItem('usuario')) {
            localStorage.removeItem('usuario');
        }
        this.loggedIn.next(false);
    }

    forgotPassword(sCorreo: string): Observable<any> {
        return this.http.post(`${API_URL}/forgot-password`, { sCorreo });
    }

    verifyResetCode(sCorreo: string, codigo: string): Observable<any> {
        return this.http.post(`${API_URL}/verify-code`, { sCorreo, codigo });
    }

    resetPasswordWithCode(sCorreo: string, codigo: string, nuevaPassword: string): Observable<any> {
        return this.http.post(`${API_URL}/reset-password-code`, { sCorreo, codigo, nuevaPassword });
    }


    getUsuario(): any {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    }

    getUsername(): string {
        const usuario = this.getUsuario();
        return usuario ? usuario.sUsername : '';
    }
}
