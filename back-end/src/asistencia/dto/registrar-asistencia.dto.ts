import { IsNotEmpty, IsString } from 'class-validator';

export class RegistrarAsistenciaDto {
  @IsString()
  @IsNotEmpty()
  huellaToken: string;

  @IsString()
  @IsNotEmpty()
  lectorId: string;
}
