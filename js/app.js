// copied and pasted from https://www.javascripttutorial.net/web-apis/javascript-cookies/  in a highly professional manner
class DailyCookie {
  static get(name) {
    const cookieName = `${encodeURIComponent(name)}=`;
    const cookie = document.cookie;
    let value = null;

    const startIndex = cookie.indexOf(cookieName);
    if (startIndex > -1) {
      let endIndex = cookie.indexOf(';', startIndex);
      if (endIndex === -1) {
        endIndex = cookie.length;
      }
      value = decodeURIComponent(
        cookie.substring(startIndex + name.length, endIndex)
      );
    }
    return value;
  }

  static set(name, value, path, domain, secure) {
    let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=86400`;
    if (path) cookieText += `; path=${path}`;
    if (domain) cookieText += `; domain=${domain}`;
    if (secure) cookieText += `; secure`;
    document.cookie = cookieText;
  }
}

function ageGuard() {
  const dialog = document.querySelector("dialog");
  const thumbnails = document.querySelector(".thumbnails");
  if (DailyCookie.get(cookieName) != null) {
    thumbnails.classList.remove('blur');
    dialog.close();
  } else {
    dialog.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        e.preventDefault();
      }
    })
    dialog.showModal();
    thumbnails.classList.add('blur');
  }
}

function showOverlay() {
  document.querySelector('.overlay').classList.remove('hidden')
}

function hideOverlay() {
  document.querySelector('.overlay').classList.add('hidden');
}

function showImage(i) {
  showOverlay();
  const imgCount = document.querySelectorAll('.thumbnails img').length - 1;
  if (i < 0) {
    i = imgCount;
  }
  if (i > imgCount) {
    i = 0;
  }
  const image = document.querySelectorAll(".thumbnails img")[i];
  const container = document.querySelector(".slideshow-container");
  const largeImage = container.querySelector(".largeImage > img");
  const largeImageCaption = container.querySelector(".largeImage > div.text");
  largeImage.style.display = "none";
  largeImage.src = image.src.replace("thumbnails/", "");
  largeImage.alt = image.alt;
  largeImageCaption.innerHTML = image.alt;
  largeImage.style.display = "block";
  container.querySelector(".prev").onclick = () => {
    showImage(i - 1);
  };
  container.querySelector(".next").onclick = () => {
    showImage(i + 1);
  };
  container.classList.remove('hidden');
}

function hideImage() {
  slideShowContainer.classList.add('hidden');
  hideOverlay();
}

function setOver18Cookie() {
  DailyCookie.set(cookieName, true, '/', 'bitch.hu', true);
  ageGuard()
}

function getSlideShowContainer() {
  return document.querySelector(".slideshow-container");
}

const cookieName = 'claimsToBeOver18';
const slideShowContainer = getSlideShowContainer();
ageGuard();
document.querySelectorAll(".thumbnails img").forEach((img, key) => {
  img.title = img.alt;
  img.onclick = () => showImage(key);
});
document.querySelector(".overlay").addEventListener("click", function (_) {
  hideImage();
});
