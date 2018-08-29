export default function createSVG(iconName, className) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  const use = document.createElementNS(svgNS, 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${iconName}`);
  svg.setAttribute('role', 'img');
  svg.classList.add(className);
  svg.appendChild(use);
  return svg;
}
