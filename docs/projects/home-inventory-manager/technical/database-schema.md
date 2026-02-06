# Technical: Database Schema

## Core Tables

### users
- id (uuid)
- email (unique)
- password_hash
- created_at
- updated_at

### items
- id (uuid)
- user_id (fk users)
- name
- brand
- model
- category_id (fk categories)
- room_id (fk rooms)
- value
- purchase_date
- purchase_price
- purchase_store
- barcode
- created_at
- updated_at

### rooms
- id (uuid)
- user_id (fk users)
- name
- created_at

### categories
- id (uuid)
- user_id (fk users)
- name

### item_photos
- id (uuid)
- item_id (fk items)
- storage_key
- mime_type
- created_at

### receipts
- id (uuid)
- item_id (fk items)
- storage_key
- mime_type
- created_at

### warranties
- id (uuid)
- item_id (fk items)
- start_date
- end_date
- provider

### reports
- id (uuid)
- user_id (fk users)
- status
- filter_payload
- file_key
- created_at

## Indexing Strategy
- items: index on user_id, room_id, category_id, purchase_date
- items: full-text index on name and brand
- reports: index on user_id, status

## Data Retention
- Soft delete items for 30 days
- Media retention follows item lifecycle

## Review/Contribution

_Schema reflects planned entities and will be validated during implementation._
