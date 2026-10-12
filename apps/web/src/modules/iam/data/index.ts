import { loginform, signupform } from "../interface";

export const loginForm: loginform[] = [
    {
        name:"email",
        type:"email",
        label:"Email",
        placeholder:"example@gmail.com"
    },
    {
        name:"password",
        type:"password",
        label:"Password",
        placeholder:"********"
    }
]
export const signupForm: signupform[] = [
    {
        name:"firstName",
        type:"text",
        label:"First Name",
        placeholder:"John"
    },
    {
        name:"lastName",
        type:"text",
        label:"Last Name",
        placeholder:"Doe"
    },
    {
        name:"email",
        type:"email",
        label:"Email",
        placeholder:"example@gmail.com"
    },
    {
        name:"password",
        type:"password",
        label:"Password",
        placeholder:"********"
    }
]