-- Restore all content data

-- Capabilities Section
INSERT INTO CapabilitiesSection (id, title, description, createdAt, updatedAt)
VALUES ('cap001', 'Capabilities', 'End-to-end technical execution across infrastructure, product and data.', datetime('now'), datetime('now'));

-- Capability Items
INSERT INTO CapabilityItem (id, icon, title, description, color, "order", capabilitiesId, createdAt, updatedAt)
VALUES
('capitem001', 'cloud', 'Cloud Architecture', 'AWS, GCP, Azure. Multi-cloud strategies, serverless, containerization. Infrastructure as code with Terraform and CloudFormation.', '#1967D2', 1, 'cap001', datetime('now'), datetime('now')),
('capitem002', 'mobile', 'Mobile Development', 'Native iOS (Swift) and Android (Kotlin). React Native for cross-platform. Performance optimization and offline-first architectures.', '#EA4335', 2, 'cap001', datetime('now'), datetime('now')),
('capitem003', 'web', 'Web Platforms', 'React, Next.js, TypeScript. Progressive web apps. Server-side rendering and static generation for performance.', '#FBBC04', 3, 'cap001', datetime('now'), datetime('now')),
('capitem004', 'code', 'Backend Systems', 'Node.js, Python, Go. Microservices and event-driven architecture. GraphQL and REST API design.', '#34A853', 4, 'cap001', datetime('now'), datetime('now')),
('capitem005', 'chart', 'Data Engineering', 'Data pipelines with Apache Airflow. Real-time streaming with Kafka. Warehousing with Snowflake and BigQuery.', '#1967D2', 5, 'cap001', datetime('now'), datetime('now')),
('capitem006', 'shield', 'Security & Compliance', 'Zero-trust architecture. GDPR, SOC 2, HIPAA compliance. Penetration testing and vulnerability management.', '#EA4335', 6, 'cap001', datetime('now'), datetime('now')),
('capitem007', 'bulb', 'Machine Learning', 'MLOps pipelines. Model training and deployment. Computer vision and NLP applications.', '#FBBC04', 7, 'cap001', datetime('now'), datetime('now')),
('capitem008', 'clipboard', 'Product Strategy', 'Discovery and validation. Roadmap planning. Metrics and KPI frameworks.', '#34A853', 8, 'cap001', datetime('now'), datetime('now')),
('capitem009', 'globe', 'Platform Modernization', 'Legacy system migration. Monolith to microservices. Cloud transformation and optimization.', '#1967D2', 9, 'cap001', datetime('now'), datetime('now'));

-- Principles Section
INSERT INTO PrinciplesSection (id, title, description, createdAt, updatedAt)
VALUES ('prin001', 'Our Principles', 'How we think about building technology.', datetime('now'), datetime('now'));

-- Principle Items
INSERT INTO PrincipleItem (id, icon, title, description, color, "order", principlesId, createdAt, updatedAt)
VALUES
('prinitem001', 'check', 'Start with first principles', 'We question assumptions and build from fundamentals. No cargo-cult engineering—every decision needs a reason.', '#1967D2', 1, 'prin001', datetime('now'), datetime('now')),
('prinitem002', 'building', 'Infrastructure is product', 'Your platform capabilities define what''s possible. We invest in tooling, observability and developer experience.', '#EA4335', 2, 'prin001', datetime('now'), datetime('now')),
('prinitem003', 'trending', 'Measure everything that matters', 'Data informs decisions. We instrument systems to understand behavior, performance and business impact.', '#FBBC04', 3, 'prin001', datetime('now'), datetime('now')),
('prinitem004', 'lightning', 'Optimize for velocity', 'Small, frequent deployments beat big releases. Fast feedback loops accelerate learning and reduce risk.', '#34A853', 4, 'prin001', datetime('now'), datetime('now')),
('prinitem005', 'shield', 'Security by design', 'Security isn''t a feature you add later. It''s foundational—built into architecture, code and processes.', '#1967D2', 5, 'prin001', datetime('now'), datetime('now')),
('prinitem006', 'users', 'Boring technology first', 'Proven tools over shiny ones. Stability and maintainability matter more than novelty.', '#EA4335', 6, 'prin001', datetime('now'), datetime('now')),
('prinitem007', 'globe', 'Think in systems', 'Software doesn''t exist in isolation. We design for the broader ecosystem—teams, processes and constraints.', '#FBBC04', 7, 'prin001', datetime('now'), datetime('now'));

-- Impact Section
INSERT INTO ImpactSection (id, title, description, createdAt, updatedAt)
VALUES ('impact001', 'Impact at Scale', 'Numbers that reflect the systems we''ve built and the teams we''ve worked with.', datetime('now'), datetime('now'));

-- Impact Items
INSERT INTO ImpactItem (id, icon, number, label, color, "order", impactId, createdAt, updatedAt)
VALUES
('impactitem001', 'globe', '50+', 'Countries reached', '#1967D2', 1, 'impact001', datetime('now'), datetime('now')),
('impactitem002', 'users', '100M+', 'End users', '#EA4335', 2, 'impact001', datetime('now'), datetime('now')),
('impactitem003', 'server', '10B+', 'API requests/month', '#FBBC04', 3, 'impact001', datetime('now'), datetime('now')),
('impactitem004', 'cpu', '99.99%', 'Uptime SLA', '#34A853', 4, 'impact001', datetime('now'), datetime('now'));

-- Statement Section
INSERT INTO StatementSection (id, title, description, videoUrl, createdAt, updatedAt)
VALUES ('stmt001', 'Simplicity is the ultimate technology', 'At Rotom, we believe complexity is a bug, not a feature. The best systems are those you can understand, maintain and evolve without heroic effort. We strip away the unnecessary, automate the repetitive and architect for clarity—because simple doesn''t mean easy. It means intentional.', 'ZAx5TJRHWBA', datetime('now'), datetime('now'));

-- Statement Items (About section)
INSERT INTO StatementItem (id, icon, title, description, "order", color, statementId, createdAt, updatedAt)
VALUES
('stmtitem001', 'grid', 'Simplicity through architecture', 'Good design doesn''t add—it removes. We build systems that are understandable by default, with clear boundaries, minimal dependencies and explicit contracts.', 1, '#1967D2', 'stmt001', datetime('now'), datetime('now')),
('stmtitem002', 'users', 'Built for humans', 'Code is read more than it''s written. We optimize for the next engineer—clear naming, self-documenting patterns and tests that tell a story.', 2, '#EA4335', 'stmt001', datetime('now'), datetime('now')),
('stmtitem003', 'lightning', 'Fast by default', 'Performance isn''t an afterthought. From database queries to API response times, we engineer for speed at every layer.', 3, '#FBBC04', 'stmt001', datetime('now'), datetime('now')),
('stmtitem004', 'globe', 'Infrastructure as advantage', 'Your platform is your competitive edge. We build deployment pipelines, observability and tooling that let teams move fast without breaking things.', 4, '#34A853', 'stmt001', datetime('now'), datetime('now')),
('stmtitem005', 'badge', 'Proven over novel', 'Boring technology wins. We choose stability and community support over the cutting edge—because production systems demand reliability, not resumes.', 5, '#1967D2', 'stmt001', datetime('now'), datetime('now'));

-- Timeline
INSERT INTO TimelineItem (id, year, title, description, color, createdAt, updatedAt)
VALUES
('time001', '2019', 'Founded', 'Started as a small team with a big vision: to help companies build better technology.', '#1967D2', datetime('now'), datetime('now')),
('time002', '2020', 'First Major Client', 'Partnered with a leading fintech to rebuild their payment infrastructure.', '#EA4335', datetime('now'), datetime('now')),
('time003', '2021', 'Expanded Services', 'Added data engineering and ML capabilities to our offering.', '#FBBC04', datetime('now'), datetime('now')),
('time004', '2022', 'Global Reach', 'Opened offices in Madrid, Barcelona and Mexico City.', '#34A853', datetime('now'), datetime('now')),
('time005', '2023', 'Product Studio Launch', 'Launched our product studio to help startups build from 0 to 1.', '#1967D2', datetime('now'), datetime('now')),
('time006', '2024', 'Today', 'Working with companies across 4 continents on infrastructure, data and product.', '#EA4335', datetime('now'), datetime('now'));

-- Contact Section
INSERT OR REPLACE INTO ContactSection (id, mainTitle, mainDesc, formTitle, formDesc, emailTo, createdAt, updatedAt)
VALUES ('contact001', 'Let''s build what''s next.', 'If you''re planning, scaling or re-architecting a digital ecosystem, we can help you connect infrastructure, data and product into a single coherent strategy.', 'Get in touch', 'Ready to start a project or need strategic guidance? Reach out and let''s discuss your needs.', 'admin@rotom-labs.com', datetime('now'), datetime('now'));
