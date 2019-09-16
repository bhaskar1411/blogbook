import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignUpData } from './signup.model';
import { LoginData } from './login.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener =  new Subject<boolean>();

  constructor(private http: HttpClient,
              private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  signUp(name: string, email: string, password: string) {
    const signUpData: SignUpData = {
      name: name,
      email: email,
      password: password
    };
    this.http.post<{message: string}>
    ( BACKEND_URL + '/signup', signUpData )
    .subscribe( (response) => {
      console.log(response);
      const message = response.message;
      window.alert(message);
      this.router.navigate(['/']);
    }, error => {
      console.log(error);
      const message = "Email already exist or conncetion error";
      window.alert(message);
      this.router.navigate(['/']);
    });
  }

  login(email: string, password: string) {
    const loginData: LoginData = {
      email: email,
      password: password
    };
    this.http.post
    <{token: string, expiresIn: number, userId: string}>
    (BACKEND_URL + '/login', loginData)
    .subscribe( response => {
      console.log(response.token);
      const token  = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
       // console.log(expirationDate);
        this.saveAuthData(token, expirationDate, this.userId);
        this.router.navigate(['/list']);
      }
    }, error => {
      window.alert("Incorrect email or password you entered!!");
      this.router.navigate(['/']);
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
