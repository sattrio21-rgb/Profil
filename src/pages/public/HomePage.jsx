import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import HeroSection from '../../components/sections/HeroSection'
import PendidikanSection from '../../components/sections/PendidikanSection'
import PengalamanSection from '../../components/sections/PengalamanSection'
import ProjectSection from '../../components/sections/ProjectSection'

const HomePage = () => {
  const location = useLocation()
  const [profile, setProfile] = useState(null)
  const [pendidikans, setPendidikans] = useState([])
  const [pengalamans, setPengalamans] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .single()

        // Fetch pendidikans
        const { data: pendidikanData } = await supabase
          .from('pendidikans')
          .select('*')
          .order('tahun_mulai', { ascending: true })

        // Fetch latest 3 pengalamans
        const { data: pengalamanData } = await supabase
          .from('pengalamans')
          .select('*')
          .order('mulai', { ascending: false })
          .limit(3)

        // Fetch latest 3 projects
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3)

        setProfile(profileData)
        setPendidikans(pendidikanData || [])
        setPengalamans(pengalamanData || [])
        setProjects(projectData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Scroll to section when hash is present
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [location, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-5xl mx-auto bg-[#0a0a0a] text-white">
      <HeroSection profile={profile} />
      <PendidikanSection pendidikans={pendidikans} />
      <PengalamanSection />
      <ProjectSection projects={projects} />
    </div>
  )
}

export default HomePage
