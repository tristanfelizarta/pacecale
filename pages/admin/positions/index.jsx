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
import { currency } from 'functions/currency'
import { month } from 'functions/month'

const AddModal = () => {
    const disclosure = useDisclosure()
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const addMutation = useMutation((data) => api.create('/positions', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('positions')
            setIsLoading(false)
            disclosure.onClose()

            toast({
                position: 'top',
                duration: 3000,
                render: () => (
                    <Toast
                        title="Success"
                        description="Position added successfully."
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
            rate: Number(data.rate)
        })
    }

    return (
        <Modal
            title="Add Position"
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

                    <FormControl isInvalid={errors.rate}>
                        <FormLabel>Rate Per Hour</FormLabel>
                        <Input
                            type="number"
                            size="lg"
                            {...register('rate', { required: true })}
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

const EditModal = ({ position }) => {
    const disclosure = useDisclosure()
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const addMutation = useMutation(
        (data) => api.update('/positions', position._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('positions')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Position updated successfully."
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
            rate: Number(data.rate)
        })
    }

    return (
        <Modal
            title="Edit Position"
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
                            defaultValue={position.title}
                            size="lg"
                            {...register('title', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.rate}>
                        <FormLabel>Rate Per Hour</FormLabel>
                        <Input
                            type="number"
                            defaultValue={position.rate}
                            size="lg"
                            {...register('rate', { required: true })}
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

const Positions = () => {
    const queryClient = useQueryClient()
    const { data: positions, isFetched: isPositionsFetched } = useQuery(
        ['positions'],
        () => api.all('/positions')
    )
    const toast = useToast()

    const deleteMutation = useMutation(
        (data) => api.remove('/positions', data.id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('positions')

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Position deleted succesfully."
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
                        Positions
                    </Text>
                </Flex>

                <Card>
                    <Table
                        data={positions}
                        fetched={isPositionsFetched}
                        th={[
                            'ID',
                            'Title',
                            'Rate Per Hour',
                            'Created',
                            'Updated',
                            ''
                        ]}
                        td={(position) => (
                            <Tr key={position._id}>
                                <Td>
                                    <Badge variant="tinted" colorScheme="brand">
                                        #
                                        {position._id
                                            .slice(15, 30)
                                            .toUpperCase()}
                                    </Badge>
                                </Td>

                                <Td>
                                    <Text textTransform="capitalize">
                                        {position.title}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>{currency(position.rate)}</Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {month[
                                            position.created
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ] +
                                            ' ' +
                                            position.created
                                                .split(',')[0]
                                                .split('/')[1] +
                                            ', ' +
                                            position.created
                                                .split(',')[0]
                                                .split('/')[2]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {month[
                                            position.updated
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ] +
                                            ' ' +
                                            position.updated
                                                .split(',')[0]
                                                .split('/')[1] +
                                            ', ' +
                                            position.updated
                                                .split(',')[0]
                                                .split('/')[2]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Flex justify="end" align="center" gap={3}>
                                        <EditModal position={position} />
                                        <IconButton
                                            variant="tinted"
                                            size="xs"
                                            colorScheme="red"
                                            icon={<FiTrash2 size={12} />}
                                            onClick={() =>
                                                onDelete(position._id)
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
                                ['_id', 'title', 'rate'].some((key) =>
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

export default Positions
