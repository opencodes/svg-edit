import { Component, OnInit } from '@angular/core';
export interface Project {
  id: number;
  name: string;
  owner: string;
  modified: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  projects: Project[];

  constructor() { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.projects = [
      {
        id: 1,
        name: 'project 1',
        owner: 'Me',
        modified: '10 Dec 2017'
      },
      {
        id: 2,
        name: 'project 1',
        owner: 'Me',
        modified: '10 Dec 2017'
      },
      {
        id: 3,
        name: 'project 1',
        owner: 'Me',
        modified: '10 Dec 2017'
      },
      {
        id: 4,
        name: 'project 1',
        owner: 'Me',
        modified: '10 Dec 2017'
      },
      {
        id: 5,
        name: 'project 1',
        owner: 'Me',
        modified: '10 Dec 2017'
      }
    ];
  }
}
