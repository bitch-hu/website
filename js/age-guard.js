const cookieName = 'claimsToBeOver18';

const getCookie = () => {
  const name = cookieName + "=";
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }
  return "";
}

const getAgeModal = () => document.querySelector("#ageModal");

const unblur = () => document.querySelector("#thumbnails").classList.remove("blur");

const showAgeModal = () => {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop show";
  document.body.appendChild(backdrop);
  document.body.classList.add("modal-open");
  getAgeModal().style.display = "block";
  getAgeModal().classList.add("show");
}

const hideAgeModal = () => {
  getAgeModal().classList.remove("show");
  getAgeModal().style.display = "";
  document.body.classList.remove("modal-open");
  document.body.removeChild(document.querySelector(".modal-backdrop"));
}

const setCookie = () => {
  document.cookie = `${cookieName}=true;max-age=86400;path=/;domain=bitch.hu;secure`;
  hideAgeModal();
  unblur();
}

if (getCookie() !== "true") {
  showAgeModal();
} else {
  unblur();
}
