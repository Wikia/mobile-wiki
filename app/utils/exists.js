export default function exists(selector) {
  const el = document.querySelector(selector);
  return !!el;
}
