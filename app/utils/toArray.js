export default function toArray(input) {
  if (!input || typeof input.length !== 'number') {
    return [];
  }
  return Array.prototype.slice.call(input);
}
