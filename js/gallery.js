const THUMBNAIL_COLUMNS = 6;

const createImage = (className, attribute, src, alt) => {
  const img = document.createElement("img");
  img.className = className;
  img.setAttribute(attribute, src);
  img.alt = alt;
  return img;
}

const renderCarousel = (folder, images) => {
  const inner = document.querySelector("#carousel .carousel-inner");
  const title = document.querySelector("#image-title");
  images.forEach((image, i) => {
    const item = document.createElement("div");
    item.className = i === 0 ? "carousel-item active" : "carousel-item";
    item.appendChild(createImage("d-block mw-100", "data-src", `${folder}/${image.file}`, image.alt));
    inner.insertBefore(item, title);
  });
}

const renderThumbnails = (folder, images) => {
  const thumbnails = document.querySelector("#thumbnails");
  for (let c = 0; c < THUMBNAIL_COLUMNS; c++) {
    const column = document.createElement("div");
    column.className = "col-xl-2 col-lg-3 col-md-4 col-sm-6 p-1";
    const start = Math.round(c * images.length / THUMBNAIL_COLUMNS);
    const end = Math.round((c + 1) * images.length / THUMBNAIL_COLUMNS);
    images.slice(start, end).forEach((image) => {
      column.appendChild(createImage("w-100 shadow-1-strong rounded mb-2", "src", `${folder}/thumbnails/${image.file}`, image.alt));
    });
    thumbnails.appendChild(column);
  }
}

const renderGallery = (folder, images) => {
  renderCarousel(folder, images);
  renderThumbnails(folder, images);
}
