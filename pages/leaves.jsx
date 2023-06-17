import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import axios from 'axios'
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
    Icon,
    IconButton,
    Input,
    Select,
    Td,
    Text,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import {
    FiDownloadCloud,
    FiFile,
    FiMoreHorizontal,
    FiUploadCloud,
    FiX
} from 'react-icons/fi'
import Card from 'components/card'
import Modal from 'components/modal'
import Table from 'components/table'
import Toast from 'components/toast'
import { month } from 'functions/month'
import { calcDate } from 'functions/calculate-date'

const AddLeaveModal = ({ session }) => {
    const queryClient = useQueryClient()
    const { data: leaveTypes, isFetched: isLeaveTypesFetched } = useQuery(
        ['leave_types'],
        () => api.all('/leaves/types')
    )
    const disclosure = useDisclosure()
    const [files, setFiles] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const handleFiles = (e) => {
        const file = e.target.files[0]
        setFiles(file)
    }

    const addLeave = useMutation((data) => api.create('/leaves', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('employee_leaves')
            setFiles(null)
            setIsLoading(false)
            disclosure.onClose()

            toast({
                position: 'top',
                duration: 1000,
                render: () => (
                    <Toast
                        title="Success"
                        description="Leave successfully filed."
                    />
                )
            })
        }
    })

    const {
        register,
        watch,
        setValue,
        formState: { errors },
        clearErrors,
        reset,
        handleSubmit
    } = useForm()

    const onSubmit = async (data) => {
        setIsLoading(true)

        if (!files) {
            toast({
                position: 'top',
                duration: 1000,
                render: () => (
                    <Toast
                        title="Error"
                        description="Please attach file."
                        status="error"
                    />
                )
            })

            setIsLoading(false)

            return
        }

        if (calcDate(watch('from'), watch('to')).total_days > 15) {
            setIsLoading(false)

            toast({
                position: 'top',
                duration: 1000,
                render: () => (
                    <Toast
                        title="Error"
                        description="13 days maximum per year."
                        status="error"
                    />
                )
            })

            return
        }

        for (const item of [files]) {
            const formData = new FormData()

            formData.append('file', item)
            formData.append('upload_preset', 'ctx-hrms')

            let res = await axios.post(
                'https://api.cloudinary.com/v1_1/ctx-hrms/raw/upload',
                formData
            )

            addLeave.mutate({
                user: {
                    id: session.user.id
                },
                type: data.type,
                from: data.from,
                to: data.to,
                days: Number(data.days),
                payed: data.status === 'Paid Leave' ? true : false,
                file: {
                    url: res.data.secure_url,
                    name: files.name,
                    size: files.size
                }
            })
        }
    }

    useEffect(() => {
        if (watch('type')) {
            {
                leaveTypes
                    .filter((type) => type.name === watch('type'))
                    .map((type) =>
                        setValue(
                            'status',
                            type.payed ? 'Paid Leave' : 'Unpaid Leave'
                        )
                    )
            }
        }
    }, [watch('type')])

    return (
        <Modal
            title="Add Leave"
            size="xl"
            toggle={(onOpen) => (
                <Button
                    size="lg"
                    colorScheme="brand"
                    onClick={() =>
                        setFiles(null) || clearErrors() || reset() || onOpen()
                    }
                >
                    Add New
                </Button>
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <FormControl isInvalid={errors.type}>
                        <FormLabel>Type</FormLabel>

                        <Select
                            placeholder="Select"
                            size="lg"
                            {...register('type', { required: true })}
                        >
                            {isLeaveTypesFetched &&
                                leaveTypes.map((type) => (
                                    <chakra.option
                                        textTransform="capitalize"
                                        value={type.name}
                                        key={type._id}
                                    >
                                        {type.name}
                                    </chakra.option>
                                ))}
                        </Select>

                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    {watch('type') && (
                        <FormControl>
                            <FormLabel>Status</FormLabel>

                            <Input
                                type="text"
                                size="lg"
                                readOnly
                                {...register('status')}
                            />
                        </FormControl>
                    )}

                    <FormControl isInvalid={errors.from}>
                        <FormLabel>From</FormLabel>
                        <Input
                            type="date"
                            size="lg"
                            {...register('from', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.to}>
                        <FormLabel>To</FormLabel>
                        <Input
                            type="date"
                            size="lg"
                            {...register('to', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    {watch('from') && watch('to') && (
                        <FormControl>
                            <FormLabel>Days</FormLabel>
                            <Input
                                type="number"
                                value={
                                    calcDate(watch('from'), watch('to'))
                                        .total_days
                                }
                                size="lg"
                                cursor="not-allowed"
                                readOnly
                                {...register('days')}
                            />
                        </FormControl>
                    )}

                    {files ? (
                        <Flex
                            align="center"
                            gap={3}
                            position="relative"
                            border="1px solid"
                            borderColor="border"
                            borderRadius={12}
                            p={6}
                        >
                            <Flex flex={1} align="center" gap={3}>
                                <Icon
                                    as={FiFile}
                                    boxSize={8}
                                    color="accent-1"
                                />

                                <Flex direction="column" w="calc(100% - 88px)">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="accent-1"
                                        noOfLines={1}
                                    >
                                        {files.name}
                                    </Text>

                                    <Text fontSize="xs">
                                        {files.size.toLocaleString(undefined, {
                                            maximumFractionDigits: 2
                                        }) + ' '}
                                        {files.size >= 1 &&
                                            files.size <= 999 &&
                                            'B'}
                                        {files.size >= 1000 &&
                                            files.size <= 999999 &&
                                            'KB'}
                                        {files.size >= 1000000 &&
                                            files.size <= 999999999 &&
                                            'MB'}
                                    </Text>
                                </Flex>
                            </Flex>

                            <Flex position="absolute" right={6}>
                                <IconButton
                                    size="xs"
                                    icon={<FiX size={16} />}
                                    onClick={() => setFiles(null)}
                                />
                            </Flex>
                        </Flex>
                    ) : (
                        <Flex
                            overflow="hidden"
                            align="center"
                            direction="column"
                            gap={1}
                            position="relative"
                            border="1px solid"
                            borderColor="border"
                            borderRadius={12}
                            p={6}
                        >
                            <Flex gap={3} color="accent-1">
                                <Icon as={FiUploadCloud} boxSize={6} />
                                <Text fontWeight="medium">Upload File</Text>
                            </Flex>

                            <Text fontSize="xs">
                                Select .png .pdf .docx format.
                            </Text>

                            <Input
                                type="file"
                                position="absolute"
                                top={-8}
                                h={128}
                                opacity={0}
                                cursor="pointer"
                                onChange={handleFiles}
                            />
                        </Flex>
                    )}
                    <Flex justify="end" align="center" gap={3}>
                        <Button size="lg" onClick={disclosure.onClose}>
                            Close
                        </Button>

                        <Button
                            type="submit"
                            size="lg"
                            colorScheme="brand"
                            isLoading={isLoading}
                        >
                            Submit
                        </Button>
                    </Flex>
                </Flex>
            </form>
        </Modal>
    )
}

const ViewModal = ({ users, leave }) => {
    const queryClient = useQueryClient()
    const disclosure = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const editLeave = useMutation(
        (data) => api.update('/leaves', leave._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('employee_leaves')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 1000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Leave cancelled successfully."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = () => {
        setIsLoading(true)

        editLeave.mutate({
            status: 'cancelled'
        })
    }

    return (
        <Modal
            title="Leave Information"
            size="xl"
            toggle={(onOpen) => (
                <IconButton
                    size="xs"
                    icon={<FiMoreHorizontal size={12} />}
                    onClick={onOpen}
                />
            )}
            disclosure={disclosure}
        >
            <Flex direction="column" gap={6}>
                <Flex
                    direction="column"
                    gap={6}
                    position="relative"
                    border="1px solid"
                    borderColor="border"
                    borderRadius={12}
                    p={6}
                >
                    <Flex justify="space-between" align="center" gap={6}>
                        {users
                            .filter((user) => user._id === leave.user.id)
                            .map((user) => (
                                <Flex
                                    align="center"
                                    gap={3}
                                    key={user._id}
                                    w="calc(100% - 96px)"
                                >
                                    <Avatar name={user.name} src={user.image} />

                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="accent-1"
                                        noOfLines={1}
                                    >
                                        {user.name}
                                    </Text>
                                </Flex>
                            ))}

                        <Badge
                            variant="tinted"
                            textTransform="capitalize"
                            colorScheme={
                                leave.status === 'approved'
                                    ? 'brand'
                                    : leave.status === 'rejected'
                                    ? 'red'
                                    : leave.status === 'waiting'
                                    ? 'yellow'
                                    : leave.status === 'cancelled' && 'red'
                            }
                        >
                            {leave.status}
                        </Badge>
                    </Flex>

                    <Divider />

                    <Flex
                        align="center"
                        gap={3}
                        opacity={leave.status === 'cancelled' ? 0.5 : 1}
                    >
                        <Flex flex={1} align="center" gap={3}>
                            <Icon as={FiFile} boxSize={8} color="accent-1" />

                            <Flex direction="column" w="calc(100% - 88px)">
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    textDecoration={
                                        leave.status === 'cancelled' &&
                                        'line-through'
                                    }
                                    color="accent-1"
                                    noOfLines={1}
                                >
                                    {leave.file.name}
                                </Text>

                                <Text fontSize="xs">
                                    {leave.file.size.toLocaleString(undefined, {
                                        maximumFractionDigits: 2
                                    }) + ' '}
                                    {leave.file.size >= 1 &&
                                        leave.file.size <= 999 &&
                                        'B'}
                                    {leave.file.size >= 1000 &&
                                        leave.file.size <= 999999 &&
                                        'KB'}
                                    {leave.file.size >= 1000000 &&
                                        leave.file.size <= 999999999 &&
                                        'MB'}
                                </Text>
                            </Flex>
                        </Flex>

                        <Flex position="absolute" right={6}>
                            {leave.status === 'cancelled' ? (
                                <IconButton
                                    size="xs"
                                    cursor="not-allowed"
                                    icon={<FiDownloadCloud size={16} />}
                                />
                            ) : (
                                <chakra.a href={leave.file.url}>
                                    <IconButton
                                        size="xs"
                                        icon={<FiDownloadCloud size={16} />}
                                    />
                                </chakra.a>
                            )}
                        </Flex>
                    </Flex>

                    <Divider />

                    <Flex justify="space-between" align="center" gap={6}>
                        <Text fontSize="xs" textAlign="center">
                            {leave._id.slice(0, 10).toUpperCase()}
                        </Text>

                        <Text fontSize="xs">
                            {leave.status !== 'cancelled'
                                ? leave.created.split(',')
                                : leave.cancelled.date}
                        </Text>
                    </Flex>
                </Flex>

                {leave.status === 'approved' && (
                    <Flex
                        direction="column"
                        gap={6}
                        position="relative"
                        border="1px dashed"
                        borderColor="brand.default"
                        borderRadius={12}
                        p={6}
                    >
                        <Flex justify="space-between" align="center" gap={6}>
                            {users
                                .filter(
                                    (user) => user._id === leave.approved.by
                                )
                                .map((user) => (
                                    <Flex
                                        align="center"
                                        gap={3}
                                        key={user._id}
                                        w="calc(100% - 96px)"
                                    >
                                        <Avatar
                                            name={user.name}
                                            src={user.image}
                                        />

                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="accent-1"
                                            noOfLines={1}
                                        >
                                            {user.name}
                                        </Text>
                                    </Flex>
                                ))}

                            <Badge
                                variant="tinted"
                                textTransform="capitalize"
                                colorScheme={
                                    leave.status === 'approved'
                                        ? 'brand'
                                        : leave.status === 'rejected'
                                        ? 'red'
                                        : leave.status === 'waiting'
                                        ? 'yellow'
                                        : leave.status === 'cancelled' && 'red'
                                }
                            >
                                {leave.status}
                            </Badge>
                        </Flex>

                        <Divider />

                        <Flex align="center" gap={3}>
                            <Flex flex={1} align="center" gap={3}>
                                <Icon
                                    as={FiFile}
                                    boxSize={8}
                                    color="brand.default"
                                />

                                <Flex direction="column" w="calc(100% - 88px)">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="accent-1"
                                        noOfLines={1}
                                    >
                                        {leave.approved.file.name}
                                    </Text>

                                    <Text fontSize="xs">
                                        {leave.approved.file.size.toLocaleString(
                                            undefined,
                                            { maximumFractionDigits: 2 }
                                        ) + ' '}
                                        {leave.approved.file.size >= 1 &&
                                            leave.approved.file.size <= 999 &&
                                            'B'}
                                        {leave.approved.file.size >= 1000 &&
                                            leave.approved.file.size <=
                                                999999 &&
                                            'KB'}
                                        {leave.approved.file.size >= 1000000 &&
                                            leave.approved.file.size <=
                                                999999999 &&
                                            'MB'}
                                    </Text>
                                </Flex>
                            </Flex>

                            <Flex position="absolute" right={6}>
                                <chakra.a href={leave.approved.file.url}>
                                    <IconButton
                                        variant="tinted"
                                        size="xs"
                                        colorScheme="brand"
                                        icon={<FiDownloadCloud size={16} />}
                                    />
                                </chakra.a>
                            </Flex>
                        </Flex>

                        <Divider />

                        <Flex justify="space-between" align="center" gap={6}>
                            <Text fontSize="xs" textAlign="center">
                                {leave._id.slice(0, 10).toUpperCase()}
                            </Text>

                            <Text fontSize="xs">
                                {leave.approved.date.split(',')}
                            </Text>
                        </Flex>
                    </Flex>
                )}

                {leave.status === 'rejected' && (
                    <Flex
                        direction="column"
                        gap={6}
                        position="relative"
                        border="1px dashed"
                        borderColor="red.default"
                        borderRadius={12}
                        p={6}
                    >
                        <Flex justify="space-between" align="center" gap={6}>
                            {users
                                .filter(
                                    (user) => user._id === leave.rejected.by
                                )
                                .map((user) => (
                                    <Flex
                                        align="center"
                                        gap={3}
                                        key={user._id}
                                        w="calc(100% - 96px)"
                                    >
                                        <Avatar
                                            name={user.name}
                                            src={user.image}
                                        />

                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="accent-1"
                                            noOfLines={1}
                                        >
                                            {user.name}
                                        </Text>
                                    </Flex>
                                ))}

                            <Badge
                                variant="tinted"
                                textTransform="capitalize"
                                colorScheme={
                                    leave.status === 'approved'
                                        ? 'brand'
                                        : leave.status === 'rejected'
                                        ? 'red'
                                        : leave.status === 'waiting'
                                        ? 'yellow'
                                        : leave.status === 'cancelled' && 'red'
                                }
                            >
                                {leave.status}
                            </Badge>
                        </Flex>

                        <Divider />

                        <Flex justify="space-between" align="center" gap={6}>
                            <Text fontSize="xs" textAlign="center">
                                {leave._id.slice(0, 10).toUpperCase()}
                            </Text>

                            <Text fontSize="xs">
                                {leave.rejected.date.split(',')}
                            </Text>
                        </Flex>
                    </Flex>
                )}

                {leave.status === 'waiting' && (
                    <Button
                        size="lg"
                        colorScheme="red"
                        isLoading={isLoading}
                        onClick={() => onSubmit()}
                    >
                        Cancel Leave
                    </Button>
                )}
            </Flex>
        </Modal>
    )
}

const Leaves = () => {
    const { data: session } = useSession()
    const { data: user, isFetched: isUserFetched } = useQuery(['user'], () =>
        api.get('/users', session.user.id)
    )
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: leaves, isFetched: isLeavesFetched } = useQuery(
        ['employee_leaves'],
        () => api.get('leaves/employee', session.user.id)
    )

    return (
        <Container>
            <Card>
                <Flex direction="column" gap={6}>
                    <Flex justify="space-between" align="center" gap={6}>
                        <Text
                            fontSize="xl"
                            fontWeight="semibold"
                            color="accent-1"
                        >
                            Leaves
                        </Text>

                        <Flex align="center" gap={3}>
                            <chakra.a href="https://res.cloudinary.com/ctx-hrms/raw/upload/v1669943957/ctx-hrms/Sample-Leave-Form_x6cmof.doc">
                                <Button
                                    variant="tinted"
                                    size="lg"
                                    colorScheme="brand"
                                >
                                    Download Form
                                </Button>
                            </chakra.a>

                            {!isUserFetched && user?.limit === 0 ? (
                                <Button size="lg" colorScheme="brand" disabled>
                                    Add New
                                </Button>
                            ) : (
                                <AddLeaveModal session={session} />
                            )}
                        </Flex>
                    </Flex>

                    <Divider />

                    <Table
                        data={leaves}
                        fetched={isUsersFetched && isLeavesFetched}
                        th={[
                            'Type',
                            'From',
                            'To',
                            'Days',
                            'Status',
                            'Created',
                            ''
                        ]}
                        td={(leave) => (
                            <Tr key={leave._id}>
                                <Td>
                                    <Text textTransform="capitalize">
                                        {leave.type}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {month[leave.from.split('-')[1] - 1]}{' '}
                                        {leave.from.split('-')[2]},{' '}
                                        {leave.from.split('-')[0]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>
                                        {month[leave.to.split('-')[1] - 1]}{' '}
                                        {leave.to.split('-')[2]},{' '}
                                        {leave.to.split('-')[0]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>{leave.days}</Text>
                                </Td>

                                <Td>
                                    <Badge
                                        variant="tinted"
                                        textTransform="capitalize"
                                        colorScheme={
                                            leave.status === 'approved'
                                                ? 'brand'
                                                : leave.status === 'rejected'
                                                ? 'red'
                                                : leave.status === 'waiting'
                                                ? 'yellow'
                                                : leave.status ===
                                                      'cancelled' && 'red'
                                        }
                                    >
                                        {leave.status}
                                    </Badge>
                                </Td>

                                <Td>
                                    <Text>
                                        {
                                            month[
                                                leave.created
                                                    .split(',')[0]
                                                    .split('/')[0] - 1
                                            ]
                                        }{' '}
                                        {
                                            leave.created
                                                .split(',')[0]
                                                .split('/')[1]
                                        }
                                        ,{' '}
                                        {
                                            leave.created
                                                .split(',')[0]
                                                .split('/')[2]
                                        }
                                    </Text>
                                </Td>

                                <Td textAlign="right">
                                    <ViewModal users={users} leave={leave} />
                                </Td>
                            </Tr>
                        )}
                        controls={(register) => (
                            <Flex flex={1} justify="end" align="center" gap={3}>
                                <Text fontWeight="medium" color="accent-1">
                                    Available this year:{' '}
                                    {isUserFetched ? user.limit : 0}
                                </Text>

                                <Select
                                    placeholder="Status"
                                    size="lg"
                                    w="auto"
                                    {...register('status')}
                                >
                                    <chakra.option value="waiting">
                                        Waiting
                                    </chakra.option>
                                    <chakra.option value="approved">
                                        Approved
                                    </chakra.option>
                                    <chakra.option value="rejected">
                                        Rejected
                                    </chakra.option>
                                    <chakra.option value="cancelled">
                                        Cancelled
                                    </chakra.option>
                                </Select>
                            </Flex>
                        )}
                        filters={(data, watch) => {
                            return data.filter((data) =>
                                watch('status')
                                    ? watch('status') === data.status
                                    : data
                            )
                        }}
                        effects={(watch) => [watch('status')]}
                    />
                </Flex>
            </Card>
        </Container>
    )
}

export default Leaves
