import { Flex, GridItem, Icon, Text } from '@chakra-ui/react'
import { FiActivity, FiCheckSquare, FiUsers, FiXSquare } from 'react-icons/fi'
import Card from 'components/card'

const Statistics = ({ date, today, tpt, tat, te, pt }) => {
    return (
        <>
            <GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
                <Card>
                    <Flex justify="space-between" align="center">
                        <Flex direction="column" gap={1} w="calc(100% - 76px)">
                            <Text
                                fontSize="2xl"
                                fontWeight="semibold"
                                color="accent-1"
                                noOfLines={1}
                            >
                                {tpt}
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="accent-1"
                            >
                                {date !== today ? 'Total' : null} Present{' '}
                                {date === today ? 'Today' : null}
                            </Text>
                        </Flex>

                        <Flex
                            bg="brand.default"
                            justify="center"
                            align="center"
                            borderRadius="full"
                            h={16}
                            w={16}
                        >
                            <Icon
                                as={FiCheckSquare}
                                boxSize={6}
                                color="white"
                            />
                        </Flex>
                    </Flex>
                </Card>
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
                <Card>
                    <Flex justify="space-between" align="center">
                        <Flex direction="column" gap={1} w="calc(100% - 76px)">
                            <Text
                                fontSize="2xl"
                                fontWeight="semibold"
                                color="accent-1"
                                noOfLines={1}
                            >
                                {tat}
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="accent-1"
                            >
                                {date !== today ? 'Total' : null} Absent{' '}
                                {date === today ? 'Today' : null}
                            </Text>
                        </Flex>

                        <Flex
                            bg="brand.default"
                            justify="center"
                            align="center"
                            borderRadius="full"
                            h={16}
                            w={16}
                        >
                            <Icon as={FiXSquare} boxSize={6} color="white" />
                        </Flex>
                    </Flex>
                </Card>
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
                <Card>
                    <Flex justify="space-between" align="center">
                        <Flex direction="column" gap={1} w="calc(100% - 76px)">
                            <Text
                                fontSize="2xl"
                                fontWeight="semibold"
                                color="accent-1"
                                noOfLines={1}
                            >
                                {te}
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="accent-1"
                            >
                                Total Employees
                            </Text>
                        </Flex>

                        <Flex
                            bg="brand.default"
                            justify="center"
                            align="center"
                            borderRadius="full"
                            h={16}
                            w={16}
                        >
                            <Icon as={FiUsers} boxSize={6} color="white" />
                        </Flex>
                    </Flex>
                </Card>
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
                <Card>
                    <Flex justify="space-between" align="center">
                        <Flex direction="column" gap={1} w="calc(100% - 76px)">
                            <Text
                                fontSize="2xl"
                                fontWeight="semibold"
                                color="accent-1"
                                noOfLines={1}
                            >
                                {pt}%
                            </Text>

                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="accent-1"
                            >
                                {date !== today ? 'Total' : null} Percentage{' '}
                                {date === today ? 'Today' : null}
                            </Text>
                        </Flex>

                        <Flex
                            bg="brand.default"
                            justify="center"
                            align="center"
                            borderRadius="full"
                            h={16}
                            w={16}
                        >
                            <Icon as={FiActivity} boxSize={6} color="white" />
                        </Flex>
                    </Flex>
                </Card>
            </GridItem>
        </>
    )
}

export default Statistics
