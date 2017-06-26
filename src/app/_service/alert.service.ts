import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;
 
    constructor(private router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {               
                    this.keepAfterNavigationChange = false;
                } else {                  
                    this.subject.next();
                }
            }
        });
    }
 
    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
        this.hideMessage();
    }
 
    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: message });
       this.hideMessage();
    }
 
    getMessage(): Observable<any> {
         return this.subject.asObservable();
    }

    private hideMessage(){
        setTimeout(() => { 
            this.subject.next();
        }, 3000);
    }
}