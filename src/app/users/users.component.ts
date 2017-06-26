import { Component, NgModule, OnInit } from '@angular/core';

import { User } from '../_model/user.model';
import { UserService } from '../_service/user.service';

@Component({
  selector: 'cp-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
    currentUser: User;
    users: User[] = [];

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    deleteUser(id: number) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
}