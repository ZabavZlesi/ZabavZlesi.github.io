setInterval(() => {
  try {
    update();
  } catch (err) {
    console.log(err)
  }
}, updateTime);

setInterval(() => {
  if (main.childElementCount > 1000) {
    console.error("too many elements to draw: "+main.childElementCount)
  }
  if (clear) {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
  }
  try {
    draw();
  } catch (err) {
    console.log(err)
  }
}, drawTime);