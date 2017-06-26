import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User } from '../_model/user.model'; 
import { AlertService } from '../_service/alert.service';
import { UserService  } from '../_service/user.service';
import { AuthenticationUserService } from '../_service/authenticationUser.service';

@Component({
  selector: 'cp-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit{ 
    private user: User = new User();
    loading = false;
    registerForm: FormGroup;
    
    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private authenticationService: AuthenticationUserService,
        private fb: FormBuilder) { 
          this.createForm();
        }
        
    ngOnInit() {
        // reset login status
        this.authenticationService.logout(); 
    }

    /* Cadastrar */
    register(event){
      event.preventDefault();
       this.loading = true;
       this.user.category = "users";
       
       this.userService.create(this.user)
           .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
                
    }
    /* Formulario */
    createForm() {
      this.registerForm = this.fb.group({
            fullname: [null, Validators.required],
            username: [null, Validators.required],
            password: [null, Validators.compose( [Validators.required, Validators.minLength(6)] )]
        });
    }
}