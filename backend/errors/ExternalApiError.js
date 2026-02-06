class ExternalApiError extends Error {
  constructor(message, status, details) {
    super(message);

    this.name = "ExternalApiError";
    this.status = status;
    this.details = details;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

module.exports = ExternalApiError;
