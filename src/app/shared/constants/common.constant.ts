export const SUBSCRIPTION_PLANS_LIMIT = 10;
export const PAYMENTS_LIMIT = 10;
export const CREDIT_PACKS_LIMIT = 10;
export const SCHOOLS_LIMIT = 10;
export const USERS_LIMIT = 10;

// File Constants
export const MAX_IMPORT_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_UPLOAD_FILE_SIZE = 150 * 1024 * 1024; // 150MB
export const MAX_TOTAL_UPLOAD_FILE_SIZE = 500 * 1024 * 1024; // 500MB
export const ALLOWED_IMPORT_EXTENSIONS = ['xlsx', 'xls', 'csv'];
export const ALLOWED_UPLOAD_MIME_TYPES = [
  'video/',
  'audio/',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Table Constants
export const PAGE_SIZE = 12;

// Validators
export const VIETNAM_PHONE_REGEX =
  /^(?:0|\+84(?:0)?)(?:2\d{9}|[35789][2-9]\d{7})$/;
