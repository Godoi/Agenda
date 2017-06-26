import {Component, Injectable, NgModule, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDatepickerConfig, NgbDateStruct, NgbDatepickerI18n, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { NgbDateFRParserFormatter } from "./ngb-date-fr-parser-formatter";

import { hours } from '../_data/hours.model';
import { Calendar } from '../_model/calendar.model';
import { User } from '../_model/user.model';

import { AlertService } from '../_service/alert.service';
import { CalendarService } from '../_service/calendar.service';
import { UserService } from '../_service/user.service';

const now = new Date();
const I18N_VALUES = {
  en: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  pt: {
    weekdays: ['Dom', '2º', '3º', '4º', '5º', '6º', 'Sáb'],
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  }
};

@Injectable()
export class I18n {
  language = 'pt';
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }
  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}

@Component({
  selector: 'calendar-component',
  templateUrl: './calendar-component.html',
  providers: [NgbDatepickerConfig,I18n,{provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}, {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}] 

})
export class NgbdDatepickerConfig implements OnInit {
  currentUser: User;
  users: User[] = []; 
  list: Calendar[] = [];
  hours = hours;
  today: string;  
  moth: number;  
  nowDay: number;
  nowMonth: number;
  nowYear: number;  

  private calendar: Calendar = new Calendar();
  calendarForm: FormGroup;

  model: NgbDateStruct = {day: now.getDate(), month: now.getMonth() + 1,year: now.getFullYear()};
  
      constructor(
          config: NgbDatepickerConfig,
          private _i18n: I18n, 
          private fb: FormBuilder,
          private calendarService: CalendarService,
          private alertService: AlertService,
          private userService: UserService) {
      
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          this.createForm();

          this._i18n.language = 'pt';

          // customize default values of datepickers used by this component tree
          config.minDate = {year: 1900, month: 1, day: 1};
          config.maxDate = {year: 2099, month: 12, day: 31};    

          // days that don't belong to current month are not visible
          config.outsideDays = 'hidden';

          // weekends are disabled
          config.markDisabled = (date: NgbDateStruct) => {
            const d = new Date(date.year, date.month - 1, date.day);
            return d.getDay() === 0 || d.getDay() === 6;
          };  
      }

      ngOnInit() {
            this.moth = now.getMonth() + 1;
            this.today = now.getDate()+'/'+ this.moth +'/'+now.getFullYear();
            this.nowDay = now.getDate();
            this.nowMonth = this.moth;
            this.nowYear= now.getFullYear(); 
                       
            this.loadAllCommitment(); 
     
      }
   
      //Agendar
      Register(event){
          event.preventDefault();     
          this.calendar.username = this.currentUser.fullname;
          this.calendar.day = this.model.day;
          this.calendar.month = this.model.month;
          this.calendar.year = this.model.year;
          this.calendar.category = "commitment";
          this.calendar.date = this.model.day+'/'+this.model.month+'/'+this.model.year;

          this.calendarService
              .create(this.calendar)
              .subscribe(
                    data => {
                        this.alertService.success('Agendado o compromisso.', true);    
                        this.loadAllCommitment();               
                    },
                    error => {
                        this.alertService.error(error);                        
                    });                
       }

       /* Edicao */
       toEdit(id: number){
            
       }

      /* Delete */
      deleteCommitment(id: number) { 
          let isConfirmed = confirm("Deseja excluir o agendamento ?");
          if(isConfirmed){
            this.calendarService.delete(id).subscribe(() => { this.loadAllCommitment() });
          }else{
            return false;
          }
      }
  
      /* Formulario */
      createForm() {
        this.calendarForm = this.fb.group({      
              dp: [null, Validators.required],
              hour: [null, Validators.required],
              commitment: [null, Validators.required]
          });
      }

      /* load Compromisso */
      private loadAllCommitment() {
          this.calendarService.getAll().subscribe(list => { this.list = list;});
      }
}