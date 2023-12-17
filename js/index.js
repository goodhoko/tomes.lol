const SPEED_VH_PER_S = 10;
const IMAGE_GAP_VH = 25;

const IMAGES_LEFT = Array.from(
  document.getElementById("carousel-left").childNodes
).filter((node) => node.nodeName == "IMG");

const IMAGES_RIGHT = Array.from(
  document.getElementById("carousel-right").childNodes
).filter((node) => node.nodeName == "IMG");

function computeClientHeight() {
  return Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
}

let cachedClientHeight = computeClientHeight();
window.addEventListener("resize", () => {
  cachedClientHeight = computeClientHeight();
});

function getOffsetCalculator(
  seconds_elapsed,
  pixels_per_second,
  image_sizes,
  image_gap
) {
  const total_image_size = image_sizes.reduce((acc, size) => acc + size, 0);
  const max_image_size = image_sizes.reduce(
    (max, size) => Math.max(max, size),
    0
  );
  const carousel_size = total_image_size + image_gap * image_sizes.length;
  const base_position = Math.floor(
    (seconds_elapsed * pixels_per_second) % carousel_size
  );

  let combined_size = 0;
  let n = 0;
  return function (size) {
    const position =
      ((base_position + n * image_gap + combined_size) % carousel_size) -
      max_image_size;

    combined_size += size;
    n += 1;

    return position;
  };
}

const start = Date.now();
function draw() {
  const now = Date.now();
  const seconds_elapsed = (now - start) / 1000;
  const pixels_per_second = (SPEED_VH_PER_S / 100) * cachedClientHeight;
  const image_gap = (cachedClientHeight / 100) * IMAGE_GAP_VH;

  let offsetCalculatorLeft = getOffsetCalculator(
    seconds_elapsed,
    pixels_per_second,
    IMAGES_LEFT.map((img) => img.height),
    image_gap
  );

  IMAGES_LEFT.forEach((image) => {
    image.style["top"] = `${offsetCalculatorLeft(image.height)}px`;
    // TODO: uncover the images only right before they should appear the first time
  });

  let offsetCalculatorRight = getOffsetCalculator(
    seconds_elapsed,
    pixels_per_second,
    IMAGES_RIGHT.map((img) => img.height),
    image_gap
  );

  IMAGES_RIGHT.forEach((image) => {
    image.style["bottom"] = `${offsetCalculatorRight(image.height)}px`;
    // TODO: uncover the images only right before they should appear the first time
  });

  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);
