import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateRelaySessionDto {
    @IsString()
    @IsNotEmpty()
    value: string;
}