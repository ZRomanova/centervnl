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
import { StaffsListComponent } from './users/staffs-list/staffs-list.component';
import { UsersLayoutComponent } from './users/users-layout/users-layout.component';
import { AdminGuard } from './shared/classes/admin.guard'
import { LoginPageComponent } from './login-page/login-page.component';
import { StaffPageComponent } from './users/staff-page/staff-page.component';
import { PartnersFormComponent } from './about/partners-form/partners-form.component';
import { PostPageComponent } from './blog/post-page/post-page.component';
import { ServicePageComponent } from './services/service-page/service-page.component';
import { SlidePageComponent } from './about/slide-page/slide-page.component'
import { ProductPageComponent } from './shop/product-page/product-page.component';
import { ShopsListComponent } from './shop/shops-list/shops-list.component';
import { OrdersListComponent } from './shop/orders-list/orders-list.component';
import { OrderPageComponent } from './shop/order-page/order-page.component';
import { UserPageComponent } from './users/user-page/user-page.component';
import { CheckoutListComponent } from './services/checkout-list/checkout-list.component';
import { CheckoutPageComponent } from './services/checkout-page/checkout-page.component';
import { ReportsListComponent } from './reports/reports-list/reports-list.component';
import { ReportPageComponent } from './reports/report-page/report-page.component';
import { DocsFormComponent } from './about/docs-form/docs-form.component';
import { ProgramPageComponent } from './projects/program-page/program-page.component';
import { ProgramsListComponent } from './projects/programs-list/programs-list.component';
import { ProjectsLayoutComponent } from './projects/projects-layout/projects-layout.component';
import { WinsListComponent } from './users/wins-list/wins-list.component';
import { WinPageComponent } from './users/win-page/win-page.component';
import { BlogLayoutComponent } from './blog/blog-layout/blog-layout.component';
import { SmiListComponent } from './blog/smi-list/smi-list.component';
import { SmiPageComponent } from './blog/smi-page/smi-page.component';
import { LibraryListComponent } from './library/library-list/library-list.component';
import { LibraryPageComponent } from './library/library-page/library-page.component';
import { LibraryLayoutComponent } from './library/library-layout/library-layout.component';
import { ParentsListComponent } from './library/parents-list/parents-list.component';
import { ParentsPageComponent } from './library/parents-page/parents-page.component';
import { ShopPageComponent } from './shop/shop-page/shop-page.component';
import { FormsListComponent } from './users/forms-list/forms-list.component';
import { FormsPageComponent } from './users/forms-page/forms-page.component';

const routes: Routes = [
  {
    path: '', component: HeaderComponent, canActivate: [AdminGuard], children: [
      {path: '', redirectTo: '/general', pathMatch: 'full'},
      {path: 'products', component: ShopsListComponent, children: [
        {path: ':shop', component: ProductsListComponent},
        {path: '', component: OrdersListComponent},
      ]},
      {path: 'shop/:id', component: ShopPageComponent},
      {path: 'product/:id', component: ProductPageComponent},
      {path: 'orders/:id', component: OrderPageComponent},
      {path: 'users', component: UsersLayoutComponent, children: [
        {path: '', component: UsersListComponent},
        {path: 'team', component: StaffsListComponent},
        {path: 'wins', component: WinsListComponent},
        {path: 'forms', component: FormsListComponent},
      ]},
      {path: 'users/:id', component: UserPageComponent},
      {path: 'users/forms/:id', component: FormsPageComponent},
      {path: 'users/team/:id', component: StaffPageComponent},
      {path: 'users/wins/:id', component: WinPageComponent},
      {path: 'users/forms/:id', component: FormsPageComponent},
      {path: 'programs', component: ProjectsLayoutComponent, children: [
        {path: '', component: ProgramsListComponent},
        {path: 'projects', component: ProjectsListComponent},
      ]},
      {path: 'programs/:id', component: ProgramPageComponent},
      {path: 'programs/projects/:id', component: ProjectPageComponent},
      {path: 'blog', component: BlogLayoutComponent, children: [
        {path: '', component: PostsListComponent},
        {path: 'smi', component: SmiListComponent},
      ]},
      {path: 'blog/:id', component: PostPageComponent},
      {path: 'blog/smi/:id', component: SmiPageComponent},
      {path: 'services', component: ServicesListComponent},
      {path: 'services/checkouts/:id', component: CheckoutListComponent},
      {path: 'services/checkout/:id', component: CheckoutPageComponent},
      {path: 'services/:id', component: ServicePageComponent},
      {path: 'general', component: AboutLayoutComponent},
      {path: 'partner', component: PartnersFormComponent},
      {path: 'partner/:id', component: PartnersFormComponent},
      {path: 'documents/:id', component: DocsFormComponent},
      {path: 'slide', component: SlidePageComponent},
      {path: 'slide/:id', component: SlidePageComponent},
      {path: 'reports', component: ReportsListComponent},
      {path: 'reports/:id', component: ReportPageComponent},
      {path: 'library', component: LibraryLayoutComponent, children: [
        {path: '', component: LibraryListComponent},
        {path: 'parents', component: ParentsListComponent},
      ]},
      {path: 'library/:id', component: LibraryPageComponent},
      {path: 'library/parents/:id', component: ParentsPageComponent},
    ],
  },
  {path: 'login', component: LoginPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
