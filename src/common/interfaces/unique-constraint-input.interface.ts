import { BaseEntity, EntityTarget } from 'typeorm'

export interface IsUniqueConstraintInput {
  property: string
  entity: EntityTarget<typeof BaseEntity>
}
