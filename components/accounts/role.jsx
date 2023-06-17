import { Flex, Text } from '@chakra-ui/react'
import Card from 'components/card'

const Role = () => {
    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Text fontSize={20} fontWeight="semibold" color="accent-1">
                    Role
                </Text>
            </Flex>
        </Card>
    )
}

export default Role
