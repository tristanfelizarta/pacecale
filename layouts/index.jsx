import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { chakra, Flex, Image, Spinner, useDisclosure } from '@chakra-ui/react'
import Login from 'components/login'
import Header from './header'
import Sidebar from './sidebar'
import Attendance from 'components/attendance'

const AppLayout = (props) => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const isAdmin = session
        ? session.user.role === 'Admin'
            ? true
            : false
        : false
    const isEmployee = session
        ? session.user.role === 'Employee'
            ? true
            : false
        : false
    const isUser = session
        ? session.user.role === 'User'
            ? true
            : false
        : false
    const {
        isOpen: isSidebarOpen,
        onOpen: onSidebarOpen,
        onClose: onSidebarClose
    } = useDisclosure()

    if (status === 'loading') {
        return (
            <Flex
                position="relative"
                justify="center"
                align="center"
                h="100vh"
                w="full"
            >
                <Image alt="logo" src="/favicon.ico" h="8" w="8" />

                <Spinner
                    position="absolute"
                    boxSize={12}
                    thickness={2}
                    speed="0.8s"
                    emptyColor="canvas-1"
                    color="accent-1"
                />
            </Flex>
        )
    } else {
        if (!session) {
            return <Login />
        }

        if (isUser && router.pathname !== '/') {
            router.push('/')
            return null
        }

        if (
            router.pathname.includes('attendance') &&
            router.pathname.includes('today')
        ) {
            return <Attendance />
        }

        if (isEmployee && router.pathname === '/') {
            router.push('/attendance')
            return null
        }

        if (isEmployee && router.pathname.includes('admin')) {
            router.push('/')
            return null
        }

        if (isAdmin && !router.pathname.includes('admin')) {
            router.push('/admin/dashboard')
            return null
        }

        return (
            <>
                <Header session={session} onSidebarOpen={onSidebarOpen} />

                <chakra.div
                    mx="auto"
                    h="auto"
                    minH="calc(100vh - 72px)"
                    w="full"
                    maxW={1536}
                >
                    <Sidebar
                        session={session}
                        isAdmin={isAdmin}
                        isEmployee={isEmployee}
                        isUser={isUser}
                        isSidebarOpen={isSidebarOpen}
                        onSidebarClose={onSidebarClose}
                    />

                    <chakra.main
                        ml={{ base: 0, lg: 256 }}
                        w={{ base: 'full', lg: 'calc(100% - 256px)' }}
                    >
                        {props.children}
                    </chakra.main>
                </chakra.div>
            </>
        )
    }
}

export default AppLayout
