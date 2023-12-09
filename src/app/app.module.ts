import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import {Globals} from './providers/globals.service'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DataManager } from './providers/datamanager';
import { ConfigService } from './providers/config.service';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { Map1Component } from './map1/map1.component';
import { BarComponent } from './bar/bar.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider'; 





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    MainComponent,
    Map1Component,
    BarComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    FormsModule
    
  ],
  providers: [{
    provide: APP_INITIALIZER,
    multi: true,
    deps: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return () => {
        return configService.loadAppConfig();
      };
    }
  },
  {
    provide: Globals
  },
{provide: DataManager}],
  bootstrap: [AppComponent]
})
export class AppModule { }
