/// Speed of the vertical scrolling in viewport-height percent per second
const SPEED_VH_PER_S = 5;
/// Gap between vertically scrolling images in viewport-height percent
const IMAGE_GAP_VH = 25;
/// The maximum degrees the images can rotate in one direction
const MAX_ROTATION_DEG = 20;
/// In how many steps the images cover [-MAX_ROTATION_DEG, MAX_ROTATION_DEG] range
const ROTATION_STEPS = 2;
/// How often does the images progress in the rotation
const STEPS_PER_SECOND = 2;

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

function computeRotation(now, steps_ahead) {
  let ms_per_step = (1 / STEPS_PER_SECOND) * 1000;
  let steps_since_epoch = Math.floor(now / ms_per_step);
  let step = (steps_since_epoch + steps_ahead) % (2 * ROTATION_STEPS);
  let step_wrapped = step < ROTATION_STEPS ? step : 2 * ROTATION_STEPS - step;
  let degrees_per_step = (2 * MAX_ROTATION_DEG) / ROTATION_STEPS;
  return step_wrapped * degrees_per_step - MAX_ROTATION_DEG;
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

  IMAGES_LEFT.forEach((image, n) => {
    image.style["top"] = `${offsetCalculatorLeft(image.height)}px`;
    image.style["transform"] = `rotate(${computeRotation(now, n * 3)}deg)`;
    // TODO: uncover the images only right before they should appear the first time
  });

  let offsetCalculatorRight = getOffsetCalculator(
    seconds_elapsed,
    pixels_per_second,
    IMAGES_RIGHT.map((img) => img.height),
    image_gap
  );

  IMAGES_RIGHT.forEach((image, n) => {
    image.style["bottom"] = `${offsetCalculatorRight(image.height)}px`;
    image.style["transform"] = `rotate(${computeRotation(now, n * 3)}deg)`;
    // TODO: uncover the images only right before they should appear the first time
  });

  window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);
