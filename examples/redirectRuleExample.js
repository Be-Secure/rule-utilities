/* global configuration */
function redirectRuleExample(user, context, callback) {
  const { Auth0RedirectRuleUtilities } = require("@auth0/rule-utilities@0.1.0");

  const ruleUtils = new Auth0RedirectRuleUtilities(
    user,
    context,
    configuration
  );

  if (ruleUtils.isRedirectCallback && ruleUtils.queryParams.sessionToken) {
    // User is back from the redirect and has a session token to validate.

    try {
      ruleUtils.validateSessionToken();
    } catch (error) {
      callback(error);
    }

    // ... do something with POSTed or param data ...

    user.app_metadata = user.app_metadata || {};
    user.app_metadata.is_verified = true;
    callback(null, user, context);
  }

  // Some kind of context check occurred to determine if a redirect should happen.
  if (!user.app_metadata || !user.app_metadata.is_verified) {
    try {
      ruleUtils.doRedirect(configuration.ID_VERIFICATION_URL);
      callback(null, user, context);
    } catch (error) {
      callback(error);
    }
  }

  callback(null, user, context);
}