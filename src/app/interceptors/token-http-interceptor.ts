import { HttpInterceptorFn } from "@angular/common/http";
import { LoginResult } from "@interfaces/acount";

export const tokenHttpInterceptor: HttpInterceptorFn = (req, next) => {
    debugger
    const tokenString = sessionStorage.getItem("loggedInUser");
    const token: LoginResult = tokenString ? JSON.parse(tokenString) : null;
    console.log(req)
    if(token !== null)
    {
        req = req.clone({setHeaders:{'Authorization':'Bearer ' + token.token}});
        sessionStorage.setItem("isAuth", "true");
    }else
    {
        sessionStorage.setItem("isAuth", "false");
    }
    console.log(req)
    return next(req);
}