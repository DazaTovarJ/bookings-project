import { APIError } from "./APIError.js";

export class UnauthorizedError extends APIError {
  constructor(message) {
    super(message, 401);
  }
}
