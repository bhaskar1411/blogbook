import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogCreateComponent } from './blog/blog-create/blog-create.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'create', component: BlogCreateComponent, canActivate: [AuthGuard]},
  {path: 'list', component: BlogListComponent, canActivate: [AuthGuard]},
  {path: 'edit/:blogId', component: BlogCreateComponent, canActivate: [AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
