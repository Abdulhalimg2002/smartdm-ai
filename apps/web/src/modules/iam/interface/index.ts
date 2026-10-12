import { LoginFormValues } from "../schemas/login.schema";
import { RegisterFormValues } from "../schemas/register.schema";

export interface loginform{
    name:keyof LoginFormValues;
    type: "text" | "email" | "password";
    label: string;
    placeholder: string;
}
export interface signupform{
    name: keyof  RegisterFormValues;
    type: "text" | "email" | "password";
    label: string;
    placeholder: string;
}