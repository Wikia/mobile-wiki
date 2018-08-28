try {
 if (localStorage.getItem('hasRubikFont')) {
  document.body.classList.add('rubik');
 } else {
  document.fonts.ready.then(function () {
   document.body.classList.add('rubik');
   try {
    localStorage.setItem('hasRubikFont', 'true');
   } catch (e) {}
  });
 }
} catch (e) {
 document.body.classList.add('rubik');
}
