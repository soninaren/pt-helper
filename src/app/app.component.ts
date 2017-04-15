import { Component } from '@angular/core';
import { DataService } from './data.service';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService]
})

export class AppComponent {
  keys: string[] = [];
  resolvedList: any[];

  constructor(private dataService: DataService) {
    this.dataService.getResolvedTreatmentLists().subscribe(t => {
      for (var key in t) {
        this.keys.push(key);
      }
      this.resolvedList = t;
    })
  }

}
