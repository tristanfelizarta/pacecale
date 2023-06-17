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

    const addMutation = useMutation((data) => api.create('/deductions', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('deductions')
            setIsLoading(false)
            disclosure.onClose()

            toast({
                position: 'top',
                duration: 3000,
                render: () => (
                    <Toast
                        title="Success"
                        description="Deduction added successfully."
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
            amount: Number(data.amount)
        })
    }

    return (
        <Modal
            title="Add Deduction"
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

                    <FormControl isInvalid={errors.amount}>
                        <FormLabel>Amount</FormLabel>
                        <Input
                            type="number"
                            size="lg"
                            {...register('amount', { required: true })}
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

const EditModal = ({ deduction }) => {
    const disclosure = useDisclosure()
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const addMutation = useMutation(
        (data) => api.update('/deductions', deduction._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('deductions')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Deduction updated successfully."
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
            amount: Number(data.amount)
        })
    }

    return (
        <Modal
            title="Edit Deduction"
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
                            defaultValue={deduction.title}
                            size="lg"
                            {...register('title', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.amount}>
                        <FormLabel>Amount</FormLabel>
                        <Input
                            defaultValue={deduction.amount}
                            type="number"
                            size="lg"
                            {...register('amount', { required: true })}
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

const Deductions = () => {
    const queryClient = useQueryClient()
    const { data: deductions, isFetched: isDeductionsFetched } = useQuery(
        ['deductions'],
        () => api.all('/deductions')
    )
    const toast = useToast()

    const deleteMutation = useMutation(
        (data) => api.remove('/deductions', data.id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('deductions')

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Deduction deleted succesfully."
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
                        Deductions
                    </Text>
                </Flex>

                <Card>
                    <Table
                        data={deductions}
                        fetched={isDeductionsFetched}
                        th={['ID', 'Title', 'Amount', 'Created', 'Updated', '']}
                        td={(deduction) => (
                            <Tr key={deduction._id}>
                                <Td>
                                    <Badge variant="tinted" colorScheme="brand">
                                        #
                                        {deduction._id
                                            .slice(15, 30)
                                            .toUpperCase()}
                                    </Badge>
                                </Td>

                                <Td>
                                    <Text textTransform="uppercase">
                                        {deduction.title}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>{currency(deduction.amount)}</Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {month[
                                            deduction.created
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ] +
                                            ' ' +
                                            deduction.created
                                                .split(',')[0]
                                                .split('/')[1] +
                                            ', ' +
                                            deduction.created
                                                .split(',')[0]
                                                .split('/')[2]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {month[
                                            deduction.updated
                                                .split(',')[0]
                                                .split('/')[0] - 1
                                        ] +
                                            ' ' +
                                            deduction.updated
                                                .split(',')[0]
                                                .split('/')[1] +
                                            ', ' +
                                            deduction.updated
                                                .split(',')[0]
                                                .split('/')[2]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Flex justify="end" align="center" gap={3}>
                                        <EditModal deduction={deduction} />
                                        <IconButton
                                            variant="tinted"
                                            size="xs"
                                            colorScheme="red"
                                            icon={<FiTrash2 size={12} />}
                                            onClick={() =>
                                                onDelete(deduction._id)
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
                                ['_id', 'title', 'amount'].some((key) =>
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

export default Deductions
