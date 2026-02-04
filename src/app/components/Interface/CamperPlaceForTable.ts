import {BackendEntity} from './BackendEntity';

export interface CamperPlaceForTable extends BackendEntity{
  id: number
  index: string
  type: string
  price: number
}
