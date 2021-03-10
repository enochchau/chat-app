import * as React from 'react';
import "@testing-library/jest-dom/extend-expect";

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { render, fireEvent, screen, waitFor } from "../test-utils";

import { LoginPage } from '../../page/login';
import { testUser, handler } from '../testapi';

import { URL, LOGIN } from '../../api/index';

describe("<LoginPage/>", () => {

  const server = setupServer(...handler);

  const submitForm = (username: HTMLInputElement, password: HTMLInputElement, button: HTMLButtonElement) => {
    fireEvent.change(username, { target: {value: testUser.username}});
    fireEvent.change(password, { target: {value: testUser.password}});
    fireEvent.click(button);
  }

  const setup = () => {
    const utils = render(<LoginPage/>);
    const username = screen.getByLabelText("Username", {selector: 'input'}) as HTMLInputElement;
    const password = screen.getByLabelText("Password", {selector: 'input'}) as HTMLInputElement;
    const button = screen.getByRole("button", {name: /Submit/i}) as HTMLButtonElement;
    const rememberMe = screen.getByRole("checkbox") as HTMLInputElement;
    return {username, password, rememberMe, button, ...utils}
  }

  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    jest.restoreAllMocks();
  });
  afterAll(() => server.close());

  test('Expect an empty form', () => {
    const {username, password, rememberMe} = setup();
    expect(username).toHaveValue("");
    expect(password).toHaveValue("");
    expect(rememberMe).not.toBeChecked();
  });

  test('Input login credentials', () => {
    const {username, password, rememberMe } = setup();

    fireEvent.change(username, { target: {value: testUser.username}});
    fireEvent.change(password, { target: {value: testUser.password}});
    fireEvent.click(rememberMe);

    expect(username).toHaveValue(testUser.username);
    expect(password).toHaveValue(testUser.password);
    expect(rememberMe).toBeChecked();
  });

  test("Login successfully without rememberMe", async () => {
    const localStorageMock = jest.spyOn(window.localStorage.__proto__, 'setItem');
    const sessionStorageMock = jest.spyOn(window.sessionStorage.__proto__, 'setItem');
    const {username, password, button, rememberMe} = setup();

    fireEvent.change(username, { target: {value: testUser.username}});
    fireEvent.change(password, { target: {value: testUser.password}});

    expect(username).toHaveValue(testUser.username);
    expect(password).toHaveValue(testUser.password);
    expect(rememberMe).not.toBeChecked();
    
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText("Valid Credentials")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Logged in successfully.")).toBeInTheDocument());
    expect(sessionStorageMock).toHaveBeenCalled();

    // this doesn't work b/c local and session storage share the same prototype
    // expect(localStorageMock).not.toHaveBeenCalled();
  });

  test("Login successfully with rememberMe", async () => {
    const localStorageMock = jest.spyOn(window.localStorage.__proto__, 'setItem');
    const sessionStorageMock = jest.spyOn(window.sessionStorage.__proto__, 'setItem');
    
    const {username, password, button, rememberMe} = setup();

    fireEvent.click(rememberMe);
    submitForm(username, password, button);

    await waitFor(() => expect(screen.getByText("Valid Credentials")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Logged in successfully.")).toBeInTheDocument());
    expect(localStorageMock).toHaveBeenCalled();
    // expect(sessionStorageMock).not.toHaveBeenCalled();
  });

  test("Wrong username", async () => {
    const { username, password, button} = setup();

    fireEvent.change(username, { target: {value: "wrong_username"}});
    fireEvent.change(password, { target: {value: testUser.password}});
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText("Invalid Credentials")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("That username does not exist.")).toBeInTheDocument());
  });

  test("Wrong password", async () => {
    const { username, password, button} = setup();

    fireEvent.change(username, { target: {value: testUser.username}});
    fireEvent.change(password, { target: {value: "wrong_password"}});
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText("Invalid Credentials")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Your password is invalid.")).toBeInTheDocument());
  });

  test("Get a server error.", async () => {
    server.use(
      rest.post(`http://${URL}${LOGIN}`, (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )
    const {username, password, button} = setup();

    submitForm(username, password, button);

    await waitFor(() => expect(screen.getByText("Server Error")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Something went wrong. Wait a bit and try again.")).toBeInTheDocument());
  });

})