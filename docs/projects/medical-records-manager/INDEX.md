# Medical Records Manager - Documentation Index

## Overview

**Medical Records Manager** (also known as **HealthVault**) is a secure, customer-facing application for organizing personal and family medical records, appointments, prescriptions, and test results. Users can store documents, track appointment history, receive reminders, and share records securely with healthcare providers when needed.

**Target Audience**: Families managing multiple medical records, individuals with chronic conditions, parents tracking children's medical history, and caregivers coordinating care for others.

**Status**: Planning  
**Priority**: High  
**Category**: Full-Stack Web & Mobile Application (Customer-Facing)  
**Last Updated**: 2026-01-24

## Documentation Structure

- [PRD Overview](PRD_OVERVIEW.md) - Main requirements document with MVP definition
- [Architecture](ARCHITECTURE.md) - Technical architecture and system design
- [Expert Contributions](EXPERTS.md) - Expert reviews and sign-offs

### Global/Shared Features

This project uses the following general features (or will reference them when extracted):

**Note**: Authentication and Notification systems are candidates for general features (used by 7+ and 5+ projects respectively). When extracted to `../general/`, references will be updated here.

**Current Status**: All features are project-specific until general features are extracted.

- **Authentication System** (Candidate for `../general/anchorage/`) - User authentication and authorization
- **Notification System** (Candidate for `../general/notifications/`) - Email, push, and SMS notifications
- **File Storage System** (Project-Specific) - Secure medical document storage with encryption

### Project-Specific Features

- [Medical Records Vault](features/medical-records-vault.md) - Secure document storage and organization
- [Appointments & Reminders](features/appointments-reminders.md) - Appointment tracking and notification system
- [Medication Tracking](features/medication-tracking.md) - Prescription and dosage management
- [Family Profiles](features/family-profiles.md) - Multi-user profile management
- [Secure Sharing](features/secure-sharing.md) - Temporary access links with audit logging
- [Reports & Export](features/reports-export.md) - PDF export and medical summaries

### Technical

- [API Design](technical/api-design.md) - RESTful API specification
- [Database Schema](technical/database-schema.md) - Data model and relationships
- [Security](technical/security.md) - HIPAA compliance, encryption, access control
- [File Storage](technical/file-storage.md) - Secure document storage architecture
- [Audit Logging](technical/audit-logging.md) - Compliance audit trail

### Compliance

- [HIPAA Compliance](compliance/hipaa-compliance.md) - HIPAA requirements and implementation
- [Privacy Policy](compliance/privacy-policy.md) - User data privacy and protection
- [Data Protection](compliance/data-protection.md) - Encryption, backup, disaster recovery
- [Access Control](compliance/access-control.md) - Authorization and audit requirements

### Business

- [Revenue Model](business/revenue-model.md) - Freemium and premium tier pricing
- [User Personas](business/user-personas.md) - Target users and use cases
- [Success Metrics](business/success-metrics.md) - KPIs and measurement strategy

## Project Status

- **Current Phase**: Planning
- **Last Updated**: 2026-01-24
- **Priority**: High (High business value + High user value = Privacy-critical health information management)
- **Estimated MVP Timeline**: 12-16 weeks development + 4 weeks testing

## Key Priorities

1. **HIPAA Compliance**: Non-negotiable - Must meet all HIPAA requirements from day one
2. **Security**: Encryption at rest and in transit, secure access control, audit logging
3. **User Privacy**: Clear privacy controls, secure sharing, data ownership
4. **Accessibility**: Accessible to users with disabilities (WCAG AA compliance)
5. **Mobile-First**: Document scanning, quick access to emergency info, reminders

## Expert Team

- **Patricia Martinez** - Product Manager (Prioritization, Business Decisions)
- **Ryan Kim** - Security Expert (HIPAA, PHI Protection, Encryption)
- **Constance White** - Compliance Expert (HIPAA, Medical Regulations)
- **Samuel Rodriguez** - Backend Expert (Secure API, Data Storage)
- **Daisy Thompson** - UI/UX Expert (User Interface, User Experience)
- **Allison Foster** - Accessibility Expert (WCAG Compliance, Screen Readers)
- **Benjamin Lee** - Database Expert (Medical Data Modeling)
- **Emily Chen** - API Design Expert (RESTful API, Security)
- **Kevin Martinez** - Observability Expert (Audit Logging, Monitoring)
- **David Cooper** - DevOps Expert (Secure Deployment, Backups)
- **Michael Brown** - Mobile Expert (React Native, Document Scanning)
- **Dorothy Clark** - Documentation Expert (PRD Structure, Clarity)

## Quick Links

- [Projects List Entry](../../reference/PROJECTS_LIST.md#medical-records-manager)
- [General Features](../general/INDEX.md)

---

**This documentation provides a comprehensive guide to the Medical Records Manager project planning, technical architecture, compliance requirements, and implementation strategy.**
