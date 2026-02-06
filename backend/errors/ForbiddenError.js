class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    ((this.name = "Forbidden"), (this.status = 403));
  }
}

module.exports = ForbiddenError;
