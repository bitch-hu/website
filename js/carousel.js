const KEY_CODES = {27: "Escape", 37: "ArrowLeft", 39: "ArrowRight"};

const getCarouselContainer = () => document.querySelector('#carousel-container');
const getCarouselItems = () => getCarouselContainer().querySelectorAll('.carousel-item:not(.carousel-ad)');
const getTitle = () => document.querySelector("#image-title");
const hideCarouselContainer = () => {
  getCarouselContainer().classList.add('hidden');
}
const makeTitleMatchImage = () => {
  const image = document.querySelector(".carousel-item.active img");
  const cs = getComputedStyle(image);
  const imageWidth = cs.getPropertyValue("width");
  const title = image.getAttribute("alt");
  const titleElement = getTitle();
  titleElement.style.width = imageWidth;
  titleElement.style.marginLeft = cs.marginLeft;
  titleElement.innerText = title;
}
// Index of the current image; while the ad is shown, of the image before it.
let activeIndex = 0;
const loadImage = (image) => {
  if (!image.getAttribute('src')) {
    image.onload = makeTitleMatchImage;
    image.src = image.getAttribute('data-src');
  }
}
const activate = (item) => {
  getCarouselContainer().querySelector('.carousel-item.active').classList.remove('active');
  item.classList.add('active');
  document.querySelector('#carousel').classList.toggle('ad-active', isAdActive());
  loadImage(item.querySelector('img'));
  makeTitleMatchImage();
}
const slideTo = (i) => {
  const items = getCarouselItems();
  activeIndex = (i + items.length) % items.length;
  activate(items[activeIndex]);
}
const isAdActive = () => carouselAd !== null && carouselAd.item.classList.contains('active');
const step = (direction) => {
  if (carouselAd !== null && !isAdActive() && carouselAd.shouldShow()) {
    activate(carouselAd.item);
  } else {
    slideTo(activeIndex + direction);
  }
}
const prev = () => step(-1);
const next = () => step(1);
const showCarousel = (i) => {
  getCarouselContainer().classList.remove('hidden');
  slideTo(i);
}
document.querySelector("#overlay").addEventListener("click", hideCarouselContainer);
document.querySelector(".carousel-control-prev").addEventListener("click", prev);
document.querySelector(".carousel-control-next").addEventListener("click", next);
document.addEventListener("keyup", (e) => {
  switch (e.key || KEY_CODES[e.keyCode]) {
    case "Escape":
      hideCarouselContainer();
      break;
    case "ArrowLeft":
      prev();
      break;
    case "ArrowRight":
      next();
  }
});
window.addEventListener("resize", () => {
  makeTitleMatchImage();
});
const enableThumbnails = () => {
  document.querySelector("#thumbnails").onclick = (e) => {
    const index = e.target.getAttribute("data-index");
    if (index !== null) {
      showCarousel(Number(index));
    }
  };
}
