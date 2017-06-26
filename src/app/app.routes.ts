import{RouterModule, Routes} from '@angular/router';
import{LoginComponent} from './login/login.component';
import{UsersComponent} from './users/users.component';
import{RegisterComponent} from './register/register.component';
import{NgbdDatepickerConfig} from './calendar/calendar-component';
import{AuthGuard} from './_guards/auth.guard';

const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
    {path: 'calendar', component: NgbdDatepickerConfig, canActivate: [AuthGuard]},
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);