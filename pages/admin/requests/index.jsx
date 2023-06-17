import { Container, Flex, Text } from '@chakra-ui/react'

const Requests = () => {
    return (
        <Container>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize={32} fontWeight={800} color="accent-1">
                        Requests
                    </Text>
                </Flex>
            </Flex>
        </Container>
    )
}

export default Requests
