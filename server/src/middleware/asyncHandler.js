/**
 * Wrapper async pour éviter les try/catch répétitifs dans les controllers.
 * Transmet les erreurs au middleware global errorHandler.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
