import { IsEmail, IsString, MaxLength } from "class-validator";

export class CredentialsDto {
    @IsEmail()
    username!: string;

    @IsString()
    @MaxLength(50)
    password!: string;
}