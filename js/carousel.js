const getCarouselContainer = () => document.querySelector('#carousel-container');
const getCarousel = () => {
  const carouselElement = getCarouselContainer().querySelector('.carousel');
  return bootstrap.Carousel.getOrCreateInstance(carouselElement);
}
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
const showCarousel = (i) => {
  getCarouselContainer().classList.remove('hidden');
  getCarousel().to(i);
  makeTitleMatchImage();
}
document.querySelector("#overlay").addEventListener("click", function (_) {
  hideCarouselContainer();
});
getCarouselContainer().addEventListener("slide.bs.carousel", function (_) {
  getTitle().classList.add("hidden");
});
getCarouselContainer().addEventListener("slid.bs.carousel", function (_) {
  makeTitleMatchImage();
  getTitle().classList.remove("hidden");
});
document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "Escape":
      hideCarouselContainer();
      break;
    case "ArrowLeft":
      getCarousel().prev();
      break;
    case "ArrowRight":
      getCarousel().next();
  }
});
window.addEventListener("resize", () => {
  makeTitleMatchImage();
});
getThumbnails().forEach((img, key) => {
  img.onclick = () => showCarousel(key);
});
