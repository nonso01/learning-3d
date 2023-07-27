const [w, d, log] = [window, document, console.log];

export function dq(x = "") {
  return d.querySelector(x);
}

export function len(e) {
  if (e instanceof Array || typeof e === "string") return e.length;
  try {
    void 0;
  } catch (e) {
    console.warn(e);
  }
}
