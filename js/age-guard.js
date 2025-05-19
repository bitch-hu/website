const cookieName = 'claimsToBeOver18';

const getCookie = () => {
  const name = cookieName + "=";
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trimStart();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }
  return "";
}

const unblur = () => document.querySelector("#thumbnails").classList.remove("blur");

const setCookie = () => {
  document.cookie = `${cookieName}=true;expires=86400;path=/;domain=bitch.hu;secure`;
  unblur();
}

if (getCookie() !== "true") {
  const modal = new bootstrap.Modal(document.querySelector("#ageModal"), {keyboard: false, backdrop: 'static'});
  modal.show();
} else {
  unblur();
}
