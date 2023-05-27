import { APIError } from "./APIError";

export class NotFoundError extends APIError {
  constructor(message) {
    super(message, 404);
  }
}
