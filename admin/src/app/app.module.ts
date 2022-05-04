import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { ProductsListComponent } from './shop/products-list/products-list.component';
import { ProductPageComponent } from './shop/product-page/product-page.component';
import { UserPageComponent } from './users/user-page/user-page.component';
import { ProjectsListComponent } from './projects/projects-list/projects-list.component';
import { ProjectPageComponent } from './projects/project-page/project-page.component';
import { PostsListComponent } from './blog/posts-list/posts-list.component';
import { PostPageComponent } from './blog/post-page/post-page.component';
import { ServicesListComponent } from './services/services-list/services-list.component';
import { ServicePageComponent } from './services/service-page/service-page.component';
import { AboutLayoutComponent } from './about/about-layout/about-layout.component';
import { HeadLayoutComponent } from './shared/components/layouts/head-layout/head-layout.component';
import { PageTitleComponent } from './shared/components/page-title/page-title.component';
import { SaveButtonComponent } from './shared/components/save-button/save-button.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { HypertextModalComponent } from './shared/components/modals/hypertext-modal/hypertext-modal.component';
import {TokenInterceptor} from './shared/classes/token.interceptor';
import { LoginPageComponent } from './login-page/login-page.component';
import { MultiSliderComponent } from './shared/components/multi-slider/multi-slider.component';
import { PartnersFormComponent } from './about/partners-form/partners-form.component';
import { WantDeleteComponent } from './shared/components/modals/want-delete/want-delete.component';
import { TableComponent } from './shared/components/table/table.component';
import { DatePipe } from '@angular/common';
import { HorizontalGalleryComponent } from './shared/components/horizontal-gallery/horizontal-gallery.component';
import { AddTagComponent } from './about/add-tag/add-tag.component';
import { SlidePageComponent } from './about/slide-page/slide-page.component';
import { ShopsListComponent } from './shop/shops-list/shops-list.component';
import { ShopPageComponent } from './shop/shop-page/shop-page.component';
import { CheckoutListComponent } from './services/checkout-list/checkout-list.component';
import { CheckoutPageComponent } from './services/checkout-page/checkout-page.component';
import { OrdersListComponent } from './shop/orders-list/orders-list.component';
import { OrderPageComponent } from './shop/order-page/order-page.component';
import { StaffsListComponent } from './users/staffs-list/staffs-list.component';
import { StaffPageComponent } from './users/staff-page/staff-page.component';
import { UsersLayoutComponent } from './users/users-layout/users-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UsersListComponent,
    ProductsListComponent,
    ProductPageComponent,
    UserPageComponent,
    ProjectsListComponent,
    ProjectPageComponent,
    PostsListComponent,
    PostPageComponent,
    ServicesListComponent,
    ServicePageComponent,
    AboutLayoutComponent,
    HeadLayoutComponent,
    PageTitleComponent,
    SaveButtonComponent,
    LoaderComponent,
    HypertextModalComponent,
    LoginPageComponent,
    MultiSliderComponent,
    PartnersFormComponent,
    WantDeleteComponent,
    TableComponent,
    HorizontalGalleryComponent,
    AddTagComponent,
    SlidePageComponent,
    ShopsListComponent,
    ShopPageComponent,
    CheckoutListComponent,
    CheckoutPageComponent,
    OrdersListComponent,
    OrderPageComponent,
    StaffsListComponent,
    StaffPageComponent,
    UsersLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
