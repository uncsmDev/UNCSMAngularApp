import { HttpInterceptorFn } from "@angular/common/http";
import { LoginResult } from "@interfaces/acount";

export const tokenHttpInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenString = sessionStorage.getItem("loggedInUser");
    const token: LoginResult = tokenString ? JSON.parse(tokenString) : null;

    if(token !== null)
    {
        req = req.clone({
            setHeaders:{
                'Authorization':'Bearer ' + token.token
            }
        });
        sessionStorage.setItem("isAuth", "true");
    }else
    {
        req = req.clone({
            setHeaders:{
               'Authorization':'Bearer ' + "ninguno"
            }
        });
        sessionStorage.setItem("isAuth", "false");
    }
    
    return next(req);
}