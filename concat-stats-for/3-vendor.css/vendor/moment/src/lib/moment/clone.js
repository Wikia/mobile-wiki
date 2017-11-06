if (typeof FastBoot === 'undefined') { import { Moment } from './constructor';

export function clone () {
    return new Moment(this);
}
 }