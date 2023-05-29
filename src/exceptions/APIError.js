export class APIError extends Error {
  message;
  status;
  additionalInfo;

  constructor(message, status = 500, additionalInfo = undefined) {
    super(message);
    this.message = message;
    this.status = status;
    this.additionalInfo = additionalInfo;
  }
}