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

const routes: Routes = [
  {
    path: '', component: HeaderComponent, children: [
      // {path: '', redirectTo: '/general', pathMatch: 'full'},
      {path: 'shop', component: ProductsListComponent},
      {path: 'users', component: UsersListComponent},
      {path: 'projects', component: ProjectsListComponent},
      {path: 'blog', component: PostsListComponent},
      {path: 'services', component: ServicesListComponent},
      {path: 'general', component: AboutLayoutComponent},
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
