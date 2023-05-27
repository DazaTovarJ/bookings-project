import { APIError } from "./APIError";

export class ForbiddenError extends APIError {
  constructor(message) {
    super(message, 403);
  }
}
