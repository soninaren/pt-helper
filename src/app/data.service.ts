import { Injectable } from '@angular/core';
import { Constants } from './constants';
import { TreatmentList } from '../models/treatmentList';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Injectable()
export class DataService {
  private text: string[];
  private treatmentLists = [];
  constructor(private _http: Http
  ) {
  }

  private resolveTreatmentList() {
    for (var key in this.treatmentLists) {
      let resolvedList = [];
      this.treatmentLists[key].refListNames = this.resolveReferenceLists(key, resolvedList);
    }

    for (var key in this.treatmentLists) {
      this.treatmentLists[key].refListNames.forEach(element => {
        this.treatmentLists[element].exercises.forEach(e => {
          if (!this.treatmentLists[key].exercises.includes(e)) {
            this.treatmentLists[key].exercises.push(e);
          }
        })
      });
    }

    return this.treatmentLists;
  }



  private resolveReferenceLists(listName: string, universalList: string[]): string[] {
    if (this.treatmentLists[listName].refListNames.length == 0) {
      return universalList;
    }

    this.treatmentLists[listName].refListNames.forEach(element => {
      if (universalList.indexOf(element) < 0) {
        universalList.push(element);
        universalList.concat(this.resolveReferenceLists(element, universalList));
      }
    });
    return universalList;
  }

  public getResolvedTreatmentLists() {
    var url = location.href + "assets/sample.txt";
    return this._http.get(url).map(t => {
      this.text = t.text().split("\n");
      this.parseLines();
      return this.resolveTreatmentList();
    })
  }

  private parseLines() {
    let currentListName: string;
    this.text.forEach(line => {
      if (line.includes('#')) {
        currentListName = this.addTolist(line);
      } else if (line.length > 1 && currentListName) {
        this.treatmentLists[currentListName].exercises.push(line)
      }
    });
  }

  private addTolist(line: string): string {
    line = line.trim().toUpperCase();
    var i = 0;
    let treatmentListName: string;
    line.split(' ').forEach(word => {
      if (word.includes('#')) {
        var listName = (word.substr(1, word.length - 1));
        if (i == 0 && !this.treatmentLists[listName]) {
          this.treatmentLists[listName] = new TreatmentList;
          treatmentListName = listName;
        }

        if (i > 0) {
          this.treatmentLists[treatmentListName].refListNames.push(listName);
        }
        i++;
      }
    });
    return treatmentListName;
  }
}
