import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router'
import {Observable, of, Subscription} from 'rxjs'
import {Injectable} from '@angular/core'
import {AuthService} from '../transport/auth.service'

@Injectable({
    providedIn: 'root'
  })
export class AdminGuard implements CanActivate, CanActivateChild {

    constructor(private auth: AuthService,
                private router: Router){}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (this.auth.isAdmin()) {
            return true
        } else {
            this.router.navigate(['/login'])
            return false
            
        }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.canActivate(route, state)
    }
}