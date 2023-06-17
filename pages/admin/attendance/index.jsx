import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import {
    Avatar,
    Badge,
    Button,
    Container,
    Flex,
    IconButton,
    Input,
    Td,
    Text,
    Tr
} from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'
import { month } from 'functions/month'
import { convert } from 'functions/date'

const Attendance = () => {
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: attendance, isFetched: isAttendanceFetched } = useQuery(
        ['attendance'],
        () => api.all('/attendance')
    )

    return (
        <Container>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize={32} fontWeight={800} color="accent-1">
                        Attendance
                    </Text>
                </Flex>

                <Card>
                    <Table
                        data={attendance}
                        fetched={isUsersFetched && isAttendanceFetched}
                        th={[
                            'Id',
                            'Employee',
                            'Time In',
                            'Time Out',
                            'Date',
                            ''
                        ]}
                        td={(attendance) => (
                            <Tr key={attendance._id}>
                                <Td>
                                    <Badge variant="tinted" colorScheme="brand">
                                        #
                                        {attendance._id
                                            .slice(15, 30)
                                            .toUpperCase()}
                                    </Badge>
                                </Td>

                                {isUsersFetched &&
                                    users
                                        .filter(
                                            (user) =>
                                                user._id === attendance.user
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
                                    <Flex align="center" gap={3}>
                                        <Text>{attendance.timein.time}</Text>

                                        <Badge
                                            variant="tinted"
                                            colorScheme={
                                                attendance.timein.status
                                                    .label !== 'Late'
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
                                            <Text>
                                                {attendance.timeout.time}
                                            </Text>

                                            <Badge
                                                variant="tinted"
                                                colorScheme={
                                                    attendance.timeout.status
                                                        .label !== 'Overtime'
                                                        ? 'brand'
                                                        : 'yellow'
                                                }
                                            >
                                                {
                                                    attendance.timeout.status
                                                        .label
                                                }
                                            </Badge>
                                        </Flex>
                                    ) : (
                                        <Text>-</Text>
                                    )}
                                </Td>

                                <Td>
                                    <Text>
                                        {month[
                                            Number(
                                                attendance.date.split('/')[0]
                                            ) - 1
                                        ] +
                                            ' ' +
                                            attendance.date.split('/')[1] +
                                            ', ' +
                                            attendance.date.split('/')[2]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Flex justify="end">
                                        <IconButton
                                            size="xs"
                                            icon={
                                                <FiMoreHorizontal size={12} />
                                            }
                                        />
                                    </Flex>
                                </Td>
                            </Tr>
                        )}
                        controls={(register) => (
                            <Flex flex={1} justify="end" align="center" gap={3}>
                                <Input
                                    type="date"
                                    size="lg"
                                    w="auto"
                                    {...register('date')}
                                />

                                <Button
                                    size="lg"
                                    colorScheme="brand"
                                    onClick={() =>
                                        window.open(
                                            `${process.env.NEXT_PUBLIC_URL}/admin/attendance/today`,
                                            'attendance',
                                            'width=1366, height=768'
                                        )
                                    }
                                >
                                    Add New
                                </Button>
                            </Flex>
                        )}
                        filters={(data, watch) => {
                            return data.filter((data) =>
                                watch('date')
                                    ? convert(watch('date')) === data.date
                                    : data
                            )
                        }}
                        effects={(watch) => [watch('date')]}
                    />
                </Card>
            </Flex>
        </Container>
    )
}

export default Attendance
