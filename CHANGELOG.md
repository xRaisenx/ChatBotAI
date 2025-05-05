# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- Initial implementation of product card display in chat interface.

### Changed
- Modified chat API route (`app/api/chat/route.ts`) to include product card data as JSON within the streamed response.
- Modified chat interface component (`components/ChatInterface.tsx`) to parse product card data from the streamed response and display it.

### Fixed
- Resolved "Module not found: Can't resolve 'uuid'" build error by installing the `uuid` package in the correct project directory.

### Removed
