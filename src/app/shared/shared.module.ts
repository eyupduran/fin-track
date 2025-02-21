import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabMenuModule } from 'primeng/tabmenu';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const primeNgModules = [
  ButtonModule,
  CardModule,
  MenubarModule,
  InputSwitchModule,
  TooltipModule,
  ProgressSpinnerModule,
  TabMenuModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ...primeNgModules
  ],
  exports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ...primeNgModules
  ]
})
export class SharedModule { }
