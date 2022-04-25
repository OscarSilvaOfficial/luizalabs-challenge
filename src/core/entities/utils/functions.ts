export function getArraysIntersection(a1, a2) {
  return a1.filter(function (n) {
    return a2.indexOf(n) !== -1;
  });
}
