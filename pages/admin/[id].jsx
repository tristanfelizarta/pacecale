import { Container, Grid, GridItem, Stat } from '@chakra-ui/react'
import Details from 'components/accounts/details'
import Card from 'components/card'

const Account = () => {
    return (
        <Container>
            <Grid templateColumns="1fr 384px" alignItems="start" gap={6}>
                <GridItem display="grid" gap={6}>
                    <Card></Card>
                </GridItem>

                <GridItem display="grid" gap={6}>
                    <Details />
                </GridItem>
            </Grid>
        </Container>
    )
}

export default Account
