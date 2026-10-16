import { ChecklistItem, CustomChecklistPreset } from '../types/compliance';

export const PROJECT_REPORT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'pr-title',
    label: 'Document Title & Author',
    category: 'required_field',
    description: 'Document must feature a clear project title and author/team identification.',
    required: true,
    weight: 10,
    keywords: ['title', 'author', 'prepared by', 'submitted by', 'team', 'project name'],
    helpFix: 'Add a clear Title header (e.g., "# Project Name") followed by "Author: [Your Name]" at the top.'
  },
  {
    id: 'pr-abstract',
    label: 'Abstract / Executive Summary',
    category: 'section',
    description: 'A concise summary outlining problem, approach, and key findings (at least 40 words).',
    required: true,
    weight: 15,
    keywords: ['abstract', 'executive summary', 'overview', 'summary'],
    helpFix: 'Include an "Abstract" or "Executive Summary" section summarizing your problem statement, solution, and core outcomes.'
  },
  {
    id: 'pr-problem',
    label: 'Problem Statement & Challenge',
    category: 'section',
    description: 'Explicit description of the root problem, operational bottleneck, or research gap being addressed.',
    required: true,
    weight: 15,
    keywords: ['problem statement', 'the problem', 'challenge', 'research gap', 'motivation', 'operational bottleneck'],
    helpFix: 'Dedicate an explicit "Problem Statement" section articulating the specific challenge or limitation before introducing your solution.'
  },
  {
    id: 'pr-solution',
    label: 'Proposed Solution & Approach (Mentioned Separately)',
    category: 'section',
    description: 'Separately articulated description of the proposed technical or scientific solution.',
    required: true,
    weight: 15,
    keywords: ['proposed solution', 'solution', 'proposed system', 'our approach', 'system architecture', 'methodology'],
    helpFix: 'Present your "Proposed Solution" as a separate, distinct section detailing how your approach directly tackles the stated problem.'
  },
  {
    id: 'pr-results',
    label: 'Results & Performance Evaluation',
    category: 'section',
    description: 'Empirical results, benchmarks, testing outcomes, or measurable project deliverables.',
    required: true,
    weight: 20,
    keywords: ['results', 'evaluation', 'testing', 'performance', 'findings', 'experimental results'],
    helpFix: 'Add a "Results" or "Evaluation" section displaying metrics, user testing outcomes, or system benchmark data.'
  },
  {
    id: 'pr-conclusion',
    label: 'Proper Conclusion & Problem Resolution',
    category: 'section',
    description: 'A proper conclusion synthesizing how the proposed solution resolved the original problem, key outcomes, and future directions.',
    required: true,
    weight: 15,
    keywords: ['conclusion', 'conclusions', 'problem resolution', 'summary and conclusion', 'final remarks', 'future work'],
    helpFix: 'Include a comprehensive "Conclusion" section that explicitly answers how the proposed solution resolved the initial problem.'
  },
  {
    id: 'pr-references',
    label: 'References / Citations',
    category: 'section',
    description: 'Academic or technical citations and source references.',
    required: true,
    weight: 10,
    keywords: ['references', 'bibliography', 'citations', 'sources'],
    helpFix: 'Include a "References" or "Bibliography" section listing academic papers, articles, or documentation cited.'
  },
  {
    id: 'pr-submission-date',
    label: 'Submission Date / Year',
    category: 'required_field',
    description: 'Valid submission timestamp or academic calendar year.',
    required: false,
    weight: 5,
    keywords: ['date', 'submitted on', 'academic year', 'semester', 'october', '202'],
    patterns: ['\\b(202[0-9]|january|february|march|april|may|june|july|august|september|october|november|december)\\b'],
    helpFix: 'Include the date of submission or academic term (e.g., "Date: October 2026").'
  }
];

export const RESUME_CHECKLIST: ChecklistItem[] = [
  {
    id: 'res-contact-name',
    label: 'Full Name & Header',
    category: 'required_field',
    description: 'Prominent applicant name at the top of the resume.',
    required: true,
    weight: 15,
    keywords: ['name'],
    helpFix: 'Ensure your full name appears prominently at the very beginning of the document.'
  },
  {
    id: 'res-contact-info',
    label: 'Contact Information (Email & Phone)',
    category: 'required_field',
    description: 'Verifiable email address and phone number for recruiter communication.',
    required: true,
    weight: 20,
    keywords: ['email', 'phone', 'contact', 'linkedin', 'github'],
    patterns: ['[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', '(\\+?[0-9]{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}'],
    helpFix: 'Provide a valid email (e.g., name@example.com) and phone number in your contact header.'
  },
  {
    id: 'res-summary',
    label: 'Professional Summary / Objective',
    category: 'section',
    description: 'A 2-4 sentence summary of your career focus, specialization, and value proposition.',
    required: false,
    weight: 10,
    keywords: ['summary', 'professional summary', 'career objective', 'about me', 'profile'],
    helpFix: 'Add a brief 2-3 line "Professional Summary" highlighting your core expertise and years of experience.'
  },
  {
    id: 'res-experience',
    label: 'Work Experience & Impact Metrics',
    category: 'section',
    description: 'Reverse chronological work history with measurable impact and action verbs.',
    required: true,
    weight: 25,
    keywords: ['experience', 'work experience', 'employment', 'internships', 'professional experience'],
    helpFix: 'Detail your employment history with company names, roles, dates, and bullet points with metrics (e.g. "improved efficiency by 30%").'
  },
  {
    id: 'res-education',
    label: 'Education & Degree Information',
    category: 'section',
    description: 'Degree, institution name, major, and graduation year.',
    required: true,
    weight: 15,
    keywords: ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'b.tech', 'b.s.'],
    helpFix: 'Include your university or college name, degree received, graduation date, and relevant coursework/GPA.'
  },
  {
    id: 'res-skills',
    label: 'Skills & Technical Competencies',
    category: 'section',
    description: 'Categorized technical, tool, and domain competencies.',
    required: true,
    weight: 15,
    keywords: ['skills', 'technical skills', 'technologies', 'tools', 'competencies'],
    helpFix: 'List your programming languages, frameworks, cloud tools, and domain skills under a "Skills" section.'
  }
];

export const APPLICATION_CHECKLIST: ChecklistItem[] = [
  {
    id: 'app-applicant-id',
    label: 'Applicant Name & Contact Details',
    category: 'required_field',
    description: 'Official candidate or organization identity with active email.',
    required: true,
    weight: 15,
    keywords: ['applicant', 'candidate', 'contact', 'name', 'email'],
    patterns: ['[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'],
    helpFix: 'State your full name, organization (if applicable), and contact email at the head of the application.'
  },
  {
    id: 'app-statement',
    label: 'Statement of Purpose / Cover Letter',
    category: 'section',
    description: 'Clear statement addressing motivation, alignment with opportunity, and goals.',
    required: true,
    weight: 25,
    keywords: ['statement of purpose', 'motivation', 'cover letter', 'why apply', 'purpose'],
    helpFix: 'Include a dedicated "Statement of Purpose" explaining why you are applying and how your background aligns.'
  },
  {
    id: 'app-qualifications',
    label: 'Qualifications & Past Achievements',
    category: 'section',
    description: 'Demonstrated experience, relevant qualifications, and track record.',
    required: true,
    weight: 20,
    keywords: ['qualifications', 'credentials', 'experience', 'achievements', 'background'],
    helpFix: 'List key qualifications, certifications, and prior project outcomes that validate your readiness.'
  },
  {
    id: 'app-timeline-budget',
    label: 'Execution Plan or Timeline',
    category: 'section',
    description: 'Proposed milestones, duration, or budget if applicable.',
    required: true,
    weight: 20,
    keywords: ['timeline', 'milestones', 'schedule', 'budget', 'deliverables', 'phases'],
    helpFix: 'Outline project milestones or availability timeline (e.g., Phase 1, Phase 2, estimated duration).'
  },
  {
    id: 'app-declaration',
    label: 'Declaration / Sign-off Date',
    category: 'policy',
    description: 'Formal sign-off, date, and confirmation of accuracy.',
    required: true,
    weight: 10,
    keywords: ['declaration', 'signature', 'date', 'sincerely', 'regards', 'submitted by'],
    helpFix: 'End with a professional closing, date, and applicant sign-off.'
  }
];

export const RESEARCH_PROPOSAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'rp-title',
    label: 'Research Title & Principal Investigator',
    category: 'required_field',
    description: 'Academic title and primary investigator/student designation.',
    required: true,
    weight: 10,
    keywords: ['title', 'investigator', 'researcher', 'department', 'advisor'],
    helpFix: 'Provide an academic title along with the Principal Investigator and department name.'
  },
  {
    id: 'rp-problem',
    label: 'Problem Statement & Motivation',
    category: 'section',
    description: 'Identification of the research gap and academic significance.',
    required: true,
    weight: 20,
    keywords: ['problem statement', 'motivation', 'research gap', 'background', 'significance'],
    helpFix: 'Articulate the exact research gap and why solving it matters in the Problem Statement.'
  },
  {
    id: 'rp-literature',
    label: 'Literature Review / Prior Work',
    category: 'section',
    description: 'Critical synthesis of existing published research in the domain.',
    required: true,
    weight: 20,
    keywords: ['literature review', 'related work', 'prior research', 'state of the art'],
    helpFix: 'Add a "Literature Review" section summarizing current methodologies and limitations in the literature.'
  },
  {
    id: 'rp-methodology',
    label: 'Research Methodology & Experimental Design',
    category: 'section',
    description: 'Clear hypothesis, dataset acquisition plan, and evaluation metrics.',
    required: true,
    weight: 20,
    keywords: ['methodology', 'experimental design', 'hypotheses', 'data collection', 'framework'],
    helpFix: 'Describe your experimental setup, datasets, mathematical models, or research framework.'
  },
  {
    id: 'rp-timeline',
    label: 'Research Timeline & Milestones',
    category: 'section',
    description: 'Work package breakdown across academic quarters or months.',
    required: true,
    weight: 15,
    keywords: ['timeline', 'milestones', 'gantt', 'work plan', 'phases'],
    helpFix: 'Provide an estimated timeline detailing deliverables across months or quarters.'
  },
  {
    id: 'rp-references',
    label: 'Scholarly References',
    category: 'section',
    description: 'Peer-reviewed journals, conference proceedings, or book citations.',
    required: true,
    weight: 15,
    keywords: ['references', 'bibliography', 'works cited'],
    helpFix: 'List at least 4-5 academic citations in standard format (IEEE, APA, or ACM).'
  }
];

export const DEFAULT_PRESETS: CustomChecklistPreset[] = [
  {
    id: 'preset-project-report',
    name: 'College & Engineering Project Report',
    description: 'Standard academic compliance for final year capstone, engineering, and CS projects.',
    targetType: 'project_report',
    items: PROJECT_REPORT_CHECKLIST
  },
  {
    id: 'preset-resume',
    name: 'Professional Tech Resume',
    description: 'Industry-grade CV structure, ATS readability, contact validation, and metrics check.',
    targetType: 'resume',
    items: RESUME_CHECKLIST
  },
  {
    id: 'preset-application',
    name: 'Academic & Grant Application',
    description: 'Statement of purpose, credentials, milestones, and formal declarations.',
    targetType: 'application',
    items: APPLICATION_CHECKLIST
  },
  {
    id: 'preset-research-proposal',
    name: 'Academic Research Proposal',
    description: 'Problem formulation, literature review, methodology, timeline, and scholarly references.',
    targetType: 'research_proposal',
    items: RESEARCH_PROPOSAL_CHECKLIST
  }
];

// Realistic Sample Documents for Hackathon Demo & Testing
export const SAMPLE_DOCUMENTS = {
  // Demo Scenario with deliberate flaws as specified in the prompt!
  project_report_flawed: {
    title: 'Autonomous Agricultural Drone Navigation System (Flawed Draft)',
    type: 'project_report' as const,
    content: `# Autonomous Agricultural Drone Navigation System

Prepared by: Team AeroAgri (Rohan Sharma, Maya Patel)

## Abstract
This project proposes an intelligent autonomous drone navigation platform designed for high-precision crop health monitoring and pesticide dispersion in small-to-medium agricultural holdings. Using edge-computed computer vision algorithms on an NVIDIA Jetson Nano paired with multispectral sensors, the system detects early leaf blight with low latency.

## Objectives
- Build an autonomous aerial vehicle capable of 25-minute flight duration over 10-acre fields.
- Implement real-time crop disease localization using convolutional neural networks (YOLOv8-nano).
- Transmit low-bandwidth telemetry to a centralized farmer dashboard via LoRaWAN.

## Methodology & Architecture
The system consists of three interconnected subsystems:
1. Aerial Platform: Carbon-fiber hexacopter chassis with Pixhawk 4 autopilot running ArduPilot firmware.
2. Edge Vision Pipeline: Raspberry Pi Global Shutter camera connected via MIPI CSI to the NVIDIA Jetson Nano processing unit.
3. Communications: SX1262 LoRa module transmitting telemetry packets every 3 seconds to a base station gateway.

[TODO: Insert flight test bench specifications and telemetry packet schema before submission]

The system consists of three interconnected subsystems:
1. Aerial Platform: Carbon-fiber hexacopter chassis with Pixhawk 4 autopilot running ArduPilot firmware.
2. Edge Vision Pipeline: Raspberry Pi Global Shutter camera connected via MIPI CSI to the NVIDIA Jetson Nano processing unit.

(Note: Notice how Results & Evaluation, Conclusions, References, and Date are deliberately omitted, and a duplicate paragraph exists in Methodology)`
  },

  project_report_compliant: {
    title: 'Autonomous Agricultural Drone Navigation System (Compliant)',
    type: 'project_report' as const,
    content: `# Autonomous Agricultural Drone Navigation System

Prepared by: Team AeroAgri (Rohan Sharma, Maya Patel)
Department of Robotics Engineering
Date: October 14, 2026

## Abstract
This project proposes an intelligent autonomous drone navigation platform designed for high-precision crop health monitoring in medium-sized agricultural holdings. Using edge-computed computer vision algorithms on an NVIDIA Jetson Orin Nano paired with multispectral sensors, the system identifies early crop disease with minimal latency. Over 45 field trials, the platform achieved a 94.2% detection precision while reducing chemical usage by 38%.

## 1. Problem Statement & Operational Challenge
Agricultural smallholders lose up to 32% of seasonal crop yields to late-detected fungal blights and pest infestations. Conventional satellite imagery lacks the spatial resolution required for early-stage foliar lesion identification, while manual crop walking is labor-prohibitive across multi-acre terrains. Furthermore, high-bandwidth cloud drone solutions fail in rural topographies lacking cellular connectivity.

## 2. Proposed Solution & Technological Approach (Separately Detailed)
To address the latency and connectivity constraints of existing inspection methods, this project introduces the AeroAgri autonomous edge-perception platform. Rather than streaming high-bandwidth uncompressed video to cloud data centers, our proposed solution implements:
- On-Device Intelligence: Real-time inference executed directly aboard an onboard Jetson Orin Nano compute unit running quantized YOLO models.
- Targeted Precision Dispersion: Micro-actuator spot-spraying that treats only infected canopy clusters, avoiding blanket pesticide dispersion.
- Offline-First Telemetry: Low-bandwidth LoRaWAN mesh communication transmitting only coordinate hot-spots to a localized base station.

## 3. System Architecture & Implementation
The system architecture comprises three tightly coupled tiers:
1. Physical Airframe & Avionics: Custom carbon-fiber hexacopter with Pixhawk 6C flight controller executing PX4 Autopilot. Geo-fencing algorithms enforce strict field boundaries.
2. Edge Perception Module: Dual Sony IMX477 camera array running a pruned MobileNetV3-YOLO model optimized with TensorRT FP16 quantization.
3. Ground Station & Telemetry: Microcontroller-driven LoRa gateway receiving telemetry packets over 915 MHz frequency band, pushing geo-tagged disease hot-spots to a localized SQLite datastore.

## 4. Results & Performance Evaluation
During testing across 12 distinct vineyard test plots over three weeks:
- Detection Accuracy: The pruned model attained 94.2% mAP@0.5 against a ground-truth dataset of 4,200 labeled leaves.
- Power Profile: The entire compute payload operated at an average draw of 11.4 Watts, preserving battery life.
- Spray Efficiency: Targeted spot-spraying decreased active pesticide volume by 38.4% compared to uniform broadcast spraying.

## 5. Proper Conclusion & Problem Resolution
In addressing the severe agricultural losses caused by delayed foliar disease detection, the AeroAgri autonomous aerial platform demonstrated that on-device computer vision successfully resolves the rural connectivity bottleneck and delivers sub-centimeter diagnostic accuracy. By achieving 94.2% detection precision at 11.4 Watts power consumption and reducing active chemical runoff by 38.4%, the proposed edge solution definitively solves the manual crop-scouting dilemma. Future enhancements will integrate RTK-GPS for multi-drone swarm coordination.

## References
1. Zhang, L., et al. (2024). "Edge AI in Precision Agriculture: A Survey of Low-Power Computer Vision Models." IEEE Transactions on Agri-Informatics, 12(3), 145-159.
2. ArduPilot Development Team. (2025). "PX4 and ArduPilot Autonomous Navigation Protocols." Open Robotics Foundation.
3. Patel, M. & Sharma, R. (2025). "LoRaWAN Sensor Networks in Rural Topography." Journal of Field Robotics, 8(2), 89-102.`
  },

  resume_sample: {
    title: 'Sample Software Engineer Resume (Missing Contact)',
    type: 'resume' as const,
    content: `# Alex Rivera
Full Stack Engineer & Cloud Developer

## Professional Summary
Results-driven software engineer with 4 years of experience building distributed microservices and scalable web applications in React, TypeScript, and Go. Passionate about developer tooling and performance optimization.

## Work Experience

### Senior Software Engineer — CloudScale Inc.
January 2023 – Present | San Francisco, CA
- Spearheaded the redesign of the core billing pipeline, reducing checkout latency by 45% and handling $12M in monthly volume.
- Architected a real-time event ingestion engine using Apache Kafka and Go, processing 85,000 events/second with zero data loss.
- Mentored 4 junior engineers through weekly 1-on-1 code reviews and system architecture workshops.

### Software Engineer — DevFlow Technologies
June 2021 – December 2022 | Austin, TX
- Implemented responsive frontend dashboards using React 18, Tailwind CSS, and TanStack Query.
- Decreased bundle size by 35% through dynamic code-splitting and asset optimization.

## Education
Bachelor of Science in Computer Science
University of California, Berkeley — Graduated May 2021
GPA: 3.82 / 4.0

## Technical Skills
- Languages: TypeScript, JavaScript, Go, Python, SQL
- Frameworks: React, Next.js, Node.js, Express, Tailwind CSS
- Cloud & DevOps: Docker, Kubernetes, AWS (ECS, S3, RDS), GitHub Actions, CI/CD`
  },

  research_proposal_sample: {
    title: 'Quantum-Resilient IoT Security (Research Proposal)',
    type: 'research_proposal' as const,
    content: `# Post-Quantum Cryptographic Frameworks for Resource-Constrained IoT Sensors

Principal Investigator: Dr. Elena Vance
Department of Computer Science & Cybersecurity
Date: November 2026

## Problem Statement & Motivation
With imminent advances in quantum computing, widely deployed asymmetric cryptosystems (e.g., RSA-2048, ECC) face catastrophic obsolescence. While NIST has standardized post-quantum algorithms such as ML-KEM (Kyber) and ML-DSA (Dilithium), their substantial computational and memory footprint makes direct deployment on 8-bit and 32-bit IoT microcontrollers impractical. This research addresses the severe gap between post-quantum cryptographic security and low-power IoT constraints.

## Literature Review
Recent benchmarking by Alkim et al. (2024) demonstrated that naive implementations of Kyber-512 exhaust the static RAM of ARM Cortex-M0+ devices within the first polynomial multiplication cycle. Hardware acceleration techniques proposed by Bernstein (2023) achieve viable latencies but require specialized ASIC silicon unavailable in legacy smart-meter infrastructure.

## Research Methodology & Experimental Framework
1. Algorithmic Optimization: Develop an asymmetric Number Theoretic Transform (NTT) cache-tiling algorithm tailored for sub-32KB SRAM microcontrollers.
2. Prototype Implementation: Benchmark the library across Nordic nRF52840 (Cortex-M4) and STM32L0 (Cortex-M0+) testbeds.
3. Side-Channel Analysis: Conduct electromagnetic and power consumption differential analysis to ensure resistance to physical side-channel attacks.

## Timeline & Milestones
- Phase 1 (Months 1-3): Mathematical verification and reference C implementation.
- Phase 2 (Months 4-7): Assembly-level optimization for ARM Thumb-2 architecture.
- Phase 3 (Months 8-10): Hardware testbed validation and power profiling.
- Phase 4 (Months 11-12): Final dissertation compilation and open-source library release.

## References
1. National Institute of Standards and Technology. (2024). "Post-Quantum Cryptography Standards: FIPS 203 & 204."
2. Alkim, E., et al. (2024). "Lattice-Based Cryptography on Low-Power Embedded Devices." Journal of Cryptology, 37(1), 44-78.
3. Vance, E. (2025). "Lightweight Security in Smart Grid Sensors." IEEE Security & Privacy, 23(4), 112-120.`
  }
};
