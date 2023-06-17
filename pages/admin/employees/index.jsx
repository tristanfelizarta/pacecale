import { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Avatar,
    Badge,
    Button,
    chakra,
    Container,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    Select,
    Td,
    Text,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { FiChevronRight, FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'
import Modal from 'components/modal'
import Toast from 'components/toast'
import { currency } from 'functions/currency'

const AddModal = ({ user, positions, schedules }) => {
    const disclosure = useDisclosure()
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const {
        register,
        formState: { errors },
        clearErrors,
        reset,
        handleSubmit
    } = useForm()

    const editMutation = useMutation(
        (data) => api.update('/users/hire', user._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="User updated successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)
        editMutation.mutate(data)
    }

    return (
        <Modal
            title="Add Employee"
            size="xl"
            toggle={(onOpen) => (
                <IconButton
                    size="xs"
                    icon={<FiChevronRight size={12} />}
                    onClick={() => {
                        onOpen()
                        clearErrors()
                        reset()
                    }}
                />
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <FormControl isInvalid={errors.name}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            defaultValue={user.name}
                            size="lg"
                            {...register('name', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                            value={user.email}
                            size="lg"
                            cursor="not-allowed"
                            readOnly
                        />
                    </FormControl>

                    <FormControl isInvalid={errors.position}>
                        <FormLabel>Position</FormLabel>

                        <Select
                            placeholder="Select"
                            size="lg"
                            textTransform="capitalize"
                            {...register('position', { required: true })}
                        >
                            {positions.map((position) => (
                                <chakra.option
                                    textTransform="capitalize"
                                    value={position._id}
                                    key={position._id}
                                >
                                    {position.title}
                                </chakra.option>
                            ))}
                        </Select>

                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.schedule}>
                        <FormLabel>Schedule</FormLabel>

                        <Select
                            placeholder="Select"
                            size="lg"
                            textTransform="capitalize"
                            {...register('schedule', { required: true })}
                        >
                            {schedules.map((schedule) => (
                                <chakra.option
                                    textTransform="capitalize"
                                    value={schedule._id}
                                    key={schedule._id}
                                >
                                    {schedule.timein + ' - ' + schedule.timeout}
                                </chakra.option>
                            ))}
                        </Select>

                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.hired_date}>
                        <FormLabel>Hired Date</FormLabel>
                        <Input
                            type="date"
                            size="lg"
                            {...register('hired_date', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Contract End Date (Optional)</FormLabel>
                        <Input
                            type="date"
                            size="lg"
                            {...register('contract_end_date')}
                        />
                    </FormControl>

                    <Divider />

                    <Button
                        type="submit"
                        size="lg"
                        colorScheme="brand"
                        isLoading={isLoading}
                    >
                        Save Changes
                    </Button>
                </Flex>
            </form>
        </Modal>
    )
}

const UsersModal = ({ users, isUsersFetched, positions, schedules }) => {
    const disclosure = useDisclosure()

    return (
        <Modal
            title="Select User"
            size="xl"
            toggle={(onOpen) => (
                <Button
                    size="lg"
                    colorScheme="brand"
                    onClick={() => {
                        onOpen()
                    }}
                >
                    Add New
                </Button>
            )}
            disclosure={disclosure}
        >
            <Table
                data={users}
                fetched={isUsersFetched}
                th={[]}
                td={(user) => (
                    <Tr key={user._id}>
                        <Td>
                            <Flex align="center" gap={3}>
                                <Avatar name={user.name} src={user.image} />
                                <Text>{user.name}</Text>
                            </Flex>
                        </Td>

                        <Td>
                            <Badge variant="tinted" colorScheme="red">
                                User
                            </Badge>
                        </Td>

                        <Td>
                            <Flex justify="end">
                                <AddModal
                                    user={user}
                                    positions={positions}
                                    schedules={schedules}
                                />
                            </Flex>
                        </Td>
                    </Tr>
                )}
                filters={(data) => {
                    return data.filter((data) => data.role === 'User')
                }}
                settings={{
                    searchWidth: 'full'
                }}
            />
        </Modal>
    )
}

const Employees = () => {
    const router = useRouter()
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: positions, isFetched: isPositionsFetched } = useQuery(
        ['positions'],
        () => api.all('/positions')
    )
    const { data: schedules, isFetched: isSchedulesFetched } = useQuery(
        ['schedules'],
        () => api.all('/schedules')
    )

    return (
        <Container>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize={32} fontWeight={800} color="accent-1">
                        Employees
                    </Text>
                </Flex>

                <Card>
                    <Table
                        data={users}
                        fetched={
                            isUsersFetched &&
                            isPositionsFetched &&
                            isSchedulesFetched
                        }
                        th={[
                            'ID',
                            'Name',
                            'Position',
                            'Rate Per Hour',
                            'Schedule',
                            ''
                        ]}
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
                                    <Text textTransform="capitalize">
                                        {user.position.title}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>{currency(user.position.rate)}</Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {user.schedule.timein +
                                            ' - ' +
                                            user.schedule.timeout}
                                    </Text>
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
                                    placeholder="Position"
                                    size="lg"
                                    w="auto"
                                    textTransform="capitalize"
                                    {...register('position')}
                                >
                                    {isPositionsFetched &&
                                        positions.map((position) => (
                                            <chakra.option
                                                textTransform="capitalize"
                                                value={position.title}
                                                key={position._id}
                                            >
                                                {position.title}
                                            </chakra.option>
                                        ))}
                                </Select>

                                <UsersModal
                                    users={users}
                                    isUsersFetched={isUsersFetched}
                                    positions={positions}
                                    schedules={schedules}
                                />
                            </Flex>
                        )}
                        filters={(data, watch) => {
                            return data
                                .filter((data) => data.role === 'Employee')
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
                                    watch('position')
                                        ? watch('position') ===
                                          data.position.title
                                        : data
                                )
                        }}
                        effects={(watch) => [watch('search')]}
                    />
                </Card>
            </Flex>
        </Container>
    )
}

export default Employees
