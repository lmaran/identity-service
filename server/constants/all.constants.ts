export const enum EnvironmentType {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production",
    TEST = "testing",
}

// https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/

// https://tools.ietf.org/html/rfc6749#section-4.1.2
export const enum OAuthAuthorizationError {
    INVALID_REQUEST = "invalid_request",
    UNAUTHORIZED_CLIENT = "unauthorized_client",
    ACCESS_DENIED = "access_denied",
    UNSUPPORTED_RESPONSE_TYPE = "unsupported_response_type",
    INVALID_SCOPE = "invalid_scope",
    SERVER_ERROR = "server_error",
    TEMPORARILY_UNAVAILABLE = "temporarily_unavailable",
}

// https://tools.ietf.org/html/rfc6749#section-5.2
export const enum OAuthTokenError {
    INVALID_REQUEST = "invalid_request",
    INVALID_CLIENT = "invalid_client",
    INVALID_GRANT = "invalid_grant",
    UNAUTHORIZED_CLIENT = "unauthorized_client",
    UNSUPPORTED_GRANT_TYPE = "unsupported_grant_type",
    INVALID_SCOPE = "invalid_scope",
}

export const enum AppError {
    INVALID_REQUEST = "invalid_request",

}

export const enum ReturnType {
    HTML = "html",
    JSON = "json",
    TEXT = "text",
    REDIRECT = "redirect",
}

export const enum LogSource {
    HTTP_LOG_HANDLER = "htmlLogHandler",
    ERROR_HANDLER = "errorHandler",
    CODE = "code",
}

export const enum LogLevel {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
    DEBUG = "debug",
}

export const enum LogDetail {
    NONE = "none",
    PARTIAL = "partial",
    FULL = "full",
}
