import { Component } from '@angular/core';
import { Globals } from '../providers/globals.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public globals: Globals) { }

  public   showThisComponent(theComponent:string) {
    this.globals.currentView = theComponent;
  }

}
