import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import {
    Avatar,
    Badge,
    Button,
    Container,
    Divider,
    Flex,
    IconButton,
    Input,
    Select,
    Td,
    Text,
    Th,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'
import { currency } from 'functions/currency'
import Modal from 'components/modal'
import { month } from 'functions/month'
import Toast from 'components/toast'

const ViewModal = ({
    users,
    leaves: allLeaves,
    attendance: attAll,
    payroll
}) => {
    const queryClient = useQueryClient()

    const disclosure = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const leaves = allLeaves.filter(
        (al) =>
            al.user.id === payroll.user && al.payed && al.status === 'approved'
    )

    console.log(leaves)

    const attendance = attAll.filter((att) => att.user === payroll.user)
    const { data: deductions, isFetched: isDeductionsFetched } = useQuery(
        ['deductions'],
        () => api.all('/deductions')
    )

    const sumDuration = (array) => {
        const totalMinutes = array.reduce(
            (acc, curr) => acc + curr.duration.minutes,
            0
        )
        const totalHours = array.reduce(
            (acc, curr) => acc + curr.duration.hours,
            0
        )
        const extraHoursFromMinutes = Math.floor(totalMinutes / 60)
        const remainingMinutes = totalMinutes % 60

        const totalHoursAndMinutes = {
            hours: totalHours + extraHoursFromMinutes,
            minutes: remainingMinutes
        }

        return totalHoursAndMinutes
    }

    const sumAmounts = (array) => {
        const totalOvertime = array.reduce(
            (acc, curr) => acc + curr.amount.overtime,
            0
        )
        const totalNetPay = array.reduce(
            (acc, curr) => acc + curr.amount.netpay,
            0
        )
        const totalAmounts = {
            overtime: totalOvertime,
            pay: totalNetPay
        }
        return totalAmounts
    }

    const sumDeductions = (array) => {
        const totalDeductions = array.reduce(
            (acc, curr) => acc + curr.amount,
            0
        )
        return totalDeductions
    }

    const sumLeaves = (array) => {
        const totalDeductions = array.reduce((acc, curr) => acc + curr.days, 0)
        return totalDeductions * 470
    }

    const { hours, minutes } = sumDuration(attendance)
    const { overtime, pay } = sumAmounts(attendance)

    const editMutation = useMutation(
        (data) => api.update('/payrolls', payroll._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('payrolls')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    duration: 3000,
                    render: () => (
                        <Toast
                            title="Success"
                            description="Payroll successfully payed."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = () => {
        setIsLoading(true)

        editMutation.mutate({
            amount: {
                pay,
                overtime,
                grosspay: pay + overtime,
                leaves: sumLeaves(leaves),
                deductions: sumDeductions(deductions),
                netpay: pay + overtime + 0 - sumDeductions(deductions)
            },
            attendances: attendance,
            leaves: leaves,
            deductions: deductions,
            status: true
        })
    }

    return (
        <Modal
            title="Payroll Summary Report"
            size="2xl"
            toggle={(onOpen) => (
                <IconButton
                    size="xs"
                    icon={<FiMoreHorizontal size={12} />}
                    onClick={() => {
                        onOpen()
                    }}
                />
            )}
            disclosure={disclosure}
        >
            <Flex direction="column" gap={6}>
                <Text fontSize={20} fontWeight="semibold" color="accent-1">
                    Overview
                </Text>

                <Flex direction="column" gap={3}>
                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Name
                        </Text>

                        {users
                            .filter((user) => user._id === payroll.user)
                            .map((user) => (
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="accent-1"
                                    key={user._id}
                                >
                                    {user.name}
                                </Text>
                            ))}
                    </Flex>

                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Position
                        </Text>

                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            textTransform="capitalize"
                            color="accent-1"
                        >
                            {payroll.position.title}
                        </Text>
                    </Flex>

                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Rate Per Hour
                        </Text>

                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="accent-1"
                        >
                            {currency(payroll.position.rate)}
                        </Text>
                    </Flex>

                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Time In
                        </Text>

                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="accent-1"
                        >
                            {payroll.schedule.timein}
                        </Text>
                    </Flex>

                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Time Out
                        </Text>

                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="accent-1"
                        >
                            {payroll.schedule.timeout}
                        </Text>
                    </Flex>

                    <Divider />

                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Total Hours
                        </Text>

                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="accent-1"
                        >
                            {hours}h {minutes}m
                        </Text>
                    </Flex>

                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Pay
                        </Text>

                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="accent-1"
                        >
                            {currency(pay)}
                        </Text>
                    </Flex>

                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Overtime
                        </Text>

                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="accent-1"
                        >
                            {currency(overtime)}
                        </Text>
                    </Flex>

                    <Divider />

                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Gross Pay
                        </Text>

                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="accent-1"
                        >
                            {currency(pay + overtime)}
                        </Text>
                    </Flex>

                    <Divider />

                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Leaves
                        </Text>

                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="accent-1"
                        >
                            + {currency(sumLeaves(leaves))}
                        </Text>
                    </Flex>

                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Deductions
                        </Text>

                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="accent-1"
                        >
                            -{' '}
                            {isDeductionsFetched
                                ? currency(sumDeductions(deductions))
                                : currency(0)}
                        </Text>
                    </Flex>

                    <Divider />

                    <Flex justify="space-between" gap={3}>
                        <Text fontSize="sm" fontWeight="medium">
                            Net Pay
                        </Text>

                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="accent-1"
                        >
                            {isDeductionsFetched
                                ? currency(
                                      pay + overtime - sumDeductions(deductions)
                                  )
                                : 'Loading...'}
                        </Text>
                    </Flex>

                    <Divider />
                </Flex>

                <Text fontSize={20} fontWeight="semibold" color="accent-1">
                    Attendance
                </Text>

                <Table
                    data={attendance}
                    fetched={true}
                    th={['Time In', 'Time Out', 'Amount', 'Date']}
                    td={(attendance) => (
                        <Tr key={attendance._id}>
                            <Td>
                                <Flex align="center" gap={3}>
                                    <Text>{attendance.timein.time}</Text>

                                    <Badge
                                        variant="tinted"
                                        colorScheme={
                                            attendance.timein.status.label !==
                                            'Late'
                                                ? 'brand'
                                                : 'red'
                                        }
                                    >
                                        {attendance.timein.status.label}
                                    </Badge>
                                </Flex>
                            </Td>

                            <Td>
                                {attendance.timeout.time !== '' ? (
                                    <Flex align="center" gap={3}>
                                        <Text>{attendance.timeout.time}</Text>

                                        <Badge
                                            variant="tinted"
                                            colorScheme={
                                                attendance.timeout.status
                                                    .label !== 'Overtime'
                                                    ? 'brand'
                                                    : 'yellow'
                                            }
                                        >
                                            {attendance.timeout.status.label}
                                        </Badge>
                                    </Flex>
                                ) : (
                                    <Text>-</Text>
                                )}
                            </Td>

                            <Td>
                                <Text>
                                    {currency(attendance.amount.netpay)}
                                </Text>
                            </Td>

                            <Td>
                                <Text>
                                    {month[
                                        Number(attendance.date.split('/')[0]) -
                                            1
                                    ] +
                                        ' ' +
                                        attendance.date.split('/')[1] +
                                        ', ' +
                                        attendance.date.split('/')[2]}
                                </Text>
                            </Td>
                        </Tr>
                    )}
                    filters={(data) => {
                        return data.filter((data) => data.user === payroll.user)
                    }}
                    settings={{
                        search: 'off',
                        controls: 'off',
                        show: [30]
                    }}
                />

                <Divider />

                <Text fontSize={20} fontWeight="semibold" color="accent-1">
                    Leaves
                </Text>

                <Table
                    data={leaves}
                    fetched={true}
                    th={['Type', 'Status', 'Days']}
                    td={(leave) => (
                        <Tr key={leave._id}>
                            <Td>
                                <Text textTransform="uppercase">
                                    {leave.type}
                                </Text>
                            </Td>

                            <Td>
                                <Badge
                                    variant="tinted"
                                    colorScheme={leave.payed ? 'brand' : 'red'}
                                >
                                    {leave.payed
                                        ? 'Paid Leave'
                                        : 'Unpaid Leave'}
                                </Badge>
                            </Td>

                            <Td>
                                <Text>
                                    {leave.days} Day{leave.days > 1 && 's'}
                                </Text>
                            </Td>
                        </Tr>
                    )}
                    settings={{
                        search: 'off',
                        controls: 'off',
                        show: [100]
                    }}
                />

                <Divider />

                <Text fontSize={20} fontWeight="semibold" color="accent-1">
                    Deductions
                </Text>

                <Table
                    data={deductions}
                    fetched={isDeductionsFetched}
                    th={['ID', 'Title', 'Amount']}
                    td={(deduction) => (
                        <Tr key={deduction._id}>
                            <Td>
                                <Badge variant="tinted" colorScheme="brand">
                                    #{deduction._id.slice(15, 30).toUpperCase()}
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
                        </Tr>
                    )}
                    settings={{
                        search: 'off',
                        controls: 'off',
                        show: [100]
                    }}
                />

                {!payroll.status && (
                    <>
                        <Divider />

                        <Button
                            size="lg"
                            colorScheme="brand"
                            isLoading={isLoading}
                            onClick={onSubmit}
                        >
                            Pay Now
                        </Button>
                    </>
                )}
            </Flex>
        </Modal>
    )
}

const Payrolls = () => {
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: payrolls, isFetched: isPayrollsFetched } = useQuery(
        ['payrolls'],
        () => api.all('/payrolls')
    )
    const { data: attendance, isFetched: isAttendanceFetched } = useQuery(
        ['attendance'],
        () => api.all('/attendance')
    )
    const { data: leaves, isFetched: isLeavesFetched } = useQuery(
        ['leaves'],
        () => api.all('/leaves')
    )

    return (
        <Container>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize={32} fontWeight={800} color="accent-1">
                        Payrolls
                    </Text>
                </Flex>

                <Card>
                    <Table
                        data={payrolls}
                        fetched={
                            isUsersFetched &&
                            isAttendanceFetched &&
                            isPayrollsFetched &&
                            isLeavesFetched
                        }
                        th={[
                            'Id',
                            'Employee',
                            'Attendance',
                            'Netpay',
                            'Status',
                            ''
                        ]}
                        td={(payroll) => (
                            <Tr key={payroll._id}>
                                <Td>
                                    <Badge variant="tinted" colorScheme="brand">
                                        #
                                        {payroll._id
                                            .slice(15, 30)
                                            .toUpperCase()}
                                    </Badge>
                                </Td>

                                {isUsersFetched &&
                                    users
                                        .filter(
                                            (user) => user._id === payroll.user
                                        )
                                        .map((user) => (
                                            <Td key={user._id}>
                                                <Flex align="center" gap={3}>
                                                    <Avatar
                                                        name={user.name}
                                                        src={user.image}
                                                    />
                                                    <Text>{user.name}</Text>
                                                </Flex>
                                            </Td>
                                        ))}

                                <Td>
                                    {payroll.status ? (
                                        <Text>
                                            {payroll.attendances.length}
                                        </Text>
                                    ) : (
                                        <Text>
                                            {isAttendanceFetched &&
                                                attendance.filter(
                                                    (att) =>
                                                        att.user ===
                                                            payroll.user &&
                                                        !att.payed
                                                ).length}
                                        </Text>
                                    )}
                                </Td>

                                <Td>
                                    {payroll.status ? (
                                        <Text>
                                            {currency(payroll.amount.netpay)}
                                        </Text>
                                    ) : (
                                        <Text>View in more</Text>
                                    )}
                                </Td>

                                <Td>
                                    <Badge
                                        variant="tinted"
                                        colorScheme={
                                            payroll.status ? 'brand' : 'red'
                                        }
                                    >
                                        {payroll.status ? 'Paid' : 'Not Paid'}
                                    </Badge>
                                </Td>

                                <Td>
                                    <Flex justify="end">
                                        <ViewModal
                                            users={users}
                                            leaves={leaves}
                                            attendance={attendance}
                                            payroll={payroll}
                                        />
                                    </Flex>
                                </Td>
                            </Tr>
                        )}
                        controls={(register) => (
                            <Flex flex={1} justify="end" gap={3}>
                                <Select
                                    placeholder="Select"
                                    size="lg"
                                    w="auto"
                                    {...register('status')}
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Not Paid">Not Paid</option>
                                </Select>
                            </Flex>
                        )}
                        filters={(data, watch) => {
                            return data.filter((data) =>
                                watch('status')
                                    ? (watch('status') === 'Paid'
                                          ? true
                                          : false) === data.status
                                    : data
                            )
                        }}
                        effects={(watch) => [watch('status')]}
                    />
                </Card>
            </Flex>
        </Container>
    )
}

export default Payrolls
