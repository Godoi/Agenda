import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationCalendarService {
    constructor(private http: Http) { }

    validation(username: string, day: number, month: number, year: number, hour: string) {
       
        return this.http.post('/api/validation', JSON.stringify({ username: username, day: day,  month: month, year: year, hour: hour}))
            .map((response: Response) => {               
                let commitment = response.json();
                if (commitment && commitment.token) {                   
                    localStorage.setItem('currentUser', JSON.stringify(commitment));
                }
            });
    }

}