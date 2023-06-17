import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Container, Grid, GridItem, Spinner } from '@chakra-ui/react'
import Attendance from 'components/accounts/attedance'
import Details from 'components/accounts/details'
import Card from 'components/card'

const Account = () => {
    const { data: session } = useSession()
    const { data: user, isFetched: isUserFetched } = useQuery(
        ['user', session.user.id],
        () => api.get('/users', session.user.id)
    )

    if (!isUserFetched) {
        return (
            <Container>
                <Spinner color="brand.default" />
            </Container>
        )
    }

    return (
        <Container>
            <Grid gridTemplateColumns="1fr 384px" alignItems="start" gap={6}>
                <GridItem display="grid" gap={6}>
                    <Attendance user={user} />
                </GridItem>

                <GridItem display="grid" gap={6}>
                    <Details user={user} />
                </GridItem>
            </Grid>
        </Container>
    )
}

export default Account
