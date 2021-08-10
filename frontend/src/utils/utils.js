import moment from "moment";

export const API_HOST = process.env.REACT_APP_BACKEND_API_ENDPOINT_URL;

let _csrfToken = null;

export async function getCsrfToken() {
  if (_csrfToken === null) {
    const response = await fetch(`${API_HOST}/csrf/`, {
      credentials: "include",
    });
    const data = await response.json();
    _csrfToken = data.csrfToken;
  }
  return _csrfToken;
}

export async function testRequest(method) {
  const response = await fetch(`${API_HOST}/ping/`, {
    method: method,
    headers: method === "POST" ? {"X-CSRFToken": await getCsrfToken()} : {},
    credentials: "include",
  });
  const data = await response.json();
  return data.result;
}

export function getCookie(name) {
  let cookieArray = document.cookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookieKeyValuePair = cookieArray[i].split('=');
    if (name === cookieKeyValuePair[0].trim()) {
      return (cookieKeyValuePair[1]);
    }
  }
  return null;
}

export function isAuthenticated() {
  return getCookie('my-token');
}

export function doLogout() {
  let checkCookie = getCookie('my-token');
  if (checkCookie != null) {
    document.cookie = "my-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    console.log("You are now logged out!");
    document.getElementById("home-link").click();
  }
};

export function formatDateForOutput(storedDate) {
  return storedDate == null || storedDate === "" ? '' : moment(storedDate).format('yyyy-MM-DD');
}
