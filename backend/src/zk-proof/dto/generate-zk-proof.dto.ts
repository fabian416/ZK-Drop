import { IsArray, IsString } from 'class-validator';

export class GenerateProofDto {
  @IsString()
  lat: string;

  @IsString()
  lon: string;

  @IsString()
  min_lat: string;

  @IsString()
  max_lat: string;

  @IsString()
  min_lon: string;

  @IsString()
  max_lon: string;

  @IsString()
  region_hash: string;

  @IsString()
  challenge: string;
  
  @IsString()
  nullifier: string;
}
