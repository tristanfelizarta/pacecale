import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Button,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useToast
} from '@chakra-ui/react'
import { FiEye, FiEyeOff, FiLock, FiUser } from 'react-icons/fi'
import Card from 'components/card'
import Toast from 'components/toast'

const Attendance = () => {
    const queryClient = useQueryClient()
    const [index, setIndex] = useState(0)
    const [showPass, setShowPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const {
        register,
        formState: { errors },
        setError,
        clearErrors,
        handleSubmit
    } = useForm()

    const timeinMutation = useMutation(
        (data) => api.create('/attendance/timein', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('attendance')
                setIsLoading(false)

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Time in successfully"
                        />
                    )
                })
            },
            onError: (error) => {
                setIsLoading(false)

                if (error.response.data.type === 'username') {
                    setError('username', {
                        type: 'server',
                        message: error.response.data.message
                    })
                } else if (error.response.data.type === 'password') {
                    setError('password', {
                        type: 'server',
                        message: error.response.data.message
                    })
                } else {
                    toast({
                        position: 'top',
                        duration: 3000,
                        render: () => (
                            <Toast
                                status="error"
                                title="Error"
                                description={error.response.data.message}
                            />
                        )
                    })
                }
            }
        }
    )

    const timeoutMutation = useMutation(
        (data) => api.create('/attendance/timeout', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('attendance')
                setIsLoading(false)

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Time out successfully"
                        />
                    )
                })
            },
            onError: (error) => {
                setIsLoading(false)

                if (error.response.data.type === 'username') {
                    setError('username', {
                        type: 'server',
                        message: error.response.data.message
                    })
                } else if (error.response.data.type === 'password') {
                    setError('password', {
                        type: 'server',
                        message: error.response.data.message
                    })
                } else {
                    toast({
                        position: 'top',
                        duration: 3000,
                        render: () => (
                            <Toast
                                status="error"
                                title="Error"
                                description={error.response.data.message}
                            />
                        )
                    })
                }
            }
        }
    )

    const onTimeIn = (data) => {
        setIsLoading(true)
        timeinMutation.mutate(data)
    }

    const onTimeOut = (data) => {
        setIsLoading(true)
        timeoutMutation.mutate(data)
    }

    return (
        <Flex justify="center" align="center" h="full" minH="100vh">
            <Flex
                direction="column"
                align="center"
                gap={6}
                border="1px solid"
                borderColor="border"
                borderRadius={12}
                w="full"
                maxW={384}
            >
                <Card>
                    <Tabs index={index} w="full">
                        <TabList>
                            <Tab
                                type="button"
                                w="full"
                                onClick={() => {
                                    setIndex(0)
                                    clearErrors()
                                }}
                            >
                                Time In
                            </Tab>

                            <Tab
                                type="button"
                                w="full"
                                onClick={() => {
                                    setIndex(1)
                                    clearErrors()
                                }}
                            >
                                Time Out
                            </Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                {index === 0 && (
                                    <form onSubmit={handleSubmit(onTimeIn)}>
                                        <Flex direction="column" gap={6}>
                                            <FormControl
                                                isInvalid={errors.username}
                                            >
                                                <FormLabel>Username</FormLabel>

                                                <InputGroup>
                                                    <InputLeftElement
                                                        pt={1}
                                                        pl={1}
                                                    >
                                                        <Icon
                                                            as={FiUser}
                                                            boxSize={4}
                                                            color="accent-1"
                                                        />
                                                    </InputLeftElement>

                                                    <Input
                                                        size="lg"
                                                        {...register(
                                                            'username',
                                                            {
                                                                required:
                                                                    'This field is required.'
                                                            }
                                                        )}
                                                    />
                                                </InputGroup>

                                                <FormErrorMessage>
                                                    {errors.username?.message}
                                                </FormErrorMessage>
                                            </FormControl>

                                            <FormControl
                                                isInvalid={errors.password}
                                            >
                                                <FormLabel>Password</FormLabel>

                                                <InputGroup>
                                                    <InputLeftElement
                                                        pt={1}
                                                        pl={1}
                                                    >
                                                        <Icon
                                                            as={FiLock}
                                                            boxSize={4}
                                                            color="accent-1"
                                                        />
                                                    </InputLeftElement>

                                                    <Input
                                                        type={
                                                            showPass
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        size="lg"
                                                        maxLength={8}
                                                        {...register(
                                                            'password',
                                                            {
                                                                required:
                                                                    'This field is required.'
                                                            }
                                                        )}
                                                    />

                                                    <InputRightElement
                                                        pt={1}
                                                        pr={1}
                                                    >
                                                        <IconButton
                                                            variant="simple"
                                                            color="accent-1"
                                                            icon={
                                                                showPass ? (
                                                                    <FiEye
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <FiEyeOff
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                )
                                                            }
                                                            onClick={() =>
                                                                showPass
                                                                    ? setShowPass(
                                                                          false
                                                                      )
                                                                    : setShowPass(
                                                                          true
                                                                      )
                                                            }
                                                        />
                                                    </InputRightElement>
                                                </InputGroup>

                                                <FormErrorMessage>
                                                    {errors.password?.message}
                                                </FormErrorMessage>
                                            </FormControl>

                                            <Divider />

                                            <Button
                                                type="submit"
                                                size="lg"
                                                colorScheme="brand"
                                                isLoading={isLoading}
                                            >
                                                Time In
                                            </Button>
                                        </Flex>
                                    </form>
                                )}
                            </TabPanel>

                            <TabPanel>
                                {index === 1 && (
                                    <form onSubmit={handleSubmit(onTimeOut)}>
                                        <Flex direction="column" gap={6}>
                                            <FormControl
                                                isInvalid={errors.username}
                                            >
                                                <FormLabel>Username</FormLabel>

                                                <InputGroup>
                                                    <InputLeftElement
                                                        pt={1}
                                                        pl={1}
                                                    >
                                                        <Icon
                                                            as={FiUser}
                                                            boxSize={4}
                                                            color="accent-1"
                                                        />
                                                    </InputLeftElement>

                                                    <Input
                                                        size="lg"
                                                        {...register(
                                                            'username',
                                                            {
                                                                required:
                                                                    'This field is required.'
                                                            }
                                                        )}
                                                    />
                                                </InputGroup>

                                                <FormErrorMessage>
                                                    {errors.username?.message}
                                                </FormErrorMessage>
                                            </FormControl>

                                            <FormControl
                                                isInvalid={errors.password}
                                            >
                                                <FormLabel>Password</FormLabel>

                                                <InputGroup>
                                                    <InputLeftElement
                                                        pt={1}
                                                        pl={1}
                                                    >
                                                        <Icon
                                                            as={FiLock}
                                                            boxSize={4}
                                                            color="accent-1"
                                                        />
                                                    </InputLeftElement>

                                                    <Input
                                                        type={
                                                            showPass
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        size="lg"
                                                        maxLength={8}
                                                        {...register(
                                                            'password',
                                                            {
                                                                required:
                                                                    'This field is required.'
                                                            }
                                                        )}
                                                    />

                                                    <InputRightElement
                                                        pt={1}
                                                        pr={1}
                                                    >
                                                        <IconButton
                                                            variant="simple"
                                                            color="accent-1"
                                                            icon={
                                                                showPass ? (
                                                                    <FiEye
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <FiEyeOff
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                )
                                                            }
                                                            onClick={() =>
                                                                showPass
                                                                    ? setShowPass(
                                                                          false
                                                                      )
                                                                    : setShowPass(
                                                                          true
                                                                      )
                                                            }
                                                        />
                                                    </InputRightElement>
                                                </InputGroup>

                                                <FormErrorMessage>
                                                    {errors.password?.message}
                                                </FormErrorMessage>
                                            </FormControl>

                                            <Divider />

                                            <Button
                                                type="submit"
                                                size="lg"
                                                colorScheme="brand"
                                                isLoading={isLoading}
                                            >
                                                Time Out
                                            </Button>
                                        </Flex>
                                    </form>
                                )}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Card>
            </Flex>
        </Flex>
    )
}

export default Attendance
