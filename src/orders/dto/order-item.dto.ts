import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class OrderItemDTO{
    @IsNumber()
    @IsPositive()
    productId: number;

    @IsNumber()
    @IsPositive()
    quantity: number;

    @IsNumber()
    @IsNumber()
    @Type(()=> Number)
    price: number;
}