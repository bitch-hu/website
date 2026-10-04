const THUMBNAIL_COLUMNS = 6;

// {item, link, shouldShow, href} when the gallery has an ad, see renderAd.
let carouselAd = null;

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

const createColumns = () => {
  const thumbnails = document.querySelector("#thumbnails");
  const columns = [];
  for (let c = 0; c < THUMBNAIL_COLUMNS; c++) {
    const column = document.createElement("div");
    column.className = "col-xl-2 col-lg-3 col-md-4 col-sm-6 p-1";
    thumbnails.appendChild(column);
    columns.push(column);
  }
  return columns;
}

// Splits heights, in order, into `count` runs with sums as equal as possible
// (least sum of squared run sums). Returns the start index of each run plus the end.
const partition = (heights, count) => {
  const prefix = [0];
  heights.forEach((h, i) => prefix.push(prefix[i] + h));
  const n = heights.length;
  let cost = prefix.map((sum) => sum * sum);
  const cuts = [];
  for (let c = 1; c < count; c++) {
    const nextCost = [0];
    const cut = [0];
    for (let i = 1; i <= n; i++) {
      nextCost[i] = Infinity;
      for (let j = 0; j <= i; j++) {
        const run = prefix[i] - prefix[j];
        if (cost[j] + run * run < nextCost[i]) {
          nextCost[i] = cost[j] + run * run;
          cut[i] = j;
        }
      }
    }
    cost = nextCost;
    cuts.push(cut);
  }
  const bounds = [n];
  for (let c = count - 2; c >= 0; c--) {
    bounds.unshift(cuts[c][bounds[0]]);
  }
  bounds.unshift(0);
  return bounds;
}

// Keeps array order, column by column, with column heights as equal as possible.
const placeThumbnails = (thumbnails) => {
  const columns = createColumns();
  const heights = thumbnails.map((img) => img.naturalWidth ? img.naturalHeight / img.naturalWidth : 0);
  const bounds = partition(heights, THUMBNAIL_COLUMNS);
  columns.forEach((column, c) => {
    thumbnails.slice(bounds[c], bounds[c + 1]).forEach((img) => column.appendChild(img));
  });
}

// Placement needs the thumbnails' heights, so wait until all of them are loaded.
const renderThumbnails = (folder, images) => {
  let pending = images.length;
  const thumbnails = images.map((image, i) => {
    const img = createImage("w-100 shadow-1-strong rounded mb-2", "src", `${folder}/thumbnails/${image.file}`, image.alt);
    img.setAttribute("data-index", i);
    img.onload = img.onerror = () => {
      if (--pending === 0) {
        placeThumbnails(thumbnails);
      }
    };
    return img;
  });
}

// ad: {file, alt, href, shouldShow}; shouldShow() decides on each carousel step whether the ad comes next,
// href() each time the ad is shown where it leads.
const renderAd = (ad) => {
  const link = document.createElement("a");
  link.className = "d-block";
  link.appendChild(createImage("d-block mw-100", "data-src", ad.file, ad.alt));
  const item = document.createElement("div");
  item.className = "carousel-item carousel-ad";
  item.appendChild(link);
  document.querySelector("#carousel .carousel-inner").insertBefore(item, document.querySelector("#image-title"));
  carouselAd = {item: item, link: link, shouldShow: ad.shouldShow, href: ad.href};
}

const renderGallery = (folder, images, ad) => {
  renderCarousel(folder, images);
  renderThumbnails(folder, images);
  if (ad) {
    renderAd(ad);
  }
}
