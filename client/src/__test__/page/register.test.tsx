import * as React from 'react';
import "@testing-library/jest-dom/extend-expect";

import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { render, fireEvent, screen, waitFor } from "../test-utils";
import { handler, TestUser, testUser } from '../testapi';
import { URL, REGISTER} from '../../api';
import { RegisterPage } from '../../page/register';

describe("<RegisterPage/>", () => {
  const newUser: TestUser = {
    username: "new_user",
    password: 'password_123',
    id: 3245749378,
    name: "New User Person",
  };

  const server = setupServer(...handler);

  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  const setup = () => {
    const utils = render(<RegisterPage/>);
    const username = screen.getByLabelText("Username", {selector: 'input'}) as HTMLInputElement;
    const password = screen.getByLabelText("Password", {selector: 'input'}) as HTMLInputElement;
    const name = screen.getByLabelText("Name", {selector: 'input'}) as HTMLInputElement;
    const rePassword = screen.getByLabelText("Re-type Password", {selector: 'input'}) as HTMLInputElement;
    const button = screen.getByRole("button", {name: /Submit/i}) as HTMLButtonElement;
    return {username, password, name, rePassword, button, ...utils};
  }

  test('Expect an empty form', () => {
    const {username, password, name, rePassword} = setup();

    expect(username).toHaveValue("");
    expect(rePassword).toHaveValue("");
    expect(password).toHaveValue("");
    expect(name).toHaveValue("");
  });

  test('Export form fields to be filled', () => {
    const {username, password, name, rePassword} = setup();

    fireEvent.change(username, { target: {value: newUser.username}});
    fireEvent.change(password, { target: {value: newUser.password}});
    fireEvent.change(rePassword, { target: {value: newUser.password}});
    fireEvent.change(name, { target: {value: newUser.name}});

    expect(username).toHaveValue(newUser.username);
    expect(password).toHaveValue(newUser.password);
    expect(rePassword).toHaveValue(newUser.password);
    expect(name).toHaveValue(newUser.name);
  });

  test('Register a new user successfully', async () => {

    const {username, password, name, rePassword, button} = setup();

    fireEvent.change(username, { target: {value: newUser.username}});
    fireEvent.change(password, { target: {value: newUser.password}});
    fireEvent.change(rePassword, { target: {value: newUser.password}});
    fireEvent.change(name, { target: {value: newUser.name}});
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText("Registration Accepted")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("You will be redirected in a moment.")).toBeInTheDocument());
  });

  test("Try to use an existing username", async () => {

    const {username, password, name, rePassword, button} = setup();

    fireEvent.change(username, { target: {value: testUser.username }});
    fireEvent.change(password, { target: {value: newUser.password}});
    fireEvent.change(rePassword, { target: {value: newUser.password}});
    fireEvent.change(name, { target: {value: newUser.name}});
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText("Registration Denied")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("That username is already taken.")).toBeInTheDocument());
  });

  test("Get a server error.", async () => {
    server.use(
      rest.post(`http://${URL}${REGISTER}`, (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )

    const {username, password, name, rePassword, button} = setup();

    fireEvent.change(username, { target: {value: newUser.username}});
    fireEvent.change(password, { target: {value: newUser.password}});
    fireEvent.change(rePassword, { target: {value: newUser.password}});
    fireEvent.change(name, { target: {value: newUser.name}});
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText("Server Error")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Something went wrong. Wait a bit and try again.")).toBeInTheDocument());
  });

});