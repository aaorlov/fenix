import fs = require('fs');

export default function (stream: fs.WriteStream, interval = 1000): any {
  let buf: string[] = [];
  let timer: NodeJS.Timer = null;

  // flush function
  function flush() {
    timer = null;
    stream.write(buf.join(''));
    buf.length = 0;
  }

  // write function
  function write(str) {
    if (timer === null) {
      timer = setTimeout(flush, interval);
    }

    buf.push(str);
  }

  // return a minimal "stream"
  return { write: write };
}