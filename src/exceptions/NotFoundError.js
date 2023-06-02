import { APIError } from "./APIError.js";

export class NotFoundError extends APIError {
  constructor(message) {
    super(message, 404);
  }
}
