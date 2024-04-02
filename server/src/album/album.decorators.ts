import { ValidationOptions, ValidationArguments, buildMessage, registerDecorator } from 'class-validator';

export const VIDEO_ID_LENGTH = 11;
const VIDEO_ID_PATTERN = /^[-\w]+$/;

export function IsVideoId(validationOptions?: ValidationOptions) {

  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isVideoId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return typeof value === 'string' &&
            value.length === VIDEO_ID_LENGTH &&
            VIDEO_ID_PATTERN.test(value);
        },
        defaultMessage: buildMessage(
          () => `length must be ${VIDEO_ID_LENGTH} and only characters [A-Za-z0-9_-] are allowed`,
          validationOptions,
        ),
      },
    });
  };
};
