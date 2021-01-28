export default function evaluateContext(filteredContext) {
  const {
    userId: userIdBeforeLogin,
    localeContext,
    ...handlerContext
  } = filteredContext;

  return {
    userIdBeforeLogin,
    normalizedLocale: localeContext && localeContext.normalized,
    ...handlerContext,
  };
}
