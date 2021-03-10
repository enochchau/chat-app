import {
  saveToken,
  getToken,
  decodeToJwtUser
} from '../../api/token'

describe("Token Saving to local/session storage", () => {

  beforeEach(() => {
    jest.restoreAllMocks();
  })

  // local and session storage save the same prototype so they both get "called" when 1 is called...

  test("saveToken to session storage", () => {
    const localSetItem = jest.spyOn(window.localStorage.__proto__, 'setItem');
    const sessionSetItem = jest.spyOn(window.sessionStorage.__proto__, 'setItem');
    saveToken("token", false);
    expect(sessionSetItem).toHaveBeenCalled();
    // expect(localSetItem).not.toHaveBeenCalled();
  });

  test("saveToken to local storage", () => {
    const localSetItem = jest.spyOn(window.localStorage.__proto__, 'setItem');
    const sessionSetItem = jest.spyOn(window.sessionStorage.__proto__, 'setItem');
    saveToken("token", true);
    expect(localSetItem).toHaveBeenCalled();
    // expect(sessionSetItem).not.toHaveBeenCalled();
  });

});