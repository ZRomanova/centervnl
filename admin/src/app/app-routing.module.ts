import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutLayoutComponent } from './about/about-layout/about-layout.component';
import { PostsListComponent } from './blog/posts-list/posts-list.component';
import { HeaderComponent } from './header/header.component';
import { ProjectPageComponent } from './projects/project-page/project-page.component';
import { ProjectsListComponent } from './projects/projects-list/projects-list.component';
import { ServicesListComponent } from './services/services-list/services-list.component';
import { ProductsListComponent } from './shop/products-list/products-list.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import {AdminGuard} from './shared/classes/admin.guard'
import { LoginPageComponent } from './login-page/login-page.component';
import { StaffFormComponent } from './about/staff-form/staff-form.component';
import { PartnersFormComponent } from './about/partners-form/partners-form.component';
import { PostPageComponent } from './blog/post-page/post-page.component';
import { ServicePageComponent } from './services/service-page/service-page.component';
import {SlidePageComponent} from './about/slide-page/slide-page.component'

const routes: Routes = [
  {
    path: '', component: HeaderComponent, canActivate: [AdminGuard], children: [
      {path: '', redirectTo: '/general', pathMatch: 'full'},
      {path: 'shop', component: ProductsListComponent},
      {path: 'users', component: UsersListComponent},
      {path: 'projects', component: ProjectsListComponent},
      {path: 'projects/new', component: ProjectPageComponent},
      {path: 'projects/:id', component: ProjectPageComponent},
      {path: 'blog', component: PostsListComponent},
      {path: 'blog/new', component: PostPageComponent},
      {path: 'blog/:id', component: PostPageComponent},
      {path: 'services', component: ServicesListComponent},
      {path: 'services/new', component: ServicePageComponent},
      {path: 'services/:id', component: ServicePageComponent},
      {path: 'general', component: AboutLayoutComponent},
      {path: 'staff', component: StaffFormComponent},
      {path: 'staff/:id', component: StaffFormComponent},
      {path: 'partner', component: PartnersFormComponent},
      {path: 'partner/:id', component: PartnersFormComponent},
      {path: 'slide', component: SlidePageComponent},
      {path: 'slide/:id', component: SlidePageComponent},
    ],
  },
  {path: 'login', component: LoginPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
