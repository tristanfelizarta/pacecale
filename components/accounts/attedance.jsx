import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Badge, Flex, IconButton, Input, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'
import { month } from 'functions/month'
import { convert } from 'functions/date'

const Attendance = ({ user }) => {
    const { data: attendance, isFetched: isAttendanceFetched } = useQuery(
        ['attendance'],
        () => api.all('/attendance')
    )

    return (
        <Card>
            <Flex direction="column" gap={6}>
                <Table
                    data={attendance}
                    fetched={isAttendanceFetched}
                    th={['Id', 'Time In', 'Time Out', 'Date', '']}
                    td={(attendance) => (
                        <Tr key={attendance._id}>
                            <Td>
                                <Badge variant="tinted" colorScheme="brand">
                                    #
                                    {attendance._id.slice(15, 30).toUpperCase()}
                                </Badge>
                            </Td>

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
                                    {month[
                                        Number(attendance.date.split('/')[0])
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
                                        icon={<FiMoreHorizontal size={12} />}
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
                        </Flex>
                    )}
                    filters={(data, watch) => {
                        return data.filter((data) =>
                            watch('date')
                                ? convert(watch('date')) === data.date &&
                                  data.user === user._id
                                : data.user === user._id
                        )
                    }}
                    effects={(watch) => [watch('date')]}
                />
            </Flex>
        </Card>
    )
}

export default Attendance
