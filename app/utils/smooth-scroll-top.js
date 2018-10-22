const x = 20;

export default function smoothScrollTop(onEnd) {
  if (window.scrollY > 1) {
    window.scrollTo(0, window.scrollY / 1.2);
    setTimeout(smoothScrollTop.bind(null, onEnd), x);
  } else {
    window.scrollTo(0, 0);
    onEnd();
  }
}
