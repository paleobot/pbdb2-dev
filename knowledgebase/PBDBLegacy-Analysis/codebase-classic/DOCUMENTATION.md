# Paleobiology Database (PBDB) Classic - Comprehensive Technical Documentation

**Version:** 2.0
**Repository:** github.com:paleobiodb/classic
**Live Deployment:** https://paleobiodb.org
**Last Updated:** 2026-02-23

---

## Executive Summary

The **Paleobiology Database (PBDB) Classic** represents a successful modernization of legacy CGI-based paleontological data management code. This Version 2.0 application encapsulates approximately **56,744 lines** of domain-specific Perl modules within a modern Dancer web framework, maintaining backward compatibility while providing RESTful APIs and contemporary deployment infrastructure via Docker.

**Key Statistics:**
- **65 Perl modules** in the codebase
- **47 PBDB domain modules** handling specialized paleontological logic
- **Dual database architecture** (modern Wing + legacy PBDB)
- **3 independent services** in single container (REST API, Web App, Taxonomy Cache)
- **8 schema migration versions** managed via DBIx::Class::DeploymentHandler
- **22 JavaScript files** (~1.5MB total) for rich client-side functionality

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Directory Structure](#4-directory-structure)
5. [Configuration Management](#5-configuration-management)
6. [Application Entry Points](#6-application-entry-points)
7. [Database Architecture](#7-database-architecture)
8. [REST API Reference](#8-rest-api-reference)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Core Features & Components](#10-core-features--components)
11. [Key Modules Reference](#11-key-modules-reference)
12. [Deployment Guide](#12-deployment-guide)
13. [Development Workflow](#13-development-workflow)
14. [Code Metrics](#14-code-metrics)
15. [Technical Observations](#15-technical-observations)

---

## 1. Project Overview

The Paleobiology Database (PBDB) is a non-governmental, non-profit public resource for paleontological data, organized and operated by a multi-disciplinary, multi-institutional, international group of paleobiological researchers. The database provides global, collection-based occurrence and taxonomic data for organisms of all geological ages.

### Core Mission
- Maintain a comprehensive database of fossil occurrences worldwide
- Provide taxonomic classification and opinion management
- Enable researchers to contribute, review, and access paleontological data
- Support data export for research and analysis

### Core Developers
- **Michael McClennen** (mmcclenn) - Primary maintainer
- **Julian Jenkins** (jpjenk) - Contributing developer

### Issue Reporting
- Database-related issues: PBDB Change Log repository
- Application bugs: [admin@paleobiodb.org](mailto:admin@paleobiodb.org)

---

## 2. Technology Stack

### Core Technologies

| Component | Technology | Details |
|-----------|-----------|---------|
| **Language** | Perl | 5.38 (threaded) |
| **Web Framework** | Dancer | Modern Perl web framework |
| **Application Server** | Starman | PSGI-compliant web server |
| **Process Manager** | Server::Starter | Hot restart capability |
| **Web Services Toolkit** | Wing (PlainBlack) | REST API, auth, templating, job queue |
| **Data Service** | Web::DataService | RESTful public API framework |
| **ORM** | DBIx::Class | Database abstraction layer |
| **Database** | MariaDB/MySQL | Dual database setup |
| **Template Engine** | Template Toolkit | HTML rendering |
| **Caching** | Cache::FastMmap | 512MB in-memory file cache |
| **Job Queue** | Beanstalkd + Wingman | Async task processing |
| **Logging** | Log::Log4perl | Structured logging |
| **Password Hashing** | Crypt::Eksblowfish::Bcrypt | Secure password storage (bcrypt) |
| **Container** | Docker | Production deployment |

### Frontend Technologies

| Technology | Purpose | Size |
|------------|---------|------|
| **Bootstrap** | CSS framework | 3.3.6 |
| **jQuery** | DOM manipulation | - |
| **Angular.js** | Client-side framework | - |
| **OpenLayers** | Map visualization | 753KB (classic), 500KB (modern) |
| **XRegExp** | Advanced regex | 218KB |

---

## 3. System Architecture

### Multi-Tier Design (5 Layers)

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Web Interface (Dancer + Template Toolkit)     │
├─────────────────────────────────────────────────────────┤
│  Layer 2: REST API (Web::DataService + Wing::Rest)      │
├─────────────────────────────────────────────────────────┤
│  Layer 3: Application Logic (PBDB::* modules)           │
├─────────────────────────────────────────────────────────┤
│  Layer 4: Data Access (DBIx::Class ORM)                 │
├─────────────────────────────────────────────────────────┤
│  Layer 5: Data Storage (MariaDB + Beanstalkd)           │
└─────────────────────────────────────────────────────────┘
```

### Request Flow

```
HTTP Request (Port 80/443)
    ↓
Reverse Proxy (Nginx/Apache)
    ↓
┌──────────────────────────────────────────────────┐
│ Plack Middleware Stack                           │
│  - CORS (REST only)                              │
│  - SizeLimit (50MB unshared, 175MB total)        │
│  - MethodOverride (X-HTTP-Method support)        │
└──────────────────────────────────────────────────┘
    ↓
Dancer Router
    ├──> Web Routes (port 6001)
    │    └──> PBDB::Classic → Domain Modules → MariaDB
    │
    ├──> REST Routes (port 6000)
    │    └──> Wing::Rest → DBIx::Class → MariaDB
    │
    └──> Data Service Routes
         └──> Web::DataService → PBDB → MariaDB
```

### Process Architecture (Container)

```
Docker Container: paleomacro_classic
│
├── start_classic.pl (Orchestrator)
│   │
│   ├── REST API Service (port 6000)
│   │   └── Starman Workers (2 default)
│   │       └── bin/rest.psgi
│   │
│   ├── Web Application (port 6001)
│   │   └── Starman Workers (2 default)
│   │       └── bin/web.psgi
│   │
│   └── Taxonomy Cache Daemon
│       └── bin/taxa_cached.pl
│
├── External: MariaDB Server (pbdb, pbdb_wing)
└── External: Beanstalkd Job Queue
```

| Service | Port | Purpose |
|---------|------|---------|
| REST API | 6000 | Data service endpoints |
| Web App | 6001 | Classic web interface |
| Debug | 6003 | Development/debugging |

---

## 4. Directory Structure

```
classic/
│
├── bin/                                # Executable entry points
│   ├── start_classic.pl                # Container startup orchestrator
│   ├── web.psgi                        # Web app PSGI entry point
│   ├── rest.psgi                       # REST API PSGI entry point
│   ├── debug_web.psgi                  # Debug mode for web (port 6003)
│   ├── debug_rest.psgi                 # Debug mode for REST
│   ├── taxa_cached.pl                  # Taxonomy cache daemon (5.7KB)
│   ├── editor.pl                       # Data editor tool (145KB)
│   └── [various startup scripts]
│
├── lib/                                # Application code (~56,744 lines)
│   │
│   ├── MyApp/                          # Application modules (19 files)
│   │   ├── Web.pm                      # Web application routing
│   │   ├── Rest.pm                     # REST API routing
│   │   ├── DB.pm                       # Database configuration
│   │   │
│   │   ├── Web/                        # Web route modules
│   │   │   └── Account.pm              # Account management routes (11KB)
│   │   │
│   │   ├── Rest/                       # REST endpoint modules
│   │   │   ├── Classic.pm              # Classic records API
│   │   │   ├── User.pm                 # User management API
│   │   │   ├── AuthEnt.pm              # Authorizer-enterer API (numeric)
│   │   │   └── AuthorizerEnterer.pm    # Authorizer-enterer API (UUID)
│   │   │
│   │   └── DB/Result/                  # DBIx::Class models
│   │       ├── User.pm                 # User accounts (UUID PK)
│   │       ├── AuthEnt.pm              # Legacy authent table
│   │       ├── AuthorizerEnterer.pm    # Modern authent table
│   │       ├── Classic.pm              # Example record type
│   │       ├── APIKey.pm               # API key authentication
│   │       ├── APIKeyPermission.pm     # API key permissions
│   │       └── TrendsLog*.pm           # Analytics tables
│   │
│   └── PBDB/                           # Core paleobiology logic (47 modules)
│       │
│       ├── Classic.pm                  # Main request handler (127KB)
│       ├── Session.pm                  # Session management
│       ├── Permissions.pm              # Data access control
│       ├── Person.pm                   # Person/user management
│       │
│       ├── Taxon.pm                    # Taxonomy operations (111KB)
│       ├── TaxonInfo.pm                # Taxon information (228KB) ⭐
│       ├── Opinion.pm                  # Taxonomic opinions (102KB)
│       ├── TaxaCache.pm                # Taxonomy caching (54KB)
│       ├── PrintHierarchy.pm           # Taxonomy printing (24KB)
│       ├── Reclassify.pm               # Taxonomy reclassification (22KB)
│       │
│       ├── Collection.pm               # Collection management (109KB)
│       ├── CollectionEntry.pm          # Collection data entry (107KB)
│       ├── OccurrenceEntry.pm          # Occurrence data entry (64KB)
│       │
│       ├── Measurement.pm              # Specimen measurements (61KB)
│       ├── MeasurementEntry.pm         # Measurement data entry (63KB)
│       │
│       ├── Ecology.pm                  # Ecological data
│       ├── EcologyEntry.pm             # Ecology data entry
│       │
│       ├── Reference.pm                # Bibliographic refs (60KB)
│       ├── ReferenceEntry.pm           # Reference data entry
│       ├── AuthorNames.pm              # Author name handling (14KB)
│       │
│       ├── Download.pm                 # Data export (204KB) ⭐
│       ├── DownloadTaxonomy.pm         # Taxonomy export (62KB)
│       │
│       ├── Map.pm                      # Map generation (114KB)
│       ├── TimeLookup.pm               # Temporal queries (28KB)
│       ├── Timescales.pm               # Geological timescales (27KB)
│       │
│       ├── Validation.pm               # Core validation functions
│       ├── SanityCheck.pm              # Data quality checks
│       ├── TypoChecker.pm              # Typo detection (769 lines)
│       │
│       ├── DBConnection.pm             # Database connectivity
│       ├── DBTransactionManager.pm     # Transaction management (42KB)
│       │
│       ├── WebApp.pm                   # Web app framework (391 lines)
│       ├── HTMLBuilder.pm              # HTML rendering (50KB)
│       ├── PBDBUtil.pm                 # Utility functions (12KB)
│       ├── Constants.pm                # Global constants
│       └── Archive.pm                  # Data archival (7KB)
│
├── views/                              # Template Toolkit templates
│   ├── classic/                        # Classic interface
│   │   ├── index.tt                    # Main landing page
│   │   ├── edit.tt                     # Edit forms
│   │   └── view.tt                     # View displays
│   │
│   ├── account/                        # Account management views
│   ├── admin/                          # Admin interface views
│   │
│   ├── header_include.tt               # Shared header
│   ├── footer_include.tt               # Shared footer
│   └── [other shared includes]
│
├── public/                             # Static assets
│   │
│   ├── classic_css/                    # Custom stylesheets
│   │
│   ├── classic_js/                     # Custom JavaScript (22 files)
│   │   ├── check_occurrences.js        # Occurrence validation (18KB)
│   │   ├── check_intervals.js          # Interval validation
│   │   ├── reference_entry.js          # Reference forms (14KB)
│   │   ├── download_generator.js       # Download UI (118KB) ⭐
│   │   ├── autocomplete.js             # Search autocomplete (13KB)
│   │   ├── occurrence_table.js         # Table rendering (18KB)
│   │   ├── taxoninfo.js                # Taxon display (9KB)
│   │   ├── timescales.js               # Timescale viewer (13KB)
│   │   ├── OpenLayers.js               # Map library (753KB)
│   │   ├── ol.js                       # OpenLayers modern (500KB)
│   │   ├── xregexp-all.js              # Regex library (218KB)
│   │   ├── common.js                   # Shared utilities (11KB)
│   │   └── [other scripts]
│   │
│   ├── source/                         # Third-party libraries
│   └── images/                         # Image assets
│
├── data/                               # Static data files
│   └── fonts/
│
├── dbicdh/                             # Database migrations (8 versions)
│   ├── MySQL/
│   │   ├── deploy/1-8/                 # SQL deployment scripts
│   │   ├── upgrade/                    # Upgrade scripts
│   │   └── downgrade/                  # Downgrade scripts
│   │
│   └── _source/deploy/1-8/             # YAML source definitions
│
├── etc/                                # Configuration templates
│   ├── wing.conf.base                  # Wing framework config (JSON)
│   └── log4perl.conf.base              # Logging configuration
│
├── scripts/                            # Utility scripts
│   ├── setpw.pl                        # Set user password
│   ├── copy_users.pl                   # Migrate users PBDB → Wing
│   └── old/                            # 50+ legacy scripts
│
├── captcha/                            # CAPTCHA images & temp files
├── var/mkits/                          # Email template kits
│
├── config.yml.base                     # Dancer config template
├── pbdb.conf.base                      # PBDB config template
│
├── Dockerfile                          # Production container image
├── Dockerfile-preload                  # Base image with dependencies
│
├── INSTALL                             # Installation instructions
├── README.md                           # Project README
└── DOCUMENTATION.md                    # This file
```

**Legend:** ⭐ = Largest/most critical modules

---

## 5. Configuration Management

The application uses **three main configuration files** generated from `.base` templates:

### 5.1 Dancer Configuration (`config.yml`)

**Template:** `config.yml.base`

```yaml
appname: "MyApp"
charset: "UTF-8"
web_workers: 2              # Starman workers for web
rest_workers: 2             # Starman workers for REST
behind_proxy: 1             # Run behind reverse proxy

template: "template_toolkit"
engines:
  template:
    template_toolkit:
      EVAL_PERL: 1          # Enable Perl code in templates

logger: "log4perl"
```

### 5.2 Wing Framework Configuration (`etc/wing.conf`)

**Template:** `etc/wing.conf.base` (JSON format)

Key sections:

| Section | Description |
|---------|-------------|
| `db` | MariaDB connection DSN, credentials |
| `cache` | FastMmap driver settings (512MB) |
| `smtp` | Email server configuration |
| `beanstalkd` | Job queue settings |
| `api_key_permissions` | Available API permission scopes |

Example database connection:
```json
{
  "db": "DBI:mysql:database=pbdb_wing;host=db.example.com;port=3306",
  "db_username": "wing_user",
  "db_password": "CHANGE_ME"
}
```

### 5.3 PBDB Configuration (`pbdb.conf`)

**Template:** `pbdb.conf.base` (key=value format)

```
DATA_URL = /data1.2/
DATA_DIR = /data/MyApp/data
HTML_DIR = /data/MyApp
GDD_URL = https://geodeepdive.org/api/v1/
ALLOW_LOGIN = 1
DB_USER = pbdb_user
DB_PASSWD = password
ADMIN_EMAIL = admin@paleobiodb.org
```

### 5.4 Logging Configuration (`etc/log4perl.conf`)

```perl
log4perl.rootLogger=WARN, LOGFILE
log4perl.appender.LOGFILE=Log::Log4perl::Appender::File
log4perl.appender.LOGFILE.filename=/data/MyApp/logs/error.log
```

### 5.5 Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `WING_HOME` | `/data/Wing` | Wing framework home |
| `WING_APP` | `/data/MyApp` | Application home |
| `WING_CONFIG` | `/data/MyApp/etc/wing.conf` | Wing config path |
| `LANG` | `en_US.UTF-8` | Character encoding |
| `TZ` | `Etc/UTC` | Timezone (configurable at build) |
| `ANY_MOOSE` | `Moose` | ORM preference |

---

## 6. Application Entry Points

### Container Startup Process

**Entry Point:** `bin/start_classic.pl`

```
1. Load config.yml
2. Set environment variables (WING_HOME, WING_APP, WING_CONFIG)
3. Pre-flight check: perl bin/debug_web.psgi GET /classic/
4. Launch three daemon processes:
   ├── REST API (port 6000)
   ├── Web App (port 6001)
   └── Taxa Cache Daemon
5. Install signal handlers (TERM, INT) for graceful shutdown
6. Wait for processes
```

### Web Application Entry Point

**File:** `bin/web.psgi` (Port 6001)

```perl
use MyApp::Web;
use PBDB::Classic;
use Wing::Dancer;

enable "SizeLimit",
    max_unshared_size_in_kb => 50000,
    max_process_size_in_kb  => 175000;
enable "MethodOverride";

dance;
```

### REST API Entry Point

**File:** `bin/rest.psgi` (Port 6000)

```perl
use MyApp::Rest;
use Wing::Rest;

enable "CrossOrigin", origins => '*';
enable "SizeLimit", ...;
enable "MethodOverride";

dance;
```

---

## 7. Database Architecture

### Dual Database Strategy

```
┌─────────────────────────────────────────────────┐
│  pbdb_wing (Modern - DBIx::Class)               │
│  - User accounts & authentication               │
│  - API keys & permissions                       │
│  - Application infrastructure                   │
│  - Relationships (authorizer-enterer)           │
│  - Analytics (trends_logs)                      │
└─────────────────────────────────────────────────┘
         │
         │ Linked via person_no field
         ↓
┌─────────────────────────────────────────────────┐
│  pbdb (Legacy - Direct SQL)                     │
│  - Collections & occurrences                    │
│  - Taxonomic data (taxa, opinions)              │
│  - References & citations                       │
│  - Geological strata & measurements             │
│  - Ecological data                              │
└─────────────────────────────────────────────────┘
```

### Wing Database Schema (`pbdb_wing`)

| Table | Primary Key | Purpose |
|-------|-------------|---------|
| `users` | `id` (UUID) | User accounts |
| `authents` | `id` (int) | Authorizer-enterer (numeric) |
| `authorizer_enterers` | `id` (UUID) | Authorizer-enterer (UUID) |
| `api_keys` | `id` (UUID) | API key management |
| `api_key_permissions` | `id` (UUID) | API permissions |
| `session_data` | `id` (varchar) | Session storage |
| `trends_logs_*` | composite | Analytics (hourly/daily/monthly/yearly) |

### Schema Migrations

**Tool:** DBIx::Class::DeploymentHandler
**Versions:** 8 migration versions available in `dbicdh/MySQL/`

---

## 8. REST API Reference

### Infrastructure

- **CORS:** Enabled for all origins on port 6000
- **Memory Limits:** 50MB unshared, 175MB total per worker
- **Response Format:** JSON
- **Authentication:** Session cookie or X-API-Key header

### Endpoint Reference

#### Classic Records

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/classic?query=NAME` | Optional | Search records |
| GET | `/api/classic/:id` | Required | Fetch record |
| POST | `/api/classic` | Required | Create record |
| PUT | `/api/classic/:id` | Required | Update record |
| DELETE | `/api/classic/:id` | Required | Delete record |

#### User Management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/user/contributor?query=NAME` | Search contributors |
| GET | `/api/user/:id/enterers` | List enterers for authorizer |

#### Authorizer-Enterer (Numeric)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/authent` | List relationships |
| GET | `/api/authent/:id` | Fetch relationship |
| POST | `/api/authent` | Create relationship |
| DELETE | `/api/authent/:id` | Delete relationship |

**Business Rules:**
- Creating authent sets enterer's `current_authorizer` if not set
- Deleting authent clears enterer's `current_authorizer` if it matches
- Prevents orphaned enterers

#### Wing Framework Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/session` | Login (create session) |
| GET | `/api/status` | Health check |
| * | `/api/api-key/*` | API key management |

---

## 9. Authentication & Authorization

### Authentication Methods

1. **Web Login** (`POST /login`)
   - Supports username, email, or "First Last" / "Last, First" name lookup
   - Sessions: 1 day (default) or 30 days (persistent)
   - Bcrypt password hashing (work factor 10)

2. **API Key Authentication**
   - Header: `X-API-Key: your-key`
   - Fine-grained permissions per key

3. **Session Validation**
   - Validates on each request: expiry, password changes, admin status

### User Roles

| Role | Description |
|------|-------------|
| `guest` | Read-only access to public data (default for new accounts) |
| `enterer` | Enter and edit data under authorizer supervision |
| `student` | Similar to enterer; supervised student work |
| `authorizer` | Create, review, release data; supervise enterers |
| `admin` | Superuser; bypass all permission checks |

### Data Access Control (Read)

**Hierarchy:**
1. Superuser → Grant access
2. Data owner (authorizer_no matches) → Grant access
3. Data released (past release_date) → Check access_level
4. Access level:
   - Public (0) → Grant to all
   - Database members (1) → Grant if logged in
   - Group members (2) → Grant if in research group
   - Authorizer only (3) → Deny

### Data Modification Control (Write)

Users can modify data if:
- User is superuser, OR
- User is data owner (authorizer_no matches), OR
- User is explicitly granted permission in permissions table

---

## 10. Core Features & Components

### Collections Management
**Modules:** `PBDB::Collection.pm` (109KB), `PBDB::CollectionEntry.pm` (107KB)

Features:
- Geographic location (coordinates, paleoloc)
- Geological context (formation, member, lithology)
- Stratigraphic intervals
- Access restrictions and release dates

### Taxonomy Management
**Modules:** `PBDB::TaxonInfo.pm` (228KB), `PBDB::Taxon.pm` (111KB), `PBDB::Opinion.pm` (102KB), `PBDB::TaxaCache.pm` (54KB)

Features:
- Taxonomic hierarchy
- Taxonomic opinions (parent-child relationships)
- Synonym and spelling management
- Cached taxonomy tree (nested set encoding)

### Data Export
**Module:** `PBDB::Download.pm` (204KB)

Formats: CSV, TSV, JSON, RIS, Newick
Features: Streaming, filtering, compressed archives

### Geographic Mapping
**Module:** `PBDB::Map.pm` (114KB)
**JavaScript:** `OpenLayers.js` (753KB), `ol.js` (500KB)

Features:
- Modern and paleo-geographic coordinates
- Multiple projections
- Overlay layers

### Data Validation
**Modules:** `PBDB::Validation.pm`, `PBDB::SanityCheck.pm`, `PBDB::TypoChecker.pm` (769 lines)

Features:
- Field-level validation
- Cross-field consistency checks
- Typo detection (Levenshtein distance)
- Coordinate validation

---

## 11. Key Modules Reference

### Largest/Most Critical Modules

| Module | Size | Lines | Purpose |
|--------|------|-------|---------|
| `PBDB::TaxonInfo.pm` | 228KB | ~5,700 | Comprehensive taxon queries |
| `PBDB::Download.pm` | 204KB | ~5,100 | Data export engine |
| `PBDB::Classic.pm` | 127KB | ~3,175 | Main request handler |
| `PBDB::Map.pm` | 114KB | ~2,850 | Geographic mapping |
| `PBDB::Taxon.pm` | 111KB | ~2,775 | Legacy taxonomy ops |
| `PBDB::Collection.pm` | 109KB | ~2,725 | Collection management |
| `PBDB::CollectionEntry.pm` | 107KB | ~2,675 | Collection data entry |
| `PBDB::Opinion.pm` | 102KB | ~2,550 | Taxonomic opinions |

### Module Categories

**Taxonomy:** Taxon, TaxonInfo, Opinion, TaxaCache, PrintHierarchy, Reclassify
**Collections:** Collection, CollectionEntry
**Occurrences:** OccurrenceEntry
**References:** Reference, ReferenceEntry, AuthorNames
**Measurements:** Measurement, MeasurementEntry
**Ecology:** Ecology, EcologyEntry
**Temporal:** TimeLookup, Timescales
**Geographic:** Map
**Export:** Download, DownloadTaxonomy
**Validation:** Validation, SanityCheck, TypoChecker

---

## 12. Deployment Guide

### Docker Build (Two-Stage)

**Stage 1: Preload Image** (~45 minutes)
```bash
docker build -f Dockerfile-preload -t paleomacro_preload .
```

**Stage 2: Application Image** (quick rebuild)
```bash
docker build -t paleomacro_classic .
```

### Running the Container

```bash
docker run -d \
  --name pbdb-classic \
  --restart unless-stopped \
  -p 6000:6000 -p 6001:6001 \
  -v /host/config.yml:/data/MyApp/config.yml:ro \
  -v /host/wing.conf:/data/MyApp/etc/wing.conf:ro \
  -v /host/pbdb.conf:/data/MyApp/pbdb.conf:ro \
  -v /host/logs:/data/MyApp/logs \
  paleomacro_classic
```

### Health Checks

```bash
# Web application
curl http://localhost:6001/classic/

# REST API
curl http://localhost:6000/api/status
```

---

## 13. Development Workflow

### Local Development Setup

```bash
# Install dependencies
cpanm --installdeps .

# Copy configuration templates
cp config.yml.base config.yml
cp etc/wing.conf.base etc/wing.conf
cp pbdb.conf.base pbdb.conf

# Edit configurations
vim etc/wing.conf
vim pbdb.conf

# Deploy schema
dbicdh --schema=MyApp::DB --to_version=8 install
```

### Running Debug Servers

```bash
# Web debug mode (port 6003)
plackup bin/debug_web.psgi

# REST debug mode
plackup bin/debug_rest.psgi
```

### Development Tools

```bash
# Set user password
perl scripts/setpw.pl username new_password

# Copy users from legacy DB
perl scripts/copy_users.pl

# Run taxonomy cache daemon
perl bin/taxa_cached.pl
```

---

## 14. Code Metrics

### File Count Summary

| Category | Count | Total Lines |
|----------|-------|-------------|
| **Perl Modules (lib/)** | 65 | ~56,744+ |
| **JavaScript (public/classic_js/)** | 22 | ~15,000+ |
| **Templates (views/)** | ~50+ | - |
| **SQL Migrations** | 8 versions | - |

### Top JavaScript Files

| File | Size |
|------|------|
| OpenLayers.js | 753KB |
| ol.js (modern) | 500KB |
| xregexp-all.js | 218KB |
| download_generator.js | 118KB |

### Code Complexity by Domain

| Domain | Modules | Complexity |
|--------|---------|------------|
| Taxonomy | 6 | ⭐⭐⭐⭐⭐ (Very High) |
| Export/Download | 2 | ⭐⭐⭐⭐⭐ (Very High) |
| Collections | 2 | ⭐⭐⭐⭐ (High) |
| Mapping | 1 | ⭐⭐⭐⭐ (High) |
| Validation | 3 | ⭐⭐⭐⭐ (High) |

---

## 15. Technical Observations

### 1. Legacy Code Integration
Successfully modernized ~56,744 lines of legacy CGI code into Dancer framework while preserving all domain logic and backward compatibility.

### 2. Dual Database Strategy
Innovative approach to incremental migration:
- Wing database: modern schema, UUID PKs
- Legacy database: preserved as-is
- Linked via `person_no` field

### 3. Domain Complexity
Highly specialized paleontological domain logic requiring domain expertise:
- Taxonomic hierarchies with opinions
- Geological timescales (multiple standards)
- Paleo-geographic reconstruction
- Stratigraphic correlation

### 4. Performance Optimizations
- Taxonomy caching daemon (pre-computed trees)
- FastMmap 512MB in-memory cache
- Nested set encoding for tree queries
- Multi-worker Starman architecture

### 5. Security Model
- Bcrypt password hashing (work factor 10)
- Session validation (password change detection)
- CAPTCHA protection
- Parameterized queries (SQL injection prevention)

### 6. International Scope
- UTF-8 support throughout
- Multi-country contributor base
- ORCID integration
- Multi-language reference support

---

## Recent Development Activity

### Recent Commits

```
3161e54 Bug fix: when a guest is added as somebody's enterer, if they
        don't already have a current authorizer, their current authorizer
        is set to the new authorizer. When an enterer is removed, if their
        current authorizer is the person doing the removing, their current
        authorizer will be set to 0. This fixes the bug where newly added
        enterers were unable to add data.

e264743 Bug fix: the function 'callbackConfig1' was crashing during
        initialization. It no longer does so.
```

**Status:** Active development, live at paleobiodb.org

---

## Contact & Resources

- **GitHub:** github.com:paleobiodb/classic
- **Live Site:** https://paleobiodb.org
- **Email:** admin@paleobiodb.org

---

**Document Version:** 1.0
**Created:** 2026-02-23
**Author:** Claude Code (Automated Documentation)
**Purpose:** Comprehensive technical reference for PBDB Classic legacy API

*This document was generated through systematic exploration of the codebase and serves as a technical reference for developers, maintainers, and stakeholders of the Paleobiology Database Classic project.*
