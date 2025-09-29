/**
 * @file URL Parameter Processor for Sample Requests
 *
 * Provides URL parameter substitution and query string processing for
 * interactive sample request functionality. Handles dynamic URL segments
 * and query parameter injection for testing API endpoints.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 4.0.0
 * @internal
 */

interface QueryParameters {
    [key: string]: string | number | boolean;
}

/**
 * UrlProcessor class
 *
 * Replace placeholders in a URL with specific query parameters.
 * @class
 */
class UrlProcessor {
    /**
     * Replace parameters from url (:id) by the parameters from input values
     *
     * Process a URL by replacing parameters in the pathname and query string with the corresponding values
     * from the provided queryParameters object. Dynamic segments in the pathname (e.g., `:param`) are replaced.
     * @param url - Base URL to be hydrated. Can contain dynamic segments in the pathname or query string.
     * @param queryParameters - An object where the keys represent the dynamic parameters in the URL and
     *     their values represent the replacement values.
     * @returns Hydrated URL
     */
    hydrate(url: string, queryParameters: QueryParameters): string {
        // The dummy URL base is only used for parses of relative URLs in Node.js.
        const parsedUrl = new URL(url, typeof window === 'undefined' ? 'https://dummy.base' : window.location.origin);
        const queryParametersChangedInPathname: QueryParameters = {};

        // For API parameters in the URL parts delimited by `/` (e.g. `/:foo/:bar`).
        parsedUrl.pathname.split('/').forEach((pathnamePart) => {
            if (pathnamePart.charAt(0) === ':') {
                const realPathnamePart = pathnamePart.slice(1);

                if (typeof queryParameters[realPathnamePart] !== 'undefined') {
                    parsedUrl.pathname = parsedUrl.pathname.replace(pathnamePart, encodeURIComponent(String(queryParameters[realPathnamePart])));
                    queryParametersChangedInPathname[realPathnamePart] = queryParameters[realPathnamePart];
                }
            }
        });

        // For API parameters in the URL query string (e.g. `?foo=:foo&bar=:bar`).
        for (const key in queryParameters) {
            if (
                typeof queryParametersChangedInPathname[key] === 'undefined' || // Avoid adding query parameter if it has already been changed in pathname.
                parsedUrl.searchParams.has(key)
            ) {
                parsedUrl.searchParams.set(key, String(queryParameters[key]));
            }
        }

        return parsedUrl.toString();
    }
}

export { UrlProcessor, UrlProcessor as default };
