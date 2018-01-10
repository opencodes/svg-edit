import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';

function _window() {
  // return the global native browser window object
  return window;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  isSidebar: Boolean = false;
  constructor() { }

  ngOnInit() {
    this.loadScript();
  }

  switchSidebar(state?) {

    if (state) {
      this.isSidebar = !!state;
    } else {
      this.isSidebar = !this.isSidebar;
    }
  }

  public loadScript() {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = '../../assets/js/graph-creator.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

}
