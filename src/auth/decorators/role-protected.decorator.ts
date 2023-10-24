import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../enums/meta-roles';

export const META_ROLES = 'roles'

export const RoleProtected = (...args: ValidRoles[]) => {



    return SetMetadata('roles', args)
};
