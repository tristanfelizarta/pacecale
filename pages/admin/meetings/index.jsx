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
import { h12 } from 'functions/time'

const AddModal = () => {
    const disclosure = useDisclosure()
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const addMutation = useMutation((data) => api.create('/meetings', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('meetings')
            setIsLoading(false)
            disclosure.onClose()

            toast({
                position: 'top',
                duration: 3000,
                render: () => (
                    <Toast
                        title="Success"
                        description="Meeting added successfully."
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
            title: data.title.toLowerCase(),
            schedule: data.schedule
        })
    }

    return (
        <Modal
            title="Add Meeting"
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
                    <FormControl isInvalid={errors.title}>
                        <FormLabel>Title</FormLabel>
                        <Input
                            size="lg"
                            {...register('title', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.schedule}>
                        <FormLabel>Schedule</FormLabel>
                        <Input
                            type="datetime-local"
                            size="lg"
                            {...register('schedule', { required: true })}
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

const EditModal = ({ meeting }) => {
    const disclosure = useDisclosure()
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const addMutation = useMutation(
        (data) => api.update('/meetings', meeting._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('meetings')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Meeting updated successfully."
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
            title: data.title.toLowerCase(),
            schedule: data.schedule
        })
    }

    return (
        <Modal
            title="Edit Meeting"
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
                    <FormControl isInvalid={errors.title}>
                        <FormLabel>Title</FormLabel>
                        <Input
                            defaultValue={meeting.title}
                            size="lg"
                            {...register('title', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.schedule}>
                        <FormLabel>Schedule</FormLabel>
                        <Input
                            type="datetime-local"
                            defaultValue={meeting.schedule}
                            size="lg"
                            {...register('schedule', { required: true })}
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

const Meetings = () => {
    const queryClient = useQueryClient()
    const { data: meetings, isFetched: isMeetingsFetched } = useQuery(
        ['meetings'],
        () => api.all('/meetings')
    )
    const toast = useToast()

    const deleteMutation = useMutation(
        (data) => api.remove('/meetings', data.id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('meetings')

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Meeting deleted succesfully."
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
                        Meetings
                    </Text>
                </Flex>

                <Card>
                    <Table
                        data={meetings}
                        fetched={isMeetingsFetched}
                        th={[
                            'ID',
                            'Title',
                            'Schedule',
                            'Created',
                            'Updated',
                            ''
                        ]}
                        td={(meeting) => (
                            <Tr key={meeting._id}>
                                <Td>
                                    <Badge variant="tinted" colorScheme="brand">
                                        #
                                        {meeting._id
                                            .slice(15, 30)
                                            .toUpperCase()}
                                    </Badge>
                                </Td>

                                <Td>
                                    <Text textTransform="capitalize">
                                        {meeting.title}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {month[
                                            Number(
                                                meeting.schedule
                                                    .split('T')[0]
                                                    .split('-')[1]
                                            ) - 1
                                        ] +
                                            ' ' +
                                            meeting.schedule
                                                .split('T')[0]
                                                .split('-')[2] +
                                            ', ' +
                                            meeting.schedule
                                                .split('T')[0]
                                                .split('-')[0]}{' '}
                                        - {h12(meeting.schedule.split('T')[1])}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {month[
                                            meeting.created
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ] +
                                            ' ' +
                                            meeting.created
                                                .split(',')[0]
                                                .split('/')[1] +
                                            ', ' +
                                            meeting.created
                                                .split(',')[0]
                                                .split('/')[2]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {month[
                                            meeting.updated
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ] +
                                            ' ' +
                                            meeting.updated
                                                .split(',')[0]
                                                .split('/')[1] +
                                            ', ' +
                                            meeting.updated
                                                .split(',')[0]
                                                .split('/')[2]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Flex justify="end" align="center" gap={3}>
                                        <EditModal meeting={meeting} />
                                        <IconButton
                                            variant="tinted"
                                            size="xs"
                                            colorScheme="red"
                                            icon={<FiTrash2 size={12} />}
                                            onClick={() =>
                                                onDelete(meeting._id)
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
                                ['_id', 'title', 'schedule'].some((key) =>
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

export default Meetings
