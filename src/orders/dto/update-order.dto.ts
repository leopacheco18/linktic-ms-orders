import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateOrderDto {
  @IsNumber()
  total?: number;

  @IsBoolean()
  status?: boolean;
}
