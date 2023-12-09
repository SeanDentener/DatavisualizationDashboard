import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { NavigationEnd, Route, Router } from '@angular/router';
import { filter } from 'rxjs';


@Injectable()

export class Globals{

public currentView: string = '';
   
constructor() { }


}