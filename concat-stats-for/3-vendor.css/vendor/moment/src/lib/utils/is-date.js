if (typeof FastBoot === 'undefined') { export default function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}
 }