import { Component,OnInit } from '@angular/core';

import { User } from '../_model/user.model';
import { UserService } from '../_service/user.service';

@Component({
  selector: 'cp-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    
    currentUser: User;
    users: User[] = [];

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
}