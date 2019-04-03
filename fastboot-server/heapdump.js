const heapdump = require('heapdump');

module.exports = function (req, res) {
  let hdfile = '';
  heapdump.writeSnapshot((err, filename) => {
    hdfile = filename;
    console.log('Heap dump written to', filename);
  });

  res.status(200).send(`Heap dump saved: ${hdfile}`);
};
