import { Button, chakra, Divider, Flex, Text } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { Google, Logo } from './logos'

const Login = () => {
    return (
        <Flex justify="center" align="center" h="full" minH="100vh">
            <Flex
                direction="column"
                align="center"
                gap={6}
                border="1px solid"
                borderColor="border"
                borderRadius={12}
                p={6}
                w="full"
                maxW={360}
            >
                <Logo size={24} />

                <Flex
                    direction="column"
                    align="center"
                    w="full"
                    textAlign="center"
                >
                    <Text fontSize="2xl" fontWeight="bold" color="accent-1">
                        <chakra.span color="brand.default">Pace</chakra.span>
                        cale
                    </Text>

                    <Text fontSize="sm">
                        Cloud-based Payroll System,
                        <br /> access your data anytime.
                    </Text>
                </Flex>

                <Divider />

                <Flex direction="column" gap={3} w="full">
                    <Button
                        size="lg"
                        colorScheme="brand"
                        leftIcon={
                            <Flex
                                bg="white"
                                justify="center"
                                align="center"
                                borderRadius="full"
                                h={6}
                                w={6}
                            >
                                <Google size={16} />
                            </Flex>
                        }
                        onClick={() => signIn('google')}
                    >
                        Continue with Google
                    </Button>

                    <Button size="lg">Make contact with us</Button>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Login
