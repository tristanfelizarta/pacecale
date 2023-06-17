import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Badge,
    Button,
    Container,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    Td,
    Text,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import Table from 'components/table'
import Card from 'components/card'
import Modal from 'components/modal'
import Toast from 'components/toast'
import { month } from 'functions/month'
import { h12, h24 } from 'functions/time'

const AddModal = () => {
    const disclosure = useDisclosure()
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const addMutation = useMutation((data) => api.create('/schedules', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('schedules')
            setIsLoading(false)
            disclosure.onClose()

            toast({
                position: 'top',
                duration: 3000,
                render: () => (
                    <Toast
                        title="Success"
                        description="Schedule added successfully."
                    />
                )
            })
        }
    })

    const {
        register,
        formState: { errors },
        clearErrors,
        reset,
        handleSubmit
    } = useForm()

    const onSubmit = (data) => {
        setIsLoading(true)

        addMutation.mutate({
            timein: h12(data.timein),
            timeout: h12(data.timeout)
        })
    }

    return (
        <Modal
            title="Add Schedule"
            toggle={(onOpen) => (
                <Button
                    size="lg"
                    colorScheme="brand"
                    onClick={() => {
                        clearErrors()
                        reset()
                        onOpen()
                    }}
                >
                    Add New
                </Button>
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <FormControl isInvalid={errors.timein}>
                        <FormLabel>Time In</FormLabel>
                        <Input
                            type="time"
                            size="lg"
                            {...register('timein', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.timeout}>
                        <FormLabel>Time Out</FormLabel>
                        <Input
                            type="time"
                            size="lg"
                            {...register('timeout', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <Divider />

                    <Button
                        type="submit"
                        size="lg"
                        colorScheme="brand"
                        isLoading={isLoading}
                    >
                        Submit
                    </Button>
                </Flex>
            </form>
        </Modal>
    )
}

const EditModal = ({ schedule }) => {
    const disclosure = useDisclosure()
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const addMutation = useMutation(
        (data) => api.update('/schedules', schedule._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('schedules')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Schedule updated successfully."
                        />
                    )
                })
            }
        }
    )

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm()

    const onSubmit = (data) => {
        setIsLoading(true)

        addMutation.mutate({
            timein: h12(data.timein),
            timeout: h12(data.timeout)
        })
    }

    return (
        <Modal
            title="Edit Schedule"
            toggle={(onOpen) => (
                <IconButton
                    variant="tinted"
                    size="xs"
                    colorScheme="brand"
                    icon={<FiEdit2 size={12} />}
                    onClick={() => {
                        onOpen()
                    }}
                />
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <FormControl isInvalid={errors.timein}>
                        <FormLabel>Time In</FormLabel>
                        <Input
                            type="time"
                            defaultValue={h24(schedule.timein)}
                            size="lg"
                            {...register('timein', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.timeout}>
                        <FormLabel>Time Out</FormLabel>
                        <Input
                            type="time"
                            defaultValue={h24(schedule.timeout)}
                            size="lg"
                            {...register('timeout', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <Divider />

                    <Button
                        type="submit"
                        size="lg"
                        colorScheme="brand"
                        isLoading={isLoading}
                    >
                        Submit
                    </Button>
                </Flex>
            </form>
        </Modal>
    )
}

const Schedules = () => {
    const queryClient = useQueryClient()
    const { data: schedules, isFetched: isSchedulesFetched } = useQuery(
        ['schedules'],
        () => api.all('/schedules')
    )
    const toast = useToast()

    const deleteMutation = useMutation(
        (data) => api.remove('/schedules', data.id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('schedules')

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Schedule deleted succesfully."
                        />
                    )
                })
            }
        }
    )

    const onDelete = (id) => {
        deleteMutation.mutate({
            id: id
        })
    }

    return (
        <Container>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize={32} fontWeight={800} color="accent-1">
                        Schedules
                    </Text>
                </Flex>

                <Card>
                    <Table
                        data={schedules}
                        fetched={isSchedulesFetched}
                        th={[
                            'ID',
                            'Time In',
                            'Time Out',
                            'Created',
                            'Updated',
                            ''
                        ]}
                        td={(schedule) => (
                            <Tr key={schedule._id}>
                                <Td>
                                    <Badge variant="tinted" colorScheme="brand">
                                        #
                                        {schedule._id
                                            .slice(15, 30)
                                            .toUpperCase()}
                                    </Badge>
                                </Td>

                                <Td>
                                    <Text>{schedule.timein}</Text>
                                </Td>

                                <Td>
                                    <Text>{schedule.timeout}</Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {month[
                                            schedule.created
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ] +
                                            ' ' +
                                            schedule.created
                                                .split(',')[0]
                                                .split('/')[1] +
                                            ', ' +
                                            schedule.created
                                                .split(',')[0]
                                                .split('/')[2]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {month[
                                            schedule.updated
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ] +
                                            ' ' +
                                            schedule.updated
                                                .split(',')[0]
                                                .split('/')[1] +
                                            ', ' +
                                            schedule.updated
                                                .split(',')[0]
                                                .split('/')[2]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Flex justify="end" align="center" gap={3}>
                                        <EditModal schedule={schedule} />
                                        <IconButton
                                            variant="tinted"
                                            size="xs"
                                            colorScheme="red"
                                            icon={<FiTrash2 size={12} />}
                                            onClick={() =>
                                                onDelete(schedule._id)
                                            }
                                        />
                                    </Flex>
                                </Td>
                            </Tr>
                        )}
                        controls={() => (
                            <Flex flex={1} justify="end" align="center" gap={3}>
                                <AddModal />
                            </Flex>
                        )}
                        filters={(data, watch) => {
                            return data.filter((data) =>
                                ['_id', 'timein', 'timeout'].some((key) =>
                                    data[key]
                                        .toString()
                                        .toLowerCase()
                                        .includes(
                                            watch('search') &&
                                                watch('search').toLowerCase()
                                        )
                                )
                            )
                        }}
                    />
                </Card>
            </Flex>
        </Container>
    )
}

export default Schedules
