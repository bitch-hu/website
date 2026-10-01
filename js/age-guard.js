const cookieName = 'claimsToBeOver18';

const isAgeConfirmed = () => document.documentElement.classList.contains("age-confirmed");

const setCookie = () => {
  document.cookie = `${cookieName}=true;max-age=86400;path=/;domain=bitch.hu;secure`;
  document.documentElement.classList.add("age-confirmed");
  enableThumbnails();
}

if (isAgeConfirmed()) {
  enableThumbnails();
}
