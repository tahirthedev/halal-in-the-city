# Service Level Agreement (SLA)
## Halal in the City Platform

**Effective Date:** November 10, 2025  
**Version:** 1.0  
**Last Updated:** November 10, 2025

---

## 1. Introduction

This Service Level Agreement ("SLA") describes the service commitments for the Halal in the City platform, including the mobile application, merchant dashboard, admin dashboard, and landing page. This agreement applies to all subscription tiers and defines the performance, availability, and support standards.

---

## 2. Service Components

### 2.1 Covered Services
- **Mobile Application** (iOS & Android)
- **Merchant Dashboard** (Web-based)
- **Admin Dashboard** (Web-based)
- **Landing Page** (Web-based)
- **Backend API Services**
- **Database Services**
- **Authentication Services**
- **Payment Processing Integration**
- **Notification Services**

### 2.2 Subscription Tiers
- **Starter Plan:** $49/month - Up to 3 active deals
- **Growth Plan:** $99/month - Up to 10 active deals
- **Premium Plan:** $199/month - Unlimited active deals

---

## 3. Service Availability

### 3.1 Uptime Commitment

| Service Component | Monthly Uptime Target | Maximum Downtime/Month |
|------------------|----------------------|------------------------|
| Mobile Application | 99.5% | 3.6 hours |
| Merchant Dashboard | 99.5% | 3.6 hours |
| Admin Dashboard | 99.0% | 7.2 hours |
| Backend API | 99.9% | 43 minutes |
| Database Services | 99.9% | 43 minutes |
| Payment Processing | 99.5% | 3.6 hours |

### 3.2 Scheduled Maintenance
- **Frequency:** Monthly maintenance windows
- **Duration:** Maximum 4 hours per month
- **Timing:** Off-peak hours (2:00 AM - 6:00 AM EST)
- **Notice:** Minimum 72 hours advance notification
- **Emergency Maintenance:** Immediate notification via email and in-app alerts

### 3.3 Exclusions from Uptime Calculation
- Scheduled maintenance windows
- Force majeure events
- Client-side connectivity issues
- Third-party service failures (Stripe, cloud providers)
- Issues caused by customer actions or misuse
- DDoS attacks or security incidents

---

## 4. Performance Standards

### 4.1 Response Time Targets

| Operation | Target Response Time | Maximum Response Time |
|-----------|---------------------|----------------------|
| API Requests (GET) | < 200ms | < 500ms |
| API Requests (POST/PUT) | < 300ms | < 1000ms |
| Page Load (Dashboard) | < 2 seconds | < 5 seconds |
| Mobile App Launch | < 3 seconds | < 7 seconds |
| Search Queries | < 500ms | < 2 seconds |
| Image Upload | < 5 seconds | < 15 seconds |
| Deal Creation | < 2 seconds | < 5 seconds |
| Payment Processing | < 3 seconds | < 10 seconds |

### 4.2 Throughput Capacity
- **Concurrent Users:** Support for 10,000+ simultaneous users
- **API Rate Limits:** 
  - Starter: 100 requests/minute
  - Growth: 300 requests/minute
  - Premium: 1000 requests/minute
- **Image Upload Size:** Maximum 5MB per image
- **Batch Operations:** Maximum 100 items per batch

---

## 5. Support Services

### 5.1 Support Channels
- **Email Support:** support@halalinthecity.com
- **In-App Support:** Help Center & Chat
- **Knowledge Base:** docs.halalinthecity.com
- **Emergency Hotline:** For critical issues (Premium tier only)

### 5.2 Response Time by Priority

#### Starter Plan
| Priority Level | Description | Response Time | Resolution Time |
|---------------|-------------|---------------|-----------------|
| Critical | Service down, payment issues | 4 hours | 24 hours |
| High | Major feature broken | 8 hours | 48 hours |
| Medium | Minor bugs, general issues | 24 hours | 5 business days |
| Low | Questions, feature requests | 48 hours | 10 business days |

#### Growth Plan
| Priority Level | Description | Response Time | Resolution Time |
|---------------|-------------|---------------|-----------------|
| Critical | Service down, payment issues | 2 hours | 12 hours |
| High | Major feature broken | 4 hours | 24 hours |
| Medium | Minor bugs, general issues | 12 hours | 3 business days |
| Low | Questions, feature requests | 24 hours | 7 business days |

#### Premium Plan
| Priority Level | Description | Response Time | Resolution Time |
|---------------|-------------|---------------|-----------------|
| Critical | Service down, payment issues | 30 minutes | 4 hours |
| High | Major feature broken | 2 hours | 8 hours |
| Medium | Minor bugs, general issues | 4 hours | 24 hours |
| Low | Questions, feature requests | 8 hours | 3 business days |

### 5.3 Support Hours
- **Email Support:** 24/7 (monitored during business hours, 9 AM - 6 PM EST)
- **Live Chat:** Monday-Friday, 9 AM - 6 PM EST
- **Emergency Support:** 24/7 (Premium tier only)
- **Holidays:** Email support only, extended response times

---

## 6. Data Management

### 6.1 Data Backup
- **Frequency:** Automated daily backups at 3:00 AM EST
- **Retention Period:** 30 days rolling backup
- **Recovery Point Objective (RPO):** 24 hours
- **Recovery Time Objective (RTO):** 4 hours

### 6.2 Data Security
- **Encryption:** AES-256 encryption at rest, TLS 1.3 in transit
- **Access Control:** Role-based access control (RBAC)
- **Authentication:** JWT-based with secure token management
- **Password Policy:** Minimum 8 characters, complexity requirements
- **Session Management:** 24-hour token expiration
- **Audit Logging:** All administrative actions logged

### 6.3 Data Privacy
- **Compliance:** GDPR, CCPA compliant
- **Data Ownership:** Customer retains ownership of all data
- **Data Export:** Available upon request within 72 hours
- **Data Deletion:** Complete deletion within 30 days of account closure
- **PII Protection:** Personal information encrypted and access-controlled

---

## 7. Payment Processing

### 7.1 Payment SLA
- **Transaction Processing:** 99.5% uptime via Stripe integration
- **Payment Confirmation:** Within 5 seconds of successful charge
- **Refund Processing:** Initiated within 24 hours, completed within 5-10 business days
- **Subscription Billing:** Automated monthly billing on subscription anniversary
- **Failed Payment Retry:** Automatic retry after 3 days, then 7 days

### 7.2 Payment Security
- **PCI Compliance:** Level 1 PCI DSS compliant via Stripe
- **Secure Checkout:** SSL/TLS encrypted payment forms
- **Tokenization:** No storage of raw card data
- **Fraud Detection:** Real-time fraud monitoring

---

## 8. Service Credits

### 8.1 Availability Credits
If monthly uptime falls below committed levels, customers are eligible for service credits:

| Actual Uptime | Service Credit |
|---------------|----------------|
| < 99.9% to 99.5% | 10% of monthly fee |
| < 99.5% to 99.0% | 25% of monthly fee |
| < 99.0% to 95.0% | 50% of monthly fee |
| < 95.0% | 100% of monthly fee |

### 8.2 Credit Claim Process
- **Claim Period:** Within 30 days of incident
- **Claim Method:** Email to billing@halalinthecity.com
- **Required Information:** Account details, incident date/time, impact description
- **Processing Time:** Credits applied within 15 business days
- **Credit Form:** Applied to next month's invoice

---

## 9. Monitoring and Reporting

### 9.1 System Monitoring
- **24/7 Monitoring:** Automated system health checks every 60 seconds
- **Alert Triggers:** Immediate alerts for downtime or performance degradation
- **Status Page:** Public status page at status.halalinthecity.com
- **Incident Communication:** Real-time updates via email and status page

### 9.2 Performance Reporting
- **Monthly Reports:** Available to all customers
- **Quarterly Reviews:** Available to Growth and Premium customers
- **Custom Reports:** Available to Premium customers upon request
- **Metrics Included:**
  - Uptime percentage
  - Average response times
  - Support ticket statistics
  - Feature usage analytics

---

## 10. Change Management

### 10.1 Platform Updates
- **Minor Updates:** Weekly releases, no downtime
- **Major Updates:** Monthly releases, scheduled maintenance required
- **Emergency Patches:** As needed for security or critical bugs
- **Notice Period:** 
  - Minor updates: 24 hours
  - Major updates: 7 days
  - Breaking changes: 30 days

### 10.2 API Versioning
- **Version Support:** Current version + 1 previous version
- **Deprecation Notice:** 90 days minimum
- **Documentation:** Updated API docs within 24 hours of release

---

## 11. Responsibilities

### 11.1 Service Provider Responsibilities
- Maintain service availability per SLA targets
- Provide timely support per defined response times
- Ensure data security and privacy
- Perform regular backups and disaster recovery testing
- Monitor system performance and capacity
- Communicate incidents and maintenance windows
- Process service credits when applicable

### 11.2 Customer Responsibilities
- Maintain accurate account information
- Use services in accordance with Terms of Service
- Report issues promptly via supported channels
- Maintain adequate internet connectivity
- Keep login credentials secure
- Use reasonable API rate limits
- Comply with content and usage policies

---

## 12. Service Limitations

### 12.1 Known Limitations
- **API Rate Limits:** As defined in Section 4.2
- **File Upload Sizes:** Maximum 5MB per image
- **Deal Limits:** Based on subscription tier
- **Concurrent Deals:** Maximum active deals per tier
- **Search Results:** Maximum 100 results per query
- **Batch Operations:** Maximum 100 items per batch

### 12.2 Fair Use Policy
Services are subject to fair use policies. Excessive or abusive usage may result in:
- Temporary rate limiting
- Account suspension (with 24-hour notice)
- Service termination (for repeated violations)

---

## 13. Incident Management

### 13.1 Incident Classification
- **P0 - Critical:** Complete service outage affecting all users
- **P1 - High:** Major feature unavailable or severe performance degradation
- **P2 - Medium:** Minor feature issues or isolated user impact
- **P3 - Low:** Cosmetic issues or minimal impact

### 13.2 Incident Response Process
1. **Detection:** Automated monitoring or customer report
2. **Triage:** Priority assignment within SLA response time
3. **Communication:** Initial notification to affected customers
4. **Investigation:** Root cause analysis
5. **Resolution:** Fix implementation and testing
6. **Post-Mortem:** Incident report within 72 hours (P0/P1 only)

---

## 14. Disaster Recovery

### 14.1 Business Continuity
- **Disaster Recovery Plan:** Tested quarterly
- **Failover Capability:** Automated failover to backup systems
- **Geographic Redundancy:** Multi-region deployment
- **Recovery Procedures:** Documented and regularly updated

### 14.2 Recovery Objectives
- **Recovery Time Objective (RTO):** 4 hours
- **Recovery Point Objective (RPO):** 24 hours
- **Data Restoration:** Available from daily backups

---

## 15. Compliance and Certifications

### 15.1 Standards Compliance
- **PCI DSS Level 1** (via Stripe)
- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **SOC 2 Type II** (In progress)
- **ISO 27001** (Planned)

### 15.2 Regular Audits
- **Security Audits:** Quarterly penetration testing
- **Compliance Audits:** Annual third-party audits
- **Code Reviews:** Continuous integration testing
- **Vulnerability Scanning:** Weekly automated scans

---

## 16. SLA Review and Updates

### 16.1 Review Schedule
- **Quarterly Review:** Internal review of SLA performance
- **Annual Review:** Comprehensive SLA update and customer feedback
- **Ad-hoc Updates:** As needed for service improvements

### 16.2 Amendment Process
- **Notice Period:** 30 days minimum for any changes
- **Communication:** Email notification to all customers
- **Acceptance:** Continued use constitutes acceptance
- **Objection Rights:** Customer may terminate without penalty

---

## 17. Contact Information

### 17.1 Support Contacts
- **Technical Support:** support@halalinthecity.com
- **Billing Inquiries:** billing@halalinthecity.com
- **SLA Credits:** credits@halalinthecity.com
- **Emergency Hotline:** +1 (XXX) XXX-XXXX (Premium tier only)

### 17.2 Business Hours
- **Monday - Friday:** 9:00 AM - 6:00 PM EST
- **Saturday - Sunday:** Email support only
- **Holidays:** Emergency support only

---

## 18. Definitions

- **Availability:** Percentage of time the service is operational and accessible
- **Downtime:** Period when service is unavailable to users
- **Incident:** Unplanned interruption or reduction in service quality
- **Maintenance Window:** Scheduled period for system updates
- **Response Time:** Time from incident report to initial acknowledgment
- **Resolution Time:** Time from incident report to complete resolution
- **Uptime:** Total time service is available minus scheduled maintenance

---

## 19. Acceptance

This SLA is incorporated into and forms part of the Terms of Service. By using Halal in the City services, you acknowledge and agree to the terms outlined in this Service Level Agreement.

**Service Provider:**  
Halal in the City  
[Company Address]  
[Contact Information]

**Effective Date:** November 10, 2025

---

## Appendix A: Service Status Codes

| Status Code | Description | User Impact |
|-------------|-------------|-------------|
| 200 - Operational | All systems functioning normally | None |
| 201 - Degraded | Reduced performance but service available | Minor delays |
| 300 - Partial Outage | Some features unavailable | Moderate impact |
| 400 - Major Outage | Critical features unavailable | Significant impact |
| 500 - Full Outage | Complete service unavailable | Complete disruption |

---

## Appendix B: Escalation Matrix

| Level | Role | Contact Method | Escalation Criteria |
|-------|------|----------------|---------------------|
| L1 | Support Team | support@halalinthecity.com | Initial contact |
| L2 | Senior Support | Via L1 escalation | Unresolved after 2 hours (Critical) |
| L3 | Engineering Team | Via L2 escalation | Technical complexity |
| L4 | Technical Director | Via L3 escalation | Extended outage (>4 hours) |
| L5 | Executive Team | Via L4 escalation | Major incident (>12 hours) |

---

*This SLA is subject to change. Customers will be notified of any material changes 30 days in advance.*
