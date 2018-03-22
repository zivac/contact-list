import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MockHttpClient } from './services/mock-http.service';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from './services/storage.service';
import { AvatarComponent } from './components/avatar/avatar.component';
import { SelectComponent } from './components/select/select.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    ApiService, 
    MockHttpClient, 
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
