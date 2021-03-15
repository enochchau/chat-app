import jwt_decode from 'jwt-decode';
import { jwtToJwtUser } from '../../auth/jwt';

describe ("JWT utility", () => {
  it("decode jwt into jwt user", () => {
    expect(jwtToJwtUser("some=none=valid=jwt=string")).toBe(undefined);
  })
})