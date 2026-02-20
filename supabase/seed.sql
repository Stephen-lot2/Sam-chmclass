-- Sample data for testing

-- Insert sample courses
INSERT INTO courses (id, title, description, emoji, color, level, lessons_count, duration_hours, rating, students_count) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Organic Chemistry', 'Master the fundamentals of organic chemistry including carbon bonding, alkanes, and molecular structures', '⚗️', 'primary', 'intermediate', 24, 12, 4.8, 1250),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Chemical Bonding', 'Learn about ionic, covalent, and metallic bonds and how atoms interact', '🔬', 'secondary', 'beginner', 18, 8, 4.9, 980),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Periodic Table Mastery', 'Deep dive into the periodic table, element properties, and trends', '📊', 'success', 'beginner', 20, 10, 4.7, 1500),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Acids and Bases', 'Understanding pH, acid-base reactions, and buffer solutions', '🧪', 'orange', 'intermediate', 16, 7, 4.6, 850);

-- Insert sample lessons for Organic Chemistry course
INSERT INTO lessons (course_id, title, description, duration_minutes, order_index, is_locked) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Introduction to Organic Chemistry', 'Overview of organic chemistry and carbon compounds', 15, 1, false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Carbon Bonding Basics', 'Understanding how carbon forms bonds', 22, 2, false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alkanes Structure', 'Learn about the structure and properties of alkanes', 18, 3, false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Nomenclature Rules', 'IUPAC naming conventions for organic compounds', 25, 4, false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Isomerism Concepts', 'Understanding structural and stereoisomerism', 20, 5, true);

-- Insert sample live classes
INSERT INTO live_classes (title, description, scheduled_at, duration_minutes, status, max_students) VALUES
('Organic Chemistry Basics', 'Interactive session on organic chemistry fundamentals', NOW() + INTERVAL '2 hours', 60, 'upcoming', 50),
('Chemical Bonding Workshop', 'Hands-on workshop about chemical bonds', NOW() + INTERVAL '1 day', 90, 'upcoming', 40),
('Periodic Table Deep Dive', 'Comprehensive review of periodic trends', NOW() + INTERVAL '3 days', 75, 'upcoming', 60);

-- Insert sample tests
INSERT INTO tests (title, questions_count, duration_minutes, due_date, status) VALUES
('Organic Chemistry Quiz', 20, 30, NOW() + INTERVAL '2 days', 'available'),
('Periodic Table Test', 15, 25, NOW() - INTERVAL '1 day', 'available'),
('Chemical Bonding Exam', 30, 45, NOW() + INTERVAL '5 days', 'upcoming');
