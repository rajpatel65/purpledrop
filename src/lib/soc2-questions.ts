export interface SOC2Question {
  id: string;
  section: string;
  sectionTitle: string;
  criterion: string;
  question: string;
  helpText?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  evidenceHint?: string;
}

export const SOC2_SECTIONS = [
  { id: 'cc1', title: 'Control Environment (CC1)', criterion: 'CC1.0', order: 1 },
  { id: 'cc2', title: 'Communication & Information (CC2)', criterion: 'CC2.0', order: 2 },
  { id: 'cc3', title: 'Risk Assessment (CC3)', criterion: 'CC3.0', order: 3 },
  { id: 'cc4', title: 'Monitoring Activities (CC4)', criterion: 'CC4.0', order: 4 },
  { id: 'cc5', title: 'Control Activities (CC5)', criterion: 'CC5.0', order: 5 },
  { id: 'cc6', title: 'Logical & Physical Access (CC6)', criterion: 'CC6.0', order: 6 },
  { id: 'cc7', title: 'System Operations (CC7)', criterion: 'CC7.0', order: 7 },
  { id: 'cc8', title: 'Change Management (CC8)', criterion: 'CC8.0', order: 8 },
  { id: 'cc9', title: 'Risk Mitigation (CC9)', criterion: 'CC9.0', order: 9 },
] as const;

export const SOC2_QUESTIONS: SOC2Question[] = [
  // CC1 - Control Environment (5 questions)
  {
    id: 'cc1-1',
    section: 'cc1',
    sectionTitle: 'Control Environment',
    criterion: 'CC1.1',
    question: 'Does your company have a written code of conduct or ethics policy that all employees acknowledge annually?',
    helpText: 'A documented policy that sets expectations for ethical behavior, conflicts of interest, and reporting violations.',
    difficulty: 'easy',
    evidenceHint: 'Employee handbook, signed acknowledgments, annual attestation records',
  },
  {
    id: 'cc1-2',
    section: 'cc1',
    sectionTitle: 'Control Environment',
    criterion: 'CC1.2',
    question: 'Is there a defined organizational structure with clear roles, responsibilities, and reporting lines documented?',
    helpText: 'Org chart with role descriptions showing who owns security, compliance, and key operational functions.',
    difficulty: 'easy',
    evidenceHint: 'Org chart, role descriptions, RACI matrix',
  },
  {
    id: 'cc1-3',
    section: 'cc1',
    sectionTitle: 'Control Environment',
    criterion: 'CC1.3',
    question: 'Does the board or leadership team formally review and approve security and compliance objectives at least annually?',
    helpText: 'Evidence that governance bodies are engaged in security oversight, not just delegated.',
    difficulty: 'medium',
    evidenceHint: 'Board meeting minutes, approved security strategy, OKRs with security goals',
  },
  {
    id: 'cc1-4',
    section: 'cc1',
    sectionTitle: 'Control Environment',
    criterion: 'CC1.4',
    question: 'Are background checks performed for all employees with access to sensitive systems or customer data?',
    helpText: 'Includes contractors and vendors with privileged access. Must be documented and repeatable.',
    difficulty: 'medium',
    evidenceHint: 'Background check policy, vendor agreements, HR records, re-check cadence',
  },
  {
    id: 'cc1-5',
    section: 'cc1',
    sectionTitle: 'Control Environment',
    criterion: 'CC1.5',
    question: 'Is there a formal process to evaluate and manage the competence of personnel performing security-critical roles?',
    helpText: 'Training plans, certifications tracked, performance reviews include security competencies.',
    difficulty: 'hard',
    evidenceHint: 'Training matrix, certification tracking, performance review templates, skills assessments',
  },

  // CC2 - Communication & Information (4 questions)
  {
    id: 'cc2-1',
    section: 'cc2',
    sectionTitle: 'Communication & Information',
    criterion: 'CC2.1',
    question: 'Do you have a documented process for communicating security policies and updates to all personnel?',
    helpText: 'How policies are distributed, acknowledged, and tracked. Not just "we sent an email."',
    difficulty: 'easy',
    evidenceHint: 'Policy distribution logs, acknowledgment records, intranet/policy portal analytics',
  },
  {
    id: 'cc2-2',
    section: 'cc2',
    sectionTitle: 'Communication & Information',
    criterion: 'CC2.2',
    question: 'Is there a clear, documented incident reporting channel that employees and contractors can use anonymously?',
    helpText: 'Whistleblower hotline, security@ email, anonymous form — with documented response SLAs.',
    difficulty: 'easy',
    evidenceHint: 'Incident reporting tool, response time logs, anonymity protections documented',
  },
  {
    id: 'cc2-3',
    section: 'cc2',
    sectionTitle: 'Communication & Information',
    criterion: 'CC2.3',
    question: 'Are security roles and responsibilities communicated to external vendors and partners with system access?',
    helpText: 'Vendor contracts include security clauses, NDAs, and clear escalation paths.',
    difficulty: 'medium',
    evidenceHint: 'Vendor agreements, security addenda, vendor onboarding checklists',
  },
  {
    id: 'cc2-4',
    section: 'cc2',
    sectionTitle: 'Communication & Information',
    criterion: 'CC2.4',
    question: 'Do you maintain a current inventory of all information assets (data, systems, devices) with classified sensitivity levels?',
    helpText: 'Asset register with owner, classification (public/internal/confidential/restricted), and review date.',
    difficulty: 'hard',
    evidenceHint: 'Asset inventory tool, classification schema, ownership assignments, annual review evidence',
  },

  // CC3 - Risk Assessment (5 questions)
  {
    id: 'cc3-1',
    section: 'cc3',
    sectionTitle: 'Risk Assessment',
    criterion: 'CC3.1',
    question: 'Is a formal risk assessment performed at least annually (or after significant changes) covering threats to confidentiality, integrity, and availability?',
    helpText: 'Documented methodology, identified risks, likelihood/impact scoring, and risk owner assignments.',
    difficulty: 'medium',
    evidenceHint: 'Risk assessment report, methodology doc, risk register, board presentation',
  },
  {
    id: 'cc3-2',
    section: 'cc3',
    sectionTitle: 'Risk Assessment',
    criterion: 'CC3.2',
    question: 'Does the risk assessment include vendor and third-party risks with access to your systems or data?',
    helpText: 'Vendor risk tiering, due diligence evidence, contractual risk transfer (indemnification, cyber insurance).',
    difficulty: 'medium',
    evidenceHint: 'Vendor risk register, due diligence questionnaires, contract clauses, insurance certs',
  },
  {
    id: 'cc3-3',
    section: 'cc3',
    sectionTitle: 'Risk Assessment',
    criterion: 'CC3.3',
    question: 'Are identified risks mapped to specific mitigation controls with implementation timelines and owners?',
    helpText: 'Risk register shows: Risk → Control → Owner → Target Date → Status. Not just a list of risks.',
    difficulty: 'hard',
    evidenceHint: 'Risk-treatment plan, control mapping matrix, project tracker with dates',
  },
  {
    id: 'cc3-4',
    section: 'cc3',
    sectionTitle: 'Risk Assessment',
    criterion: 'CC3.4',
    question: 'Is there a process to identify and assess risks from emerging technologies (AI/ML, new cloud services, etc.) before adoption?',
    helpText: 'Pre-adoption security review for new tools, especially AI vendors processing your data.',
    difficulty: 'hard',
    evidenceHint: 'Technology review checklist, AI vendor assessments, data processing addenda, approval workflow',
  },
  {
    id: 'cc3-5',
    section: 'cc3',
    sectionTitle: 'Risk Assessment',
    criterion: 'CC3.5',
    question: 'Are risk assessment results reported to leadership with clear residual risk acceptance decisions documented?',
    helpText: 'Leadership formally accepts, mitigates, or transfers each material risk. No implicit acceptance.',
    difficulty: 'hard',
    evidenceHint: 'Risk acceptance memos, leadership sign-off, residual risk register, board minutes',
  },

  // CC4 - Monitoring Activities (4 questions)
  {
    id: 'cc4-1',
    section: 'cc4',
    sectionTitle: 'Monitoring Activities',
    criterion: 'CC4.1',
    question: 'Do you have automated monitoring and alerting for unauthorized access attempts, system anomalies, and security events?',
    helpText: 'SIEM, CloudTrail/CloudWatch alerts, failed login monitoring, privilege escalation detection.',
    difficulty: 'medium',
    evidenceHint: 'SIEM dashboards, alert rules, incident response logs, tuning documentation',
  },
  {
    id: 'cc4-2',
    section: 'cc4',
    sectionTitle: 'Monitoring Activities',
    criterion: 'CC4.2',
    question: 'Are monitoring controls themselves reviewed periodically to ensure they are effective and not generating alert fatigue?',
    helpText: 'Alert tuning log, false positive rate tracking, coverage gap analysis, annual review.',
    difficulty: 'hard',
    evidenceHint: 'Alert review meetings, tuning tickets, coverage matrix, mean-time-to-detect metrics',
  },
  {
    id: 'cc4-3',
    section: 'cc4',
    sectionTitle: 'Monitoring Activities',
    criterion: 'CC4.3',
    question: 'Do you conduct internal audits or control self-assessments at least annually with documented findings and remediation tracking?',
    helpText: 'Not just "we looked at it." Evidence of testing control operating effectiveness.',
    difficulty: 'hard',
    evidenceHint: 'Audit plan, workpapers, findings register, remediation tickets with closure evidence',
  },
  {
    id: 'cc4-4',
    section: 'cc4',
    sectionTitle: 'Monitoring Activities',
    criterion: 'CC4.4',
    question: 'Are key performance and risk indicators (KPIs/KRIs) tracked and reported to leadership monthly?',
    helpText: 'Metrics like: patch latency, access review completion, incident MTTR, training completion rates.',
    difficulty: 'medium',
    evidenceHint: 'Dashboard screenshots, monthly reports, leadership meeting decks, trend analysis',
  },

  // CC5 - Control Activities (5 questions)
  {
    id: 'cc5-1',
    section: 'cc5',
    sectionTitle: 'Control Activities',
    criterion: 'CC5.1',
    question: 'Are access provisioning and deprovisioning processes automated or workflow-driven with approval chains?',
    helpText: 'Joiner/mover/leaver workflows in HRIS/IdP. No manual ticket-only processes.',
    difficulty: 'medium',
    evidenceHint: 'IdP provisioning logs, workflow screenshots, access review evidence, offboarding SLA',
  },
  {
    id: 'cc5-2',
    section: 'cc5',
    sectionTitle: 'Control Activities',
    criterion: 'CC5.2',
    question: 'Is multi-factor authentication enforced for all remote access, administrative consoles, and critical SaaS applications?',
    helpText: 'No exceptions. Includes AWS/GCP/Azure console, GitHub, identity provider, VPN.',
    difficulty: 'easy',
    evidenceHint: 'IdP MFA reports, conditional access policies, admin console screenshots, exception log (should be empty)',
  },
  {
    id: 'cc5-3',
    section: 'cc5',
    sectionTitle: 'Control Activities',
    criterion: 'CC5.3',
    question: 'Are privileged access accounts (admin, root, service accounts) inventoried, time-limited, and monitored?',
    helpText: 'PAM solution or equivalent: check-out/check-in, session recording, just-in-time elevation.',
    difficulty: 'hard',
    evidenceHint: 'PAM logs, privileged account inventory, session recordings, break-glass procedures',
  },
  {
    id: 'cc5-4',
    section: 'cc5',
    sectionTitle: 'Control Activities',
    criterion: 'CC5.4',
    question: 'Do you conduct quarterly user access reviews with evidence of manager certification and revocation of excess access?',
    helpText: "Managers certify their direct reports' access. Excess access revoked within defined SLA.",
    difficulty: 'medium',
    evidenceHint: 'Access review tool exports, manager certifications, revocation tickets, SLA tracking',
  },
  {
    id: 'cc5-5',
    section: 'cc5',
    sectionTitle: 'Control Activities',
    criterion: 'CC5.5',
    question: 'Is data encrypted at rest (databases, backups, file stores) and in transit (TLS 1.2+) with key management documented?',
    helpText: 'KMS/Cloud KMS usage, key rotation policy, certificate management, no self-signed certs in prod.',
    difficulty: 'medium',
    evidenceHint: 'Encryption config screenshots, key rotation logs, certificate inventory, TLS scanner results',
  },

  // CC6 - Logical & Physical Access (6 questions)
  {
    id: 'cc6-1',
    section: 'cc6',
    sectionTitle: 'Logical & Physical Access',
    criterion: 'CC6.1',
    question: 'Is network segmentation implemented to isolate production, staging, development, and management networks?',
    helpText: 'VPCs, security groups, NACLs, zero-trust network access. No flat networks.',
    difficulty: 'hard',
    evidenceHint: 'Network diagrams, security group rules, VPC flow logs, segmentation test results',
  },
  {
    id: 'cc6-2',
    section: 'cc6',
    sectionTitle: 'Logical & Physical Access',
    criterion: 'CC6.2',
    question: 'Are wireless networks secured with WPA3-Enterprise or certificate-based authentication (no shared PSKs)?',
    helpText: 'Corporate WiFi uses 802.1X/EAP-TLS. Guest network isolated. IoT on separate VLAN.',
    difficulty: 'medium',
    evidenceHint: 'WiFi config, RADIUS logs, network diagrams, guest network isolation test',
  },
  {
    id: 'cc6-3',
    section: 'cc6',
    sectionTitle: 'Logical & Physical Access',
    criterion: 'CC6.3',
    question: 'Are physical access controls (badges, visitors, server rooms) logged and reviewed for anomalies?',
    helpText: 'Badge logs, visitor sign-in, server room access, tailgating prevention, quarterly review.',
    difficulty: 'medium',
    evidenceHint: 'Badge system reports, visitor logs, server room access list, review meeting notes',
  },
  {
    id: 'cc6-4',
    section: 'cc6',
    sectionTitle: 'Logical & Physical Access',
    criterion: 'CC6.4',
    question: 'Is there a documented process for secure disposal of media (drives, laptops, paper) with certificates of destruction?',
    helpText: 'NIST 800-88 compliant wiping, degaussing, or physical destruction. Vendor certificates retained.',
    difficulty: 'easy',
    evidenceHint: 'Disposal policy, vendor certificates, asset disposal log, chain of custody forms',
  },
  {
    id: 'cc6-5',
    section: 'cc6',
    sectionTitle: 'Logical & Physical Access',
    criterion: 'CC6.5',
    question: 'Are development and test environments logically separated from production with no shared credentials or data?',
    helpText: 'No prod data in non-prod. No shared service accounts. Synthetic/anonymized test data only.',
    difficulty: 'hard',
    evidenceHint: 'Environment architecture, data masking tools, credential vault separation, audit logs',
  },
  {
    id: 'cc6-6',
    section: 'cc6',
    sectionTitle: 'Logical & Physical Access',
    criterion: 'CC6.6',
    question: 'Do you restrict and monitor remote access (VPN, zero-trust) with device posture checks (OS version, disk encryption, EDR)?',
    helpText: 'Device trust verification before granting access. Non-compliant devices blocked or quarantined.',
    difficulty: 'hard',
    evidenceHint: 'ZTNA/VPN config, device compliance policies, posture check logs, blocked device reports',
  },

  // CC7 - System Operations (5 questions)
  {
    id: 'cc7-1',
    section: 'cc7',
    sectionTitle: 'System Operations',
    criterion: 'CC7.1',
    question: 'Is there a documented vulnerability management program with defined SLAs for patching (critical ≤ 7 days, high ≤ 30 days)?',
    helpText: 'Scanner coverage (OS, apps, containers, IaC), SLA tracking, exception process with risk acceptance.',
    difficulty: 'medium',
    evidenceHint: 'Vulnerability scanner reports, patch deployment logs, SLA dashboard, exception register',
  },
  {
    id: 'cc7-2',
    section: 'cc7',
    sectionTitle: 'System Operations',
    criterion: 'CC7.2',
    question: 'Are all changes to production systems managed through a formal change control process with approval and rollback plans?',
    helpText: 'Change advisory board (CAB) or automated gate. Emergency changes have post-implementation review.',
    difficulty: 'medium',
    evidenceHint: 'Change management tool, approval records, rollback test evidence, emergency change log',
  },
  {
    id: 'cc7-3',
    section: 'cc7',
    sectionTitle: 'System Operations',
    criterion: 'CC7.3',
    question: 'Do you have a tested incident response plan with defined roles, communication templates, and escalation paths?',
    helpText: 'IR plan < 1 year old. Tabletop exercise within 12 months. Runbooks for top 5 scenarios.',
    difficulty: 'medium',
    evidenceHint: 'IR plan document, tabletop exercise report, runbooks, communication templates, contact tree',
  },
  {
    id: 'cc7-4',
    section: 'cc7',
    sectionTitle: 'System Operations',
    criterion: 'CC7.4',
    question: 'Are backups performed daily, encrypted, stored off-site/immutable, and restoration tested quarterly?',
    helpText: 'RPO/RTO documented. Immutable storage (WORM). Test restoration logs with data integrity verification.',
    difficulty: 'medium',
    evidenceHint: 'Backup job logs, encryption config, immutable storage config, restoration test reports',
  },
  {
    id: 'cc7-5',
    section: 'cc7',
    sectionTitle: 'System Operations',
    criterion: 'CC7.5',
    question: 'Is there a capacity management process monitoring compute, storage, and network utilization with scaling triggers?',
    helpText: 'Autoscaling configured, capacity alerts, trend forecasting, cost-aware scaling policies.',
    difficulty: 'hard',
    evidenceHint: 'Monitoring dashboards, autoscaling policies, capacity planning docs, cost optimization reports',
  },

  // CC8 - Change Management (4 questions)
  {
    id: 'cc8-1',
    section: 'cc8',
    sectionTitle: 'Change Management',
    criterion: 'CC8.1',
    question: 'Are infrastructure and configuration changes managed as code (IaC) with version control, peer review, and automated testing?',
    helpText: 'Terraform/CloudFormation/Pulumi in Git. PR required. Plan/apply separation. Policy-as-code (OPA/Sentinel).',
    difficulty: 'hard',
    evidenceHint: 'Git repo with PR history, policy-as-code rules, plan outputs, drift detection alerts',
  },
  {
    id: 'cc8-2',
    section: 'cc8',
    sectionTitle: 'Change Management',
    criterion: 'CC8.2',
    question: 'Is there a defined software development lifecycle (SDLC) with security gates (SAST, DAST, SCA, secrets scanning) in CI/CD?',
    helpText: 'Pipeline fails on critical findings. Security tools integrated, not just reporting.',
    difficulty: 'hard',
    evidenceHint: 'CI/CD pipeline config, security tool configs, failed build examples, gate bypass log (should be empty)',
  },
  {
    id: 'cc8-3',
    section: 'cc8',
    sectionTitle: 'Change Management',
    criterion: 'CC8.3',
    question: 'Are third-party libraries and dependencies tracked with automated vulnerability scanning and update policies?',
    helpText: 'Dependabot/Renovate/SCA tool. License compliance. Supply chain integrity (SLSA, sigstore).',
    difficulty: 'medium',
    evidenceHint: 'SBOM generation, SCA scan results, dependency update PRs, license policy, supply chain attestations',
  },
  {
    id: 'cc8-4',
    section: 'cc8',
    sectionTitle: 'Change Management',
    criterion: 'CC8.4',
    question: 'Do you maintain a configuration management database (CMDB) or equivalent tracking all production assets and relationships?',
    helpText: 'Single source of truth for: what exists, who owns it, what it depends on, change history.',
    difficulty: 'hard',
    evidenceHint: 'CMDB screenshots, asset relationships, ownership data, integration with change management',
  },

  // CC9 - Risk Mitigation (4 questions)
  {
    id: 'cc9-1',
    section: 'cc9',
    sectionTitle: 'Risk Mitigation',
    criterion: 'CC9.1',
    question: 'Are business continuity and disaster recovery plans documented, tested annually, and include RTO/RPO targets?',
    helpText: 'BCP/DRP < 1 year old. Annual failover test. RTO/RPO by system tier. Communication plan included.',
    difficulty: 'hard',
    evidenceHint: 'BCP/DRP documents, failover test report, RTO/RPO matrix, communication templates',
  },
  {
    id: 'cc9-2',
    section: 'cc9',
    sectionTitle: 'Risk Mitigation',
    criterion: 'CC9.2',
    question: 'Do you have cyber insurance with coverage for ransomware, business interruption, and regulatory defense?',
    helpText: 'Policy covers first-party (response, recovery) and third-party (liability) costs. Retention limits documented.',
    difficulty: 'easy',
    evidenceHint: 'Insurance policy, coverage summary, renewal date, claims process documentation',
  },
  {
    id: 'cc9-3',
    section: 'cc9',
    sectionTitle: 'Risk Mitigation',
    criterion: 'CC9.3',
    question: 'Is there a vendor management program with tiered due diligence, contractual security requirements, and ongoing monitoring?',
    helpText: 'Critical vendors reassessed annually. Contracts include: right-to-audit, breach notification, data return/destruction.',
    difficulty: 'medium',
    evidenceHint: 'Vendor tiering matrix, due diligence questionnaires, contract clauses, monitoring reports',
  },
  {
    id: 'cc9-4',
    section: 'cc9',
    sectionTitle: 'Risk Mitigation',
    criterion: 'CC9.4',
    question: 'Do you conduct annual penetration testing (external, internal, application) with remediation tracking to closure?',
    helpText: 'Third-party tester. Scope includes all internet-facing assets. Retest after remediation. Report shared with auditors.',
    difficulty: 'hard',
    evidenceHint: 'Pen test report (redacted), remediation tickets, retest evidence, tracker with closure dates',
  },
];

export function getQuestionsBySection(sectionId: string): SOC2Question[] {
  return SOC2_QUESTIONS.filter(q => q.section === sectionId);
}

export function getSectionProgress(answers: Record<string, 'yes' | 'no' | 'dont_know'>, sectionId: string): { answered: number; total: number; gaps: number } {
  const questions = getQuestionsBySection(sectionId);
  let answered = 0;
  let gaps = 0;
  for (const q of questions) {
    const answer = answers[q.id];
    if (answer) {
      answered++;
      if (answer === 'no' || answer === 'dont_know') gaps++;
    }
  }
  return { answered, total: questions.length, gaps };
}

export function getOverallStats(answers: Record<string, 'yes' | 'no' | 'dont_know'>): { total: number; answered: number; yes: number; no: number; dontKnow: number; gaps: number; completionPct: number } {
  let answered = 0, yes = 0, no = 0, dontKnow = 0, gaps = 0;
  for (const q of SOC2_QUESTIONS) {
    const answer = answers[q.id];
    if (answer) {
      answered++;
      if (answer === 'yes') yes++;
      else if (answer === 'no') { no++; gaps++; }
      else if (answer === 'dont_know') { dontKnow++; gaps++; }
    }
  }
  return {
    total: SOC2_QUESTIONS.length,
    answered,
    yes,
    no,
    dontKnow,
    gaps,
    completionPct: Math.round((answered / SOC2_QUESTIONS.length) * 100),
  };
}