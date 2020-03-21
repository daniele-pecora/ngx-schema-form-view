import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SchemaFormModule} from 'ngx-schema-form';
import {UIFormViewModule} from '../../dist/ngx-schema-form-view';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
    , FormsModule
    , HttpClientModule
    , ReactiveFormsModule
    , SchemaFormModule.forRoot()
    , UIFormViewModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
