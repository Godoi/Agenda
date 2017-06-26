import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Calendar } from '../_model/calendar.model';

@Injectable()
export class CalendarService {
    constructor(private http: Http) { }

    getAll() {
        return this.http.get('/api/commitment', this.jwt()).map((response: Response) => response.json());
    }

    create(calendar: Calendar) {
        return this.http.post('/api/commitment', calendar, this.jwt()).map((response: Response) => response.json());
    }

    toEdit(calendar: Calendar,id: number){
        return this.http.put('/api/editCommitment/' + id, calendar, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {        
        return this.http.delete('/api/commitment/' + id, this.jwt()).map((response: Response) => response.json());
    }

    private jwt() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}