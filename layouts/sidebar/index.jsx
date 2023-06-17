import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import {
    chakra,
    Flex,
    Grid,
    GridItem,
    Icon,
    Link,
    Text,
    useColorMode,
    useColorModeValue
} from '@chakra-ui/react'
import {
    FiBriefcase,
    FiCheckCircle,
    FiClock,
    FiFileMinus,
    FiFileText,
    FiFolderMinus,
    FiGrid,
    FiLock,
    FiLogOut,
    FiMoon,
    FiStar,
    FiSun,
    FiTarget,
    FiUsers
} from 'react-icons/fi'

const Sidebar = ({
    isAdmin,
    isEmployee,
    isUser,
    isSidebarOpen,
    onSidebarClose
}) => {
    const router = useRouter()
    const { colorMode, toggleColorMode } = useColorMode()
    const colorModeIcon = useColorModeValue(FiMoon, FiSun)

    return (
        <>
            <chakra.div
                bg="hsla(0, 0%, 0%, 0.4)"
                position="fixed"
                top={0}
                left={0}
                h="100vh"
                w="full"
                visibility={isSidebarOpen ? 'visible' : 'hidden'}
                opacity={isSidebarOpen ? 1 : 0}
                transition="0.4s ease-in-out"
                zIndex={{ base: 100, lg: 99 }}
                onClick={onSidebarClose}
            />

            <chakra.aside
                bg="system"
                position="fixed"
                top={{ base: 0, lg: 'auto' }}
                left={{ base: isSidebarOpen ? 0 : -256, lg: 'auto' }}
                borderRight="1px solid"
                borderColor="border"
                h={{ base: 'full', lg: 'calc(100% - 72px)' }}
                w={256}
                transition="0.4s ease-in-out left"
                zIndex={{ base: 100, lg: 99 }}
            >
                <Grid templateRows="1fr auto" h="full">
                    {isAdmin && (
                        <GridItem p={6}>
                            <NextLink href="/admin/dashboard">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('dashboard')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiGrid} boxSize={4} />

                                        <Text>Dashboard</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/admin/attendance">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('attendance')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiCheckCircle} boxSize={4} />

                                        <Text>Attendance</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/admin/employees">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('employees')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiUsers} boxSize={4} />

                                        <Text>Employees</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/admin/positions">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('positions')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiBriefcase} boxSize={4} />

                                        <Text>Positions</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/admin/schedules">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('schedules')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiClock} boxSize={4} />

                                        <Text>Schedules</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/admin/deductions">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('deductions')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiFileMinus} boxSize={4} />

                                        <Text>Deductions</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/admin/payrolls">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('payrolls')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiFileText} boxSize={4} />

                                        <Text>Payrolls</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/admin/leaves">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('leaves')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiFolderMinus} boxSize={4} />

                                        <Text>Leaves</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/admin/meetings">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('meetings')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiTarget} boxSize={4} />

                                        <Text>Meetings</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/admin/accounts">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('accounts')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiStar} boxSize={4} />

                                        <Text>Accounts</Text>
                                    </Flex>
                                </Link>
                            </NextLink>
                        </GridItem>
                    )}

                    {isEmployee && (
                        <GridItem p={6}>
                            <NextLink href="/attendance">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('attendance')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiCheckCircle} boxSize={4} />

                                        <Text>Attendance</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/payrolls">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('payrolls')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiFileText} boxSize={4} />

                                        <Text>Payrolls</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/leaves">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('leaves')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiFolderMinus} boxSize={4} />

                                        <Text>Leaves</Text>
                                    </Flex>
                                </Link>
                            </NextLink>

                            <NextLink href="/meetings">
                                <Link
                                    as="span"
                                    display="block"
                                    py={2}
                                    lineHeight={6}
                                    active={
                                        router.pathname.includes('meetings')
                                            ? 1
                                            : 0
                                    }
                                    onClick={onSidebarClose}
                                >
                                    <Flex align="center" gap={3}>
                                        <Icon as={FiTarget} boxSize={4} />

                                        <Text>Meetings</Text>
                                    </Flex>
                                </Link>
                            </NextLink>
                        </GridItem>
                    )}

                    {isUser && (
                        <GridItem p={6}>
                            <Link
                                as="span"
                                display="block"
                                py={2}
                                lineHeight={6}
                                cursor="not-allowed"
                                _hover={{ color: 'accent-1' }}
                            >
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    gap={6}
                                >
                                    <Flex align="center" gap={3} opacity={0.5}>
                                        <Icon as={FiCheckCircle} boxSize={4} />

                                        <Text>Attendance</Text>
                                    </Flex>

                                    <Icon as={FiLock} boxSize={4} />
                                </Flex>
                            </Link>

                            <Link
                                as="span"
                                display="block"
                                py={2}
                                lineHeight={6}
                                cursor="not-allowed"
                                _hover={{ color: 'accent-1' }}
                            >
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    gap={6}
                                >
                                    <Flex align="center" gap={3} opacity={0.5}>
                                        <Icon as={FiFileText} boxSize={4} />

                                        <Text>Payrolls</Text>
                                    </Flex>

                                    <Icon as={FiLock} boxSize={4} />
                                </Flex>
                            </Link>

                            <Link
                                as="span"
                                display="block"
                                py={2}
                                lineHeight={6}
                                cursor="not-allowed"
                                _hover={{ color: 'accent-1' }}
                            >
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    gap={6}
                                >
                                    <Flex align="center" gap={3} opacity={0.5}>
                                        <Icon as={FiFolderMinus} boxSize={4} />

                                        <Text>Leaves</Text>
                                    </Flex>

                                    <Icon as={FiLock} boxSize={4} />
                                </Flex>
                            </Link>

                            <Link
                                as="span"
                                display="block"
                                py={2}
                                lineHeight={6}
                                cursor="not-allowed"
                                _hover={{ color: 'accent-1' }}
                            >
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    gap={6}
                                >
                                    <Flex align="center" gap={3} opacity={0.5}>
                                        <Icon as={FiTarget} boxSize={4} />

                                        <Text>Meetings</Text>
                                    </Flex>

                                    <Icon as={FiLock} boxSize={4} />
                                </Flex>
                            </Link>
                        </GridItem>
                    )}

                    <GridItem p={6}>
                        <Link
                            as="button"
                            display="block"
                            py={2}
                            w="full"
                            lineHeight={6}
                            onClick={toggleColorMode}
                        >
                            <Flex align="center" gap={3}>
                                <Icon as={colorModeIcon} boxSize={4} />

                                <Text>{colorMode} Mode</Text>
                            </Flex>
                        </Link>

                        <Link
                            as="button"
                            display="block"
                            py={2}
                            w="full"
                            lineHeight={6}
                            onClick={async () => {
                                const data = await signOut({
                                    redirect: false,
                                    callbackUrl: '/'
                                })
                                router.push(data.url)
                            }}
                        >
                            <Flex align="center" gap={3}>
                                <Icon as={FiLogOut} boxSize={4} />

                                <Text>Sign Out</Text>
                            </Flex>
                        </Link>
                    </GridItem>
                </Grid>
            </chakra.aside>
        </>
    )
}

export default Sidebar
