import { authMiddleware } from "../src/middleware/authMiddleware";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      headers: {},
      header: jest.fn().mockImplementation((name) => {
        return req.headers?.[name.toLowerCase()];
      }),
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = "kedVpf3TBduN";
  });

  it("should call next with valid token", () => {
    req.headers = { authorization: "Bearer valid_token" };
    (req.header as jest.Mock).mockReturnValue("Bearer valid_token");
    (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 });

    authMiddleware(req as any, res as any, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ userId: 1 });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(jwt.verify).toHaveBeenCalledWith("valid_token", "kedVpf3TBduN");
  });

  it("should return 401 if token is missing", () => {
    (req.header as jest.Mock).mockReturnValue(undefined);

    authMiddleware(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Accès non autorisé, token manquant",
    });
    expect(next).not.toHaveBeenCalled();
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    req.headers = { authorization: "Bearer invalid_token" };
    (req.header as jest.Mock).mockReturnValue("Bearer invalid_token");
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token invalide" });
    expect(next).not.toHaveBeenCalled();
    expect(jwt.verify).toHaveBeenCalledWith("invalid_token", "kedVpf3TBduN");
  });

  it("should return 401 if Authorization header is malformed", () => {
    req.headers = { authorization: "Invalid" };
    (req.header as jest.Mock).mockReturnValue("Invalid");

    authMiddleware(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token invalide" });
    expect(next).not.toHaveBeenCalled();
  });
});
