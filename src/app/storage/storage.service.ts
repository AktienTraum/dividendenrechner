import {Injectable} from '@angular/core';
import {StorageIf} from "./storage-if";
import {ParameterIF} from "../calculator/interfaces/parameter-if";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  SLOTS: string[] = ['dividendentraum-slot1', 'dividendentraum-slot2', 'dividendentraum-slot3', 'dividendentraum-slot4'];

  constructor() {
  }

  load() {
    let slot1Item = localStorage.getItem(this.SLOTS[0]);
    let slot1Params = null;
    if (slot1Item) {
      slot1Params = JSON.parse(slot1Item) as ParameterIF;
    }

    let slot2Item = localStorage.getItem(this.SLOTS[1]);
    let slot2Params = null;
    if (slot2Item) {
      slot2Params = JSON.parse(slot2Item) as ParameterIF;
    }

    let slot3Item = localStorage.getItem(this.SLOTS[2]);
    let slot3Params = null;
    if (slot3Item) {
      slot3Params = JSON.parse(slot3Item) as ParameterIF;
    }

    let slot4Item = localStorage.getItem(this.SLOTS[3]);
    let slot4Params = null;
    if (slot4Item) {
      slot4Params = JSON.parse(slot4Item) as ParameterIF;
    }

    return [
      {
        "inuse": !(slot1Params == null),
        "params": slot1Params
      },
      {
        "inuse": !(slot2Params == null),
        "params": slot2Params
      },
      {
        "inuse": !(slot3Params == null),
        "params": slot3Params
      },
      {
        "inuse": !(slot4Params == null),
        "params": slot4Params
      }] as StorageIf[];
  }

  save(id: number, params: ParameterIF) {
    let item = JSON.stringify(params);
    localStorage.setItem(this.SLOTS[id], item);
  }
}
