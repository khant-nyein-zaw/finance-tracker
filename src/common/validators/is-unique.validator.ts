import { Injectable } from '@nestjs/common'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator'
import { DataSource } from 'typeorm'
import { IsUniqueConstraintInput } from '../interfaces/unique-constraint-input.interface'

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: string, args?: ValidationArguments): Promise<boolean> {
    const { property, entity }: IsUniqueConstraintInput = args?.constraints[0]

    const column = property ?? args?.property

    const result = await this.dataSource
      .getRepository(entity)
      .createQueryBuilder()
      .where(`${column} = :value`, { value })
      .getExists()

    return !result
  }

  defaultMessage(args: ValidationArguments): string {
    const [property] = args.constraints
    return `${property} must be unique.`
  }
}

export function IsUnique(
  options: IsUniqueConstraintInput,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    })
  }
}
