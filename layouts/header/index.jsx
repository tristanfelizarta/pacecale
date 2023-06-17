import { useRouter } from 'next/router'
import { Avatar, chakra, Flex, IconButton } from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'
import { Logo } from 'components/logos'

const Header = ({ session, onSidebarOpen }) => {
    const router = useRouter()

    return (
        <chakra.header
            bg="system"
            position="sticky"
            top={0}
            outline="1px solid"
            outlineColor="border"
            transition=".4s"
            zIndex={100}
        >
            <Flex
                align="center"
                gap={6}
                mx="auto"
                px={6}
                h="72px"
                w="full"
                maxW={1536}
            >
                <Flex justify="start" align="center" gap={3}>
                    <IconButton
                        display={{ base: 'flex', lg: 'none' }}
                        icon={<FiMenu size={16} />}
                        onClick={onSidebarOpen}
                    />

                    <Logo />
                </Flex>

                <Flex flex={1} justify="center" align="center"></Flex>

                <Flex justify="end" align="center">
                    <Avatar
                        as="button"
                        h={10}
                        w={10}
                        name={session.user.name}
                        src={session.user.image}
                        onClick={() => router.push('/profile')}
                    />
                </Flex>
            </Flex>
        </chakra.header>
    )
}

export default Header
