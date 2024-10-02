import {ParameterIF} from "../calculator/interfaces/parameter-if";

export interface StorageIf {
  "inuse": boolean,
  "params": ParameterIF | null
}
