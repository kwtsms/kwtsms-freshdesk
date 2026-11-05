# Changelog

## [Unreleased]

### Added
- Requests to kwtSMS carry the integration name and version (no personal data) so kwtSMS can see which integrations are in use.

### Changed
- Sample phone numbers in the app and docs are now the placeholder 965XXXXXXXX; tests that need a real Kuwait number read it from the KWTSMS_TEST_NUMBER environment variable and skip when it is not set.

## [1.0.0] - 2026-03-19

### Added
- SMS notifications on ticket create, status change, agent reply
- Admin SMS alerts on new tickets and priority escalations
- Ticket sidebar for agent manual SMS
- Dashboard with balance, stats, gateway status
- SMS templates with EN/AR support and placeholders
- SMS logs with filtering and pagination
- Daily cron sync for balance, sender IDs, coverage
- kwtSMS gateway test mode support
