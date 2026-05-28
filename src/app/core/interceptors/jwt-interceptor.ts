import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const JwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Add the JWT as an authorization header
  const jwt = localStorage.getItem('jwt');

  const authReq = jwt
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    : req;

  return next(authReq);
}
