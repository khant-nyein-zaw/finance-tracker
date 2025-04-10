import { IsEmail, IsStrongPassword } from 'class-validator'
import { User } from 'src/common/entities/user.entity'
import { IsUnique } from 'src/common/validators/is-unique.validator'

export class RegisterDto {
  @IsEmail()
  @IsUnique(
    { entity: User, property: 'email' },
    { message: 'Email already exists' },
  )
  email: string

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string
}
