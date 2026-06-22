-- ============================================
-- PORTFOLIO REACT + SUPABASE
-- Database Migration
-- ============================================

-- 1. PROFILES TABLE (Singleton - hanya 1 row)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text,
  deskripsi text,
  foto_url text,
  foto_hima_url text,
  judul_hima text DEFAULT 'Ketua Departemen Kreativitas dan Olahraga',
  deskripsi_hima text DEFAULT 'Himpunan Mahasiswa Teknologi Informasi',
  foto_bem_url text,
  judul_bem text DEFAULT 'Menteri Seni dan Olahraga',
  deskripsi_bem text DEFAULT 'Badan Eksekutif Mahasiswa Vokasi Universitas Brawijaya',
  email text,
  no_hp text,
  instagram text,
  linkedin text,
  github text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. PENDIDIKANS TABLE
CREATE TABLE IF NOT EXISTS pendidikans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_institusi text NOT NULL,
  jurusan text NOT NULL,
  tahun_mulai text NOT NULL,
  tahun_selesai text,
  deskripsi text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. PENGALAMANS TABLE
CREATE TABLE IF NOT EXISTS pengalamans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_organisasi text NOT NULL,
  jabatan text NOT NULL,
  tanggal_mulai date NOT NULL,
  tanggal_selesai date,
  deskripsi text,
  foto_url text,
  kategori text NOT NULL CHECK (kategori IN ('hima', 'bem')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  deskripsi text,
  gambar_url text,
  link_github text,
  link_demo text,
  teknologi jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default profile (1 row)
INSERT INTO profiles (nama) VALUES ('Admin');

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendidikans ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengalamans ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- PROFILES Policies
CREATE POLICY "Public read access" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Authenticated full access" ON profiles
  FOR ALL USING (auth.role() = 'authenticated');

-- PENDIDIKANS Policies
CREATE POLICY "Public read access" ON pendidikans
  FOR SELECT USING (true);

CREATE POLICY "Authenticated full access" ON pendidikans
  FOR ALL USING (auth.role() = 'authenticated');

-- PENGALAMANS Policies
CREATE POLICY "Public read access" ON pengalamans
  FOR SELECT USING (true);

CREATE POLICY "Authenticated full access" ON pengalamans
  FOR ALL USING (auth.role() = 'authenticated');

-- PROJECTS Policies
CREATE POLICY "Public read access" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Authenticated full access" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('foto-profile', 'foto-profile', true),
  ('foto-organisasi', 'foto-organisasi', true),
  ('foto-pengalaman', 'foto-pengalaman', true),
  ('gambar-project', 'gambar-project', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (true);

CREATE POLICY "Authenticated insert" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update" ON storage.objects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete" ON storage.objects
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pendidikans_updated_at
  BEFORE UPDATE ON pendidikans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pengalamans_updated_at
  BEFORE UPDATE ON pengalamans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
