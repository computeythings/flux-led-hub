var scanner = require('../app/scanner');

scanner.discover().on('scanComplete', (data) => {
  console.log(data);
})
