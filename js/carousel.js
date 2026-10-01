const KEY_CODES = {27: "Escape", 37: "ArrowLeft", 39: "ArrowRight"};

const getCarouselContainer = () => document.querySelector('#carousel-container');
const getCarouselItems = () => getCarouselContainer().querySelectorAll('.carousel-item');
const getThumbnails = () => document.querySelectorAll("#thumbnails img");
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
const getActiveIndex = () => {
  const items = getCarouselItems();
  for (let i = 0; i < items.length; i++) {
    if (items[i].classList.contains('active')) {
      return i;
    }
  }
  return 0;
}
const slideTo = (i) => {
  const items = getCarouselItems();
  const next = (i + items.length) % items.length;
  items[getActiveIndex()].classList.remove('active');
  items[next].classList.add('active');
  makeTitleMatchImage();
}
const prev = () => slideTo(getActiveIndex() - 1);
const next = () => slideTo(getActiveIndex() + 1);
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
  Array.prototype.forEach.call(getThumbnails(), (img, key) => {
    img.onclick = () => showCarousel(key);
  });
}
