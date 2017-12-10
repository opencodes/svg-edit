import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditorComponent } from './editor/editor.component';

const route_config: Routes = [
    { path: '', pathMatch: 'full', component: DashboardComponent },
    { path: 'edit/:id', component : EditorComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(route_config)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRouter { }

