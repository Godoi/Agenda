import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from '../_model/user.model'; 
import { AlertService } from '../_service/alert.service';
import { AuthenticationUserService } from '../_service/authenticationUser.service';

@Component({
  selector: 'cp-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
    
    loading = false;
    returnUrl: string;
    loginForm: FormGroup;
    private user: User = new User();
     
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationUserService: AuthenticationUserService,
        private fb: FormBuilder,
        private alertService: AlertService) {
          this.createForm();
         }
 
    ngOnInit() {
        // reset login status
        this.authenticationUserService.logout(); 
        // get return url 
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/calendar';
    }
 
    login() {
        this.loading = true;
        
        this.authenticationUserService.login(this.user.username, this.user.password, this.user.company)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                    console.log(this.returnUrl);
                },
                error => {
                    this.alertService.error(error);       
                    this.loading = false;
                });
    }

    /* Formulario */
    createForm() {
      this.loginForm = this.fb.group({      
            username: [null, Validators.required],
            password: [null, Validators.compose( [Validators.required, Validators.minLength(6)] )]
        });
    }
}
