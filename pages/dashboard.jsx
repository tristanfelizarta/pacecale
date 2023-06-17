import { Container, Flex, Spinner, Text } from '@chakra-ui/react'

const Dashboard = () => {
    return (
        <Container>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize={32} fontWeight={800} color="accent-1">
                        Dashboard
                    </Text>
                </Flex>

                <Spinner color="brand.default" />
            </Flex>
        </Container>
    )
}

export default Dashboard
