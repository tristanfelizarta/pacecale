import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import {
    Avatar,
    Badge,
    chakra,
    Container,
    Flex,
    IconButton,
    Select,
    Td,
    Text,
    Tr
} from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'

const Accounts = () => {
    const router = useRouter()
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )

    return (
        <Container>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize={32} fontWeight={800} color="accent-1">
                        Accounts
                    </Text>
                </Flex>

                <Card>
                    <Table
                        data={users}
                        fetched={isUsersFetched}
                        th={['ID', 'Name', 'Email', 'Role', 'Status', '']}
                        td={(user) => (
                            <Tr key={user._id}>
                                <Td>
                                    <Badge variant="tinted" colorScheme="brand">
                                        #{user._id.slice(15, 30).toUpperCase()}
                                    </Badge>
                                </Td>

                                <Td>
                                    <Flex align="center" gap={3}>
                                        <Avatar
                                            name={user.name}
                                            src={user.image}
                                        />
                                        <Text>{user.name}</Text>
                                    </Flex>
                                </Td>

                                <Td>
                                    <Text>{user.email}</Text>
                                </Td>

                                <Td>
                                    <Badge
                                        variant="tinted"
                                        colorScheme={
                                            user.role === 'Admin'
                                                ? 'yellow'
                                                : user.role === 'Employee'
                                                ? 'brand'
                                                : 'red'
                                        }
                                    >
                                        {user.role}
                                    </Badge>
                                </Td>

                                <Td>
                                    <Badge
                                        variant="tinted"
                                        colorScheme={
                                            user.status === 'Active'
                                                ? 'blue'
                                                : 'red'
                                        }
                                    >
                                        {user.status}
                                    </Badge>
                                </Td>

                                <Td>
                                    <Flex justify="end">
                                        <IconButton
                                            size="xs"
                                            icon={
                                                <FiMoreHorizontal size={12} />
                                            }
                                            onClick={() =>
                                                router.push(
                                                    `/admin/accounts/${user._id}`
                                                )
                                            }
                                        />
                                    </Flex>
                                </Td>
                            </Tr>
                        )}
                        controls={(register) => (
                            <Flex flex={1} justify="end" align="center" gap={3}>
                                <Select
                                    placeholder="Role"
                                    size="lg"
                                    w="auto"
                                    {...register('role')}
                                >
                                    <chakra.option value="Admin">
                                        Admin
                                    </chakra.option>
                                    <chakra.option value="Employee">
                                        Employee
                                    </chakra.option>
                                    <chakra.option value="User">
                                        User
                                    </chakra.option>
                                </Select>

                                <Select
                                    placeholder="Status"
                                    size="lg"
                                    w="auto"
                                    {...register('status')}
                                >
                                    <chakra.option value="Active">
                                        Active
                                    </chakra.option>
                                    <chakra.option value="Inactive">
                                        Inactive
                                    </chakra.option>
                                </Select>
                            </Flex>
                        )}
                        filters={(data, watch) => {
                            return data
                                .filter((data) =>
                                    ['name', 'email'].some((key) =>
                                        data[key]
                                            .toString()
                                            .toLowerCase()
                                            .includes(
                                                watch('search') &&
                                                    watch(
                                                        'search'
                                                    ).toLowerCase()
                                            )
                                    )
                                )
                                .filter((data) =>
                                    watch('role')
                                        ? watch('role') === data.role
                                        : data
                                )
                                .filter((data) =>
                                    watch('status')
                                        ? watch('status') === data.status
                                        : data
                                )
                        }}
                        effects={(watch) => [watch('role'), watch('status')]}
                    />
                </Card>
            </Flex>
        </Container>
    )
}

export default Accounts
