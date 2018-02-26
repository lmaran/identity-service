export const enum EnvironmentType {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production",
    TEST = "testing",
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
