import { APIError } from "./APIError.js";

export class ClientError extends APIError {
  constructor(message) {
    super(message, 400);
  }
}
