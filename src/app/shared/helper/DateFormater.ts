import moment, {Moment} from 'moment';

export type DateParams = {year: number, month: number, day: number}
export enum DateDelimiter {
  DASH = '-',
  DOT = '.',
  SPACE = ' ',
}
export class DateFormater {

  static YYYYMMDD(date: string | Date | DateParams, delimiter: DateDelimiter): string {
    return this.MOMENT(date).format(`YYYY${delimiter}MM${delimiter}DD`);
  }

  static DDMMYYYY(date: string | Date | DateParams, delimiter: DateDelimiter): string {
    return this.MOMENT(date).format(`DD${delimiter}MM${delimiter}YYYY`);
  }

  static MOMENT(date: string | Date | DateParams): Moment {
    if (date instanceof Date) {
      return moment({year: date.getFullYear(), month: date.getMonth(), day: date.getDate()});
    }
    if (typeof date !== 'string' &&'year' in date && 'month' in date && 'day' in date) {
      return moment({year: date.year, month: date.month, day: date.day});
    }
    return moment(date);
  }

}
