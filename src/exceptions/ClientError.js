import { APIError } from "./APIError";

export class ClientError extends APIError {
  constructor(message) {
    super(message, 400);
  }
}
