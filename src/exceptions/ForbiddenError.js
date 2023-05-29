import { APIError } from "./APIError.js";

export class ForbiddenError extends APIError {
  constructor(message) {
    super(message, 403);
  }
}
