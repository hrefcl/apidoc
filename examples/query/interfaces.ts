/**
 * Interface for community query parameters
 */
export interface CommunityQueryParams {
    /** External community UUID (unique identifier) */
    extCommunityUuid: string;

    /** Community name */
    name: string;

    /** Full physical address (optional) */
    address?: string;

    /** City ID from database (optional) */
    cityId?: number;

    /** Management office phone number (optional) */
    managePhone?: string;
}

/**
 * Interface for pagination query parameters
 */
export interface PaginationQuery {
    /** Page number (starts from 1) */
    pageNum?: number;

    /** Items per page */
    pageSize?: number;
}
