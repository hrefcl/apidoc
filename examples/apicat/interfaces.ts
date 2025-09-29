/**
 * @file Example TypeScript interfaces for APIDoc schema demonstration
 */

/**
 * Company pricing configuration interface
 */
export interface CompanyPricing {
    /** Default plan type for the company */
    default_plan_type?: string;

    /** Default billing currency (ISO code) */
    default_billing_currency?: string;

    /** Default surge pricing configuration */
    default_surge?: {
        /** Whether surge pricing is active */
        active: boolean;
        /** Surge multiplier factor */
        multiplier: number;
        /** Fixed extra charge amount */
        fixed_extra: number;
    };

    /** Available service types and pricing */
    services_types?: Array<{
        /** Service type identifier */
        type: string;
        /** Base value */
        value?: number;
        /** Driver value */
        value_driver?: number;
        /** Per kilometer rate */
        value_km?: number;
        /** Distance in kilometers */
        km?: number;
        /** High demand pricing active */
        high_demand_active?: boolean;
        /** High demand multiplier */
        high_demand?: number;
    }>;

    /** Soft configuration updates */
    soft_updates?: CompanySoftUpdate[];

    /** Hard configuration overwrites */
    hard_overwrites?: CompanyHardOverwrite[];
}

/**
 * Soft update configuration
 */
export interface CompanySoftUpdate {
    /** Update identifier */
    id: string;
    /** Update type */
    type: 'pricing' | 'config' | 'feature';
    /** Update value */
    value: any;
    /** Effective from timestamp */
    effective_from?: string;
    /** Expires at timestamp */
    expires_at?: string;
}

/**
 * Hard overwrite configuration
 */
export interface CompanyHardOverwrite {
    /** Overwrite identifier */
    id: string;
    /** Configuration path to overwrite */
    path: string;
    /** New value */
    value: any;
    /** Priority level */
    priority: number;
}

/**
 * API response wrapper (simplified for APIDoc)
 */
export interface ResponseSuccess {
    /** Indicates successful response */
    success: true;
    /** Response data payload */
    data: any;
}

/**
 * Complex generic interface - should be simplified automatically
 * This demonstrates how the parser handles generics and index signatures
 */
export interface ResponseSuccessGeneric<T = unknown> {
    success: true;
    data: T;
    [extra: string]: unknown;
}

/**
 * Interface with index signatures - should ignore the index signature
 */
export interface ResponseErrorOptions {
    id: string;
    code?: string | number;
    [k: string]: unknown;
}

/**
 * Error response structure
 */
export interface ResponseError {
    /** Indicates failed response */
    success: false;
    /** Error message */
    message: string;
    /** Error code */
    code?: string;
    /** Detailed error information */
    details?: {
        /** Field-specific validation errors */
        field_errors?: Record<string, string[]>;
        /** Stack trace (development only) */
        stack?: string;
    };
}

/**
 * User profile information
 */
export interface UserProfile {
    /** User's unique identifier */
    id: number;
    /** User's email address */
    email: string;
    /** User's full name */
    name: string;
    /** User role in system */
    role: 'admin' | 'user' | 'moderator';
    /** Profile creation timestamp */
    created_at: string;
    /** Last profile update */
    updated_at: string;
    /** User preferences */
    preferences?: {
        /** UI theme preference */
        theme: 'light' | 'dark' | 'auto';
        /** Language preference (ISO code) */
        language: string;
        /** Timezone identifier */
        timezone: string;
        /** Email notification settings */
        notifications: {
            /** Email notifications enabled */
            email: boolean;
            /** Push notifications enabled */
            push: boolean;
            /** SMS notifications enabled */
            sms: boolean;
        };
    };
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    /** Current page number */
    current_page: number;
    /** Items per page */
    per_page: number;
    /** Total number of items */
    total: number;
    /** Total number of pages */
    total_pages: number;
    /** Whether there's a next page */
    has_next: boolean;
    /** Whether there's a previous page */
    has_prev: boolean;
}

/**
 * Paginated response wrapper (simplified for APIDoc)
 */
export interface PaginatedResponse {
    /** Success status */
    success: boolean;
    /** Response message */
    message?: string;
    /** Data array */
    data: any[];
    /** Pagination metadata */
    meta: PaginationMeta;
}
