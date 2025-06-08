-- Insert medical conditions
INSERT INTO conditions (name, description, category, symptoms) VALUES
('Migraine', 'A primary headache disorder characterized by recurrent headaches that are moderate to severe.', 'Neurological', ARRAY['Severe headache', 'Nausea', 'Vomiting', 'Sensitivity to light', 'Sensitivity to sound']),
('Tension Headache', 'The most common type of primary headache, often described as a band-like tightness around the head.', 'Neurological', ARRAY['Mild to moderate headache', 'Pressure sensation', 'Muscle tension']),
('Anxiety Disorder', 'A mental health disorder characterized by excessive worry, fear, or anxiety.', 'Mental Health', ARRAY['Excessive worry', 'Restlessness', 'Fatigue', 'Difficulty concentrating', 'Muscle tension']),
('Depression', 'A mood disorder that causes persistent feelings of sadness and loss of interest.', 'Mental Health', ARRAY['Persistent sadness', 'Loss of interest', 'Fatigue', 'Sleep problems', 'Appetite changes']),
('Gastroesophageal Reflux Disease (GERD)', 'A digestive disorder where stomach acid frequently flows back into the esophagus.', 'Digestive', ARRAY['Heartburn', 'Acid reflux', 'Chest pain', 'Difficulty swallowing', 'Regurgitation']),
('Irritable Bowel Syndrome (IBS)', 'A common disorder affecting the large intestine.', 'Digestive', ARRAY['Abdominal pain', 'Bloating', 'Gas', 'Diarrhea', 'Constipation']),
('Hypertension', 'High blood pressure, a condition where blood pressure is consistently elevated.', 'Cardiovascular', ARRAY['Often asymptomatic', 'Headache', 'Dizziness', 'Chest pain']),
('Type 2 Diabetes', 'A chronic condition affecting how the body processes blood sugar.', 'Endocrine', ARRAY['Increased thirst', 'Frequent urination', 'Increased hunger', 'Fatigue', 'Blurred vision']),
('Asthma', 'A respiratory condition where airways narrow and swell, producing extra mucus.', 'Respiratory', ARRAY['Shortness of breath', 'Chest tightness', 'Wheezing', 'Coughing']),
('Allergic Rhinitis', 'An allergic response causing cold-like symptoms.', 'Respiratory', ARRAY['Runny nose', 'Sneezing', 'Itchy eyes', 'Nasal congestion']),
('Eczema', 'A condition that makes skin red and itchy.', 'Dermatological', ARRAY['Itchy skin', 'Red patches', 'Dry skin', 'Skin inflammation']),
('Psoriasis', 'A skin disease that causes red, itchy scaly patches.', 'Dermatological', ARRAY['Red patches', 'Silvery scales', 'Itching', 'Burning sensation']),
('Fibromyalgia', 'A disorder characterized by widespread musculoskeletal pain.', 'Musculoskeletal', ARRAY['Widespread pain', 'Fatigue', 'Sleep problems', 'Memory issues']),
('Arthritis', 'Inflammation of one or more joints, causing pain and stiffness.', 'Musculoskeletal', ARRAY['Joint pain', 'Stiffness', 'Swelling', 'Reduced range of motion']),
('Insomnia', 'A sleep disorder where you have trouble falling or staying asleep.', 'Sleep Disorders', ARRAY['Difficulty falling asleep', 'Waking up frequently', 'Early morning awakening', 'Daytime fatigue']);

-- Insert treatments
INSERT INTO treatments (name, type, description, side_effects, contraindications) VALUES
('Sumatriptan', 'medication', 'A medication used to treat migraine headaches.', ARRAY['Nausea', 'Dizziness', 'Drowsiness', 'Injection site reactions'], ARRAY['Heart disease', 'Uncontrolled hypertension', 'Stroke history']),
('Ibuprofen', 'medication', 'A nonsteroidal anti-inflammatory drug (NSAID) used for pain relief.', ARRAY['Stomach upset', 'Heartburn', 'Dizziness'], ARRAY['Peptic ulcers', 'Kidney disease', 'Heart failure']),
('Cognitive Behavioral Therapy', 'therapy', 'A form of psychological treatment effective for anxiety and depression.', ARRAY['Initial increase in anxiety', 'Emotional discomfort'], ARRAY['Severe psychosis', 'Active substance abuse']),
('Meditation', 'lifestyle', 'A practice of focused attention and mindfulness.', ARRAY[], ARRAY[]),
('Exercise Therapy', 'lifestyle', 'Regular physical activity prescribed as treatment.', ARRAY['Muscle soreness', 'Fatigue'], ARRAY['Acute heart conditions', 'Severe joint problems']),
('Sertraline', 'medication', 'An SSRI antidepressant used to treat depression and anxiety.', ARRAY['Nausea', 'Insomnia', 'Sexual dysfunction', 'Weight changes'], ARRAY['MAO inhibitor use', 'Bipolar disorder without mood stabilizer']),
('Proton Pump Inhibitors', 'medication', 'Medications that reduce stomach acid production.', ARRAY['Headache', 'Nausea', 'Diarrhea', 'Vitamin B12 deficiency'], ARRAY['Known hypersensitivity']),
('Dietary Modification', 'lifestyle', 'Changes to diet to manage various conditions.', ARRAY[], ARRAY[]),
('Metformin', 'medication', 'A medication used to treat type 2 diabetes.', ARRAY['Nausea', 'Diarrhea', 'Metallic taste'], ARRAY['Kidney disease', 'Liver disease', 'Heart failure']),
('Albuterol Inhaler', 'medication', 'A bronchodilator used to treat asthma and COPD.', ARRAY['Nervousness', 'Shakiness', 'Headache'], ARRAY['Heart rhythm disorders', 'Hyperthyroidism']),
('Antihistamines', 'medication', 'Medications that treat allergy symptoms.', ARRAY['Drowsiness', 'Dry mouth', 'Blurred vision'], ARRAY['Glaucoma', 'Enlarged prostate']),
('Topical Corticosteroids', 'medication', 'Anti-inflammatory creams for skin conditions.', ARRAY['Skin thinning', 'Stretch marks', 'Skin discoloration'], ARRAY['Viral skin infections', 'Bacterial skin infections']),
('Physical Therapy', 'therapy', 'Treatment using physical methods like exercise and massage.', ARRAY['Temporary soreness', 'Fatigue'], ARRAY['Acute infections', 'Severe cardiovascular conditions']),
('Sleep Hygiene', 'lifestyle', 'Practices and habits that promote good quality sleep.', ARRAY[], ARRAY[]),
('Acupuncture', 'alternative', 'Traditional Chinese medicine involving needle insertion.', ARRAY['Bruising', 'Bleeding', 'Soreness'], ARRAY['Bleeding disorders', 'Pacemaker', 'Pregnancy (certain points)']);

-- Insert symptoms
INSERT INTO symptoms (name, description, severity_scale, measurement_unit) VALUES
('Headache', 'Pain in the head or upper neck', '1-10', 'pain scale'),
('Nausea', 'Feeling of sickness with an inclination to vomit', '1-10', 'severity scale'),
('Fatigue', 'Extreme tiredness or exhaustion', '1-10', 'energy scale'),
('Anxiety', 'Feeling of worry, nervousness, or unease', '1-10', 'anxiety scale'),
('Pain', 'Physical suffering or discomfort', '1-10', 'pain scale'),
('Mood Changes', 'Variations in emotional state', '1-10', 'mood scale'),
('Sleep Quality', 'How well you sleep', '1-10', 'quality scale'),
('Appetite', 'Desire to eat food', '1-10', 'appetite scale'),
('Concentration', 'Ability to focus attention', '1-10', 'focus scale'),
('Energy Level', 'Amount of physical and mental energy', '1-10', 'energy scale'),
('Digestive Issues', 'Problems with digestion', '1-10', 'severity scale'),
('Skin Condition', 'State of skin health', '1-10', 'severity scale'),
('Joint Stiffness', 'Reduced flexibility in joints', '1-10', 'stiffness scale'),
('Breathing Difficulty', 'Problems with breathing', '1-10', 'difficulty scale'),
('Heart Rate', 'Number of heartbeats per minute', '1-10', 'BPM');

-- Insert forums
INSERT INTO forums (name, description, condition_id, rules, is_private, member_count, post_count) VALUES
('Migraine Support Community', 'A supportive space for people dealing with migraines to share experiences and tips.',
 (SELECT id FROM conditions WHERE name = 'Migraine'),
 'Be respectful and supportive. No medical advice. Share experiences only.', false, 1247, 3891),

('Anxiety and Depression Support', 'Mental health support for those dealing with anxiety and depression.',
 (SELECT id FROM conditions WHERE name = 'Anxiety Disorder'),
 'Respectful discussion only. Crisis situations should contact emergency services. No medical advice.', false, 2156, 5672),

('Digestive Health Forum', 'Discussion about GERD, IBS, and other digestive conditions.',
 (SELECT id FROM conditions WHERE name = 'Gastroesophageal Reflux Disease (GERD)'),
 'Share experiences and tips. Consult healthcare providers for medical decisions.', false, 892, 2341),

('Chronic Pain Warriors', 'Support for those dealing with fibromyalgia and chronic pain.',
 (SELECT id FROM conditions WHERE name = 'Fibromyalgia'),
 'Supportive environment. Share coping strategies. No medical advice.', false, 1543, 4129),

('Diabetes Management', 'Tips and support for managing Type 2 diabetes.',
 (SELECT id FROM conditions WHERE name = 'Type 2 Diabetes'),
 'Share experiences with diet, exercise, and lifestyle. Medical decisions with healthcare providers.', false, 1089, 2967),

('Skin Conditions Support', 'Community for those with eczema, psoriasis, and other skin conditions.',
 (SELECT id FROM conditions WHERE name = 'Eczema'),
 'Share skincare tips and experiences. Patch test any suggestions. No medical advice.', false, 756, 1834),

('Better Sleep Community', 'Support and tips for better sleep and insomnia management.',
 (SELECT id FROM conditions WHERE name = 'Insomnia'),
 'Share sleep hygiene tips and experiences. Professional help for severe insomnia.', false, 934, 2108),

('Heart Health Forum', 'Discussion about managing hypertension and heart health.',
 (SELECT id FROM conditions WHERE name = 'Hypertension'),
 'Share lifestyle tips. Medical decisions with healthcare providers. Emergency symptoms need immediate care.', false, 1267, 3445),

('Breathing Easy - Asthma Support', 'Support for those managing asthma and respiratory conditions.',
 (SELECT id FROM conditions WHERE name = 'Asthma'),
 'Share management tips. Emergency breathing problems need immediate medical care.', false, 823, 1956),

('General Health & Wellness', 'General discussion about health, wellness, and lifestyle.',
 NULL,
 'General health discussion. No medical advice. Professional consultation for health decisions.', false, 3421, 8734);

-- Create some sample doctor profiles (these would be real verified doctors in production)
-- Note: These are sample UUIDs - in real implementation, these would be actual user IDs
INSERT INTO doctor_profiles (user_id, specialty, license_number, years_experience, education, bio, consultation_fee, verified_doctor) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Neurology', 'MD123456', 15, 'MD from Johns Hopkins University, Neurology Residency at Mayo Clinic', 'Specializing in headache disorders and neurological conditions with 15 years of experience.', 250.00, true),
('550e8400-e29b-41d4-a716-446655440002', 'Psychiatry', 'MD234567', 12, 'MD from Harvard Medical School, Psychiatry Residency at Massachusetts General Hospital', 'Focused on anxiety disorders, depression, and cognitive behavioral therapy.', 200.00, true),
('550e8400-e29b-41d4-a716-446655440003', 'Gastroenterology', 'MD345678', 10, 'MD from Stanford University, GI Fellowship at UCSF', 'Specializing in digestive disorders including GERD, IBS, and inflammatory bowel diseases.', 275.00, true),
('550e8400-e29b-41d4-a716-446655440004', 'Endocrinology', 'MD456789', 8, 'MD from University of Chicago, Endocrinology Fellowship at Cleveland Clinic', 'Diabetes management specialist with focus on lifestyle intervention and medication optimization.', 225.00, true),
('550e8400-e29b-41d4-a716-446655440005', 'Dermatology', 'MD567890', 14, 'MD from UCLA, Dermatology Residency at University of Pennsylvania', 'Treating various skin conditions including eczema, psoriasis, and chronic dermatitis.', 300.00, true);

-- Insert some sample notifications (these would be generated by the system)
-- Note: These use sample user IDs
INSERT INTO notifications (user_id, title, content, type) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'Welcome to MedCommunity!', 'Welcome to our medical community platform. Start by exploring forums and connecting with others.', 'system'),
('550e8400-e29b-41d4-a716-446655440006', 'New Post in Migraine Support', 'There is a new post in the Migraine Support Community that might interest you.', 'forum'),
('550e8400-e29b-41d4-a716-446655440007', 'Medication Reminder', 'Time to take your evening medication. Check your treatment schedule.', 'treatment'),
('550e8400-e29b-41d4-a716-446655440007', 'Upcoming Appointment', 'You have an appointment scheduled for tomorrow at 2:00 PM with Dr. Smith.', 'appointment');

-- Create function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
