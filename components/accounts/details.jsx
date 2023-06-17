import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import api from 'instance'
import {
    Avatar,
    Badge,
    Button,
    ButtonGroup,
    chakra,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Select,
    Text,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { FiEye, FiEyeOff, FiUploadCloud } from 'react-icons/fi'
import Card from 'components/card'
import Modal from 'components/modal'
import Toast from 'components/toast'

const ViewDetailsModal = ({ user }) => {
    const { data: session } = useSession()
    const disclosure = useDisclosure()

    const queryClient = useQueryClient()
    const { data: positions, isFetched: isPositionsFetched } = useQuery(
        ['positions'],
        () => api.all('/positions')
    )
    const { data: schedules, isFetched: isSchedulesFetched } = useQuery(
        ['schedules'],
        () => api.all('/schedules')
    )

    const [showPass, setShowPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const {
        register,
        setValue,
        watch,
        formState: { errors },
        clearErrors,
        reset,
        handleSubmit
    } = useForm()

    const editMutation = useMutation(
        (data) => api.update('/users', user._id, data),
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
            title="Profile Information"
            size="xl"
            toggle={(onOpen) => (
                <Button
                    variant="tinted"
                    size="lg"
                    onClick={() => {
                        clearErrors()
                        reset()
                        setShowPass(false)
                        setValue('name', user.name)
                        setValue('password', user.password)
                        setValue(
                            'position',
                            `${user.position.title} - ${user.position.rate}`
                        )
                        setValue(
                            'schedule',
                            `${user.schedule.timein} - ${user.schedule.timeout}`
                        )
                        setValue('hired_date', user.hired_date)
                        setValue('role', user.role)
                        setValue('status', user.status)
                        onOpen()
                    }}
                >
                    View Details
                </Button>
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <FormControl isInvalid={errors.name}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            size="lg"
                            {...register('name', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                            value={user.email}
                            size="lg"
                            cursor="not-allowed"
                            readOnly
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input
                            value={user.username}
                            size="lg"
                            cursor="not-allowed"
                            readOnly
                        />
                    </FormControl>

                    <FormControl isInvalid={errors.password}>
                        <FormLabel>Password</FormLabel>

                        <InputGroup>
                            <Input
                                type={showPass ? 'text' : 'password'}
                                maxLength={8}
                                {...register('password', { required: true })}
                            />

                            <InputRightElement>
                                <IconButton
                                    variant="simple"
                                    color="accent-1"
                                    icon={
                                        showPass ? (
                                            <FiEye size={16} />
                                        ) : (
                                            <FiEyeOff size={16} />
                                        )
                                    }
                                    onClick={() =>
                                        showPass
                                            ? setShowPass(false)
                                            : setShowPass(true)
                                    }
                                />
                            </InputRightElement>
                        </InputGroup>

                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.position}>
                        <FormLabel>Position</FormLabel>

                        <Select
                            size="lg"
                            textTransform="capitalize"
                            disabled={
                                session.user.role !== 'Admin' ? true : false
                            }
                            {...register('position', { required: true })}
                        >
                            {isPositionsFetched &&
                                positions.map((position) => (
                                    <chakra.option
                                        textTransform="capitalize"
                                        value={`${position.title} - ${position.rate}`}
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
                            size="lg"
                            disabled={
                                session.user.role !== 'Admin' ? true : false
                            }
                            {...register('schedule', { required: true })}
                        >
                            {isSchedulesFetched &&
                                schedules.map((schedule) => (
                                    <chakra.option
                                        textTransform="capitalize"
                                        value={`${schedule.timein} - ${schedule.timeout}`}
                                        key={schedule._id}
                                    >
                                        {`${schedule.timein} - ${schedule.timeout}`}
                                    </chakra.option>
                                ))}
                        </Select>

                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Hired Date</FormLabel>
                        <Input
                            type="date"
                            size="lg"
                            disabled={
                                session.user.role !== 'Admin' ? true : false
                            }
                            {...register('hired_date')}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Contract End Date</FormLabel>
                        <Input
                            type="date"
                            size="lg"
                            disabled={
                                session.user.role !== 'Admin' ? true : false
                            }
                            {...register('contract_end_date')}
                        />
                    </FormControl>

                    {session.user.role === 'Admin' && (
                        <>
                            <FormControl isInvalid={errors.role}>
                                <FormLabel>Role</FormLabel>

                                <Select
                                    size="lg"
                                    {...register('role', { required: true })}
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

                                <FormErrorMessage>
                                    This field is required.
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.status}>
                                <FormLabel>Status</FormLabel>

                                <Select
                                    size="lg"
                                    {...register('status', { required: true })}
                                >
                                    <chakra.option value="Active">
                                        Active
                                    </chakra.option>
                                    <chakra.option value="Inactive">
                                        Inactive
                                    </chakra.option>
                                </Select>

                                <FormErrorMessage>
                                    This field is required.
                                </FormErrorMessage>
                            </FormControl>
                        </>
                    )}

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

const Details = ({ user }) => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [files, setFiles] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const handleFiles = (e) => {
        const file = e.target.files[0]

        if (!file) {
            toast({
                position: 'top',
                render: () => (
                    <Toast
                        title="Error"
                        description="file does not exists."
                        status="error"
                    />
                )
            })

            return
        }

        setFiles(file)
    }

    const editMutation = useMutation(
        (data) => api.update('/users/resume', user._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('user')
                setFiles(null)
                setIsLoading(false)

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="File uploaded successfully."
                        />
                    )
                })
            }
        }
    )

    useEffect(() => {
        const upload = async () => {
            if (files) {
                let res = null
                setIsLoading(true)

                for (const item of [files]) {
                    const formData = new FormData()

                    formData.append('file', item)
                    formData.append('upload_preset', 'servers')

                    res = await axios.post(
                        'https://api.cloudinary.com/v1_1/commence/raw/upload',
                        formData
                    )
                }

                editMutation.mutate({
                    resume: res.data.secure_url
                })
            }
        }

        upload()
    }, [files])

    return (
        <Card>
            <Flex direction="column" align="center" gap={6}>
                <Image
                    borderRadius="12px 12px 0 0"
                    mb="-72px"
                    alt="canvas"
                    src="/assets/canvas.svg"
                />

                <Flex direction="column" align="center" textAlign="center">
                    <Avatar
                        border="8px solid"
                        borderColor="surface !important"
                        size="xl"
                        mb={3}
                        name={user.name}
                        src={user.image}
                    />

                    <Text fontWeight="medium" color="accent-1" noOfLines={1}>
                        {user.name}
                    </Text>

                    <Text fontSize="sm" noOfLines={1}>
                        {user.email}
                    </Text>

                    <Flex align="center" gap={2} mt={2}>
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

                        <Badge
                            variant="tinted"
                            colorScheme={
                                user.status === 'Active' ? 'blue' : 'red'
                            }
                        >
                            {user.status}
                        </Badge>
                    </Flex>
                </Flex>

                <Divider />

                <Flex direction="column" gap={3} w="full">
                    <ViewDetailsModal user={user} />

                    <ButtonGroup isAttached>
                        {user.resume !== '' ? (
                            <Button
                                href={user.resume}
                                size="lg"
                                w="full"
                                onClick={() => router.push(user.resume)}
                            >
                                {user.resume.split('/')[6]}.
                                {user.resume.split('/')[7].split('.')[1]}
                            </Button>
                        ) : (
                            <Button size="lg" w="full" disabled>
                                Please attach pdf file
                            </Button>
                        )}

                        <chakra.input
                            type="file"
                            id="file"
                            display="none"
                            pointerEvents="none"
                            onChange={handleFiles}
                        />

                        <IconButton
                            size="lg"
                            colorScheme="brand"
                            icon={<FiUploadCloud size={16} />}
                            isLoading={isLoading}
                            onClick={() =>
                                document.getElementById('file').click()
                            }
                        />
                    </ButtonGroup>
                </Flex>
            </Flex>
        </Card>
    )
}

export default Details
