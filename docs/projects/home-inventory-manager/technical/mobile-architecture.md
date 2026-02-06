# Technical: Mobile Architecture

## Framework
- React Native for iOS and Android
- Shared design system with web where possible

## Offline Strategy
- Local SQLite database for items, rooms, and categories
- Sync queue for mutations
- Conflict resolution on edit with user prompts

## Media Handling
- Compress photos before upload
- Background upload with retry
- Signed URL uploads

## Device Integrations
- Camera for photo capture and receipts
- Barcode scanning library
- Push notifications (Phase 2)

## Performance
- Lazy loading for large inventories
- Pagination and incremental sync

## Review/Contribution

_Mobile architecture focuses on reliable capture and offline use._
