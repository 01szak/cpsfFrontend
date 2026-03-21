import {BackendEntity} from './BackendEntity';
import {CamperPlaceType} from './CamperPlaceType';

export interface CamperPlaceForTable extends BackendEntity{
  id: number
  index: string
  type: CamperPlaceType
  price: number
}
