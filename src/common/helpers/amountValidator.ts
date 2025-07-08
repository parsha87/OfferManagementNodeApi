import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isPositiveNumberOrNull', async: false })
export class IsPositiveNumberOrNull implements ValidatorConstraintInterface {
  validate(value: string | null, args: ValidationArguments) {
    // If the value is null, it's considered valid
    if (value === null) {
      return true;
    }
    
    // Check if the value is a valid positive number
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) && parsedValue > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The value must be a positive number or null';
  }
}