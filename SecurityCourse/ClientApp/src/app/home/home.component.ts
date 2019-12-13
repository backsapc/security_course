import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { concatMap, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }

    private isLoggedInParam = false;

    public login(data: { email, password }): Observable<boolean> {
        return this.http.post("/Account/Login", { login: data.email, password: data.password })
            .pipe(map((x: any) => {
                return this.isLoggedInParam = !!x.isAuthorized;
            })
        );
    }

    public logout(): void {
      this.isLoggedInParam = false;
    }

    public isLoggedIn(): boolean {
      return this.isLoggedInParam;
    }
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    loginForm: FormGroup;
    isSubmitted = false;
    isLoggedIn = false;

    constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
      
    }

    ngOnInit() {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });

      this.isLoggedIn = this.authService.isLoggedIn();
    }

    get formControls() { return this.loginForm.controls; }

    login() {
        this.isSubmitted = true;

        if (this.loginForm.invalid) {
          return;
        }

        this.authService.login(this.loginForm.value).subscribe(
            isLogged => {
                this.isLoggedIn = isLogged;
                if (isLogged) {
                  this.router.navigateByUrl('/admin');
                } else {
                  this.isSubmitted = false;
                } 
            },
            err => this.isSubmitted = this.isLoggedIn = false
        );
    }

    logout() {
      this.isLoggedIn = false;
      this.authService.logout();
    }
}
