/*
 * Gets a cookie
 *
 * @param {string} name - The cookie name
 *
 * @return {(string|null)} The string value of the cookie
 */
export function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }

  return null;
}

/*
 * Sets a cookie
 *
 * @param {string} name - The cookie name
 * @param {string} value - The value of the cookie (can be a number or boolean,
 *    but will be converted to and stored as its string representation)
 * @param {number} minutes - The cookie expiration in minutes
 */
export function setCookie(name, value, minutes) {
  let expirationFragment = '';

  if (minutes) {
    const date = new Date();
    const ms = minutes * 60 * 1000;
    const expiration = date.getTime() + ms;

    date.setTime(expiration);
    expirationFragment = `; expires=${date.toGMTString()}`;
  }

  document.cookie = `${name}=${value}${expirationFragment}; path=/`;
}

/*
 * Deletes a cookie
 *
 * @param {string} name - The cookie name
 */
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}