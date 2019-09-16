import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        MatExpansionModule,
        MatPaginatorModule,
        MatProgressSpinnerModule
} from '@angular/material';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlogCreateComponent } from './blog/blog-create/blog-create.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { SigninComponent } from './auth/signin/signin.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './auth/auth-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    BlogCreateComponent,
    BlogListComponent,
    HeaderComponent,
    LoginComponent,
    SigninComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
