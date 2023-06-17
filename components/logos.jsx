import { Flex, Icon } from '@chakra-ui/react'
import { FiFeather } from 'react-icons/fi'

export const Logo = ({ size }) => {
    return (
        <Flex
            bg="brand.default"
            justify="center"
            align="center"
            borderRadius="full"
            h={size ? size : 10}
            w={size ? size : 10}
        >
            <Icon as={FiFeather} boxSize={size ? size / 2 : 4} color="white" />
        </Flex>
    )
}

export const Google = ({ size }) => {
    return (
        <svg
            height={size ? size : 24}
            width={size ? size : 24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_14_430)">
                <path
                    d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9274 23.7663 12.2764Z"
                    fill="#4285F4"
                />
                <path
                    d="M12.2399 24.0008C15.4763 24.0008 18.2057 22.9382 20.1943 21.1039L16.3273 18.1055C15.2514 18.8375 13.8625 19.252 12.2443 19.252C9.11364 19.252 6.45922 17.1399 5.5068 14.3003H1.51636V17.3912C3.55347 21.4434 7.70265 24.0008 12.2399 24.0008V24.0008Z"
                    fill="#34A853"
                />
                <path
                    d="M5.50253 14.3003C4.99987 12.81 4.99987 11.1962 5.50253 9.70581V6.61487H1.51649C-0.18551 10.0056 -0.18551 14.0005 1.51649 17.3913L5.50253 14.3003V14.3003Z"
                    fill="#FBBC04"
                />
                <path
                    d="M12.2399 4.74966C13.9507 4.7232 15.6042 5.36697 16.8432 6.54867L20.2693 3.12262C18.0999 1.0855 15.2206 -0.034466 12.2399 0.000808666C7.70265 0.000808666 3.55347 2.55822 1.51636 6.61481L5.50239 9.70575C6.4504 6.86173 9.10923 4.74966 12.2399 4.74966V4.74966Z"
                    fill="#EA4335"
                />
            </g>
            <defs>
                <clipPath id="clip0_14_430">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}
