import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import {
    Avatar,
    Badge,
    Container,
    Divider,
    Flex,
    IconButton,
    Td,
    Text,
    Th,
    Tr,
    useDisclosure
} from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'
import { currency } from 'functions/currency'
import Modal from 'components/modal'
import { month } from 'functions/month'

const ViewModal = ({ attendance, payroll }) => {
    const disclosure = useDisclosure()

    return (
        <Modal
            title="Payroll"
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
                <Divider />

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
                                        Number(attendance.date.split('/')[0])
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
            </Flex>
        </Modal>
    )
}

const Payrolls = () => {
    const { data: session } = useSession()
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

    const netpay = (att) => {
        let sum = 0

        att.filter((att) => !att.status).map((att) => {
            sum += att.amount.netpay
        })

        return sum
    }

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
                            isPayrollsFetched
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
                                        <Text>0</Text>
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
                                    <Text>{currency(netpay(attendance))}</Text>
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
                                            attendance={attendance}
                                            payroll={payroll}
                                        />
                                    </Flex>
                                </Td>
                            </Tr>
                        )}
                        filters={(data) => {
                            return data.filter(
                                (data) => data.user === session.user.id
                            )
                        }}
                    />
                </Card>
            </Flex>
        </Container>
    )
}

export default Payrolls
