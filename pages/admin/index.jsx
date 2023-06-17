import { useRouter } from 'next/router'

const Admin = () => {
    const router = useRouter()
    router.push('/admin/dashboard')
    return null
}

export default Admin
