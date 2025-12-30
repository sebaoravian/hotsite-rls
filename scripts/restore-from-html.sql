-- Restaurar datos del HTML original

-- Limpiar datos existentes
DELETE FROM HeroButton;
DELETE FROM HeroSection;
DELETE FROM StatementItem;
DELETE FROM StatementSection;
DELETE FROM CapabilityItem;
DELETE FROM CapabilitiesSection;
DELETE FROM PrincipleItem;
DELETE FROM PrinciplesSection;
DELETE FROM ImpactItem;
DELETE FROM ImpactSection;
DELETE FROM TimelineItem;
DELETE FROM TeamMember;
DELETE FROM TeamSection;
DELETE FROM ContactSection;

-- Hero Section
INSERT INTO HeroSection (id, videoUrl, title, description, createdAt, updatedAt)
VALUES ('hero001', 'ZAx5TJRHWBA', 'We build the digital backbone behind global companies.', 'Cloud architecture, mobile platforms, secure integrations, data and AI. Designed for high-scale operations that can''t fail.', datetime('now'), datetime('now'));

INSERT INTO HeroButton (id, label, url, "order", heroId, createdAt, updatedAt)
VALUES 
('btn001', 'Explore capabilities', '#capabilities', 1, 'hero001', datetime('now'), datetime('now')),
('btn002', 'Start a conversation', '#contact', 2, 'hero001', datetime('now'), datetime('now'));

-- Statement Section (Philosophy)
INSERT INTO StatementSection (id, title, description, videoUrl, createdAt, updatedAt)
VALUES ('stmt001', 'Simplicity is the ultimate technology.', 'We transform operational complexity into architectures, platforms and data flows that feel simple to use, easy to govern and powerful to evolve. We focus on the essentials: clarity, reliability and measurable impact.', 'ZAx5TJRHWBA', datetime('now'), datetime('now'));

-- Statement Items (About section)
INSERT INTO StatementItem (id, icon, title, description, "order", color, statementId, createdAt, updatedAt)
VALUES
('stmtitem001', 'grid', 'Simplicity through architecture.', 'We believe the most advanced systems are the ones that feel simple. Behind every interface, workflow and data point, there is architecture, governance and technical precision. We design systems that are predictable, flexible, integrated, secure and human.', 1, '#1967D2', 'stmt001', datetime('now'), datetime('now')),
('stmtitem002', 'users', 'A strategic partner, not a vendor.', 'We operate as an embedded extension of your technology leadership. We plan architecture, deliver product, operate cloud infrastructure, design data flows, enforce security and guide the roadmap.', 2, '#EA4335', 'stmt001', datetime('now'), datetime('now')),
('stmtitem003', 'lightning', 'Build fast. Build right. Evolve continuously.', 'Our workflow is deliberate: discovery & architecture, high-quality delivery, governance & security, and continuous evolution based on real usage and performance.', 3, '#FBBC04', 'stmt001', datetime('now'), datetime('now')),
('stmtitem004', 'globe', 'Global operations, unified approach.', 'We design and operate systems that support thousands of users, multi-country operations and complex integrations across mobile, web, cloud, AI and data ecosystems.', 4, '#34A853', 'stmt001', datetime('now'), datetime('now')),
('stmtitem005', 'badge', 'Our mission.', 'Make technology feel invisible, powerful and aligned with the business. We build ecosystems where every user—from field reps to executives—can rely on the system without thinking about its complexity.', 5, '#1967D2', 'stmt001', datetime('now'), datetime('now'));

-- Capabilities Section
INSERT INTO CapabilitiesSection (id, title, description, createdAt, updatedAt)
VALUES ('cap001', 'Capabilities', 'End-to-end technical capabilities. One strategic partner — from infrastructure and security to data, AI and product delivery.', datetime('now'), datetime('now'));

INSERT INTO CapabilityItem (id, icon, title, description, color, "order", capabilitiesId, createdAt, updatedAt)
VALUES
('capitem001', 'cloud', 'Cloud Architecture & DevOps', 'AWS-first architectures, VPCs, serverless, CI/CD and cost optimization for multi-region deployments.', '#1967D2', 1, 'cap001', datetime('now'), datetime('now')),
('capitem002', 'mobile', 'Mobile Platforms', 'React Native apps for thousands of users with offline-first capabilities and multi-country rollouts.', '#EA4335', 2, 'cap001', datetime('now'), datetime('now')),
('capitem003', 'web', 'Web Platforms', 'Next.js web apps and administration consoles designed for clarity, performance and global access.', '#FBBC04', 3, 'cap001', datetime('now'), datetime('now')),
('capitem004', 'code', 'Enterprise Integrations & APIs', 'SAP, ERPs, SSO, Azure AD, third-party APIs and event-driven architectures with strong governance.', '#34A853', 4, 'cap001', datetime('now'), datetime('now')),
('capitem005', 'chart', 'Data Engineering & Analytics', 'Data Lakes, ETL/ELT and BI stacks that turn raw signals into operational and strategic insights.', '#1967D2', 5, 'cap001', datetime('now'), datetime('now')),
('capitem006', 'shield', 'Security & Governance', 'Identity, roles, audit trails, encryption and policies designed into the core of the architecture.', '#EA4335', 6, 'cap001', datetime('now'), datetime('now')),
('capitem007', 'bulb', 'AI & Machine Learning', 'Predictive models, segmentation, and corporate chatbots connected to your data and operations.', '#FBBC04', 7, 'cap001', datetime('now'), datetime('now')),
('capitem008', 'clipboard', 'Tech Strategy & Consulting', 'Roadmaps, architecture decisions and governance models to sustain long-term digital ecosystems.', '#34A853', 8, 'cap001', datetime('now'), datetime('now')),
('capitem009', 'globe', 'Global Delivery', 'Experience running platforms across multiple countries, time zones and languages.', '#1967D2', 9, 'cap001', datetime('now'), datetime('now'));

-- Principles Section
INSERT INTO PrinciplesSection (id, title, description, createdAt, updatedAt)
VALUES ('prin001', 'Our Principles', 'We build technology with a set of principles that guide everything we architect and deliver.', datetime('now'), datetime('now'));

INSERT INTO PrincipleItem (id, icon, title, description, color, "order", principlesId, createdAt, updatedAt)
VALUES
('prinitem001', 'check', 'Clarity over complexity', 'Systems must be predictable and intentional. Complexity is managed through architecture, not exposed to the user.', '#1967D2', 1, 'prin001', datetime('now'), datetime('now')),
('prinitem002', 'building', 'Architecture first', 'We design solid foundations before building features. Architecture is what ensures longevity, stability and evolution.', '#EA4335', 2, 'prin001', datetime('now'), datetime('now')),
('prinitem003', 'shield', 'Security by design', 'Identity, access, governance and protection are part of the core—not an afterthought.', '#FBBC04', 3, 'prin001', datetime('now'), datetime('now')),
('prinitem004', 'trending', 'Performance as a baseline', 'Platforms must remain fast, reliable and responsive, regardless of scale.', '#34A853', 4, 'prin001', datetime('now'), datetime('now')),
('prinitem005', 'lightning', 'Evolution without friction', 'Technology must adapt as the business grows. Everything we build is designed to evolve.', '#1967D2', 5, 'prin001', datetime('now'), datetime('now')),
('prinitem006', 'users', 'Human-centric technology', 'The best systems empower people. We design for execution, learning and decision-making.', '#EA4335', 6, 'prin001', datetime('now'), datetime('now'));

-- Impact Section
INSERT INTO ImpactSection (id, title, description, createdAt, updatedAt)
VALUES ('impact001', 'Impact', 'What we build today is already running at scale in demanding environments.', datetime('now'), datetime('now'));

INSERT INTO ImpactItem (id, icon, number, label, color, "order", impactId, createdAt, updatedAt)
VALUES
('impactitem001', 'globe', '30+ countries', 'Platforms designed to operate in diverse markets.', '#1967D2', 1, 'impact001', datetime('now'), datetime('now')),
('impactitem002', 'users', '10k+ DAUs', 'Daily active users across mobile and web ecosystems.', '#EA4335', 2, 'impact001', datetime('now'), datetime('now')),
('impactitem003', 'server', 'Multi-region', 'Architectures ready for global resilience and performance.', '#FBBC04', 3, 'impact001', datetime('now'), datetime('now')),
('impactitem004', 'cpu', 'End-to-end', 'From infrastructure and security to data, AI and UX.', '#34A853', 4, 'impact001', datetime('now'), datetime('now'));

-- Timeline
INSERT INTO TimelineItem (id, year, title, description, color, createdAt, updatedAt)
VALUES
('time001', '2014', 'Foundation', 'RotomLabs is founded with a focus on building high-quality digital products.', '#1967D2', datetime('now'), datetime('now')),
('time002', '2016', 'Large-scale mobile ecosystems', 'We launch multi-country mobile platforms used by thousands of field users.', '#EA4335', datetime('now'), datetime('now')),
('time003', '2018', 'Enterprise integrations & data discipline', 'Deep ERP integrations and our first major Data Lake unifying operational and learning data.', '#FBBC04', datetime('now'), datetime('now')),
('time004', '2020', 'AWS-first multi-tenant architecture', 'Serverless, containerized services and global deployments across regions.', '#34A853', datetime('now'), datetime('now')),
('time005', '2022', 'AI & predictive insights', 'Machine learning models connecting training, execution and performance.', '#1967D2', datetime('now'), datetime('now')),
('time006', '2024', 'Platform Architecture 2.0', 'Unified architecture for mobile, web, data, AI, gamification and field execution.', '#EA4335', datetime('now'), datetime('now')),
('time007', '2025', 'Global scale & strategic advisory', 'We operate as strategic technology partners for global companies.', '#FBBC04', datetime('now'), datetime('now'));

-- Team Section
INSERT INTO TeamSection (id, title, description, createdAt, updatedAt)
VALUES ('team001', 'The Team Behind RotomLabs', 'The people who architect, build and operate complex ecosystems at scale.', datetime('now'), datetime('now'));

INSERT INTO TeamMember (id, name, role, bio, image, "order", teamId, createdAt, updatedAt)
VALUES
('member001', 'Sebastián Martínez', 'CTO & Principal Architect', 'Leads architecture, infrastructure, security and long-term strategy. Designs the digital foundations behind every ecosystem.', '/team/sebastian-martinez.jpg', 1, 'team001', datetime('now'), datetime('now')),
('member002', 'Martina Miroli', 'Innovation & Strategy Director', 'Drives discovery, product vision and innovation. Connects business needs with technical opportunities.', '/team/martina-miroli.jpg', 2, 'team001', datetime('now'), datetime('now')),
('member003', 'Giselle Fernández', 'Strategy & Delivery Director', 'Ensures execution, planning and delivery quality across all initiatives.', '/team/giselle-fernandez.jpg', 3, 'team001', datetime('now'), datetime('now')),
('member004', 'Mauro Panella', 'Head of Development', 'Leads engineering frameworks, quality and technical execution across web and mobile.', '/team/mauro-panella.jpg', 4, 'team001', datetime('now'), datetime('now')),
('member005', 'Technical Team', 'Engineers & Specialists', 'Senior developers, mobile engineers, devops, data engineers, QA analysts and designers who build, operate and evolve complex ecosystems at scale.', '/team/technical-team.jpg', 5, 'team001', datetime('now'), datetime('now'));

-- Contact Section
INSERT INTO ContactSection (id, mainTitle, mainDesc, formTitle, formDesc, emailTo, createdAt, updatedAt)
VALUES ('contact001', 'Let''s build what''s next.', 'If you''re planning, scaling or re-architecting a digital ecosystem, we can help you connect infrastructure, data and product into a single coherent strategy.', 'Get in touch', 'Ready to start a project or need strategic guidance? Reach out and let''s discuss your needs.', 'admin@rotom-labs.com', datetime('now'), datetime('now'));
