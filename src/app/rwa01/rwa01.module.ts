import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Rwa01PageRoutingModule } from './rwa01-routing.module';
import { Rwa01Page } from './rwa01.page';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Rwa01PageRoutingModule,ReactiveFormsModule,IonicSelectableModule
  ],
  declarations: [Rwa01Page]
})
export class Rwa01PageModule {}
