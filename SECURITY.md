# Privacy & Security Documentation

## Overview
Eid Mubarak implements privacy-first design with no user tracking, account requirements, or data collection.

## Hash Security

### Hash Generation
- **Algorithm**: SHA-256 truncated to 16 hexadecimal characters
- **Source**: UUID v4 (128-bit random)
- **Entropy**: 64-bit (16 hex chars = 2^64 possible values)
- **Collision Probability**: Negligible (1 in 18.4 quintillion)

### Hash Format
```
Format:     [a-f0-9]{16}
Example:    a1b2c3d4e5f6g7h8
Length:     Exactly 16 characters
Uniqueness: Non-sequential, non-predictable
```

### Why 16 Characters?
- **Brute Force Protection**: 2^64 combinations
- **Time to enumerate**: ~292 billion years (1000 guesses/sec)
- **URL Safe**: Fits naturally in URLs without encoding
- **Memorable**: Long enough to be unique, short enough for manual entry

## No API Enumeration

### Available Endpoints
✅ `POST /api/wishes` - Create new wish (returns hash)
✅ `GET /api/wishes/[hash]` - Retrieve specific wish by hash

### Disabled Endpoints
❌ No `GET /api/wishes` - Cannot list all wishes
❌ No `GET /api/wishes?page=X` - No pagination
❌ No sequential ID patterns - Cannot guess IDs

## Privacy Features

### Hash Validation
```typescript
// Strict validation
- Must be exactly 16 characters
- Must contain only hex digits (a-f, 0-9)
- Rejects: wrong length, invalid chars, special chars
- Returns 404 for invalid format (prevents enumeration)
```

### Error Handling
```typescript
// Privacy-conscious errors
- All not-found errors return generic "Wish not found"
- No error messages reveal:
  ✗ Why wish is missing (expired vs deleted vs never existed)
  ✗ Hash format rejections
  ✗ Database errors
  ✗ Server internals
```

### Expiration
- **Default TTL**: 30 days from creation
- **Auto-cleanup**: Expired wishes removed on access attempt
- **User Privacy**: Cannot determine if wish expired (all return 404)

## API Security Headers

### Create Wish (POST)
```
Cache-Control:      no-store, no-cache, must-revalidate
X-Content-Type-Options: nosniff
X-Frame-Options:    DENY
X-XSS-Protection:   1; mode=block
```

### Retrieve Wish (GET)
```
Cache-Control:      private, max-age=3600 (1 hour)
X-Content-Type-Options: nosniff
```

### Not Found (404)
```
Cache-Control:      public, max-age=60 (1 minute)
```

## Data Protection

### What We Store
```javascript
{
  hash: "a1b2c3d4e5f6g7h8",      // Unique identifier
  recipientName: "string",        // User provided
  message: "string",              // User provided
  createdAt: "ISO8601",          // Timestamp
  expiresAt: "ISO8601"           // Auto-expiration date
}
```

### What We Don't Store
- ✗ User IP addresses
- ✗ User identifying information
- ✗ Browser fingerprints
- ✗ Analytics/tracking data
- ✗ A list of wishes (only individual files)

### Storage
- **Location**: `data/wishes/{hash}.json`
- **Format**: Individual JSON files per wish
- **Isolation**: Each wish is separate, no index
- **No Database**: File-based storage prevents complex queries

## Input Validation

### Recipient Name
- **Min**: 1 character
- **Max**: 100 characters
- **Type**: String only
- **Validation**: Checks on server before storage

### Message
- **Min**: 1 character
- **Max**: 5000 characters
- **Type**: String only
- **Validation**: Checks on server before storage

## Brute Force Protection

### Current Implementation
- 16-character hexadecimal hashes (2^64 combinations)
- Generic error messages (cannot tell valid vs invalid)
- Standard rate limiting via infrastructure

### Recommended at Deployment
```nginx
# Rate limiting at reverse proxy level
limit_req_zone $binary_remote_addr zone=wishes:10m rate=10r/m;
limit_req zone=wishes burst=20 nodelay;

# IP-based blocking for suspicious patterns
# Implement via WAF or similar
```

### Infrastructure Recommendations
- Deploy behind reverse proxy (nginx, Cloudflare)
- Enable DDoS protection
- Monitor failed request patterns
- Implement IP-based rate limits

## Client-Side Security

### Wish Page
- Client-side hash validation before API call
- Generic error handling
- No error details exposed
- No direct file access

### Form Submission
- Input length validation on client
- Server-side validation before storage
- No sensitive data in response
- Redirect to anonymous hash-based URL

## Deployment Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure cookie flags
- [ ] Enable CORS only for own domain
- [ ] Configure CSP headers
- [ ] Monitor for brute force attempts
- [ ] Regular backups of `data/` directory
- [ ] File permissions: `600` on wish files
- [ ] Regular expiration cleanup job

## Disaster Recovery

### Data Loss Prevention
```bash
# Backup wishes daily
0 2 * * * tar -czf /backup/wishes-$(date +%Y%m%d).tar.gz /app/data/wishes/
```

### Retention Policy
- Keep wishes for 30 days minimum
- Archive deleted wishes for 90 days
- Completely purge after 120 days

## Future Enhancements

- [ ] Optional password protection per wish
- [ ] Encrypted wish storage option
- [ ] View count tracking (privacy-preserving)
- [ ] Optional self-destruct timer
- [ ] Bulk hash generation tool

## Security Audit

Regular security reviews should check:
- ✓ Hash uniqueness and randomness
- ✓ No information leakage in errors
- ✓ Rate limiting effectiveness
- ✓ Input validation coverage
- ✓ Expiration cleanup running
- ✓ File permissions correct
- ✓ No debug info in logs
