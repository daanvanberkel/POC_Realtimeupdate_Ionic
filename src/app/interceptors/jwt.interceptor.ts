import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginService} from '../services/login.service';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.loginService.getAccessToken();

    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(req).pipe(
      tap(
        event => {},
        error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.loginService.removeAccessToken();
              this.router.navigate(['/login']);
            }
          }
        }
      )
    );
  }
}
