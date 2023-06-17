import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Avatar,
    Badge,
    Button,
    Container,
    Flex,
    Grid,
    GridItem,
    IconButton,
    Input,
    Td,
    Text,
    Tr
} from '@chakra-ui/react'
import { FiDownload, FiMoreHorizontal } from 'react-icons/fi'
import Statistics from 'components/dashboard/statistics'
import Card from 'components/card'
import Table from 'components/table'
import { convert } from 'functions/date'
import { month } from 'functions/month'
import XLSX from 'xlsx'

const Dashboard = () => {
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const { data: attendance, isFetched: isAttendanceFetched } = useQuery(
        ['attendance'],
        () => api.all('/attendance')
    )

    let date = new Date()
        .toLocaleString('en-US', { timeZone: 'Asia/Manila' })
        .split(',')[0]
        .trim()
    let today = `${date.split('/')[2]}-${
        Number(date.split('/')[0]) < 9
            ? '0' + date.split('/')[0]
            : date.split('/')[0]
    }-${
        Number(date.split('/')[1]) < 9
            ? '0' + date.split('/')[1]
            : date.split('/')[1]
    }`

    const { register, watch, setValue } = useForm()

    const tpt =
        isUsersFetched && isAttendanceFetched && watch('date')
            ? attendance.filter((att) => att.date === convert(watch('date')))
                  .length
            : 0
    const te =
        isUsersFetched && isAttendanceFetched && watch('date')
            ? attendance.filter((att) => att.date === convert(watch('date')))[0]
                ? attendance.filter(
                      (att) => att.date === convert(watch('date'))
                  )[0].extra.employees
                : 0
            : 0
    const tat = te - tpt
    const pt =
        tpt && te
            ? ((100 * tpt) / te).toString().split('').slice(0, 5)
            : '00.00'

    const exportToExcel = () => {
        // Get the HTML table element
        const table = document.getElementById('dashboard')
        console.log(table)

        // Convert the table to a worksheet object
        const worksheet = XLSX.utils.table_to_sheet(table)

        // Create a new workbook and add the worksheet
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

        // Save the workbook as an Excel file
        XLSX.writeFile(
            workbook,
            `dashboard-reports-${new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Manila'
            })}.xlsx`
        )
    }

    useEffect(() => {
        setValue('date', today)
    }, [])

    return (
        <Container>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize={32} fontWeight={800} color="accent-1">
                        Dashboard
                    </Text>

                    <Flex align="center" gap={3}>
                        <Input
                            type="date"
                            size="lg"
                            w="auto"
                            {...register('date')}
                        />

                        <Button
                            size="lg"
                            colorScheme="brand"
                            leftIcon={<FiDownload size={16} />}
                            onClick={exportToExcel}
                        >
                            Export
                        </Button>
                    </Flex>
                </Flex>

                <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                    <Statistics
                        date={date}
                        today={watch('date') ? convert(watch('date')) : null}
                        tpt={tpt}
                        tat={tat}
                        te={te}
                        pt={pt}
                    />

                    <GridItem colSpan={12}>
                        <Card>
                            <Table
                                id="dashboard"
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
                                            <Badge
                                                variant="tinted"
                                                colorScheme="brand"
                                            >
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
                                                        user._id ===
                                                        attendance.user
                                                )
                                                .map((user) => (
                                                    <Td key={user._id}>
                                                        <Flex
                                                            align="center"
                                                            gap={3}
                                                        >
                                                            <Avatar
                                                                name={user.name}
                                                                src={user.image}
                                                            />
                                                            <Text>
                                                                {user.name}
                                                            </Text>
                                                        </Flex>
                                                    </Td>
                                                ))}

                                        <Td>
                                            <Flex align="center" gap={3}>
                                                <Text>
                                                    {attendance.timein.time}
                                                </Text>

                                                <Badge
                                                    variant="tinted"
                                                    colorScheme={
                                                        attendance.timein.status
                                                            .label !== 'Late'
                                                            ? 'brand'
                                                            : 'red'
                                                    }
                                                >
                                                    {
                                                        attendance.timein.status
                                                            .label
                                                    }
                                                </Badge>
                                            </Flex>
                                        </Td>

                                        <Td>
                                            {attendance.timeout.time !== '' ? (
                                                <Flex align="center" gap={3}>
                                                    <Text>
                                                        {
                                                            attendance.timeout
                                                                .time
                                                        }
                                                    </Text>

                                                    <Badge
                                                        variant="tinted"
                                                        colorScheme={
                                                            attendance.timeout
                                                                .status
                                                                .label !==
                                                            'Overtime'
                                                                ? 'brand'
                                                                : 'yellow'
                                                        }
                                                    >
                                                        {
                                                            attendance.timeout
                                                                .status.label
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
                                                        attendance.date.split(
                                                            '/'
                                                        )[0]
                                                    ) - 1
                                                ] +
                                                    ' ' +
                                                    attendance.date.split(
                                                        '/'
                                                    )[1] +
                                                    ', ' +
                                                    attendance.date.split(
                                                        '/'
                                                    )[2]}
                                            </Text>
                                        </Td>

                                        <Td>
                                            <Flex justify="end">
                                                <IconButton
                                                    size="xs"
                                                    icon={
                                                        <FiMoreHorizontal
                                                            size={12}
                                                        />
                                                    }
                                                />
                                            </Flex>
                                        </Td>
                                    </Tr>
                                )}
                                controls={(register) => (
                                    <Flex
                                        flex={1}
                                        justify="end"
                                        align="center"
                                        gap={3}
                                    >
                                        <Button
                                            size="lg"
                                            colorScheme="brand"
                                            disabled={
                                                watch('date')
                                                    ? convert(watch('date')) !==
                                                      date
                                                    : false
                                            }
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
                                filters={(data) => {
                                    return data.filter(
                                        (data) =>
                                            watch('date') &&
                                            data.date === convert(watch('date'))
                                    )
                                }}
                            />
                        </Card>
                    </GridItem>
                </Grid>
            </Flex>
        </Container>
    )
}

export default Dashboard
